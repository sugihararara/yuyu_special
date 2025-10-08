# Spec: Item Stock (アイテムストック)

## UI Element
- **Class**: `.item-stock`, `.item-slot`
- **Location**: UI panel, player info areas
- **Description**: Single item storage slot. Can hold one item. Used by pressing A or Y when not charging touki. Small items are round, large items are square.

## Related Docs
- `014-画面説明.md` - ⑥アイテムストック explanation
- `023-霊界水晶玉報酬.md` - Item rewards from crystal ball
- `054-操作説明.md` - How to use items (A/Y button)
- `018-基本仕様.md` - Basic mechanics

## Dependencies
- Crystal ball reward system (item acquisition)
- Input system (A/Y button detection when not charging)
- Item effect system (愛大/愛小 effects)

## Technical Notes
- Can only hold 1 item at a time
- Must not be charging touki to use
- Item types affect visual (丸=small, 四角=large)
