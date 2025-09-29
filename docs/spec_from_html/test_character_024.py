#!/usr/bin/env python3
"""
Test the character table extraction on page 024 (幽助) only
"""

from fix_character_tables import process_character_page

def main():
    """Test on page 024 only"""
    print("Testing character table extraction on page 024 (幽助)...")

    success = process_character_page(24)

    if success:
        print("✅ Success! Check the updated file.")
    else:
        print("❌ Failed to process page 024")

if __name__ == "__main__":
    main()