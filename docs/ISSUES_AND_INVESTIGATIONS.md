# Issues and Investigations

**Purpose**: Central hub for tracking ongoing issues, investigations, and technical documentation.

**Last Updated**: 2025-10-11

---

## 🔴 Active Issues

### 1. Combat Judgment Threshold Calibration

**Status**: 🔬 Investigation In Progress
**Priority**: High
**Phase**: Phase 2.5 (Combat Calculation)

#### Quick Summary:
The combat judgment system is working but uses empirically-adjusted thresholds instead of the original game's exact formula. We discovered the original uses a **ratio-based calculation**, not a simple difference.

#### Related Documents:
- 📄 [COMBAT_THRESHOLD_ISSUE.md](./COMBAT_THRESHOLD_ISSUE.md) - Detailed problem description
- 📄 [SIMULATOR_ANALYSIS.md](./SIMULATOR_ANALYSIS.md) - Initial simulator findings
- 📄 [SIMULATOR_DEOBFUSCATED.md](./SIMULATOR_DEOBFUSCATED.md) - **⭐ Complete formula deobfuscation**

#### Key Discovery:
```typescript
// WRONG (current implementation):
const successDiff = attackerSuccess - defenderEvasion;
if (successDiff >= 30) return 'direct_hit';

// CORRECT (from simulator):
const judgmentRatio = (defenderEvasion * 64) / attackerSuccess;
if (judgmentRatio <= 59) return 'direct_hit';
if (judgmentRatio <= 89) return 'graze';
return 'evade';
```

#### Next Steps:
1. ✅ Found simulators with exact formulas
2. ✅ Deobfuscated JavaScript code
3. ⏳ Check all 4 simulators for completeness
4. ⏳ Implement ratio-based judgment
5. ⏳ Test and verify results

#### Files to Modify:
- `src/logic/CombatCalculation.ts` (lines 52-169)

---

## 📊 Investigation Progress

### Combat Threshold Investigation

**Timeline**:
- **2025-10-11 08:30**: Discovered all attacks result in `direct_fail`
- **2025-10-11 08:35**: Added debug logging, found stats are 20-125 range
- **2025-10-11 08:40**: Adjusted thresholds empirically (30, 5, -15)
- **2025-10-11 08:50**: Found simulators directory
- **2025-10-11 09:00**: **⭐ Deobfuscated exact formula from simulator**

**Key Findings**:
1. Original game uses **ratio-based judgment**: `(evasion * 64) / success`
2. Thresholds are **percentage-based**: 59%, 89%
3. Different scenarios use different thresholds (attack vs collision)
4. The 64 multiplier normalizes stats to percentage range

---

## 📚 Documentation Structure

### Problem Documentation
```
docs/
├── ISSUES_AND_INVESTIGATIONS.md  ← YOU ARE HERE
├── COMBAT_THRESHOLD_ISSUE.md     ← Problem description
├── SIMULATOR_ANALYSIS.md          ← Initial findings
└── SIMULATOR_DEOBFUSCATED.md      ← Complete formula (MOST IMPORTANT!)
```

### How to Use These Docs:
1. **Start here** (ISSUES_AND_INVESTIGATIONS.md) for overview
2. **Read COMBAT_THRESHOLD_ISSUE.md** for problem context
3. **Read SIMULATOR_DEOBFUSCATED.md** for the solution

### Simulator Files:
```
docs/spec_from_html/simulators/
├── index.html
├── 攻撃判定シミュレーター_simulator.htm        ← Attack judgment (ANALYZED ✅)
├── 相殺判定シミュレーター_simulator2.htm       ← Collision judgment (ANALYZED ✅)
├── 防御判定シミュレーター攻撃側先手_simulator_guard.htm   ← Defense (attacker first)
└── 防御判定シミュレーター防御側先手_simulator_guard2.htm  ← Defense (defender first)
```

---

## 🎯 Quick Reference: The Formula

### Attack Scenario (攻撃判定):
```typescript
const ratio = (defenderEvasion * 64) / attackerSuccess;

if (ratio <= 59) return 'direct_hit';
if (ratio <= 89) return 'graze';
return 'evade';
```

