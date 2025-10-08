# Logic: Reward System (霊界水晶玉)

## Description
Crystal ball reward distribution system. Successful actions grant reiki orbs or items.

## Related Docs
- `023-霊界水晶玉報酬.md` - Reward types and probabilities
- `018-基本仕様.md` - Crystal ball mechanics, timing
- `014-画面説明.md` - Crystal ball UI

## Memory Addresses
No specific addresses in `027-メモリアドレス.md`
(Likely tracked in battle state, addresses TBD)

## Core Mechanics

### Reward Types
**Reiki Orbs (霊気玉):**
- 2 orbs (rare)
- 3 orbs
- 4 orbs
- 5 orbs
- 6 orbs (rare)

**Items:**
- 霊 大/小 (Rei - reiki restore)
- 気 大/小 (Ki - status buff)
- 愛 大/小 (Ai - HP/balance restore)

**Rarity:**
- Reiki 2 orbs: Very rare
- Items: Rare
- 愛大 (Ai Large): Extremely rare

### Distribution Timing
**Reiki Orbs:**
- Turn start + 26F: First orb delivered
- Every 8F after: +1 orb
- Example: 6 orbs = 26F + (5 × 8F) = 66F

**Items:**
- Turn start + 46F: Item delivered to stock

**Display Update:**
- Previous = Reiki: Turn start + 77F shows new contents
- Previous = Item: Turn start + 47F shows new contents

### Reward Condition
**Success Judgment Required:**
- Action must succeed (完全成功 or 半分成功)
- Failure (失敗) = no reward
- Evasion success also grants reward (depending on move type)

### Crystal Ball State
**Contents displayed before action:**
- Shows what you'll get if action succeeds
- Predetermined (not rolled after success)
- Changes after previous reward distributed

## Dependencies
- Combat calculation (success/failure判定)
- Reiki system (orb delivery)
- Item system (item delivery)
- Battle flow (timing management)
- RNG system (reward type selection)
- UI crystal ball display

## Technical Notes
- Reward type selected before action executes
- Frame-by-frame delivery (not instant)
- Display update delayed after previous reward
- Can see opponent's potential reward
- Strategic value: high-value rewards incentivize aggressive play
