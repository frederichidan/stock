"""Détourage des logos : SAM avec un cadre (rectangle) + GrabCut, pour comparer."""
import sys, numpy as np, cv2
from PIL import Image
from rembg import new_session
sam = new_session('sam', sam_model='sam_vit_b_01ec64')
names = ['soof','rcl','margouillats','vautour-club','rcg','rcpg','feux-follets','amazones']
rows = []
for k in names:
    im = Image.open(f'{k}-x4.png').convert('RGB'); W, H = im.size
    m_in = int(.03 * W)
    box = [m_in, m_in, W - m_in, H - m_in]
    pr = [{'type': 'rectangle', 'label': 1, 'data': box}]
    m1 = np.array(sam.predict(im, sam_prompt=pr)[0].resize(im.size, Image.BILINEAR), np.float32) / 255
    a = np.array(im)[..., ::-1].copy()
    gm = np.zeros((H, W), np.uint8); bgd = np.zeros((1, 65), np.float64); fgd = np.zeros((1, 65), np.float64)
    cv2.grabCut(a, gm, (box[0], box[1], box[2] - box[0], box[3] - box[1]), bgd, fgd, 6, cv2.GC_INIT_WITH_RECT)
    m2 = np.where((gm == 1) | (gm == 3), 1.0, 0.0).astype(np.float32)
    np.save(f'{k}-sam.npy', m1); np.save(f'{k}-gc.npy', m2)
    row = []
    for m in (m1, m2):
        rgba = np.dstack([np.array(im), (m * 255).astype(np.uint8)])
        t = Image.fromarray(rgba, 'RGBA'); t.thumbnail((240, 240))
        bg = Image.new('RGB', (260, 260), (10, 23, 71)); bg.paste(t, ((260 - t.width) // 2, (260 - t.height) // 2), t)
        row.append(bg)
    rows.append(row)
S = Image.new('RGB', (260 * 8, 520))
for i, (a1, a2) in enumerate(rows): S.paste(a1, (i * 260, 0)); S.paste(a2, (i * 260, 260))
S.save('planche-detour2.png'); print('ok')
