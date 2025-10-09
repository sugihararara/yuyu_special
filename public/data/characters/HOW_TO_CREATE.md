# How to Create Character Data Files

This guide explains how to create character data for the game using the **split file structure**.

## 📁 File Structure (NEW!)

Each character has **3 separate JSON files** in their own directory:

```
public/data/characters/
  [character_id]/
    stats.json     - Character metadata + base stats
    moves.json     - Move definitions (without frames)
    frames.json    - Frame data (ground + aerial variants)
```

**Example:**
```
yusuke/
├── stats.json
├── moves.json
└── frames.json
```

## 📖 Where to Get the Data

All character data comes from the Japanese wiki documentation:

### Main Sources:
1. **Character Stats** - `docs/spec_from_html/yuyuz_md/024-048-*.md`
   - Example: `024-幽助.md` for Yusuke
   - Each character has their own file

2. **Frame Data** - `docs/spec_from_html/yuyuz_md/057-モーションフレーム.md`
   - Motion frame timing for all characters
   - Stage-dependent preparation frames
   - Separate 地 (ground) and 空 (aerial) variants

---

## 🎯 Step-by-Step Process

### Step 1: Create Character Directory

```bash
mkdir public/data/characters/[character_id]
```

Example: `mkdir public/data/characters/kurama`

---

### Step 2: Create `stats.json`

This file contains **metadata** and **base stats**.

#### Find Character Documentation

Go to `docs/spec_from_html/yuyuz_md/` and find your character:
- `024-幽助.md` - Yusuke
- `030-桑原.md` - Kuwabara
- `033-飛影.md` - Hiei
- etc.

#### Extract Base Stats (基本性能)

Find the table labeled **基本性能**:

**Mapping:**
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

**Becomes `stats.json`:**
```json
{
  "id": "yusuke",
  "name": "幽助",
  "nameEn": "Yusuke Urameshi",
  "canTransform": false,

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
}
```

**For transformation characters (like Hiei):**
```json
{
  "id": "hiei",
  "name": "飛影",
  "nameEn": "Hiei",
  "canTransform": true,
  "transformInto": "hiei_dragon",
  "transformCondition": "Successfully absorb reflected Black Dragon Wave",

  "stats": { ... }
}
```

---

### Step 3: Create `moves.json`

This file contains **move definitions** (without frame data).

#### Extract Move Data (戦闘コマンド)

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

**Becomes entry in `moves.json`:**
```json
[
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
    "reikiCost": 0
  },
  {
    "id": "forward_x",
    "command": "→X",
    ...
  }
]
```

**Move ID naming:**
- Forward (→) = `forward_a`, `forward_b`, `forward_x`, `forward_y`
- Back (←) = `back_a`, `back_b`, `back_x`, `back_y`
- Up (↑) = `up_a`, `up_b`, `up_x`, `up_y`
- Down (↓) = `down_a`, `down_b`, `down_x`, `down_y`
- Spirit Boost variants = `spirit_boost_down_a`, etc.

**Move types:**
- パンチ = "punch"
- 防御 / 受ける = "defense"
- 上下ガード = "guard"
- かわす = "evasion"
- 技 = "technique" or "buff"
- 霊撃 = "spirit"
- ジャンプ = "technique"

---

### Step 4: Create `frames.json`

This file contains **frame data** with ground and optional aerial variants.

#### Extract Frame Data (057-モーションフレーム.md)

Open `057-モーションフレーム.md` and find your character's section.

**Table columns:**
- 準備移行F (Prep Transition) → 4 values for each stage (森/暗/断/時)
- 準備F (Preparation) → preparation frames
- 発動F (Activation) → activation frames
- 地/空 → ground vs aerial variant

**Example from Yusuke - パンチ AX:**

```markdown
地: 森39 暗37 断36 時36 | 準備30 | 発動141
空: 森25 暗25 断25 時25 | 準備28 | 発動113
```

