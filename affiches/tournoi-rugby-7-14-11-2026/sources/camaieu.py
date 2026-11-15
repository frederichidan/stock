"""Photos de match en camaïeu marine (pour les fondre dans le fond de l'affiche et du spot).

usage : python3 camaieu.py photo.jpg sortie.jpg [x0 y0 x1 y1]
La luminance est remappée sur un dégradé marine -> bleu roi -> bleu clair, contraste adouci.
"""
import sys, numpy as np
from PIL import Image, ImageFilter
im = Image.open(sys.argv[1]).convert('RGB')
if len(sys.argv) > 3:
    im = im.crop(tuple(int(v) for v in sys.argv[3:7]))
L = np.asarray(im.convert('L'), np.float32) / 255
L = np.clip((L - L.mean()) * 1.15 + .5, 0, 1)            # contraste centré
stops = np.array([[6, 16, 47], [16, 38, 110], [40, 80, 180], [150, 180, 240]], np.float32)
pos = np.array([0, .35, .7, 1])
out = np.stack([np.interp(L, pos, stops[:, c]) for c in range(3)], -1)
Image.fromarray(out.astype(np.uint8)).filter(ImageFilter.GaussianBlur(.6)).save(sys.argv[2], quality=90)
