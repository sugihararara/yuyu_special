# Logic: Balance System (バランス)

## Description
Stamina/stability gauge. Taking balance damage increases value; reaching 256 causes knockdown. Low balance reduces performance.

## Related Docs
- `018-基本仕様.md` - Balance mechanics, knockdown states
- `020-バランス補正.md` - 256-level correction formula
- `015-基本性能.md` - Character balance defense stats

## Memory Addresses
- `7E0E24` - 1P balance (0-255)
- `7E1024` - 2P balance (0-255)
- `7E0EB8` - 1P balance defense value
- `7E10B8` - 2P balance defense value
- `7E0E74/75` - 1P knockdown recovery (low/high bytes)
- `7E1074/75` - 2P knockdown recovery (low/high bytes)
- `7E0EBA` - 1P knockdown recovery speed
- `7E10BA` - 2P knockdown recovery speed
- `7E0446` - Balance damage (calculation buffer)

## Core Mechanics

### Value Range
- Initial: 0
- Max before knockdown: 255
- Knockdown trigger: ≥256

### Balance States
- **0-223**: Normal (decreasing performance)
- **224-255**: "よろめいた" (Staggered) displayed
- **256+**: Knockdown (ダウン)

### Knockdown System
**During Knockdown:**
- Red lamp active
- Cannot act
- Duration varies by character (150F - 630F, see `015-基本性能.md`)
- Button mashing: 4F reduction per press (no multi-button stacking)
- Forced recovery: opponent uses 飛び/伸び/接触/地上/衝撃波/返しガード/相手即効

**Recovery:**
- Natural recovery: balance fully restored, 106F recovery animation
- Forced recovery: balance fully restored next turn
- Recovery animation can be canceled by opponent's preparation phase

### Balance Correction Formula
```
If balance ≤ 8:
  corrected_value = rng_corrected_value

If balance ≥ 9:
  corrected_value = rng_corrected_value × balance_multiplier[balance]
```

### Balance Multiplier Table
256-level lookup table (see `020-バランス補正.md`)

**Key scaling points:**
- Balance 70% → ~80% performance
- Balance 0% → ~68% performance (minimum)
- Steep correction until 30% balance lost, then flattens

### Performance Penalty
**Applies to success OR evasion rate** (not both):
- If opponent uses attack move (飛び/伸び/接触/地上/衝撃波): reduces **evasion**
- If opponent uses other move: reduces **success**
- Exception: Counter (返し) - defender loses evasion, attacker loses success

Max reduction: **175/256 (68.4%)** at balance 255

### Damage Reduction
- Graze (かすり): balance damage × 1/2

### Character Stats
Real balance = 256 / (balance defense multiplier)
- Range: 37.5% to 99.6% multiplier
- Characters: 257 to 683 effective balance

## Dependencies
- Damage calculation (balance damage)
- Combat calculation (performance penalties)
- Character stats (balance defense)
- Input system (button mash detection)
- Knockdown state management
- UI balance meter display

## Technical Notes
- Balance persists between turns (doesn't reset)
- Can still take balance damage during knockdown or with 気大 buff
- Single hit ≥256 balance damage → knockdown even if not accumulating
- Single hit 224-255 damage → "よろめいた" message even if not accumulating
