#!/usr/bin/env python3
"""
Fix character battle command tables using HTML extraction
Apply the same approach as page 57 to character pages 024, 030-048
"""

import requests
from bs4 import BeautifulSoup
from pathlib import Path
import re

def fetch_page_html(page_id):
    """Fetch the raw HTML from a character page"""
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
        print(f"Error fetching page {page_id}: {e}")
        return None

def clean_html_table(table_html):
    """Clean up HTML table while preserving structure"""
    soup = BeautifulSoup(table_html, 'html.parser')

    # Remove atwiki-specific classes and attributes we don't need
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

def extract_character_data(html_content, page_id):
    """Extract character data including battle command table"""
    soup = BeautifulSoup(html_content, 'html.parser')

    # Find the main content area
    content_area = soup.find('div', {'id': 'wikibody'}) or soup.find('body')
    if not content_area:
        return None

    # Remove navigation elements
    for element in content_area.select('#header, #footer, #menubar, #toolbar, .navbar, .topicpath, script, style'):
        element.decompose()

    result = {
        'title': '',
        'basic_performance_table': '',
        'battle_command_table': '',
        'other_content': '',
        'notes': []
    }

    # Extract title from page title or h1
    title_elem = soup.find('title')
    if title_elem:
        title_text = title_elem.get_text()
        # Remove site suffix
        result['title'] = re.sub(r'\s*-\s*.*?wiki.*$', '', title_text, flags=re.IGNORECASE).strip()

    # Look for tables
    tables = content_area.find_all('table')

    # Usually character pages have 2 main tables: basic performance and battle commands
    if len(tables) >= 1:
        result['basic_performance_table'] = clean_html_table(str(tables[0]))

    if len(tables) >= 2:
        result['battle_command_table'] = clean_html_table(str(tables[1]))

    # Extract any character-specific notes
    for element in content_area.find_all(['div', 'p'], string=re.compile(r'霊撃.*は同じ|.*と.*は同じ')):
        result['notes'].append(element.get_text(strip=True))

    # Get other content (character description, move descriptions, etc.)
    # Remove the tables to get remaining content
    for table in content_area.find_all('table'):
        table.decompose()

    # Get remaining text content
    remaining_content = []
    for element in content_area.find_all(['h2', 'h3', 'h4', 'p', 'div']):
        text = element.get_text(strip=True)
        if text and len(text) > 5:
            if element.name.startswith('h'):
                remaining_content.append(f"{'#' * int(element.name[1:])} {text}")
            else:
                remaining_content.append(text)

    result['other_content'] = '\n\n'.join(remaining_content)

    return result

def update_character_markdown(page_id, character_data):
    """Update the character markdown file with HTML tables"""

    # Character page mapping
    char_names = {
        24: "幽助", 30: "桑原", 31: "蔵馬", 32: "妖狐蔵馬", 33: "飛影",
        34: "幻海", 35: "幻海(若)", 36: "鈴駒", 37: "凍矢", 38: "陣",
        39: "死々若丸", 40: "鴉", 41: "武威", 42: "戸愚呂兄", 43: "戸愚呂弟",
        44: "100%", 45: "神谷", 46: "刃霧", 47: "樹", 48: "仙水"
    }

    char_name = char_names.get(page_id, f"Character-{page_id}")

    content = f"""---
source: "https://w.atwiki.jp/yuyuz/pages/{page_id}.html"
id: {page_id}
title: "{char_name}"
fetched_at: "2025-09-30T01:13:12.120955"
---

# {char_name}

"""

    # Add notes if any
    if character_data['notes']:
        for note in character_data['notes']:
            content += f"{note}\n\n"

    # Add basic performance table
    if character_data['basic_performance_table']:
        content += "## 基本性能\n\n"
        content += '<div class="character-table">\n\n'
        content += character_data['basic_performance_table']
        content += '\n\n</div>\n\n'

    # Add battle command table
    if character_data['battle_command_table']:
        content += "## 戦闘コマンド\n\n"
        content += '<div class="character-table">\n\n'
        content += character_data['battle_command_table']
        content += '\n\n</div>\n\n'

    # Add other content
    if character_data['other_content']:
        content += character_data['other_content']

    # Add CSS
    content += """

<style>
.character-table {
    overflow-x: auto;
    margin: 20px 0;
}

.character-table table {
    border-collapse: collapse;
    width: 100%;
    font-size: 12px;
    border: 1px solid #ddd;
}

.character-table td, .character-table th {
    border: 1px solid #ddd;
    padding: 4px 6px;
    text-align: center;
}

.character-table tr:nth-child(even) {
    background-color: #f9f9f9;
}

.character-table tr:nth-child(odd) {
    background-color: #ffffff;
}
</style>

---

[「{char_name}」をウィキ内検索](https://w.atwiki.jp//w.atwiki.jp/yuyuz/search?andor=and&keyword={char_name})
"""

    return content

def process_character_page(page_id):
    """Process a single character page"""
    print(f"Processing page {page_id}...")

    # Fetch HTML
    html_content = fetch_page_html(page_id)
    if not html_content:
        return False

    # Extract data
    character_data = extract_character_data(html_content, page_id)
    if not character_data:
        return False

    # Update markdown
    updated_content = update_character_markdown(page_id, character_data)

    # Save file
    filename = f"{page_id:03d}-{character_data['title']}.md"
    output_path = Path("docs/spec_from_html/yuyuz_md") / filename

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(updated_content)

    print(f"Updated: {output_path}")
    return True

def main():
    """Main function to process all character pages"""

    # Character page IDs to process
    character_pages = [24] + list(range(30, 49))  # 024, 030-048

    print(f"Processing {len(character_pages)} character pages...")

    success_count = 0
    for page_id in character_pages:
        try:
            if process_character_page(page_id):
                success_count += 1
        except Exception as e:
            print(f"Error processing page {page_id}: {e}")

        # Rate limiting
        import time
        time.sleep(0.5)

    print(f"\nCompleted: {success_count}/{len(character_pages)} pages updated")

if __name__ == "__main__":
    main()