# Spec: Input Lamp (入力ボタンランプ)

## UI Element
- **Class**: `.input-buttons-lamp`
- **Location**: UI panel, player info areas
- **Description**: Button input indicators. Shows which buttons can be pressed and input status. Changes color based on state.

## Related Docs
- `014-画面説明.md` - ⑨入力受付ランプ, ⑩入力可能ランプ explanation
- `054-操作説明.md` - Control scheme
- `013-行動種類一覧.md` - Available actions per button
- `018-基本仕様.md` - Basic mechanics

## Dependencies
- Input system (button state detection)
- Touki system (determines available moves)
- Reiki system (determines if move is usable)
- Battle state system (turn management)

## Technical Notes
- Two types:
  - Input status lamp: Blue=can input, Yellow=input done, Red=cannot input
  - Available button lamp: Shows which buttons are usable (dims unavailable moves)
- Tied to touki charging state
- Reflects reiki availability for techniques
