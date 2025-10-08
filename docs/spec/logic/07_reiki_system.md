# Logic: Reiki System (霊気)

## Description
Spiritual energy gauge (25 cells). Required to use techniques and spirit attacks. Gained from crystal ball rewards.

## Related Docs
- `018-基本仕様.md` - Reiki mechanics, gain/loss rules
- `023-霊界水晶玉報酬.md` - Reiki reward distribution
- Character docs (024-048) - Individual move costs
- `013-行動種類一覧.md` - Action types and costs

## Memory Addresses
No specific memory address documented in `027-メモリアドレス.md`
(Likely tracked in character state block, address TBD)

## Core Mechanics

### Value Range
- Initial: 20
- Max: 25
- Displayed as 25 discrete cells

### Reiki Consumption
**Deduction triggers:**
- Using 技 (Technique) - varies by move
- Using 霊撃 (Spirit Attack) - varies by move
- Move canceled (but 成立 succeeded) - still costs reiki
- Opponent's absorption guard succeeds - attacker loses reiki
- 妖気吸収 (Youki Absorption) - special moves

**Costs vary per character/move** (see individual character docs)

### Reiki Gain
**Sources:**
- Crystal ball rewards (霊気玉 2-6)
- Own absorption guard succeeds
- 霊 item usage (大/小)

### Crystal Ball Timing
**Reiki Distribution:**
- Turn start + 26F: First reiki orb delivered
- Then every 8F: +1 reiki per delivery
- Example: 6 reiki orbs = 26F + (5 × 8F) = 66F total

### Insufficient Reiki
- Cannot select move if reiki < cost
- Input lamp shows unavailable moves (dimmed)
- Move becomes unselectable in command menu

## Dependencies
- Move/action system (reiki cost data)
- Crystal ball reward system (reiki gain)
- Input system (move availability checking)
- Item system (reiki item effects)
- Guard system (absorption mechanics)
- Character data (per-move reiki costs)
- UI reiki gauge display

## Technical Notes
- 25 cells = exact max value (not 0-indexed)
- Initial 20 allows immediate technique use
- Reiki delivered frame-by-frame, not instant
- Absorption guard creates reiki transfer between players
- Some characters have reiki-draining special abilities
