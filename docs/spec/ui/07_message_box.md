# Spec: Message Box (メッセージウィンドウ)

## UI Element
- **Class**: `.message-box`
- **Location**: Bottom of battlefield area
- **Description**: Dark overlay bar displaying messages, dialogue, and battle text.

## Related Docs
- `014-画面説明.md` - ③メッセージウィンドウ explanation
- Character docs (024-048) - Character dialogue
- `018-基本仕様.md` - Basic mechanics

## Dependencies
- Battle event system (message triggers)
- Text rendering system
- Character data (dialogue text)

## Technical Notes
- Semi-transparent black background (rgba(0,0,0,0.8))
- White text, MS Gothic font
- Displays action results, character dialogue
