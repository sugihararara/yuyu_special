#!/usr/bin/env python3
"""Test script specifically for page 38 with image"""

from sfc_bulk_export import *

# Test only page 38
pages = {38: "画面説明"}

print("Testing page 38 with image download...")
OUTPUT_DIR.mkdir(exist_ok=True)
IMAGES_DIR.mkdir(exist_ok=True)

page_id = 38
title = pages[page_id]

# Force re-download even if exists
safe_title = re.sub(r'[<>:"/\\|?*]', '', title)
safe_title = safe_title.strip()[:50]
filename = f"{page_id:03d}-{safe_title}.md"
filepath = OUTPUT_DIR / filename

if filepath.exists():
    print(f"Removing existing file: {filename}")
    filepath.unlink()

# Convert the page
success = convert_page(page_id, title)

if success:
    print("\nSuccess! Check the output:")
    print(f"  Markdown: {filepath}")
    print(f"  Images: {IMAGES_DIR}")
else:
    print("Conversion failed")