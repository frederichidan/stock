/* Génère, pour la version choisie dans infos.js (ou les 4 avec --toutes), un dossier par
   élément dans export/<version>/ :
   - <élément>-maquette-8k.jpg       : mise en scène réaliste, 7680 × 4320 ;
   - <élément>-imprimeur.pdf         : fond perdu 3 mm + traits de coupe (impression.html) ;
   - <élément>-format-fini.pdf       : au format exact, sans fond perdu ;
   - <élément>-<face>-8k.jpg         : chaque face à plat, 7680 px sur le grand côté.
   Les deux PDF sont prêts pour un recto verso avec retournement sur le bord long
   (intérieur de la pochette tête-bêche) et leurs textes dorés sont vectorisés.
   S'y ajoute export/<version>/ensemble-maquette-8k.jpg (tous les supports ensemble),
   et avec --toutes, export/nuancier.jpg (comparatif des 4 versions).

   Utilisation :
     npm install playwright
     npx playwright install chromium
     node exporter.js            → la version choisie dans infos.js (theme)
     node exporter.js --toutes   → les 4 versions et le nuancier
*/
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const THEMES = require("./themes.js");
const INFOS = new Function(`${fs.readFileSync(path.join(__dirname, "infos.js"), "utf8")}; return INFOS;`)();
const TOUTES = process.argv.includes("--toutes");

const DOSSIER = __dirname;
const SORTIE = path.join(DOSSIER, "export");
const HUIT_K = 7680;
const QUALITE_JPG = 90;

// Chaque image à plat : [nom de la face, sélecteur CSS, rang de l'élément].
const ELEMENTS = [
  {
    dossier: "pochette-passeport",
    page: "pochette-passeport.html",
    impression: "passeport",
    maquette: "pochette",
    teteBeche: [1], // faces tournées de 180° dans le PDF format fini (recto verso bord long)
    faces: [
      ["exterieur", ".page", 0],
      ["interieur", ".page", 1],
      ["couverture", ".couverture", 0],
    ],
  },
  {
    dossier: "billet-invitation",
    page: "billet-invitation.html",
    impression: "billet",
    maquette: "billet",
    teteBeche: [],
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
    teteBeche: [],
    faces: [
      ["recto", ".page", 0],
      ["verso", ".page", 1],
    ],
  },
];

const adresse = (fichier, parametres = {}) => {
  const requete = new URLSearchParams(parametres).toString();
  return `file://${path.join(DOSSIER, fichier)}${requete ? `?${requete}` : ""}`;
};

async function charger(page, url, signal) {
  await page.goto(url);
  await page.evaluate(() => document.fonts.ready);
  if (signal) await page.waitForFunction((nom) => window[nom] === true, signal, { timeout: 60000 });
}

// Agrandit l'élément (zoom CSS, donc rendu vectoriel net) pour que son grand côté mesure
// exactement 7680 pixels, puis le capture seul, sans le fond autour.
async function capturer8K(navigateur, url, selecteur, rang, fichier, signal) {
  const page = await navigateur.newPage({ viewport: { width: 1200, height: 1000 } });
  await charger(page, url, signal);
  const zone = await page.evaluate(
    ({ selecteur, rang, cible }) => {
      const element = document.querySelectorAll(selecteur)[rang];
      const feuille = element.closest(".page") || element;
      document.querySelectorAll("#planches > .page").forEach((p) => p !== feuille && (p.style.display = "none"));
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
  await page.screenshot({ path: fichier, type: "jpeg", quality: QUALITE_JPG, clip });
  await page.close();
}

async function pdfFormatFini(navigateur, element, theme, fichier) {
  const page = await navigateur.newPage();
  await charger(page, adresse(element.page, { theme }));
  await page.evaluate((teteBeche) => {
    vectoriserDegrades(document);
    const pages = document.querySelectorAll("#planches > .page");
    teteBeche.forEach((i) => (pages[i].style.transform = "rotate(180deg)"));
  }, element.teteBeche);
  await page.pdf({ path: fichier, preferCSSPageSize: true, printBackground: true });
  await page.close();
}

async function pdfImprimeur(navigateur, element, theme, fichier) {
  const page = await navigateur.newPage();
  await charger(page, adresse("impression.html", { doc: element.impression, theme }), "planchesPretes");
  await page.pdf({ path: fichier, preferCSSPageSize: true, printBackground: true });
  await page.close();
}

(async () => {
  const navigateur = await chromium.launch();
  const themes = TOUTES ? Object.keys(THEMES) : [INFOS.theme in THEMES ? INFOS.theme : "violet"];

  for (const theme of themes) {
    for (const element of ELEMENTS) {
      const dossier = path.join(SORTIE, theme, element.dossier);
      fs.mkdirSync(dossier, { recursive: true });
      const nom = (suffixe) => path.join(dossier, `${element.dossier}-${suffixe}`);
      const afficher = (suffixe) => console.log("✓", `${theme}/${element.dossier}/${element.dossier}-${suffixe}`);

      await capturer8K(navigateur, adresse("maquettes.html", { scene: element.maquette, theme }), ".scene", 0, nom("maquette-8k.jpg"), "maquettePrete");
      afficher("maquette-8k.jpg");
      await pdfImprimeur(navigateur, element, theme, nom("imprimeur.pdf"));
      afficher("imprimeur.pdf");
      await pdfFormatFini(navigateur, element, theme, nom("format-fini.pdf"));
      afficher("format-fini.pdf");
      for (const [face, selecteur, rang] of element.faces) {
        await capturer8K(navigateur, adresse(element.page, { theme }), selecteur, rang, nom(`${face}-8k.jpg`));
        afficher(`${face}-8k.jpg`);
      }
    }
    const ensemble = path.join(SORTIE, theme, "ensemble-maquette-8k.jpg");
    await capturer8K(navigateur, adresse("maquettes.html", { scene: "ensemble", theme }), ".scene", 0, ensemble, "maquettePrete");
    console.log("✓", `${theme}/ensemble-maquette-8k.jpg`);
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
})();
