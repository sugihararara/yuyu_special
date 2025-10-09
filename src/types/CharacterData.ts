/**
 * Character Data Types
 *
 * Based on 015-基本性能.md and character docs (024-048)
 */

/**
 * Character IDs
 */
export type CharacterId =
  | 'yusuke'        // 幽助
  | 'kuwabara'      // 桑原
  | 'kurama1'       // 蔵馬1
  | 'kurama2'       // 蔵馬2
  | 'youko'         // 妖狐
  | 'youko_kurama'  // 妖狐蔵馬
  | 'hiei'          // 飛影
  | 'hiei_dragon'   // 黒龍波吸収飛影
  | 'genkai'        // 幻海
  | 'genkai_young'  // 幻海(若)
  | 'suzuku'        // 鈴駒
  | 'touya'         // 凍矢
  | 'jin'           // 陣
  | 'shishiwakamaru'// 死々若丸
  | 'karasu'        // 鴉
  | 'karasu_unmasked' // マスク無し鴉
  | 'karasu_blonde' // 金髪鴉
  | 'bui'           // 武威
  | 'toguro_elder'  // 戸愚呂兄
  | 'toguro_younger'// 戸愚呂弟
  | 'toguro_80'     // 80%
  | 'toguro_100'    // 100%
  | 'gourmet'       // 神谷
  | 'makintaro'     // 刃霧
  | 'itsuki'        // 樹
  | 'sensui';       // 仙水

/**
 * Character base stats
 * Values from 015-基本性能.md
 * Stored in memory 7E0EB0-7E0EBE / 7E10B0-7E10BE
 */
export interface CharacterStats {
  // Defense (防御力) - affects real HP
  defense: number;              // Multiplier: 14.5% to 25.8% (as fraction)
  realHp: number;               // Calculated: 96 / defense

  // Balance defense (バランス防御力) - affects real balance
  balanceDefense: number;       // Multiplier: 37.5% to 99.6%
  realBalance: number;          // Calculated: 256 / balanceDefense

  // Airtime (滞空時間) - frames in air
  airtime: number;              // 150F to 543F

  // Knockdown duration (ダウン時間)
  knockdownDuration: number;        // Base (短縮無し): 257F to 630F
  knockdownDuration30PerSec: number; // With 30/sec mashing
  knockdownDuration60PerSec: number; // With 60/sec mashing
  knockdownSpeed: number;           // Recovery speed value (7E0EBA / 7E10BA)

  // Airtime touki (霊撃闘気) - How much touki can be charged while airborne
  airtimeTouki: number;             // In bars (本): 1.55, 1.86, etc.

  // Special hit rates
  poweredPunchRate: number;     // 気合いの入ったパンチ: 4.3% to 15.6%
  cleanHitRate: number;         // クリーンヒット: 3.5% to 8.6%
}

/**
 * Move identifier (AI-friendly and beginner-friendly naming)
 */
export type MoveId =
  // Forward direction
  | 'forward_a' | 'forward_b' | 'forward_x' | 'forward_y'
  // Back direction
  | 'back_a' | 'back_b' | 'back_x' | 'back_y'
  // Up direction
  | 'up_a' | 'up_b' | 'up_x' | 'up_y'
  // Down direction
  | 'down_a' | 'down_b' | 'down_x' | 'down_y'
  // Neutral (no direction)
  | 'neutral_a' | 'neutral_b' | 'neutral_x' | 'neutral_y'
  // Special moves
  | 'spirit_boost_down_a' | 'spirit_boost_down_b' | 'spirit_boost_down_x' | 'spirit_boost_down_y'
  // Character-specific special moves
  | string;

/**
 * Move/Action data (runtime combined data)
 * Four core stats (四大性能) for each action + frame data
 */
export interface MoveData extends MoveDefinition {
  // Frame data (from 057-モーションフレーム.md)
  // NEW: Now supports ground + aerial variants
  frames: MoveFrames;
}

/**
 * Move types (行動種類)
 */
export type MoveType =
  | 'punch'        // パンチ
  | 'defense'      // 防御
  | 'technique'    // 技
  | 'spirit'       // 霊撃
  | 'aerial'       // 飛び
  | 'extension'    // 伸び
  | 'contact'      // 接触
  | 'ground'       // 地上
  | 'shockwave'    // 衝撃波
  | 'guard'        // ガード
  | 'evasion'      // 回避
  | 'buff';        // バフ

/**
 * Action priority (行動優先順位)
 */
export type ActionPriority =
  | 'highest'      // 飛び = 衝撃波
  | 'high'         // 伸び = 地上
  | 'medium'       // 接触
  | 'low';         // その他

/**
 * Frame timing for a single variant (ground or aerial)
 * Based on 057-モーションフレーム.md
 */
export interface FrameTimings {
  // Preparation transition (準備移行F) - stage-dependent
  prepTransition: {
    forest: number;
    dark: number;
    guillotine: number;
    timegap: number;
  };

  // Preparation frames (準備F)
  preparation: number;

  // Activation frames (発動F)
  activation: number;
}

/**
 * Frame data for a move (ground + optional aerial)
 */
export interface MoveFrames {
  ground: FrameTimings;
  aerial?: FrameTimings;  // Optional aerial variant
}

/**
 * @deprecated Use MoveFrames instead (new split file structure)
 */
export interface MoveFrameData extends FrameTimings {
  // Ground vs aerial
  isAerial?: boolean;
}

/**
 * Stats file structure (stats.json)
 * Contains metadata + character stats
 */
export interface CharacterStatsFile {
  id: CharacterId;
  name: string;
  nameEn: string;
  canTransform: boolean;
  transformInto?: CharacterId;
  transformCondition?: string;

  stats: CharacterStats;
}

/**
 * Moves file structure (moves.json)
 * Array of move definitions (without frame data)
 */
export type CharacterMovesFile = MoveDefinition[];

/**
 * Move definition (without frame data)
 */
export interface MoveDefinition {
  // Identification
  id: MoveId;
  command: string;
  name: string;
  nameEn?: string;

  // Type classification
  type: MoveType;
  priority: ActionPriority;

  // Four core stats
  successRate: number;
  evasionRate: number;
  power: number;
  balanceDrain: number;

  // Cost
  reikiCost: number;
}

/**
 * Frames file structure (frames.json)
 * Object keyed by move ID
 */
export interface CharacterFramesFile {
  [moveId: string]: MoveFrames;
}

/**
 * Complete character data (runtime combined data)
 */
export interface CharacterData {
  id: CharacterId;
  name: string;
  nameEn: string;

  // Stats
  stats: CharacterStats;

  // Moveset
  moves: MoveData[];

  // Transformation data (if applicable)
  canTransform: boolean;
  transformInto?: CharacterId;
  transformCondition?: string;
}
