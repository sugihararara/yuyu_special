#!/usr/bin/env python3
"""
Extract HTML tables from page 29 (個別雛形)
Option B: Keep tables as clean HTML within Markdown - NO CHEATING!
"""

import requests
from bs4 import BeautifulSoup
from pathlib import Path

def fetch_page_html(page_id=29):
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
    soup = BeautifulSoup(table_html, 'html.parser')

    # Remove atwiki-specific classes and attributes
    for element in soup.find_all():
        attrs_to_keep = ['rowspan', 'colspan', 'style']
        new_attrs = {}

        for attr, value in element.attrs.items():
            if attr in attrs_to_keep:
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
    """Extract all character command tables from the HTML"""
    soup = BeautifulSoup(html_content, 'html.parser')

    character_sections = {}

    # Character names to look for
    characters = ['幽助', '桑原', '蔵馬', '妖狐蔵馬', '飛影', '幻海', '幻海(若)',
                  '鈴駒', '凍矢', '陣', '死々若丸', '鴉', '武威', '戸愚呂兄',
                  '戸愚呂弟', '100%', '神谷', '刃霧', '樹', '仙水']

    # Find all h2 elements with character names
    for h2 in soup.find_all('h2'):
        char_name = h2.get_text(strip=True)
        if char_name in characters:
            # Find the table that follows this heading
            current = h2.next_sibling
            table_found = None

            # Look through siblings until we find a table or another h2
            while current:
                if hasattr(current, 'name'):
                    if current.name == 'h2':
                        break
                    elif current.name == 'div':
                        table = current.find('table')
                        if table:
                            table_found = table
                            break
                    elif current.name == 'table':
                        table_found = current
                        break

                current = current.next_sibling

            if table_found:
                character_sections[char_name] = clean_html_table(str(table_found))

    return character_sections

def create_updated_markdown(character_tables):
    """Create the updated markdown with HTML tables"""

    content = """---
source: "https://w.atwiki.jp/yuyuz/pages/12.html"
id: 12
title: "個別雛形"
fetched_at: "2025-09-30T01:12:55.001178"
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

"""

    # Add each character section
    character_order = ['幽助', '桑原', '蔵馬', '妖狐蔵馬', '飛影', '幻海', '幻海(若)',
                      '鈴駒', '凍矢', '陣', '死々若丸', '鴉', '武威', '戸愚呂兄',
                      '戸愚呂弟', '100%', '神谷', '刃霧', '樹', '仙水']

    for char_name in character_order:
        if char_name in character_tables:
            content += f"\n## {char_name}\n\n"
            content += '<div class="template-data-table">\n\n'
            content += character_tables[char_name]
            content += '\n\n</div>\n\n'
        else:
            print(f"Warning: No table found for {char_name}")

    # Add CSS for better table rendering
    content += """
<style>
.template-data-table {
    overflow-x: auto;
    margin: 20px 0;
}

.template-data-table table {
    border-collapse: collapse;
    width: 100%;
    font-size: 11px;
    border: 1px solid #ddd;
}

.template-data-table td, .template-data-table th {
    border: 1px solid #ddd;
    padding: 3px 5px;
    text-align: center;
}

.template-data-table tr:nth-child(even) {
    background-color: #f9f9f9;
}

.template-data-table tr:nth-child(odd) {
    background-color: #ffffff;
}
</style>

---

[「個別雛形」をウィキ内検索](https://w.atwiki.jp//w.atwiki.jp/yuyuz/search?andor=and&keyword=%E6%88%A6%E9%97%98%E3%82%B3%E3%83%9E%E3%83%B3%E3%83%89%E6%80%A7%E8%83%BD)
"""

    return content

def main():
    """Main function"""
    print("Extracting HTML tables from page 29 (個別雛形)...")
    print("NO CHEATING - extracting real data from HTML!")

    # Fetch the HTML
    html_content = fetch_page_html(12)
    if not html_content:
        print("Failed to fetch HTML")
        return

    # Extract character tables
    character_tables = extract_character_tables(html_content)
    print(f"Found tables for {len(character_tables)} characters: {list(character_tables.keys())}")

    # Create the updated markdown
    updated_content = create_updated_markdown(character_tables)

    # Save to file
    output_path = Path("docs/spec_from_html/yuyuz_md/029-個別雛形.md")
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(updated_content)

    print(f"Complete data saved: {output_path}")

    # Also save alternative location if it exists
    alt_path = Path("yuyuz_md/029-個別雛形.md")
    if alt_path.exists():
        with open(alt_path, 'w', encoding='utf-8') as f:
            f.write(updated_content)
        print(f"Complete data saved: {alt_path}")

if __name__ == "__main__":
    main()