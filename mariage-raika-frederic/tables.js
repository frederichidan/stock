/* Cartes de table : une par table (infos.js : tables), numérotée dans l'ordre de la liste et
   nommée d'après une fleur, dans la charte de la carte de menu et des étiquettes : cadre doré,
   vol RF 1812, monogramme couronné, grand numéro, nom de la fleur en écriture dorée,
   guillochis.
   Format A5 (148 × 210 mm), imprimé à 88,5 % (131 × 186 mm) : deux cartes par feuille A4,
   le verso identique au recto (la carte se lit des deux côtés de la table).
   Couleurs : INFOS.couleurs.tables, blanc & or par défaut (classe palette-blanc, commun.css). */

const FORMAT_CARTE_TABLE = [148, 210];

// Toute valeur autre que "or", "argent" ou "blanc" revient au blanc & or : sans palette, la page
// n'aurait aucune couleur de texte.
function couleursTable() {
  return palette((INFOS.couleurs || {}).tables) || palette("blanc");
}

function carteTable(numero, nom) {
  const I = INFOS;
  const [l, h] = FORMAT_CARTE_TABLE;
  return `
  <section class="page carte-table${couleursTable()}">
    <div class="calque">
      <svg viewBox="0 0 ${l} ${h}" preserveAspectRatio="none">
        ${bandeGuillochee({ largeur: l, y: 178, amplitude: 4, periode: 32, nbLignes: 7, couleur: "var(--guilloche)" })}
      </svg>
    </div>
    ${encadrement()}
    <div class="contenu">
      <div class="vol">${icone("avion", { rotation: 90 })}<span class="etiquette">Vol ${esc(I.vol)}</span></div>
      ${monogramme({ halo: true, taille: 34 })}
      <div class="centre">
        <div class="etiquette intitule">Table</div>
        <div class="numero texte-degrade">${numero}</div>
        ${ornement()}
        <div class="nom texte-degrade">${esc(nom)}</div>
      </div>
      <div class="signature texte-degrade">${esc(I.mariee)} &amp; ${esc(I.marie)}</div>
    </div>
  </section>`;
}

// Toutes les cartes, dans l'ordre des tables. `theme` est ignoré (couleurs : couleursTable).
function cartesTables() {
  return INFOS.tables.map((nom, i) => carteTable(i + 1, nom)).join("");
}
