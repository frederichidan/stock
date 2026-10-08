/* Génère, pour chaque version de couleurs (themes.js), les fichiers prêts à imprimer
   ou à partager dans export/<version>/ :
   - un PDF par document (vectoriel, format exact, fond compris) pour l'imprimeur ;
   - une image JPG par face en 8K : 7680 pixels sur le grand côté.
   Puis export/nuancier.jpg (toutes les versions côte à côte), en 8K également.

   Utilisation :
     npm install playwright
     npx playwright install chromium
     node exporter.js
*/
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const THEMES = require("./themes.js");

const DOSSIER = __dirname;
const SORTIE = path.join(DOSSIER, "export");
const HUIT_K = 7680;
const QUALITE_JPG = 90;

// Chaque image : [nom du fichier, sélecteur CSS, rang de l'élément].
const DOCUMENTS = [
  {
    source: "pochette-passeport.html",
    pdf: "pochette-passeport.pdf",
    images: [
      ["passeport-exterieur", ".page", 0],
      ["passeport-interieur", ".page", 1],
      ["passeport-couverture", ".couverture", 0],
    ],
  },
  {
    source: "billet-invitation.html",
    pdf: "billet-invitation.pdf",
    images: [
      ["billet-recto", ".page", 0],
      ["billet-verso", ".page", 1],
    ],
  },
  {
    source: "carte-menu.html",
    pdf: "carte-menu.pdf",
    images: [
      ["menu-recto", ".page", 0],
      ["menu-verso", ".page", 1],
    ],
  },
];

const adresse = (fichier, theme) => `file://${path.join(DOSSIER, fichier)}${theme ? `?theme=${theme}` : ""}`;

async function charger(page, url) {
  await page.goto(url);
  await page.evaluate(() => document.fonts.ready);
}

// Agrandit la page (zoom CSS, donc rendu vectoriel net) pour que le grand côté de l'élément
// mesure exactement 7680 pixels, puis capture l'élément seul, sans le fond autour.
async function capturer8K(navigateur, url, selecteur, rang, fichier) {
  const page = await navigateur.newPage({ viewport: { width: 1200, height: 1000 } });
  await charger(page, url);
  const zone = await page.evaluate(
    ({ selecteur, rang, cible }) => {
      const element = document.querySelectorAll(selecteur)[rang];
      const feuille = element.closest(".page");
      document.querySelectorAll(".page").forEach((p) => p !== feuille && (p.style.display = "none"));
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

(async () => {
  const navigateur = await chromium.launch();
  const mesure = await navigateur.newPage();

  for (const theme of Object.keys(THEMES)) {
    const dossierTheme = path.join(SORTIE, theme);
    fs.mkdirSync(dossierTheme, { recursive: true });

    for (const doc of DOCUMENTS) {
      const url = adresse(doc.source, theme);
      await charger(mesure, url);
      await mesure.pdf({ path: path.join(dossierTheme, doc.pdf), preferCSSPageSize: true, printBackground: true });
      console.log("✓", `${theme}/${doc.pdf}`);

      for (const [nom, selecteur, rang] of doc.images) {
        await capturer8K(navigateur, url, selecteur, rang, path.join(dossierTheme, `${nom}.jpg`));
        console.log("✓", `${theme}/${nom}.jpg`);
      }
    }
  }

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

  await navigateur.close();
})();
