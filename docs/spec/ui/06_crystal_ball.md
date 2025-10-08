# Spec: Crystal Ball (霊界水晶玉)

## UI Element
- **Class**: `.crystal-ball`, `.crystal-ball-container`, `.crystal-content`
- **Location**: Center of UI panel
- **Description**: Purple glowing sphere displaying reiki orbs or items. Successful actions grant the displayed reward.

## Related Docs
- `014-画面説明.md` - ⑧霊界水晶玉 explanation
- `023-霊界水晶玉報酬.md` - Reward types and distribution
- `018-基本仕様.md` - Basic mechanics

## Dependencies
- Battle result system (success detection)
- Reward distribution system
- Reiki gauge (reiki rewards)
- Item stock (item rewards)

## Technical Notes
- Displays ●●● symbols or item names
- Rewards given on successful action
- Contains reiki orbs or items (愛大/愛小)
- Visual: radial gradient purple, white glow effect
