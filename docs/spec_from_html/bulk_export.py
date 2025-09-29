#!/usr/bin/env python3
"""
Bulk export script for atwiki to Markdown
Fetches all pages from /list and converts them to Markdown
"""

import re
import requests
from bs4 import BeautifulSoup
from markdownify import markdownify as md
from pathlib import Path
import time
import sys
from datetime import datetime

BASE = "https://w.atwiki.jp/yuyuz"
LIST_URL = f"{BASE}/list"
OUTPUT_DIR = Path("yuyuz_md")

def fetch_page_list():
    """Fetch the list of all wiki pages"""
    print(f"Fetching page list from: {LIST_URL}")

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }

    try:
        response = requests.get(LIST_URL, timeout=20, headers=headers)
        response.raise_for_status()
        response.encoding = response.apparent_encoding
        return response.text
    except requests.RequestException as e:
        print(f"Error fetching page list: {e}")
        return None

def extract_page_info(html_content):
    """Extract page IDs and titles from the list page"""
    soup = BeautifulSoup(html_content, "html.parser")
    pages = {}

    # Find all links that point to wiki pages
    for link in soup.find_all("a", href=True):
        href = link.get("href", "")
        # Match pattern: /yuyuz/pages/{id}.html
        match = re.search(r'/yuyuz/pages/(\d+)\.html', href)
        if match:
            page_id = int(match.group(1))
            title = link.get_text(strip=True)
            if title:
                pages[page_id] = title

    return pages

def fetch_single_page(page_id):
    """Fetch a single page from atwiki"""
    url = f"{BASE}/pages/{page_id}.html"

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }

    max_retries = 3
    for attempt in range(max_retries):
        try:
            response = requests.get(url, timeout=20, headers=headers)
            response.raise_for_status()
            response.encoding = response.apparent_encoding
            return response.text
        except requests.RequestException as e:
            if attempt < max_retries - 1:
                print(f"  Retry {attempt + 1}/{max_retries} for page {page_id}")
                time.sleep(2)
            else:
                print(f"  Failed to fetch page {page_id}: {e}")
                return None

def clean_html(html_content):
    """Clean HTML by removing navigation, ads, and other non-content elements"""
    soup = BeautifulSoup(html_content, "html.parser")

    # Check if page exists
    if "指定されたページ番号は存在しません" in str(soup):
        return None

    # Remove navigation and non-content elements
    selectors_to_remove = [
        "#header",
        "#footer",
        "#wikibody > .menu",
        "#wikibody > .side",
        "#rightmenu",
        "#leftmenu",
        ".navbar",
        ".topicpath",
        "#menubar",
        "#toolbar",
        ".atwiki-ad",
        "script",
        "style",
        "noscript",
        "#wikitop",
        "#wikibottom",
        ".page_navi",
    ]

    for selector in selectors_to_remove:
        for element in soup.select(selector):
            element.decompose()

    # Find the main content area
    content_selectors = [
        "#wikibody",
        "#content",
        ".wiki-content",
        "article",
        "main",
    ]

    for selector in content_selectors:
        content = soup.select_one(selector)
        if content:
            return content

    # Fallback to body
    content = soup.find("body")
    return content if content else soup

def absolutize_urls(soup, base_url="https://w.atwiki.jp"):
    """Convert relative URLs to absolute URLs"""
    # Handle images
    for img in soup.find_all("img"):
        src = img.get("src", "")
        if src.startswith("/"):
            img["src"] = base_url + src
        elif src.startswith("//"):
            img["src"] = "https:" + src

    # Handle links
    for link in soup.find_all("a"):
        href = link.get("href", "")
        if href.startswith("/"):
            link["href"] = base_url + href
        elif href.startswith("//"):
            link["href"] = "https:" + href

    return soup

