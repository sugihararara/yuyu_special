#!/usr/bin/env python3
"""
Fix only the 幽助 section table in page 57 (モーションフレーム)
Keep all other content as-is
"""

from pathlib import Path

def fix_page_57_yusuke_only():
    """Fix only the Yusuke section while preserving everything else"""

    # Read the original file
    page_57_path = Path("docs/spec_from_html/yuyuz_md/057-モーションフレーム.md")

    if not page_57_path.exists():
        print(f"File not found: {page_57_path}")
        return

    with open(page_57_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the 幽助 section and the next section (桑原)
    yusuke_start = content.find("## 幽助")
    kuwabara_start = content.find("## 桑原")

    if yusuke_start == -1:
        print("幽助 section not found")
        return

    # Extract parts
    before_yusuke = content[:yusuke_start]

    if kuwabara_start != -1:
        after_yusuke = content[kuwabara_start:]
    else:
        # If 桑原 section not found, just take everything after some point
        # We'll look for where the current 幽助 section ends
        after_yusuke = ""
        # Try to find the end of the file or next major section
        lines = content[yusuke_start:].split('\n')
        for i, line in enumerate(lines):
            if i > 10 and line.startswith('## '):  # Found next section
                after_yusuke = '\n'.join(lines[i:])
                break

    # Create the fixed 幽助 section
    fixed_yusuke = """## 幽助

霊撃Xと霊撃力UPXは同じ

| 分類 | ボタン | 状態 | 準備移行F | | | | 準備F | 発動F | 準備移行F(森)+準備F | 準備F+発動F | 準備移行F(森)+準備F+発動F |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| | | | **森** | **暗** | **断** | **時** | | | | | |
| **パンチ** | AX | 地 | 39 | 37 | 36 | 36 | 30 | 141 | 69 | 171 | 210 |
| | | 空 | 25 | 25 | 25 | 25 | 28 | 113 | 53 | 141 | 166 |
| | BY | 地 | 39 | 37 | 36 | 36 | 30 | 121 | 69 | 151 | 190 |
| | | 空 | 25 | 25 | 25 | 25 | 28 | 93 | 53 | 121 | 146 |
| | 気合 | - | 23 | 23 | 23 | 23 | 28 | 104 | 51 | 132 | 155 |
| **技** | A | - | 49 | 48 | 46 | 48 | 39 | 137 | 88 | 176 | 225 |
| | B | - | 52 | 51 | 49 | 51 | 50 | 137 | 102 | 187 | 239 |
| | Y | - | 47 | 46 | 44 | 46 | 39 | 154 | 86 | 193 | 240 |
| **霊撃** | A | - | 35 | 34 | 32 | 34 | 90 | 121 | 125 | 211 | 246 |
| | B | - | 58 | 56 | 55 | 55 | 70 | 59 | 128 | 129 | 187 |
| | X | 地 | 56 | 56 | 49 | 52 | 110 | 210 | 166 | 320 | 376 |
| | | 空 | 53 | 52 | 50 | 52 | 100 | 207 | 153 | 307 | 360 |
| | Y | - | 47 | 46 | 44 | 46 | 71 | 159 | 118 | 230 | 277 |
| **霊撃力UP** | B | - | 58 | 56 | 55 | 55 | 70 | 94 | 128 | 164 | 222 |
| | X | 地 | 56 | 56 | 49 | 52 | 110 | 210 | 166 | 320 | 376 |
| | | 空 | 53 | 52 | 50 | 52 | 100 | 207 | 153 | 307 | 360 |
| **アイテム** | 霊 | - | 49 | 48 | 46 | 48 | 40 | 170 | 89 | 210 | 259 |
| | 気 | - | 49 | 48 | 46 | 48 | 40 | 181 | 89 | 221 | 270 |
| | 愛 | - | 49 | 48 | 46 | 48 | 40 | 175 | 89 | 215 | 264 |
| **封じ行動** | - | - | 35 | 34 | 32 | 34 | - | - | - | - | - |

"""

    # Combine the parts
    new_content = before_yusuke + fixed_yusuke + after_yusuke

    # Write back
    with open(page_57_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"Fixed 幽助 section in: {page_57_path}")

    # Also fix in alternative location if it exists
    alt_path = Path("yuyuz_md/057-モーションフレーム.md")
    if alt_path.exists():
        with open(alt_path, 'r', encoding='utf-8') as f:
            alt_content = f.read()

        # Same process for alt file
        yusuke_start = alt_content.find("## 幽助")
        kuwabara_start = alt_content.find("## 桑原")

        if yusuke_start != -1:
            before_yusuke = alt_content[:yusuke_start]
            if kuwabara_start != -1:
                after_yusuke = alt_content[kuwabara_start:]
            else:
                after_yusuke = ""

            new_alt_content = before_yusuke + fixed_yusuke + after_yusuke

            with open(alt_path, 'w', encoding='utf-8') as f:
                f.write(new_alt_content)

            print(f"Fixed 幽助 section in: {alt_path}")

if __name__ == "__main__":
    fix_page_57_yusuke_only()