/* Cartes de table en chevalet : une feuille A4 par table (infos.js : tables), numérotée dans
   l'ordre de la liste et nommée d'après une fleur, dans la charte de la carte de menu et des
   étiquettes : cadre doré, vol RF 1812, monogramme couronné, grand numéro, nom de la fleur en
   écriture dorée, guillochis.
   La feuille (A4 portrait, imprimée à 100 %, recto seul) se plie en deux, pli en haut : chaque
   moitié devient une face du chevalet, de 210 × 148,5 mm. La moitié basse est à l'endroit, la
   moitié haute tournée de 180° : une fois pliée, le numéro et le nom se lisent des deux côtés
   de la table. Fond blanc : ni fond perdu ni découpe, le cadre reste à 10 mm des bords.
   Couleurs : INFOS.couleurs.tables, blanc & or par défaut (classe palette-blanc, commun.css). */

const FORMAT_CHEVALET = [210, 297];
const FACE_CHEVALET = [210, 148.5];

// Toute valeur autre que "or", "argent" ou "blanc" revient au blanc & or : sans palette, la page
// n'aurait aucune couleur de texte.
function couleursTable() {
  return palette((INFOS.couleurs || {}).tables) || palette("blanc");
}

// Une face du chevalet (210 × 148,5 mm), à l'endroit.
function faceTable(numero, nom) {
  const [l, h] = FACE_CHEVALET;
  return `
    <div class="face-table">
      <div class="calque">
        <svg viewBox="0 0 ${l} ${h}" preserveAspectRatio="none">
          ${bandeGuillochee({ largeur: l, y: 131, amplitude: 2.6, periode: 32, nbLignes: 7, couleur: "var(--guilloche)" })}
        </svg>
      </div>
      ${encadrement()}
      <div class="contenu">
        <div class="vol">${icone("avion", { rotation: 90 })}<span class="etiquette">Vol ${esc(INFOS.vol)}</span></div>
        ${monogramme({ halo: true, taille: 24 })}
        <div class="etiquette intitule">Table</div>
        <div class="numero texte-degrade">${numero}</div>
        ${ornement()}
        <div class="nom texte-degrade">${esc(nom)}</div>
      </div>
    </div>`;
}

// Repères de pli : deux traits courts dans les marges, à mi-hauteur de la feuille.
function reperesPli() {
  const [l, h] = FORMAT_CHEVALET;
  const y = h / 2;
  return `<svg class="reperes-pli" viewBox="0 0 ${l} ${h}" aria-hidden="true">
    <g stroke="var(--accent)" stroke-width="0.25" stroke-dasharray="1 0.8">
      <line x1="3" y1="${y}" x2="7.5" y2="${y}"/><line x1="${l - 7.5}" y1="${y}" x2="${l - 3}" y2="${y}"/>
    </g>
  </svg>`;
}

function chevaletTable(numero, nom) {
  return `
  <section class="page chevalet${couleursTable()}">
    <div class="moitie haut">${faceTable(numero, nom)}</div>
    <div class="moitie bas">${faceTable(numero, nom)}</div>
    ${reperesPli()}
  </section>`;
}

// Toutes les feuilles, dans l'ordre des tables. `theme` est ignoré (couleurs : couleursTable).
function chevaletsTables() {
  return INFOS.tables.map((nom, i) => chevaletTable(i + 1, nom)).join("");
}
