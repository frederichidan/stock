const { chromium } = require(process.env.PW);
const fs = require('fs');
// usage: node crest.js <svg> <outbase> <bg|transparent> <widthpx>
const [svgf, out, bg, W] = process.argv.slice(2);
(async () => {
  const svg = fs.readFileSync(svgf, 'utf8').replace(/width="400" height="480"/, 'width="100%" height="100%"');
  const w = +W, h = Math.round(w * 1.2);
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><link href="fonts/fonts.css" rel="stylesheet">
  <style>@page{size:${w}px ${h}px;margin:0}html,body{margin:0;width:${w}px;height:${h}px;background:${bg}}div{width:${w}px;height:${h}px}</style></head>
  <body><div>${svg}</div></body></html>`;
  fs.writeFileSync('_tmp.html', html);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto('file://' + process.cwd() + '/_tmp.html', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: out + '.png', omitBackground: bg === 'transparent' });
  if (process.env.PDF) await p.pdf({ path: out + '.pdf', preferCSSPageSize: true, printBackground: true });
  await b.close(); fs.unlinkSync('_tmp.html');
})();
