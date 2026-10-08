const {chromium}=require('/opt/node-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
let pg=await b.newPage({viewport:{width:1400,height:4200},deviceScaleFactor:15360/3409});
await pg.goto('file://'+__dirname+'/affiche.html');await pg.evaluate(()=>document.fonts.ready);
const H=await pg.evaluate(()=>document.getElementById('p').getBoundingClientRect().height);
console.log('H',H);
await pg.screenshot({path:process.argv[2]||'prev1x.png',clip:{x:0,y:0,width:1400,height:Math.ceil(H)}});
await pg.pdf({path:'affiche_AGM_Mboma2026.pdf',width:'1400px',height:Math.ceil(H)+'px',printBackground:true,pageRanges:'1'});
await b.close()})()
