/**
 * Mock Damage Calculation
 *
 * TEMPORARY: Simple damage calculation
 * Will be replaced by real DamageCalculation in Phase 2.6
 *
 * Real spec: docs/spec/logic/05_damage_calculation.md
 */

import type { JudgmentResult, DamageResult } from '../../types/BattleTypes';

/**
 * Mock Damage Calculation - simple subtraction
 * Real system: Complex defense multipliers, fractional damage, etc.
 */
export class MockDamage {
  /**
   * Calculate HP and balance damage
   * Real: Uses power, defense multipliers, hit type reductions
   */
  calculateDamage(
    power: number,
    balanceDrain: number,
    judgmentResult: JudgmentResult,
    defenderHp: number
  ): DamageResult {
    let hpDamage = 0;
    let balanceDamage = 0;
    let hitType: 'direct' | 'graze' | 'block' = 'direct';

    // Apply hit type multipliers
    switch (judgmentResult) {
      case 'direct_hit':
        hpDamage = power;
        balanceDamage = balanceDrain;
        hitType = 'direct';
        break;

      case 'graze':
        // Real: HP ×1/4, Balance ×1/2
        hpDamage = Math.floor(power / 4);
        balanceDamage = Math.floor(balanceDrain / 2);
        hitType = 'graze';
        break;

      case 'evade':
        // No damage
        hpDamage = 0;
        balanceDamage = 0;
        hitType = 'block';
        break;

      case 'direct_fail':
        // Attacker fails
        hpDamage = 0;
        balanceDamage = 0;
        hitType = 'block';
        break;
    }

    // Check knockdown (balance > 255)
    const knockdown = balanceDamage > 255;

    // Check defeated
    const defeated = defenderHp - hpDamage <= 0;

    return {
      hpDamage,
      hpFractional: 0, // Simplified: no fractional damage
      balanceDamage,
      hitType,
      knockdown,
      defeated,
    };
  }

  /**
   * Calculate defense multiplier
   * Real: Character-specific defense stats
   */
  getDefenseMultiplier(characterId: string): number {
    // Simplified: all characters have 1.0 defense
    return 1.0;
  }

  /**
   * Calculate balance defense multiplier
   * Real: Character-specific balance defense
   */
  getBalanceDefenseMultiplier(characterId: string): number {
    // Simplified: all characters have 1.0 balance defense
    return 1.0;
  }
}
