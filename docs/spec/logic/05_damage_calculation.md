# Logic: Damage Calculation System

## Description
Calculates HP and balance damage based on move stats, corrections, and hit type.

## Related Docs
- `018-基本仕様.md` - Damage mechanics, graze/hit rules
- `015-基本性能.md` - Character defense stats
- `019-闘気補正.md` - Touki correction
- `020-バランス補正.md` - Balance correction
- `021-乱数補正.md` - RNG correction

## Memory Addresses
- `7E0E1E` - 1P HP fractional damage (DoT effects)
- `7E0E1F` - 1P HP (integer)
- `7E101E` - 2P HP fractional damage
- `7E101F` - 2P HP (integer)
- `7E0E2A` - 1P fractional damage accumulation
- `7E102A` - 2P fractional damage accumulation
- `7E0EB0` - 1P defense value
- `7E10B0` - 2P defense value
- `7E0443` - Damage (calculation buffer)
- `7E0446` - Balance damage (calculation buffer)

## Core Mechanics

### HP System
- Initial: 96
- Defeat: ≤0
- Can survive at 0 HP under special conditions

### Damage Reduction by Hit Type
**HP Damage:**
- Direct hit: 100% damage
- Graze (かすり): 25% damage
- Block success (受ける): 37.5% damage

**Balance Damage:**
- Direct hit: 100% damage
- Graze: 50% damage

### Damage Formula Pipeline
```
1. Base damage (move's 威力 stat)
2. × Touki correction (attacker's touki)
3. × RNG correction (random 192-255/256 range)
4. × Character defense multiplier (defender's defense)
5. × Hit type reduction (100% / 25% / 37.5%)
6. = Final damage
```

### Defense Stats
Real HP = 96 / (defense multiplier)
- Range: 14.5% to 25.8% multiplier
- Characters: 372 to 664 effective HP
- Different in story mode vs. tournament mode

### Fractional Damage
**Accumulation (7E0E2A/102A):**
- Sub-integer damage accumulates here
- Overflow (>255) → HP -1
- **Not counted in double KO** tiebreaker

**DoT Effects (7E0E1E/101E):**
- Gradual HP change for DoT/HoT
- Underflow (<0) → HP -1
- Overflow (>255) → HP +1

### Double KO Tiebreaker
Both players KO same turn:
1. Lower **excess damage** wins
2. If tied → P1 wins

Excess damage = damage dealt - remaining HP

### Special Damage Cases
- Graze to 0 HP → becomes direct hit (演出 + full balance damage)
- Counter/Guard/Reflected aerial → graze演出死 possible
- 飛び(蝕み) graze to <0 → special direct hit animation
- 0 HP + no-gauge-drain attack hit/graze/block → KO
- Zero-damage moves (衝撃波) cannot KO at 0 HP

## Dependencies
- Combat calculation (four core stats)
- Touki system (damage multiplier)
- Balance system (balance damage)
- RNG system (damage variance)
- Character stats (defense values)
- Move data (base damage values)
- Hit detection (graze/hit/block判定)

## Technical Notes
- Damage calculated in hex with specific rounding
- Fractional accumulation separate from instant fractional
- Double KO uses excess damage, not fractional accumulation
- Defense multipliers differ between game modes
