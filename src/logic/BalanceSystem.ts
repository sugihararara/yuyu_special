/**
 * Balance System (バランスシステム)
 *
 * Stamina/stability gauge system with knockdown mechanics.
 *
 * Based on: docs/spec/logic/04_balance_system.md
 * Related: 020-バランス補正.md, 018-基本仕様.md, 015-基本性能.md
 *
 * Memory Addresses:
 * - 7E0E24: 1P balance (0-255)
 * - 7E1024: 2P balance (0-255)
 * - 7E0EB8: 1P balance defense value
 * - 7E10B8: 2P balance defense value
 * - 7E0E74/75: 1P knockdown recovery (low/high bytes)
 * - 7E1074/75: 2P knockdown recovery (low/high bytes)
 */

import { BALANCE_TABLE, getBalanceMultiplier } from '../data/lookupTables/balanceTable';

/**
 * Balance state
 */
export type BalanceState = 'normal' | 'staggered' | 'knockdown';

/**
 * Knockdown recovery type
 */
export type RecoveryType = 'natural' | 'forced';

/**
 * Balance System
 *
 * Manages balance corrections, knockdown, and recovery mechanics.
 */
export class BalanceSystem {
  /**
   * Get balance correction multiplier using real lookup table
   *
   * @param balance - Balance damage (0-255)
   * @returns Multiplier (0.684 to 1.0)
   */
  getCorrection(balance: number): number {
    return getBalanceMultiplier(balance);
  }

  /**
   * Apply balance correction to a stat value
   *
   * @param baseValue - Base stat value (after RNG)
   * @param balance - Balance damage (0-255)
   * @returns Corrected value
   */
  applyCorrection(baseValue: number, balance: number): number {
    const multiplier = this.getCorrection(balance);
    return Math.floor(baseValue * multiplier);
  }

  /**
   * Check if balance causes knockdown
   *
   * @param balance - Balance damage
   * @returns True if balance ≥ 256 (knockdown)
   */
  checkKnockdown(balance: number): boolean {
    return balance >= 256;
  }

  /**
   * Get balance state
   *
   * @param balance - Balance damage (0-255)
   * @returns Balance state
   */
  getBalanceState(balance: number): BalanceState {
    if (balance >= 256) {
      return 'knockdown';
    } else if (balance >= 224) {
      return 'staggered'; // "よろめいた" displayed
    } else {
      return 'normal';
    }
  }

  /**
   * Add balance damage (caps at 255 unless knockdown)
   *
   * @param currentBalance - Current balance damage
   * @param damage - Balance damage to add
   * @returns New balance damage
   */
  addBalanceDamage(currentBalance: number, damage: number): number {
    const newBalance = currentBalance + damage;

    // Single hit ≥256 → immediate knockdown
    if (damage >= 256) {
      return 256;
    }

    // Accumulation → knockdown
    if (newBalance >= 256) {
      return 256;
    }

    // Cap at 255
    return Math.min(255, Math.max(0, newBalance));
  }

  /**
   * Reset balance after knockdown recovery
   *
   * @returns Balance value (0)
   */
  resetBalance(): number {
    return 0;
  }

  /**
   * Calculate knockdown recovery frames
   *
   * @param baseRecoveryFrames - Character's base recovery frames
   * @param buttonPresses - Number of button presses during knockdown
   * @returns Recovery frames remaining
   */
  calculateRecoveryFrames(baseRecoveryFrames: number, buttonPresses: number): number {
    // Each button press reduces 4F (no multi-button stacking)
    const reduction = buttonPresses * 4;
    return Math.max(0, baseRecoveryFrames - reduction);
  }

  /**
   * Get balance damage reduction for graze hit
   *
   * @param damage - Original balance damage
   * @returns Reduced damage (×1/2)
   */
  getGrazeBalanceDamage(damage: number): number {
    return Math.floor(damage / 2);
  }

  /**
   * Get balance percentage (0-100%)
   *
   * @param balance - Balance damage (0-255)
   * @returns Percentage (0-100)
   */
  getBalancePercentage(balance: number): number {
    return (balance / 255) * 100;
  }

  /**
   * Get performance percentage based on balance
   * Shows actual effectiveness penalty
   *
   * @param balance - Balance damage (0-255)
   * @returns Performance percentage (68.4%-100%)
   */
  getPerformancePercentage(balance: number): number {
    const multiplier = this.getCorrection(balance);
    return multiplier * 100;
  }

  /**
   * Check if balance correction applies
   * Balance ≤ 8: no correction
   *
   * @param balance - Balance damage
   * @returns True if correction applies
   */
  shouldApplyCorrection(balance: number): boolean {
    return balance > 8;
  }

  /**
   * Get recovery animation frames
   * After natural or forced recovery
   */
  getRecoveryAnimationFrames(): number {
    return 106; // Fixed recovery animation
  }

  /**
   * Calculate real balance based on character defense
   * From 015-基本性能.md
   *
   * @param balanceDefense - Character's balance defense multiplier (0.375 to 0.996)
   * @returns Real balance (257 to 683)
   */
  calculateRealBalance(balanceDefense: number): number {
    return Math.floor(256 / balanceDefense);
  }

  /**
   * Check if forced recovery should occur
   * Opponent uses specific move types during knockdown
   *
   * @param opponentMoveType - Opponent's move type
   * @returns True if forced recovery
   */
  shouldForceRecovery(opponentMoveType: string): boolean {
    const forcedRecoveryMoves = [
      '飛び',     // Aerial
      '伸び',     // Extension
      '接触',     // Contact
      '地上',     // Ground
      '衝撃波',   // Shockwave
      '返しガード', // Counter guard
      '相手即効',  // Opponent quick action
    ];

    return forcedRecoveryMoves.includes(opponentMoveType);
  }

  /**
   * Get balance scaling info for debugging
   * Shows key scaling points
   */
  getScalingInfo(): Array<{ balance: number; percentage: number; performance: number }> {
    const keyPoints = [0, 8, 9, 76, 179, 224, 255];
    return keyPoints.map((balance) => ({
      balance,
      percentage: this.getBalancePercentage(balance),
      performance: this.getPerformancePercentage(balance),
    }));
  }

  /**
   * Validate balance value
   *
   * @param balance - Balance value to validate
   * @returns True if valid (0-255)
   */
  isValidBalance(balance: number): boolean {
    return balance >= 0 && balance <= 255 && Number.isInteger(balance);
  }

  /**
   * Get the entire balance table for analysis
   * Useful for debugging and verification
   */
  getBalanceTable(): readonly number[] {
    return BALANCE_TABLE;
  }

  /**
   * Get minimum performance multiplier
   * At balance 255 (worst case)
   */
  getMinimumPerformance(): number {
    return this.getCorrection(255); // 175/256 = 0.684
  }

  /**
   * Get maximum performance multiplier
   * At balance 0 (full stamina)
   */
  getMaximumPerformance(): number {
    return this.getCorrection(0); // 1.0
  }
}
