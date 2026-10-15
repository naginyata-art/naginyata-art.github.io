#!/usr/bin/env python3
"""Make web-ready images from originals.

Usage:  python3 tools/make-images.py
  1. Put original files (png/jpg/webp) in  originals/   (this folder is NOT uploaded)
  2. Run this script.
  3. It writes  images/art/NAME.webp    (large, long side 1600px, for the lightbox)
              images/thumbs/NAME.webp  (small, long side 600px, for the gallery grid)
     and prints lines to paste into the artworks list in data.js.
Requires Pillow:  pip install pillow
"""
import os, sys
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "originals")
OUT_L = os.path.join(ROOT, "images", "art")
OUT_S = os.path.join(ROOT, "images", "thumbs")
EXT = (".png", ".jpg", ".jpeg", ".webp")

def save(im, path, long_side, q):
    im = im.copy()
    im.thumbnail((long_side, long_side), Image.LANCZOS)
    im.save(path, "WEBP", quality=q, method=6)
    return os.path.getsize(path) // 1024

def main():
    os.makedirs(OUT_L, exist_ok=True); os.makedirs(OUT_S, exist_ok=True)
    files = sorted(f for f in os.listdir(SRC) if f.lower().endswith(EXT)) if os.path.isdir(SRC) else []
    if not files:
        print("No images found in originals/"); return
    for f in files:
        name = os.path.splitext(f)[0].lower().replace(" ", "-")
        im = ImageOps.exif_transpose(Image.open(os.path.join(SRC, f)))
        if im.mode not in ("RGB", "RGBA"): im = im.convert("RGB")
        kb_l = save(im, os.path.join(OUT_L, name + ".webp"), 1600, 82)
        kb_s = save(im, os.path.join(OUT_S, name + ".webp"), 600, 78)
        print('    { title: "%s", category: "Digital Art", image: "images/art/%s.webp", thumb: "images/thumbs/%s.webp" },  // large %dKB / thumb %dKB'
              % (name, name, name, kb_l, kb_s))

if __name__ == "__main__":
    main()
