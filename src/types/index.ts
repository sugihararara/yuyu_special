/**
 * Type Definitions Index
 *
 * Central export for all game types
 */

// Game State
export type {
  PlayerState,
  BattleCommand,
  Item,
  BattleState,
  BattlePhase,
  Stage,
  CrystalBallReward,
} from './GameState';

// Player Input
export type {
  Direction,
  Button,
  InputState,
  CommandInput,
  ToukiInput,
  PlayerTurnInput,
  InputTiming,
} from './PlayerInput';

// Character Data
export type {
  CharacterId,
  CharacterStats,
  MoveData,
  MoveType,
  ActionPriority,
  MoveFrameData,
  CharacterData,
} from './CharacterData';

// Battle Mechanics
export type {
  JudgmentResult,
  CollisionResult,
  CorrectionValues,
  CorrectedStats,
  CombatContext,
  BattleOutcome,
  ToukiTable,
  BalanceTable,
  InitiativePenalty,
  RNGRange,
  DamageResult,
} from './BattleTypes';
