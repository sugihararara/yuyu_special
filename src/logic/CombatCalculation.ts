/**
 * Combat Calculation System
 *
 * Core calculation engine determining success/failure of all actions using
 * the Four Core Stats system with multiple correction layers.
 *
 * Based on: docs/spec/logic/06_combat_calculation.md
 * Related: 018-基本仕様.md, 019-闘気補正.md, 020-バランス補正.md, 021-乱数補正.md
 *
 * Memory Addresses:
 * - 7E2800: First attacker success rate OR first defender evasion rate
 * - 7E2803: First attacker evasion rate OR first defender success rate
 * - 7E2810: Second attacker success rate
 * - 7E2813: Second attacker evasion rate
 * - 7E046C: First player hit/success judgment result
 * - 7E046E: Second player hit/success judgment result
 */

import type {
  JudgmentResult,
  CorrectionValues,
  CorrectedStats
} from '../types/BattleTypes';
import type { CharacterStats } from '../types/CharacterData';
import type { MoveStats } from './CharacterStatsSystem';

/**
 * Special modifier types
 */
export interface SpecialModifiers {
  poweredPunch: boolean;    // 気合いの入ったパンチ
  cleanHit: boolean;        // クリーンヒット
  powerUp: boolean;         // パンチ力UP buff
  spiritUp: boolean;        // 霊撃力UP buff
}

/**
 * Initiative state
 */
export interface InitiativeState {
  isSecond: boolean;           // 後手
  isCompleteSecond: boolean;   // 完全後手
}

/**
 * Combat Calculation System
 *
 * Implements the full correction pipeline:
 * Base → Touki × RNG × Balance × LowHP × Initiative × Special → Judgment
 */
export class CombatCalculation {
  // Judgment thresholds (in 256-based system)
  private readonly DIRECT_HIT_THRESHOLD = 192;    // 75% success needed
  private readonly GRAZE_THRESHOLD = 128;         // 50% success needed
  private readonly EVADE_THRESHOLD = 64;          // 25% success needed

  // Initiative penalties
  private readonly SECOND_PENALTY = 0.9;          // ~10% reduction
  private readonly COMPLETE_SECOND_PENALTY = 0.75; // Additional ×3/4

  // Special modifier bonuses
  private readonly POWERED_PUNCH_BONUSES = {
    success: 56,
    evasion: 32,
    power: 16,
  };

  private readonly CLEAN_HIT_BONUSES = {
    success: 32,
    evasion: 16,
    power: 16,
    balance: 48,
  };

  // Buff bonuses
  private readonly POWER_UP_CHANCE = 36 / 256;    // 14.1% for powered punch
  private readonly SPIRIT_UP_CHANCE = 16 / 256;   // 6.3% for clean hit

  /**
   * Calculate battle judgment for an action
   *
   * @param attackerStats - Attacker's base move stats
   * @param defenderStats - Defender's base move stats
   * @param attackerCorrections - Attacker's correction values
   * @param defenderCorrections - Defender's correction values
   * @param attackerCharStats - Attacker's character stats
   * @param defenderCharStats - Defender's character stats
   * @param initiative - Initiative state
   * @param attackerHP - Attacker's current HP (for low HP bonus)
   * @param defenderHP - Defender's current HP (for low HP bonus)
   * @returns Judgment result
   */
  calculateJudgment(
    attackerStats: MoveStats,
    defenderStats: MoveStats,
    attackerCorrections: CorrectionValues,
    defenderCorrections: CorrectionValues,
    attackerCharStats: CharacterStats,
    defenderCharStats: CharacterStats,
    initiative: InitiativeState,
    attackerHP: number,
    defenderHP: number
  ): JudgmentResult {
    // Check for special modifiers
    const attackerModifiers = this.rollSpecialModifiers(
      attackerCharStats,
      attackerHP,
      'attack'
    );
    const defenderModifiers = this.rollSpecialModifiers(
      defenderCharStats,
      defenderHP,
      'defense'
    );

    // Apply full correction pipeline to attacker's success rate
    let attackerSuccess = this.applyCorrectionPipeline(
      attackerStats.successRate,
      attackerCorrections,
      initiative,
      'success',
      attackerHP
    );

    // Apply special modifiers to attacker
    if (attackerModifiers.poweredPunch) {
      attackerSuccess += this.POWERED_PUNCH_BONUSES.success;
    }
    if (attackerModifiers.cleanHit) {
      attackerSuccess += this.CLEAN_HIT_BONUSES.success;
    }

    // Apply full correction pipeline to defender's evasion rate
    let defenderEvasion = this.applyCorrectionPipeline(
      defenderStats.evasionRate,
      defenderCorrections,
      { isSecond: !initiative.isSecond, isCompleteSecond: false },
      'evasion',
      defenderHP
    );

    // Apply special modifiers to defender
    if (defenderModifiers.poweredPunch) {
      defenderEvasion += this.POWERED_PUNCH_BONUSES.evasion;
    }
    if (defenderModifiers.cleanHit) {
      defenderEvasion += this.CLEAN_HIT_BONUSES.evasion;
    }

    // Calculate success differential
    const successDiff = attackerSuccess - defenderEvasion;

    // Determine judgment result based on thresholds
    if (successDiff >= this.DIRECT_HIT_THRESHOLD) {
      return 'direct_hit';  // 00: Complete success
    } else if (successDiff >= this.GRAZE_THRESHOLD) {
      return 'graze';       // 02: Half success
    } else if (successDiff >= this.EVADE_THRESHOLD) {
      return 'evade';       // 04: Complete evasion
    } else {
      return 'direct_fail'; // 06: Complete failure
    }
  }

