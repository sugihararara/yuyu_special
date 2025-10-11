/**
 * Damage Calculation System
 *
 * Calculates HP and balance damage based on move stats, corrections, and hit type.
 * Implements the full damage formula pipeline from the original game.
 *
 * Based on: docs/spec/logic/05_damage_calculation.md
 * Related: 018-基本仕様.md, 015-基本性能.md
 *
 * Memory Addresses:
 * - 7E0E1E: 1P HP fractional damage (DoT effects)
 * - 7E0E1F: 1P HP (integer)
 * - 7E101E: 2P HP fractional damage
 * - 7E101F: 2P HP (integer)
 * - 7E0E2A: 1P fractional damage accumulation
 * - 7E102A: 2P fractional damage accumulation
 * - 7E0EB0: 1P defense value
 * - 7E10B0: 2P defense value
 * - 7E0443: Damage (calculation buffer)
 * - 7E0446: Balance damage (calculation buffer)
 */

import type { JudgmentResult, DamageResult, CorrectionValues } from '../types/BattleTypes';
import type { CharacterStats } from '../types/CharacterData';

/**
 * Damage Calculation System
 *
 * Implements the full damage formula pipeline:
 * Base damage × Touki × RNG × Balance × Defense × Hit type = Final damage
 */
export class DamageCalculation {
  // Initial HP for all characters
  private readonly INITIAL_HP = 96;

  // Initial balance for all characters
  private readonly INITIAL_BALANCE = 256;

  // Hit type damage multipliers (HP)
  private readonly HP_MULTIPLIERS = {
    direct: 1.0,      // 100% damage
    graze: 0.25,      // 25% damage
    block: 0.375,     // 37.5% damage (successful block)
  };

  // Hit type damage multipliers (Balance)
  private readonly BALANCE_MULTIPLIERS = {
    direct: 1.0,      // 100% damage
    graze: 0.5,       // 50% damage
    block: 1.0,       // 100% damage (blocks still drain balance)
  };

  // Fractional damage accumulator (tracks sub-integer damage)
  private fractionalAccumulator: Map<string, number> = new Map();

  // DoT effect accumulator (for damage over time effects)
  private dotAccumulator: Map<string, number> = new Map();

  /**
   * Calculate HP and balance damage
   *
   * @param basePower - Move's base power stat
   * @param baseBalanceDrain - Move's base balance drain stat
   * @param corrections - All correction multipliers (touki, RNG, balance, lowHP)
   * @param judgmentResult - Hit/evade judgment
   * @param defenderStats - Defender's character stats
   * @param defenderId - Defender's player ID (for accumulator tracking)
   * @param defenderHp - Defender's current HP
   * @param defenderBalance - Defender's current balance
   * @returns Damage result with HP, balance, and status flags
   */
  calculateDamage(
    basePower: number,
    baseBalanceDrain: number,
    corrections: CorrectionValues,
    judgmentResult: JudgmentResult,
    defenderStats: CharacterStats,
    defenderId: string,
    defenderHp: number,
    defenderBalance: number
  ): DamageResult {
    // Determine hit type from judgment
    const hitType = this.getHitType(judgmentResult);

    // No damage on evade or attacker failure
    if (judgmentResult === 'evade' || judgmentResult === 'direct_fail') {
      return {
        hpDamage: 0,
        hpFractional: 0,
        balanceDamage: 0,
        hitType: 'block',
        knockdown: false,
        defeated: false,
      };
    }

    // Apply correction pipeline
    const correctedPower = this.applyCorrectionPipeline(basePower, corrections);
    const correctedBalanceDrain = this.applyCorrectionPipeline(baseBalanceDrain, corrections);

    // Apply defense multipliers
    const damageAfterDefense = correctedPower * defenderStats.defense;
    const balanceAfterDefense = correctedBalanceDrain * defenderStats.balanceDefense;

    // Apply hit type reductions
    const hpMultiplier = this.getHPMultiplier(hitType);
    const balanceMultiplier = this.getBalanceMultiplier(hitType);

    const finalHPDamage = damageAfterDefense * hpMultiplier;
    const finalBalanceDamage = balanceAfterDefense * balanceMultiplier;

    // Split into integer and fractional parts
    const hpInteger = Math.floor(finalHPDamage);
    const hpFractional = finalHPDamage - hpInteger;

    // Handle fractional accumulation
    const accumulatedFractional = this.updateFractionalAccumulator(
      defenderId,
      hpFractional
    );

    // Calculate total damage (integer + any overflow from accumulator)
    const totalHPDamage = hpInteger + accumulatedFractional;

    // Check special damage cases
    const isGrazeToZero = hitType === 'graze' && defenderHp - totalHPDamage <= 0;

    // Graze to 0 HP becomes direct hit (full balance damage)
    const actualBalanceDamage = isGrazeToZero
      ? Math.floor(balanceAfterDefense)
      : Math.floor(finalBalanceDamage);

    // Check knockdown (balance >= 256)
    const newBalance = defenderBalance + actualBalanceDamage;
    const knockdown = newBalance >= this.INITIAL_BALANCE;

    // Check defeated
    const defeated = defenderHp - totalHPDamage <= 0;

    // Special case: 0 HP + no-gauge-drain attack = KO
    const zeroHPKO = defenderHp === 0 && baseBalanceDrain === 0 &&
                     (judgmentResult === 'direct_hit' || judgmentResult === 'graze');

    return {
      hpDamage: totalHPDamage,
      hpFractional: hpFractional,
      balanceDamage: actualBalanceDamage,
      hitType: isGrazeToZero ? 'direct' : hitType,
      knockdown,
      defeated: defeated || zeroHPKO,
    };
  }

