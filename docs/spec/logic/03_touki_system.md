# Logic: Touki System (闘気)

## Description
Fighting spirit gauge system. Charges when holding D-pad, applies non-linear performance scaling to all combat stats.

## Related Docs
- `019-闘気補正.md` - 97-level correction formula and tables
- `018-基本仕様.md` - Touki charging mechanics
- `022-補助効果一覧.md` - Touki UP/DOWN buffs

## Memory Addresses
- `7E0E21` - 1P touki value (0-96)
- `7E1021` - 2P touki value (0-96)

## Core Mechanics

### Value Range
- Min: 0
- Max: 96
- **97 discrete levels** (0-96 inclusive)

### Correction Formula
```
If touki = 96 (MAX):
  corrected_value = base_value × 100 (in hex)

If touki < 96:
  corrected_value = base_value × touki_multiplier[touki]
```

### Touki Multiplier Table
97-level lookup table (see `019-闘気補正.md` for complete table)

**Key scaling points:**
- 30% touki (≈29/96) → ~50% performance
- 50% touki (48/96) → ~70% performance
- 62.5% touki (60/96) → ~80% performance
- 75% touki (72/96) → ~90% performance

### Charge Time
See Motion Frame System (`02_motion_frame.md`):
- Punch: 61F normal / 21F UP / 90F DOWN
- Defense: 73F / 24F / 107F
- Technique: 96F / 32F / 142F
- Spirit: 121F / 41F / 179F

### Visual States
- **Red**: Normal touki
- **Cyan**: Touki UP buff active
- **Purple**: Touki DOWN debuff active

### Affected Stats
Touki correction applies to all four core stats:
- Success rate (成功率)
- Evasion rate (回避率)
- Damage (威力)
- Balance damage (奪バランス)

## Dependencies
- Input system (D-pad hold detection)
- Buff system (touki UP/DOWN status)
- Combat calculation (applies multiplier to all stats)
- Motion frame system (charge timing)
- UI touki meter display

## Technical Notes
- Non-linear scaling curve (steep at low values, flattens at high)
- Multiplier stored as hex lookup table for exact values
- Affects both offensive and defensive performance
- Cannot charge during certain states (knockdown, red lamp)
