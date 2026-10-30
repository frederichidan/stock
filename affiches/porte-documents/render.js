// Porte-documents : PDF (446 x 416 mm, fond perdu inclus) + PNG 8K (grand côté 7680 px) par face
const { chromium } = require(process.env.PW);
const views = (process.argv[2] || 'ext,int,gabarit').split(',');
const scale = +(process.argv[3] || 0);   // 0 = 8K
(async () => {
  const b = await chromium.launch();
  const w = Math.round(446 * 96 / 25.4), h = Math.round(416 * 96 / 25.4);
  for (const v of views) {
    const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: scale || 7680 / w });
    await p.goto('file://' + process.cwd() + '/porte-documents.html?vue=' + v, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
    await p.screenshot({ path: scale ? `/tmp/claude-0/-home-user-stock/2c848500-632c-57ad-a189-948f6b56bf1c/scratchpad/pd_${v}.png` : `porte-documents-${v}-8k.png` });
    if (!scale) await p.pdf({ path: `porte-documents-${v}.pdf`, preferCSSPageSize: true, printBackground: true });
    await p.close();
  }
  await b.close();
})();
