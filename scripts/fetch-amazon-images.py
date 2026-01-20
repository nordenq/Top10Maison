#!/usr/bin/env python3
import argparse
import glob
import json
import os
import re
import time
import urllib.request
import urllib.error


def open_url(
    url: str,
    *,
    binary: bool = False
) -> tuple[str, object]:
    headers = {"User-Agent": "Mozilla/5.0"}
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = resp.read()
        return resp.geturl(), data if binary else data.decode("utf-8", "ignore")


def extract_asin(url: str) -> str:
    match = re.search(r"/dp/([A-Z0-9]{10})", url)
    if match:
        return match.group(1)
    match = re.search(r"/gp/product/([A-Z0-9]{10})", url)
    if match:
        return match.group(1)
    return ""


def fetch_image(asin: str, dest_path: str) -> None:
    img_url = (
        "https://ws-na.amazon-adsystem.com/widgets/q?"
        "_encoding=UTF8&MarketPlace=US&ASIN={asin}&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL800_"
    ).format(asin=asin)
    _, data = open_url(img_url, binary=True)
    with open(dest_path, "wb") as handle:
        handle.write(data)


def fetch_product_from_api(asin: str) -> dict | None:
    endpoint = os.environ.get("AMAZON_PRODUCT_API_URL", "http://localhost:4321/api/amazon-products")
    url = f"{endpoint}?asin={asin}"
    try:
        _, data = open_url(url, binary=False)
        return json.loads(data)
    except Exception:
        return None


def fetch_image_from_api(asin: str, dest_path: str) -> bool:
    product = fetch_product_from_api(asin)
    if not product:
        return False
    image_url = product.get("image")
    if not image_url:
        return False
    try:
        _, data = open_url(image_url, binary=True)
        with open(dest_path, "wb") as handle:
            handle.write(data)
        return True
    except Exception:
        return False


def load_products(path: str) -> list:
    with open(path, "r", encoding="utf-8") as handle:
        return json.load(handle)


def save_products(path: str, products: list) -> None:
    with open(path, "w", encoding="utf-8") as handle:
        json.dump(products, handle, indent=2)
        handle.write("\n")


def main() -> int:
    parser = argparse.ArgumentParser(description="Fetch Amazon product images using affiliate URLs.")
    parser.add_argument("--only-missing", action="store_true", help="Only fetch when image file is missing.")
    parser.add_argument("--slugs", nargs="*", help="Limit to specific product slugs.")
    args = parser.parse_args()

    data_files = sorted(glob.glob("src/data/products/*.json"))
    legacy_path = "src/data/products.json"
    if not data_files and os.path.exists(legacy_path):
        data_files = [legacy_path]
    if not data_files:
        print("No product data files found.")
        return 1

    os.makedirs("public/images/products", exist_ok=True)

    success = {}
    failures = []

    all_products = []
    seen = set()
    for path in data_files:
        for product in load_products(path):
            slug = product.get("slug")
            if slug in seen:
                continue
            seen.add(slug)
            all_products.append(product)

    for product in all_products:
        slug = product.get("slug")
        if not slug or (args.slugs and slug not in args.slugs):
            continue
        affiliate_url = product.get("affiliateUrl")
        asin = product.get("asin") or extract_asin(affiliate_url or "")
        if not affiliate_url and not asin:
            failures.append((slug, "NO_URL"))
            continue
        if not asin:
            failures.append((slug, "NO_ASIN"))
            continue
        dest_path = os.path.join("public/images/products", f"{slug}.jpg")
        if args.only_missing and os.path.exists(dest_path):
            continue
        last_error = None
        # Prefer image from the API (Oxylabs-backed)
        if fetch_image_from_api(asin, dest_path):
            success[slug] = f"/images/products/{slug}.jpg"
            continue
        for attempt in range(3):
            try:
                fetch_image(asin, dest_path)
                success[slug] = f"/images/products/{slug}.jpg"
                break
            except Exception as exc:
                last_error = str(exc)
                time.sleep(2 + attempt)
        else:
            failures.append((slug, last_error or "UNKNOWN_ERROR"))

    if not success:
        print("No images fetched.")
    else:
        for slug, image_path in success.items():
            print(f"{slug} -> {image_path}")

    for path in data_files:
        updated = False
        products = load_products(path)
        for product in products:
            slug = product.get("slug")
            if slug in success:
                product["image"] = success[slug]
                updated = True
        if updated:
            save_products(path, products)

    if failures:
        print("Failures:")
        for slug, reason in failures:
            print(f"{slug}: {reason}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
