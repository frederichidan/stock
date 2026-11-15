"""Vectorise le logo Bernabé (JPEG 331 px) en SVG net : losanges rouges + texte blanc, fond transparent.

Étapes : agrandissement x8 (Lanczos) + lissage, seuillage des couleurs rouge et blanche,
tracé vectoriel avec potrace, assemblage en un seul SVG. Produit aussi une version « patch »
avec le fond violet d'origine.
"""
import subprocess, re, numpy as np, cv2
from PIL import Image

S = 8
im = cv2.imread('logo-bernabe-original.jpg')
big = cv2.resize(im, None, fx=S, fy=S, interpolation=cv2.INTER_LANCZOS4)
big = cv2.bilateralFilter(big, 9, 40, 9)
b, g, r = [big[..., i].astype(int) for i in range(3)]
red = (r > 150) & (g < 120) & (b < 130)
white = (r > 175) & (g > 175) & (b > 175)

orig = cv2.imread('logo-bernabe-original.jpg')
ob, og, orr = [orig[..., i].astype(int) for i in range(3)]
rm = (orr > 170) & (og < 90)
red_hex = '#%02x%02x%02x' % tuple(int(np.median(c[rm])) for c in (orr, og, ob))
bgm = (orr < 70) & (og < 70) & (ob > 90)
bg_hex = '#%02x%02x%02x' % tuple(int(np.median(c[bgm])) for c in (orr, og, ob))
print('rouge', red_hex, 'fond', bg_hex)


def trace(mask, name):
    m = cv2.morphologyEx(mask.astype(np.uint8) * 255, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    Image.fromarray(255 - m).convert('1').save(name + '.pbm')
    subprocess.check_call(['potrace', '-s', '-t', '40', '-a', '1.0', '-O', '0.5', name + '.pbm', '-o', name + '.svg'])
    svg = open(name + '.svg').read()
    tr = re.search(r'<g transform="([^"]+)"', svg).group(1)
    paths = ''.join(f'<path d="{d}"/>' for d in re.findall(r'<path d="([^"]+)"', svg, re.S))
    return tr, paths


W, H = big.shape[1], big.shape[0]
parts = []
for mask, col, name in [(red, red_hex, '_red'), (white, '#ffffff', '_white')]:
    tr, paths = trace(mask, name)
    parts.append(f'<g fill="{col}"><g transform="{tr}">{paths}</g></g>')

ys, xs = np.where(red | white)
pad = 40
x0, y0, x1, y1 = xs.min() - pad, ys.min() - pad, xs.max() + pad, ys.max() + pad
body = ''.join(parts)
open('bernabe.svg', 'w').write(
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0} {y0} {x1 - x0} {y1 - y0}">{body}</svg>')
open('bernabe-patch.svg', 'w').write(
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}"><rect width="{W}" height="{H}" fill="{bg_hex}"/>{body}</svg>')
for f in ('_red', '_white'):
    for ext in ('.pbm', '.svg'):
        import os; os.remove(f + ext)
print('ok', x1 - x0, y1 - y0)
