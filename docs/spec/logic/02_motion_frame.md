# Logic: Motion Frame System

## Description
**Critical game timing system** - defines how long each action takes, when attacks hit, turn order, and input windows. Not just visual animation, but the core timing engine the entire game runs on.

## Related Docs
- `057-モーションフレーム.md` - Complete frame data for all characters/moves
- `018-基本仕様.md` - Touki charge timing, action phases
- Character docs (024-048) - Individual character frame data

## Memory Addresses
- `7E0E5A/5B` - 1P airtime (low/high bytes)
- `7E105A/5B` - 2P airtime (low/high bytes)
- `7E0E74/75` - 1P knockdown recovery value (low/high bytes)
- `7E1074/75` - 2P knockdown recovery value (low/high bytes)

## Core Mechanics

### Touki Charge Frames (MAX)
Frames required to reach max touki:

| Action Type | Normal | Touki UP | Touki DOWN |
|-------------|--------|----------|------------|
| Punch | 61F | 21F | 90F |
| Defense | 73F | 24F | 107F |
| Technique | 96F | 32F | 142F |
| Spirit | 121F | 41F | 179F |

### Action Frame Structure
Each action has 3 phases:

1. **準備移行F (Preparation Transition)** - Stage-dependent startup
   - 森 (Forest) = standard
   - 暗 (Dark Dome) = varies
   - 断 (Guillotine Hill) = varies
   - 時 (Time Gap) = varies

2. **準備F (Preparation)** - Ready frames (opponent can still act)

3. **発動F (Activation)** - Execution frames (action committed)

### Frame Timing
- First action decision = Frame 1
- Time stop (5F) and lag frames excluded from counts
- Opponent can input during preparation phase
- Initiative determined by preparation phase timing

### Character-Specific Data
Each character has unique frame data for:
- Ground vs aerial versions of moves
- All 4 button types (A/B/X/Y) × 4 directions
- Special move variations
- Transformation states

## Dependencies
- Battle flow system (uses frame data for turn order)
- Input system (frame windows for command input)
- Touki system (charge timing)
- Character data (per-character frame tables)
- Animation system (visual sync with timing)

## Technical Notes
- Airtime affects recovery and vulnerability
- Button mashing speeds knockdown recovery (4F per button press, no stacking)
- Stage background changes frame timing for preparation phase
- Frame data is fundamental to ALL game timing, not optional
