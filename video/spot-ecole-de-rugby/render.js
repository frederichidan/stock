// Rendu 4K : 900 images (30 s x 30 i/s) capturées dans Chromium et envoyées à ffmpeg avec la musique
const { chromium } = require(process.env.PW);
const { spawn } = require('child_process');
const FPS = 30, DUR = 30, OUT = process.argv[2] || 'spot-recrutement-rca-4k.mp4';
(async () => {
  const ff = spawn(process.env.FFMPEG, ['-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-i', 'musique.wav', '-map', '0:v', '-map', '1:a',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-level', '5.1',
    '-c:a', 'aac', '-b:a', '256k', '-movflags', '+faststart', '-shortest', OUT], { stdio: ['pipe', 'inherit', 'inherit'] });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 });
  await p.goto('file://' + process.cwd() + '/spot.html');
  await p.evaluate(() => window.ready());
  for (let f = 0; f < FPS * DUR; f++) {
    await p.evaluate(t => window.seek(t), f / FPS);
    const buf = await p.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 90 === 0) console.error('image', f);
  }
  ff.stdin.end();
  await b.close();
  await new Promise(r => ff.on('close', r));
})();
