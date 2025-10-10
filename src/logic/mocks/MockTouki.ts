/**
 * Mock Touki System
 *
 * TEMPORARY: Simple touki correction
 * Will be replaced by real ToukiSystem in Phase 2.3
 *
 * Real spec: docs/spec/logic/03_touki_system.md
 * Real lookup table: src/data/lookupTables/toukiTable.ts
 */

/**
 * Mock Touki System - simple linear correction
 * Real system: uses 97-level lookup table (0.02 to 1.0)
 */
export class MockTouki {
  /**
   * Get touki correction multiplier
   * Real: toukiTable[toukiLevel] (0-96 levels)
   */
  getCorrection(toukiLevel: number): number {
    // Simplified linear: touki 0 = 0.5x, touki 96 = 1.0x
    const normalized = Math.min(96, Math.max(0, toukiLevel)) / 96;
    return 0.5 + normalized * 0.5;
  }

  /**
   * Calculate touki charge over time
   * Real: Different rates for パンチ/防御/技/霊撃
   */
  chargeTouki(
    currentTouki: number,
    frames: number,
    actionType: 'punch' | 'defense' | 'technique' | 'spirit'
  ): number {
    // Simplified: charge at 1 touki per 2 frames
    const chargeRate = 0.5;
    return Math.min(96, currentTouki + frames * chargeRate);
  }
}
