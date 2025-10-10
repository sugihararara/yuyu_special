/**
 * Touki System (闘気システム)
 *
 * Fighting spirit gauge system with non-linear performance scaling.
 *
 * Based on: docs/spec/logic/03_touki_system.md
 * Related: 019-闘気補正.md, 018-基本仕様.md, 022-補助効果一覧.md
 *
 * Memory Addresses:
 * - 7E0E21: 1P touki value (0-96)
 * - 7E1021: 2P touki value (0-96)
 */

import { TOUKI_TABLE, getToukiMultiplier } from '../data/lookupTables/toukiTable';

/**
 * Action type for touki charging
 */
export type ToukiActionType = 'punch' | 'defense' | 'technique' | 'spirit';

/**
 * Touki state modifier (buffs/debuffs)
 */
export type ToukiState = 'normal' | 'up' | 'down';

/**
 * Charge time configuration (in frames)
 * From 02_motion_frame.md
 */
interface ChargeTimeConfig {
  normal: number;  // Normal charge speed
  up: number;      // Touki UP buff (faster)
  down: number;    // Touki DOWN debuff (slower)
}

/**
 * Charge times for each action type
 * Frames required to reach MAX touki (96)
 */
const CHARGE_TIMES: Record<ToukiActionType, ChargeTimeConfig> = {
  punch: { normal: 61, up: 21, down: 90 },
  defense: { normal: 73, up: 24, down: 107 },
  technique: { normal: 96, up: 32, down: 142 },
  spirit: { normal: 121, up: 41, down: 179 },
};

/**
 * Touki System
 *
 * Manages touki corrections with real non-linear scaling.
 */
export class ToukiSystem {
  /**
   * Get touki correction multiplier using real lookup table
   *
   * @param touki - Touki value (0-96)
   * @returns Multiplier (0.0078 to 1.0)
   */
  getCorrection(touki: number): number {
    return getToukiMultiplier(touki);
  }

  /**
   * Apply touki correction to a base stat value
   *
   * @param baseValue - Base stat value
   * @param touki - Touki value (0-96)
   * @returns Corrected value
   */
  applyCorrection(baseValue: number, touki: number): number {
    const multiplier = this.getCorrection(touki);
    return Math.floor(baseValue * multiplier);
  }

  /**
   * Calculate touki charge over time
   *
   * @param currentTouki - Current touki value (0-96)
   * @param frames - Number of frames charged
   * @param actionType - Type of action being charged
   * @param state - Touki state (normal/up/down)
   * @returns New touki value (capped at 96)
   */
  chargeTouki(
    currentTouki: number,
    frames: number,
    actionType: ToukiActionType = 'punch',
    state: ToukiState = 'normal'
  ): number {
    // Get charge time for this action and state
    const chargeTime = CHARGE_TIMES[actionType][state];

    // Calculate charge rate (touki per frame)
    const chargeRate = 96 / chargeTime;

    // Calculate new touki
    const newTouki = currentTouki + frames * chargeRate;

    // Cap at 96
    return Math.min(96, Math.max(0, newTouki));
  }

  /**
   * Get frames required to reach MAX touki
   *
   * @param actionType - Type of action
   * @param state - Touki state
   * @returns Frames to MAX
   */
  getFramesToMax(
    actionType: ToukiActionType = 'punch',
    state: ToukiState = 'normal'
  ): number {
    return CHARGE_TIMES[actionType][state];
  }

  /**
   * Get touki percentage (0-100%)
   *
   * @param touki - Touki value (0-96)
   * @returns Percentage (0-100)
   */
  getToukiPercentage(touki: number): number {
    return (touki / 96) * 100;
  }

  /**
   * Get performance percentage based on touki
   * Shows actual effectiveness (non-linear)
   *
   * @param touki - Touki value (0-96)
   * @returns Performance percentage (0.78%-100%)
   */
  getPerformancePercentage(touki: number): number {
    const multiplier = this.getCorrection(touki);
    return multiplier * 100;
  }

  /**
   * Get touki color for UI display
   *
   * @param state - Touki state
   * @returns Color string
   */
  getToukiColor(state: ToukiState): 'red' | 'cyan' | 'purple' {
    switch (state) {
      case 'up':
        return 'cyan';
      case 'down':
        return 'purple';
      default:
        return 'red';
    }
  }

  /**
   * Calculate touki from charge frames and action type
   * Convenience method for battle flow
   *
   * @param frames - Frames charged
   * @param actionType - Action type
   * @param state - Touki state
   * @returns Touki value (0-96)
   */
  calculateToukiFromFrames(
    frames: number,
    actionType: ToukiActionType = 'punch',
    state: ToukiState = 'normal'
  ): number {
    return this.chargeTouki(0, frames, actionType, state);
  }

  /**
   * Get touki scaling info for debugging
   * Shows key scaling points
   */
  getScalingInfo(): Array<{ touki: number; percentage: number; performance: number }> {
    const keyPoints = [0, 29, 48, 60, 72, 96];
    return keyPoints.map((touki) => ({
      touki,
      percentage: this.getToukiPercentage(touki),
      performance: this.getPerformancePercentage(touki),
    }));
  }

  /**
   * Validate touki value
   *
   * @param touki - Touki value to validate
   * @returns True if valid (0-96)
   */
  isValidTouki(touki: number): boolean {
    return touki >= 0 && touki <= 96 && Number.isInteger(touki);
  }

  /**
   * Get the entire touki table for analysis
   * Useful for debugging and verification
   */
  getToukiTable(): readonly number[] {
    return TOUKI_TABLE;
  }
}
