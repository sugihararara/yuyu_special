/**
 * Game State Types
 *
 * Based on memory addresses from 027-メモリアドレス.md
 * and game specs from docs/spec/logic/
 */

/**
 * Player state during battle
 *
 * Memory addresses:
 * - P1: 7E0E00-7E0EFF
 * - P2: 7E1000-7E10FF
 */
export interface PlayerState {
  // Core stats (7E0E1F / 7E101F)
  hp: number;                    // 0-96 (initial: 96)
  hpFractional: number;          // Sub-integer HP (7E0E1E / 7E101E)
  hpFractionalAccum: number;     // Damage accumulation (7E0E2A / 7E102A)

  // Gauges (7E0E21, 7E0E24 / 7E1021, 7E1024)
  touki: number;                 // 0-96 (97 levels)
  balance: number;               // 0-255
  reiki: number;                 // 0-25 cells

  // Airtime (7E0E5A/5B / 7E105A/5B)
  airtime: number;               // Frames in air (low+high bytes)

  // Knockdown state (7E0E74/75 / 7E1074/75)
  knockdownRecovery: number;     // Recovery progress (low+high bytes)
  isKnockedDown: boolean;

  // Current action (7E0E66 / 7E1066)
  currentCommand: BattleCommand | null;

  // Status effects
  toukiUp: boolean;              // Touki UP buff
  toukiDown: boolean;            // Touki DOWN buff
  balanceUp: boolean;            // Balance defense UP
  defensiveUp: boolean;          // Defense UP

  // Item stock
  itemStock: Item | null;

  // Character
  characterId: string;
  characterState: string;        // For transformations (e.g., "kurama1", "kurama2", "youko")
}

/**
 * Battle command types
 * Based on 7E0E66/7E1066 command recognition
 */
export type BattleCommand =
  | '→A' | '→B' | '→X' | '→Y'
  | '←A' | '←B' | '←X' | '←Y'
  | '↑A' | '↑B' | '↑X' | '↑Y'
  | '↓A' | '↓B' | '↓X' | '↓Y'
  | '霊撃力UP↓A' | '霊撃力UP↓B' | '霊撃力UP↓X' | '霊撃力UP↓Y';

/**
 * Item types
 */
export type Item =
  | '霊大' | '霊小'  // Reiki restore
  | '気大' | '気小'  // Status buffs
  | '愛大' | '愛小'; // HP/balance restore

/**
 * Complete battle state
 */
export interface BattleState {
  // Players
  player1: PlayerState;
  player2: PlayerState;

  // Battle flow
  turn: number;
  phase: BattlePhase;
  firstPlayer: 1 | 2 | null;    // Who is 先手

  // Stage
  stage: Stage;

  // Crystal ball (7E028x area)
  crystalBallReward: CrystalBallReward | null;

  // Combat calculation buffers (7E0443-7E0470)
  lastDamage: number;            // 7E0443
  lastBalanceDamage: number;     // 7E0446

  // Match result
  winner: 1 | 2 | null;
  matchOver: boolean;
}

/**
 * Battle phases
 */
export type BattlePhase =
  | 'input'          // Players charging touki / selecting commands
  | 'preparation'    // First player preparation
  | 'activation'     // Actions executing
  | 'resolution'     // Damage/effects applied
  | 'reward';        // Crystal ball distribution

/**
 * Stage types (affects preparation frame timing)
 */
export type Stage =
  | 'forest'         // 森 - standard
  | 'dark'           // 暗黒ドーム
  | 'guillotine'     // 断首台の丘
  | 'timegap';       // 時空の狭間

/**
 * Crystal ball rewards
 */
export type CrystalBallReward =
  | { type: 'reiki'; amount: 2 | 3 | 4 | 5 | 6 }
  | { type: 'item'; item: Item };
