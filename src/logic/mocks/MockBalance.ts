/**
 * Mock Balance System
 *
 * TEMPORARY: Simple balance correction
 * Will be replaced by real BalanceSystem in Phase 2.4
 *
 * Real spec: docs/spec/logic/04_balance_system.md
 * Real lookup table: src/data/lookupTables/balanceTable.ts
 */

/**
 * Mock Balance System - simple correction
 * Real system: uses 256-level lookup table (0.684 to 1.0)
 */
export class MockBalance {
  /**
   * Get balance correction multiplier
   * Real: balanceTable[balanceValue] (0-255)
   * Real range: 0.684 to 1.0 (minimum 175/256)
   */
  getCorrection(balanceValue: number): number {
    // Simplified linear: balance 0 = 1.0x, balance 255 = 0.68x
    const normalized = Math.min(255, Math.max(0, balanceValue)) / 255;
    return 1.0 - normalized * 0.32;
  }

  /**
   * Check if knockdown occurs
   * Real: balance > 255 causes knockdown
   */
  checkKnockdown(balanceValue: number): boolean {
    return balanceValue > 255;
  }

  /**
   * Get recovery frames
   * Real: Character-specific, reduced by button mashing (4F per press)
   */
  getRecoveryFrames(characterId: string, buttonPresses: number): number {
    // Simplified: 60 frames base, -4F per button
    const baseFrames = 60;
    const reduction = buttonPresses * 4;
    return Math.max(0, baseFrames - reduction);
  }
}
