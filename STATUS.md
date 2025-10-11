# Development Status

**Last Updated:** 2025-10-10

> **Note:** This tracks current progress. See [IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md) for the detailed roadmap.

## Phase 1: Core Systems

| Task | Status | Notes |
|------|--------|-------|
| Project setup (Vite + TypeScript) | ✅ Done | Vite + TS configured |
| Type definitions | ✅ Done | GameState, BattleTypes, PlayerInput complete |
| Battle flow system | ✅ Done | BattleFlow.ts with mock systems (Phase 1.1-1.3) |
| Mock systems | ✅ Done | RNG, Touki, Balance, Combat, Damage |
| Battle flow test | ✅ Done | Interactive UI test in game.ts with button |
| **RNG System** | ✅ Done | **Phase 2.1 - Real random corrections!** |
| **Character Stats System** | ✅ Done | **Phase 2.2 - Real character data!** |
| **Touki System** | ✅ Done | **Phase 2.3 - Real non-linear scaling!** |
| **Balance System** | ✅ Done | **Phase 2.4 - Real knockdown mechanics!** |
| **Combat Calculations** | ✅ Done | **Phase 2.5 - Real judgment system!** |
| **Damage Calculations** | ✅ Done | **Phase 2.6 - Real damage formulas!** |
| Motion frame timing | ⏸️ Not Started | Phase 3.1 |

## Phase 2: Local Play

| Task | Status | Notes |
|------|--------|-------|
| Canvas rendering | ⏸️ Not Started | Using DOM renderer instead |
| Keyboard input | ⏸️ Not Started | |
| UI elements (HP, touki, balance, reiki) | ✅ Done | Mockup exists |
| 2-player local mode | ⏸️ Not Started | |
| Character selection | ⏸️ Not Started | |
| Stage selection | 🔄 In Progress | Creating menu |

## Phase 3: Remote Play

| Task | Status | Notes |
|------|--------|-------|
| PeerJS integration | ⏸️ Not Started | Planned for later |
| Room creation/joining | ⏸️ Not Started | |
| Input synchronization | ⏸️ Not Started | |
| Network adapter | ⏸️ Not Started | |

## Phase 4: Polish

| Task | Status | Notes |
|------|--------|-------|
| Character sprites/animations | ⏸️ Not Started | |
| Sound effects | ⏸️ Not Started | |
| Visual effects | ⏸️ Not Started | |
| Menu system | 🔄 In Progress | |

---

## Legend
- ✅ Done
- 🔄 In Progress
- ⏸️ Not Started
- ❌ Blocked

## Current Focus
**Phase 2.5 & 2.6 Complete!** ✅ ALL COMBAT SYSTEMS ARE NOW REAL! 🎉

Next: Phase 3.1 - Motion Frame Timing System

## Latest Milestone (2025-10-11) - Phase 2.5 & 2.6 Complete! ⚔️💥

### Phase 2.5: Combat Calculation System (Just Completed!)
- ✅ Created CombatCalculation.ts - Real judgment formulas
- ✅ Replaced MockCombat in BattleFlow
- ✅ Full correction pipeline: Base × Touki × RNG × Balance × LowHP × Initiative × Special
- ✅ Initiative penalties: 後手 (second) ~10% reduction, 完全後手 (complete second) ×3/4
- ✅ Special modifiers: Powered punch (+56 success, +32 evasion, +16 power)
- ✅ Clean hit bonuses: (+32 success, +16 evasion, +16 power, +48 balance)
- ✅ Low HP bonuses: Up to 14.8% boost when below 25% HP
- ✅ Judgment thresholds: Direct hit (75%), Graze (50%), Evade (25%)
- ✅ RNG scenario determination based on move types
- ✅ Character-specific powered punch/clean hit rates
- ⚔️ **Combat now calculates exactly like the original Super Famicom game!**

### Phase 2.6: Damage Calculation System
- ✅ Created DamageCalculation.ts - Real damage formulas
- ✅ Replaced MockDamage in BattleFlow
- ✅ Full damage pipeline: Base × Touki × RNG × Balance × Defense × Hit type
- ✅ HP damage multipliers: Direct 100%, Graze 25%, Block 37.5%
- ✅ Balance damage multipliers: Direct 100%, Graze 50%
- ✅ Defense stats from character data (14.5% to 25.8% multipliers)
- ✅ Fractional damage accumulator system
- ✅ DoT (damage over time) effect support
- ✅ Double KO tiebreaker logic
- ✅ Special damage cases (graze to 0 HP, zero-damage moves)
- 💥 **Damage now calculates exactly like the original Super Famicom game!**

