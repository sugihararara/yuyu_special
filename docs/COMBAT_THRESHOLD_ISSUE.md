# Combat Threshold Issue - Investigation Notes

**Date**: 2025-10-11
**Status**: Phase 2.5 & 2.6 Complete, but thresholds need refinement
**Priority**: Medium - System works but may not match original game balance

---

## 1. What is the Problem?

The combat judgment system is **working correctly** in terms of calculation flow, but the **judgment thresholds are empirically adjusted** rather than based on the original game's exact values.

### Current Behavior:
- All attacks were initially resulting in `direct_fail` (complete failure)
- After adjustment, we now see a mix of outcomes: `direct_hit`, `graze`, `evade`, `direct_fail`
- However, the threshold values (30, 5, -15) were **manually set based on observed stat ranges**, not reverse-engineered from the original game

### Why This Matters:
The game might be:
- **Too easy** (too many hits landing) if thresholds are too low
- **Too hard** (too many misses) if thresholds are too high
- **Not matching the original game's balance** and feel

---

## 2. Where is the Wrong Code?

### File: `src/logic/CombatCalculation.ts`

**Lines 52-57**: The threshold constants
```typescript
// Judgment thresholds (relative to corrected stats)
// These thresholds work with stats after all corrections are applied
// Based on typical corrected stat ranges of 20-100
private readonly DIRECT_HIT_THRESHOLD = 30;     // Large advantage needed
private readonly GRAZE_THRESHOLD = 5;           // Small advantage needed
private readonly EVADE_THRESHOLD = -15;         // Small disadvantage
```

**Lines 151-169**: The judgment logic
```typescript
// Calculate success differential
const successDiff = attackerSuccess - defenderEvasion;

// Determine judgment result based on thresholds
if (successDiff >= this.DIRECT_HIT_THRESHOLD) {
  return 'direct_hit';  // 00: Complete success
} else if (successDiff >= this.GRAZE_THRESHOLD) {
  return 'graze';       // 02: Half success
} else if (successDiff >= this.EVADE_THRESHOLD) {
  return 'evade';       // 04: Complete evasion
} else {
  return 'direct_fail'; // 06: Complete failure
}
```

### The Core Issue:
The problem is that after applying all corrections (touki × RNG × balance × lowHP × initiative), the stats are in a **much smaller range** than the original 256-based system:

- **Original spec implies**: Thresholds around 192, 128, 64 (for 256-based system)
- **Actual corrected stats**: Range from ~20 to ~125
- **Current thresholds**: 30, 5, -15 (empirically adjusted)

### Debug Output Example:
```
Combat Debug:
  Attacker Success: 70.31
  Defender Evasion: 60.34
  Success Diff: 9.97
  Thresholds: Direct=30, Graze=5, Evade=-15
```

---

## 3. What Documentation Should Be Read?

### Primary Sources:

1. **`docs/spec/logic/06_combat_calculation.md`**
   - English specification of combat calculation
   - Lines 56-61: Judgment result codes (00/02/04/06)
   - Lines 88-93: Technical notes about 256-based calculations
   - **Missing**: Exact threshold formulas

2. **`docs/spec_from_html/yuyuz_md/018-基本仕様.md`** (Japanese original)
   - Lines 151-161: 四大性能 (Four Core Stats) section
   - Lines 29-34: 後手 (initiative penalty) mechanics
   - Lines 49-54: 乱数 (RNG) ranges
   - **Missing**: Exact judgment threshold formulas

3. **Related documentation to check**:
   - `019-闘気補正.md` - Touki correction (how stats scale)
   - `020-バランス補正.md` - Balance correction (how stats scale)
   - `021-乱数補正.md` - RNG correction (how stats scale)
   - `026-瀕死補正.md` - Low HP bonuses

### What We're Looking For:
We need to find **the exact formula** or **threshold values** that determine:
- When `成功率 - 回避率` (success - evasion) results in:
  - `00` 直撃 (direct hit)
  - `02` かすり (graze)
  - `04` 完全回避 (evade)
  - `06` 直撃失敗 (direct fail)

