/* Maquettes de présentation de chaque support, mises en scène vues de dessus (format 16:9,
   exportées en 8K : 7680 × 4320). Les supports sont dessinés par les mêmes fonctions que
   les fichiers d'impression (passeport.js, billet.js, menu.js). Toutes les mesures en mm. */

const MAQUETTES = {
  pochette: { nom: "Pochette passeport", largeur: 440, construire: scenePochette },
  billet: { nom: "Billet d'invitation", largeur: 380, construire: sceneBillet },
  menu: { nom: "Carte de menu", largeur: 520, construire: sceneMenu },
  ensemble: { nom: "Ensemble", largeur: 520, construire: sceneEnsemble },
};

/* ------------------------------ Outils ------------------------------ */

function faces(html) {
  const modele = document.createElement("template");
  modele.innerHTML = html;
  return [...modele.content.querySelectorAll(".page")].map((page) => page.outerHTML);
}

// Pose un élément centré en (x, y), tourné de `rotation` degrés.
function poser(contenu, { x, y, rotation = 0, z = 1 }) {
  return `<div class="objet" style="left:${x}mm;top:${y}mm;z-index:${z};transform:translate(-50%,-50%) rotate(${rotation}deg)">${contenu}</div>`;
}

const carte = (html, classe = "") => `<div class="carte ${classe}">${html}</div>`;

// Pochette fermée, vue côté couverture (moitié droite de l'extérieur) ou côté dos (moitié gauche).
function livretFerme(exterieur, cote) {
  const decalage = cote === "couverture" ? -105 : 0;
  return `<div class="livret"><div class="epaisseur"></div>
    ${carte(`<div class="decoupe"><div style="margin-left:${decalage}mm">${exterieur}</div></div>`)}</div>`;
}

