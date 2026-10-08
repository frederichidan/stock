const {chromium}=require('/opt/node-tools/node_modules/playwright');
const fs=require('fs');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const url='file://'+__dirname+'/affiche.html';
async function open(sc){const pg=await b.newPage({viewport:{width:1400,height:6000},deviceScaleFactor:sc});await pg.goto(url);await pg.evaluate(()=>document.fonts.ready);return pg}
let pg=await open(1);
const info=await pg.evaluate(()=>{const p=document.getElementById('p');const top=e=>Math.round(e.getBoundingClientRect().top-p.getBoundingClientRect().top);
 const q=s=>document.querySelector(s);
 return {H:Math.ceil(p.getBoundingClientRect().height),cuts:[top(q('.sec')),top(q('.cards')),top(q('.cd')),top(q('.fin')),top(q('.band2')),top(document.querySelectorAll('.sec')[1]),top(document.querySelectorAll('.sec')[1].querySelector('.proj').previousElementSibling),top(q('.foot')),top(q('.close'))]}});
console.log(JSON.stringify(info));
await pg.pdf({path:'affiche_AGM_Mboma2026.pdf',width:'1400px',height:info.H+'px',printBackground:true,pageRanges:'1'});
await pg.close();
// PNG 16K
pg=await open(15360/info.H);await pg.screenshot({path:'affiche_AGM_Mboma2026.png',clip:{x:0,y:0,width:1400,height:info.H}});await pg.close();
// JPEG 8K
pg=await open(7680/info.H);await pg.screenshot({path:'8K/affiche_AGM_Mboma2026_8K.jpg',type:'jpeg',quality:94,clip:{x:0,y:0,width:1400,height:info.H}});await pg.close();
// WhatsApp : images de 1600 px de large, hauteur <=1600 px (aucune réduction par WhatsApp)
const MAX=1400, pts=[0,...info.cuts.filter(x=>x>0),info.H];let cuts=[0];
for(let i=1;i<pts.length;i++){ if(pts[i]-cuts[cuts.length-1]>MAX){cuts.push(pts[i-1]);} }
cuts.push(info.H);for(let i=1;i<cuts.length-1;i++)cuts[i]-=24;
console.log('slices',JSON.stringify(cuts));
for(const f of fs.readdirSync('whatsapp'))fs.unlinkSync('whatsapp/'+f);
pg=await open(1600/1400);
for(let i=0;i<cuts.length-1;i++){const y=cuts[i],h=cuts[i+1]-y;
 await pg.screenshot({path:`whatsapp/affiche_AGM_WhatsApp_${i+1}sur${cuts.length-1}.jpg`,type:'jpeg',quality:95,clip:{x:0,y,width:1400,height:h}});}
await b.close()})()
