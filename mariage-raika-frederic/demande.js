/* Invitation à la cérémonie de demande en mariage (infos.js : demande), dans la charte de la
   carte de menu et des affiches : fond blanc, cadre doré, monogramme couronné, titre et
   prénoms en écriture, date, heure et lieu. Carte A6 portrait (105 × 148 mm), à imprimer à
   100 % : seule (PDF A6), ou quatre par feuille A4, coupée en quatre (repères de coupe).
   Fond blanc : ni fond perdu ni traits de coupe autour, le cadre reste à 7 mm des bords, dans
   la zone que toutes les imprimantes impriment.
   Date, heure ou lieu vides : une ligne pointillée, à remplir à la main. En-tête et ligne des
   prénoms réglables (`entete`, `noms` : demande surprise, au seul prénom de Raïka).
   Une carte par invité (INFOS.demande.invites), son nom en tête du texte, comme une adresse
   (« Nanette, ») ; sans liste, une carte sans nom.
   Touche romantique : voile rose et lilas dans le cadre, cœurs aux coins du cadre et petits
   cœurs semés autour du monogramme ; titres et prénoms en violet royal, or vif, cœurs rose
   orchidée (demande.css).
   Couleurs : INFOS.couleurs.demande, blanc & or par défaut (palette-blanc, commun.css) ;
   textes lisibles à l'impression (commun.css, « Menu, pochette, billets… »). */

const FORMAT_DEMANDE = [105, 148];
const FEUILLE_A4_DEMANDE = [210, 297];

// Toute valeur autre que "or", "argent" ou "blanc" revient au blanc & or.
function couleursDemande() {
  return palette((INFOS.couleurs || {}).demande) || palette("blanc");
}

// Petits cœurs semés de part et d'autre du monogramme, dans les deux coins hauts du cadre
// (coordonnées en mm dans le cadre, 91 × 134) : [x, y, taille, rotation, couleur, plein].
const COEURS_DEMANDE = [
  [11, 19, 4.4, -15, "coeur", true], [5.8, 25.5, 2.7, 12, "coeur-or", true],
  [16.8, 27, 2.4, -25, "coeur", false], [8.6, 12.4, 2, 18, "coeur-or", false],
  [18.2, 14.6, 1.6, 0, "coeur", true], [4.6, 18.4, 1.4, -8, "coeur", false],
];

function coeursEpars() {
  const [l, h] = [FORMAT_DEMANDE[0] - 14, FORMAT_DEMANDE[1] - 14];
  const coeur = ([x, y, taille, rotation, couleur, plein]) => {
    const echelle = taille / 20; // le tracé du cœur (24 × 24) mesure 20 unités de large
    const peinture = plein ? `fill="var(--${couleur})"` : `fill="none" stroke="var(--${couleur})" stroke-width="${(0.28 / echelle).toFixed(2)}"`;
    return `<path d="${ICONES.coeur}" transform="translate(${x} ${y}) rotate(${rotation}) scale(${echelle}) translate(-12 -12)" ${peinture}/>`;
  };
  const gauche = COEURS_DEMANDE.map(coeur).join("");
  const droite = COEURS_DEMANDE.map(([x, y, taille, rotation, couleur, plein]) => coeur([l - x, y, taille, -rotation, couleur, plein])).join("");
  return `<svg class="coeurs" viewBox="0 0 ${l} ${h}" aria-hidden="true">${gauche}${droite}</svg>`;
}

// Cadre doré à cœurs : voile dans le cadre, cœurs semés, double filet, un cœur à chaque coin.
function encadrementRomantique() {
  return `<div class="voile"></div>${coeursEpars()}<div class="cadre"></div>
    ${["hg", "hd", "bg", "bd"].map((coin) => `<span class="coin ${coin}">${icone("coeur")}</span>`).join("")}`;
}

// Invités, une carte chacun ; [""] sans liste (une carte sans nom).
function invitesDemande() {
  const invites = (INFOS.demande.invites || []).filter(Boolean);
  return invites.length ? invites : [""];
}