### Possible Locations:
- Memory address documentation: `027-メモリアドレス.md`
- Combat system deep-dive pages
- Character-specific pages (024-048) might have examples
- Assembly code analysis (if available)

---

## 4. Additional Useful Information

### Current System Architecture:

```
BattleFlow.ts (orchestrator)
  └─> CombatCalculation.ts (judgment) ← THE ISSUE IS HERE
      ├─> Uses: CharacterStatsSystem (base stats)
      ├─> Uses: ToukiSystem (correction)
      ├─> Uses: BalanceSystem (correction)
      ├─> Uses: RNGSystem (correction)
      └─> Calculates: success - evasion differential
          └─> Applies thresholds ← NEEDS REVERSE-ENGINEERING
```

### Test Case Data (from battle test):

Turn 3 example:
```
Attacker Success: 70.31
Defender Evasion: 60.34
Success Diff: 9.97
Result: evade (with current thresholds)
```

With original 256-based thresholds (192, 128, 64):
```
9.97 < 64 → direct_fail
```

With adjusted thresholds (30, 5, -15):
```
9.97 >= 5 but < 30 → graze or evade (depending on exact value)
```

### Stat Ranges After Corrections:
- **Base stats**: 0-255 (from character data)
- **After touki** (×0.02 to ×1.0): 0-255
- **After RNG** (×0.75 to ×1.0): 0-255
- **After balance** (×0.68 to ×1.0): 0-173
- **After all corrections**: Typically **20-125**

This is why the 256-based thresholds don't work directly!

### Possible Solutions:

1. **Keep empirical thresholds** and adjust based on playtesting
2. **Find original threshold formulas** from Japanese wiki
3. **Reverse-engineer from gameplay videos** of the original game
4. **Analyze memory dumps** if available
5. **Try different threshold ratios** (e.g., based on % of max corrected stats)

### Testing Command:
```bash
npm run dev
# Visit http://localhost:3002
# Click "Run Battle Test" button
# Check console for debug output
```

### Files Involved:
- `src/logic/CombatCalculation.ts` - Main judgment logic
- `src/logic/BattleFlow.ts` - Calls combat calculation
- `src/game.ts` - Battle test functionality
- `docs/spec/logic/06_combat_calculation.md` - Specification

### Next Steps:
1. Search Japanese wiki for more detailed combat mechanics
2. Look for memory address documentation showing threshold values
3. Check if there are gameplay videos with damage numbers visible
4. Consider creating a tool to compare our results vs expected results
5. Playtesting with adjusted thresholds to find the "sweet spot"

---

## Questions to Answer:

1. **What are the exact numerical thresholds in the original game?**
   - Is it a simple comparison? (e.g., diff >= 64)
   - Or a percentage-based formula? (e.g., diff >= attackerSuccess * 0.3)
   - Or something else entirely?

2. **Are thresholds constant or dynamic?**
   - Do they change based on game state?
   - Are they affected by character, stage, or other factors?

3. **How do the memory addresses relate to the thresholds?**
   - `7E046C` / `7E046E` store the result (00/02/04/06)
   - But what address stores the success differential?
   - What address stores the threshold values?

4. **Are there any rounding or truncation effects?**
   - The original game uses hex/256-based values
   - Are there precision losses we're not accounting for?

---

## Status Summary:

✅ **Working**:
- Combat calculation flow is correct
- All corrections are properly applied
- Judgment results are being generated

⚠️ **Uncertain**:
- Threshold values are empirically set, not reverse-engineered
- May not match original game's balance

🔍 **Needs Research**:
- Exact threshold formulas from original game
- Memory address documentation
- Comparison with original gameplay

---

## Contact/Session Notes:

- User noticed all attacks were `direct_fail`
- Added debug logging to see actual values
- Discovered thresholds were too high (192/128/64 vs actual stats 20-125)
- Adjusted to empirical values (30/5/-15)
- System now produces varied outcomes but accuracy unknown
- User requested this documentation for future sessions
