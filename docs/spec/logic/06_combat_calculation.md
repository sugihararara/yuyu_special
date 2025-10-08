# Logic: Combat Calculation System

## Description
Core calculation engine determining success/failure of all actions using the Four Core Stats system with multiple correction layers.

## Related Docs
- `018-基本仕様.md` - 四大性能 (four core stats), judgment system
- `019-闘気補正.md` - Touki correction
- `020-バランス補正.md` - Balance correction
- `021-乱数補正.md` - RNG correction
- `026-瀕死補正.md` - Low HP bonuses

## Memory Addresses
- `7E2800` - First attacker success rate OR first defender evasion rate
- `7E2803` - First attacker evasion rate OR first defender success rate
- `7E2810` - Second attacker success rate
- `7E2813` - Second attacker evasion rate
- `7E2802` - First player touki correction value
- `7E2805` - Second player touki correction value
- `7E2816` - First player balance correction value
- `7E2806` - Second player balance correction value
- `7E2801` - First player RNG correction value
- `7E2804` - Second player RNG correction value
- `7E046C` - First player hit/success judgment result
- `7E046E` - Second player hit/success judgment result

## Core Mechanics

### Four Core Stats (四大性能)
All actions have these base stats:
1. **成功率 (Success Rate)** - Likelihood of action succeeding
2. **回避率 (Evasion Rate)** - Likelihood of dodging opponent's attack
3. **威力 (Power)** - HP damage dealt
4. **奪バランス値 (Balance Drain)** - Balance damage dealt

### Correction Pipeline
```
1. Base stat (from move data)
2. × Touki correction (019-闘気補正)
3. × RNG correction (021-乱数補正)
4. × Balance correction (020-バランス補正)
5. × Low HP bonus (026-瀕死補正)
6. × Initiative penalty (if second/complete second)
7. × Special modifiers (clean hit, powered punch, etc.)
8. = Final stat for judgment
```

### Initiative Penalties
**後手 (Second):**
- ~10% reduction to success OR evasion

**完全後手 (Complete Second):**
- Additional ×3/4 multiplier
- Applied to success (if attacking) OR evasion (if defending)

### Judgment Results (7E046C/046E)
- `00` = 直撃 (Direct Hit / Complete Success)
- `02` = かすり (Graze / Half Success)
- `04` = 完全回避 (Complete Evasion / Failure)
- `06` = 直撃 (Direct Hit / Complete Failure)

### Special Modifiers
**気合いの入ったパンチ (Powered Punch):**
- Success +56, Evasion +32, Power +16
- Shorter animation frames
- Character-specific probability (4.3% - 15.6%)
- パンチ力UP: +36/256 (14.1%) chance

**クリーンヒット (Clean Hit - Spirit moves):**
- Success +32, Evasion +16, Power +16, Balance +48
- Message displayed on 飛び/伸び/接触
- Character-specific probability (3.5% - 8.6%)
- 霊撃力UP: +16/256 (6.3%) chance (most characters)

**Low HP Bonus (瀕死補正):**
- Max +38/256 (14.8%) to powered punch/clean hit chance
- Scaling based on HP remaining

## Dependencies
- Move/action data (base four stats)
- Touki system (correction values)
- Balance system (correction values)
- RNG system (correction values)
- Character stats (base rates, special probabilities)
- Battle flow (initiative determination)
- HP tracking (low HP bonuses)

## Technical Notes
- All calculations in hex/256-based values
- Correction layers multiply sequentially
- Some corrections affect success, some affect evasion (context-dependent)
- Memory addresses show intermediate calculation values
- Final judgment stored as 00/02/04/06 codes
