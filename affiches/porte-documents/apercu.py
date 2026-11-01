# Aperçu : couverture, dos, et vue ouverte avec la poche repliée (à partir des rendus 8K)
from PIL import Image, ImageDraw, ImageFilter, ImageFont
k = 7680 / 446
mm = lambda v: int(round((v + 3) * k))
ext = Image.open('porte-documents-ext-8k.png').convert('RGB')
it = Image.open('porte-documents-int-8k.png').convert('RGB')
front = ext.crop((mm(220), mm(0), mm(440), mm(310)))
back = ext.crop((mm(0), mm(0), mm(220), mm(310)))
openv = it.crop((mm(0), mm(0), mm(440), mm(310)))
flap = ext.crop((mm(0), mm(310), mm(220), mm(410))).rotate(180)
x0, y0 = mm(220) - mm(0), mm(210) - mm(0)
sh = Image.new('RGBA', openv.size, (0, 0, 0, 0))
ImageDraw.Draw(sh).rectangle((x0, y0 - 25, openv.width, openv.height), fill=(0, 0, 0, 110))
sh = sh.filter(ImageFilter.GaussianBlur(30))
openv = openv.convert('RGBA'); openv.alpha_composite(sh); openv.paste(flap, (x0, y0)); openv = openv.convert('RGB')
ImageDraw.Draw(openv).line((x0, 0, x0, openv.height), fill=(200, 205, 220), width=6)
W, pad = 3840, 140
s = (W - 4 * pad) / (front.width * 2 + openv.width)
rs = lambda im: im.resize((int(im.width * s), int(im.height * s)), Image.LANCZOS)
F, B, O = rs(front), rs(back), rs(openv)
H = F.height + 480
bg = Image.new('RGB', (W, H), (230, 233, 240))
def shadow(im, xy):
    m = Image.new('RGBA', (im.width + 160, im.height + 160), (0, 0, 0, 0))
    ImageDraw.Draw(m).rectangle((80, 100, im.width + 80, im.height + 80), fill=(10, 23, 71, 120))
    m = m.filter(ImageFilter.GaussianBlur(40)); bg.paste(m, (xy[0] - 80, xy[1] - 80), m); bg.paste(im, xy)
y = 280
xs = [pad, pad * 2 + F.width, pad * 3 + F.width * 2]
for im, x in zip((F, B, O), xs): shadow(im, (x, y))
fnt = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 50)
d = ImageDraw.Draw(bg)
for t, x in zip(('COUVERTURE', 'DOS', 'OUVERT — POCHE REPLIÉE'), xs): d.text((x, 140), t, fill=(10, 23, 71), font=fnt)
bg.save('porte-documents-apercu.png', optimize=True)
print(bg.size)
