# How to Test the Battle System

**Phase 1 Complete** - Interactive battle test with live UI updates!

## Quick Start

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Open in browser:**
   - Go to `http://localhost:3000` (or whatever port Vite shows)

3. **Navigate to game:**
   - Click **"Game UI Test (Debug Mode)"**

4. **Run the battle:**
   - Scroll down to the debug panel at the bottom
   - Find the green **"🎮 BATTLE TEST (Phase 1)"** section
   - Click **"▶ Run Battle Test (3 Turns)"** button

5. **Watch the magic!** ✨

## What Happens

The battle automatically runs 3 turns with 1.5 second delays:

### Turn 1 (Touki: P1=30, P2=40)
- **Touki charging animation** (800ms smooth fill)
- **P1 (Yusuke):** Punch (→A) at frame 60
- **P2 (Kuwabara):** Punch (→A) at frame 80
- P1 is first → P1 hits, P2 takes damage
- **Touki resets to 0** after action

### Turn 2 (Touki: P1=45, P2=35)
- **Touki charging animation** (from 0 again!)
- **P1:** Strong punch (→B) at frame 90
- **P2:** Defense (↓A) at frame 100
- P1 is first → Different damage calculation
- **Touki resets to 0** after action

### Turn 3 (Touki: P1=50, P2=50)
- **Touki charging animation** (from 0 again!)
- **P1:** Technique (↑X) at frame 100
- **P2:** Technique (↑X) at frame 105
- P1 is first → Simultaneous tech moves
- **Touki resets to 0** after action

## What You'll See

### On Screen (Live Updates!)
- ✅ **HP bars** - Red and yellow bars decrease (P2: 96→91→86→81)
- ✅ **Touki meters** - Red bars charge with smooth 800ms animation, then reset to 0
- ✅ **Balance meters** - Cyan bars fill up gradually
- ✅ **Reiki gauges** - Orange cells increase from crystal ball rewards
- ✅ **Crystal ball** - Shows reiki rewards (3 orbs)
- ✅ **Input lamps** - Blue/yellow showing who's first/second
- ✅ **Messages** - Battle narrative at bottom ("Turn X: Charging touki..." → "Turn X: P1 first...")

### In Console (Detailed Logs!)
```
🎮 Starting Battle Test...

=== TURN 1 ===
Turn 0: P1 first | P1: →A (direct_hit) | P2: →A (graze)

=== TURN 2 ===
Turn 1: P1 first | P1: →B (direct_hit) | P2: ↓A (evade)

=== TURN 3 ===
Turn 2: P1 first | P1: ↑X (direct_hit) | P2: ↑X (graze)

✅ Battle Test Complete!
```

## Controls

While the battle test is automatic, you can also:
- **Manually adjust values** before running (HP, Touki, Balance, Reiki)
- **Re-run the test** multiple times
- **Check debug controls** to see individual system behavior
- **Toggle debug panel** with `Ctrl+D`

## Technical Details

### What's Running:
1. **BattleFlow.ts** - Main orchestrator
   - ✅ Touki reset after action
   - ✅ Initiative system (先手/後手)
   - ✅ 4-phase turn system
   - ✅ Win condition checking

2. **5 Mock Systems:**
   - MockRNG - Fixed random values (~0.8-0.9)
   - MockTouki - Linear touki scaling (0.5 + touki/96 * 0.5)
   - MockBalance - Linear balance correction (1.0 - balance/255 * 0.32)
   - MockCombat - Success vs evasion judgment
   - MockDamage - HP/Balance damage with graze support

3. **9 UI Renderers:**
   - HPRenderer - Red/yellow HP bars
   - ToukiRenderer - Red touki bars with animation
   - BalanceRenderer - Cyan balance bars
   - ReikiRenderer - Orange reiki cells
   - CrystalBallRenderer - Purple crystal ball rewards
   - InputLampRenderer - Blue/yellow/red input lamps
   - ButtonLampsRenderer - ABXY button lamps
   - BattlefieldRenderer - Messages and character area
   - ScreenScaleRenderer - Screen zoom controls

### Integration:
- Battle runs in `game.ts` (runBattleTest function)
- Smooth touki charging with `animateToukiCharge()` (800ms ease-in-out)
- Updates all UI renderers via `updateUIFromBattleState()`
- Real-time synchronization between logic and UI
- Turn-by-turn delays (1.5s) for visibility

## Troubleshooting

### Battle doesn't start?
- Check browser console for errors
- Make sure you clicked the green battle test button
- Refresh the page and try again

### UI doesn't update?
- Check that all renderers initialized (console logs)
- Verify no TypeScript compilation errors
- Hard refresh with `Ctrl+F5`

### Console shows errors?
- Check that dev server is running
- Look for TypeScript errors in terminal
- Verify all imports are correct

## Next Steps

After testing, you can:
1. **Explore the UI** - Use other debug controls
2. **Read the code** - Check `src/logic/BattleFlow.ts`
3. **Plan Phase 2** - Replace mocks with real systems
4. **Give feedback** - What works? What doesn't?

---

**🎉 Enjoy watching your Yu Yu Hakusho battles come to life!**
