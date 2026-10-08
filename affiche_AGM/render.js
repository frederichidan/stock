const {chromium}=require('/opt/node-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
let pg=await b.newPage({viewport:{width:1400,height:5000}});
await pg.goto('file://'+__dirname+'/affiche.html');await pg.evaluate(()=>document.fonts.ready);
const info=await pg.evaluate(()=>({H:Math.ceil(document.getElementById('p').getBoundingClientRect().height),t:[...document.getElementById('p').children].map(e=>e.offsetTop)}));
console.log(JSON.stringify(info));
await pg.pdf({path:'affiche_AGM_Mboma2026.pdf',width:'1400px',height:info.H+'px',printBackground:true,pageRanges:'1'});
await pg.close();
const sc=15360/info.H;
pg=await b.newPage({viewport:{width:1400,height:5000},deviceScaleFactor:sc});
await pg.goto('file://'+__dirname+'/affiche.html');await pg.evaluate(()=>document.fonts.ready);
await pg.screenshot({path:'affiche_AGM_Mboma2026.png',clip:{x:0,y:0,width:1400,height:info.H}});
await pg.close();
// tranches WhatsApp : coupes entre sections (hero+bilan | partenaires+projets | divers+conclusion)
const t=info.t; const cuts=[0,t[3],t[5],info.H];
pg=await b.newPage({viewport:{width:1400,height:5000},deviceScaleFactor:2});
await pg.goto('file://'+__dirname+'/affiche.html');await pg.evaluate(()=>document.fonts.ready);
for(let i=0;i<3;i++)await pg.screenshot({path:`whatsapp/affiche_AGM_${i+1}sur3.jpg`,type:'jpeg',quality:95,clip:{x:0,y:cuts[i],width:1400,height:cuts[i+1]-cuts[i]}});
await b.close()})()
