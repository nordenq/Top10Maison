#!/usr/bin/env python3
import argparse
import glob
import json
import os
import re
import sys
import html
import time
import urllib.parse
import urllib.request


def open_url(
    url: str,
    *,
    binary: bool = False,
    autoparse: bool = False,
    render: bool = False,
    extra_params: dict | None = None
) -> tuple[str, object]:
    scraper_key = os.getenv("SCRAPERAPI_KEY")
    target_url = url
    headers = {"User-Agent": "Mozilla/5.0"}

    if scraper_key:
        params = {"api_key": scraper_key, "url": url, "country_code": "us"}
        if autoparse and not binary:
            params["autoparse"] = "true"
        if render and not binary:
            params["render"] = "true"
        if "amazon." in url or "amzn.to" in url:
            params["premium"] = "true"
        if extra_params:
            params.update(extra_params)
        target_url = "https://api.scraperapi.com/?" + urllib.parse.urlencode(params)
        headers["Accept"] = "*/*"

    req = urllib.request.Request(target_url, headers=headers)
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = resp.read()
        return resp.geturl(), data if binary else data.decode("utf-8", "ignore")


def resolve_final_url(url: str) -> str:
    if os.getenv("SCRAPERAPI_KEY"):
        _, payload = open_url(url, extra_params={"follow_redirect": "false"}, render=True)
        redirect_url = extract_redirect_from_html(payload)
        return redirect_url or url
    final_url, _ = open_url(url)
    return final_url


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


def extract_location_from_headers(payload: str) -> str:
    lines = payload.splitlines()
    for line in lines:
        if not line.strip():
            break
        if line.lower().startswith("location:"):
            return line.split(":", 1)[1].strip()
    return ""


def extract_redirect_from_html(payload: str) -> str:
    match = re.search(r'href="([^"]+amazon[^"]+)"', payload, re.IGNORECASE)
    if not match:
        return ""
    return html.unescape(match.group(1))


def extract_image_url_from_autoparse(payload: str) -> str:
    try:
        data = json.loads(payload)
    except json.JSONDecodeError:
        return ""
    if isinstance(data, dict):
        main = data.get("mainImage")
        if isinstance(main, str) and main.startswith("http"):
            return main
        images = data.get("images")
        if isinstance(images, list) and images:
            for item in images:
                if isinstance(item, str) and item.startswith("http"):
                    return item
    return ""


def fetch_image(asin: str, dest_path: str) -> None:
    img_url = (
        "https://ws-na.amazon-adsystem.com/widgets/q?"
        "_encoding=UTF8&MarketPlace=US&ASIN={asin}&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL800_"
    ).format(asin=asin)
    _, data = open_url(img_url, binary=True)
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

    products_path = "src/data/products.json"
    extra_paths = glob.glob("src/data/products/*.json")
    data_files = [products_path] + extra_paths

    os.makedirs("public/images/products", exist_ok=True)

    success = {}
    failures = []

    for product in load_products(products_path):
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
                final_url = resolve_final_url(affiliate_url)
                asin = extract_asin(final_url)
                if not asin:
                    _, payload = open_url(affiliate_url, autoparse=True, render=True)
                    image_url = extract_image_url_from_autoparse(payload)
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
def fetch_image_from_url(image_url: str, dest_path: str) -> None:
    _, data = open_url(image_url, binary=True)
    with open(dest_path, "wb") as handle:
        handle.write(data)
