# Battle Flow Implementation Plan

**Created:** 2025-10-10
**Goal:** Build working battle system with end-to-end flow, starting with mocks and replacing them incrementally

## Strategy: Working Skeleton First

Build a complete battle flow that works immediately with mock implementations, then replace mocks with real systems one by one. This allows testing at every step.

---

## Phase 1: Battle Flow Skeleton ✅ COMPLETE (2025-10-10)

### Step 1.1: Core Battle Flow ✅
**File:** `src/logic/BattleFlow.ts`
**Dependencies:** Types only
**What it does:**
- Main game loop orchestrator
- 4 phases: Input → Execute → Resolve → Repeat
- Manages turn state and phase transitions
- Calls sub-systems (initially mocks)

**Interface:**
```typescript
class BattleFlow {
  processTurn(p1Input: PlayerInput, p2Input: PlayerInput): TurnResult
  getCurrentPhase(): BattlePhase
  getGameState(): GameState
}
```

### Step 1.2: Mock Systems ✅
Create simple placeholder implementations:

**`src/logic/mocks/MockRNG.ts`**
- Returns fixed random values (e.g., always 200/256)

**`src/logic/mocks/MockTouki.ts`**
- Simple formula: `baseStat * 1.5`

**`src/logic/mocks/MockBalance.ts`**
- Simple formula: `baseStat * 0.8`

**`src/logic/mocks/MockCombat.ts`**
- Simple success check: `attackerStat > defenderStat ? success : fail`

**`src/logic/mocks/MockDamage.ts`**
- Simple damage: `power - defense`

### Step 1.3: Integration Test ✅
**File:** `src/game.ts` (interactive test with button)
**Features:**
- Interactive button in debug panel
- Smooth touki charging animations (800ms)
- Live UI updates for all renderers
- Turn-by-turn progression with delays
- Touki reset after each action
- Console logs + UI display

**Deliverable:** Interactive battle test with live UI updates!

---

## Phase 2: Real Systems (Weeks 2-4)

Replace mocks one by one, testing after each replacement.

### Step 2.1: RNG System ✅ COMPLETE
**File:** `src/logic/RNGSystem.ts`
**Spec:** `docs/spec/logic/09_rng_system.md`
**Replaces:** `MockRNG.ts`
**Key features:**
- ✅ Random correction values (128-255 or 192-255)
- ✅ Different ranges for attacker/defender
- ✅ Different ranges based on move types (4 scenarios)
- ✅ Action classification (attack vs non-attack)
- ✅ Defensive disadvantage for second player in mixed scenarios

**Test:** ✅ Tested with battle test - damage varies each turn!

### Step 2.2: Character Stats System ✅ COMPLETE
**File:** `src/logic/CharacterStatsSystem.ts`
**Spec:** `docs/spec/logic/08_character_stats.md`
**Dependencies:** `src/data/characterLoader.ts` (already exists!)
**Key features:**
- ✅ Load character base stats from JSON files
- ✅ Provide move data (4 core stats per move)
- ✅ Handle character transformations
- ✅ Async loading with preload support
- ✅ Move lookup by command or ID
- ✅ 3 characters available: Yusuke, Kuwabara, Hiei

**Test:** ✅ Integrated with BattleFlow - real character stats used in battles!

### Step 2.3: Touki System ⏸️
**File:** `src/logic/ToukiSystem.ts`
**Spec:** `docs/spec/logic/03_touki_system.md`
**Replaces:** `MockTouki.ts`
**Uses:** `src/data/lookupTables/toukiTable.ts` (already exists!)
**Key features:**
- Touki charge over time (61F/73F/96F/121F to max)
- Touki correction lookup (0-96 levels)
- Touki UP/DOWN states
- Apply correction to stats

**Test:** Charge touki, verify stat multipliers match lookup table

### Step 2.4: Balance System ⏸️
**File:** `src/logic/BalanceSystem.ts`
**Spec:** `docs/spec/logic/04_balance_system.md`
**Replaces:** `MockBalance.ts`
**Uses:** `src/data/lookupTables/balanceTable.ts` (already exists!)
**Key features:**
- Balance damage accumulation (0-255)
- Knockdown at 256
- Balance correction to success/evasion rates
- Recovery mechanics (button mashing)

**Test:** Deal balance damage, verify knockdown occurs, test recovery

### Step 2.5: Combat Calculation System ⏸️
**File:** `src/logic/CombatCalculation.ts`
**Spec:** `docs/spec/logic/06_combat_calculation.md`
**Replaces:** `MockCombat.ts`
**Dependencies:** RNG, Touki, Balance, Character Stats
**Key features:**
- Four core stats (success, evasion, power, balance drain)
- Correction pipeline: Base → Touki → RNG → Balance → Low HP → Initiative
- Initiative penalties (後手 -10%, 完全後手 ×3/4)
- Special modifiers (powered punch, clean hit)
- Action priority resolution

**Test:** Run various scenarios, verify correction pipeline matches specs

