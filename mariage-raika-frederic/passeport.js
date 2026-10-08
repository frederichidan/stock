/* Pochette passeport, sans photo : le monogramme R & F tient lieu de portrait.
   Extérieur : dos (alliances et texte) | couverture (titre, blason, prénoms, date de passeport.escaleCouverture).
   Intérieur : invitation et tampons des escales | page d'identité des « titulaires ».
   `theme` : une entrée de THEMES (themes.js). */

/* ------------------------------ Dessins ------------------------------ */

// Deux alliances entrelacées, un solitaire serti sur la seconde.
function anneauxDores() {
  const or = idUnique("orn");
  const pierre = idUnique("pierre");
  const coupe = idUnique("coupe");
  const anneau = (cx, cy) => `
    <circle cx="${cx}" cy="${cy}" r="38" stroke="url(#${or})" stroke-width="8"/>
    <circle cx="${cx}" cy="${cy}" r="42" style="stroke: var(--orn-a)" stroke-width="0.7"/>
    <circle cx="${cx}" cy="${cy}" r="34" style="stroke: var(--orn-a)" stroke-width="0.7"/>
    <path d="${arc(cx, cy, 38, 200, 245)}" style="stroke: var(--orn-b)" stroke-width="1.6" stroke-linecap="round" opacity="0.8"/>`;
  return `<svg class="anneaux-dores" viewBox="0 0 200 112" aria-hidden="true">
    <defs>
      ${degrade(or, "orn")}
      <linearGradient id="${pierre}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#ffffff"/><stop offset="0.5" stop-color="#e4e6ee"/><stop offset="1" stop-color="#a9adb8"/>
      </linearGradient>
      <clipPath id="${coupe}"><circle cx="94.5" cy="31.8" r="9"/></clipPath>
    </defs>
    <g fill="none">
      ${anneau(78, 66)}
      ${anneau(122, 58)}
      <g clip-path="url(#${coupe})">${anneau(78, 66)}</g>
    </g>
    <g stroke-linejoin="round">
      <path d="M118.5,17 L117,10.5 M125.5,17 L127,10.5" style="stroke: var(--orn-a)" stroke-width="1.6"/>
      <path d="M114.5,8 L118.5,3.5 L125.5,3.5 L129.5,8 L122,17.5 Z" fill="url(#${pierre})" stroke="#a9adb8" stroke-width="0.5"/>
      <path d="M114.5,8 L129.5,8 M118.5,3.5 L120,8 L122,17.5 L124,8 L125.5,3.5" fill="none" stroke="#a9adb8" stroke-width="0.4"/>
    </g>
  </svg>`;
}

// Ruban portant la devise, sous le blason.
function ruban(texte) {
  const or = idUnique("orn");
  const lettres = idUnique("let");
  const chemin = idUnique("ruban");
  return `<svg class="ruban" viewBox="0 0 200 44" aria-hidden="true">
    <defs>${degrade(or, "orn")}${degrade(lettres, "let")}
      <path id="${chemin}" d="M24,21 Q100,43 176,21"/>
    </defs>
    <g stroke="url(#${or})" stroke-width="0.9" stroke-linejoin="round">
      <path d="M32,12 L5,15 L13,22.5 L5,30 L32,29 Z" style="fill: var(--accent); fill-opacity: 0.28"/>
      <path d="M168,12 L195,15 L187,22.5 L195,30 L168,29 Z" style="fill: var(--accent); fill-opacity: 0.28"/>
      <path d="M24,8 Q100,30 176,8 L176,26 Q100,48 24,26 Z" style="fill: var(--accent); fill-opacity: 0.16"/>
    </g>
    <text font-family="Great Vibes" font-size="14.5" fill="url(#${lettres})">
      <textPath href="#${chemin}" startOffset="50%" text-anchor="middle">${esc(texte)}</textPath>
    </text>
  </svg>`;
}

// Symbole du passeport biométrique, en tracés pleins (sans masque, pour rester vectoriel
// dans les PDF) : deux bandes échancrées par le cercle, et l'anneau central.
function puceBiometrique() {
  const or = idUnique("orn");
  const ecart = Math.sqrt(8.6 ** 2 - 2.4 ** 2).toFixed(3); // le cercle de 8,6 coupe les bandes à 2,4 du centre
  const [gauche, droite] = [(20 - ecart).toFixed(3), (20 + Number(ecart)).toFixed(3)];
  return `<svg class="puce" viewBox="0 0 40 24" aria-hidden="true">
    <defs>${degrade(or, "orn")}</defs>
    <g fill="url(#${or})">
      <path d="M1.6,0 H38.4 Q40,0 40,1.6 V9.6 H${droite} A8.6,8.6 0 0 0 ${gauche},9.6 H0 V1.6 Q0,0 1.6,0 Z"/>
      <path d="M1.6,24 H38.4 Q40,24 40,22.4 V14.4 H${droite} A8.6,8.6 0 0 1 ${gauche},14.4 H0 V22.4 Q0,24 1.6,24 Z"/>
      <path fill-rule="evenodd" d="M13.4,12 A6.6,6.6 0 1 0 26.6,12 A6.6,6.6 0 1 0 13.4,12 Z M15.6,12 A4.4,4.4 0 1 0 24.4,12 A4.4,4.4 0 1 0 15.6,12 Z"/>
    </g>
  </svg>`;
}