  /**
   * Apply full correction pipeline to a base stat
   *
   * @param baseStat - Base stat value
   * @param corrections - Correction multipliers
   * @param initiative - Initiative state
   * @param statType - Type of stat (for initiative penalty)
   * @param currentHP - Current HP (for low HP bonus)
   * @returns Corrected stat value
   */
  applyCorrectionPipeline(
    baseStat: number,
    corrections: CorrectionValues,
    initiative: InitiativeState,
    statType: 'success' | 'evasion' | 'power' | 'balance',
    currentHP: number
  ): number {
    // Step 1: Apply basic corrections (touki, RNG, balance)
    let corrected = baseStat *
                   corrections.touki *
                   corrections.rng *
                   corrections.balance;

    // Step 2: Apply low HP bonus
    corrected *= corrections.lowHp;

    // Step 3: Apply initiative penalties
    corrected = this.applyInitiativePenalty(
      corrected,
      initiative,
      statType
    );

    return corrected;
  }

  /**
   * Apply initiative penalty
   *
   * @param stat - Current stat value
   * @param initiative - Initiative state
   * @param statType - Type of stat
   * @returns Stat with penalty applied
   */
  private applyInitiativePenalty(
    stat: number,
    initiative: InitiativeState,
    statType: 'success' | 'evasion' | 'power' | 'balance'
  ): number {
    // Initiative only affects success and evasion
    if (statType !== 'success' && statType !== 'evasion') {
      return stat;
    }

    // Apply 後手 (second) penalty
    if (initiative.isSecond) {
      stat *= this.SECOND_PENALTY;
    }

    // Apply 完全後手 (complete second) penalty
    if (initiative.isCompleteSecond) {
      stat *= this.COMPLETE_SECOND_PENALTY;
    }

    return stat;
  }

  /**
   * Roll for special modifiers (powered punch, clean hit)
   *
   * @param charStats - Character stats
   * @param currentHP - Current HP
   * @param context - Attack or defense context
   * @returns Special modifiers
   */
  private rollSpecialModifiers(
    charStats: CharacterStats,
    currentHP: number,
    context: 'attack' | 'defense'
  ): SpecialModifiers {
    // Calculate low HP bonus for special modifier chance
    const lowHPBonus = this.calculateLowHPBonus(currentHP);

    // Roll for powered punch
    const poweredPunchChance = charStats.poweredPunchRate + (lowHPBonus * 38 / 256);
    const poweredPunch = Math.random() < poweredPunchChance;

    // Roll for clean hit (only on attacks)
    const cleanHitChance = charStats.cleanHitRate + (lowHPBonus * 38 / 256);
    const cleanHit = context === 'attack' && Math.random() < cleanHitChance;

    // Check for buffs (simplified - would need buff state tracking)
    const powerUp = false;  // TODO: Track パンチ力UP buff
    const spiritUp = false; // TODO: Track 霊撃力UP buff

    return {
      poweredPunch,
      cleanHit,
      powerUp,
      spiritUp,
    };
  }

  /**
   * Calculate low HP bonus multiplier
   *
   * @param currentHP - Current HP (0-96)
   * @returns Bonus multiplier (0 to ~0.148)
   */
  private calculateLowHPBonus(currentHP: number): number {
    const maxHP = 96;

    // No bonus above 25% HP
    if (currentHP > maxHP * 0.25) {
      return 0;
    }

    // Linear scaling from 25% HP to 0 HP
    // Max bonus is 38/256 (~14.8%)
    const hpPercent = currentHP / maxHP;
    const bonusPercent = (0.25 - hpPercent) / 0.25; // 0 to 1

    return bonusPercent * (38 / 256);
  }

