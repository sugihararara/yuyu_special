/**
 * Mock Combat Calculation
 *
 * TEMPORARY: Simplified success/failure judgment
 * Will be replaced by real CombatCalculation in Phase 2.5
 *
 * Real spec: docs/spec/logic/06_combat_calculation.md
 */

import type { JudgmentResult, CorrectedStats } from '../../types/BattleTypes';

/**
 * Mock Combat Calculation - simple comparison
 * Real system: Complex correction pipeline with initiative penalties
 */
export class MockCombat {
  /**
   * Calculate battle judgment
   * Real: Uses success rate vs evasion rate with corrections
   */
  calculateJudgment(
    attackerStats: CorrectedStats,
    defenderStats: CorrectedStats,
    isFirst: boolean
  ): JudgmentResult {
    // Simplified: compare success rate vs evasion rate
    const attackPower = attackerStats.successRate * (isFirst ? 1.0 : 0.9);
    const defensePower = defenderStats.evasionRate;

    const diff = attackPower - defensePower;

    if (diff > 50) return 'direct_hit';
    if (diff > 0) return 'graze';
    if (diff > -50) return 'evade';
    return 'direct_fail';
  }

  /**
   * Apply corrections to base stats
   * Real: Base × Touki × RNG × Balance × LowHP × Initiative
   */
  applyCorrections(
    baseStat: number,
    toukiCorrection: number,
    rngCorrection: number,
    balanceCorrection: number
  ): number {
    // Simplified: multiply all corrections
    return baseStat * toukiCorrection * rngCorrection * balanceCorrection;
  }

  /**
   * Get mock base stats for a move
   * Real: Loaded from character data files
   */
  getMockMoveStats(move: string): CorrectedStats {
    // Simplified: return fixed stats
    return {
      successRate: 150,
      evasionRate: 120,
      power: 20,
      balanceDrain: 30,
    };
  }
}