// Tampon de visa pour une escale : rond, ou rectangulaire pour l'escale centrale.
function tampon(e, numero, forme, rotation) {
  const [jj, mm, aaaa] = e.dateCourte.split(".");
  const style = `transform: rotate(${rotation}deg)`;
  const classes = `tampon ${forme} t${numero}`;
  if (forme === "rectangle") {
    return `<svg class="${classes}" viewBox="0 0 120 70" style="${style}" aria-hidden="true">
      <g fill="none" stroke="currentColor">
        <rect x="2" y="2" width="116" height="66" rx="6" stroke-width="2.4"/>
        <rect x="7" y="7" width="106" height="56" rx="3" stroke-width="0.8"/>
        <path d="M16,28 H104" stroke-width="0.6"/>
      </g>
      <g fill="currentColor" font-family="Montserrat" font-weight="700" text-anchor="middle">
        <text x="60" y="22" font-size="8.6" letter-spacing="1.2">${esc(e.titre.toUpperCase())}</text>
        <text x="60" y="45" font-size="14.5" letter-spacing="0.6">${esc(e.dateCourte)}</text>
        <text x="60" y="56.5" font-size="6" letter-spacing="1.2">${esc(`${e.escale} · ${e.jour}`.toUpperCase())}</text>
      </g>
    </svg>`;
  }
  const id = idUnique("tampon");
  return `<svg class="${classes}" viewBox="0 0 100 100" style="${style}" aria-hidden="true">
    <defs>
      <path id="${id}-h" d="${arc(50, 50, 33, 160, 380)}"/>
      <path id="${id}-b" d="${arc(50, 50, 37, 140, 40)}"/>
    </defs>
    <g fill="none" stroke="currentColor">
      <circle cx="50" cy="50" r="47" stroke-width="2.4"/>
      <circle cx="50" cy="50" r="42.5" stroke-width="0.8"/>
      <circle cx="50" cy="50" r="26" stroke-width="0.8"/>
    </g>
    <g fill="currentColor" font-family="Montserrat" font-weight="700" text-anchor="middle">
      <text font-size="7.4" letter-spacing="0.9"><textPath href="#${id}-h" startOffset="50%">${esc(e.titre.toUpperCase())}</textPath></text>
      <text font-size="6.4" letter-spacing="1.4"><textPath href="#${id}-b" startOffset="50%">· ${esc(e.escale.toUpperCase())} ·</textPath></text>
      <text x="50" y="44" font-size="5.2" letter-spacing="0.8">${esc(e.jour.toUpperCase())}</text>
      <text x="50" y="57" font-size="13">${esc(`${jj}.${mm}`)}</text>
      <text x="50" y="66" font-size="6.5" letter-spacing="0.6">${esc(aaaa)}</text>
    </g>
  </svg>`;
}

// Zone de lecture automatique (deux lignes de 44 caractères, chiffres de contrôle compris).
function zoneLecture() {
  const I = INFOS;
  const P = I.passeport;
  const normaliser = (t) =>
    t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().replace(/[^A-Z0-9]+/g, "<").replace(/^<+|<+$/g, "");
  const remplir = (t, n) => (t + "<".repeat(n)).slice(0, n);
  const controle = (t) =>
    String([...t].reduce((s, c, i) => s + (c === "<" ? 0 : /\d/.test(c) ? Number(c) : c.charCodeAt(0) - 55) * [7, 3, 1][i % 3], 0) % 10);
  const pays = remplir(normaliser(P.nationalite), 3);
  const numero = remplir(normaliser(P.numero), 9);
  const [j, m, a] = escaleCouverture().dateCourte.split(".");
  const date = a.slice(2) + m + j;
  return [
    remplir(`P<${pays}${normaliser(I.mariee)}<<${normaliser(I.marie)}`, 44),
    remplir(`${numero}${controle(numero)}${pays}${date}${controle(date)}<<<<<<<<${normaliser(P.validite)}`, 44),
  ];
}

// Escale dont la date figure sur la couverture (infos.js : passeport.escaleCouverture).
function escaleCouverture() {
  const n = INFOS.passeport.escaleCouverture;
  return INFOS.evenements[n - 1] || INFOS.evenements[0];
}

/* ------------------------------ Pages ------------------------------ */

