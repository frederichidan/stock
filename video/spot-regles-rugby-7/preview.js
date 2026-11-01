// Aperçu : une image vers la fin de chaque plan -> planche contact (scratchpad)
const { chromium } = require(process.env.PW);
const OUT = '/tmp/claude-0/-home-user-stock/2c848500-632c-57ad-a189-948f6b56bf1c/scratchpad/regles';
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 0.5 });
  p.on('pageerror', e => console.log('ERR', e.message));
  p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') console.log('CONSOLE', m.text()); });
  await p.goto('file://' + process.cwd() + '/spot.html');
  await p.evaluate(() => window.ready());
  const info = await p.evaluate(() => ({ dur: window.DUR, times: window.TIMES }));
  console.log('DUR', info.dur);
  const extra = process.argv.slice(2).map(Number);
  const shots = extra.length ? extra : [3.5, ...info.times.map(([k, at], i) => { const next = i + 1 < info.times.length ? info.times[i + 1][1] : info.dur - 8; return next - .6; }), info.dur - 2];
  require('fs').mkdirSync(OUT, { recursive: true });
  for (const t of shots) {
    await p.evaluate(t => window.seek(t), t);
    await p.screenshot({ path: `${OUT}/f_${t.toFixed(2).padStart(7, '0')}.png` });
  }
  await b.close();
  console.log(shots.join(' '));
})();
