/* Maquettes de présentation de chaque support, mises en scène vues de dessus (format 16:9,
   exportées en 8K : 7680 × 4320) ; les étiquettes, sur des bouteilles vues de face. Les supports
   sont dessinés par les mêmes fonctions que les fichiers d'impression (passeport.js, billet.js,
   menu.js, etiquettes.js). Toutes les mesures en mm. */

const MAQUETTES = {
  pochette: { nom: "Pochette passeport", largeur: 480, construire: scenePochette },
  billet: { nom: "Billet d’invitation premium", largeur: 400, construire: (t, l, h) => sceneBillet(t, l, h, "premium") },
  "billet-classique": { nom: "Billet d’invitation classique", largeur: 400, construire: (t, l, h) => sceneBillet(t, l, h, "classique") },
  menu: { nom: "Carte de menu", largeur: 520, construire: sceneMenu },
  ensemble: { nom: "Ensemble", largeur: 520, construire: sceneEnsemble },
  vin: { nom: "Étiquette de vin", largeur: 640, horizon: 248, construire: sceneVin },
  eau: { nom: "Étiquette d’eau 33 cl", largeur: 480, horizon: 168, construire: sceneEau },
  tables: { nom: "Cartes de table", largeur: 520, horizon: 150, construire: sceneTables },
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

/* Ombres portées « analytiques » (lumière en haut à gauche) : chaque couche est le produit
   d'une rampe horizontale (fond) et d'une rampe verticale (masque) qui suivent le profil d'un
   flou gaussien. Contrairement à box-shadow, dont le flou est calculé tuile par tuile et laisse
   des coutures visibles en 8K, ces dégradés sont parfaitement continus. */
const COUCHES_OMBRE = [
  [0.25, 0.4, 0.5, 0.3], // décalage x, décalage y, rayon de flou (mm), opacité
  [1.5, 2.6, 4.5, 0.2],
  [4, 8, 16, 0.13],
];

function ombre([l, h], arrondi = 0.5, couches = COUCHES_OMBRE) {
  return couches
    .map(([dx, dy, r, alpha]) => {
      const rampe = (direction, couleur) => {
        const arret = (k, position) => `${couleur(k)} ${position}`;
        return `linear-gradient(${direction}, ${[
          arret(0, "0mm"), arret(0.12, `${r * 0.5}mm`), arret(0.5, `${r}mm`), arret(0.88, `${r * 1.5}mm`), arret(1, `${r * 2}mm`),
          arret(1, `calc(100% - ${r * 2}mm)`), arret(0.88, `calc(100% - ${r * 1.5}mm)`), arret(0.5, `calc(100% - ${r}mm)`),
          arret(0.12, `calc(100% - ${r * 0.5}mm)`), arret(0, "100%"),
        ].join(", ")})`;
      };
      const teinte = (k) => `rgba(30, 20, 45, ${(alpha * k).toFixed(3)})`;
      const masque = rampe("180deg", (k) => `rgba(0, 0, 0, ${k})`);
      return `<div class="ombre" style="left:${dx - r}mm;top:${dy - r}mm;width:${l + 2 * r}mm;height:${h + 2 * r}mm;border-radius:${arrondi + r}mm;background:${rampe("90deg", teinte)};-webkit-mask-image:${masque};mask-image:${masque}"></div>`;
    })
    .join("");
}

function ombreRonde(diametre, couches) {
  const R = diametre / 2;
  return couches
    .map(([dx, dy, r, alpha]) => {
      const teinte = (k) => `rgba(40, 28, 10, ${(alpha * k).toFixed(3)})`;
      const fond = `radial-gradient(circle at center, ${teinte(1)} ${R - r}mm, ${teinte(0.88)} ${R - r / 2}mm, ${teinte(0.5)} ${R}mm, ${teinte(0.12)} ${R + r / 2}mm, ${teinte(0)} ${R + r}mm)`;
      return `<div class="ombre" style="left:${dx - r}mm;top:${dy - r}mm;width:${diametre + 2 * r}mm;height:${diametre + 2 * r}mm;background:${fond}"></div>`;
    })
    .join("");
}

// Carte posée : son ombre, puis le papier. `format` en mm.
const carte = (html, format, classe = "", arrondi = 0.5) =>
  `<div class="pose">${ombre(format, arrondi)}<div class="carte ${classe}">${html}</div></div>`;

function assiette(diametre, classe, couches) {
  return `<div class="pose">${ombreRonde(diametre, couches)}<div class="assiette ${classe}" style="width:${diametre}mm;height:${diametre}mm"></div></div>`;
}

// Pochette fermée, vue côté couverture (moitié droite de l'extérieur) ou côté dos (moitié gauche).
function livretFerme(exterieur, cote) {
  const decalage = cote === "couverture" ? -105 : 0;
  return `<div class="livret">${ombre([105, 148], 3)}<div class="epaisseur"></div>
    <div class="carte"><div class="decoupe"><div style="margin-left:${decalage}mm">${exterieur}</div></div></div></div>`;
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

// Marbre clair : des lignes obliques déformées par un bruit fractal donnent des veines fines
// et continues ; un voile nuageux et un grain fin complètent la matière.
function marbre(largeur, hauteur) {
  const hasard = aleatoire(29);
  let veines = "";
  for (let i = 0; i < 16; i += 1) {
    const x = -hauteur + (i + hasard() * 0.8) * ((largeur + hauteur) / 16);
    const epaisseur = (0.3 + hasard() * 1.1).toFixed(2);
    const opacite = (0.1 + hasard() * 0.28).toFixed(2);
    veines += `<path d="M ${x.toFixed(1)} ${-20} L ${(x + hauteur * 0.85).toFixed(1)} ${hauteur + 20}" stroke-width="${epaisseur}" stroke-opacity="${opacite}"/>`;
  }
  return `<svg class="fond" viewBox="0 0 ${largeur} ${hauteur}" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <filter id="marbre-veines" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.0045 0.007" numOctaves="3" seed="23" result="bruit"/>
        <feDisplacementMap in="SourceGraphic" in2="bruit" scale="60" xChannelSelector="R" yChannelSelector="G"/>
        <feGaussianBlur stdDeviation="0.4"/>
      </filter>
      <filter id="marbre-grain" x="0" y="0" width="1" height="1" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="2"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.48  0 0 0 0 0.5  0 0 0 0.55 0"/>
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
    <g filter="url(#marbre-veines)" fill="none" stroke="#8d8a93">${veines}</g>
    <rect width="${largeur}" height="${hauteur}" filter="url(#marbre-grain)" opacity="0.12"/>
  </svg>`;
}

// Ruban de satin qui traverse un coin de la scène, assorti au support : violet, or ou argent
// (doré pour les supports blanc & or).
const TEINTES_RUBAN = {
  violet: ["#43305c", "#7e5ea9", "#8c6fb1", "#674696", "#513972"],
  or: ["#8a6a2c", "#d6b46e", "#ecd59d", "#c39c4a", "#9f7a38"],
  argent: ["#6f7480", "#b9bdc8", "#dfe1e7", "#a3a8b4", "#7d828e"],
};
TEINTES_RUBAN.blanc = TEINTES_RUBAN.or;
function rubanSatin(chemin, largeur, hauteur, teinte = "violet") {
  const id = idUnique("satin");
  const [a, b, c, d, e] = TEINTES_RUBAN[teinte] || TEINTES_RUBAN.violet;
  return `<svg class="accessoires" style="z-index:0" viewBox="0 0 ${largeur} ${hauteur}" aria-hidden="true">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${a}"/><stop offset="0.35" stop-color="${b}"/>
      <stop offset="0.55" stop-color="${c}"/><stop offset="0.75" stop-color="${d}"/><stop offset="1" stop-color="${e}"/>
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
      ? `<path d="M3,104 L3,16 C3,7 7,1.5 12.5,0 L13,0 L13,104 Z"/><rect x="3" y="102" width="10" height="6" rx="1.5"/>`
      : `<path d="M1,0 h2.4 v34 h2.2 v-34 h2.4 v34 h2.2 v-34 h2.4 v34 h2.2 v-34 h2.4 v38 C15,50 11,56 10.6,66 L10.6,94 L5.4,94 L5.4,66 C5,56 1,50 1,38 Z"/>`;
  return `<svg class="couvert sombre" viewBox="0 0 16 220" style="width:16mm;height:220mm" aria-hidden="true">
    <defs>${degrade(id, "orn")}</defs>
    <g fill="url(#${id})">${tete}${manche}</g>
    <path d="M8,${type === "couteau" ? 112 : 98} V${type === "couteau" ? 212 : 194}" stroke="rgba(255,248,225,0.55)" stroke-width="0.8" stroke-linecap="round"/>
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
    poser(carte(interieur, [210, 148], "livret-ouvert", 3), { x: 127, y: 136, rotation: -3, z: 2 }),
    poser(livretFerme(exterieur, "dos"), { x: 304, y: 126, rotation: -4, z: 3 }),
    poser(livretFerme(exterieur, "couverture"), { x: 419, y: 140, rotation: 5, z: 4 }),
    poser(alliances(34), { x: 330, y: 238, rotation: -18, z: 5 }),
    confettis(l, h, 28, 7, [[15, 52, 240, 222], [244, 44, 366, 210], [358, 58, 480, 226], [304, 220, 358, 258]]),
  ].join("");
}

function sceneBillet(theme, l, h, categorie) {
  const [recto, verso] = faces(billet(theme, categorie));
  return [
    rubanSatin(`M ${l + 20} 30 C ${l - 60} 10, ${l - 80} 90, ${l - 30} 150 S ${l - 20} ${h + 20}, ${l - 90} ${h + 30}`, l, h, (INFOS.billets[categorie] || {}).couleur),
    poser(carte(verso, [210, 99]), { x: 242, y: 166, rotation: 3, z: 2 }),
    poser(carte(recto, [210, 99]), { x: 146, y: 58, rotation: -4, z: 3 }),
    confettis(l, h, 24, 11, [[34, 0, 258, 120], [128, 106, 356, 225]]),
  ].join("");
}

function sceneMenu(theme, l, h) {
  const [recto, verso] = faces(carteMenu(theme));
  const cx = 210;
  const cy = h / 2;
  return [
    rubanSatin(`M -20 40 C 30 20, 40 120, 10 ${h - 60} S 40 ${h + 10}, 90 ${h + 30}`, l, h, (INFOS.couleurs || {}).menu),
    poser(assiette(280, "presentation", [[0.4, 0.7, 1, 0.35], [3, 6, 12, 0.25]]), { x: cx, y: cy, z: 1 }),
    poser(assiette(236, "porcelaine", [[0.3, 0.6, 1, 0.25], [2, 4, 7, 0.18]]), { x: cx, y: cy, z: 2 }),
    poser(carte(recto, [99, 210]), { x: cx, y: cy, rotation: -3, z: 3 }),
    poser(couvert("fourchette"), { x: cx - 168, y: cy, rotation: 0, z: 2 }),
    poser(couvert("couteau"), { x: cx + 168, y: cy, rotation: 0, z: 2 }),
    poser(carte(verso, [99, 210]), { x: 452, y: cy - 4, rotation: 6, z: 2 }),
    confettis(l, h, 18, 3, [[30, 0, 400, h], [395, 20, 515, h - 20]]),
  ].join("");
}

function sceneEnsemble(theme, l, h) {
  const [exterieur] = faces(passeport(theme));
  const [billetRecto] = faces(billet(theme));
  const [menuRecto] = faces(carteMenu(theme));
  return [
    rubanSatin(`M -20 ${h - 40} C 80 ${h - 90}, 170 ${h + 5}, 300 ${h + 25}`, l, h, INFOS.billets.premium.couleur),
    poser(carte(billetRecto, [210, 99]), { x: 250, y: 92, rotation: 9, z: 2 }),
    poser(livretFerme(exterieur, "couverture"), { x: 128, y: 150, rotation: -8, z: 3 }),
    poser(carte(menuRecto, [99, 210]), { x: 425, y: 150, rotation: 4, z: 2 }),
    poser(alliances(32), { x: 272, y: 222, rotation: 14, z: 4 }),
    confettis(l, h, 26, 19, [[55, 60, 205, 245], [135, 25, 365, 160], [355, 25, 495, 275], [248, 200, 298, 246]]),
  ].join("");
}

/* Chevalet de table posé, en 3D (transformations CSS) : deux pans de 210 × 148,5 mm articulés
   sur le pli, ouverts de 2 × 18°, vus d'un peu au-dessus (plongée de 7°) et tournés de `lacet`
   degrés. La base est en (cx, yBase), au milieu du chevalet. */
const OUVERTURE_CHEVALET = 18;
function poserChevalet(numero, { cx, yBase, echelle = 1, z = 5, lacet = 0 }) {
  const [l, h] = FACE_CHEVALET;
  const a = (OUVERTURE_CHEVALET * Math.PI) / 180;
  const hauteur = h * Math.cos(a); // du pli à la table
  const pied = h * Math.sin(a); // du plan du pli au pied de chaque pan
  const face = `<div class="page face-posee${couleursTable()}">${faceTable(numero, INFOS.tables[numero - 1])}</div>`;
  // Ombre au sol, dans le plan de la table (elle suit la rotation) : douce sous le chevalet,
  // plus dense le long des deux pieds.
  const marge = 14;
  const sol = `<div class="sol" style="top:${hauteur}mm;left:${-marge}mm;width:${l + 2 * marge}mm;height:${2 * (pied + marge)}mm;transform:rotateX(90deg) translateY(${-(pied + marge)}mm)">
      <div class="pied" style="top:${marge - 5}mm"></div><div class="pied" style="top:${marge + 2 * pied - 5}mm"></div></div>`;
  return `
    <div class="objet chevalet-3d" style="left:${cx - l / 2}mm;top:${yBase - hauteur}mm;width:${l}mm;height:${hauteur}mm;z-index:${z};transform:scale(${echelle});transform-origin:50% 100%">
      <div class="corps" style="transform:translateZ(${-pied}mm) rotateX(${(-PLONGEE * 180) / Math.PI}deg) rotateY(${lacet}deg)">
        ${sol}
        <div class="pan arriere" style="transform:rotateX(${-OUVERTURE_CHEVALET}deg)"></div>
        <div class="pan avant" style="transform:rotateX(${OUVERTURE_CHEVALET}deg)">${face}</div>
      </div>
    </div>`;
}

// Les trois premières tables, en chevalet sur la table en marbre.
function sceneTables(theme, l, h) {
  const horizon = MAQUETTES.tables.horizon;
  return [
    confettisTable(l, h, horizon, 24, 29, [[40, 0, 480, h - 20]]),
    poserChevalet(1, { cx: 122, yBase: 214, echelle: 0.86, z: 4, lacet: 28 }),
    poserChevalet(3, { cx: 398, yBase: 218, echelle: 0.88, z: 5, lacet: -26 }),
    poserChevalet(2, { cx: 260, yBase: 246, z: 6, lacet: 6 }),
    `<div class="objet" style="left:446mm;top:252mm;z-index:7">${alliances(30)}<div class="ombre-anneaux"></div></div>`,
  ].join("");
}

/* ------------------------------ Rendu ------------------------------ */

function maquette(nom, theme) {
  const m = MAQUETTES[nom] || MAQUETTES.ensemble;
  const l = m.largeur;
  const h = (l * 9) / 16;
  return `<div class="scene${m.horizon ? " de-face" : ""}" style="width:${l}mm;height:${h}mm;--grain:url('${grainDonnees()}')">
    ${m.horizon ? decorFace(l, h, m.horizon) : marbre(l, h)}
    ${m.construire(theme, l, h)}
    <div class="lumiere"></div>
  </div>`;
}

/* --------------------------- Bouteilles (vue de face) --------------------------- */
/* Les étiquettes de bouteilles sont montrées sur des bouteilles debout, vues de face et
   légèrement de haut (PLONGEE). L'étiquette est enroulée sur le cylindre : découpée en bandes
   verticales, chacune posée à sa place projetée (x = R sin φ), comprimée (cos φ), inclinée pour
   suivre la courbure de ses bords, et ombrée selon la lumière (en haut à gauche). */

const PLONGEE = (7 * Math.PI) / 180;
const LUMIERE = (() => {
  const [x, z] = [-0.55, 0.83];
  const n = Math.hypot(x, z);
  return [x / n, z / n];
})();
const ANGLE_REFLET = Math.atan2(LUMIERE[0], LUMIERE[1]) / 2; // entre la lumière et le regard

// Ombre (0 à ~0,6) et reflet (0 à 1) d'un point du cylindre vu sous l'angle φ.
function eclairage(phi) {
  const diffus = Math.max(0, Math.sin(phi) * LUMIERE[0] + Math.cos(phi) * LUMIERE[1]);
  const face = LUMIERE[1];
  const sombre = Math.min(0.62, Math.max(0, 0.66 * (1 - (0.28 + 0.72 * diffus) / (0.28 + 0.72 * face))));
  const reflet = Math.exp(-(((phi - ANGLE_REFLET) / 0.15) ** 2));
  return { sombre, reflet };
}

const modulo = (a, n) => ((a % n) + n) % n;

/* `html` : la face de l'étiquette (L × H mm), enroulée sur un cylindre de rayon R ; `centre` :
   abscisse de l'étiquette (mm) qui fait face au regard. Une étiquette plus longue que le tour
   de la bouteille se recouvre : son bord droit passe par-dessus son bord gauche. */
function etiquetteEnroulee(html, [L, H], R, centre, { pas = 2.5, brillance = 0.2 } = {}) {
  const tour = 2 * Math.PI * R;
  const recouvrement = L - tour;
  const dz = R * Math.sin(PLONGEE);
  const surEtiquette = (u) => (recouvrement > 0 ? recouvrement + modulo(u - recouvrement, tour) : u);
  const [umin, umax] = [centre - (Math.PI / 2) * R, centre + (Math.PI / 2) * R];
  const bornes = [];
  const n = Math.ceil((umax - umin) / pas);
  for (let i = 0; i <= n; i += 1) bornes.push(umin + ((umax - umin) * i) / n);
  const coupures = recouvrement > 0
    ? Array.from({ length: 5 }, (_, k) => recouvrement + (k - 2) * tour)
    : [0, L];
  bornes.push(...coupures.filter((u) => u > umin && u < umax));
  bornes.sort((a, b) => a - b);

  // Arrêts placés en mm sur la largeur réelle de la bande (et non sur sa largeur prolongée) :
  // deux bandes voisines ont ainsi exactement le même ombrage à leur jonction.
  const teinte = (couleur, valeurs, w) => valeurs.map(([t, a]) => `rgba(${couleur}, ${a.toFixed(3)}) ${(t * w).toFixed(3)}mm`).join(", ");
  let bandes = "";
  for (let i = 0; i + 1 < bornes.length; i += 1) {
    const [ua, ub] = [bornes[i], bornes[i + 1]];
    if (ub - ua < 1e-3) continue;
    const um = (ua + ub) / 2;
    const sm = surEtiquette(um);
    if (recouvrement <= 0 && (sm < 0 || sm > L)) continue;
    const [sa, sb] = [sm - (um - ua), sm + (ub - um)];
    const [pa, pb] = [(ua - centre) / R, (ub - centre) / R];
    const [xa, xb] = [R * Math.sin(pa), R * Math.sin(pb)];
    const w = xb - xa;
    if (w < 0.01) continue;
    const [ya, yb] = [dz * Math.cos(pa), dz * Math.cos(pb)];
    const k = w / (sb - sa);
    const pente = Math.atan2(yb - ya, w);
    const points = [0, 0.25, 0.5, 0.75, 1].map((t) => [t, eclairage(Math.asin(Math.max(-1, Math.min(1, (xa + t * w) / R))))]);
    const ombrage = `linear-gradient(90deg, ${teinte("255, 252, 245", points.map(([t, e]) => [t, e.reflet * brillance]), w)}),
      linear-gradient(90deg, ${teinte("12, 6, 22", points.map(([t, e]) => [t, e.sombre]), w)})`;
    // Chaque bande déborde de 0,4 mm sous la suivante (plus d'un pixel, même en aperçu) : sinon
    // l'anticrénelage de leurs bords laisse voir le verre entre deux bandes.
    bandes += `<div class="bande" style="left:${(R + xa).toFixed(3)}mm;top:${ya.toFixed(3)}mm;width:${(w + 0.4).toFixed(3)}mm;height:${H}mm;transform:skewY(${pente.toFixed(5)}rad)">
      <div class="contenu" style="width:${L}mm;height:${H}mm;transform:scaleX(${k.toFixed(5)}) translateX(${(-sa).toFixed(3)}mm)">${html}</div>
      <div class="ombrage" style="background:${ombrage}"></div></div>`;
  }
  return `<div class="etiquette-enroulee" style="width:${2 * R}mm;height:${(H + dz).toFixed(3)}mm">${bandes}</div>`;
}

// Dégradé horizontal d'un cylindre de rayon R (centré en cx) : couleur de base assombrie
// selon la lumière, avec le reflet ; `opacite` pour le verre transparent.
function degradeCylindre(id, cx, R, [r, g, b], { opacite = 1, reflet = 0.35, bord = 0 } = {}) {
  let arrets = "";
  for (let deg = -90; deg <= 90; deg += 6) {
    const phi = (deg * Math.PI) / 180;
    const { sombre, reflet: brillant } = eclairage(phi);
    const melange = (c) => Math.round(Math.min(255, c * (1 - sombre) + 255 * brillant * reflet));
    const alpha = Math.min(1, opacite + bord * (1 - Math.cos(phi)) ** 2);
    arrets += `<stop offset="${((Math.sin(phi) + 1) / 2).toFixed(4)}" stop-color="rgb(${melange(r)},${melange(g)},${melange(b)})" stop-opacity="${alpha.toFixed(3)}"/>`;
  }
  return `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${cx - R}" x2="${cx + R}" y1="0" y2="0">${arrets}</linearGradient>`;
}

// Reflet vertical du verre (bande claire estompée aux extrémités).
function refletVerre(id, x, y1, y2, largeur, opacite) {
  return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.12" stop-color="#fff" stop-opacity="${opacite}"/>
      <stop offset="0.88" stop-color="#fff" stop-opacity="${opacite}"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <rect x="${x}" y="${y1}" width="${largeur}" height="${y2 - y1}" rx="${largeur / 2}" fill="url(#${id})"/>`;
}

/* Bouteille de vin type bordelaise, 75 cl : corps de 75 mm de diamètre, 300 mm de haut, capsule
   or champagne à liseré bronze. Étiquette avant de 90 × 120 mm, de 40 à 160 mm au-dessus de la base. */
function bouteilleVin(etiquette, centre) {
  const [R, H] = [37.5, 300];
  const dz = R * Math.sin(PLONGEE);
  const Y = (hauteur) => H - hauteur;
  const cx = R;
  const [corps, col, capsule, lisere, reflet1, reflet2, reflet3] = ["verre", "col", "capsule", "lisere", "reflet", "reflet", "reflet"].map(idUnique);
  const profil = (cote) => {
    const x = (d) => (cx + cote * d).toFixed(2);
    return [`${x(R)},${Y(205)}`, `C${x(R)},${Y(226)} ${x(15.6)},${Y(228)} ${x(14.6)},${Y(246)}`];
  };
  const [gauche, droite] = [profil(-1), profil(1)];
  const silhouette = `M${cx - R},${Y(0)} L${gauche[0]} ${gauche[1]} L${cx - 14.6},${Y(250)} L${cx + 14.6},${Y(250)} L${cx + 14.6},${Y(246)}
    C${cx + 15.6},${Y(228)} ${cx + R},${Y(226)} ${cx + R},${Y(205)} L${cx + R},${Y(0)} A${R},${dz} 0 0 1 ${cx - R},${Y(0)} Z`;
  const rc = 15.4;
  return `<div class="flacon vin" style="width:${2 * R}mm;height:${H + dz}mm">
    <svg viewBox="0 0 ${2 * R} ${H + dz}" aria-hidden="true">
      <defs>
        ${degradeCylindre(corps, cx, R, [26, 40, 30], { reflet: 0.55 })}
        ${degradeCylindre(col, cx, 14.6, [26, 40, 30], { reflet: 0.55 })}
        ${degradeCylindre(capsule, cx, rc, [205, 170, 100], { reflet: 0.55 })}
        ${degradeCylindre(lisere, cx, rc + 0.2, [110, 84, 40], { reflet: 0.4 })}
      </defs>
      <path d="${silhouette}" fill="url(#${corps})"/>
      <rect x="${cx - 14.6}" y="${Y(252)}" width="29.2" height="8" fill="url(#${col})"/>
      ${refletVerre(reflet1, cx - 0.62 * R - 1.3, Y(200), Y(8), 2.6, 0.32)}
      ${refletVerre(reflet2, cx + 0.84 * R - 0.6, Y(196), Y(10), 1.2, 0.12)}
      <path d="M${cx - rc},${Y(248)} L${cx - rc},${Y(296)} Q${cx - rc},${Y(300)} ${cx - rc + 3},${Y(300)} L${cx + rc - 3},${Y(300)} Q${cx + rc},${Y(300)} ${cx + rc},${Y(296)} L${cx + rc},${Y(248)} A${rc},${(rc * Math.sin(PLONGEE)).toFixed(2)} 0 0 1 ${cx - rc},${Y(248)} Z" fill="url(#${capsule})"/>
      <rect x="${cx - rc - 0.2}" y="${Y(258)}" width="${2 * rc + 0.4}" height="2.4" fill="url(#${lisere})"/>
      <rect x="${cx - rc - 0.2}" y="${Y(253)}" width="${2 * rc + 0.4}" height="0.8" fill="url(#${lisere})"/>
      <ellipse cx="${cx}" cy="${Y(300) + 0.4}" rx="${rc - 3}" ry="${((rc - 3) * Math.sin(PLONGEE)).toFixed(2)}" fill="rgba(255,245,255,0.18)"/>
      ${refletVerre(reflet3, cx - 0.62 * rc - 0.9, Y(296), Y(250), 1.8, 0.3)}
    </svg>
    <div class="habillage" style="top:${Y(160)}mm">${etiquetteEnroulee(etiquette, FORMATS_ETIQUETTES.vin, R, centre, { brillance: 0.28 })}</div>
  </div>`;
}

/* Bouteille d'eau de 33 cl en plastique transparent : 60 mm de diamètre, 190 mm de haut,
   bouchon blanc. Étiquette de 200 × 50 mm qui en fait le tour, de 30 à 80 mm au-dessus de la base. */
function bouteilleEau(etiquette, centre) {
  const [R, H] = [30, 190];
  const dz = R * Math.sin(PLONGEE);
  const Y = (hauteur) => H - hauteur;
  const cx = R;
  const [corps, eau, bouchon, bague, reflet1, reflet2, reflet3] = ["pet", "eau", "bouchon", "bague", "reflet", "reflet", "reflet"].map(idUnique);
  const silhouette = `M${cx - R},${Y(6)} L${cx - R},${Y(118)} C${cx - R},${Y(138)} ${cx - 14.5},${Y(142)} ${cx - 13.5},${Y(156)} L${cx - 13.5},${Y(166)}
    L${cx + 13.5},${Y(166)} L${cx + 13.5},${Y(156)} C${cx + 14.5},${Y(142)} ${cx + R},${Y(138)} ${cx + R},${Y(118)} L${cx + R},${Y(6)}
    Q${cx + R},${Y(0)} ${cx + R - 6},${Y(0)} A${R - 6},${((R - 6) * Math.sin(PLONGEE)).toFixed(2)} 0 0 1 ${cx - R + 6},${Y(0)} Q${cx - R},${Y(0)} ${cx - R},${Y(6)} Z`;
  const niveau = 148;
  let stries = "";
  for (let deg = -78; deg <= 78; deg += 9) stries += `<line x1="${(cx + 15 * Math.sin((deg * Math.PI) / 180)).toFixed(2)}" y1="${Y(186)}" x2="${(cx + 15 * Math.sin((deg * Math.PI) / 180)).toFixed(2)}" y2="${Y(167.5)}"/>`;
  return `<div class="flacon eau" style="width:${2 * R}mm;height:${H + dz}mm">
    <svg viewBox="0 0 ${2 * R} ${H + dz}" aria-hidden="true">
      <defs>
        ${degradeCylindre(corps, cx, R, [96, 112, 128], { opacite: 0.015, reflet: 0, bord: 0.75 })}
        ${degradeCylindre(eau, cx, R, [150, 170, 175], { opacite: 0.012, reflet: 0, bord: 0.3 })}
        ${degradeCylindre(bouchon, cx, 15, [246, 246, 248], { reflet: 0.4 })}
        ${degradeCylindre(bague, cx, 16.8, [236, 240, 244], { opacite: 0.75, reflet: 0.6 })}
        <clipPath id="${eau}-niveau"><rect x="0" y="${Y(niveau)}" width="${2 * R}" height="${niveau + dz}"/></clipPath>
      </defs>
      <path d="${silhouette}" fill="url(#${corps})" stroke="rgba(120,140,160,0.45)" stroke-width="0.35"/>
      <path d="${silhouette}" fill="url(#${eau})" clip-path="url(#${eau}-niveau)"/>
      <ellipse cx="${cx}" cy="${Y(niveau)}" rx="14.6" ry="${(14.6 * Math.sin(PLONGEE)).toFixed(2)}" fill="rgba(255,255,255,0.22)" stroke="rgba(255,255,255,0.55)" stroke-width="0.3"/>
      <path d="M${cx - R + 0.4},${Y(100)} A${R - 0.4},${(R * Math.sin(PLONGEE)).toFixed(2)} 0 0 0 ${cx + R - 0.4},${Y(100)} M${cx - R + 0.4},${Y(106)} A${R - 0.4},${(R * Math.sin(PLONGEE)).toFixed(2)} 0 0 0 ${cx + R - 0.4},${Y(106)}" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="0.5"/>
      ${refletVerre(reflet1, cx - 0.62 * R - 1.1, Y(114), Y(8), 2.2, 0.6)}
      ${refletVerre(reflet2, cx + 0.8 * R - 0.5, Y(112), Y(10), 1, 0.35)}
      <rect x="${cx - 16.8}" y="${Y(165)}" width="33.6" height="2.4" rx="0.8" fill="url(#${bague})"/>
      <path d="M${cx - 15},${Y(167)} L${cx - 15},${Y(186)} Q${cx - 15},${Y(188.5)} ${cx - 12.5},${Y(188.5)} L${cx + 12.5},${Y(188.5)} Q${cx + 15},${Y(188.5)} ${cx + 15},${Y(186)} L${cx + 15},${Y(167)} A15,${(15 * Math.sin(PLONGEE)).toFixed(2)} 0 0 1 ${cx - 15},${Y(167)} Z" fill="url(#${bouchon})"/>
      <g stroke="rgba(60,60,80,0.16)" stroke-width="0.35">${stries}</g>
      <ellipse cx="${cx}" cy="${Y(188.5) + 0.3}" rx="12.5" ry="${(12.5 * Math.sin(PLONGEE)).toFixed(2)}" fill="rgba(255,255,255,0.6)"/>
      ${refletVerre(reflet3, cx - 0.62 * 13.5 - 0.6, Y(162), Y(124), 1.2, 0.5)}
    </svg>
    <div class="habillage" style="top:${Y(80)}mm">${etiquetteEnroulee(etiquette, FORMATS_ETIQUETTES.eau, R, centre, { brillance: 0.3 })}</div>
  </div>`;
}

/* Une bouteille posée sur la table : base (côtés) en (cx, yBase), ombre de contact et ombre
   portée vers la droite (lumière en haut à gauche) ; `echelle` < 1 pour un plan plus éloigné. */
function poserBouteille(flacon, { cx, yBase, R, H, echelle = 1, z = 5 }) {
  const dz = R * Math.sin(PLONGEE);
  const w = 2 * R * echelle;
  return `
    <div class="ombre-bouteille contact" style="left:${cx - 1.22 * R * echelle}mm;top:${yBase - (dz + 2.2) * echelle}mm;width:${2.44 * R * echelle}mm;height:${2 * (dz + 2.2) * echelle}mm;z-index:${z - 1}"></div>
    <div class="ombre-bouteille portee" style="left:${cx - 0.5 * R * echelle}mm;top:${yBase - (dz + 7) * echelle}mm;width:${4.4 * R * echelle}mm;height:${2 * (dz + 7) * echelle}mm;z-index:${z - 1}"></div>
    <div class="objet bouteille-posee" style="left:${cx - w / 2}mm;top:${yBase - H * echelle}mm;width:${w}mm;z-index:${z};transform:scale(${echelle});transform-origin:0 0">${flacon}</div>`;
}

/* Décor des scènes de face : mur clair, lumières dorées floues, table en marbre. */
function decorFace(l, h, horizon) {
  const hasard = aleatoire(41);
  let halos = "";
  for (let i = 0; i < 16; i += 1) {
    const r = 8 + hasard() * 20;
    const x = hasard() * l;
    const y = hasard() * horizon * 0.85;
    const a = (0.12 + hasard() * 0.2).toFixed(3);
    halos += `<div class="halo" style="left:${(x - r).toFixed(1)}mm;top:${(y - r).toFixed(1)}mm;width:${2 * r}mm;height:${2 * r}mm;background:radial-gradient(circle closest-side, rgba(236,213,157,${a}) 0%, rgba(236,213,157,${a}) 55%, rgba(236,213,157,0) 100%)"></div>`;
  }
  return `<div class="mur"></div>${halos}
    <div class="table-marbre" style="top:${horizon}mm">${marbre(l, h - horizon)}<div class="profondeur"></div></div>
    <div class="pied-mur" style="top:${horizon - 14}mm"></div>`;
}

// Confettis dorés posés sur la table, aplatis par la perspective.
function confettisTable(l, h, horizon, nombre, graine, zonesLibres) {
  const hasard = aleatoire(graine);
  const id = idUnique("confetti");
  let points = "";
  for (let n = 0, essais = 0; n < nombre && essais < nombre * 40; essais += 1) {
    const x = 6 + hasard() * (l - 12);
    const y = horizon + 6 + hasard() * (h - horizon - 12);
    if (zonesLibres.some(([x0, y0, x1, y1]) => x > x0 && x < x1 && y > y0 && y < y1)) continue;
    const profondeur = 0.55 + 0.45 * ((y - horizon) / (h - horizon));
    const r = (1.2 + hasard() * 1.5) * profondeur;
    points += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${r.toFixed(2)}" ry="${(r * 0.38).toFixed(2)}" fill="url(#${id})"/>`;
    n += 1;
  }
  return `<svg class="accessoires sombre" style="z-index:2" viewBox="0 0 ${l} ${h}" aria-hidden="true">
    <defs>${degrade(id, "orn")}</defs>
    <g style="filter: drop-shadow(0.4mm 0.25mm 0.3mm rgba(40, 28, 10, 0.35))">${points}</g>
  </svg>`;
}

