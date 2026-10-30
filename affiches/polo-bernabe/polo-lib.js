// Dessin des polos RCA (bleu / blanc) — partagé par polos-maillots.html et tenue-mannequin.html
const GREEN = '#22a34a', YELLOW = '#f5c400', WHITE = '#ffffff', NAVY = '#0c1946';

const THEMES = {
  bleu: {
    base: NAVY, placket: '#0d1a48', cuffBand: '#0c1842', collar: NAVY, lining: '#1d8d42',
    yoke: GREEN, yokeTrims: [[YELLOW, 4, 4]], ink: '#ffffff', logo: 'bernabe.svg',
    shade: .38, hl: .09, fold: .12, emb: .55, button: ['#0a1236', '#1b2a63'],
    streaks: [[165, 466, 175, 9, YELLOW, 1], [178, 489, 140, 5, WHITE, .75], [160, 512, 185, 10, GREEN, 1]],
  },
  blanc: {
    base: '#f4f4f1', placket: '#ecece8', cuffBand: NAVY, collar: NAVY, lining: '#1d8d42',
    yoke: NAVY, yokeTrims: [[GREEN, 4.5, 4.5], [YELLOW, 3.5, 10]], ink: NAVY, logo: 'bernabe-marine.svg',
    shade: .17, hl: .25, fold: .06, emb: .28, button: ['#c9ccd6', NAVY],
    streaks: [[158, 448, 230, 24, '#dbe1ec', 1], [148, 488, 250, 30, '#e3e8f1', 1], [170, 530, 205, 18, '#dbe1ec', 1],
              [168, 440, 160, 5, GREEN, 1], [184, 512, 170, 4.5, YELLOW, 1]],
  },
};

const BODY = 'M250 60 C222 68 192 78 166 92 L92 120 C72 150 58 190 47 232 L126 269 C134 258 142 248 151 240 '
           + 'C153 360 152 480 151 600 Q300 615 449 600 C448 480 447 360 449 240 C458 248 466 258 474 269 '
           + 'L553 232 C542 190 528 150 508 120 L434 92 C408 78 378 68 350 60 Z';
const YOKE = 'M0 0 H600 V150 L440 110 L300 150 L160 110 L0 150 Z';
const YOKE_EDGE = 'M0 150 L160 110 L300 150 L440 110 L600 150';
const COLLAR_L = 'M300 50 C276 49 255 52 243 59 L207 89 L263 153 L293 66 C295 58 297 54 300 53 Z';
const COLLAR_B = 'M232 58 C262 46 338 46 368 58 L388 94 Q300 76 212 94 Z';
const mirrorPts = s => s.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (m, x, y) => `${600 - x} ${y}`);

const CUFF = { p1: [47, 232], p2: [126, 269], d: [0.44, -0.9] };
function cuff(side, T) {
  const f = ([x, y]) => side === 'L' ? [x, y] : [600 - x, y];
  const d = side === 'L' ? CUFF.d : [-CUFF.d[0], CUFF.d[1]];
  const off = (p, t) => [p[0] + d[0] * t, p[1] + d[1] * t];
  const P1 = f(CUFF.p1), P2 = f(CUFF.p2);
  const band = [P1, P2, off(P2, 24), off(P1, 24)].map(p => p.join(' ')).join(' L ');
  const line = (t, col, w) => `<line x1="${off(P1, t)[0]}" y1="${off(P1, t)[1]}" x2="${off(P2, t)[0]}" y2="${off(P2, t)[1]}" stroke="${col}" stroke-width="${w}"/>`;
  let ribs = '';
  for (let i = 1; i < 26; i++) {
    const a = [P1[0] + (P2[0] - P1[0]) * i / 26, P1[1] + (P2[1] - P1[1]) * i / 26];
    ribs += `<line x1="${a[0]}" y1="${a[1]}" x2="${a[0] + d[0] * 24}" y2="${a[1] + d[1] * 24}" stroke="#000" stroke-opacity=".18" stroke-width=".7"/>`;
  }
  return `<path d="M ${band} Z" fill="${T.cuffBand}"/>` + ribs
    + line(5, GREEN, 3.2) + line(8.6, YELLOW, 3.2) + line(11.6, WHITE, 2) + line(14.6, GREEN, 3.2)
    + `<path d="M ${off(P1, 24).join(' ')} L ${off(P2, 24).join(' ')}" stroke="#000" stroke-opacity=".25" stroke-width="1.2"/>`;
}

