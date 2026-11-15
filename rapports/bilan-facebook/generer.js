// Bilan Facebook du RCA en PDF (A4, 2 pages) à partir d'un fichier de données JSON.
// Usage : node generer.js donnees.json [sortie.pdf]
// Format de donnees.json : voir LISEZMOI.md. Sortie par défaut : pdf/bilan-facebook-rca-<fin de période>.pdf
const path = require('path');
const fs = require('fs');
const { chromium } = require(process.env.PW || 'playwright');

(async () => {
  const src = process.argv[2];
  if (!src) { console.error('usage : node generer.js donnees.json [sortie.pdf]'); process.exit(1); }
  const donnees = JSON.parse(fs.readFileSync(src, 'utf8'));
  const fin = donnees.periode?.fin || (donnees.jours || []).map((j) => j.date).sort().pop();
  const out = process.argv[3] || path.join(__dirname, 'pdf', `bilan-facebook-rca-${fin}.pdf`);
  const b = await chromium.launch();
  const p = await b.newPage();
  p.on('pageerror', (e) => { console.error('ERREUR', e.message); process.exitCode = 1; });
  await p.addInitScript((d) => { window.DONNEES = d; }, donnees);
  await p.goto('file://' + path.join(__dirname, 'rapport.html'), { waitUntil: 'networkidle' });
  await p.waitForSelector('body[data-pret]', { timeout: 15000 });
  await p.evaluate(() => document.fonts.ready);
  // contrôle : rien ne doit déborder d'une page A4
  const deborde = await p.evaluate(() => [...document.querySelectorAll('.page')].map((pg, i) => {
    const r = pg.getBoundingClientRect();
    return [...pg.querySelectorAll('.sec, .kpis, .lede')].filter((e) => e.getBoundingClientRect().bottom > r.bottom - 14 * 3.78).map((e) => `page ${i + 1} : ${e.className}`);
  }).flat());
  if (deborde.length) console.error('ATTENTION débordement :', deborde.join(', '));
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await p.pdf({ path: out, width: '210mm', height: '297mm', printBackground: true });
  await b.close();
  console.log(out);
})();