def convert_to_markdown(soup):
    """Convert cleaned HTML to Markdown"""
    markdown_text = md(
        str(soup),
        heading_style="ATX",
        bullets="*",
        code_language="",
    )

    # Clean up excessive newlines
    markdown_text = re.sub(r'\n{3,}', '\n\n', markdown_text)
    markdown_text = markdown_text.strip()

    return markdown_text

def save_markdown(content, page_id, title):
    """Save markdown content to file"""
    # Sanitize title for filename
    safe_title = re.sub(r'[<>:"/\\|?*]', '', title)
    safe_title = safe_title.strip()[:50]
    filename = f"{page_id:03d}-{safe_title}.md"

    filepath = OUTPUT_DIR / filename

    # Write content
    with open(filepath, "w", encoding="utf-8") as f:
        # Add front matter
        f.write("---\n")
        f.write(f'source: "{BASE}/pages/{page_id}.html"\n')
        f.write(f'id: {page_id}\n')
        f.write(f'title: "{title}"\n')
        f.write(f'fetched_at: "{datetime.now().isoformat()}"\n')
        f.write("---\n\n")
        f.write(content)

    return filepath

def convert_page(page_id, title):
    """Convert a single page to Markdown"""
    print(f"Converting page {page_id}: {title}")

    # Check if already exists
    safe_title = re.sub(r'[<>:"/\\|?*]', '', title)
    safe_title = safe_title.strip()[:50]
    filename = f"{page_id:03d}-{safe_title}.md"
    filepath = OUTPUT_DIR / filename

    if filepath.exists():
        print(f"  Skipping (already exists): {filename}")
        return True

    # Fetch the page
    html_content = fetch_single_page(page_id)
    if not html_content:
        print(f"  Failed to fetch page")
        return False

    # Clean the HTML
    cleaned_soup = clean_html(html_content)
    if not cleaned_soup:
        print(f"  Page is deleted or doesn't exist")
        return False

    # Absolutize URLs
    cleaned_soup = absolutize_urls(cleaned_soup)

    # Convert to Markdown
    markdown_content = convert_to_markdown(cleaned_soup)

    # Save the result
    filepath = save_markdown(markdown_content, page_id, title)
    print(f"  Saved: {filepath.name}")

    return True

def main():
    """Main conversion process"""
    print("=" * 60)
    print("atwiki to Markdown Bulk Converter")
    print("=" * 60)

    # Create output directory
    OUTPUT_DIR.mkdir(exist_ok=True)
    print(f"Output directory: {OUTPUT_DIR}")

    # Fetch page list
    list_html = fetch_page_list()
    if not list_html:
        print("Failed to fetch page list")
        return 1

    # Extract page info
    pages = extract_page_info(list_html)
    if not pages:
        print("No pages found")
        return 1

    print(f"\nFound {len(pages)} pages to convert")

    # Ask for confirmation
    response = input("\nProceed with conversion? (y/N): ")
    if response.lower() != 'y':
        print("Conversion cancelled")
        return 0

    # Convert pages
    print("\nStarting conversion...")
    print("=" * 60)

    success_count = 0
    failed_pages = []

    for page_id in sorted(pages.keys()):
        title = pages[page_id]

        try:
            if convert_page(page_id, title):
                success_count += 1
            else:
                failed_pages.append((page_id, title))
        except Exception as e:
            print(f"  Error converting page {page_id}: {e}")
            failed_pages.append((page_id, title))

        # Rate limiting
        time.sleep(0.7)

    # Summary
    print("\n" + "=" * 60)
    print("Conversion Complete!")
    print("=" * 60)
    print(f"Successfully converted: {success_count}/{len(pages)} pages")

    if failed_pages:
        print(f"\nFailed pages ({len(failed_pages)}):")
        for page_id, title in failed_pages:
            print(f"  - {page_id}: {title}")

    print(f"\nOutput saved to: {OUTPUT_DIR.absolute()}")

    return 0

if __name__ == "__main__":
    sys.exit(main())