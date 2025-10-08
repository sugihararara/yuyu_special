# Logic Spec Index

Game engine systems and mechanics.

## Core Systems

| ID | System | File | Key Memory Addresses | Key Docs |
|----|--------|------|---------------------|----------|
| 01 | Battle Flow | `01_battle_flow.md` | 7E0E66, 7E1066, 7E046C/E | 018, 057, 053 |
| 02 | Motion Frame | `02_motion_frame.md` | 7E0E5A/5B, 7E0E74/75 | 057, 018 |
| 03 | Touki System | `03_touki_system.md` | 7E0E21, 7E1021 | 019, 018, 022 |
| 04 | Balance System | `04_balance_system.md` | 7E0E24, 7E1024, 7E0E74/75 | 018, 020, 015 |
| 05 | Damage Calculation | `05_damage_calculation.md` | 7E0E1F, 7E101F, 7E0443/0446 | 018, 015, 019-021 |
| 06 | Combat Calculation | `06_combat_calculation.md` | 7E2800-2816, 7E046C/E | 018, 019-021, 026 |
| 07 | Reiki System | `07_reiki_system.md` | TBD | 018, 023, 013 |
| 08 | Character Stats | `08_character_stats.md` | 7E0EB0-0EBE, 7E10B0-10BE | 015, 016, 024-048 |
| 09 | RNG System | `09_rng_system.md` | 7E2801, 7E2804, 7E2811/14 | 021, 018 |
| 10 | Reward System | `10_reward_system.md` | TBD | 023, 018 |

## System Dependencies

**Foundation Layer:**
- Character Stats (08) - Base stats for all systems
- RNG System (09) - Randomness for all calculations

**Core Mechanics:**
- Motion Frame (02) - Timing for everything
- Touki System (03) - Performance scaling
- Balance System (04) - Stamina/knockdown
- Reiki System (07) - Resource management

**Calculation Layer:**
- Combat Calculation (06) - Uses: Touki, Balance, RNG, Stats
- Damage Calculation (05) - Uses: Combat results, Stats, RNG

**Meta Systems:**
- Battle Flow (01) - Orchestrates all systems
- Reward System (10) - Incentive structure

## Memory Map Reference

See `027-メモリアドレス.md` for complete memory addresses.

**Player State Blocks:**
- `7E0E00-7E0EFF` - Player 1
- `7E1000-7E10FF` - Player 2

**Combat Calculation:**
- `7E2800-7E2816` - Success/evasion rates, corrections

**Battle Results:**
- `7E0443-7E0470` - Damage, hit判定, collision判定

## Key Formulas

**Touki Correction:** `base × touki_table[0-96]`
**Balance Correction:** `base × balance_table[0-255]`
**RNG Correction:** `base × random(128-255 or 192-255) / 256`
**Real HP:** `96 / defense_multiplier`
**Real Balance:** `256 / balance_drain_multiplier`

## Notes
- All systems interconnected - changing one affects many
- Memory addresses show exact data structure from original game
- Corrections apply sequentially (multiply together)
- Frame timing is fundamental to ALL systems