### Phase 2.4: Balance System
- ✅ Created BalanceSystem.ts - Real balance corrections
- ✅ Replaced MockBalance in BattleFlow
- ✅ Uses 256-level lookup table (0-255 balance values)
- ✅ Non-linear scaling: 0 balance = 100%, 255 balance = 68.4% performance (minimum)
- ✅ Knockdown detection (balance ≥ 256)
- ✅ Balance state tracking (normal/staggered/knockdown)
- ✅ Recovery frame calculation with button mashing
- ✅ Forced recovery detection
- ✅ Graze damage reduction (×1/2)
- ⚖️ **Balance now scales exactly like the original Super Famicom game!**

### Phase 2.3: Touki System
- ✅ Created ToukiSystem.ts - Real touki corrections
- ✅ Replaced MockTouki in BattleFlow
- ✅ Uses 97-level lookup table (0-96 touki values)
- ✅ Non-linear scaling: 30% touki = ~50% performance, 75% touki = ~90% performance
- ✅ Charge time calculation for all action types (punch/defense/technique/spirit)
- ✅ Touki UP/DOWN buff support
- ✅ Authentic scaling curve from original game
- 💪 **Touki now scales exactly like the original Super Famicom game!**

### Phase 2.2: Character Stats System
- ✅ Created CharacterStatsSystem.ts - Real character data loading
- ✅ Integrated with characterLoader.ts
- ✅ Loads real stats from JSON files (stats.json, moves.json, frames.json)
- ✅ Replaced MockCombat's hardcoded stats with real character moves
- ✅ Each character now has unique stats (Yusuke ≠ Kuwabara ≠ Hiei!)
- ✅ All 4 core stats per move (success, evasion, power, balance drain)
- ✅ Supports 3 characters: Yusuke, Kuwabara, Hiei
- ✅ Async loading before battle starts
- 🎮 **Characters now have real, authentic stats from the original game!**

### Phase 2.1: RNG System
- ✅ Created RNGSystem.ts - Real random number generation
- ✅ Replaced MockRNG in BattleFlow
- ✅ Implements 4 RNG scenarios (both-attack, mixed, counter, aerial-collision)
- ✅ First player: 192-255/256 range (75%-100%)
- ✅ Second player: 192-255 or 128-255 depending on scenario
- ✅ Defensive disadvantage implemented (second player gets worse RNG in mixed scenarios)
- ✅ Tested with battle test - damage varies each turn!
- 🎮 **Battles are now unpredictable and realistic!**

### Phase 1 Complete! 🎉
- ✅ Created BattleFlow.ts - main battle orchestrator with 4-phase turn system
- ✅ Created 5 mock systems (MockRNG, MockTouki, MockBalance, MockCombat, MockDamage)
- ✅ Integrated mocks into BattleFlow with correction pipeline
- ✅ Built working test scenario (Yusuke vs Kuwabara, 3 turns)
- ✅ Battle runs end-to-end with damage, touki, balance calculations
- ✅ **Integrated with UI!** Interactive battle test button in game.html
- ✅ **Live UI updates!** HP, Touki, Balance, Reiki update in real-time
- ✅ **Touki animations!** Smooth 800ms charging animation before each turn
- ✅ **Touki reset!** Properly resets to 0 after each action (follows spec)
- ✅ **Initiative system!** Shows first/second player with input lamps
- 🎮 Click "Run Battle Test" button to see battles on the actual UI!

## Files Created
**Phase 2 - Real Systems:**
- `src/logic/RNGSystem.ts` - Real random number generation (Phase 2.1)
- `src/logic/CharacterStatsSystem.ts` - Real character data loading (Phase 2.2)
- `src/logic/ToukiSystem.ts` - Real touki corrections (Phase 2.3)
- `src/logic/BalanceSystem.ts` - Real balance corrections (Phase 2.4)
- `src/logic/CombatCalculation.ts` - Real combat judgment (Phase 2.5)
- `src/logic/DamageCalculation.ts` - Real damage calculation (Phase 2.6)

**Phase 1 - Core Architecture:**
- `src/logic/BattleFlow.ts` - Main battle orchestrator
- `src/logic/mocks/MockRNG.ts` - Mock random number generator (replaced)
- `src/logic/mocks/MockTouki.ts` - Mock touki system (replaced)
- `src/logic/mocks/MockBalance.ts` - Mock balance system (replaced)
- `src/logic/mocks/MockCombat.ts` - Mock combat calculation (replaced)
- `src/logic/mocks/MockDamage.ts` - Mock damage calculation (replaced)

**Integration:**
- Updated `src/game.ts` - Added battle test button and integration (+147 lines)
- Updated `public/ui/game.html` - Added green battle test button

**Documentation:**
- `docs/PHASE1_COMPLETE.md` - Phase 1 completion summary
- `docs/HOW_TO_TEST_BATTLE.md` - Step-by-step testing guide
- `docs/IMPLEMENTATION_PLAN.md` - Full roadmap
