"""Habille les joueurs aux couleurs du RCA sur les photos agrandies (EDSR x4).

Méthode : dans des zones tracées à la main (une par maillot, coordonnées de la photo
d'origine), on garde les pixels « tissu sombre » (faible luminosité, faible saturation)
-> bleu marine RCA en conservant les plis ; les lettrages orange/rouges -> jaune RCA ;
les shorts bordeaux -> bleu roi. L'écusson est ensuite posé sur la poitrine.
Le décor (plage, mer, boudins Gilbert) et le crédit du photographe ne sont pas touchés.
"""
import sys, json, numpy as np, cv2
from PIL import Image, ImageFilter

NAVY_H = 113          # teinte OpenCV (0-180) du bleu marine RCA (#0b1a52 ~ 226°)
ROYAL_H = 112
YELLOW_H = 24         # jaune RCA (#f5c400 ~ 48°)


def poly_mask(shape, polys, k):
    m = np.zeros(shape[:2], np.uint8)
    for p in polys:
        cv2.fillPoly(m, [np.array([(int(x * k), int(y * k)) for x, y in p], np.int32)], 255)
    return m


def soften(m, r):
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (r, r)))
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (r * 2 + 1, r * 2 + 1)))
    return cv2.GaussianBlur(m.astype(np.float32) / 255, (0, 0), r * .6)


def run(src, out, spec, k):
    bgr = cv2.imread(src)
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV).astype(np.float32)
    lab = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB).astype(np.float32)
    H, S, V = hsv[..., 0], hsv[..., 1], hsv[..., 2]
    L = lab[..., 0]
    chroma = np.hypot(lab[..., 1] - 128, lab[..., 2] - 128)
    r = max(3, int(k * 1.5))

    rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB).astype(np.float32)

    def tinted(h, sat, v):
        """Image entière teintée (teinte h, saturation sat, luminosité v) -> RGB float."""
        t = np.stack([np.full(V.shape, h, np.float32), np.full(V.shape, sat, np.float32), v], -1)
        return cv2.cvtColor(np.clip(t, 0, 255).astype(np.uint8), cv2.COLOR_HSV2RGB).astype(np.float32)

    def blend(base, target, a):
        return base * (1 - a[..., None]) + target * a[..., None]

    keep = poly_mask(bgr.shape, spec.get('keep', []), k) > 0      # zones protégées (ballon…)
    zone = poly_mask(bgr.shape, spec.get('shirts', []), k)
    zone[keep] = 0
    A = lab[..., 1] - 128
    B = lab[..., 2] - 128

    # 1) tissus sombres -> marine (les plis sont conservés via la luminosité d'origine)
    skin = (A > spec.get('Amax', 3)) & (B > 4)
    dark = (zone > 0) & (L < spec.get('Lmax', 110)) & (chroma < spec.get('Cmax', 18)) & ~skin
    m = dark.astype(np.uint8) * 255
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (r * 5, r * 5)))
    m[(zone == 0) | (skin & (L > 60))] = 0
    a = soften(m, r)
    rgb = blend(rgb, tinted(NAVY_H, 200, V * 1.15 + 14), a)
    dbg = a.copy()

    # 2) lettrages orange / rouges -> jaune RCA
    zt = poly_mask(bgr.shape, spec.get('texts', []), k)
    warm = (zt > 0) & ((H < 20) | (H > 165)) & (S > 70) & (V > 90)
    a2 = soften(warm.astype(np.uint8) * 255, max(2, r // 2))
    rgb = blend(rgb, tinted(YELLOW_H, 225, V * 1.1 + 25), a2)

    # 3) shorts bordeaux -> bleu roi
    zs = poly_mask(bgr.shape, spec.get('maroon', []), k)
    mar = (zs > 0) & ((H < 15) | (H > 150)) & (S > 35) & (V < 200)
    a3 = soften(mar.astype(np.uint8) * 255, r)
    rgb = blend(rgb, tinted(ROYAL_H, 185, V * 1.25 + 10), a3)
    dbg = np.maximum(dbg, a3)

    res = cv2.cvtColor(np.clip(rgb, 0, 255).astype(np.uint8), cv2.COLOR_RGB2BGR)

    # 4) léger polissage : contraste local + saturation de la scène
    img = Image.fromarray(cv2.cvtColor(res, cv2.COLOR_BGR2RGB))
    # 5) écussons sur la poitrine (x, y, largeur en coordonnées d'origine, angle, opacité)
    crest = Image.open(spec['crest'])
    for (x, y, w, ang) in spec.get('crests', []):
        W = int(w * k); c = crest.resize((W, int(W * crest.height / crest.width)), Image.LANCZOS)
        if ang: c = c.rotate(ang, expand=True, resample=Image.BICUBIC)
        # ombrage du tissu repris sur l'écusson pour qu'il « colle » au maillot
        lum = img.crop((int(x * k), int(y * k), int(x * k) + c.width, int(y * k) + c.height)).convert('L')
        lum = lum.point(lambda v: min(255, 150 + v)).filter(ImageFilter.GaussianBlur(k))
        shaded = Image.composite(Image.merge('RGB', [Image.eval(ch, lambda v: v) for ch in c.convert('RGB').split()]), c.convert('RGB'), lum)
        from PIL import ImageChops
        shaded = ImageChops.multiply(c.convert('RGB'), Image.merge('RGB', [lum] * 3))
        alpha = c.split()[3].point(lambda v: int(v * .95))
        img.paste(shaded, (int(x * k), int(y * k)), alpha)
    img.save(out, quality=95)
    Image.fromarray((dbg * 255).astype(np.uint8)).save(out.rsplit('.', 1)[0] + '_mask.png')


if __name__ == '__main__':
    import os
    spec = json.load(open(sys.argv[3]))
    spec['crest'] = os.path.join(os.path.dirname(os.path.abspath(sys.argv[3])), spec['crest'])
    run(sys.argv[1], sys.argv[2], spec, float(sys.argv[4]) if len(sys.argv) > 4 else 4)
