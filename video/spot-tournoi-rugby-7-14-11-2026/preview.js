// Aperçu : images fixes à des instants donnés (node preview.js [v] t1 t2 …) -> planche contact
const { chromium } = require(process.env.PW);
(async () => {
  let args = process.argv.slice(2), V = args[0] === 'v';
  if (V) args = args.slice(1);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: V ? { width: 1080, height: 1920 } : { width: 1920, height: 1080 }, deviceScaleFactor: 0.5 });
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('file://' + process.cwd() + '/spot.html' + (V ? '#v' : ''));
  await p.evaluate(() => window.ready());
  for (const t of args.map(Number)) {
    await p.evaluate(t => window.seek(t), t);
    await p.screenshot({ path: `/tmp/claude-0/-home-user-stock/2c848500-632c-57ad-a189-948f6b56bf1c/scratchpad/tv${V ? 'v' : 'h'}_${t.toFixed(2)}.png` });
  }
  await b.close();
})();
