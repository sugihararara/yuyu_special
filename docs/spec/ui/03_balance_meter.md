# Spec: Balance Meter (バランスメーター)

## UI Element
- **Class**: `.balance-meter`, `.balance-meter-fill`
- **Location**: Below touki meter
- **Description**: Balance gauge in cyan. When depleted, character gets knocked down into vulnerable state. Lower balance reduces success/evasion rates.

## Related Docs
- `014-画面説明.md` - ⑤バランスメーター explanation
- `015-基本性能.md` - バランス防御力 (balance defense stats)
- `020-バランス補正.md` - Balance correction mechanics
- `018-基本仕様.md` - Basic mechanics

## Dependencies
- Damage system (balance damage calculation)
- Knockdown state system
- Success/evasion rate calculations

## Technical Notes
- Real balance = 256 / (奪バランス値倍率)
- Character-specific balance defense (37.5% to 99.6%)
- Balance affects success and evasion rates
- Full depletion causes knockdown
