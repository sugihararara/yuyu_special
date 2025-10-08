# Logic: Character Stats System

## Description
Per-character base stats and properties affecting all combat calculations.

## Related Docs
- `015-基本性能.md` - All character base stats tables
- `016-キャラの呼称について.md` - Character naming conventions
- Character docs (024-048) - Individual character data
- `018-基本仕様.md` - Stat usage in formulas

## Memory Addresses
- `7E0EB0` - 1P defense value (character-specific)
- `7E10B0` - 2P defense value
- `7E0EB8` - 1P balance defense value
- `7E10B8` - 2P balance defense value
- `7E0EBA` - 1P knockdown recovery speed
- `7E10BA` - 2P knockdown recovery speed
- `7E0EBC` - 1P powered punch probability
- `7E10BC` - 2P powered punch probability
- `7E0EBE` - 1P clean hit probability
- `7E10BE` - 2P clean hit probability

## Character Base Stats

### 1. Defense (防御力)
**Formula:** Real HP = 96 / (defense multiplier)

**Range:** 14.5% to 25.8% multiplier = 372 to 664 effective HP

**Different in modes:**
- Story mode values (higher defense)
- Tournament mode values (lower defense)

### 2. Balance Defense (バランス防御力)
**Formula:** Real Balance = 256 / (balance drain multiplier)

**Range:** 37.5% to 99.6% multiplier = 257 to 683 effective balance

**Notable:**
- Hiei (黒龍波吸収): 37.5% (highest)
- Karasu (鴉): 99.6% (lowest - very fragile balance)

### 3. Airtime (滞空時間)
**Frames character stays airborne**

**Range:** 150F to 543F (1.24 to 4.49 touki bars)

**Affects:**
- Aerial evasion duration
- Vulnerability window
- Recovery timing

### 4. Knockdown Duration (ダウン時間)
**Base frames until natural recovery**

**Range:** 257F to 630F

**Modifiers:**
- Button mashing: -4F per press
- 30/s speed buff: ~3× faster recovery
- 60/s speed buff: ~5× faster recovery

### 5. Powered Punch Rate (気合いの入ったパンチ発生率)
**Probability of punch power-up**

**Range:** 4.3% to 15.6%

**Bonus:** パンチ力UP buff adds +14.1%

### 6. Clean Hit Rate (クリーンヒット発生率)
**Probability of spirit move power-up**

**Range:** 3.5% to 8.6%

**Bonus:** 霊撃力UP buff adds +6.3% (most characters)

### 7. Evasion Rates (回避率)
Four separate evasion stats per character:

**受ける (Block):** 120-132
**上下ガード (Up/Down Guard):** 94-101
**かわす (Dodge):** 112-136
**ジャンプ (Jump):** 116-132

## Character Transformations

### Transformation System
Certain conditions trigger character replacement:
- 蔵馬1 → 蔵馬2 → 妖狐蔵馬
- 飛影 → 黒龍波吸収飛影
- 幻海 → 幻海(若)
- 鴉 → マスク無し鴉 → 金髪鴉
- 戸愚呂弟 → 80% → 100%

**On transformation:**
- ALL stats change (not just visuals)
- Move set changes
- Defense/balance/airtime/etc. all updated
- Some transformations don't change graphics (飛影 black dragon)

## Dependencies
- Combat calculation (uses all stat values)
- Damage calculation (defense values)
- Balance system (balance defense)
- Motion frame system (airtime, knockdown)
- Character data files (stat tables)
- Transformation system (stat switching)

## Technical Notes
- Stats loaded into memory addresses at battle start
- Transformation swaps entire stat block
- Tournament mode uses different defense multipliers
- Some characters have story-mode-only buffs
- Stats are fixed per character (no leveling)
