"""Retouche v2 : détourage précis (Segment Anything) + recoloration RCA + suppression des écrits.

Pour chaque photo, un fichier JSON décrit (en coordonnées de la photo d'origine) :
  garments : vêtements à recolorer -> cadre de recadrage, points « dedans » / « dehors », couleur
  erase    : objets dont on efface les écrits (boudins Gilbert…) -> détourage SAM + lettres sombres/claires
  erase_poly : petites zones dont on efface les écrits (ballon, banderoles) -> polygone + mode
  crests   : écussons posés sur la poitrine (x, y, largeur, angle)
Le crédit du photographe n'est jamais touché.

usage : python v2.py photo_agrandie.png sortie.jpg spec.json facteur [--debug]
"""
import sys, os, json
import numpy as np, cv2
from PIL import Image, ImageChops, ImageFilter
from rembg import new_session

SAM = None
COLORS = {  # teinte OpenCV (0-180), saturation, (gain, décalage) de luminosité
    'navy':  (113, 200, 1.15, 14),
    'royal': (112, 185, 1.20, 12),
}


def sam_mask(img_rgb, crop, pos, neg, k):
    """Masque SAM d'un objet, calculé sur un recadrage (meilleure résolution), recollé pleine taille."""
    global SAM
    if SAM is None:
        SAM = new_session('sam', sam_model='sam_vit_b_01ec64')
    H, W = img_rgb.shape[:2]
    x0, y0, x1, y1 = [int(v * k) for v in crop]
    x0, y0, x1, y1 = max(0, x0), max(0, y0), min(W, x1), min(H, y1)
    sub = Image.fromarray(img_rgb[y0:y1, x0:x1])
    prompt = [{'type': 'point', 'label': 1, 'data': [int(x * k - x0), int(y * k - y0)]} for x, y in pos] + \
             [{'type': 'point', 'label': 0, 'data': [int(x * k - x0), int(y * k - y0)]} for x, y in neg]
    m = np.array(SAM.predict(sub, sam_prompt=prompt)[0].resize(sub.size, Image.BILINEAR), np.float32) / 255
    full = np.zeros((H, W), np.float32)
    full[y0:y1, x0:x1] = m
    return full


def refine(mask, guide_bgr, r):
    """Affine les bords du masque sur les contours réels de l'image (filtre guidé)."""
    m = cv2.ximgproc.guidedFilter(guide_bgr, (mask * 255).astype(np.uint8), r, 1e-2 * 255 * 255)
    m = m.astype(np.float32) / 255
    return np.clip((m - 0.5) * 1.6 + 0.5, 0, 1)


def poly(shape, pts, k):
    m = np.zeros(shape[:2], np.uint8)
    cv2.fillPoly(m, [np.array([(int(x * k), int(y * k)) for x, y in pts], np.int32)], 255)
    return m > 0


def text_pixels(lab, hsv, region, mode, k, maxchroma=None, thr=22, bthr=18):
    """Lettres dans une région : 'dark' (plus sombres que le fond), 'bright' (plus claires ou colorées), 'all'."""
    L = lab[..., 0].astype(np.float32)
    win = int(25 * k) | 1
    med = cv2.medianBlur(L.astype(np.uint8), min(win, 255)).astype(np.float32)
    S = hsv[..., 1].astype(np.float32)
    if mode == 'dark':
        t = L < med - thr
    elif mode == 'bright':
        t = (L > med + bthr) | (S > 90)
    else:
        t = np.ones(L.shape, bool)
    t &= region
    if maxchroma is not None:         # protège la peau (doigts posés sur un ballon…)
        C = np.hypot(lab[..., 1].astype(np.float32) - 128, lab[..., 2].astype(np.float32) - 128)
        t &= C < maxchroma
    t = cv2.dilate(t.astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (int(3 * k) | 1, int(3 * k) | 1)))
    return t > 0


