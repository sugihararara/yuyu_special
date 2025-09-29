#!/usr/bin/env python3
"""
Fix complex tables in markdown files
Specifically handles the character template tables with proper formatting
"""

from pathlib import Path
import re

def create_fixed_page_29():
    """Create a properly formatted version of page 29 (個別雛形)"""

    content = """---
source: "https://w.atwiki.jp/yuyuz/pages/29.html"
id: 29
title: "個別雛形"
fetched_at: "2025-09-30T01:13:12.120955"
---

## 基本性能

| 項目 | 詳細 | 数値 |
| --- | --- | --- |
| **防御力** | 防御値(16進数) |  |
| | ダメージ/威力(%) | % |
| **総当たり戦防御力** | 防御値(16進数) |  |
| | ダメージ/威力(%) | % |
| **バランス防御力** | バランス防御値(16進数) |  |
| | バランスダメージ/奪バランス値(%) | % |
| **滞空時間** | 滞空時間 | F |
| | 霊撃ゲージn本分 | 本 |
| **ダウン時間** | ダウン時間 | F |
| | ダウン時間(30/秒短縮) | F |
| | ダウン時間(60/秒短縮) | F |
| **気合の入ったパンチ** | 気合いの入ったパンチ値(16進数) |  |
| | 発生率(%) | % |
| **クリーンヒット** | クリーンヒット値(16進数) |  |
| | 発生率(%) | % |

<br>

### 複数状態の性能比較

| 項目 | 詳細 | 状態1 | 状態2 | 状態3 |
| --- | --- | --- | --- | --- |
| **防御力** | 防御値(16進数) |  |  |  |
| | ダメージ/威力(%) | % | % | % |
| **総当たり戦防御力** | 防御値(16進数) |  |  |  |
| | ダメージ/威力(%) | % | % | % |
| **バランス防御力** | バランス防御値(16進数) |  |  |  |
| | バランスダメージ/奪バランス値(%) | % | % | % |
| **滞空時間** | 滞空時間 | F | F | F |
| | 霊撃ゲージn本分 | 本 | 本 | 本 |
| **ダウン時間** | ダウン時間 | F | F | F |
| | ダウン時間(30/秒短縮) | F | F | F |
| | ダウン時間(60/秒短縮) | F | F | F |
| **気合の入ったパンチ** | 気合いの入ったパンチ値(16進数) |  |  |  |
| | 発生率(%) | % | % | % |
| **クリーンヒット** | クリーンヒット値(16進数) |  |  |  |
| | 発生率(%) | % | % | % |

## 戦闘コマンド

| 分類 | 方向 | ボタン | 名称 | 消費 | 種類 | 効果 | 成功 | 回避 | 威力 | 奪バ |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **パンチ** | → | A | 下強パンチ | 0 | パンチ | ダメージ |  |  |  |  |
| | | X | 上強パンチ | | | | | | | |
| | | B | 下連打パンチ | | | | | | | |
| | | Y | 上連打パンチ | | | | | | | |
| **防御** | ← | A | 受ける | 0 | 受ける | 接触と伸びと飛びを受け止める |  |  | 0 | 0 |
| | | B | 下ガード | | 下ガード | 接触と下パンチをかわす | | | | |
| | | X | 上ガード | | 上ガード | 接触と上パンチをかわす | | | | |
| | | Y | かわす | | かわす | 飛びと伸びと衝撃波をかわす | | | | |
| **技** | ↑ | A |  |  | 自分即効 |  |  |  | 0 | 0 |
| | | B | | | 自分即効 | | | | | |
| | | X | ジャンプ | 3 | ジャンプ | 空中へジャンプ | | | | |
| | | Y | | | 自分即効 | | | | | |
| **霊撃** | ↓ | A |  |  |  |  |  |  |  |  |
| | | B | | | | | | | | |
| | | X | | | | | | | | |
| | | Y | | | | | | | | |
| **霊撃力UP** | ↓ | A |  |  |  |  |  |  |  |  |
| | | B | | | | | | | | |
| | | X | | | | | | | | |
| | | Y | | | | | | | | |
| **その他** | - | A or Y | アイテム | 0 | 自分即効 | アイテムを使用 |  |  | 0 | 0 |
| | - | なし | 無行動 | | 無行動 | なし | | | | |

---

[「個別雛形」をウィキ内検索](https://w.atwiki.jp//w.atwiki.jp/yuyuz/search?andor=and&keyword=%E5%80%8B%E5%88%A5%E9%9B%9B%E5%BD%A2)
"""

    return content

def fix_character_page_tables(page_path):
    """Fix tables in a character page to match the template format"""

    with open(page_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if this is a character page with the broken table format
    if '## 基本性能' not in content or '## 戦闘コマンド' not in content:
        return None

    # Extract the front matter
    front_matter = ""
    if content.startswith('---'):
        parts = content.split('---', 2)
        if len(parts) >= 3:
            front_matter = f"---{parts[1]}---\n\n"
            content = parts[2]

    # For now, just flag pages that need manual fixing
    # since the actual data extraction would require parsing the original HTML
    return None  # Return None to indicate we need to reprocess from HTML

def main():
    """Fix the complex tables in markdown files"""

    # First, fix page 29 (the template)
    print("Fixing page 29 (個別雛形)...")
    page_29_path = Path("docs/spec_from_html/yuyuz_md/029-個別雛形.md")

    if page_29_path.exists():
        fixed_content = create_fixed_page_29()
        with open(page_29_path, 'w', encoding='utf-8') as f:
            f.write(fixed_content)
        print(f"Fixed: {page_29_path}")

    # Also save to the root yuyuz_md directory if it exists
    alt_path = Path("yuyuz_md/029-個別雛形.md")
    if alt_path.exists():
        fixed_content = create_fixed_page_29()
        with open(alt_path, 'w', encoding='utf-8') as f:
            f.write(fixed_content)
        print(f"Fixed: {alt_path}")

    # List other character pages that might need fixing
    character_pages = [
        "024-幽助.md",
        "030-桑原.md",
        "031-蔵馬.md",
        "032-妖狐蔵馬.md",
        "033-飛影.md",
        "034-幻海.md",
        "035-幻海(若).md",
        "036-鈴駒.md",
        "037-凍矢.md",
        "038-陣.md",
        "039-死々若丸.md",
        "040-鴉.md",
        "041-武威.md",
        "042-戸愚呂兄.md",
        "043-戸愚呂弟.md",
        "044-100%.md",
        "045-神谷.md",
        "046-刃霧.md",
        "047-樹.md",
        "048-仙水.md"
    ]

    print("\nCharacter pages that may have complex tables needing review:")
    for page_name in character_pages:
        for base_dir in [Path("docs/spec_from_html/yuyuz_md"), Path("yuyuz_md")]:
            page_path = base_dir / page_name
            if page_path.exists():
                print(f"  - {page_path}")
                break

if __name__ == "__main__":
    main()