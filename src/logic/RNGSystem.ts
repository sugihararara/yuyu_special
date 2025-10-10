/**
 * RNG System (乱数補正)
 *
 * Random number correction system adding variance to all combat calculations.
 *
 * Based on: docs/spec/logic/09_rng_system.md
 * Related: 021-乱数補正.md, 018-基本仕様.md
 *
 * Memory Addresses:
 * - 7E2801: First player success/evasion RNG correction
 * - 7E2804: Second player evasion/success RNG correction
 * - 7E2811: Second player success RNG correction (attack scenario)
 * - 7E2814: First player evasion RNG correction (attack scenario)
 */

import type { RNGRange } from '../types/BattleTypes';

/**
 * Action type classification for RNG determination
 */
export type ActionCategory = 'attack' | 'non-attack';

/**
 * RNG scenario determines which range to use
 */
export type RNGScenario =
  | 'both-attack'      // Both players attacking: 192-255 for both
  | 'mixed'            // One or both non-attack: 192-255 first, 128-255 second
  | 'counter'          // Counter established: same as mixed
  | 'aerial-collision'; // Aerial collision: special case

/**
 * RNG System
 *
 * Generates random correction values based on game scenario.
 * Multiplier applied: random_value / 256
 */
export class RNGSystem {
  /**
   * Get RNG correction for first player
   *
   * @param scenario - Battle scenario determining RNG range
   * @returns RNG multiplier (0.75 - 1.0 typically)
   */
  getFirstPlayerCorrection(scenario: RNGScenario = 'both-attack'): number {
    // First player always gets 192-255 range (約3~4/4)
    const range: RNGRange = { min: 192, max: 255 };
    return this.generateRandom(range);
  }

  /**
   * Get RNG correction for second player
   *
   * @param scenario - Battle scenario determining RNG range
   * @returns RNG multiplier (0.5 - 1.0 for mixed, 0.75 - 1.0 for both-attack)
   */
  getSecondPlayerCorrection(scenario: RNGScenario = 'both-attack'): number {
    let range: RNGRange;

    if (scenario === 'both-attack') {
      // Both attacking: 192-255 range (約3~4/4)
      range = { min: 192, max: 255 };
    } else {
      // Mixed/counter/aerial: 128-255 range (約2~4/4)
      // This is the defensive disadvantage!
      range = { min: 128, max: 255 };
    }

    return this.generateRandom(range);
  }

  /**
   * Get RNG correction for aerial collision check
   * Used for penetration calculation in aerial collisions.
   *
   * @returns RNG multiplier (0.5 - 1.0)
   */
  getAerialCollisionCorrection(): number {
    // Second player collision check: 128-255 range
    const range: RNGRange = { min: 128, max: 255 };
    return this.generateRandom(range);
  }

  /**
   * Determine battle scenario based on action types
   *
   * @param firstActionType - First player's action category
   * @param secondActionType - Second player's action category
   * @returns RNG scenario to use
   */
  determineScenario(
    firstActionType: ActionCategory,
    secondActionType: ActionCategory
  ): RNGScenario {
    // Scenario 1: Both players use attack moves
    if (firstActionType === 'attack' && secondActionType === 'attack') {
      return 'both-attack';
    }

    // Scenario 2: One or both use non-attack moves
    // (Mixed scenarios give second player worse RNG)
    return 'mixed';
  }

  /**
   * Classify action as attack or non-attack
   *
   * Attack moves (攻撃系):
   * - 飛び (Aerial)
   * - 伸び (Extension)
   * - 接触 (Contact)
   * - 地上 (Ground)
   * - 衝撃波 (Shockwave)
   *
   * Non-attack: Everything else (guards, evasions, buffs, etc.)
   *
   * @param moveType - Move type string
   * @returns Action category
   */
  classifyAction(moveType: string): ActionCategory {
    const attackMoves = ['飛び', '伸び', '接触', '地上', '衝撃波'];
    return attackMoves.includes(moveType) ? 'attack' : 'non-attack';
  }

  /**
   * Generate random value in range
   *
   * @param range - Min/max range
   * @returns Random multiplier (value / 256)
   */
  private generateRandom(range: RNGRange): number {
    // Generate random integer in [min, max] inclusive
    const randomValue = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;

    // Divide by 256 to get multiplier
    return randomValue / 256;
  }

  /**
   * Get raw random value (0-255) for debugging
   * Used for testing/verification against original game.
   *
   * @param range - Min/max range
   * @returns Raw random integer (before division by 256)
   */
  getRawRandom(range: RNGRange): number {
    return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
  }

  /**
   * Get expected RNG range for scenario
   * Useful for debugging and understanding variance.
   *
   * @param player - 'first' or 'second'
   * @param scenario - Battle scenario
   * @returns RNG range info
   */
  getExpectedRange(player: 'first' | 'second', scenario: RNGScenario): RNGRange {
    if (player === 'first') {
      // First player always 192-255
      return { min: 192, max: 255 };
    } else {
      // Second player depends on scenario
      if (scenario === 'both-attack') {
        return { min: 192, max: 255 };
      } else {
        return { min: 128, max: 255 };
      }
    }
  }

  /**
   * Calculate variance percentage for a range
   * Shows how much randomness affects the outcome.
   *
   * @param range - RNG range
   * @returns Variance as percentage string
   */
  calculateVariance(range: RNGRange): string {
    const minPercent = (range.min / 256) * 100;
    const maxPercent = (range.max / 256) * 100;
    const variance = maxPercent - minPercent;

    return `${minPercent.toFixed(1)}% - ${maxPercent.toFixed(1)}% (±${variance.toFixed(1)}%)`;
  }
}
