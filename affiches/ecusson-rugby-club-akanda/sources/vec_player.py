"""Vectorise le joueur de l'écusson (PNG RGBA) en calques de couleur potrace, coordonnées de l'écusson."""
import subprocess, re, sys, numpy as np, cv2
SRC = '/home/user/stock/affiches/ecusson-rugby-club-akanda/player_hd.png'
W = int(sys.argv[1]) if len(sys.argv) > 1 else 1200
K = int(sys.argv[2]) if len(sys.argv) > 2 else 8
T = int(sys.argv[3]) if len(sys.argv) > 3 else 30
im = cv2.imread(SRC, cv2.IMREAD_UNCHANGED)
H = round(im.shape[0] * W / im.shape[1])
im = cv2.resize(im, (W, H), interpolation=cv2.INTER_AREA)
a = im[..., 3]; rgb = np.ascontiguousarray(im[..., :3])
rgb = cv2.bilateralFilter(rgb, 7, 30, 7)
op = a > 127
lab = cv2.cvtColor(rgb, cv2.COLOR_BGR2LAB).astype(np.float32)
X = lab[op]
crit = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 50, 0.5)
_, lbl, cen = cv2.kmeans(X, K, None, crit, 3, cv2.KMEANS_PP_CENTERS)
L = np.full(op.shape, -1, np.int32); L[op] = lbl.ravel()
L = cv2.medianBlur(L.astype(np.uint8) + 1, 5).astype(np.int32) - 1
L[~op] = -1
cen_bgr = cv2.cvtColor(cen.reshape(1, K, 3).astype(np.uint8), cv2.COLOR_LAB2BGR)[0]
hexs = ['#%02x%02x%02x' % (c[2], c[1], c[0]) for c in cen_bgr]
areas = [(L == k).sum() for k in range(K)]
base = int(np.argmin(cen[:, 0]))  # le plus sombre = silhouette de fond

def trace(mask, t):
    m = cv2.morphologyEx(mask.astype(np.uint8) * 255, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    cv2.imwrite('_m.pbm', 255 - m)
    subprocess.check_call(['potrace', '-s', '-t', str(t), '-a', '1.0', '-O', '0.6', '_m.pbm', '-o', '_m.svg'])
    s = open('_m.svg').read()
    d = ' '.join(re.findall(r'<path d="([^"]+)"', s, re.S))
    return re.sub(r'\s+', ' ', d)

layers = [(hexs[base], trace(op, T))]
order = sorted([k for k in range(K) if k != base], key=lambda k: -areas[k])
for k in order:
    layers.append((hexs[k], trace(L == k, T)))
sc = 258.4 / W
body = ''.join(f'<path fill="{c}" d="{d}"/>' for c, d in layers if d)
g = f'<g transform="translate(79 147) scale({sc:.6f}) translate(0 {H}) scale(0.1 -0.1)">{body}</g>'
open(f'player_{W}_{K}.svgfrag', 'w').write(g)
svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="79 147 258.4 224" width="1034" height="896"><rect x="79" y="147" width="258.4" height="224" fill="#1c3f9e"/>{g}</svg>'
open(f'player_{W}_{K}.svg', 'w').write(svg)
print(W, H, K, 'total', len(g), [(c, len(d)) for c, d in layers], 'areas', areas)
