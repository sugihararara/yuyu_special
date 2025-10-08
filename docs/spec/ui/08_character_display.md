# Spec: Character Display (キャラクター表示)

## UI Element
- **Class**: `.character-area`, `.character`, `.battlefield`
- **Location**: Center battlefield area
- **Description**: Visual window showing character sprites/animations during battle. Split mode shows both characters, single mode shows one large image.

## Related Docs
- `014-画面説明.md` - ②ビジュアルウィンドウ explanation
- Character docs (024-048) - Individual character data

## Dependencies
- Animation system (sprite/frame management)
- Battle state system (action visualization)
- **Motion frame system** (`logic/02_motion_frame.md`) - **Critical:** Provides timing data for syncing animations to game logic
- Character sprite data

## Technical Notes
- Two display modes: split (both characters) and single (one character closeup)
- Characters positioned at bottom with space for text
- Background gradient (brown tones)
- **Animation sync:** Visual animations must sync with motion frame timing from game logic (not just cosmetic)
