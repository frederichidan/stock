// Fiches postes : PDF A4 (8 pages, vectoriel) + PNG 300 dpi par fiche (2480 x 3508)
const { chromium } = require(process.env.PW);
const NOMS = ['0-les-7-postes', '1-pilier-gauche', '2-talonneur', '3-pilier-droit', '4-demi-de-melee', '5-demi-d-ouverture', '6-centre', '7-ailier'];
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 2480 / 793.7 });
  await p.goto('file://' + process.cwd() + '/fiches.html');
  await p.evaluate(() => window.ready());
  await p.pdf({ path: 'fiches-postes-rugby-a-7.pdf', width: '210mm', height: '297mm', printBackground: true });
  const pages = await p.$$('.page');
  for (let i = 0; i < pages.length; i++) await pages[i].screenshot({ path: `fiche-${NOMS[i]}.png` });
  await b.close();
})();
