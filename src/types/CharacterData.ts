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

  // Knockdown duration (ダウン時間) - base recovery time
  knockdownDuration: number;    // 257F to 630F
  knockdownSpeed: number;       // Recovery speed value (7E0EBA / 7E10BA)

  // Special hit rates
  poweredPunchRate: number;     // 気合いの入ったパンチ: 4.3% to 15.6%
  cleanHitRate: number;         // クリーンヒット: 3.5% to 8.6%

  // Evasion rates (回避率)
  blockRate: number;            // 受ける: 120-132
  guardRate: number;            // 上下ガード: 94-101
  dodgeRate: number;            // かわす: 112-136
  jumpRate: number;             // ジャンプ: 116-132
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
 * Move/Action data
 * Four core stats (四大性能) for each action
 */
export interface MoveData {
  // Identification
  id: MoveId;                   // e.g., "forward_a", "down_b"
  command: string;              // e.g., "→A", "↓B"
  name: string;                 // Move name (Japanese)
  nameEn?: string;              // English name

  // Type classification
  type: MoveType;
  priority: ActionPriority;

  // Four core stats
  successRate: number;          // 成功率
  evasionRate: number;          // 回避率
  power: number;                // 威力 (HP damage)
  balanceDrain: number;         // 奪バランス値 (balance damage)

  // Cost
  reikiCost: number;            // 0-25 (0 for punches/non-spirit moves)

  // Frame data (from 057-モーションフレーム.md)
  frames: MoveFrameData;
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
 * Frame data for a move
 * Based on 057-モーションフレーム.md
 */
export interface MoveFrameData {
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

  // Ground vs aerial
  isAerial?: boolean;
}

/**
 * Complete character data
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
