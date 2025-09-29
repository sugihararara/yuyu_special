#!/usr/bin/env python3
"""
Single page test conversion script for atwiki to Markdown
Tests the conversion process on one page before bulk processing
"""

import re
import requests
from bs4 import BeautifulSoup
from markdownify import markdownify as md
from pathlib import Path
import sys

BASE = "https://w.atwiki.jp/yuyuz"

def fetch_page(page_id):
    """Fetch a single page from atwiki"""
    url = f"{BASE}/pages/{page_id}.html"
    print(f"Fetching: {url}")

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }

    try:
        response = requests.get(url, timeout=20, headers=headers)
        response.raise_for_status()
        response.encoding = response.apparent_encoding  # Fix encoding detection
        return response.text
    except requests.RequestException as e:
        print(f"Error fetching page: {e}")
        return None

def clean_html(html_content):
    """Clean HTML by removing navigation, ads, and other non-content elements"""
    soup = BeautifulSoup(html_content, "html.parser")

    # Check if page exists
    if "指定されたページ番号は存在しません" in str(soup):
        print("Page is deleted or doesn't exist")
        return None

    # Remove navigation and non-content elements
    # Based on common atwiki structure
    selectors_to_remove = [
        "#header",           # Header
        "#footer",           # Footer
        "#wikibody > .menu", # Menu in wikibody
        "#wikibody > .side", # Sidebar
        "#rightmenu",        # Right menu
        "#leftmenu",         # Left menu
        ".navbar",           # Navigation bar
        ".topicpath",        # Breadcrumbs
        "#menubar",          # Menu bar
        "#toolbar",          # Tool bar
        ".atwiki-ad",        # Ads
        "script",            # Scripts
        "style",             # Styles
        "noscript",          # Noscript
        "#wikitop",          # Wiki top section
        "#wikibottom",       # Wiki bottom section
        ".page_navi",        # Page navigation
    ]

    for selector in selectors_to_remove:
        for element in soup.select(selector):
            element.decompose()

    # Find the main content area
    # Try different possible content containers
    content = None

    # Try to find the actual content area
    content_selectors = [
        "#wikibody",         # Common atwiki content container
        "#content",          # Alternative content container
        ".wiki-content",     # Another possible container
        "article",           # HTML5 article tag
        "main",              # HTML5 main tag
    ]

    for selector in content_selectors:
        content = soup.select_one(selector)
        if content:
            break

    # If no specific content container found, use the whole body
    if not content:
        content = soup.find("body")
        if not content:
            content = soup

    return content

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
    # Convert to Markdown using markdownify
    markdown_text = md(
        str(soup),
        heading_style="ATX",  # Use # for headings
        bullets="*",           # Use * for bullets
        code_language="",      # Don't add language to code blocks
    )

    # Clean up excessive newlines
    markdown_text = re.sub(r'\n{3,}', '\n\n', markdown_text)

    # Remove leading/trailing whitespace
    markdown_text = markdown_text.strip()

    return markdown_text

def extract_title(html_content):
    """Extract the page title"""
    soup = BeautifulSoup(html_content, "html.parser")

    # Try to find title in various places
    title = None

    # Try page title tag
    title_tag = soup.find("title")
    if title_tag:
        title = title_tag.get_text(strip=True)
        # Remove site suffix if present
        title = re.sub(r'\s*-\s*.*?wiki.*$', '', title, flags=re.IGNORECASE)

    # Try h1 tag
    if not title:
        h1 = soup.find("h1")
        if h1:
            title = h1.get_text(strip=True)

    return title or "untitled"

def save_markdown(content, page_id, title=None):
    """Save markdown content to file"""
    # Create output directory
    output_dir = Path("yuyuz_md")
    output_dir.mkdir(exist_ok=True)

    # Create filename
    if title:
        # Sanitize title for filename
        safe_title = re.sub(r'[<>:"/\\|?*]', '', title)
        safe_title = safe_title.strip()[:50]  # Limit length
        filename = f"{page_id}-{safe_title}.md"
    else:
        filename = f"{page_id}.md"

    filepath = output_dir / filename

    # Write content
    with open(filepath, "w", encoding="utf-8") as f:
        # Add front matter
        f.write("---\n")
        f.write(f'source: "{BASE}/pages/{page_id}.html"\n')
        f.write(f'id: {page_id}\n')
        if title:
            f.write(f'title: "{title}"\n')
        f.write("---\n\n")
        f.write(content)

    print(f"Saved: {filepath}")
    return filepath

def test_single_page(page_id=60):
    """Test conversion on a single page"""
    print(f"\n=== Testing conversion for page {page_id} ===\n")

    # Fetch the page
    html_content = fetch_page(page_id)
    if not html_content:
        print("Failed to fetch page")
        return False

    # Extract title
    title = extract_title(html_content)
    print(f"Title: {title}")

    # Clean the HTML
    cleaned_soup = clean_html(html_content)
    if not cleaned_soup:
        print("Page doesn't exist or is deleted")
        return False

    # Absolutize URLs
    cleaned_soup = absolutize_urls(cleaned_soup)

    # Convert to Markdown
    markdown_content = convert_to_markdown(cleaned_soup)

    # Save the result
    filepath = save_markdown(markdown_content, page_id, title)

    # Show preview
    print(f"\n=== Preview of converted content (first 500 chars) ===\n")
    print(markdown_content[:500])
    if len(markdown_content) > 500:
        print("\n... (content continues)")

    print(f"\n=== Conversion complete ===")
    print(f"Total length: {len(markdown_content)} characters")

    return True

if __name__ == "__main__":
    # Test with page 60 by default, or use command line argument
    test_id = 60
    if len(sys.argv) > 1:
        try:
            test_id = int(sys.argv[1])
        except ValueError:
            print(f"Invalid page ID: {sys.argv[1]}")
            sys.exit(1)

    success = test_single_page(test_id)
    sys.exit(0 if success else 1)