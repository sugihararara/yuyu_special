/**
 * Player Input Types
 *
 * Handles keyboard/network input abstraction
 */

/**
 * Direction inputs
 */
export type Direction = '→' | '←' | '↑' | '↓';

/**
 * Button inputs (SNES controller layout)
 */
export type Button = 'A' | 'B' | 'X' | 'Y';

/**
 * Raw input state (frame-by-frame)
 */
export interface InputState {
  // D-pad (for touki charging and command directions)
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;

  // Face buttons
  a: boolean;
  b: boolean;
  x: boolean;
  y: boolean;

  // Special (for item usage when not charging)
  start: boolean;
  select: boolean;
}

/**
 * Processed command input
 * Combines direction + button
 */
export interface CommandInput {
  direction: Direction;
  button: Button;
  timestamp: number;  // Frame when input occurred
}

/**
 * Touki charging input
 */
export interface ToukiInput {
  isCharging: boolean;
  direction: Direction | null;  // Which direction held for charging
  chargeFrames: number;         // How many frames held
}

/**
 * Complete player input for a turn
 */
export interface PlayerTurnInput {
  // Touki charge state
  toukiCharge: ToukiInput;

  // Command selection (when button released)
  command: CommandInput | null;

  // Item usage (when not charging)
  useItem: boolean;
}

/**
 * Input timing metadata
 */
export interface InputTiming {
  decisionFrame: number;        // Frame when action decided
  isFirst: boolean;             // 先手 (first)
  isSecond: boolean;            // 後手 (second)
  isCompleteSecond: boolean;    // 完全後手 (complete second)
}
