/* Choix du thème de couleurs et éléments graphiques partagés, dessinés en SVG :
   monogramme R & F, motifs guillochés (façon passeport), code-barres, ornements, icônes.
   Les couleurs viennent des variables CSS du thème (commun.css). */

// Thème : paramètre d'adresse « ?theme=minuit », sinon celui choisi dans infos.js.
const THEME_ID = [new URLSearchParams(location.search).get("theme"), INFOS.theme].find((id) => id in THEMES) || "violet";
const THEME = THEMES[THEME_ID];
document.documentElement.dataset.theme = THEME_ID;

let compteurIds = 0;
function idUnique(prefixe) {
  compteurIds += 1;
  return `${prefixe}-${compteurIds}`;
}

function esc(texte) {
  return String(texte)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function initiale(prenom) {
  return prenom.trim().charAt(0).toUpperCase();
}

// Dégradé métallisé à partir des variables --let-* (lettres) ou --orn-* (ornements).
function degrade(id, jeu) {
  const arret = (position, teinte) => `<stop offset="${position}" style="stop-color: var(--${jeu}-${teinte})"/>`;
  return `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
    ${arret(0, "a")}${arret(0.3, "b")}${arret(0.52, "c")}${arret(0.72, "b")}${arret(1, "a")}
  </linearGradient>`;
}

/* ------------------------------ Icônes ------------------------------ */

const ICONES = {
  // Tracés des icônes Material Design (licence Apache 2.0), grille 24 × 24.
  avion: "M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z",
  coeur: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
  lieu: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
  horloge: "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z",
};

function icone(nom, { taille = "1em", rotation = 0, classe = "" } = {}) {
  const transformation = rotation ? ` transform="rotate(${rotation} 12 12)"` : "";
  return `<svg class="icone ${classe}" viewBox="0 0 24 24" width="${taille}" height="${taille}" aria-hidden="true"><path d="${ICONES[nom]}"${transformation}/></svg>`;
}

function anneaux({ taille = "1em" } = {}) {
  return `<svg class="icone" viewBox="0 0 24 16" width="${taille}" height="${taille}" aria-hidden="true" style="fill: none" stroke="currentColor" stroke-width="2.2">
    <circle cx="8.5" cy="8" r="6"/><circle cx="15.5" cy="8" r="6"/></svg>`;
}

/* ---------------------- Robustesse à l'impression ---------------------- */
// Les planches A4 impriment les supports à 88,5 % (impression.html). Sur une imprimante de
// bureau, un trait clair plus fin qu'environ 0,2 mm imprimé se referme sous l'encre du fond
// violet, et un trait très pâle (obtenu par transparence) se casse en pointillés : les tracés
// fins ont donc une épaisseur minimale, mesurée sur l'imprimé.
const ECHELLE_IMPRESSION = 0.885;
// Épaisseur en unités d'un dessin de `mmParUnite` mm par unité, au moins `minimum` mm imprimés.
const epaisseurImprimable = (unites, mmParUnite, minimum) => Math.max(unites, minimum / ECHELLE_IMPRESSION / mmParUnite);

/* ---------------------------- Monogramme ---------------------------- */

function point(cx, cy, r, angleDeg) {
  const a = (angleDeg * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

function arc(cx, cy, r, debut, fin) {
  const [x0, y0] = point(cx, cy, r, debut);
  const [x1, y1] = point(cx, cy, r, fin);
  const grand = Math.abs(fin - debut) > 180 ? 1 : 0;
  const sens = fin > debut ? 1 : 0;
  return `M${x0.toFixed(2)},${y0.toFixed(2)} A${r},${r} 0 ${grand} ${sens} ${x1.toFixed(2)},${y1.toFixed(2)}`;
}

// Branche de laurier le long d'un arc de cercle, de l'angle `debut` vers l'angle `fin`.
function laurier(cx, cy, r, debut, fin, nbFeuilles, remplissage, epaisseur = 1.1) {
  const direction = Math.sign(fin - debut);
  const feuille = (x, y, angle, longueur) => {
    const l = longueur;
    const w = l * 0.32;
    return `<path d="M0,0 Q${(l * 0.45).toFixed(2)},${(-w).toFixed(2)} ${l.toFixed(2)},0 Q${(l * 0.45).toFixed(2)},${w.toFixed(2)} 0,0Z" transform="translate(${x.toFixed(2)},${y.toFixed(2)}) rotate(${angle.toFixed(2)})"/>`;
  };
  let feuilles = "";
  for (let i = 0; i < nbFeuilles; i += 1) {
    const t = (i + 0.5) / nbFeuilles;
    const angle = debut + (fin - debut) * t;
    const [x, y] = point(cx, cy, r, angle);
    const a = (angle * Math.PI) / 180;
    const tangente = (Math.atan2(direction * Math.cos(a), -direction * Math.sin(a)) * 180) / Math.PI;
    const longueur = 15 * (1 - 0.35 * t);
    feuilles += feuille(x, y, tangente - 38, longueur);
    feuilles += feuille(x, y, tangente + 38, longueur * 0.92);
  }
  const [xf, yf] = point(cx, cy, r, fin);
  const af = (fin * Math.PI) / 180;
  const tangenteFin = (Math.atan2(direction * Math.cos(af), -direction * Math.sin(af)) * 180) / Math.PI;
  feuilles += feuille(xf, yf, tangenteFin, 9);
  return `<g fill="${remplissage}">
    <path d="${arc(cx, cy, r, debut, fin)}" fill="none" stroke="${remplissage}" stroke-width="${epaisseur.toFixed(2)}" stroke-linecap="round"/>
    ${feuilles}
  </g>`;
}

function couronne(x, y, echelle, remplissage) {
  return `<g transform="translate(${x},${y}) scale(${echelle})" fill="${remplissage}">
    <path d="M-10,3 L-11.5,-5.5 L-5,0 L0,-8.5 L5,0 L11.5,-5.5 L10,3 Z"/>
    <rect x="-10" y="4" width="20" height="2.6" rx="0.6"/>
    <circle cx="-11.5" cy="-7.2" r="1.5"/><circle cx="0" cy="-10.4" r="1.7"/><circle cx="11.5" cy="-7.2" r="1.5"/>
  </g>`;
}

/* Monogramme : initiale de la mariée, esperluette, initiale du marié,
   dans un médaillon couronné bordé de lauriers. Avec `halo`, une rosace
   guillochée est dessinée autour du médaillon. `taille` : largeur affichée en mm
   (voir les CSS), pour garder des traits imprimables même sur les petits monogrammes. */
function monogramme({ classe = "", halo = false, taille = 40 } = {}) {
  const mmParUnite = taille / 200;
  const trait = (unites, minimum) => epaisseurImprimable(unites, mmParUnite, minimum).toFixed(2);
  const idOrnements = idUnique("orn");
  const idLettres = idUnique("let");
  const remplissage = `url(#${idOrnements})`;
  const lettres = `url(#${idLettres})`;
  const f = initiale(INFOS.mariee);
  const m = initiale(INFOS.marie);
  const rosaceHalo = halo
    ? `<g style="opacity: calc(var(--guilloche-opacite) * 1.1)">${rosace({ cx: 100, cy: 100, rayon: 112, amplitude: 7, lobes: 26, nbCourbes: 6, couleur: "var(--guilloche)", epaisseur: +trait(0.6, 0.22) })}</g>`
    : "";
  return `<svg class="monogramme ${classe}" viewBox="0 0 200 200" style="overflow: visible" role="img" aria-label="${esc(f)} &amp; ${esc(m)}">
    <defs>${degrade(idOrnements, "orn")}${degrade(idLettres, "let")}</defs>
    ${rosaceHalo}
    <g fill="none" stroke="${remplissage}">
      <path d="${arc(100, 100, 92, -81, 84)}" stroke-width="${trait(1.6, 0.26)}"/>
      <path d="${arc(100, 100, 92, 96, 261)}" stroke-width="${trait(1.6, 0.26)}"/>
      <path d="${arc(100, 100, 87, -78, 83)}" stroke-width="${trait(0.6, 0.18)}"/>
      <path d="${arc(100, 100, 87, 97, 258)}" stroke-width="${trait(0.6, 0.18)}"/>
    </g>
    ${couronne(100, 9.5, 0.95, remplissage)}
    <path d="${ICONES.coeur}" transform="translate(93.4,184.6) scale(0.55)" fill="${remplissage}"/>
    ${laurier(100, 100, 74, 104, 236, 8, remplissage, +trait(1.1, 0.2))}
    ${laurier(100, 100, 74, 76, -56, 8, remplissage, +trait(1.1, 0.2))}
    <text x="72" y="120" text-anchor="middle" font-family="Great Vibes" font-size="64" fill="${lettres}">${esc(f)}</text>
    <text x="126" y="128" text-anchor="middle" font-family="Great Vibes" font-size="64" fill="${lettres}">${esc(m)}</text>
    <text x="100" y="101" text-anchor="middle" font-family="Cormorant Garamond" font-style="italic" font-weight="500" font-size="26" style="fill: var(--esperluette)">&amp;</text>
  </svg>`;
}

/* ------------------------- Motifs guillochés ------------------------- */

// Les guillochis sont pâles (opacité --guilloche-opacite) : au moins 0,3 mm de trait, et
// moins de lignes, pour qu'une imprimante de bureau les rende en traits continus.

// Faisceau de sinusoïdes déphasées (bande guillochée horizontale).
function bandeGuillochee({ largeur, y, amplitude, periode, nbLignes = 8, couleur, epaisseur = 0.3 }) {
  let traces = "";
  for (let i = 0; i < nbLignes; i += 1) {
    const phase = (i * 2 * Math.PI) / nbLignes;
    let d = "";
    for (let x = -2; x <= largeur + 2; x += 0.8) {
      const yy =
        y +
        amplitude * Math.sin((2 * Math.PI * x) / periode + phase) +
        amplitude * 0.45 * Math.sin((2 * Math.PI * x) / (periode * 2.6) - phase);
      d += `${x === -2 ? "M" : "L"}${x.toFixed(1)},${yy.toFixed(2)}`;
    }
    traces += `<path d="${d}"/>`;
  }
  return `<g fill="none" style="stroke: ${couleur}" stroke-width="${epaisseur}">${traces}</g>`;
}

// Rosace guillochée : courbes polaires r(θ) = R + a·sin(nθ + φ) déphasées.
function rosace({ cx, cy, rayon, amplitude, lobes, nbCourbes = 8, couleur, epaisseur = 0.3 }) {
  let traces = "";
  for (let i = 0; i < nbCourbes; i += 1) {
    const phase = (i * 2 * Math.PI) / nbCourbes;
    let d = "";
    for (let k = 0; k <= 720; k += 1) {
      const t = (k / 720) * 2 * Math.PI;
      const r = rayon + amplitude * Math.sin(lobes * t + phase);
      const x = cx + r * Math.cos(t);
      const y = cy + r * Math.sin(t);
      d += `${k === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    }
    traces += `<path d="${d}Z"/>`;
  }
  return `<g fill="none" style="stroke: ${couleur}" stroke-width="${epaisseur}">${traces}</g>`;
}

/* ---------------------------- Code-barres ---------------------------- */

// Code-barres décoratif, toujours identique pour un même texte.
function codeBarres(texte, { largeur = 100, hauteur = 20, couleur = "currentColor" } = {}) {
  let graine = 0;
  for (const c of texte) graine = (graine * 31 + c.charCodeAt(0)) >>> 0;
  const aleatoire = () => {
    graine = (graine + 0x6d2b79f5) >>> 0;
    let t = graine;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const modules = [1, 1, 1, 1];
  while (modules.reduce((s, m) => s + m, 0) < 150) modules.push(1 + Math.floor(aleatoire() * 3));
  modules.push(1, 1, 1, 1);
  const total = modules.reduce((s, m) => s + m, 0);
  const unite = largeur / total;
  let x = 0;
  let barres = "";
  modules.forEach((m, i) => {
    if (i % 2 === 0) barres += `<rect x="${(x * unite).toFixed(3)}" y="0" width="${(m * unite).toFixed(3)}" height="${hauteur}"/>`;
    x += m;
  });
  return `<svg class="code-barres" viewBox="0 0 ${largeur} ${hauteur}" preserveAspectRatio="none" fill="${couleur}" aria-hidden="true">${barres}</svg>`;
}

/* -------------------- Textes en dégradé pour les PDF -------------------- */

/* Dans un PDF, Chromium rend le dégradé des textes (.texte-degrade, background-clip: text)
   avec des masques de transparence dont les bords laissent de fines coutures visibles.
   Pour les PDF, chaque ligne de ces textes est redessinée en texte SVG rempli d'un dégradé
   vectoriel identique, et le texte d'origine est masqué (sa place dans la mise en page
   est conservée). À appeler une fois les polices chargées et la page mise en page ;
   un élément déjà traité est ignoré. */
function vectoriserDegrades(racine = document) {
  const NS = "http://www.w3.org/2000/svg";
  const contexte = document.createElement("canvas").getContext("2d");
  const plage = document.createRange();

  for (const element of racine.querySelectorAll(".texte-degrade:not([data-vectorise])")) {
    element.dataset.vectorise = "";
    const boite = element.getBoundingClientRect();
    const lignes = [];

    // Position de chaque caractère, regroupés par ligne puis en segments contigus de même style.
    const marcheur = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    for (let noeud = marcheur.nextNode(); noeud; noeud = marcheur.nextNode()) {
      const parent = noeud.parentElement;
      for (let i = 0; i < noeud.data.length; i += 1) {
        plage.setStart(noeud, i);
        plage.setEnd(noeud, i + 1);
        const r = plage.getClientRects()[0];
        if (!r || r.width < 0.1) continue; // espace repliée en fin de ligne
        let ligne = lignes.find((l) => Math.abs(l.haut - r.top) < r.height / 2);
        if (!ligne) lignes.push((ligne = { haut: r.top, segments: [] }));
        const dernier = ligne.segments[ligne.segments.length - 1];
        if (dernier && dernier.parent === parent && Math.abs(dernier.droite - r.left) < 1.5) {
          dernier.texte += noeud.data[i];
          dernier.droite = r.right;
        } else {
          ligne.segments.push({ parent, texte: noeud.data[i], gauche: r.left, droite: r.right, haut: r.top });
        }
      }
    }

    // Dégradé à 115° sur la boîte de l'élément, comme dans commun.css (.texte-degrade).
    const id = idUnique("degrade-texte");
    const a = (115 * Math.PI) / 180;
    const [dx, dy] = [Math.sin(a), -Math.cos(a)];
    const longueur = Math.abs(boite.width * dx) + Math.abs(boite.height * dy);
    const [cx, cy] = [boite.width / 2, boite.height / 2];
    const arret = (position, teinte) => `<stop offset="${position}" style="stop-color: var(--let-${teinte})"/>`;
    let contenu = `<defs><linearGradient id="${id}" gradientUnits="userSpaceOnUse"
      x1="${cx - (dx * longueur) / 2}" y1="${cy - (dy * longueur) / 2}" x2="${cx + (dx * longueur) / 2}" y2="${cy + (dy * longueur) / 2}">
      ${arret(0, "a")}${arret(0.3, "b")}${arret(0.52, "c")}${arret(0.72, "b")}${arret(1, "a")}</linearGradient></defs>`;

    for (const ligne of lignes) {
      for (const s of ligne.segments) {
        if (!s.texte.trim()) continue;
        const style = getComputedStyle(s.parent);
        contexte.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        const ligneDeBase = s.haut + contexte.measureText("Hg").fontBoundingBoxAscent - boite.top;
        const texte = style.textTransform === "uppercase" ? s.texte.toUpperCase() : s.texte;
        const remplissage = s.parent === element ? `url(#${id})` : style.color;
        contenu += `<text x="${s.gauche - boite.left}" y="${ligneDeBase}" textLength="${s.droite - s.gauche}" lengthAdjust="spacing"
          font-family='${style.fontFamily}' font-size="${style.fontSize}" font-weight="${style.fontWeight}" font-style="${style.fontStyle}"
          letter-spacing="${style.letterSpacing === "normal" ? 0 : style.letterSpacing}" style="white-space: pre" fill="${remplissage}">${esc(texte)}</text>`;
      }
    }

    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "texte-vectorise");
    svg.setAttribute("width", boite.width);
    svg.setAttribute("height", boite.height);
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("style", "position: absolute; left: 0; top: 0; overflow: visible; visibility: visible; pointer-events: none");
    svg.innerHTML = contenu;
    if (getComputedStyle(element).position === "static") element.style.position = "relative";
    element.style.visibility = "hidden";
    element.append(svg);
  }
}

/* ------------------------------ Ornements ------------------------------ */

// Double filet doré avec un losange à chaque coin (styles .cadre et .losange).
function encadrement() {
  return `<div class="cadre"></div>
    <span class="losange hg"></span><span class="losange hd"></span>
    <span class="losange bg"></span><span class="losange bd"></span>`;
}

function ornement({ classe = "" } = {}) {
  const or = idUnique("orn");
  const fondu = idUnique("fondu");
  const remplissage = `url(#${or})`;
  return `<svg class="ornement ${classe}" viewBox="0 0 160 12" aria-hidden="true">
    <defs>${degrade(or, "orn")}
      <linearGradient id="${fondu}" x1="0" x2="1">
        <stop offset="0" style="stop-color: var(--accent); stop-opacity: 0"/>
        <stop offset="0.5" style="stop-color: var(--accent)"/>
        <stop offset="1" style="stop-color: var(--accent); stop-opacity: 0"/>
      </linearGradient>
    </defs>
    <rect x="4" y="5.7" width="66" height="0.6" fill="url(#${fondu})"/>
    <rect x="90" y="5.7" width="66" height="0.6" fill="url(#${fondu})"/>
    <path d="M66,6 L70,3.6 L74,6 L70,8.4Z M86,6 L90,3.6 L94,6 L90,8.4Z" fill="${remplissage}"/>
    <path d="${ICONES.coeur}" transform="translate(75.2,1.2) scale(0.4)" fill="${remplissage}"/>
  </svg>`;
}

// Impression directe depuis le navigateur : textes dorés vectorisés juste avant l'impression.
window.addEventListener("beforeprint", () => vectoriserDegrades(document));
