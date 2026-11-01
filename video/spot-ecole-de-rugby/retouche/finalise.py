"""Finition des photos recolorées : léger contraste / saturation / netteté, export JPEG haute qualité."""
import sys
from PIL import Image, ImageEnhance, ImageFilter
src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGB')
im = ImageEnhance.Contrast(im).enhance(1.05)
im = ImageEnhance.Color(im).enhance(1.06)
im = im.filter(ImageFilter.UnsharpMask(radius=2, percent=40, threshold=2))
im.save(out, quality=93, subsampling=0)
print(out, im.size)