  /**
   * Apply the correction pipeline
   * Base stat × Touki × RNG × Balance × LowHP
   *
   * @param baseStat - Base stat value
   * @param corrections - Correction multipliers
   * @returns Corrected stat value
   */
  private applyCorrectionPipeline(
    baseStat: number,
    corrections: CorrectionValues
  ): number {
    return baseStat *
           corrections.touki *
           corrections.rng *
           corrections.balance *
           corrections.lowHp;
  }

  /**
   * Get hit type from judgment result
   */
  private getHitType(judgment: JudgmentResult): 'direct' | 'graze' | 'block' {
    switch (judgment) {
      case 'direct_hit':
        return 'direct';
      case 'graze':
        return 'graze';
      case 'evade':
      case 'direct_fail':
        return 'block';
    }
  }

  /**
   * Get HP damage multiplier for hit type
   */
  private getHPMultiplier(hitType: 'direct' | 'graze' | 'block'): number {
    return this.HP_MULTIPLIERS[hitType];
  }

  /**
   * Get balance damage multiplier for hit type
   */
  private getBalanceMultiplier(hitType: 'direct' | 'graze' | 'block'): number {
    return this.BALANCE_MULTIPLIERS[hitType];
  }

  /**
   * Update fractional damage accumulator
   * Returns integer overflow (if accumulator > 255)
   *
   * @param playerId - Player ID for tracking
   * @param fractional - Fractional damage to add
   * @returns Integer damage from overflow
   */
  private updateFractionalAccumulator(
    playerId: string,
    fractional: number
  ): number {
    const current = this.fractionalAccumulator.get(playerId) || 0;
    const newValue = current + fractional;

    // Check for overflow (> 255 in original game's byte storage)
    // Using 1.0 as our overflow point since we work with normalized values
    if (newValue >= 1.0) {
      this.fractionalAccumulator.set(playerId, newValue - 1.0);
      return 1; // Return 1 HP of integer damage
    }

    this.fractionalAccumulator.set(playerId, newValue);
    return 0;
  }

  /**
   * Calculate double KO tiebreaker
   * Lower excess damage wins
   *
   * @param p1Damage - Player 1's damage taken
   * @param p1HP - Player 1's remaining HP
   * @param p2Damage - Player 2's damage taken
   * @param p2HP - Player 2's remaining HP
   * @returns Winner ('p1', 'p2', or 'tie')
   */
  calculateDoubleKOWinner(
    p1Damage: number,
    p1HP: number,
    p2Damage: number,
    p2HP: number
  ): 'p1' | 'p2' | 'tie' {
    // Calculate excess damage (damage - remaining HP)
    const p1Excess = p1Damage - p1HP;
    const p2Excess = p2Damage - p2HP;

    // Lower excess damage wins
    if (p1Excess < p2Excess) return 'p1';
    if (p2Excess < p1Excess) return 'p2';

    // If tied, P1 wins (original game behavior)
    return 'p1';
  }

  /**
   * Reset fractional accumulators
   * Call this at battle start
   */
  resetAccumulators(): void {
    this.fractionalAccumulator.clear();
    this.dotAccumulator.clear();
  }

  /**
   * Get current fractional accumulator value
   * Used for debugging/display
   *
   * @param playerId - Player ID
   * @returns Current fractional damage accumulated
   */
  getFractionalAccumulator(playerId: string): number {
    return this.fractionalAccumulator.get(playerId) || 0;
  }

  /**
   * Process DoT (damage over time) effects
   * Called each frame for gradual HP changes
   *
   * @param playerId - Player ID
   * @param amount - DoT amount (positive = damage, negative = heal)
   * @returns Integer HP change from DoT overflow/underflow
   */
  processDotEffect(playerId: string, amount: number): number {
    const current = this.dotAccumulator.get(playerId) || 0;
    const newValue = current + amount;

    // Underflow (< 0) → HP -1
    if (newValue < 0) {
      this.dotAccumulator.set(playerId, newValue + 1.0);
      return -1;
    }

    // Overflow (> 255/1.0) → HP +1
    if (newValue >= 1.0) {
      this.dotAccumulator.set(playerId, newValue - 1.0);
      return 1;
    }

    this.dotAccumulator.set(playerId, newValue);
    return 0;
  }
}