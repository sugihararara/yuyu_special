#!/usr/bin/env python3
"""
Bulk export script for sfcyuhakutokubetsu atwiki to Markdown with image support
Fetches all pages from /list and converts them to Markdown
Downloads and saves images locally
"""

import re
import requests
from bs4 import BeautifulSoup
from markdownify import markdownify as md
from pathlib import Path
import time
import sys
from datetime import datetime
import os
from urllib.parse import urljoin, urlparse

BASE = "https://w.atwiki.jp/sfcyuhakutokubetsu"
LIST_URL = f"{BASE}/list"
OUTPUT_DIR = Path("sfc_yuhaku_md")
IMAGES_DIR = OUTPUT_DIR / "images"

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
        # Match pattern: /sfcyuhakutokubetsu/pages/{id}.html
        match = re.search(r'/sfcyuhakutokubetsu/pages/(\d+)\.html', href)
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

def download_image(img_url, page_id):
    """Download an image and save it locally"""
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Referer": f"{BASE}/pages/{page_id}.html"
        }

        response = requests.get(img_url, timeout=20, headers=headers)
        response.raise_for_status()

        # Extract filename from URL
        url_path = urlparse(img_url).path
        filename = os.path.basename(url_path)

        # If no extension, try to detect from content-type
        if '.' not in filename:
            content_type = response.headers.get('content-type', '')
            if 'image/jpeg' in content_type:
                filename += '.jpg'
            elif 'image/png' in content_type:
                filename += '.png'
            elif 'image/gif' in content_type:
                filename += '.gif'

        # Save with page ID prefix to avoid conflicts
        local_filename = f"page{page_id}_{filename}"
        local_path = IMAGES_DIR / local_filename

        with open(local_path, 'wb') as f:
            f.write(response.content)

        print(f"    Downloaded image: {local_filename}")
        return local_filename

    except Exception as e:
        print(f"    Failed to download image {img_url}: {e}")
        return None

def process_images(soup, page_id):
    """Find and download images, update their src to local paths"""
    images_found = []

    for img in soup.find_all("img"):
        src = img.get("src", "")

        # Skip common UI images
        if any(skip in src for skip in ["atwiki_logo", "button", "recruit", "suggestion", "hatena", "counter", "fc2"]):
            continue

        # Skip data URIs
        if src.startswith("data:"):
            continue

        # Make absolute URL
        if src.startswith("//"):
            img_url = "https:" + src
        elif src.startswith("/"):
            img_url = "https://w.atwiki.jp" + src
        elif not src.startswith("http"):
            img_url = urljoin(f"{BASE}/pages/{page_id}.html", src)
        else:
            img_url = src

        # Check if this is a content image (from atwiki)
        if "atwiki" in img_url and ("attach" in img_url or "img.atwiki.jp" in img_url):
            local_filename = download_image(img_url, page_id)
            if local_filename:
                # Update the img src to local path
                img["src"] = f"images/{local_filename}"
                images_found.append((img_url, local_filename))

    return images_found

def clean_html(html_content, page_id):
    """Clean HTML by removing navigation, ads, and other non-content elements"""
    soup = BeautifulSoup(html_content, "html.parser")

    # Check if page exists
    if "指定されたページ番号は存在しません" in str(soup):
        return None, []

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

    content = None
    for selector in content_selectors:
        content = soup.select_one(selector)
        if content:
            break

    if not content:
        content = soup.find("body")
        if not content:
            content = soup

    # Process images before converting to markdown
    images_found = process_images(content, page_id)

    return content, images_found

def absolutize_urls(soup, base_url="https://w.atwiki.jp"):
    """Convert relative URLs to absolute URLs"""
    # Handle links (but not images since we're downloading them)
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

def save_markdown(content, page_id, title, images_found):
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
        if images_found:
            f.write('images:\n')
            for original_url, local_file in images_found:
                f.write(f'  - original: "{original_url}"\n')
                f.write(f'    local: "images/{local_file}"\n')
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

    # Clean the HTML and download images
    cleaned_soup, images_found = clean_html(html_content, page_id)
    if not cleaned_soup:
        print(f"  Page is deleted or doesn't exist")
        return False

    # Absolutize URLs (except images which are now local)
    cleaned_soup = absolutize_urls(cleaned_soup)

    # Convert to Markdown
    markdown_content = convert_to_markdown(cleaned_soup)

    # Save the result
    filepath = save_markdown(markdown_content, page_id, title, images_found)
    print(f"  Saved: {filepath.name}")

    return True

def main():
    """Main conversion process"""
    print("=" * 60)
    print("SFC YuHaku atwiki to Markdown Bulk Converter")
    print("With Image Download Support")
    print("=" * 60)

    # Create output directories
    OUTPUT_DIR.mkdir(exist_ok=True)
    IMAGES_DIR.mkdir(exist_ok=True)
    print(f"Output directory: {OUTPUT_DIR}")
    print(f"Images directory: {IMAGES_DIR}")

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