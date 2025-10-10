/**
 * Mock RNG System
 *
 * TEMPORARY: Returns fixed random values for testing
 * Will be replaced by real RNGSystem in Phase 2.1
 *
 * Real spec: docs/spec/logic/09_rng_system.md
 */

/**
 * Mock RNG - returns fixed correction value
 * Real system: random(128-255 or 192-255) / 256
 */
export class MockRNG {
  /**
   * Get RNG correction for attacker (both attacking)
   * Real: 192-255/256 (約3~4/4)
   */
  getAttackerCorrection(): number {
    return 220 / 256; // Fixed ~0.86
  }

  /**
   * Get RNG correction for defender (both attacking)
   * Real: 192-255/256 (約3~4/4)
   */
  getDefenderCorrection(): number {
    return 210 / 256; // Fixed ~0.82
  }

  /**
   * Get RNG correction for first player (non-attack scenario)
   * Real: 192-255/256
   */
  getFirstPlayerCorrection(): number {
    return 225 / 256; // Fixed ~0.88
  }

  /**
   * Get RNG correction for second player (non-attack scenario)
   * Real: 128-255/256 (約2~4/4)
   */
  getSecondPlayerCorrection(): number {
    return 190 / 256; // Fixed ~0.74
  }
}
