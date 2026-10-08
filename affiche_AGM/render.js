const {chromium}=require('/opt/node-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const pg=await b.newPage({viewport:{width:1400,height:2240},deviceScaleFactor:7680/2240});
await pg.goto('file://'+__dirname+'/affiche.html');await pg.evaluate(()=>document.fonts.ready);await pg.waitForTimeout(500);
await pg.screenshot({path:'affiche_AGM_Mboma2026.png',clip:{x:0,y:0,width:1400,height:2240}});
await pg.pdf({path:'affiche_AGM_Mboma2026.pdf',width:'1400px',height:'2240px',printBackground:true,pageRanges:'1'});
await b.close()})()
