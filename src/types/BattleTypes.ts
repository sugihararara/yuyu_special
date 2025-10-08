/**
 * Battle Mechanics Types
 *
 * Combat calculations, judgments, and correction systems
 * Based on docs/spec/logic/06_combat_calculation.md
 */

/**
 * Hit/Success judgment result
 * Memory: 7E046C / 7E046E
 */
export type JudgmentResult =
  | 'direct_hit'      // 00: 直撃 (complete success)
  | 'graze'           // 02: かすり (half success)
  | 'evade'           // 04: 完全回避 (failure/evaded)
  | 'direct_fail';    // 06: 直撃 (complete failure)

/**
 * Aerial collision result
 * Memory: 7E0470
 */
export type CollisionResult =
  | 'first_complete'   // 01: 先手完全貫通
  | 'first_reduced'    // 02: 先手減衰貫通
  | 'cancel'           // 03: 打ち消し合う
  | 'both_reduced'     // 04: 両方減衰貫通
  | 'second_reduced'   // 05: 後手減衰貫通
  | 'second_complete'; // 06: 後手完全貫通

/**
 * Correction multipliers
 * Used in calculation pipeline: Base × Touki × RNG × Balance × LowHP
 */
export interface CorrectionValues {
  touki: number;        // From touki table (0.02 to 1.0)
  rng: number;          // Random (0.5 to 1.0, depending on scenario)
  balance: number;      // From balance table (0.68 to 1.0)
  lowHp: number;        // Low HP bonus (1.0 to ~1.15)
}

/**
 * Four core stats after corrections applied
 * Memory: 7E2800-7E2816 (calculation buffers)
 */
export interface CorrectedStats {
  successRate: number;
  evasionRate: number;
  power: number;
  balanceDrain: number;
}

/**
 * Combat calculation context
 * All data needed to calculate battle outcome
 */
export interface CombatContext {
  // Players
  firstPlayer: {
    stats: CorrectedStats;
    move: string;
    moveType: string;
    isFirst: boolean;
    isCompleteFirst: boolean;
  };

  secondPlayer: {
    stats: CorrectedStats;
    move: string;
    moveType: string;
    isSecond: boolean;
    isCompleteSecond: boolean;
  };

  // Special modifiers
  firstPoweredPunch: boolean;   // 気合いの入ったパンチ
  firstCleanHit: boolean;       // クリーンヒット
  secondPoweredPunch: boolean;
  secondCleanHit: boolean;
}

/**
 * Battle outcome for a turn
 */
export interface BattleOutcome {
  // Judgment results
  firstPlayerResult: JudgmentResult;
  secondPlayerResult: JudgmentResult;

  // Collision (if applicable)
  collision: CollisionResult | null;

  // Damage dealt
  firstPlayerDamage: {
    hp: number;
    hpFractional: number;
    balance: number;
  };

  secondPlayerDamage: {
    hp: number;
    hpFractional: number;
    balance: number;
  };

  // Effects
  firstPlayerKnockedDown: boolean;
  secondPlayerKnockedDown: boolean;

  firstPlayerActionCanceled: boolean;
  secondPlayerActionCanceled: boolean;

  // Rewards
  firstPlayerReward: boolean;   // Gets crystal ball?
  secondPlayerReward: boolean;
}

/**
 * Touki correction table (97 levels)
 * Based on 019-闘気補正.md
 */
export type ToukiTable = number[]; // 97 values: 0.02 to 1.0

/**
 * Balance correction table (256 levels)
 * Based on 020-バランス補正.md
 */
export type BalanceTable = number[]; // 256 values: 0 to 1.0

/**
 * Initiative penalties
 */
export interface InitiativePenalty {
  isSecond: boolean;              // 後手: ~10% reduction
  isCompleteSecond: boolean;      // 完全後手: additional ×3/4
  penaltyMultiplier: number;      // Combined multiplier
}

/**
 * RNG range configuration
 * Based on 021-乱数補正.md
 */
export interface RNGRange {
  min: number;                    // 128 or 192
  max: number;                    // 255
  // Actual value: random(min, max) / 256
}

/**
 * Damage calculation result
 */
export interface DamageResult {
  hpDamage: number;               // Integer damage
  hpFractional: number;           // Sub-integer damage
  balanceDamage: number;          // Balance damage

  hitType: 'direct' | 'graze' | 'block';
  knockdown: boolean;
  defeated: boolean;
}
