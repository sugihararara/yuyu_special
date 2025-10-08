# Logic: RNG System (乱数補正)

## Description
Random number correction system adding variance to all combat calculations.

## Related Docs
- `021-乱数補正.md` - RNG formula and ranges
- `018-基本仕様.md` - RNG usage in judgment

## Memory Addresses
- `7E2801` - First player success/evasion RNG correction
- `7E2804` - Second player evasion/success RNG correction
- `7E2811` - Second player success RNG correction (attack scenario)
- `7E2814` - First player evasion RNG correction (attack scenario)

## Core Mechanics

### RNG Ranges
Multiplier applied: **random value / 256**

**Scenario 1: Both players use attack moves**
- First player: 192-255/256 (75% - 100%)
- Second player: 192-255/256 (75% - 100%)

**Scenario 2: One or both use non-attack moves**
- First player: 192-255/256 (75% - 100%)
- Second player: 128-255/256 (50% - 100%)

**Scenario 3: Counter (返し) established**
- First player: 192-255/256 (75% - 100%)
- Second player: 128-255/256 (50% - 100%)

**Scenario 4: Aerial collision (飛び同士相殺)**
- Second player success (collision check only): 128-255/256 (50% - 100%)

### Attack Move Classification
Attack moves (攻撃系):
- 飛び (Aerial)
- 伸び (Extension)
- 接触 (Contact)
- 地上 (Ground)
- 衝撃波 (Shockwave)

Non-attack moves: Everything else (guards, evasions, buffs, etc.)

### RNG Application
Applied in combat calculation pipeline:
```
base_stat × touki_correction × RNG × balance_correction = final_stat
```

### Variance Impact
**Both attack (192-255 range):**
- ~6% variance (約3~4/4 in original notation)
- Relatively stable, skill-based

**One non-attack (second player 128-255):**
- ~50% variance (約2~4/4 in original notation)
- Much more random, defensive disadvantage

## Dependencies
- Combat calculation (applies RNG correction)
- Move/action system (determines attack/non-attack type)
- Battle flow (determines first/second player)

## Technical Notes
- RNG value generated per turn (not per frame)
- Different memory addresses for different judgment contexts
- Second player gets worse RNG range in mixed scenarios
- Aerial collisions use special RNG for penetration calculation
- Values stored as raw 0-255 integers, divided by 256 when applied