function tipping(edge, clip) {
  return `<g clip-path="url(#${clip})" fill="none" stroke-linejoin="round">
    <path d="${edge}" stroke="${WHITE}" stroke-width="28"/><path d="${edge}" stroke="${GREEN}" stroke-width="23"/>
    <path d="${edge}" stroke="${YELLOW}" stroke-width="15"/><path d="${edge}" stroke="${GREEN}" stroke-width="8"/>
    <path d="${edge}" stroke="#0b1740" stroke-width="3"/></g>`;
}

function streak(x, y, len, th, col, op) {
  const t = th / 2;
  return `<path transform="translate(${x} ${y}) rotate(-12)" d="M0 0 L${len - t} ${-t} A${t} ${t} 0 0 1 ${len - t} ${t} Z" fill="${col}" opacity="${op}"/>`;
}

function polo(T, view, uid, vb, raw) {
  const id = n => `${n}${uid}`;
  const values = (x, y, a) => `<g transform="translate(${x} ${y}) rotate(${a})" font-family="Montserrat" font-weight="800" font-size="8.4" fill="${T.ink}" text-anchor="middle" filter="url(#${id('emb')})">
      <text y="-13.5">COURAGE,</text><text y="-3">ENGAGEMENT,</text><text y="7.5">SOLIDARITÉ</text><text y="18">ET DÉPASSEMENT</text></g>`;
  const sponsor = (x, y, a) => `<g transform="translate(${x} ${y}) rotate(${a})"><image href="${T.logo}" x="-27" y="-23.2" width="54" height="46.3" filter="url(#${id('emb')})"/></g>`;
  const defs = `<defs>
    <clipPath id="${id('b')}"><path d="${BODY}"/></clipPath>
    <linearGradient id="${id('sh')}" x1="0" x2="1">
      <stop offset="0" stop-color="#000" stop-opacity="${T.shade}"/><stop offset=".2" stop-color="#000" stop-opacity="0"/>
      <stop offset=".8" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${T.shade}"/></linearGradient>
    <radialGradient id="${id('hl')}" cx=".42" cy=".28" r=".55"><stop offset="0" stop-color="#fff" stop-opacity="${T.hl}"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <linearGradient id="${id('vt')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset=".85" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${T.shade * .6}"/></linearGradient>
    <filter id="${id('pq')}" x="0" y="0" width="1" height="1">
      <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" seed="7"/><feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="table" tableValues="0 .1"/></feComponentTransfer><feComposite in2="SourceGraphic" operator="in"/></filter>
    <filter id="${id('emb')}" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="1.2" stdDeviation=".9" flood-color="#000" flood-opacity="${T.emb}"/></filter>
    <filter id="${id('sd')}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9"/></filter>
    <clipPath id="${id('cl')}"><path d="${COLLAR_L}"/></clipPath>
    <clipPath id="${id('cr')}"><path d="${mirrorPts(COLLAR_L)}"/></clipPath>
    <clipPath id="${id('cb')}"><path d="${COLLAR_B}"/></clipPath>
  </defs>`;

  let g = `<path d="${BODY}" fill="#0a1747" opacity=".22" transform="translate(10 16)" filter="url(#${id('sd')})"/>
    <path d="${BODY}" fill="${T.base}"/>`;
  let inner = '';
  // traînées de vitesse (devant)
  if (view === 'face') inner += T.streaks.map(s => streak(...s)).join('');
  // empiècement d'épaules + liserés
  inner += `<path d="${YOKE}" fill="${T.yoke}"/>`;
  for (const [col, w, dy] of T.yokeTrims)
    inner += `<path d="${YOKE_EDGE}" transform="translate(0 ${dy})" fill="none" stroke="${col}" stroke-width="${w}" stroke-linejoin="miter"/>`;
  // plis
  inner += `<g fill="none" stroke-linecap="round">
      <path d="M190 330 C215 420 205 520 214 598" stroke="#000" stroke-opacity="${T.fold}" stroke-width="10"/>
      <path d="M410 300 C390 400 400 500 392 598" stroke="#000" stroke-opacity="${T.fold}" stroke-width="10"/>
      <path d="M236 262 C270 280 330 280 366 262" stroke="#000" stroke-opacity="${T.fold * .6}" stroke-width="14"/>
      <path d="M160 245 C190 230 205 215 215 190" stroke="#000" stroke-opacity="${T.fold * 1.1}" stroke-width="7"/>
      <path d="M440 245 C410 230 395 215 385 190" stroke="#000" stroke-opacity="${T.fold * 1.1}" stroke-width="7"/></g>`;
  inner += `<path d="M153 586 Q300 600 447 586" fill="none" stroke="${T.ink}" stroke-opacity=".2" stroke-width="1" stroke-dasharray="3 3"/>
    <path d="M153 572 L160 600 M447 572 L440 600" stroke="#000" stroke-opacity=".3" stroke-width="1.5"/>
    <path d="M151 240 C156 200 162 140 166 92 M449 240 C444 200 438 140 434 92" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="1.6"/>`;
  inner += cuff('L', T) + cuff('R', T);

  if (view === 'face') {
    inner += `<path d="M286 66 L286 252 L314 252 L314 66 Z" fill="${T.placket}"/>
      <path d="M286 66 L286 252 M314 66 L314 252 M286 252 L314 252" stroke="#000" stroke-opacity=".3" stroke-width="1.4" fill="none"/>
      <path d="M289.5 70 L289.5 248.5 L310.5 248.5 L310.5 70" stroke="${T.ink}" stroke-opacity=".2" stroke-width=".9" stroke-dasharray="2.4 2.4" fill="none"/>`;
    for (const y of [140, 180, 220])
      inner += `<circle cx="300" cy="${y}" r="6.2" fill="${T.button[0]}"/><circle cx="300" cy="${y}" r="5" fill="${T.button[1]}"/>
        <circle cx="298.6" cy="${y - 1.4}" r="1.5" fill="#fff" opacity=".3"/>
        <circle cx="298.4" cy="${y + 1.4}" r=".75" fill="#05091f"/><circle cx="301.6" cy="${y - 1.4}" r=".75" fill="#05091f"/>
        <circle cx="298.4" cy="${y - 1.4}" r=".75" fill="#05091f"/><circle cx="301.6" cy="${y + 1.4}" r=".75" fill="#05091f"/>`;
    inner += `<image href="ecusson.png" x="350" y="156" width="70" height="84" filter="url(#${id('emb')})"/>`;
    inner += values(111, 198, 25) + sponsor(488, 194, -18);
  } else {
    inner += `<g font-family="Montserrat" fill="${T.ink}" text-anchor="middle" filter="url(#${id('emb')})">
        <text x="300" y="196" font-weight="800" font-size="22" letter-spacing="2">RUGBY CLUB</text>
        <text x="300" y="250" font-weight="900" font-size="48" letter-spacing="1">AKANDA</text>
        <text x="300" y="288" font-weight="800" font-size="18" letter-spacing="3">RCA</text></g>
      <path d="M222 282 L268 282" stroke="${GREEN}" stroke-width="3"/><path d="M234 282 L268 282" stroke="${YELLOW}" stroke-width="3"/>
      <path d="M332 282 L378 282" stroke="${YELLOW}" stroke-width="3"/><path d="M366 282 L378 282" stroke="${GREEN}" stroke-width="3"/>`;
    inner += sponsor(112, 194, 18) + values(489, 198, -25);
  }
  inner += `<rect width="600" height="640" fill="#fff" filter="url(#${id('pq')})" style="mix-blend-mode:overlay"/>
    <rect width="600" height="640" fill="url(#${id('sh')})"/><rect width="600" height="640" fill="url(#${id('hl')})"/>
    <rect width="600" height="640" fill="url(#${id('vt')})"/>`;
  g += `<g clip-path="url(#${id('b')})">${inner}</g><path d="${BODY}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="1.2"/>`;

  if (view === 'face') {
    g += `<path d="M262 64 C285 58 315 58 338 64 L316 104 L284 104 Z" fill="${T.lining}"/>
      <path d="M262 64 C285 58 315 58 338 64" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="2"/>
      <path d="M284 104 L316 104 L312 84 L288 84 Z" fill="#000" opacity=".22"/>
      <path d="M284 104 L316 104" stroke="#000" stroke-opacity=".35" stroke-width="1.2"/>`;
    for (const [shape, clip] of [[COLLAR_L, 'cl'], [mirrorPts(COLLAR_L), 'cr']]) {
      const edge = clip === 'cl' ? 'M244 58 L207 89 L263 153' : mirrorPts('M244 58 L207 89 L263 153');
      g += `<path d="${shape}" fill="#0e1b4c" transform="translate(2 4)" opacity=".45" filter="url(#${id('sd')})"/>
        <path d="${shape}" fill="${T.collar}"/>${tipping(edge, id(clip))}
        <path d="${shape}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="1.1"/>`;
    }
  } else {
    g += `<path d="${COLLAR_B}" fill="#0b1640" transform="translate(0 5)" opacity=".5" filter="url(#${id('sd')})"/>
      <path d="${COLLAR_B}" fill="${T.collar}"/>${tipping('M212 94 Q300 76 388 94', id('cb'))}
      <path d="${COLLAR_B}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="1.1"/>`;
  }
  return raw ? [defs, g] : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb || '0 30 600 620'}" preserveAspectRatio="xMidYMid meet">${defs}${g}</svg>`;
}

