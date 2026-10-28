/* Invitation à la cérémonie de demande en mariage (infos.js : demande), dans la charte de la
   carte de menu et des affiches : fond blanc, cadre doré, monogramme couronné, titre et
   prénoms en écriture, date, heure et lieu. Carte A6 portrait (105 × 148 mm), à imprimer à
   100 % : seule (PDF A6), ou quatre par feuille A4, coupée en quatre (repères de coupe).
   Fond blanc : ni fond perdu ni traits de coupe autour, le cadre reste à 7 mm des bords, dans
   la zone que toutes les imprimantes impriment.
   Date, heure ou lieu vides : une ligne pointillée, à remplir à la main.
   Couleurs : INFOS.couleurs.demande, blanc & or par défaut (palette-blanc, commun.css) ;
   textes lisibles à l'impression (commun.css, « Menu, pochette, billets… »). */

const FORMAT_DEMANDE = [105, 148];
const FEUILLE_A4_DEMANDE = [210, 297];

// Toute valeur autre que "or", "argent" ou "blanc" revient au blanc & or.
function couleursDemande() {
  return palette((INFOS.couleurs || {}).demande) || palette("blanc");
}

function invitationDemande() {
  const D = INFOS.demande;
  const champ = (etiquette, valeur, precision = "") =>
    `<span class="etiquette">${esc(etiquette)}</span>${
      valeur
        ? `<span class="valeur">${esc(valeur)}${precision ? `<span class="precision">${esc(precision)}</span>` : ""}</span>`
        : `<span class="ligne-ecriture"></span>`
    }`;
  const complements = [D.tenue && `Tenue : ${D.tenue}`, D.confirmation].filter(Boolean);
  return `
  <section class="page demande${couleursDemande()}">
    ${encadrement()}
    <div class="contenu">
      <div class="etiquette entete">Invitation</div>
      ${monogramme({ taille: 24 })}
      <h1 class="titre texte-degrade">${esc(D.titre)}</h1>
      ${ornement()}
      <p class="texte-invitation">${esc(D.invitation)}</p>
      <div class="noms texte-degrade">${esc(INFOS.mariee)} <span class="esperluette">&amp;</span> ${esc(INFOS.marie)}</div>
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
// n'impriment pas ; les cadres des cartes sont à 7 mm de part et d'autre).
function reperesCoupeDemande() {
  const [l, h] = FEUILLE_A4_DEMANDE;
  const [x, y] = [l / 2, h / 2];
  return `<svg class="reperes-coupe" viewBox="0 0 ${l} ${h}" aria-hidden="true">
    <g stroke="#000" stroke-width="0.2">
      <line x1="${x}" y1="1.5" x2="${x}" y2="9"/><line x1="${x}" y1="${h - 9}" x2="${x}" y2="${h - 1.5}"/>
      <line x1="1.5" y1="${y}" x2="9" y2="${y}"/><line x1="${l - 9}" y1="${y}" x2="${l - 1.5}" y2="${y}"/>
    </g>
  </svg>`;
}

/* Feuilles : en A4, quatre cartes identiques en deux rangées, la grille centrée sur la feuille
   (296 mm de haut pour 297) ; en A6, une carte. */
function feuillesDemande(format = "a6") {
  if (format !== "a4") return `<section class="feuille feuille-a6"><div class="place" style="left:0;top:0">${invitationDemande()}</div></section>`;
  const [l, h] = FORMAT_DEMANDE;
  const haut = (FEUILLE_A4_DEMANDE[1] - 2 * h) / 2;
  const cartes = [0, 1].flatMap((ligne) => [0, 1].map((colonne) =>
    `<div class="place" style="left:${colonne * l}mm;top:${haut + ligne * h}mm">${invitationDemande()}</div>`));
  return `<section class="feuille feuille-a4">${cartes.join("")}${reperesCoupeDemande()}</section>`;
}
