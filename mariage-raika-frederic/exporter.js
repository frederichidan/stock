/* Génère les fichiers prêts à imprimer / à partager dans le dossier export/ :
   - un PDF par document (format exact, fond compris) pour l'imprimeur ;
   - une image JPG par face, en 300 dpi, pour WhatsApp ou les réseaux.

   Utilisation :
     npm install playwright
     npx playwright install chromium
     node exporter.js
*/
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const DOSSIER = __dirname;
const SORTIE = path.join(DOSSIER, "export");

const DOCUMENTS = [
  { source: "billet-invitation.html", pdf: "billet-invitation.pdf", faces: ["billet-recto", "billet-verso"] },
  { source: "carte-menu.html", pdf: "carte-menu.pdf", faces: ["menu-recto", "menu-verso"] },
];

(async () => {
  fs.mkdirSync(SORTIE, { recursive: true });
  const navigateur = await chromium.launch();
  const page = await navigateur.newPage({ deviceScaleFactor: 300 / 96 });

  for (const doc of DOCUMENTS) {
    await page.goto("file://" + path.join(DOSSIER, doc.source));
    await page.evaluate(() => document.fonts.ready);

    await page.pdf({ path: path.join(SORTIE, doc.pdf), preferCSSPageSize: true, printBackground: true });
    console.log("✓", doc.pdf);

    const faces = await page.$$(".page");
    for (let i = 0; i < faces.length && i < doc.faces.length; i += 1) {
      const fichier = `${doc.faces[i]}.jpg`;
      await faces[i].screenshot({ path: path.join(SORTIE, fichier), type: "jpeg", quality: 92 });
      console.log("✓", fichier);
    }
  }

  await navigateur.close();
})();
