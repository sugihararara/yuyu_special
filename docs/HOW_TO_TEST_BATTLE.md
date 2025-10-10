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

### Turn 1
- **P1 (Yusuke):** Punch (→A) at frame 60
- **P2 (Kuwabara):** Punch (→A) at frame 80
- P1 is first → P1 hits, P2 takes damage

### Turn 2
- **P1:** Strong punch (→B) at frame 90
- **P2:** Defense (↓A) at frame 100
- P1 is first → Different damage calculation

### Turn 3
- **P1:** Technique (↑X) at frame 100
- **P2:** Technique (↑X) at frame 105
- P1 is first → Simultaneous tech moves

## What You'll See

### On Screen (Live Updates!)
- ✅ **HP bars** - Red and yellow bars decrease
- ✅ **Touki meters** - Red bars charge (30, 45, 50)
- ✅ **Balance meters** - Cyan bars fill up
- ✅ **Reiki gauges** - Orange cells increase
- ✅ **Crystal ball** - Shows reiki rewards (3 orbs)
- ✅ **Input lamps** - Blue/yellow showing who's first
- ✅ **Messages** - Battle narrative at bottom

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
2. **5 Mock Systems:**
   - MockRNG - Fixed random values
   - MockTouki - Linear touki scaling
   - MockBalance - Linear balance scaling
   - MockCombat - Simple success/fail logic
   - MockDamage - Damage with graze support

3. **9 UI Renderers:**
   - HPRenderer
   - ToukiRenderer
   - BalanceRenderer
   - ReikiRenderer
   - CrystalBallRenderer
   - InputLampRenderer
   - ButtonLampsRenderer
   - BattlefieldRenderer
   - ScreenScaleRenderer

### Integration:
- Battle runs in `game.ts`
- Updates all UI renderers via `updateUIFromBattleState()`
- Real-time synchronization between logic and UI

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