function aleatoire(graine) {
  return () => {
    graine = (graine + 0x6d2b79f5) >>> 0;
    let t = graine;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------ Décor ------------------------------ */

// Marbre clair : veines obtenues en ne gardant que les « plis » d'un bruit de turbulence.
function marbre(largeur, hauteur) {
  return `<svg class="fond" viewBox="0 0 ${largeur} ${hauteur}" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <filter id="marbre-veines" x="0" y="0" width="1" height="1" color-interpolation-filters="sRGB">
        <feTurbulence type="turbulence" baseFrequency="0.011 0.006" numOctaves="5" seed="23" result="bruit"/>
        <feColorMatrix in="bruit" type="matrix" values="0 0 0 0 0.52  0 0 0 0 0.5  0 0 0 0 0.55  -1.25 0 0 0 1"/>
        <feComponentTransfer><feFuncA type="gamma" amplitude="0.55" exponent="9" offset="0"/></feComponentTransfer>
        <feGaussianBlur stdDeviation="0.12"/>
      </filter>
      <filter id="marbre-nuages" x="0" y="0" width="1" height="1" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.004 0.007" numOctaves="4" seed="5"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.62  0 0 0 0 0.6  0 0 0 0 0.64  0.9 0 0 0 -0.38"/>
      </filter>
      <radialGradient id="marbre-lumiere" cx="0.3" cy="0.25" r="0.9">
        <stop offset="0" stop-color="#f8f6f2"/><stop offset="1" stop-color="#e9e5de"/>
      </radialGradient>
    </defs>
    <rect width="${largeur}" height="${hauteur}" fill="url(#marbre-lumiere)"/>
    <rect width="${largeur}" height="${hauteur}" filter="url(#marbre-nuages)" opacity="0.5"/>
    <rect width="${largeur}" height="${hauteur}" filter="url(#marbre-veines)"/>
  </svg>`;
}

// Ruban de satin violet qui traverse un coin de la scène.
function rubanSatin(chemin, largeur, hauteur) {
  const id = idUnique("satin");
  return `<svg class="accessoires" style="z-index:0" viewBox="0 0 ${largeur} ${hauteur}" aria-hidden="true">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#2b1159"/><stop offset="0.35" stop-color="#5d2ca3"/>
      <stop offset="0.55" stop-color="#7a4bc0"/><stop offset="0.75" stop-color="#4a2384"/><stop offset="1" stop-color="#26104f"/>
    </linearGradient></defs>
    <g class="ruban-satin" fill="none" stroke-linecap="butt">
      <path d="${chemin}" stroke="url(#${id})" stroke-width="15"/>
      <path d="${chemin}" stroke="rgba(255,255,255,0.18)" stroke-width="3" transform="translate(-1.6,-1.6)"/>
    </g>
  </svg>`;
}

// Confettis dorés, placés hors des zones occupées par les supports.
function confettis(largeur, hauteur, nombre, graine, zonesLibres) {
  const hasard = aleatoire(graine);
  const id = idUnique("confetti");
  let points = "";
  for (let n = 0, essais = 0; n < nombre && essais < nombre * 40; essais += 1) {
    const x = 6 + hasard() * (largeur - 12);
    const y = 6 + hasard() * (hauteur - 12);
    if (zonesLibres.some(([x0, y0, x1, y1]) => x > x0 && x < x1 && y > y0 && y < y1)) continue;
    const r = 1.1 + hasard() * 1.6;
    points += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}" fill="url(#${id})"/>`;
    n += 1;
  }
  return `<svg class="accessoires sombre" style="z-index:40" viewBox="0 0 ${largeur} ${hauteur}" aria-hidden="true">
    <defs>${degrade(id, "orn")}</defs>
    <g style="filter: drop-shadow(0.3mm 0.5mm 0.4mm rgba(40, 28, 10, 0.4))">${points}</g>
  </svg>`;
}

function alliances(largeur) {
  return `<div class="sombre alliances" style="width:${largeur}mm">${anneauxDores()}</div>`;
}

// Couteau et fourchette dorés (vue de dessus, pointe vers le haut).
function couvert(type) {
  const id = idUnique("orn");
  const manche = `<rect x="2.5" y="${type === "couteau" ? 106 : 92}" width="11" height="${type === "couteau" ? 114 : 108}" rx="5.5"/>`;
  const tete =
    type === "couteau"
      ? `<path d="M4,104 L4,16 C4,7 8,1.5 13.5,0 L14,0 L14,104 Z"/><rect x="3" y="102" width="10" height="6" rx="1.5"/>`
      : `<path d="M1,0 h2.4 v34 h2.2 v-34 h2.4 v34 h2.2 v-34 h2.4 v34 h2.2 v-34 h2.4 v38 C15,50 11,56 10.6,66 L10.6,94 L5.4,94 L5.4,66 C5,56 1,50 1,38 Z"/>`;
  return `<svg class="couvert sombre" viewBox="0 0 16 220" style="width:16mm;height:220mm" aria-hidden="true">
    <defs>${degrade(id, "orn")}</defs>
    <g fill="url(#${id})">${tete}${manche}</g>
    <path d="M8,${type === "couteau" ? 112 : 98} V212" stroke="rgba(255,248,225,0.55)" stroke-width="0.8" stroke-linecap="round"/>
  </svg>`;
}

function grainDonnees() {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.9 0'/></filter><rect width='120' height='120' filter='url(#g)'/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg).replace(/'/g, "%27")}`;
}

/* ------------------------------ Scènes ------------------------------ */

function scenePochette(theme, l, h) {
  const [exterieur, interieur] = faces(passeport(theme));
  return [
    rubanSatin(`M -20 ${h - 30} C 60 ${h - 70}, 120 ${h + 10}, 210 ${h + 25}`, l, h),
    poser(carte(interieur, "livret-ouvert"), { x: 140, y: 126, rotation: -3, z: 2 }),
    poser(livretFerme(exterieur, "dos"), { x: 302, y: 130, rotation: -9, z: 3 }),
    poser(livretFerme(exterieur, "couverture"), { x: 372, y: 118, rotation: 7, z: 4 }),
    poser(alliances(34), { x: 300, y: 222, rotation: -18, z: 5 }),
    confettis(l, h, 26, 7, [[25, 40, 260, 215], [235, 35, 435, 215]]),
  ].join("");
}

function sceneBillet(theme, l, h) {
  const [recto, verso] = faces(billet(theme));
  return [
    rubanSatin(`M ${l + 20} 30 C ${l - 60} 10, ${l - 80} 90, ${l - 30} 150 S ${l - 20} ${h + 20}, ${l - 90} ${h + 30}`, l, h),
    poser(carte(verso), { x: 222, y: 153, rotation: 3, z: 2 }),
    poser(carte(recto), { x: 152, y: 60, rotation: -4, z: 3 }),
    confettis(l, h, 22, 11, [[40, 0, 265, 122], [108, 95, 340, 212]]),
  ].join("");
}

function sceneMenu(theme, l, h) {
  const [recto, verso] = faces(carteMenu(theme));
  const cx = 210;
  const cy = h / 2;
  return [
    rubanSatin(`M -20 40 C 30 20, 40 120, 10 ${h - 60} S 40 ${h + 10}, 90 ${h + 30}`, l, h),
    poser(`<div class="assiette presentation" style="width:280mm;height:280mm"></div>`, { x: cx, y: cy, z: 1 }),
    poser(`<div class="assiette porcelaine" style="width:236mm;height:236mm"></div>`, { x: cx, y: cy, z: 2 }),
    poser(carte(recto), { x: cx, y: cy, rotation: -3, z: 3 }),
    poser(couvert("fourchette"), { x: cx - 168, y: cy, rotation: 0, z: 2 }),
    poser(couvert("couteau"), { x: cx + 168, y: cy, rotation: 0, z: 2 }),
    poser(carte(verso), { x: 452, y: cy - 4, rotation: 6, z: 2 }),
    confettis(l, h, 18, 3, [[40, 0, 400, h], [395, 20, 515, h - 20]]),
  ].join("");
}

function sceneEnsemble(theme, l, h) {
  const [exterieur] = faces(passeport(theme));
  const [billetRecto] = faces(billet(theme));
  const [menuRecto] = faces(carteMenu(theme));
  return [
    rubanSatin(`M -20 ${h - 40} C 80 ${h - 90}, 170 ${h + 5}, 300 ${h + 25}`, l, h),
    poser(carte(billetRecto), { x: 228, y: 92, rotation: 9, z: 2 }),
    poser(livretFerme(exterieur, "couverture"), { x: 128, y: 150, rotation: -8, z: 3 }),
    poser(carte(menuRecto), { x: 425, y: 150, rotation: 4, z: 2 }),
    poser(alliances(32), { x: 272, y: 222, rotation: 14, z: 4 }),
    confettis(l, h, 26, 19, [[55, 60, 205, 245], [115, 30, 345, 155], [355, 25, 495, 275]]),
  ].join("");
}

/* ------------------------------ Rendu ------------------------------ */

function maquette(nom, theme) {
  const m = MAQUETTES[nom] || MAQUETTES.ensemble;
  const l = m.largeur;
  const h = (l * 9) / 16;
  return `<div class="scene" style="width:${l}mm;height:${h}mm;--grain:url('${grainDonnees()}')">
    ${marbre(l, h)}
    ${m.construire(theme, l, h)}
    <div class="lumiere"></div>
  </div>`;
}