def inpaint(img, mask, k, clip=None, smooth=.8):
    """Bouche une zone (travail à mi-résolution pour la douceur et la vitesse)."""
    if not mask.any():
        return img
    f = 0.5
    small = cv2.resize(img, None, fx=f, fy=f, interpolation=cv2.INTER_AREA)
    ms = cv2.resize(mask.astype(np.uint8) * 255, (small.shape[1], small.shape[0]), interpolation=cv2.INTER_NEAREST)
    out = cv2.inpaint(small, ms, int(6 * k * f) + 3, cv2.INPAINT_TELEA)
    up = cv2.resize(out, (img.shape[1], img.shape[0]), interpolation=cv2.INTER_CUBIC).astype(np.float32)
    # lissage de la zone rebouchée : supprime les traînées de l'inpainting, garde le modelé
    zone = cv2.dilate(mask.astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (int(4 * k) | 1, int(4 * k) | 1)))
    smooth_img = cv2.GaussianBlur(up, (0, 0), 3 * k); smooth_k = smooth
    zb = cv2.GaussianBlur(zone.astype(np.float32), (0, 0), 1.5 * k)[..., None]
    up = up * (1 - zb * smooth_k) + smooth_img * zb * smooth_k
    a = cv2.GaussianBlur(zone.astype(np.float32), (0, 0), max(1, k * .8))[..., None]
    a = np.clip(a * 1.5, 0, 1)
    if clip is not None:             # ne déborde pas hors de la zone autorisée
        a = a * cv2.GaussianBlur(clip.astype(np.float32), (0, 0), max(1, k * .5))[..., None]
    return np.clip(img * (1 - a) + up * a, 0, 255).astype(np.uint8)


