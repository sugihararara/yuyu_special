# How to Create Character JSON Files

This guide explains how to create character data JSON files for the game.

## 📁 File Location

Character JSON files go in this directory: `public/data/characters/`

## 📖 Where to Get the Data

All character data comes from the Japanese wiki documentation:

### Main Sources:
1. **Character Stats** - `docs/spec_from_html/yuyuz_md/024-048-*.md`
   - Example: `024-幽助.md` for Yusuke
   - Each character has their own file

2. **Frame Data** - `docs/spec_from_html/yuyuz_md/057-モーションフレーム.md`
   - Motion frame timing for all characters
   - Stage-dependent preparation frames

## 🎯 Step-by-Step Process

### Step 1: Find Character Documentation

Go to `docs/spec_from_html/yuyuz_md/` and find your character:
- `024-幽助.md` - Yusuke
- `030-桑原.md` - Kuwabara
- `033-飛影.md` - Hiei
- etc.

### Step 2: Extract Base Stats (基本性能)

From the character doc, find the table labeled **基本性能**:

```
防御力 (Defense) → "defense" and "realHp"
バランス防御力 (Balance Defense) → "balanceDefense" and "realBalance"
滞空時間 (Airtime) → "airtime"
霊撃闘気 (Airtime Touki) → "airtimeTouki"
ダウン時間 (Knockdown) → "knockdownDuration" (3 variants)
気合いの入ったパンチ発生率 → "poweredPunchRate"
クリーンヒット発生率 → "cleanHitRate"
```

**Example from Yusuke (024-幽助.md):**
```markdown
| 防御力 | 威力倍率 | 58/256(22.7%) |
| 実体力 | 424 |
| バランス防御力 | 奪バランス値倍率 | 144/256(56.3%) |
| 実バランス | 455 |
| 滞空時間 | 187F |
| 霊撃闘気 | 1.55本 |
| ダウン時間(短縮無し) | 356F |
| ダウン時間(30/秒短縮) | 118F |
| ダウン時間(60/秒短縮) | 71F |
| 気合いの入ったパンチ発生率 | 21/256(8.2%) |
| クリーンヒット発生率 | 10/256(3.9%) |
```

Becomes:
```json
"stats": {
  "defense": 0.227,
  "realHp": 424,
  "balanceDefense": 0.563,
  "realBalance": 455,
  "airtime": 187,
  "knockdownDuration": 356,
  "knockdownDuration30PerSec": 118,
  "knockdownDuration60PerSec": 71,
  "knockdownSpeed": 1,
  "airtimeTouki": 1.55,
  "poweredPunchRate": 0.082,
  "cleanHitRate": 0.039
}
```

### Step 3: Extract Move Data (戦闘コマンド)

From the character doc, find the table labeled **戦闘コマンド**:

**Columns:**
- 操作 (Command) → "command" (e.g., "→A", "↓B")
- 名称 (Name) → "name"
- 消費 (Cost) → "reikiCost"
- 種類 (Type) → "type"
- 成功 (Success) → "successRate"
- 回避 (Evasion) → "evasionRate"
- 威力 (Power) → "power"
- 奪バ (Balance Drain) → "balanceDrain"

**Example from Yusuke:**
```markdown
| → | A | 下強パンチ | 0 | パンチ | 050 | 048 | 022 | 026 |
```

Becomes:
```json
{
  "id": "forward_a",
  "command": "→A",
  "name": "下強パンチ",
  "nameEn": "Weak Low Punch",
  "type": "punch",
  "priority": "low",
  "successRate": 50,
  "evasionRate": 48,
  "power": 22,
  "balanceDrain": 26,
  "reikiCost": 0,
  "frames": { ... }
}
```

**Move ID naming:**
- Forward (→) = `forward_a`, `forward_b`, `forward_x`, `forward_y`
- Back (←) = `back_a`, `back_b`, `back_x`, `back_y`
- Up (↑) = `up_a`, `up_b`, `up_x`, `up_y`
- Down (↓) = `down_a`, `down_b`, `down_x`, `down_y`
- Spirit Boost variants = `spirit_boost_down_a`, etc.

**Move types:**
- パンチ = "punch"
- 防御 = "defense"
- 受ける = "defense"
- 上下ガード = "guard"
- かわす = "evasion"
- 技 = "technique" or "buff"
- 霊撃 = "spirit"
- ジャンプ = "technique"

### Step 4: Extract Frame Data (057-モーションフレーム.md)

Open `057-モーションフレーム.md` and find your character's section.

**Table columns:**
- 準備移行F (Prep Transition) → 4 values for each stage (森/暗/断/時)
- 準備F (Preparation) → preparation frames
- 発動F (Activation) → activation frames

**Example from Yusuke - パンチ AX 地:**
```markdown
| 森 | 暗 | 断 | 時 | 準備F | 発動F |
| 39 | 37 | 36 | 36 | 30    | 141   |
```

Becomes:
```json
"frames": {
  "prepTransition": {
    "forest": 39,
    "dark": 37,
    "guillotine": 36,
    "timegap": 36
  },
  "preparation": 30,
  "activation": 141,
  "isAerial": false
}
```

**Stage names:**
- 森 = "forest"
- 暗 (暗黒ドーム) = "dark"
- 断 (断首台の丘) = "guillotine"
- 時 (時空の狭間) = "timegap"

## 📝 Template

Use `_template.json` in this directory as a starting point!

## ✅ Validation

After creating your JSON:

1. **Check syntax** - Make sure it's valid JSON
2. **Test in viewer** - Open `/ui/character-data-viewer.html`
3. **Add to loader** - Update `AVAILABLE_CHARACTERS` in `src/data/characterLoader.ts`

## 🎮 Example: Complete Move Entry

```json
{
  "id": "down_x",
  "command": "↓X",
  "name": "霊丸",
  "nameEn": "Spirit Gun",
  "type": "spirit",
  "priority": "highest",
  "successRate": 128,
  "evasionRate": 84,
  "power": 106,
  "balanceDrain": 124,
  "reikiCost": 8,
  "frames": {
    "prepTransition": {
      "forest": 56,
      "dark": 56,
      "guillotine": 49,
      "timegap": 52
    },
    "preparation": 110,
    "activation": 210,
    "isAerial": false
  }
}
```

## 💡 Tips

1. **Start with basics** - Get stats and moves working first
2. **Frame data can be 0** - If you don't have frame data yet, use all zeros
3. **Copy from existing** - Use `yusuke.json` as reference
4. **Transformation characters** - Set `canTransform: true` and add `transformInto` and `transformCondition`

## 🔗 Useful Files

- **Template:** `_template.json`
- **Example:** `yusuke.json` (complete with all frame data)
- **Type definitions:** `src/types/CharacterData.ts`
- **Loader:** `src/data/characterLoader.ts`

---

**Questions?** Check the existing character files for examples!
