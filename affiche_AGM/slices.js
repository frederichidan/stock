const {chromium}=require('/opt/node-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const pg=await b.newPage({viewport:{width:1400,height:4200},deviceScaleFactor:2});
await pg.goto('file://'+__dirname+'/affiche.html');await pg.evaluate(()=>document.fonts.ready);
const S=[['whatsapp/affiche_AGM_1sur2.jpg',0,1663],['whatsapp/affiche_AGM_2sur2.jpg',1663,1746]];
for(const [f,y,h] of S)await pg.screenshot({path:f,type:'jpeg',quality:95,clip:{x:0,y,width:1400,height:h}});
await b.close()})()
