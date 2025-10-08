# Spec Directory

## Purpose

Maps the relationship between UI elements, game logic, and original game documentation.

## Structure

### `ui/` - User Interface Specs
Visual display elements from the mockup HTML.
- What appears on screen
- Where elements are positioned
- Visual behavior

See `ui/INDEX.md` for complete UI element list.

### `logic/` - Game Logic Specs
Core game engine systems and mechanics.
- Battle calculations
- Timing systems
- Resource management
- Character stats

**Important:** Logic specs include **memory addresses** from the original game (`027-メモリアドレス.md`), showing the actual data structure.

See `logic/INDEX.md` for complete system list.

## How to Use

1. **Starting from UI:** Find UI element → Check dependencies → Read related logic specs
2. **Starting from Logic:** Understand system → See which UI elements display it
3. **Starting from Docs:** Original docs referenced in both UI and logic specs

## File Format

Each spec contains:
- Description
- Related documentation (`docs/spec_from_html/yuyuz_md/*.md`)
- Dependencies (other systems it needs)
- Memory addresses (logic specs only)
- Technical notes

**Note:** Implementation status tracked separately to keep specs stable.

## Quick Links

- **UI Elements:** `ui/INDEX.md`
- **Game Logic:** `logic/INDEX.md`
- **Original Docs:** `../spec_from_html/yuyuz_md/`
- **Memory Map:** `../spec_from_html/yuyuz_md/027-メモリアドレス.md`
