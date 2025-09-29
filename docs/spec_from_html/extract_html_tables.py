#!/usr/bin/env python3
"""
Extract HTML tables from page 57 and embed them in Markdown
Option B: Keep tables as clean HTML within Markdown
"""

import requests
from bs4 import BeautifulSoup
from pathlib import Path
import re

def fetch_page_html(page_id=57):
    """Fetch the raw HTML from the page"""
    url = f"https://w.atwiki.jp/yuyuz/pages/{page_id}.html"

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }

    try:
        response = requests.get(url, timeout=20, headers=headers)
        response.raise_for_status()
        response.encoding = response.apparent_encoding
        return response.text
    except requests.RequestException as e:
        print(f"Error fetching page: {e}")
        return None

def clean_html_table(table_html):
    """Clean up HTML table while preserving structure"""
    # Parse the table
    soup = BeautifulSoup(table_html, 'html.parser')

    # Remove atwiki-specific classes and attributes we don't need
    for element in soup.find_all():
        # Keep essential attributes
        attrs_to_keep = ['rowspan', 'colspan', 'style']
        new_attrs = {}

        for attr, value in element.attrs.items():
            if attr in attrs_to_keep:
                # Clean up style attribute
                if attr == 'style':
                    # Keep only text-align styles
                    if 'text-align:center' in value:
                        new_attrs[attr] = 'text-align:center;'
                    elif 'text-align:right' in value:
                        new_attrs[attr] = 'text-align:right;'
                else:
                    new_attrs[attr] = value

        element.attrs = new_attrs

    return str(soup)

def extract_character_tables(html_content):
    """Extract all character tables from the HTML"""
    soup = BeautifulSoup(html_content, 'html.parser')

    # Find all character sections
    character_sections = {}

    # Look for h2 elements with character names
    for h2 in soup.find_all('h2'):
        char_name = h2.get_text(strip=True)
        if char_name in ['幽助', '桑原', '蔵馬', '妖狐蔵馬', '飛影', '幻海', '幻海(若)',
                        '鈴駒', '凍矢', '陣', '死々若丸', '鴉', '武威', '戸愚呂兄',
                        '戸愚呂弟', '100%', '神谷', '刃霧', '樹', '仙水']:

            # Find the table that follows this heading
            current = h2.next_sibling
            table_found = None
            note_text = ""

            # Look through siblings until we find a table or another h2
            while current:
                if hasattr(current, 'name'):
                    if current.name == 'h2':
                        # Found next character section
                        break
                    elif current.name == 'div':
                        # Check if this div contains a table
                        table = current.find('table')
                        if table:
                            table_found = table
                            break
                    elif current.name == 'table':
                        table_found = current
                        break
                else:
                    # Check for text content (like notes)
                    text = str(current).strip()
                    if text and len(text) > 10 and '霊撃' in text:
                        note_text = text

                current = current.next_sibling

            if table_found:
                character_sections[char_name] = {
                    'table': clean_html_table(str(table_found)),
                    'note': note_text
                }

    return character_sections

def create_updated_markdown(character_tables):
    """Create the updated markdown with HTML tables"""

    content = """---
source: "https://w.atwiki.jp/yuyuz/pages/57.html"
id: 57
title: "モーションフレーム"
fetched_at: "2025-09-30T01:13:41.489250"
---

* [幽助](#1)
* [桑原](#2)
* [蔵馬](#3)
* [妖狐蔵馬](#4)
* [飛影](#5)
* [幻海](#6)
* [幻海(若)](#7)
* [鈴駒](#8)
* [凍矢](#9)
* [陣](#10)
* [死々若丸](#11)
* [鴉](#12)
* [武威](#13)
* [戸愚呂兄](#14)
* [戸愚呂弟](#15)
* [100%](#16)
* [神谷](#17)
* [刃霧](#18)
* [樹](#19)
* [仙水](#20)
* [反射飛び(霊)](#22)

闘気を溜められるフレーム数。
先手行動決定Fを1F目として計測。
時間停止5Fや処理落ちFは差し引き済み。
準備移行Fはステージによって異なる。
暗＝暗黒ドーム、断＝断首台の丘、時＝時空の狭間
亜空間は時空の狭間と全く同じなので省略。
相手即効は相手キャラによってフレーム数が変化するため、発動Fは相手キャラが映る直前Fを記載。

#### 闘気MAXまでのフレーム数

| | 通常 | 闘気UP | 闘気DOWN |
| --- | --- | --- | --- |
| パンチ | 61 | 21 | 90 |
| 防御 | 73 | 24 | 107 |
| 技 | 96 | 32 | 142 |
| 霊撃 | 121 | 41 | 179 |

"""

    # Add each character section
    character_order = ['幽助', '桑原', '蔵馬', '妖狐蔵馬', '飛影', '幻海', '幻海(若)',
                      '鈴駒', '凍矢', '陣', '死々若丸', '鴉', '武威', '戸愚呂兄',
                      '戸愚呂弟', '100%', '神谷', '刃霧', '樹', '仙水']

    for char_name in character_order:
        if char_name in character_tables:
            char_data = character_tables[char_name]
            content += f"\n## {char_name}\n\n"

            if char_data['note']:
                content += f"{char_data['note']}\n\n"

            # Add the HTML table with proper styling
            content += '<div class="frame-data-table">\n\n'
            content += char_data['table']
            content += '\n\n</div>\n\n'

    # Add CSS for better table rendering
    content += """
<style>
.frame-data-table {
    overflow-x: auto;
    margin: 20px 0;
}

.frame-data-table table {
    border-collapse: collapse;
    width: 100%;
    font-size: 12px;
    border: 1px solid #ddd;
}

.frame-data-table td, .frame-data-table th {
    border: 1px solid #ddd;
    padding: 4px 6px;
    text-align: center;
}

.frame-data-table tr:nth-child(even) {
    background-color: #f9f9f9;
}

.frame-data-table tr:nth-child(odd) {
    background-color: #ffffff;
}
</style>

---

[「モーションフレーム」をウィキ内検索](https://w.atwiki.jp//w.atwiki.jp/yuyuz/search?andor=and&keyword=%E3%83%A2%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%95%E3%83%AC%E3%83%BC%E3%83%A0)
"""

    return content

def main():
    """Main function"""
    print("Extracting HTML tables from page 57...")

    # Fetch the HTML
    html_content = fetch_page_html(57)
    if not html_content:
        print("Failed to fetch HTML")
        return

    # Extract character tables
    character_tables = extract_character_tables(html_content)
    print(f"Found tables for {len(character_tables)} characters: {list(character_tables.keys())}")

    # Create the updated markdown
    updated_content = create_updated_markdown(character_tables)

    # Save to file
    output_path = Path("docs/spec_from_html/yuyuz_md/057-モーションフレーム.md")
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(updated_content)

    print(f"Updated file saved: {output_path}")

    # Also save alternative location if it exists
    alt_path = Path("yuyuz_md/057-モーションフレーム.md")
    if alt_path.exists():
        with open(alt_path, 'w', encoding='utf-8') as f:
            f.write(updated_content)
        print(f"Updated file saved: {alt_path}")

if __name__ == "__main__":
    main()