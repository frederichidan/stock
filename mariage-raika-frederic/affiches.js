/* Affiches A5 nominatives (infos.js : affiches), dans la charte de la carte de menu et des
   cartes de table : fond blanc, cadre doré, vol RF 1812, monogramme couronné, nom en grande
   écriture, prénoms des mariés et date. A5 portrait (148 × 210 mm), à imprimer à 100 % :
   seule (PDF A5), ou deux par feuille A4 paysage, coupée en deux au milieu (repères de coupe).
   Fond blanc : ni fond perdu ni traits de coupe autour, le cadre reste à 10 mm des bords,
   dans la zone que toutes les imprimantes impriment.
   Couleurs : INFOS.couleurs.affiches, blanc & or par défaut (palette-blanc, commun.css) ;
   textes lisibles à l'impression (commun.css, « Menu, pochette, billets… »). */

const FORMAT_AFFICHE = [148, 210];
const FEUILLE_A4_AFFICHES = [297, 210];

// Toute valeur autre que "or", "argent" ou "blanc" revient au blanc & or.
function couleursAffiche() {
  return palette((INFOS.couleurs || {}).affiches) || palette("blanc");
}

function affiche(nom) {
  const [l, h] = FORMAT_AFFICHE;
  const [lc, hc] = [l - 20, h - 20];
  const civil = INFOS.evenements.find((e) => /civil/i.test(e.titre)) || INFOS.evenements[0];
  return `
  <section class="page affiche${couleursAffiche()}">
    <div class="calque">
      <svg viewBox="0 0 ${lc} ${hc}" preserveAspectRatio="none">
        ${bandeGuillochee({ largeur: lc, y: hc - 24, amplitude: 3, periode: 30, nbLignes: 7, couleur: "var(--guilloche)" })}
      </svg>
    </div>
    ${encadrement()}
    <div class="contenu">
      <div class="vol">${icone("avion", { rotation: 90 })}<span class="etiquette">Vol ${esc(INFOS.vol)}</span></div>
      <div class="milieu">
        ${monogramme({ halo: true, taille: 40 })}
        ${ornement()}
        <div class="nom texte-degrade">${esc(nom)}</div>
        ${ornement()}
      </div>
      <div class="bas">
        <div class="maries texte-degrade">${esc(INFOS.mariee)} <span class="esperluette">&amp;</span> ${esc(INFOS.marie)}</div>
        <div class="date">${esc(civil.dateCourte.replace(/\./g, " · "))}</div>
      </div>
    </div>
  </section>`;
}

// Repères de coupe d'une feuille A4 de deux affiches : traits dans les marges blanches, sur le
// milieu de la feuille, jusqu'à 9 mm du bord (au-delà des 4 à 5 mm que les imprimantes
// n'impriment pas ; les cadres des affiches sont à 10 mm de part et d'autre).
function reperesCoupeAffiches() {
  const [l, h] = FEUILLE_A4_AFFICHES;
  const x = l / 2;
  return `<svg class="reperes-coupe" viewBox="0 0 ${l} ${h}" aria-hidden="true">
    <g stroke="#000" stroke-width="0.2"><line x1="${x}" y1="1.5" x2="${x}" y2="9"/><line x1="${x}" y1="${h - 9}" x2="${x}" y2="${h - 1.5}"/></g>
  </svg>`;
}

/* Feuilles : en A4, deux affiches côte à côte, chacune centrée dans sa moitié (148,5 mm) ; en
   A5, une affiche par feuille. `premier` : rang (1, 2…) de la première affiche. */
function feuillesAffiches(format = "a5", noms = INFOS.affiches, premier = 1) {
  const parFeuille = format === "a4" ? 2 : 1;
  const feuilles = [];
  for (let i = 0; i < noms.length; i += parFeuille) {
    const lot = noms.slice(i, i + parFeuille);
    const affiches = lot.map((nom, k) => {
      const gauche = format === "a4" ? k * (FEUILLE_A4_AFFICHES[0] / 2) + (FEUILLE_A4_AFFICHES[0] / 2 - FORMAT_AFFICHE[0]) / 2 : 0;
      return `<div class="place-affiche" style="left:${gauche}mm" data-rang="${premier + i + k}">${affiche(nom)}</div>`;
    });
    feuilles.push(`<section class="feuille feuille-${format}">${affiches.join("")}${format === "a4" ? reperesCoupeAffiches() : ""}</section>`);
  }
  return feuilles.join("");
}