function invitationDemande(invite = "") {
  const D = INFOS.demande;
  const champ = (etiquette, valeur, precision = "") =>
    `<span class="etiquette">${esc(etiquette)}</span>${
      valeur
        ? `<span class="valeur">${esc(valeur)}${precision ? `<span class="precision">${esc(precision)}</span>` : ""}</span>`
        : `<span class="ligne-ecriture"></span>`
    }`;
  const complements = [D.tenue && `Tenue\u00a0: ${D.tenue}`, D.confirmation].filter(Boolean);
  return `
  <section class="page demande${couleursDemande()}">
    ${encadrementRomantique()}
    <div class="contenu">
      <div class="etiquette entete">${esc(D.entete || "Invitation")}</div>
      ${monogramme({ taille: 24 })}
      <h1 class="titre texte-degrade">${esc(D.titre)}</h1>
      ${ornement()}
      ${invite ? `<p class="invite">${esc(invite)},</p>` : ""}
      <p class="texte-invitation">${esc(D.invitation)}</p>
      <div class="noms texte-degrade">${D.noms ? esc(D.noms) : `${esc(INFOS.mariee)} <span class="esperluette">&amp;</span> ${esc(INFOS.marie)}`}</div>
      <div class="details">
        ${champ("Date", D.date)}
        ${champ("Heure", D.heure)}
        ${champ("Lieu", D.lieu, D.precision)}
      </div>
      ${complements.map((texte) => `<p class="complement">${esc(texte)}</p>`).join("")}
      <div class="mot texte-degrade">${esc(D.mot)}</div>
    </div>
  </section>`;
}

// Repères de coupe d'une feuille A4 de quatre cartes : traits dans les marges blanches, sur les
// deux lignes de coupe, jusqu'à 9 mm du bord (au-delà des 4 à 5 mm que les imprimantes
// n'impriment pas ; les cadres des cartes sont à 7 mm de part et d'autre), et une petite
// croix au centre, second repère de la coupe de chaque moitié (losanges des coins à 5 mm).
function reperesCoupeDemande() {
  const [l, h] = FEUILLE_A4_DEMANDE;
  const [x, y] = [l / 2, h / 2];
  return `<svg class="reperes-coupe" viewBox="0 0 ${l} ${h}" aria-hidden="true">
    <g stroke="#000" stroke-width="0.2">
      <line x1="${x}" y1="1.5" x2="${x}" y2="9"/><line x1="${x}" y1="${h - 9}" x2="${x}" y2="${h - 1.5}"/>
      <line x1="1.5" y1="${y}" x2="9" y2="${y}"/><line x1="${l - 9}" y1="${y}" x2="${l - 1.5}" y2="${y}"/>
      <path d="M${x - 3},${y} H${x + 3} M${x},${y - 3} V${y + 3}"/>
    </g>
  </svg>`;
}

/* Feuilles : en A4, quatre cartes en deux rangées, la grille centrée sur la feuille (296 mm de
   haut pour 297), les invités dans l'ordre de la liste (sans liste : quatre cartes sans nom) ;
   en A6, une carte par feuille. */
function feuillesDemande(format = "a6", invites = invitesDemande()) {
  if (format !== "a4") {
    return invites.map((invite) =>
      `<section class="feuille feuille-a6"><div class="place" style="left:0;top:0">${invitationDemande(invite)}</div></section>`).join("");
  }
  const [l, h] = FORMAT_DEMANDE;
  const haut = (FEUILLE_A4_DEMANDE[1] - 2 * h) / 2;
  const lots = invites.length > 1 ? Array.from({ length: Math.ceil(invites.length / 4) }, (_, i) => invites.slice(4 * i, 4 * i + 4)) : [Array(4).fill(invites[0])];
  return lots.map((lot) => {
    const cartes = lot.map((invite, k) =>
      `<div class="place" style="left:${(k % 2) * l}mm;top:${haut + Math.floor(k / 2) * h}mm">${invitationDemande(invite)}</div>`);
    return `<section class="feuille feuille-a4">${cartes.join("")}${reperesCoupeDemande()}</section>`;
  }).join("");
}
