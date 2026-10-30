import json, base64, io
from PIL import Image
P=json.load(open('player_hd.json'))
x0,y0,x1,y1=P['box']; S=P['S']

K=0.40; PX,PY=79,147        # placement du joueur dans l'écusson
W=(x1-x0)*K; H=(y1-y0)*K
# contour potrace : coordonnées dans l'espace du masque agrandi (S) -> ramener à l'échelle K
ol=f'<g transform="translate({PX} {PY}) scale({K/S})"><g transform="{P["tr"]}">'+''.join(f'<path d="{d}"/>' for d in P['paths'])+'</g></g>'

def streak(x,y,length,thick,angle,color,op=1):
    # traînée effilée : pointe à gauche, extrémité arrondie à droite
    t=thick/2
    return (f'<path transform="translate({x} {y}) rotate({angle})" d="M0 0 L{length-t} {-t} A{t} {t} 0 0 1 {length-t} {t} Z" fill="{color}" opacity="{op}"/>')
Y,G,Wh='#f5c400','#22a34a','#ffffff'
streaks=''.join([
  streak(52,214,150,7,-10,Y), streak(70,236,120,4,-10,Wh,.9), streak(46,258,160,8,-9,G),
  streak(64,282,130,5,-9,Y), streak(40,306,150,6,-8,Wh,.9), streak(58,330,140,7,-8,Y),
  streak(44,352,120,4,-7,G), streak(300,352,70,4,-6,Y),
])
svg=f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 400 480" width="400" height="480">
  <defs>
    <path id="shield" d="M58 30 H342 Q362 30 362 50 V262 C362 362 292 424 200 460 C108 424 38 362 38 262 V50 Q38 30 58 30 Z"/>
    <clipPath id="inner"><use href="#shield" transform="translate(200 246) scale(.935) translate(-200 -246)"/></clipPath>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0b1a52"/><stop offset="1" stop-color="#1c3f9e"/>
    </linearGradient>
    <linearGradient id="field" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#27a84e"/><stop offset="1" stop-color="#157a36"/>
    </linearGradient>
  </defs>

  <!-- Bordure -->
  <use href="#shield" fill="#0b1a52"/>

  <g clip-path="url(#inner)">
    <rect width="400" height="480" fill="url(#sky)"/>
    <!-- Bandeau titre -->
    <path d="M0 0 H400 V160 Q200 196 0 176 Z" fill="#0b1a52"/>
    <path d="M0 176 Q200 196 400 160" fill="none" stroke="#ffffff" stroke-width="4"/>
    <!-- Terrain -->
    <path d="M0 312 C120 258 280 258 400 300 V480 H0 Z" fill="url(#field)"/>
    <path d="M0 312 C120 258 280 258 400 300" fill="none" stroke="#ffffff" stroke-width="3"/>
    <!-- Traînées de vitesse -->
    {streaks}
    <!-- Joueur -->
    <g fill="#ffffff">{ol}</g>
    <image x="{PX}" y="{PY}" width="{W:.2f}" height="{H:.2f}" xlink:href="player_hd.png"/>
  </g>

  <!-- Filet blanc intérieur -->
  <use href="#shield" fill="none" stroke="#ffffff" stroke-width="3.5" transform="translate(200 246) scale(.935) translate(-200 -246)"/>

  <!-- Titre -->
  <g font-family="Montserrat, sans-serif" fill="#ffffff" text-anchor="middle">
    <text x="200" y="88" font-weight="800" font-size="23" letter-spacing="2">RUGBY CLUB</text>
    <text x="200" y="148" font-weight="900" font-size="58" letter-spacing="1">AKANDA</text>
  </g>
  <path d="M72 82 L106 75 L106 81 L72 88 Z" fill="#f5c400"/>
  <path d="M294 75 L328 82 L328 88 L294 81 Z" fill="#f5c400"/>

  <!-- Sevens -->
  <g fill="#ffffff">
    <rect x="128" y="396" width="26" height="2.5" rx="1.25"/>
    <rect x="246" y="396" width="26" height="2.5" rx="1.25"/>
    <text x="200" y="403" font-family="Montserrat, sans-serif" font-weight="800" font-size="14" letter-spacing="4" text-anchor="middle">SEVENS</text>
    <text x="197" y="440" font-family="Montserrat, sans-serif" font-weight="900" font-style="italic" font-size="38" text-anchor="middle">7</text>
  </g>
  <path d="M210 413 L222 409 L204 444 L196 446 Z" fill="#f5c400"/>
</svg>'''
open('/home/user/stock/affiches/ecusson-rugby-club-akanda/ecusson-8k.svg','w').write(svg)
print(len(svg)//1024,'KB')