  /**
   * Calculate corrected stats with all modifiers applied
   * Used for getting final stats after all corrections
   *
   * @param baseStats - Base move stats
   * @param corrections - Correction values
   * @param charStats - Character stats
   * @param initiative - Initiative state
   * @param currentHP - Current HP
   * @param modifiers - Special modifiers
   * @returns Fully corrected stats
   */
  getCorrectedStats(
    baseStats: MoveStats,
    corrections: CorrectionValues,
    charStats: CharacterStats,
    initiative: InitiativeState,
    currentHP: number,
    modifiers?: SpecialModifiers
  ): CorrectedStats {
    // Apply corrections to each stat
    let success = this.applyCorrectionPipeline(
      baseStats.successRate,
      corrections,
      initiative,
      'success',
      currentHP
    );

    let evasion = this.applyCorrectionPipeline(
      baseStats.evasionRate,
      corrections,
      initiative,
      'evasion',
      currentHP
    );

    let power = this.applyCorrectionPipeline(
      baseStats.power,
      corrections,
      initiative,
      'power',
      currentHP
    );

    let balance = this.applyCorrectionPipeline(
      baseStats.balanceDrain,
      corrections,
      initiative,
      'balance',
      currentHP
    );

    // Apply special modifiers if provided
    if (modifiers) {
      if (modifiers.poweredPunch) {
        success += this.POWERED_PUNCH_BONUSES.success;
        evasion += this.POWERED_PUNCH_BONUSES.evasion;
        power += this.POWERED_PUNCH_BONUSES.power;
      }

      if (modifiers.cleanHit) {
        success += this.CLEAN_HIT_BONUSES.success;
        evasion += this.CLEAN_HIT_BONUSES.evasion;
        power += this.CLEAN_HIT_BONUSES.power;
        balance += this.CLEAN_HIT_BONUSES.balance;
      }

      if (modifiers.powerUp) {
        success += success * this.POWER_UP_CHANCE;
      }

      if (modifiers.spiritUp) {
        success += success * this.SPIRIT_UP_CHANCE;
      }
    }

    return {
      successRate: Math.floor(success),
      evasionRate: Math.floor(evasion),
      power: Math.floor(power),
      balanceDrain: Math.floor(balance),
    };
  }

  /**
   * Determine RNG scenario based on move types
   * Used to select appropriate RNG range
   *
   * @param attackerMoveType - Attacker's move type
   * @param defenderMoveType - Defender's move type
   * @returns RNG scenario name
   */
  determineRNGScenario(
    attackerMoveType: string,
    defenderMoveType: string
  ): 'both-attack' | 'mixed' | 'counter' | 'aerial-collision' {
    const attackTypes = ['punch', 'technique', 'spirit', 'aerial'];
    const defenseTypes = ['defense', 'guard', 'evasion'];

    const attackerAttacks = attackTypes.includes(attackerMoveType);
    const defenderAttacks = attackTypes.includes(defenderMoveType);
    const attackerDefends = defenseTypes.includes(attackerMoveType);
    const defenderDefends = defenseTypes.includes(defenderMoveType);

    // Both aerial = aerial collision
    if (attackerMoveType === 'aerial' && defenderMoveType === 'aerial') {
      return 'aerial-collision';
    }

    // Both attacking
    if (attackerAttacks && defenderAttacks) {
      return 'both-attack';
    }

    // One attack, one defense
    if ((attackerAttacks && defenderDefends) ||
        (attackerDefends && defenderAttacks)) {
      return 'mixed';
    }

    // Counter scenario (special case)
    // TODO: Implement proper counter detection
    return 'counter';
  }

  /**
   * Calculate low HP correction value
   * Returns a multiplier (1.0 to ~1.15)
   *
   * @param currentHP - Current HP
   * @param maxHP - Maximum HP (96)
   * @returns Low HP correction multiplier
   */
  calculateLowHPCorrection(currentHP: number, maxHP: number = 96): number {
    // No bonus above 25% HP
    if (currentHP > maxHP * 0.25) {
      return 1.0;
    }

    // Linear scaling from 25% HP to 0 HP
    // Max bonus is ~15%
    const hpPercent = currentHP / maxHP;
    const bonusPercent = (0.25 - hpPercent) / 0.25; // 0 to 1

    return 1.0 + (bonusPercent * 0.15);
  }
}