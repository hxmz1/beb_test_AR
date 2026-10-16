import os
import json
from PIL import Image
import sys

# Base directory
base_dir = r'C:\Users\Asus\Desktop\restaurant-menu'
images_dir = os.path.join(base_dir, 'public', 'images')

# Mapping from menu data (id -> image path)
menu_image_map = {
    'tacos': '/images/menu/tacos.png',
    'baguette': '/images/menu/baguette.png',
    'sandwich': '/images/menu/sandwich.png',
    'makloub': '/images/menu/libanais1.png',
    'pizza': '/images/menu/pizza1.png',
    'tranche': '/images/menu/pizza_tranche.png',
}

# Reverse mapping: image path -> id
image_to_id = {v: k for k, v in menu_image_map.items()}

# Supported extensions
extensions = ('.png', '.jpg', '.jpeg', '.gif', '.webp')

# Walk the images directory
image_files = []
for root, dirs, files in os.walk(images_dir):
    for file in files:
        if file.lower().endswith(extensions):
            full_path = os.path.join(root, file)
            # Get relative path from public/images for consistency with menu
            rel_path = os.path.relpath(full_path, os.path.join(base_dir, 'public'))
            # Convert to forward slashes and prepend with /
            rel_path = '/' + rel_path.replace(os.sep, '/')
            image_files.append((full_path, rel_path))

# Process each image
inventory = []
for full_path, rel_path in image_files:
    try:
        with Image.open(full_path) as img:
            width, height = img.size
            format = img.format
            mode = img.mode
        file_size = os.path.getsize(full_path)
        # Determine if used in menu
        used_in_menu = rel_path in image_to_id
        product_id = image_to_id.get(rel_path, None)
        inventory.append({
            'file_path': full_path,
            'relative_path': rel_path,
            'width': width,
            'height': height,
            'format': format,
            'mode': mode,
            'file_size_bytes': file_size,
            'used_in_menu': used_in_menu,
            'product_id': product_id,
        })
    except Exception as e:
        print(f"Error processing {full_path}: {e}", file=sys.stderr)

# Output as JSON for easy viewing
print(json.dumps(inventory, indent=2))
