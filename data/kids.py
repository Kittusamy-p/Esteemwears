import json
import os
import re

FILE_PATH = "boys.json"

def load_data():
    if not os.path.exists(FILE_PATH):
        return []
    with open(FILE_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def save_data(data):
    with open(FILE_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

def fix_slug(slug):
    slug = slug.lower()
    slug = re.sub(r"[^\w\s-]", "", slug)
    slug = re.sub(r"\s+", "-", slug)
    return slug

def create_product_folder(slug):
    folder_path = f"../public/images/{slug}"
    os.makedirs(folder_path, exist_ok=True)
    return folder_path

def input_images(slug):
    images = []
    print("\nEnter image names (example: image.png) (type 'done' to stop):")

    while True:
        img = input("Image: ").strip()
        if img.lower() == "done":
            break

    return images

def input_size_chart(slug):
    img = input("\nSize Chart Image (filename only): ").strip()

    if not img:
        return ""

def input_sizes():
    sizes = []
    print("\nEnter sizes (type 'done' to stop):")

    while True:
        size = input("Size: ").strip()
        if size.lower() == "done":
            break

        price = int(input("Price: ").strip())

        sizes.append({
            "size": size,
            "price": price
        })

    return sizes

def input_links():
    links = []
    print("\nEnter links (type 'done' to stop):")

    while True:
        platform = input("Platform: ").strip().lower()
        if platform == "done":
            break

        seller = input("Seller: ").strip()
        url = input("URL: ").strip()
        rating = float(input("Rating: ").strip())

        links.append({
            "platform": platform,
            "seller": seller,
            "url": url,
            "rating": rating
        })

    return links

def input_details():
    details = []
    print("\nEnter product details (max 5, type 'done' to stop):")

    while len(details) < 5:
        point = input(f"Point {len(details)+1}: ").strip()
        if point.lower() == "done":
            break
        details.append(point)

    return details

def main():
    print("\n=== PRODUCT BUILDER (ULTRA FAST STATIC MODE) ===\n")

    slug = fix_slug(input("Slug: "))
    name = input("Product Name: ").strip()

    create_product_folder(slug)  # just ensures folder exists

    images = input_images(slug)
    size_chart = input_size_chart(slug)
    sizes = input_sizes()
    links = input_links()
    details = input_details()

    product = {
        "slug": slug,
        "name": name,
        "images": images,
        "sizeChart": size_chart,
        "sizes": sizes,
        "links": links,
        "details": details
    }

    data = load_data()
    data.append(product)
    save_data(data)

    print("\n⚡ Done. Zero checks. Zero file dependency.")
    print(f"📦 Expected images path → /images/{slug}/")

if __name__ == "__main__":
    main()