function passeport(theme) {
  const I = INFOS;
  const P = I.passeport;

  // « 18 DÉCEMBRE 2026 » : chiffres en or, mois en clair, comme sur le passeport d'origine.
  const principale = escaleCouverture();
  const [jour, mois, annee] = principale.date.split(" ");
  const dateCouverture = `<span class="chiffres">${esc(jour)}</span> ${esc(mois.toUpperCase())} <span class="chiffres">${esc(annee)}</span>`;

  const champ = (etiquette, valeur, classe = "") =>
    `<div class="${classe}"><div class="etiquette">${esc(etiquette)}</div><div class="valeur">${valeur}</div></div>`;
  const formes = ["rond", "rectangle", "rond"];
  const rotations = [-11, 6, 8];

  const exterieur = `
  <section class="page passeport exterieur ${theme.principal}">
    <div class="face dos">
      ${encadrement()}
      <div class="contenu">
        ${anneauxDores()}
        <p class="verset texte-degrade">${esc(P.verset)}</p>
        ${P.versetSource ? `<p class="verset-source texte-degrade">${esc(P.versetSource)}</p>` : ""}
      </div>
    </div>

    <div class="face couverture">
      <div class="calque">
        <svg viewBox="0 0 105 148" preserveAspectRatio="none">
          ${bandeGuillochee({ largeur: 105, y: 134, amplitude: 3.2, periode: 26, nbLignes: 12, couleur: "var(--guilloche)" })}
        </svg>
      </div>
      <div class="contenu">
        <div class="etiquette emetteur">${esc(P.emetteur)}</div>
        <h1 class="titre-passeport texte-degrade">${esc(P.titre)}</h1>
        <div class="sous-titre-passeport texte-degrade">${esc(P.sousTitre)}</div>
        <div class="blason">
          ${monogramme({ halo: true })}
          ${ruban(I.devise)}
        </div>
        <div class="noms texte-degrade">${esc(I.mariee)} <span class="esperluette">&amp;</span> ${esc(I.marie)}</div>
        <div class="date-couverture">${dateCouverture}</div>
        ${puceBiometrique()}
      </div>
    </div>
  </section>`;

  const [mrz1, mrz2] = zoneLecture();
  const interieur = `
  <section class="page passeport interieur ${theme.verso}">
    <div class="face invitation-page">
      <div class="calque">
        <svg viewBox="0 0 105 148" preserveAspectRatio="none">
          ${bandeGuillochee({ largeur: 105, y: 132, amplitude: 4, periode: 30, nbLignes: 12, couleur: "var(--guilloche)", epaisseur: 0.16 })}
        </svg>
      </div>
      <div class="contenu">
        <div class="etiquette">Invitation</div>
        ${ornement()}
        <div class="noms texte-degrade">${esc(I.mariee)} <span class="esperluette">&amp;</span> ${esc(I.marie)}</div>
        <p class="texte-invitation">${esc(P.invitation)}</p>
        <div class="visas-titre etiquette">Visas</div>
        <div class="visas">
          ${I.evenements.map((e, i) => tampon(e, i + 1, formes[i % 3], rotations[i % 3])).join("")}
        </div>
        <div class="bon-voyage"><span class="texte-degrade">${esc(P.bonVoyage)}</span>${icone("avion", { rotation: 45 })}</div>
      </div>
    </div>

    <div class="face identite">
      <div class="calque">
        <svg viewBox="0 0 105 148" preserveAspectRatio="none">
          ${rosace({ cx: 62, cy: 62, rayon: 34, amplitude: 2.4, lobes: 30, nbCourbes: 12, couleur: "var(--guilloche)", epaisseur: 0.16 })}
          ${rosace({ cx: 62, cy: 62, rayon: 20, amplitude: 1.6, lobes: 22, nbCourbes: 10, couleur: "var(--guilloche)", epaisseur: 0.14 })}
        </svg>
      </div>
      <div class="contenu">
        <div class="entete">
          <span class="etiquette">${esc(P.titre)} · Passport</span>
          <span class="pays">${esc(P.emetteur)}</span>
        </div>
        <div class="donnees">
          <div class="photo">${monogramme()}<span class="etiquette">Titulaires</span></div>
          <div class="champs">
            ${champ("Type", "P")}
            ${champ("Code", esc(zoneLecture()[0].slice(2, 5)))}
            ${champ("N° de passeport", esc(P.numero), "large")}
            ${champ("Titulaires", `${esc(I.mariee)} &amp; ${esc(I.marie)}`, "large titulaires")}
            ${champ("Nationalité", esc(P.nationalite))}
            ${champ("Destination", esc(I.arrivee.ville))}
            ${champ("Délivré le", esc(principale.dateCourte))}
            ${champ("Validité", esc(P.validite))}
          </div>
        </div>
        <div class="signature-bloc">
          <div class="etiquette">Signature des titulaires</div>
          <div class="signature texte-degrade">${esc(I.mariee)} &amp; ${esc(I.marie)}</div>
        </div>
        <div class="observations">
          <div class="etiquette">Observations</div>
          <p>« ${esc(I.devise)} »</p>
          <p>${esc(I.deviseSource)}</p>
        </div>
      </div>
      <div class="mrz"><p>${esc(mrz1)}</p><p>${esc(mrz2)}</p></div>
    </div>
  </section>`;

  return exterieur + interieur;
}
