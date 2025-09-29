#!/usr/bin/env python3
"""
Download simulator pages with their HTML and JavaScript
"""

import requests
from pathlib import Path
import time
from bs4 import BeautifulSoup
import re

# Simulator URLs found in the wiki
SIMULATORS = [
    ("攻撃判定シミュレーター", "http://yuyutokubetsu.web.fc2.com/simulator.htm"),
    ("防御判定シミュレーター(攻撃側先手)", "http://yuyutokubetsu.web.fc2.com/simulator_guard.htm"),
    ("防御判定シミュレーター(防御側先手)", "http://yuyutokubetsu.web.fc2.com/simulator_guard2.htm"),
    ("相殺判定シミュレーター", "https://yuyutokubetsu.web.fc2.com/simulator2.htm"),
]

OUTPUT_DIR = Path("simulators")

def download_page(name, url):
    """Download a single simulator page"""
    print(f"\nDownloading: {name}")
    print(f"URL: {url}")

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }

    try:
        response = requests.get(url, timeout=30, headers=headers)
        response.raise_for_status()
        response.encoding = response.apparent_encoding or 'utf-8'
        return response.text
    except requests.RequestException as e:
        print(f"  Error downloading: {e}")
        return None

def save_html(name, content, url):
    """Save HTML content to file"""
    # Create safe filename
    safe_name = re.sub(r'[^\w\s-]', '', name)
    safe_name = re.sub(r'[-\s]+', '-', safe_name)

    # Extract base filename from URL
    url_parts = url.split('/')
    original_filename = url_parts[-1]

    # Save with both descriptive name and original filename
    filename = f"{safe_name}_{original_filename}"
    filepath = OUTPUT_DIR / filename

    with open(filepath, "w", encoding="utf-8") as f:
        # Add comment with source info
        f.write(f"<!-- Source: {url} -->\n")
        f.write(f"<!-- Title: {name} -->\n")
        f.write(f"<!-- Downloaded: {time.strftime('%Y-%m-%d %H:%M:%S')} -->\n\n")
        f.write(content)

    print(f"  Saved: {filepath.name}")
    return filepath

def extract_js_files(html_content, base_url):
    """Extract JavaScript file references from HTML"""
    soup = BeautifulSoup(html_content, "html.parser")
    js_files = []

    # Find all script tags with src
    for script in soup.find_all("script", src=True):
        src = script.get("src", "")
        if src:
            # Make absolute URL if relative
            if not src.startswith(("http://", "https://", "//")):
                if src.startswith("/"):
                    # Absolute path from domain
                    base_domain = "/".join(base_url.split("/")[:3])
                    js_url = base_domain + src
                else:
                    # Relative to current directory
                    base_dir = "/".join(base_url.split("/")[:-1])
                    js_url = base_dir + "/" + src
            elif src.startswith("//"):
                js_url = "https:" + src
            else:
                js_url = src

            js_files.append(js_url)

    return js_files

def download_js_file(url):
    """Download a JavaScript file"""
    print(f"  Downloading JS: {url.split('/')[-1]}")

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }

    try:
        response = requests.get(url, timeout=30, headers=headers)
        response.raise_for_status()
        return response.text
    except requests.RequestException as e:
        print(f"    Error: {e}")
        return None

def main():
    """Main download process"""
    print("=" * 60)
    print("Simulator Pages Downloader")
    print("=" * 60)

    # Create output directory
    OUTPUT_DIR.mkdir(exist_ok=True)
    js_dir = OUTPUT_DIR / "js"
    js_dir.mkdir(exist_ok=True)

    print(f"\nOutput directory: {OUTPUT_DIR}")
    print(f"Found {len(SIMULATORS)} simulators to download")

    for name, url in SIMULATORS:
        # Download HTML
        html_content = download_page(name, url)
        if not html_content:
            continue

        # Save HTML
        html_path = save_html(name, html_content, url)

        # Extract and download JavaScript files
        js_files = extract_js_files(html_content, url)
        if js_files:
            print(f"  Found {len(js_files)} JavaScript files")
            for js_url in js_files:
                js_content = download_js_file(js_url)
                if js_content:
                    js_filename = js_url.split('/')[-1]
                    if not js_filename:
                        js_filename = "script.js"
                    js_path = js_dir / js_filename
                    with open(js_path, "w", encoding="utf-8") as f:
                        f.write(f"// Source: {js_url}\n")
                        f.write(f"// Downloaded: {time.strftime('%Y-%m-%d %H:%M:%S')}\n\n")
                        f.write(js_content)
                    print(f"    Saved: js/{js_filename}")

        # Also check for inline JavaScript in the HTML
        soup = BeautifulSoup(html_content, "html.parser")
        inline_scripts = soup.find_all("script", src=False)
        if inline_scripts:
            print(f"  Found {len(inline_scripts)} inline script blocks")
            # The inline scripts are already in the saved HTML file

        time.sleep(0.5)  # Rate limiting

    print("\n" + "=" * 60)
    print("Download Complete!")
    print(f"Files saved to: {OUTPUT_DIR.absolute()}")

    # Create an index file
    index_path = OUTPUT_DIR / "index.html"
    with open(index_path, "w", encoding="utf-8") as f:
        f.write("""<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>幽☆遊☆白書 特別篇 シミュレーター一覧</title>
    <style>
        body { font-family: sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        h1 { color: #333; }
        ul { line-height: 1.8; }
        a { color: #0066cc; text-decoration: none; }
        a:hover { text-decoration: underline; }
        .note { color: #666; font-size: 0.9em; margin-top: 20px; }
    </style>
</head>
<body>
    <h1>幽☆遊☆白書 特別篇 シミュレーター一覧</h1>
    <p>以下のシミュレーターが利用可能です：</p>
    <ul>
""")

        for name, url in SIMULATORS:
            safe_name = re.sub(r'[^\w\s-]', '', name)
            safe_name = re.sub(r'[-\s]+', '-', safe_name)
            original_filename = url.split('/')[-1]
            filename = f"{safe_name}_{original_filename}"
            f.write(f'        <li><a href="{filename}">{name}</a> (元: {url})</li>\n')

        f.write("""    </ul>
    <p class="note">※ これらは元のサイトからダウンロードしたローカルコピーです。</p>
    <p class="note">※ 一部の機能はオフラインでは動作しない可能性があります。</p>
</body>
</html>
""")

    print(f"Created index: {index_path.name}")

if __name__ == "__main__":
    main()