# Logic: Battle Flow System

## Description
Core turn-based battle system managing action priority, turn order, and timing phases.

## Related Docs
- `018-基本仕様.md` - 先手後手, 行動優先順位, turn mechanics
- `057-モーションフレーム.md` - Timing frames for all actions
- `053-ゲームの流れ.md` - Game flow overview
- `052-戦闘シーン展開順.md` - Battle scene sequence

## Memory Addresses
- `7E0E66` - 1P combat command recognition (00-13)
- `7E1066` - 2P combat command recognition (00-13)
- `7E046C` - First player hit/success judgment (00=direct hit, 02=graze, 04=evade, 06=fail)
- `7E046E` - Second player hit/success judgment
- `7E0470` - Aerial collision judgment (01-06 penetration levels)

## Core Mechanics

### Turn Phases
1. **Action Decision** - Players charge touki and select commands
2. **Preparation Phase** - Pre-action frames (varies by stage)
3. **Activation Phase** - Action executes
4. **Resolution Phase** - Damage/effects applied, crystal ball rewards

### Initiative System
- **先手 (First)**: Action decided during opponent's preparation
- **後手 (Second)**: Action decided during opponent's activation
  - -10% success/evasion rates
- **完全先手/完全後手 (Complete First/Second)**: Further penalties
  - Complete second: additional 3/4 multiplier to success OR evasion

### Action Priority
```
飛び = 衝撃波 > 伸び = 地上 > 接触 > その他
(Aerial = Shockwave > Extension = Ground > Contact > Others)
```

- Higher priority executes first regardless of initiative
- Same priority: first player executes first
- Direct hit cancels opponent's pending action
- Special cases: aerial contact vs ground moves

### Simultaneous Decision
- P1 and P2 input at same frame → P1 becomes first
- First player locks out second player for several frames after decision
- Hold button briefly to avoid input drop

## Dependencies
- Motion frame system (action timing)
- Input system (command detection)
- RNG system (judgment results)
- Damage calculation
- Reward distribution
