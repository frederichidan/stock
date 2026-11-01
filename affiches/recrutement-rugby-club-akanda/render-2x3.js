const { chromium } = require(process.env.PW);
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 720, height: 1080 }, deviceScaleFactor: 3 });
  await p.goto('file://' + process.cwd() + '/affiche-2x3.html', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.pdf({ path: 'affiche-2x3.pdf', preferCSSPageSize: true, printBackground: true });
  await p.addStyleTag({ content: 'html{zoom:' + (720 / (200 * 96 / 25.4)) + '}' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: 'affiche-2x3.png' });
  await b.close();
})();
