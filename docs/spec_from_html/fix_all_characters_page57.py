#!/usr/bin/env python3
"""
Fix all character sections in page 57 to match the 幽助 format
"""

from pathlib import Path

def fix_kuwabara_section():
    """Fix 桑原 section"""
    return """## 桑原

霊撃Bと次元刀、霊撃Yと霊撃力UPYは同じ

| 分類 | ボタン | 状態 | 準備移行F | | | | 準備F | 発動F | 準備移行F(森)+準備F | 準備F+発動F | 準備移行F(森)+準備F+発動F |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| | | | **森** | **暗** | **断** | **時** | | | | | |
| **パンチ** | AX | 地 | 40 | 38 | 37 | 37 | 30 | 142 | 70 | 172 | 212 |
| | | 空 | 26 | 26 | 26 | 26 | 28 | 114 | 54 | 142 | 168 |
| | BY | 地 | 40 | 38 | 37 | 37 | 30 | 122 | 70 | 152 | 192 |
| | | 空 | 26 | 26 | 26 | 26 | 28 | 94 | 54 | 122 | 148 |
| | 気合 | - | 24 | 24 | 24 | 24 | 28 | 105 | 52 | 133 | 157 |
| **技** | A | - | 51 | 50 | 48 | 50 | 38 | 138 | 89 | 176 | 227 |
| | B | - | 54 | 53 | 51 | 53 | 50 | 138 | 104 | 188 | 242 |
| | Y | 地 | 49 | 47 | 47 | 46 | 100 | 158 | 149 | 258 | 307 |
| | | 空 | 47 | 47 | 47 | 47 | 99 | 158 | 146 | 257 | 304 |
| **霊撃** | A | 地 | 43 | 43 | 43 | 43 | 98 | 100 | 141 | 198 | 241 |
| | | 空 | 42 | 42 | 42 | 42 | 98 | 99 | 140 | 197 | 239 |
| | B | 地 | 49 | 47 | 47 | 46 | 100 | 215 | 149 | 315 | 364 |
| | | 空 | 47 | 47 | 47 | 47 | 99 | 126 | 146 | 225 | 272 |
| | 次元刀 | 地 | 49 | 47 | 47 | 46 | 100 | 215 | 149 | 315 | 364 |
| | | 空 | 47 | 47 | 47 | 47 | 99 | 126 | 146 | 225 | 272 |
| | X | 地 | 41 | 39 | 38 | 38 | 99 | 193 | 140 | 292 | 333 |
| | | 空 | 30 | 30 | 30 | 30 | 98 | 181 | 128 | 279 | 309 |
| | Y | 地 | 49 | 47 | 47 | 46 | 100 | 233 | 149 | 333 | 382 |
| | | 空 | 47 | 47 | 47 | 47 | 99 | 221 | 146 | 320 | 367 |
| **霊撃力UP** | B | 地 | 49 | 47 | 47 | 46 | 120 | 219 | 169 | 339 | 388 |
| | | 空 | 47 | 47 | 47 | 47 | 119 | 143 | 166 | 262 | 309 |
| | Y | 地 | 49 | 47 | 47 | 46 | 100 | 233 | 149 | 333 | 382 |
| | | 空 | 47 | 47 | 47 | 47 | 99 | 221 | 146 | 320 | 367 |
| **アイテム** | 霊 | - | 52 | 51 | 49 | 51 | 40 | 172 | 92 | 212 | 264 |
| | 気 | - | 52 | 51 | 49 | 51 | 40 | 183 | 92 | 223 | 275 |
| | 愛 | - | 52 | 51 | 49 | 51 | 40 | 177 | 92 | 217 | 269 |
| **封じ行動** | - | - | 36 | 35 | 33 | 35 | - | - | - | - | - |

"""

def main():
    """Main function to fix all characters"""

    # Read the current file
    page_path = Path("docs/spec_from_html/yuyuz_md/057-モーションフレーム.md")

    if not page_path.exists():
        print(f"File not found: {page_path}")
        return

    with open(page_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the positions
    yusuke_start = content.find("## 幽助")
    kuwabara_start = content.find("## 桑原")
    kurama_start = content.find("## 蔵馬")

    if kuwabara_start == -1:
        print("桑原 section not found")
        return

    # Get the part before 桑原
    before_kuwabara = content[:kuwabara_start]

    # Get the part after 桑原 (starting from 蔵馬 if it exists)
    if kurama_start != -1:
        after_kuwabara = content[kurama_start:]
    else:
        after_kuwabara = ""

    # Combine with the fixed 桑原 section
    new_content = before_kuwabara + fix_kuwabara_section() + after_kuwabara

    # Write back
    with open(page_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"Fixed 桑原 section in: {page_path}")

if __name__ == "__main__":
    main()