/* Carte de menu de la soirée de gala.
   Recto : menu. Verso : monogramme, prénoms et devise.
   `theme` : une entrée de THEMES (themes.js). */

function carteMenu(theme) {
  const I = INFOS;
  const M = I.menu;

  const recto = `
  <section class="page menu recto ${theme.principal}">
    <div class="calque">
      <svg viewBox="0 0 99 210" preserveAspectRatio="none">
        ${bandeGuillochee({ largeur: 99, y: 192, amplitude: 3, periode: 24, nbLignes: 12, couleur: "var(--guilloche)" })}
      </svg>
    </div>
    ${encadrement()}
    <div class="contenu">
      ${monogramme({ halo: true })}
      <h1 class="titre-menu texte-degrade">${esc(M.titre)}</h1>
      <div class="etiquette evenement">${esc(M.evenement)}</div>
      <div class="date">${esc(M.date)}</div>
      ${ornement()}

      ${M.rubriques.map((r) => `
        <section class="rubrique">
          <h2>${esc(r.titre)}</h2>
          ${r.plats.map((p) => `<p class="plat">${esc(p)}</p>`).join("")}
        </section>`).join("")}

      <div class="bas">
        <div class="table"><span class="etiquette">Table</span><span class="ligne-ecriture"></span></div>
        <div class="signature texte-degrade">${esc(I.mariee)} &amp; ${esc(I.marie)}</div>
      </div>
    </div>
  </section>`;

  const dateCivil = I.evenements.find((e) => /civil/i.test(e.titre)) || I.evenements[0];

  const verso = `
  <section class="page menu verso ${theme.principal}">
    ${encadrement()}
    <div class="contenu">
      ${monogramme({ halo: true })}
      <div class="noms texte-degrade">${esc(I.mariee)} <span class="esperluette">&amp;</span> ${esc(I.marie)}</div>
      <div class="date">${esc(dateCivil.dateCourte.replace(/\./g, " · "))}</div>
      ${ornement()}
      <p class="devise">«\u202f${esc(I.devise)}\u202f»</p>
      <p class="source">${esc(I.deviseSource)}</p>
    </div>
  </section>`;

  return recto + verso;
}