function sceneVin(theme, l, h) {
  const [face] = faces(etiquetteVin());
  const vin = { R: 37.5, H: 300 };
  return [
    confettisTable(l, h, MAQUETTES.vin.horizon, 26, 13, [[180, 0, 470, h - 22], [490, 300, 560, h]]),
    poserBouteille(bouteilleVin(face, 70), { ...vin, cx: 412, yBase: 300, echelle: 0.93, z: 4 }),
    poserBouteille(bouteilleVin(face, 45), { ...vin, cx: 262, yBase: 322, z: 6 }),
    `<div class="objet" style="left:497mm;top:309mm;z-index:7">${alliances(40)}<div class="ombre-anneaux"></div></div>`,
  ].join("");
}

function sceneEau(theme, l, h) {
  const [face] = faces(etiquetteEau());
  const eau = { R: 30, H: 190 };
  return [
    confettisTable(l, h, MAQUETTES.eau.horizon, 22, 17, [[95, 0, 395, h - 14]]),
    poserBouteille(bouteilleEau(face, 72), { ...eau, cx: 242, yBase: 226, echelle: 0.93, z: 4 }),
    poserBouteille(bouteilleEau(face, 172), { ...eau, cx: 160, yBase: 244, z: 6 }),
    poserBouteille(bouteilleEau(face, 100), { ...eau, cx: 326, yBase: 246, z: 6 }),
  ].join("");
}
