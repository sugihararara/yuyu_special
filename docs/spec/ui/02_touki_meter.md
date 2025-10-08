# Spec: Touki Meter (闘気メーター)

## UI Element
- **Class**: `.touki-meter`, `.touki-meter-fill`
- **Location**: Below HP bars
- **Description**: Fighting spirit gauge. Fills when holding D-pad. Affects combat command performance. Color changes based on buffs (red=normal, cyan=UP, purple=DOWN).

## Related Docs
- `014-画面説明.md` - ④闘気メーター explanation
- `019-闘気補正.md` - Touki correction formula and scaling (97 levels)
- `018-基本仕様.md` - Basic mechanics
- `022-補助効果一覧.md` - Buff/debuff effects

## Dependencies
- Input system (D-pad hold detection)
- Buff system (touki UP/DOWN)
- Combat command system (performance scaling)

## Technical Notes
- 97 levels of touki (0-96)
- Performance scales non-linearly: 30% touki ≈ 50% performance, 50% touki ≈ 70% performance
- P1 fills right-to-left, P2 fills left-to-right
- Correction formula: `value × touki_multiplier` (see 019-闘気補正.md for table)
