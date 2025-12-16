import os
import re
from pathlib import Path

# Define the replacements
replacements = [
    (r'style="text-decoration: none; color: inherit;"', 'class="logo-link"'),
    (r"style=\"font-size: 1\.8rem; font-weight: 700; color: #f39c12; font-family: 'Segoe UI', sans-serif;\"", 'class="logo-text"'),
    (r'style="font-size: 0\.8rem; color: #666; margin-top: -5px;"', 'class="logo-subtitle"'),
]

# Get all HTML files
public_dir = Path(r'c:\Users\Sudhanshu Varun\Desktop\ideas\passive income\solar\solar-decision-website\public')
html_files = list(public_dir.rglob('*.html'))

print(f"Found {len(html_files)} HTML files")

files_modified = 0
total_replacements = 0

for html_file in html_files:
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        file_replacements = 0
        
        for pattern, replacement in replacements:
            matches = len(re.findall(pattern, content))
            if matches > 0:
                content = re.sub(pattern, replacement, content)
                file_replacements += matches
        
        if content != original_content:
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(content)
            files_modified += 1
            total_replacements += file_replacements
            print(f"✓ {html_file.name}: {file_replacements} replacements")
    
    except Exception as e:
        print(f"✗ Error processing {html_file.name}: {e}")

print(f"\nSummary:")
print(f"Files modified: {files_modified}")
print(f"Total replacements: {total_replacements}")
