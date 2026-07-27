import os
import glob

replacements = {
    '#12AAFF': 'var(--accent)',
    '#1B4ADD': 'var(--accent-dark)',
}

def process_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = content
    for old, new in replacements.items():
        modified = modified.replace(old, new)
        
    if content != modified:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(modified)
        print(f"Updated {path}")

for file in glob.glob("src/**/*.jsx", recursive=True):
    process_file(file)
for file in glob.glob("src/**/*.js", recursive=True):
    process_file(file)
