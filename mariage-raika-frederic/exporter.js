/* Génère, pour la version choisie dans infos.js (ou les 4 avec --toutes), un dossier par
   élément dans export/<version>/ :
   - <élément>-A4-8k.pdf          : À IMPRIMER. Planche A4 (3 billets, 3 menus ou 2 pochettes
                                    par feuille), fond perdu 3 mm, traits de coupe ; page 1 =
                                    rectos, page 2 = versos, recto verso bord long. Fond et
                                    dessins de chaque exemplaire en image 8K (≈ 1 000 dpi),
                                    textes en vectoriel par-dessus. Étiquettes de
                                    bouteilles : 4 (vin) ou 3 (eau) par feuille, à taille
                                    réelle, une seule page (recto seul). Cartes de table :
                                    une feuille A4 par table, en chevalet (recto seul, pliée
                                    en deux), en PDF de 10 tables (…-A4-8k-tables-01-a-10.pdf…).
                                    Affiches : deux affiches A5 par feuille A4 paysage (recto
                                    seul, sans fond perdu, repères de coupe au milieu), et
                                    affiches-A5-8k.pdf, une affiche par page A5. Invitation à
                                    la demande en mariage : quatre cartes A6 par feuille A4
                                    (recto seul, sans fond perdu, repères de coupe), et
                                    invitation-demande-A6-8k.pdf, une carte par page A6 ;
   - <élément>-A4-vectoriel.pdf   : la même planche en vectoriel (fichier léger, net à toute taille)
                                    (affiches et invitation : aussi …-A5- / …-A6-vectoriel.pdf) ;
   - <élément>-maquette-8k.jpg    : mise en scène réaliste, 7680 × 4320 (pas pour l'invitation) ;
   - <élément>-maquette-8k.pdf    : la même image sur A4 paysage, centrée avec 10 mm de marge ;
   - <élément>-<face>-8k.jpg      : chaque face à plat, 7680 px sur le grand côté (affiches : une
                                    par nom) ;
   - whatsapp/                    : affiches et invitation, chaque face (et la maquette) en 2048 px.
   La pochette existe en deux versions : pochette-passeport/ (extérieur améthyste) et
   pochette-passeport-violet-royal/ (extérieur violet royal), au même intérieur.
   S'y ajoute export/<version>/ensemble-maquette-8k.jpg / .pdf (les trois supports réunis),
   et avec --toutes, export/nuancier.jpg (comparatif des 4 versions).

   Utilisation :
     npm install
     npx playwright install chromium
     node exporter.js            → la version choisie dans infos.js (theme)
     node exporter.js --toutes   → les 4 versions et le nuancier
     node exporter.js --seulement=etiquette-vin,etiquette-eau   → ces éléments seulement
     node exporter.js --xerox-b7035  → édition noir et blanc pour imprimante laser monochrome
                                       (Xerox VersaLink B7035), dans export/xerox-b7035/ : textes,
                                       filets et ornements en noir plein, fonds blancs (commun.css,
                                       « Noir et blanc ») ; illustrations 8K sans perte (PNG) ; PDF
                                       convertis en niveaux de gris par Ghostscript (gs) s'il est
                                       installé ; ni maquettes ni faces à plat ; une seule pochette
                                       (en noir, ses deux versions sont presque identiques).
*/
const fs = require("fs");
const os = require("os");
const path = require("path");
const { pathToFileURL } = require("url");
const { execFileSync } = require("child_process");
const { chromium } = require("playwright");
const { PDFDocument, PrintScaling, Duplex } = require("pdf-lib");
const THEMES = require("./themes.js");
const INFOS = new Function(`${fs.readFileSync(path.join(__dirname, "infos.js"), "utf8")}; return INFOS;`)();
const TOUTES = process.argv.includes("--toutes");
const SEULEMENT = (process.argv.find((a) => a.startsWith("--seulement=")) || "").slice("--seulement=".length).split(",").filter(Boolean);
const NB = process.argv.includes("--xerox-b7035");

