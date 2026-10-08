/* Génère, pour chaque thème de couleurs (themes.js), les fichiers prêts à imprimer
   ou à partager dans export/<thème>/ :
   - un PDF par document (format exact, fond compris) pour l'imprimeur ;
   - une image JPG par face, en 300 dpi, pour WhatsApp ou les réseaux.
   Puis export/nuancier.jpg, qui montre toutes les versions côte à côte.

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

const DOCUMENTS = [
  { source: "billet-invitation.html", pdf: "billet-invitation.pdf", faces: ["billet-recto", "billet-verso"] },
  { source: "carte-menu.html", pdf: "carte-menu.pdf", faces: ["menu-recto", "menu-verso"] },
];

const adresse = (fichier, theme) => `file://${path.join(DOSSIER, fichier)}${theme ? `?theme=${theme}` : ""}`;

(async () => {
  const navigateur = await chromium.launch();
  const page = await navigateur.newPage({ deviceScaleFactor: 300 / 96 });

  for (const theme of Object.keys(THEMES)) {
    const dossierTheme = path.join(SORTIE, theme);
    fs.mkdirSync(dossierTheme, { recursive: true });

    for (const doc of DOCUMENTS) {
      await page.goto(adresse(doc.source, theme));
      await page.evaluate(() => document.fonts.ready);

      await page.pdf({ path: path.join(dossierTheme, doc.pdf), preferCSSPageSize: true, printBackground: true });
      console.log("✓", `${theme}/${doc.pdf}`);

      const faces = await page.$$(".page");
      for (let i = 0; i < faces.length && i < doc.faces.length; i += 1) {
        const fichier = `${doc.faces[i]}.jpg`;
        await faces[i].screenshot({ path: path.join(dossierTheme, fichier), type: "jpeg", quality: 90 });
        console.log("✓", `${theme}/${fichier}`);
      }
    }
  }

  const apercu = await navigateur.newPage({ viewport: { width: 1800, height: 1000 }, deviceScaleFactor: 1.5 });
  await apercu.goto(adresse("nuancier.html"));
  await apercu.evaluate(() => Promise.all([document.fonts.ready, ...[...document.images].map((img) => img.decode())]));
  await apercu.screenshot({ path: path.join(SORTIE, "nuancier.jpg"), type: "jpeg", quality: 88, fullPage: true });
  console.log("✓ nuancier.jpg");

  await navigateur.close();
})();
