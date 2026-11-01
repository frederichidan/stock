"""Maquette photo : ajoute le logo Bernabé (brodé) sur le modèle de polo envoyé par le club.

- polo de face : logo Bernabé sur la poitrine, côté opposé à l'écusson (plus rien sur la manche) ;
- casquette : le texte du côté est effacé et remplacé par le logo Bernabé ;
- coffret : logo Bernabé sur le petit polo.

Entrée : photo agrandie x4 (EDSR) du modèle. Coordonnées données dans la photo d'origine (1080 x 986).
Usage : python3 compose.py modele-x4.png logo-bernabe-1200.png sortie.png
(modele-x4.png : modele-polo.jpg agrandi x4 avec EDSR ; logo-bernabe-1200.png : bernabe.svg rendu en 1200 px, fond transparent)
"""
import sys, cv2, numpy as np

S = 4
img = cv2.imread(sys.argv[1]).astype(np.float32)
logo = cv2.imread(sys.argv[2], cv2.IMREAD_UNCHANGED)
ys, xs = np.where(logo[..., 3] > 0)
logo = logo[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
rng = np.random.default_rng(7)


def erase_text(x0, y0, x1, y1, ring=6):
    """Efface un texte sur tissu uni : le rectangle est recouvert par un dégradé de tissu
    (surface quadratique ajustée sur une bordure autour du texte) + grain."""
    X0, Y0, X1, Y1, R = x0 * S, y0 * S, x1 * S, y1 * S, ring * S
    big = img[Y0 - R:Y1 + R, X0 - R:X1 + R]
    hh, ww = big.shape[:2]
    yy, xx = np.mgrid[0:hh, 0:ww].astype(np.float32)
    inside = (xx >= R) & (xx < ww - R) & (yy >= R) & (yy < hh - R)
    u, v = xx / ww - .5, yy / hh - .5
    A = np.stack([np.ones_like(u), u, v, u * u, u * v, v * v], -1)
    # bordure : seulement les pixels de tissu marine (exclut le fond de la photo au bord de la casquette)
    navy = (big[..., 0] - big[..., 2] > 20) & (big[..., 0] < 120)
    ring = ~inside & navy
    fit = np.zeros_like(big)
    for c in range(3):
        coef, *_ = np.linalg.lstsq(A[ring], big[..., c][ring], rcond=None)
        fit[..., c] = A @ coef
    grain = cv2.GaussianBlur(rng.normal(0, 3.0, (hh, ww)).astype(np.float32), (0, 0), S / 3)[..., None]
    m = inside.astype(np.float32)
    a = np.clip(cv2.GaussianBlur(m, (0, 0), R / 3) * 1.6, 0, 1)[..., None]
    img[Y0 - R:Y1 + R, X0 - R:X1 + R] = big * (1 - a) + (fit + grain) * a


def place(cx, cy, w, angle=0.0, sx=1.0, shade=0.9, soft=0.9, white=0.92):
    """Pose le logo brodé centré en (cx, cy), largeur w (pixels d'origine)."""
    W = int(w * S)
    H = int(W * logo.shape[0] / logo.shape[1])
    lg = cv2.resize(logo, (W, H), interpolation=cv2.INTER_AREA).astype(np.float32)
    # rotation + compression horizontale (courbure du tissu)
    pad = int(0.3 * max(W, H))
    lg = cv2.copyMakeBorder(lg, pad, pad, pad, pad, cv2.BORDER_CONSTANT, value=0)
    c = (lg.shape[1] / 2, lg.shape[0] / 2)
    M = cv2.getRotationMatrix2D(c, -angle, 1.0)
    M[0] *= sx
    M[0, 2] += (1 - sx) * c[0]
    lg = cv2.warpAffine(lg, M, (lg.shape[1], lg.shape[0]), flags=cv2.INTER_CUBIC)
    h, w2 = lg.shape[:2]
    X0, Y0 = int(cx * S - w2 / 2), int(cy * S - h / 2)
    roi = img[Y0:Y0 + h, X0:X0 + w2]
    rgb, a = lg[..., :3], lg[..., 3:] / 255
    # fil blanc légèrement cassé, comme la broderie de l'écusson
    rgb = np.where(rgb.mean(-1, keepdims=True) > 200, rgb * white, rgb)
    # ombrage du tissu (plis, éclairage) repris sur la broderie
    g = cv2.cvtColor(roi.clip(0, 255).astype(np.uint8), cv2.COLOR_BGR2GRAY).astype(np.float32)
    lum = cv2.GaussianBlur(g, (0, 0), 3 * S)
    ref = np.median(lum) + 1e-3
    rgb = rgb * ((lum / ref).clip(.65, 1.3) ** shade)[..., None]
    # texture de points de broderie (fil oblique)
    n = rng.normal(0, 1, rgb.shape[:2]).astype(np.float32)
    k = np.zeros((7, 7), np.float32); np.fill_diagonal(k, 1 / 7)
    n = cv2.filter2D(n, -1, k)
    rgb = rgb * (1 + 0.10 * n)[..., None]
    rgb = cv2.GaussianBlur(rgb, (0, 0), soft * S / 4)
    a = cv2.GaussianBlur(a, (0, 0), soft * S / 4)[..., None] if a.ndim == 3 else a
    # léger relief : ombre portée sous la broderie
    sh = cv2.GaussianBlur(np.roll(a[..., 0], S, axis=0), (0, 0), 1.2 * S)[..., None]
    roi = roi * (1 - 0.35 * sh)
    img[Y0:Y0 + h, X0:X0 + w2] = roi * (1 - a) + rgb * a


# polo de face : logo sur la poitrine, en face de l'écusson (centre de l'écusson ~ (373, 204), patte ~ x 279)
place(185, 203, 74)
# casquette : texte du côté remplacé par le logo
erase_text(956, 472, 1024, 540)
place(988, 500, 54, angle=4, sx=.88, shade=1.0)
# coffret : petit polo
place(697, 821, 28, angle=4, soft=1.2, shade=1.0)

out = img.clip(0, 255).astype(np.uint8)
cv2.imwrite(sys.argv[3], out)
print('ok', out.shape)
