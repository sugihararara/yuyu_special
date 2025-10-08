# Spec: Reiki Gauge (霊気ゲージ)

## UI Element
- **Class**: `.reiki-gauge`, `.reiki-bar`, `.reiki-cell`
- **Location**: UI panel, player info areas (P1 left, P2 right)
- **Description**: 25-cell spiritual energy gauge. Required to use techniques and spirit attacks. Cannot use moves if insufficient reiki. P1 fills left-to-right, P2 fills right-to-left.

## Related Docs
- `014-画面説明.md` - ⑦霊気ゲージ explanation
- Character docs (024-048) - Each character's move costs
- `013-行動種類一覧.md` - Action types and costs
- `018-基本仕様.md` - Basic mechanics

## Dependencies
- Move execution system (reiki cost checking)
- Crystal ball reward system (reiki gain)
- Character move data (individual move costs)

## Technical Notes
- Total 25 cells
- Each move has specific reiki cost
- Gained from successful actions via crystal ball rewards
- Visual: orange/yellow gradient with glow effect when filled
- Animation: blinking effect on fill/empty