**Becomes entry in `frames.json`:**
```json
{
  "forward_a": {
    "ground": {
      "prepTransition": {
        "forest": 39,
        "dark": 37,
        "guillotine": 36,
        "timegap": 36
      },
      "preparation": 30,
      "activation": 141
    },
    "aerial": {
      "prepTransition": {
        "forest": 25,
        "dark": 25,
        "guillotine": 25,
        "timegap": 25
      },
      "preparation": 28,
      "activation": 113
    }
  },
  "forward_x": {
    ...
  }
}
```

**Stage names:**
- 森 = "forest" (暗黒武術会の森)
- 暗 = "dark" (暗黒ドーム)
- 断 = "guillotine" (断首台の丘)
- 時 = "timegap" (時空の狭間)

**Aerial variants:**
- Include `"aerial"` object if the move has 空 (aerial) data in the doc
- Omit `"aerial"` if the move only has 地 (ground) data
- Defensive moves (←A/B/X/Y) and Jump (↑X) have no frame data (all 0s)

---

## ✅ Validation

After creating your 3 JSON files:

1. **Check syntax** - Make sure all files are valid JSON
2. **Test in viewer** - Open `/ui/character-data-viewer.html`
3. **Add to loader** - Update `AVAILABLE_CHARACTERS` in `src/data/characterLoader.ts`:
   ```ts
   export const AVAILABLE_CHARACTERS: CharacterId[] = [
     'yusuke',
     'kuwabara',
     'hiei',
     'kurama', // <-- Add new character here
   ];
   ```

---

## 🎮 Complete Example Files

### `stats.json`
```json
{
  "id": "yusuke",
  "name": "幽助",
  "nameEn": "Yusuke Urameshi",
  "canTransform": false,

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
}
```

### `moves.json` (excerpt)
```json
[
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
    "reikiCost": 8
  }
]
```

### `frames.json` (excerpt)
```json
{
  "down_x": {
    "ground": {
      "prepTransition": {
        "forest": 56,
        "dark": 56,
        "guillotine": 49,
        "timegap": 52
      },
      "preparation": 110,
      "activation": 210
    },
    "aerial": {
      "prepTransition": {
        "forest": 53,
        "dark": 52,
        "guillotine": 50,
        "timegap": 52
      },
      "preparation": 100,
      "activation": 207
    }
  }
}
```

---

## ⚠️ Common Notes

#### 1. Defensive Moves & Jump Are 0F (Correct!)
Defensive moves (`back_a`, `back_b`, `back_x`, `back_y`) and Jump (`up_x`) have all frames set to `0`.
- **This is CORRECT** - They are instant/reactive actions
- The frame data doc (057-モーションフレーム.md) does NOT have frame data for these moves
- Only offensive moves (パンチ, 技, 霊撃) have frame data tables

#### 2. Aerial Variants (地/空)
- Most punch moves (AX, BY) have aerial variants
- Many spirit moves have aerial variants
- Buff/defensive moves typically do NOT have aerial variants
- If 057-モーションフレーム.md only shows 地 (ground), omit the `"aerial"` field

#### 3. Move Priority Values
Priority is set based on move type:
- `"low"` - Most moves
- `"medium"` - Contact spirit moves (接触)
- `"high"` - Extension moves (伸び)
- `"highest"` - Flying spirit moves (飛び)

---

## 💡 Tips

1. **Use existing characters as reference** - Look at `yusuke/`, `kuwabara/`, or `hiei/` directories
2. **Start with stats and moves** - Get those working first, frame data can be added later
3. **Frame data can be 0** - If you don't have frame data yet, use all zeros (except for moves that should have data)
4. **Check for aerial variants** - Look for both 地 and 空 entries in 057-モーションフレーム.md

---

## 🔗 Useful Files

- **Examples:** `yusuke/`, `kuwabara/`, `hiei/` directories
- **Type definitions:** `src/types/CharacterData.ts`
- **Loader:** `src/data/characterLoader.ts`
- **Viewer:** `public/ui/character-data-viewer.html`

---

**Questions?** Check the existing character directories for complete examples!