### Collision Scenario (相殺判定):
```typescript
const ratio = (player2Success * 64) / player1Success;

if (ratio <= 52) return 'player1_breakthrough';
if (ratio <= 59) return 'cancel_or_both';
if (ratio <= 73) return 'player1_reduced';
if (ratio <= 88) return 'player1_full';
return 'player2_breakthrough';
```

---

## 🔧 Implementation Checklist

- [ ] Analyze all 4 simulators
  - [x] Attack judgment simulator
  - [x] Collision judgment simulator
  - [ ] Defense simulator (attacker first)
  - [ ] Defense simulator (defender first)
- [ ] Implement ratio-based judgment
  - [ ] Update CombatCalculation.ts
  - [ ] Add scenario detection (attack vs collision vs defense)
  - [ ] Use correct thresholds per scenario
- [ ] Test implementation
  - [ ] Test with values from simulator
  - [ ] Compare results with HTML simulator
  - [ ] Verify all scenarios work
- [ ] Update documentation
  - [ ] Mark issue as resolved
  - [ ] Update STATUS.md
  - [ ] Document the fix

---

## 📖 Specification References

### Related Spec Files:
- `docs/spec/logic/06_combat_calculation.md` - Combat calculation overview
- `docs/spec_from_html/yuyuz_md/018-基本仕様.md` - Original Japanese specs
- `docs/spec_from_html/yuyuz_md/019-闘気補正.md` - Touki corrections
- `docs/spec_from_html/yuyuz_md/020-バランス補正.md` - Balance corrections
- `docs/spec_from_html/yuyuz_md/021-乱数補正.md` - RNG corrections

### What Specs Don't Tell Us:
❌ Exact threshold formulas (found in simulators instead!)
❌ The ratio calculation (found in simulators!)
✅ Correction pipeline (documented correctly)
✅ Result codes 00/02/04/06 (documented correctly)

---

## 🚨 If You're Starting a New Session

### Quick Start:
1. Read this file (ISSUES_AND_INVESTIGATIONS.md)
2. Check "Active Issues" section above
3. Read the referenced documents
4. Look at "Implementation Checklist" for current progress
5. Continue from where we left off

### Context for New Session:
- **Current Phase**: Phase 2.5 & 2.6 complete, but threshold calibration needed
- **Problem**: Using empirical thresholds instead of original formula
- **Solution Found**: Ratio-based judgment with specific thresholds
- **Next Step**: Implement the ratio formula in CombatCalculation.ts

---

## 📝 Notes for Future Investigations

### Potential Future Issues:
1. **Motion Frame Timing** (Phase 3.1) - Complex frame-perfect timing system
2. **Aerial Collision Detection** - Special cases for 飛び同士
3. **Defense Mechanics** - Guard/counter scenarios
4. **Special Modifiers** - Powered punch, clean hit probabilities
5. **Low HP Bonuses** - Exact scaling formulas

### Methodology:
1. Check simulators first! (`docs/spec_from_html/simulators/`)
2. Cross-reference with specs (`docs/spec/logic/` and `docs/spec_from_html/yuyuz_md/`)
3. Add debug logging to see actual values
4. Document findings in this directory
5. Update this index file

---

## 🤝 How to Add New Issues

### Template:
```markdown
### N. Issue Title

**Status**: 🔬 Investigation / ⚠️ Blocked / ✅ Resolved
**Priority**: High / Medium / Low
**Phase**: Phase X.Y

#### Quick Summary:
[Brief description]

#### Related Documents:
- 📄 [DOCUMENT_NAME.md](./DOCUMENT_NAME.md)

#### Key Points:
- Point 1
- Point 2

#### Next Steps:
1. Step 1
2. Step 2
```

### Update Checklist:
- [ ] Add issue to "Active Issues" section
- [ ] Create detailed documentation file
- [ ] Link to related specs
- [ ] Add to implementation checklist
- [ ] Update this index regularly

---

## 📞 Getting Help

### Useful Commands:
```bash
# Run dev server
npm run dev

# Visit test page
http://localhost:3000

# Run battle test
Click "Run Battle Test" button in browser
Check console for debug output
```

### Key Files:
- Implementation: `src/logic/CombatCalculation.ts`
- Test: `src/game.ts` (battle test function)
- Specs: `docs/spec/logic/06_combat_calculation.md`
- Simulators: `docs/spec_from_html/simulators/`

---

**Remember**: This is a living document. Update it as investigations progress!
