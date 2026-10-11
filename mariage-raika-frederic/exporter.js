/* Génère, pour la version choisie dans infos.js (ou les 4 avec --toutes), un dossier par
   élément dans export/<version>/ :
   - <élément>-A4-8k.pdf          : À IMPRIMER. Planche A4 (3 billets, 3 menus ou 2 pochettes
                                    par feuille), fond perdu 3 mm, traits de coupe ; page 1 =
                                    rectos, page 2 = versos, recto verso bord long. Chaque
                                    exemplaire est une image 8K (≈ 1 000 dpi). Étiquettes de
                                    bouteilles : 4 (vin) ou 3 (eau) par feuille, à taille
                                    réelle, une seule page (recto seul). Cartes de table :
                                    une feuille A4 par table, en chevalet (recto seul, pliée
                                    en deux), en PDF de 10 tables (…-A4-8k-tables-01-a-10.pdf…) ;
   - <élément>-A4-vectoriel.pdf   : la même planche en vectoriel (fichier léger, net à toute taille) ;
   - <élément>-maquette-8k.jpg    : mise en scène réaliste, 7680 × 4320 ;
   - <élément>-maquette-8k.pdf    : la même image sur A4 paysage, centrée avec 10 mm de marge ;
   - <élément>-<face>-8k.jpg      : chaque face à plat, 7680 px sur le grand côté.
   S'y ajoute export/<version>/ensemble-maquette-8k.jpg / .pdf (les trois supports réunis),
   et avec --toutes, export/nuancier.jpg (comparatif des 4 versions).

   Utilisation :
     npm install
     npx playwright install chromium
     node exporter.js            → la version choisie dans infos.js (theme)
     node exporter.js --toutes   → les 4 versions et le nuancier
     node exporter.js --seulement=etiquette-vin,etiquette-eau   → ces éléments seulement
*/
const fs = require("fs");
const os = require("os");
const path = require("path");
const { pathToFileURL } = require("url");
const { chromium } = require("playwright");
const { PDFDocument, PrintScaling, Duplex } = require("pdf-lib");
const THEMES = require("./themes.js");
const INFOS = new Function(`${fs.readFileSync(path.join(__dirname, "infos.js"), "utf8")}; return INFOS;`)();
const TOUTES = process.argv.includes("--toutes");
const SEULEMENT = (process.argv.find((a) => a.startsWith("--seulement=")) || "").slice("--seulement=".length).split(",").filter(Boolean);

const DOSSIER = __dirname;
const SORTIE = path.join(DOSSIER, "export");
const HUIT_K = 7680;
const QUALITE_JPG = 90;
const QUALITE_IMPRESSION = 95;
const FORMAT_MAQUETTE_PDF = [297, 210]; // mm : A4 paysage
const A4_PT = [595.276, 841.89];
const MARGE_MAQUETTE_PDF = 10; // mm de blanc autour de l'image, dans la zone imprimable
const TEMPORAIRE = fs.mkdtempSync(path.join(os.tmpdir(), "mariage-8k-"));

// Chaque image à plat : [nom de la face, sélecteur CSS, rang de l'élément].
// `rectoVerso: false` : une seule face à imprimer (étiquettes de bouteilles).
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
    dossier: "cartes-tables",
    page: "cartes-tables.html",
    maquette: "tables",
    chevalets: true,
    parPdf: 10,
    faces: [],
  },
];

