# Spec: HP Bar (体力メーター)

## UI Element
- **Class**: `.hp-bar`, `.hp-bar-inner`, `.hp-bar-yellow`, `.hp-bar-red`
- **Location**: Top of battlefield, left (P1) and right (P2)
- **Description**: Displays character health. Yellow bar shows max HP, red bar shows current HP. Flipped for P2.

## Related Docs
- `014-画面説明.md` - ①体力メーター explanation
- `015-基本性能.md` - Defense stats and real HP calculations
- `018-基本仕様.md` - Basic game mechanics

## Dependencies
- Character stats system (defense multipliers)
- Damage calculation system
- Battle state manager

## Technical Notes
- Real HP = 96 / (威力倍率)
- Different characters have different defense multipliers (14.5% to 25.8%)
- Battle ends when HP reaches 0
