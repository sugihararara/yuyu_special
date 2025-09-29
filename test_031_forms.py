#!/usr/bin/env python3
"""Test form extraction on page 031 (蔵馬)"""

import sys
sys.path.insert(0, '.')

exec(open('fix_character_tables.py').read())

# Test page 031
process_character_page(31)