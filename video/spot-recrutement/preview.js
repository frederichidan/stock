// Aperçu : images fixes à des instants donnés -> planche contact
const { chromium } = require(process.env.PW);
(async () => {
  const times = process.argv.slice(2).map(Number);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 0.5 });
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('file://' + process.cwd() + '/spot.html');
  await p.evaluate(() => window.ready());
  for (const t of times) {
    await p.evaluate(t => window.seek(t), t);
    await p.screenshot({ path: `/tmp/claude-0/-home-user-stock/2c848500-632c-57ad-a189-948f6b56bf1c/scratchpad/pv_${t.toFixed(2)}.png` });
  }
  await b.close();
})();