### Step 2.6: Damage Calculation System ⏸️
**File:** `src/logic/DamageCalculation.ts`
**Spec:** `docs/spec/logic/05_damage_calculation.md`
**Replaces:** `MockDamage.ts`
**Dependencies:** Combat results
**Key features:**
- HP damage calculation
- Balance damage calculation
- Damage reduction (graze ×1/4, block ×3/8)
- Defense multipliers
- Simultaneous KO resolution (余剰ダメージ)

**Test:** Deal damage, verify HP/balance changes correctly for direct/graze/block

---

## Phase 3: Advanced Systems (Weeks 5-6)

### Step 3.1: Motion Frame System ⏸️
**File:** `src/logic/MotionFrameSystem.ts`
**Spec:** `docs/spec/logic/02_motion_frame.md`
**Key features:**
- Frame timing for all actions (準備移行F, 準備F, 発動F)
- Touki charge timing
- Stage-dependent timing variations
- Airtime tracking
- Knockdown recovery frames

### Step 3.2: Reiki System ⏸️
**File:** `src/logic/ReikiSystem.ts`
**Spec:** `docs/spec/logic/07_reiki_system.md`
**Key features:**
- Reiki gauge (0-25)
- Reiki consumption (techniques/spirit moves)
- Reiki rewards from crystal ball
- Absorption mechanics

### Step 3.3: Reward System ⏸️
**File:** `src/logic/RewardSystem.ts`
**Spec:** `docs/spec/logic/10_reward_system.md`
**Key features:**
- Crystal ball rewards (reiki 2-6, items)
- Reward probability calculations
- Item stock management
- Reward timing (26F for reiki, 46F for items)

---

## Phase 4: Integration & Testing (Week 7)

### Step 4.1: Full Battle Integration
- All systems working together
- Run complete battles with real data
- Verify frame-perfect timing
- Test all 19 characters

### Step 4.2: Edge Cases
- Simultaneous KO
- Balance corrections during knockdown
- Low HP bonuses
- Transformation mechanics
- Action priority special cases

---

## File Structure (Final)

```
src/logic/
├── BattleFlow.ts              # Main orchestrator
├── RNGSystem.ts               # Random corrections
├── CharacterStats.ts          # Character/move data
├── ToukiSystem.ts             # Fighting spirit
├── BalanceSystem.ts           # Stamina/knockdown
├── CombatCalculation.ts       # Success/failure judgments
├── DamageCalculation.ts       # HP/balance damage
├── MotionFrameSystem.ts       # Frame timing
├── ReikiSystem.ts             # Spiritual energy
├── RewardSystem.ts            # Crystal ball rewards
└── mocks/                     # Temporary mocks (delete when done)
    ├── MockRNG.ts
    ├── MockTouki.ts
    ├── MockBalance.ts
    ├── MockCombat.ts
    └── MockDamage.ts
```

---

## Testing Strategy

After each step:
1. ✅ Unit test the new system in isolation
2. ✅ Integration test with BattleFlow
3. ✅ Run end-to-end battle scenario
4. ✅ Compare results with original game documentation
5. ✅ Verify no regressions in previous systems

---

## Success Criteria

**Phase 1 Complete:** ✅ Can run interactive battle with live UI updates
**Phase 2 Complete:** Battle calculations match original game specs (replacing mocks)
**Phase 3 Complete:** Full frame timing and resource management
**Phase 4 Complete:** Production-ready battle system

---

## Phase 1 Achievements ✅

All Phase 1 goals exceeded! Delivered:
- ✅ Working battle flow with 4 phases
- ✅ 5 mock systems fully integrated
- ✅ Interactive UI integration (not just console)
- ✅ Smooth touki charging animations
- ✅ Touki reset after actions (spec compliance)
- ✅ Live updates for all 9 UI renderers
- ✅ Turn-by-turn progression
- ✅ Initiative system (先手/後手)
- ✅ Comprehensive documentation

---

## Current Status

| System | Status | File | Notes |
|--------|--------|------|-------|
| Battle Flow | ✅ Done | `BattleFlow.ts` | Phase 1.1 |
| Mock Systems | ✅ Done | `mocks/*` | Phase 1.2 |
| Integration Test | ✅ Done | `game.ts` | Phase 1.3 (interactive UI) |
| RNG System | ✅ Done | `RNGSystem.ts` | Phase 2.1 ✅ |
| Character Stats | ✅ Done | `CharacterStatsSystem.ts` | Phase 2.2 ✅ |
| Touki System | ⏸️ Not Started | `ToukiSystem.ts` | Phase 2.3 |
| Balance System | ⏸️ Not Started | `BalanceSystem.ts` | Phase 2.4 |
| Combat Calculation | ⏸️ Not Started | `CombatCalculation.ts` | Phase 2.5 |
| Damage Calculation | ⏸️ Not Started | `DamageCalculation.ts` | Phase 2.6 |
| Motion Frame | ⏸️ Not Started | `MotionFrameSystem.ts` | Phase 3.1 |
| Reiki System | ⏸️ Not Started | `ReikiSystem.ts` | Phase 3.2 |
| Reward System | ⏸️ Not Started | `RewardSystem.ts` | Phase 3.3 |

---

## Next Steps

1. Start Phase 1.1: Create `BattleFlow.ts` skeleton
2. Create mock systems (Phase 1.2)
3. Build integration test (Phase 1.3)
4. **Get a working battle running!** 🎮
