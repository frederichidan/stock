/* Billet d'invitation façon carte d'embarquement.
   Recto : billet avec talon. Verso : programme des escales.
   `theme` : une entrée de THEMES (themes.js). */

function billet(theme) {
  const I = INFOS;
  const jourCourt = (jour) => jour.slice(0, 3) + ".";

  const recto = `
  <section class="page billet recto ${theme.principal}">
    <div class="principal">
      <header class="bandeau sombre">
        <div class="bandeau-titre">
          ${icone("avion", { rotation: 90 })}
          <div>
            <div class="etiquette">Carte d’embarquement</div>
            <div class="sous-titre">Billet d’invitation au mariage</div>
          </div>
        </div>
        <div class="bandeau-infos">
          <div><div class="etiquette">Vol</div><div class="valeur">${esc(I.vol)}</div></div>
          <div><div class="etiquette">Classe</div><div class="valeur">${esc(I.classe)}</div></div>
        </div>
      </header>

      <div class="corps">
        <div class="calque">
          <svg viewBox="0 0 152 84" preserveAspectRatio="none">
            ${bandeGuillochee({ largeur: 152, y: 64, amplitude: 4.5, periode: 38, nbLignes: 14, couleur: "var(--guilloche)" })}
          </svg>
        </div>
        <div>${monogramme({ halo: true })}</div>
        <div>
          <h1 class="noms texte-degrade">${esc(I.mariee)} <span class="esperluette">&amp;</span> ${esc(I.marie)}</h1>
          <p class="invitation">${esc(I.invitationBillet)}</p>

          <div class="trajet">
            <div class="aeroport"><span class="code">${esc(I.depart.code)}</span><span class="etiquette">${esc(I.depart.ville)}</span></div>
            <div class="ligne-vol"><span></span>${icone("avion", { rotation: 90 })}<span></span></div>
            <div class="aeroport"><span class="code">${esc(I.arrivee.code)}</span><span class="etiquette">${esc(I.arrivee.ville)}</span></div>
          </div>

          <div class="champ"><span class="etiquette">Passager(s)</span><span class="ligne-ecriture"></span></div>

          <div class="escales">
            ${I.evenements.map((e) => `
              <div class="escale">
                <div class="etiquette">${esc(e.escale)}</div>
                <div class="date">${esc(jourCourt(e.jour))} ${esc(e.dateCourte)}</div>
                <div class="titre">${esc(e.titre)}</div>
              </div>`).join("")}
          </div>
        </div>
      </div>
    </div>

    <aside class="talon sombre">
      <span class="encoche haut"></span><span class="encoche bas"></span>
      <header class="bandeau">
        <div>
          <div class="etiquette">Embarquement</div>
          <div class="sous-titre">Talon</div>
        </div>
      </header>
      <div class="talon-corps">
        ${monogramme()}
        <div class="champ"><span class="etiquette">Passager(s)</span><span class="ligne-ecriture"></span></div>
        <div class="grille">
          <div><div class="etiquette">Vol</div><div class="valeur">${esc(I.vol)}</div></div>
          <div><div class="etiquette">Porte</div><div class="valeur">${esc(I.porte)}</div></div>
          <div><div class="etiquette">De</div><div class="valeur">${esc(I.depart.code)} · ${esc(I.depart.ville)}</div></div>
          <div><div class="etiquette">À</div><div class="valeur">${esc(I.arrivee.code)} · ${esc(I.arrivee.ville)}</div></div>
          <div><div class="etiquette">Siège</div><div class="valeur">Table n° ____</div></div>
          <div><div class="etiquette">Dates</div><div class="valeur">${[...new Set(I.evenements.map((e) => e.dateCourte.slice(0, 5)))].map(esc).join(" &amp; ")}</div></div>
        </div>
        ${codeBarres(`${I.vol}-${I.mariee}-${I.marie}`, { largeur: 100, hauteur: 16 })}
        <p class="devise">«\u202f${esc(I.devise)}\u202f»</p>
      </div>
    </aside>
  </section>`;

  const verso = `
  <section class="page billet verso ${theme.verso}">
    <div class="calque">
      <svg viewBox="0 0 210 99" preserveAspectRatio="none">
        ${bandeGuillochee({ largeur: 210, y: 58, amplitude: 9, periode: 52, nbLignes: 16, couleur: "var(--guilloche)", epaisseur: 0.18 })}
      </svg>
    </div>
    <header class="bandeau sombre">
      <span class="etiquette">Vol ${esc(I.vol)}</span>
      <h2>${icone("coeur")}<span class="texte-degrade">Programme du voyage</span>${icone("avion", { rotation: 90 })}</h2>
      <span class="etiquette">${esc(I.mariee)} &amp; ${esc(I.marie)}</span>
    </header>

    <div class="itineraire">
      ${I.evenements.map((e, i) => `
        <article class="etape">
          ${i > 0 ? `<span class="avion-etape">${icone("avion", { rotation: 90 })}</span>` : ""}
          <span class="pastille">${anneaux()}<span class="etiquette">${esc(e.escale)}</span></span>
          <h3>${esc(e.titre)}</h3>
          <div class="date">${esc(e.jour)} ${esc(e.date)}</div>
          <div class="lieu">${icone("lieu")}<span>${esc(e.lieu)}${e.precision ? `<small>${esc(e.precision)}</small>` : ""}</span></div>
          <ul class="horaires">
            ${e.programme.map(([heure, texte]) => `<li><b>${esc(heure)}</b><span>${esc(texte)}</span></li>`).join("")}
          </ul>
        </article>`).join("")}
    </div>

    <footer class="pied sombre">
      <div>
        <span class="etiquette">Confirmez votre embarquement avant le ${esc(I.rsvp.avant)}</span>
        ${I.rsvp.contacts.map(esc).join(" &nbsp;|&nbsp; ")}
      </div>
      <div class="droite">
        <span class="etiquette">Code vestimentaire</span>
        <b>${esc(I.codeVestimentaire)}</b>
      </div>
    </footer>
  </section>`;

  return recto + verso;
}