const adresse = (fichier, parametres = {}) => {
  const requete = new URLSearchParams(parametres).toString();
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
async function capturer8K(navigateur, url, selecteur, rang, fichier, signal, qualite = QUALITE_JPG) {
  const page = await navigateur.newPage({ viewport: { width: 1200, height: 1000 } });
  await charger(page, url, signal);
  const zone = await page.evaluate(
    ({ selecteur, rang, cible }) => {
      const element = document.querySelectorAll(selecteur)[rang];
      const feuille = element.closest(".page, .feuille") || element;
      document.querySelectorAll("#planches > *").forEach((p) => p !== feuille && (p.style.display = "none"));
      document.body.style.padding = "0";
      Object.assign(feuille.style, { margin: "0", boxShadow: "none" });
      const avant = element.getBoundingClientRect();
      feuille.style.zoom = cible / Math.max(avant.width, avant.height);
      const { x, y, width, height } = element.getBoundingClientRect();
      return { x, y, width, height };
    },
    { selecteur, rang, cible: HUIT_K },
  );
  await page.setViewportSize({ width: Math.ceil(zone.x + zone.width), height: Math.ceil(zone.y + zone.height) });
  await page.evaluate(() => document.fonts.ready);
  const clip = { x: Math.round(zone.x), y: Math.round(zone.y), width: Math.floor(zone.width + 0.01), height: Math.floor(zone.height + 0.01) };
  await page.screenshot({ path: fichier, type: "jpeg", quality: qualite, clip });
  await page.close();
}

// PDF d'une page par image (maquettes, avec une marge blanche ; feuilles A4 des cartes de table,
// sans marge) : l'image centrée sur la page.
// La page (100vw × 100vh) suit le format que Chromium arrondit ; la marge absorbe cet arrondi.
async function pdfDepuisImages(navigateur, [largeur, hauteur], marge, images, fichier, rectoVerso = null) {
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
  await finaliserPdf(fichier, { rectoVerso });
}

// Cartes de table en chevalet : chaque feuille A4 en image 8K (7680 px de haut), réunies par
// `parPdf` dans des PDF A4 à imprimer en recto seul ; et toutes les feuilles en vectoriel.
async function chevalets8K(navigateur, element, nom, afficher) {
  const images = [];
  for (let i = 0; i < INFOS.tables.length; i += 1) {
    const image = path.join(TEMPORAIRE, `${element.dossier}-${i}.jpg`);
    await capturer8K(navigateur, adresse(element.page, { table: i + 1 }), ".page", 0, image, "pagesPretes", QUALITE_IMPRESSION);
    images.push(image);
  }
  const deux = (n) => String(n).padStart(2, "0");
  for (let k = 0; k < images.length; k += element.parPdf) {
    const lot = images.slice(k, k + element.parPdf);
    const suffixe = `A4-8k-tables-${deux(k + 1)}-a-${deux(k + lot.length)}.pdf`;
    await pdfDepuisImages(navigateur, [210, 297], 0, lot, nom(suffixe), false);
    afficher(suffixe);
  }
  const page = await navigateur.newPage();
  await charger(page, adresse(element.page, { pdf: 1 }), "pagesPretes");
  await page.pdf({ path: nom("A4-vectoriel.pdf"), preferCSSPageSize: true, printBackground: true });
  await page.close();
  await finaliserPdf(nom("A4-vectoriel.pdf"), { rectoVerso: false });
  afficher("A4-vectoriel.pdf");
}

// Chromium arrondit le format de page (594,96 × 841,92 pt au lieu de 595,28 × 841,89) : on
// rétablit l'A4 exact, centré sur le contenu, et l'on demande aux lecteurs PDF (Acrobat, Chrome,
// Edge…) d'imprimer à 100 %, sur le bac A4, en recto verso bord long pour les planches à deux
// faces et en recto seul pour les étiquettes et les cartes de table (`rectoVerso` : true,
// false, ou null = sans avis).
async function finaliserPdf(fichier, { rectoVerso }) {
  const document = await PDFDocument.load(fs.readFileSync(fichier), { updateMetadata: false });
  for (const page of document.getPages()) {
    const { width, height } = page.getMediaBox();
    const [largeur, hauteur] = width > height ? [A4_PT[1], A4_PT[0]] : A4_PT;
    page.setMediaBox((width - largeur) / 2, (height - hauteur) / 2, largeur, hauteur);
  }
  const preferences = document.catalog.getOrCreateViewerPreferences();
  preferences.setPrintScaling(PrintScaling.None);
  preferences.setPickTrayByPDFSize(true);
  if (rectoVerso === true) preferences.setDuplex(Duplex.DuplexFlipLongEdge);
  if (rectoVerso === false) preferences.setDuplex(Duplex.Simplex);
  fs.writeFileSync(fichier, await document.save({ updateFieldAppearances: false }));
}

// Illustrations 8K de chaque face, fond perdu compris, à l'endroit, capturées depuis
// impression.html en mode capture (une face par feuille, à taille réelle).
async function illustrations8K(navigateur, element, theme) {
  const url = adresse("impression.html", { doc: element.impression, theme, capture: 1, ...element.parametres });
  const images = [];
  for (let i = 0; i < (element.rectoVerso === false ? 1 : 2); i += 1) {
    const image = path.join(TEMPORAIRE, `${element.dossier}-${theme}-${i}.jpg`);
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
  const themes = TOUTES ? Object.keys(THEMES) : [INFOS.theme in THEMES ? INFOS.theme : "violet"];

  for (const theme of themes) {
    for (const element of ELEMENTS.filter((e) => !SEULEMENT.length || SEULEMENT.includes(e.dossier))) {
      const dossier = path.join(SORTIE, theme, element.dossier);
      fs.mkdirSync(dossier, { recursive: true });
      const nom = (suffixe) => path.join(dossier, `${element.dossier}-${suffixe}`);
      const afficher = (suffixe) => console.log("✓", `${theme}/${element.dossier}/${element.dossier}-${suffixe}`);

      if (element.chevalets) {
        await chevalets8K(navigateur, element, nom, afficher);
      } else {
        const illustrations = await illustrations8K(navigateur, element, theme);
        await pdfA4(navigateur, element, theme, illustrations, nom("A4-8k.pdf"));
        afficher("A4-8k.pdf");
        await pdfA4(navigateur, element, theme, null, nom("A4-vectoriel.pdf"));
        afficher("A4-vectoriel.pdf");
      }

      await capturer8K(navigateur, adresse("maquettes.html", { scene: element.maquette, theme }), ".scene", 0, nom("maquette-8k.jpg"), "maquettePrete");
      afficher("maquette-8k.jpg");
      await pdfDepuisImages(navigateur, FORMAT_MAQUETTE_PDF, MARGE_MAQUETTE_PDF, [nom("maquette-8k.jpg")], nom("maquette-8k.pdf"));
      afficher("maquette-8k.pdf");

      for (const [face, selecteur, rang] of element.faces) {
        await capturer8K(navigateur, adresse(element.page, { theme, ...element.parametres }), selecteur, rang, nom(`${face}-8k.jpg`));
        afficher(`${face}-8k.jpg`);
      }
    }

    if (SEULEMENT.length && !SEULEMENT.includes("ensemble")) continue;
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
