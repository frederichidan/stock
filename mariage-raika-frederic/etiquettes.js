/* Étiquettes de bouteilles, dans la charte du billet (carte d'embarquement) : bandeau sombre
   liseré d'or, monogramme couronné, prénoms en écriture dorée, trajet CLB → MAR, guillochis.
   - Vin : étiquette avant, 90 × 120 mm (bouteille de 75 cl).
   - Eau 33 cl : étiquette qui fait le tour de la bouteille, 200 × 50 mm. Le bord gauche passe
     sous le bord droit une fois collée : les 15 premiers millimètres ne portent aucun texte.
   Une seule face chacune. Couleurs : palette « or champagne » (ivoire, champagne, or et bronze),
   sans violet et quelle que soit la version choisie (classe palette-or, voir commun.css). */

const FORMATS_ETIQUETTES = {
  vin: [90, 120],
  eau: [200, 50],
};

// Date de la couverture du passeport (« 18 DÉCEMBRE 2026 ») : chiffres en or, mois en clair.
function dateEtiquette() {
  const I = INFOS;
  const e = I.evenements[(I.passeport.escaleCouverture || 1) - 1] || I.evenements[0];
  const [jour, mois, annee] = e.date.split(" ");
  return `<span class="chiffres">${esc(jour)}</span> ${esc(mois.toUpperCase())} <span class="chiffres">${esc(annee)}</span>`;
}

function trajetEtiquette() {
  const I = INFOS;
  return `<div class="trajet">
    <div class="aeroport"><span class="code">${esc(I.depart.code)}</span><span class="etiquette">${esc(I.depart.ville)}</span></div>
    <div class="ligne-vol"><span></span>${icone("avion", { rotation: 90 })}<span></span></div>
    <div class="aeroport"><span class="code">${esc(I.arrivee.code)}</span><span class="etiquette">${esc(I.arrivee.ville)}</span></div>
  </div>`;
}

function etiquetteVin() {
  const I = INFOS;
  const V = I.etiquettes.vin;
  const [l, h] = FORMATS_ETIQUETTES.vin;
  return `
  <section class="page bouteille vin${palette("or")}">
    <div class="calque">
      <svg viewBox="0 0 ${l} ${h}" preserveAspectRatio="none">
        ${bandeGuillochee({ largeur: l, y: 88, amplitude: 3.6, periode: 26, nbLignes: 7, couleur: "var(--guilloche)" })}
      </svg>
    </div>
    <header class="bandeau">
      ${icone("avion", { rotation: 90 })}
      <div>
        <div class="etiquette">${esc(V.classe)}</div>
        <div class="sous-titre">Vol ${esc(I.vol)}</div>
      </div>
    </header>
    <div class="corps">
      ${monogramme({ halo: true, taille: 34 })}
      <div class="cuvee texte-degrade">${esc(V.titre)}</div>
      <h1 class="noms texte-degrade">${esc(I.mariee)} <span class="esperluette">&amp;</span> ${esc(I.marie)}</h1>
      <div class="etiquette mention">${esc(V.mention)}</div>
      ${trajetEtiquette()}
    </div>
    <footer class="pied">
      <div class="date-etiquette">${dateEtiquette()}</div>
      <div class="devise">« ${esc(I.devise)} »</div>
    </footer>
  </section>`;
}

function etiquetteEau() {
  const I = INFOS;
  const E = I.etiquettes.eau;
  const [l, h] = FORMATS_ETIQUETTES.eau;
  const dates = [...new Set(I.evenements.map((e) => e.dateCourte.slice(0, 5)))].map(esc).join(" &amp; ");
  return `
  <section class="page bouteille eau${palette("or")}">
    <div class="principal">
      <header class="bandeau">
        <div class="bandeau-titre">
          ${icone("avion", { rotation: 90 })}
          <div>
            <div class="etiquette">Carte d’embarquement</div>
            <div class="sous-titre">${esc(E.mention)}</div>
          </div>
        </div>
        <div class="bandeau-infos">
          <div><div class="etiquette">Vol</div><div class="valeur">${esc(I.vol)}</div></div>
          <div><div class="etiquette">Classe</div><div class="valeur">${esc(I.classe)}</div></div>
        </div>
      </header>
      <div class="corps">
        <div class="calque">
          <svg viewBox="0 0 142 37" preserveAspectRatio="none">
            ${bandeGuillochee({ largeur: 142, y: 25, amplitude: 3.4, periode: 30, nbLignes: 7, couleur: "var(--guilloche)" })}
          </svg>
        </div>
        ${monogramme({ halo: true, taille: 27 })}
        <div class="texte">
          <h1 class="noms texte-degrade">${esc(I.mariee)} <span class="esperluette">&amp;</span> ${esc(I.marie)}</h1>
          <p class="voeu">${esc(E.voeu)}</p>
          ${trajetEtiquette()}
        </div>
      </div>
    </div>

    <aside class="talon">
      <span class="encoche haut"></span><span class="encoche bas"></span>
      <header class="bandeau">
        <div>
          <div class="etiquette">${esc(E.nom)}</div>
          <div class="sous-titre">Servie à bord</div>
        </div>
      </header>
      <div class="talon-corps">
        <div class="contenance texte-degrade">${esc(E.contenance)}</div>
        <div class="grille">
          <div><div class="etiquette">Vol</div><div class="valeur">${esc(I.vol)}</div></div>
          <div><div class="etiquette">Dates</div><div class="valeur">${dates}</div></div>
        </div>
        ${codeBarres(`${I.vol}-${E.nom}-${E.contenance}`, { largeur: 100, hauteur: 16 })}
      </div>
    </aside>
  </section>`;
}