const DOSSIER = __dirname;
const SORTIE = path.join(DOSSIER, "export");
const HUIT_K = 7680;
const QUALITE_JPG = 90;
const QUALITE_IMPRESSION = 95;
// Images pour WhatsApp (`whatsapp: true`) : 2048 px sur le grand côté, la taille que WhatsApp
// garde nette (qualité HD), rendues directement à cette taille (textes nets), JPEG léger.
const WHATSAPP = 2048;
const QUALITE_WHATSAPP = 88;
const FORMAT_MAQUETTE_PDF = [297, 210]; // mm : A4 paysage
const A4_PT = [595.276, 841.89];
const A5_PT = [419.528, 595.276];
const A6_PT = [297.638, 419.528];
const MARGE_MAQUETTE_PDF = 10; // mm de blanc autour de l'image, dans la zone imprimable
const TEMPORAIRE = fs.mkdtempSync(path.join(os.tmpdir(), "mariage-8k-"));

// Chaque image à plat : [nom de la face, sélecteur CSS, rang de l'élément].
// `rectoVerso: false` : une seule face à imprimer (étiquettes de bouteilles).
// `couleurSeule` : pas d'édition noir et blanc (--xerox-b7035).
// `planches` : feuilles sans fond perdu (affiches, invitation), produites par la page elle-même
// (?format=, voir preparerFeuilles dans commun.js) : [format, taille en pt, nombre de feuilles]
// pour chaque PDF ; ni planche impression.html ni, sans `maquette`, de maquette.
// `chevalets` : cartes de table, une feuille A4 entière par table (cartes-tables.html), sans
// planche ; `parPdf` feuilles par PDF 8K, pour des fichiers de moins de 30 Mo.
const ELEMENTS = [
  {
    dossier: "pochette-passeport",
    page: "pochette-passeport.html",
    impression: "passeport",
    maquette: "pochette",
    faces: [
      ["exterieur", ".page", 0],
      ["interieur", ".page", 1],
      ["couverture", ".couverture", 0],
    ],
  },
  {
    dossier: "pochette-passeport-violet-royal",
    page: "pochette-passeport.html",
    impression: "passeport",
    parametres: { exterieur: "royal" },
    maquette: "pochette-royal",
    couleurSeule: true,
    faces: [
      ["exterieur", ".page", 0],
      ["interieur", ".page", 1],
      ["couverture", ".couverture", 0],
    ],
  },
  {
    dossier: "billet-invitation-premium",
    page: "billet-invitation.html",
    impression: "billet",
    parametres: { categorie: "premium" },
    maquette: "billet",
    faces: [
      ["recto", ".page", 0],
      ["verso", ".page", 1],
    ],
  },
  {
    dossier: "billet-invitation-classique",
    page: "billet-invitation.html",
    impression: "billet",
    parametres: { categorie: "classique" },
    maquette: "billet-classique",
    faces: [
      ["recto", ".page", 0],
      ["verso", ".page", 1],
    ],
  },
  {
    dossier: "carte-menu",
    page: "carte-menu.html",
    impression: "menu",
    maquette: "menu",
    faces: [
      ["recto", ".page", 0],
      ["verso", ".page", 1],
    ],
  },
  {
    dossier: "etiquette-vin",
    page: "etiquette-vin.html",
    impression: "vin",
    maquette: "vin",
    rectoVerso: false,
    faces: [["face", ".page", 0]],
  },
  {
    dossier: "etiquette-eau",
    page: "etiquette-eau.html",
    impression: "eau",
    maquette: "eau",
    rectoVerso: false,
    faces: [["face", ".page", 0]],
  },
  {
    dossier: "affiches",
    page: "affiches.html",
    maquette: "affiches",
    affiches: true,
    planches: [["a4", A4_PT, Math.ceil(INFOS.affiches.length / 2)], ["a5", A5_PT, INFOS.affiches.length]],
    whatsapp: true,
    faces: INFOS.affiches.map((nom, i) => [nom.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-"), ".feuille", i]),
  },
  {
    dossier: "invitation-demande",
    page: "invitation-demande.html",
    planches: [["a4", A4_PT, 1], ["a6", A6_PT, 1]],
    whatsapp: true,
    faces: [["carte", ".feuille", 0]],
  },
  {
    dossier: "cartes-tables",
    page: "cartes-tables.html",
    maquette: "tables",
    chevalets: true,
    parPdf: 10,
    faces: [],
  },
];

const adresse = (fichier, parametres = {}) => {
  const requete = new URLSearchParams(NB ? { ...parametres, nb: 1 } : parametres).toString();
  return `file://${path.join(DOSSIER, fichier)}${requete ? `?${requete}` : ""}`;
};

async function charger(page, url, signal) {
  await page.goto(url);
  // Charge toutes les polices déclarées (pas seulement celles déjà demandées par la page).
  await page.evaluate(async () => {
    await Promise.all([...document.fonts].map((police) => police.load()));
    await document.fonts.ready;
  });
  if (signal) await page.waitForFunction((nom) => window[nom] === true, signal, { timeout: 60000 });
}

// Agrandit l'élément (zoom CSS, donc rendu vectoriel net) pour que son grand côté mesure
// exactement 7680 pixels, puis le capture seul, sans le fond autour.
async function capturer8K(navigateur, url, selecteur, rang, fichier, signal, qualite = QUALITE_JPG, cible = HUIT_K) {
  const page = await navigateur.newPage({ viewport: { width: 1200, height: 1000 } });
  await charger(page, url, signal);
  const zone = await page.evaluate(
    ({ selecteur, rang, cible }) => {
      const element = document.querySelectorAll(selecteur)[rang];
      const feuille = element.closest(".page, .feuille") || element;
      document.querySelectorAll("#planches > *").forEach((p) => p !== feuille && !p.contains(feuille) && (p.style.display = "none"));
      document.body.style.padding = "0";
      Object.assign(feuille.style, { margin: "0", boxShadow: "none" });
      const avant = element.getBoundingClientRect();
      feuille.style.zoom = cible / Math.max(avant.width, avant.height);
      const { x, y, width, height } = element.getBoundingClientRect();
      return { x, y, width, height };
    },
    { selecteur, rang, cible },
  );
  await page.setViewportSize({ width: Math.ceil(zone.x + zone.width), height: Math.ceil(zone.y + zone.height) });
  await page.evaluate(() => document.fonts.ready);
  const clip = { x: Math.round(zone.x), y: Math.round(zone.y), width: Math.floor(zone.width + 0.01), height: Math.floor(zone.height + 0.01) };
  await page.screenshot({ path: fichier, clip, ...(fichier.endsWith(".png") ? { type: "png" } : { type: "jpeg", quality: qualite }) });
  await page.close();
}

// PDF d'une page par image (maquettes) : l'image centrée sur la page, avec une marge blanche.
// La page (100vw × 100vh) suit le format que Chromium arrondit ; la marge absorbe cet arrondi.
async function pdfDepuisImages(navigateur, [largeur, hauteur], marge, images, fichier) {
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
    @page { size: ${largeur}mm ${hauteur}mm; margin: 0; }
    * { margin: 0; padding: 0; }
    .p { width: 100vw; height: 100vh; overflow: hidden; display: flex; align-items: center; justify-content: center; break-after: page; }
    .p:last-child { break-after: auto; }
    img { display: block; max-width: ${largeur - 2 * marge}mm; max-height: ${hauteur - 2 * marge}mm; }
  </style></head><body>
    ${images.map((image) => `<div class="p"><img src="${pathToFileURL(image).href}"></div>`).join("")}
  </body></html>`;
  const source = path.join(TEMPORAIRE, "pages.html");
  fs.writeFileSync(source, html);
  const page = await navigateur.newPage();
  await page.goto(pathToFileURL(source).href);
  // Attente du chargement (pas de decode() : refusé pour les très grandes images, et inutile,
  // le JPEG étant intégré tel quel dans le PDF).
  await page.waitForFunction(() => [...document.images].every((image) => image.complete && image.naturalWidth > 0));
  await page.pdf({ path: fichier, preferCSSPageSize: true, printBackground: true });
  await page.close();
  await finaliserPdf(fichier, { rectoVerso: null });
}

// Cartes de table en chevalet : chaque feuille A4 en image 8K (7680 px de haut, fond et dessins
// sans les textes), les textes posés par-dessus en vectoriel (cartes-tables.html?images=…),
// par `parPdf` feuilles dans des PDF A4 à imprimer en recto seul ; et toutes les feuilles en
// vectoriel.
async function chevalets8K(navigateur, element, nom, afficher) {
  const images = [];
  for (let i = 0; i < INFOS.tables.length; i += 1) {
    const image = path.join(TEMPORAIRE, `${element.dossier}-${i}.${NB ? "png" : "jpg"}`);
    await capturer8K(navigateur, adresse(element.page, { table: i + 1, capture: 1 }), ".page", 0, image, "pagesPretes", QUALITE_IMPRESSION);
    images.push(image);
  }
  const deux = (n) => String(n).padStart(2, "0");
  for (let k = 0; k < images.length; k += element.parPdf) {
    const lot = images.slice(k, k + element.parPdf);
    const suffixe = `A4-8k-tables-${deux(k + 1)}-a-${deux(k + lot.length)}.pdf`;
    const page = await navigateur.newPage();
    await charger(page, adresse(element.page, { images: JSON.stringify(lot.map((image) => pathToFileURL(image).href)), premier: k + 1 }), "pagesPretes");
    await page.pdf({ path: nom(suffixe), preferCSSPageSize: true, printBackground: true });
    await page.close();
    await finaliserPdf(nom(suffixe), { rectoVerso: false });
    afficher(suffixe);
  }
  const page = await navigateur.newPage();
  await charger(page, adresse(element.page, { pdf: 1 }), "pagesPretes");
  await page.pdf({ path: nom("A4-vectoriel.pdf"), preferCSSPageSize: true, printBackground: true });
  await page.close();
  await finaliserPdf(nom("A4-vectoriel.pdf"), { rectoVerso: false });
  afficher("A4-vectoriel.pdf");
}

// Affiches A5 (affiches.html) : planches A4 paysage de deux affiches, à couper en deux, et
// affiches A5 seules, une par page ; chaque feuille en image 8K (fond et dessins, sans les
// textes), les textes posés par-dessus en vectoriel ; et les mêmes PDF en vectoriel. Recto seul.
async function planches8K(navigateur, element, nom, afficher) {
  for (const [format, taille, feuilles] of element.planches) {
    const images = [];
    for (let i = 0; i < feuilles; i += 1) {
      const image = path.join(TEMPORAIRE, `${element.dossier}-${format}-${i}.${NB ? "png" : "jpg"}`);
      await capturer8K(navigateur, adresse(element.page, { format, capture: 1 }), ".feuille", i, image, "pagesPretes", QUALITE_IMPRESSION);
      images.push(image);
    }
    const sorties = [
      [`${format.toUpperCase()}-8k.pdf`, { format, images: JSON.stringify(images.map((image) => pathToFileURL(image).href)), premier: 1 }],
      [`${format.toUpperCase()}-vectoriel.pdf`, { format, pdf: 1 }],
    ];
    for (const [suffixe, parametres] of sorties) {
      const page = await navigateur.newPage();
      await charger(page, adresse(element.page, parametres), "pagesPretes");
      await page.pdf({ path: nom(suffixe), preferCSSPageSize: true, printBackground: true });
      await page.close();
      await finaliserPdf(nom(suffixe), { rectoVerso: false, format: taille });
      afficher(suffixe);
    }
  }
}

// Chromium arrondit le format de page (594,96 × 841,92 pt au lieu de 595,28 × 841,89) : on
// rétablit le format exact (A4, ou `format` : A5 des affiches, A6 de l'invitation), centré sur le contenu, et
// l'on demande aux lecteurs PDF (Acrobat, Chrome, Edge…) d'imprimer à 100 %, sur le bac du
// format, en recto verso bord long pour les planches à deux
// faces et en recto seul pour les étiquettes et les cartes de table (`rectoVerso` : true,
// false, ou null = sans avis).
async function finaliserPdf(fichier, { rectoVerso, format = A4_PT }) {
  if (NB) enNiveauxDeGris(fichier);
  const document = await PDFDocument.load(fs.readFileSync(fichier), { updateMetadata: false });
  for (const page of document.getPages()) {
    const { width, height } = page.getMediaBox();
    const [largeur, hauteur] = width > height ? [format[1], format[0]] : format;
    page.setMediaBox((width - largeur) / 2, (height - hauteur) / 2, largeur, hauteur);
  }
  const preferences = document.catalog.getOrCreateViewerPreferences();
  preferences.setPrintScaling(PrintScaling.None);
  preferences.setPickTrayByPDFSize(true);
  if (rectoVerso === true) preferences.setDuplex(Duplex.DuplexFlipLongEdge);
  if (rectoVerso === false) preferences.setDuplex(Duplex.Simplex);
  fs.writeFileSync(fichier, await document.save({ updateFieldAppearances: false }));
}

// Édition noir et blanc : PDF converti en niveaux de gris (DeviceGray) par Ghostscript, images
// comprises, sans perte ni réduction de résolution. Le noir des textes devient un noir pur à
// 100 % (toner seul), et l'imprimante n'a plus de conversion de couleurs à faire. Sans gs, le
// PDF reste en RVB (noir et gris neutres, convertis de même par l'imprimante).
let ghostscript = true;
function enNiveauxDeGris(fichier) {
  if (!ghostscript) return;
  const gris = `${fichier}.gris.pdf`;
  try {
    execFileSync("gs", [
      // AutoRotatePages=/None : sinon gs tourne d'office les pages dont le texte est couché ou
      // retourné (menus, versos des billets), ce qui fausserait le recto verso.
      "-q", "-dNOPAUSE", "-dBATCH", "-dSAFER", "-sDEVICE=pdfwrite", "-dCompatibilityLevel=1.7", "-dAutoRotatePages=/None",
      "-sColorConversionStrategy=Gray", "-dProcessColorModel=/DeviceGray",
      "-dAutoFilterGrayImages=false", "-dGrayImageFilter=/FlateEncode", "-dDownsampleGrayImages=false",
      "-dAutoFilterColorImages=false", "-dColorImageFilter=/FlateEncode", "-dDownsampleColorImages=false",
      "-dDownsampleMonoImages=false", "-dEmbedAllFonts=true", "-dSubsetFonts=true",
      `-sOutputFile=${gris}`, fichier,
    ]);
    fs.renameSync(gris, fichier);
  } catch (erreur) {
    ghostscript = false;
    fs.rmSync(gris, { force: true });
    console.warn("⚠ Ghostscript (gs) indisponible : PDF laissés en RVB.", erreur.message.split("\n")[0]);
  }
}

// Illustrations 8K de chaque face, fond perdu compris, à l'endroit, capturées depuis
// impression.html en mode capture (une face par feuille, à taille réelle).
async function illustrations8K(navigateur, element, theme) {
  const url = adresse("impression.html", { doc: element.impression, theme, capture: 1, ...element.parametres });
  const images = [];
  for (let i = 0; i < (element.rectoVerso === false ? 1 : 2); i += 1) {
    const image = path.join(TEMPORAIRE, `${element.dossier}-${theme}-${i}.${NB ? "png" : "jpg"}`);
    await capturer8K(navigateur, url, ".fond-perdu", i, image, "planchesPretes", QUALITE_IMPRESSION);
    images.push(image);
  }
  return images;
}

// Planche A4 : vectorielle, ou avec les illustrations 8K à la place du rendu vectoriel.
async function pdfA4(navigateur, element, theme, illustrations, fichier) {
  const parametres = { doc: element.impression, theme, ...element.parametres };
  if (illustrations) parametres.images = JSON.stringify(illustrations.map((image) => pathToFileURL(image).href));
  const page = await navigateur.newPage();
  await charger(page, adresse("impression.html", parametres), "planchesPretes");
  await page.pdf({ path: fichier, preferCSSPageSize: true, printBackground: true });
  await page.close();
  await finaliserPdf(fichier, { rectoVerso: element.rectoVerso !== false });
}

(async () => {
  const navigateur = await chromium.launch();
  const themes = TOUTES && !NB ? Object.keys(THEMES) : [INFOS.theme in THEMES ? INFOS.theme : "violet"];

  for (const theme of themes) {
    const edition = NB ? "xerox-b7035" : theme;
    for (const element of ELEMENTS.filter((e) => (!SEULEMENT.length || SEULEMENT.includes(e.dossier)) && !(NB && e.couleurSeule))) {
      const dossier = path.join(SORTIE, edition, element.dossier);
      fs.mkdirSync(dossier, { recursive: true });
      const nom = (suffixe) => path.join(dossier, `${element.dossier}-${suffixe}`);
      const afficher = (suffixe) => console.log("✓", `${edition}/${element.dossier}/${element.dossier}-${suffixe}`);

      if (element.affiches && !NB) {
        // Images nommées d'après les affiches : celles d'un nom corrigé ou retiré disparaissent.
        for (const fichier of fs.readdirSync(dossier)) {
          if (/-8k\.jpg$/.test(fichier) && !/-maquette-8k\.jpg$/.test(fichier)) fs.rmSync(path.join(dossier, fichier));
        }
        fs.rmSync(path.join(dossier, "whatsapp"), { recursive: true, force: true });
      }
      if (element.chevalets) {
        await chevalets8K(navigateur, element, nom, afficher);
      } else if (element.planches) {
        await planches8K(navigateur, element, nom, afficher);
      } else {
        const illustrations = await illustrations8K(navigateur, element, theme);
        await pdfA4(navigateur, element, theme, illustrations, nom("A4-8k.pdf"));
        afficher("A4-8k.pdf");
        await pdfA4(navigateur, element, theme, null, nom("A4-vectoriel.pdf"));
        afficher("A4-vectoriel.pdf");
      }
      if (NB) continue; // pas de maquettes ni de faces à plat en noir et blanc

      if (element.maquette) {
        await capturer8K(navigateur, adresse("maquettes.html", { scene: element.maquette, theme }), ".scene", 0, nom("maquette-8k.jpg"), "maquettePrete");
        afficher("maquette-8k.jpg");
        await pdfDepuisImages(navigateur, FORMAT_MAQUETTE_PDF, MARGE_MAQUETTE_PDF, [nom("maquette-8k.jpg")], nom("maquette-8k.pdf"));
        afficher("maquette-8k.pdf");
      }

      for (const [face, selecteur, rang] of element.faces) {
        await capturer8K(navigateur, adresse(element.page, { theme, ...element.parametres }), selecteur, rang, nom(`${face}-8k.jpg`));
        afficher(`${face}-8k.jpg`);
      }

      if (element.whatsapp) {
        // Dossier whatsapp/ : chaque face et la maquette, prêtes à partager.
        const whatsapp = path.join(dossier, "whatsapp");
        fs.mkdirSync(whatsapp, { recursive: true });
        const image = (suffixe) => path.join(whatsapp, `${element.dossier}-${suffixe}-whatsapp.jpg`);
        for (const [face, selecteur, rang] of element.faces) {
          await capturer8K(navigateur, adresse(element.page, { theme, ...element.parametres }), selecteur, rang, image(face), null, QUALITE_WHATSAPP, WHATSAPP);
        }
        if (element.maquette) await capturer8K(navigateur, adresse("maquettes.html", { scene: element.maquette, theme }), ".scene", 0, image("maquette"), "maquettePrete", QUALITE_WHATSAPP, WHATSAPP);
        console.log("✓", `${edition}/${element.dossier}/whatsapp/ (${element.faces.length + (element.maquette ? 1 : 0)} images)`);
      }
    }

    if (NB || (SEULEMENT.length && !SEULEMENT.includes("ensemble"))) continue;
    const ensemble = path.join(SORTIE, theme, "ensemble-maquette-8k.jpg");
    await capturer8K(navigateur, adresse("maquettes.html", { scene: "ensemble", theme }), ".scene", 0, ensemble, "maquettePrete");
    await pdfDepuisImages(navigateur, FORMAT_MAQUETTE_PDF, MARGE_MAQUETTE_PDF, [ensemble], ensemble.replace(/\.jpg$/, ".pdf"));
    console.log("✓", `${theme}/ensemble-maquette-8k.jpg / .pdf`);
  }

  if (TOUTES) {
    // Nuancier : la page entière, 7680 pixels sur le grand côté.
    const nuancier = await navigateur.newPage({ viewport: { width: 1200, height: 1000 } });
    await charger(nuancier, adresse("nuancier.html"));
    const taille = await nuancier.evaluate((cible) => {
      const avant = document.body.getBoundingClientRect();
      document.body.style.zoom = cible / Math.max(avant.width, avant.height);
      const { width, height } = document.body.getBoundingClientRect();
      // Le fond du nuancier s'étend à toute la fenêtre : on fixe le grand côté à 7680 pile.
      return width >= height ? { width: cible, height: Math.round(height) } : { width: Math.round(width), height: cible };
    }, HUIT_K);
    await nuancier.setViewportSize(taille);
    await nuancier.evaluate(() => document.fonts.ready);
    await nuancier.screenshot({ path: path.join(SORTIE, "nuancier.jpg"), type: "jpeg", quality: QUALITE_JPG });
    console.log("✓ nuancier.jpg");
  }

  await navigateur.close();
  fs.rmSync(TEMPORAIRE, { recursive: true, force: true });
})();
