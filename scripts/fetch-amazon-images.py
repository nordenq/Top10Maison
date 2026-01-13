#!/usr/bin/env python3
import argparse
import glob
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request


def open_url(
    url: str,
    *,
    binary: bool = False,
    render: bool = False,
    extra_params: dict | None = None
) -> tuple[str, object]:
    scrapingbee_key = os.getenv("SCRAPINGBEE_API_KEY")
    target_url = url
    headers = {"User-Agent": "Mozilla/5.0"}

    if scrapingbee_key:
        params = {"api_key": scrapingbee_key, "url": url, "country_code": "us"}
        if render and not binary:
            params["render_js"] = "true"
        if "amazon." in url or "amzn.to" in url:
            params["premium_proxy"] = "true"
        if extra_params:
            params.update(extra_params)
        target_url = "https://app.scrapingbee.com/api/v1/?" + urllib.parse.urlencode(params)
        headers["Accept"] = "*/*"

    req = urllib.request.Request(target_url, headers=headers)
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


def extract_asin_from_html(html: str) -> str:
    patterns = [
        r'data-asin="([A-Z0-9]{10})"',
        r'"asin"\s*:\s*"([A-Z0-9]{10})"',
        r"/dp/([A-Z0-9]{10})",
        r"/gp/product/([A-Z0-9]{10})"
    ]
    for pattern in patterns:
        match = re.search(pattern, html)
        if match:
            return match.group(1)
    return ""


def extract_image_url_from_html(payload: str) -> str:
    match = re.search(r'"hiRes"\s*:\s*"([^"]+)"', payload)
    if match:
        return match.group(1)
    match = re.search(r'data-old-hires="([^"]+)"', payload)
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


def fetch_image_from_url(image_url: str, dest_path: str) -> None:
    _, data = open_url(image_url, binary=True)
    with open(dest_path, "wb") as handle:
        handle.write(data)


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
        if not affiliate_url:
            failures.append((slug, "NO_URL"))
            continue
        dest_path = os.path.join("public/images/products", f"{slug}.jpg")
        if args.only_missing and os.path.exists(dest_path):
            continue
        last_error = None
        for attempt in range(3):
            try:
                asin = extract_asin(affiliate_url)
                if not asin:
                    _, payload = open_url(affiliate_url, render=True)
                    image_url = extract_image_url_from_html(payload)
                    if image_url:
                        fetch_image_from_url(image_url, dest_path)
                        success[slug] = f"/images/products/{slug}.jpg"
                        break
                    asin = extract_asin_from_html(payload)
                if not asin:
                    last_error = "NO_ASIN"
                    time.sleep(2 + attempt)
                    continue
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