def run(src, out, spec, k, debug=False):
    bgr = cv2.imread(src)
    if spec.get('denoise', 4):
        bgr = cv2.fastNlMeansDenoisingColored(bgr, None, spec.get('denoise', 4), spec.get('denoise', 4), 7, 21)
    rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
    r = max(4, int(2.5 * k))
    dbg = bgr.copy().astype(np.float32)

    # 1) écrits sur objets (boudins…)
    for e in spec.get('erase', []):
        m = refine(sam_mask(rgb, e['crop'], e['pos'], e.get('neg', []), k), bgr, r) > .5
        # bouche les trous du masque (le logo sombre peut être exclu par le détourage)
        cs, _ = cv2.findContours(m.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        m = cv2.drawContours(np.zeros(m.shape, np.uint8), cs, -1, 1, -1) > 0
        if 'within' in e:
            m &= poly(bgr.shape, e['within'], k)
        lab = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB); hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)
        er = int(r * e.get('erode', 4))
        t = text_pixels(lab, hsv, cv2.erode(m.astype(np.uint8), np.ones((er, er), np.uint8)) > 0, e.get('mode', 'dark'), k, None, e.get('thr', 14))
        t = cv2.dilate(t.astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (int(3 * k) | 1, int(3 * k) | 1))) > 0
        bgr = inpaint(bgr, t, k)
        dbg[t] = dbg[t] * .3 + np.array([255, 0, 255]) * .7
    for e in spec.get('erase_poly', []):
        lab = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB); hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)
        pm = poly(bgr.shape, e['poly'], k)
        t = text_pixels(lab, hsv, pm, e.get('mode', 'all'), k, e.get('maxchroma'), e.get('thr', 22))
        bgr = inpaint(bgr, t, k, pm, e.get('smooth', .8))
        dbg[t] = dbg[t] * .3 + np.array([255, 0, 255]) * .7

    # 2) vêtements : détourage SAM, effacement des écrits dans la luminosité, recoloration
    rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV).astype(np.float32)
    lab = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB)
    V = hsv[..., 2].copy()
    acc = rgb.astype(np.float32)
    palette = [(0, 0, 255), (0, 200, 0), (255, 120, 0), (0, 200, 255), (200, 0, 200), (255, 255, 0)]
    for i, g in enumerate(spec.get('garments', [])):
        m = poly(bgr.shape, g['poly'], k).astype(np.float32) if 'poly' in g else sam_mask(rgb, g['crop'], g['pos'], g.get('neg', []), k)
        if 'within' in g:
            m *= poly(bgr.shape, g['within'], k)
        for tp in g.get('text_polys', []):
            m = np.maximum(m, poly(bgr.shape, tp, k).astype(np.float32) * (m.max() > 0))
        a = refine(m, bgr, r)
        for tp in g.get('text_polys', []):          # le filtre guidé ne doit pas « rejeter » les lettrages
            a = np.maximum(a, cv2.GaussianBlur(poly(bgr.shape, tp, k).astype(np.float32), (0, 0), k))
        core = a > .5
        Vg = V.copy()
        if g.get('clean_text', True):
            t = text_pixels(lab, hsv.astype(np.uint8), cv2.erode(core.astype(np.uint8), np.ones((max(2, r // 2),) * 2, np.uint8)) > 0,
                            'bright', k, None, 22, g.get('text_thr', 14))
            t = cv2.dilate(t.astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (int(4 * k) | 1,) * 2)) > 0
            for tp in g.get('text_polys', []):          # grands lettrages : zone entière reconstruite
                t |= poly(bgr.shape, tp, k)
            t &= core
            if t.any():
                # luminosité du tissu sous les lettres : reconstruite à partir du tissu voisin (hors lettres)
                cloth = core & ~t
                Vc = np.where(cloth, V, 0).astype(np.float32)
                w = cloth.astype(np.float32)
                sig = g.get('sigma', 6) * k
                est = cv2.GaussianBlur(Vc, (0, 0), sig) / np.maximum(cv2.GaussianBlur(w, (0, 0), sig), 1e-3)
                tb = cv2.GaussianBlur(t.astype(np.float32), (0, 0), k)
                Vg = Vg * (1 - tb) + est * tb
        h, s, gain, off = COLORS[g.get('color', 'navy')]
        if g.get('keep_whites'):          # chemise à carreaux : seuls les carreaux sombres changent, jamais la peau
            C = np.hypot(lab[..., 1].astype(np.float32) - 128, lab[..., 2].astype(np.float32) - 128)
            a = a * np.clip((150 - Vg) / 60, 0, 1) * np.clip((14 - C) / 6, 0, 1)
        tgt = np.stack([np.full(V.shape, h, np.float32), np.full(V.shape, s, np.float32), np.clip(Vg * gain + off, 0, 255)], -1)
        tgt = cv2.cvtColor(tgt.astype(np.uint8), cv2.COLOR_HSV2RGB).astype(np.float32)
        acc = acc * (1 - a[..., None]) + tgt * a[..., None]
        c = np.array(palette[i % len(palette)][::-1], np.float32)
        dbg = dbg * (1 - a[..., None] * .55) + c * a[..., None] * .55

    img = Image.fromarray(np.clip(acc, 0, 255).astype(np.uint8))

    # 3) écussons
    crest = Image.open(spec['crest']).convert('RGBA')
    for (x, y, w, ang) in spec.get('crests', []):
        W = int(w * k); c = crest.resize((W, int(W * crest.height / crest.width)), Image.LANCZOS)
        if ang:
            c = c.rotate(ang, expand=True, resample=Image.BICUBIC)
        X, Y = int(x * k), int(y * k)
        lum = img.crop((X, Y, X + c.width, Y + c.height)).convert('L')
        lum = lum.point(lambda v: min(255, 150 + v)).filter(ImageFilter.GaussianBlur(k))
        shaded = ImageChops.multiply(c.convert('RGB'), Image.merge('RGB', [lum] * 3))
        img.paste(shaded, (X, Y), c.split()[3].point(lambda v: int(v * .95)))

    img.save(out, quality=95)
    if debug:
        cv2.imwrite(out.rsplit('.', 1)[0] + '_debug.jpg', cv2.resize(np.clip(dbg, 0, 255).astype(np.uint8), None, fx=.5, fy=.5))


if __name__ == '__main__':
    spec_path = sys.argv[3]
    spec = json.load(open(spec_path))
    spec['crest'] = os.path.join(os.path.dirname(os.path.abspath(spec_path)), spec['crest'])
    run(sys.argv[1], sys.argv[2], spec, float(sys.argv[4]), '--debug' in sys.argv)
