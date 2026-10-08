const fs=require('fs');
const d=require('docx');
const {Document,Packer,Paragraph,TextRun,ImageRun,Table,TableRow,TableCell,WidthType,ShadingType,BorderStyle,AlignmentType,HeadingLevel,LevelFormat,Footer,Header,PageNumber,TabStopType}=d;
const BLUE='1583C2',ORANGE='F0AE23',GREEN='5E9A1F',BROWN='814C21',INK='1C1C1C',LIGHT='E3EEF7';
const W=9638; // largeur utile A4 (marges 2 cm)
const t=(text,o={})=>new TextRun({text,font:'Calibri',size:22,color:INK,...o});
const p=(runs,o={})=>new Paragraph({spacing:{after:120,line:300},...o,children:Array.isArray(runs)?runs:[t(runs)]});
const h1=s=>new Paragraph({heading:HeadingLevel.HEADING_1,keepNext:true,spacing:{before:320,after:140},border:{bottom:{style:BorderStyle.SINGLE,size:12,color:ORANGE,space:2}},children:[new TextRun({text:s,font:'Calibri',size:30,bold:true,color:BLUE})]});
const h2=s=>new Paragraph({heading:HeadingLevel.HEADING_2,keepNext:true,spacing:{before:220,after:100},children:[new TextRun({text:s,font:'Calibri',size:25,bold:true,color:BROWN})]});
const bul=(runs)=>new Paragraph({numbering:{reference:'bul',level:0},spacing:{after:70,line:290},children:Array.isArray(runs)?runs:[t(runs)]});
const num=(s)=>new Paragraph({numbering:{reference:'num',level:0},spacing:{after:70,line:290},children:[t(s)]});
const b=(s)=>t(s,{bold:true});
const bd={style:BorderStyle.SINGLE,size:4,color:'BFC9D2'};
const borders={top:bd,bottom:bd,left:bd,right:bd};
const cell=(content,w,o={})=>new TableCell({width:{size:w,type:WidthType.DXA},borders,margins:{top:80,bottom:80,left:120,right:120},shading:o.fill?{fill:o.fill,type:ShadingType.CLEAR,color:'auto'}:undefined,verticalAlign:'center',children:(Array.isArray(content)?content:[content]).map(c=>typeof c==='string'?new Paragraph({spacing:{after:0},alignment:o.align,children:[t(c,{bold:o.bold,color:o.color})]}):c)});
const table=(cols,rows,headerFill=BLUE)=>new Table({width:{size:cols.reduce((a,c)=>a+c,0),type:WidthType.DXA},columnWidths:cols,rows:rows.map((r,i)=>new TableRow({tableHeader:i===0,cantSplit:true,children:r.map((c,j)=>cell(c,cols[j],i===0?{fill:headerFill,bold:true,color:'FFFFFF'}:{fill:i%2===0?'F4F8FB':undefined,bold:j===0}))}))});
const spacer=()=>new Paragraph({spacing:{after:80},children:[]});

const logo=new ImageRun({type:'png',data:fs.readFileSync('logo_hd.png'),transformation:{width:105,height:105},altText:{title:'Logo AGM',description:'Logo Association Génération Soleil de Mboma',name:'logo'}});

const titleBlock=new Table({width:{size:W,type:WidthType.DXA},columnWidths:[1800,W-1800],rows:[new TableRow({children:[
 new TableCell({width:{size:1800,type:WidthType.DXA},borders:{top:{style:BorderStyle.NONE},bottom:{style:BorderStyle.NONE},left:{style:BorderStyle.NONE},right:{style:BorderStyle.NONE}},verticalAlign:'center',children:[new Paragraph({children:[logo]})]}),
 new TableCell({width:{size:W-1800,type:WidthType.DXA},borders:{top:{style:BorderStyle.NONE},bottom:{style:BorderStyle.NONE},left:{style:BorderStyle.NONE},right:{style:BorderStyle.NONE}},verticalAlign:'center',children:[
  new Paragraph({spacing:{after:40},children:[new TextRun({text:'ASSOCIATION GÉNÉRATION SOLEIL DE MBOMA (AGM)',font:'Calibri',size:20,bold:true,color:BROWN,characterSpacing:30})]}),
  new Paragraph({spacing:{after:40},children:[new TextRun({text:'COMPTE RENDU DE RÉUNION',font:'Calibri',size:44,bold:true,color:BLUE})]}),
  new Paragraph({spacing:{after:0},children:[new TextRun({text:'Réunion de rentrée des activités du 03 octobre 2026',font:'Calibri',size:26,color:INK})]})]})]})]});

const present=['Assoume Be Martial','Ekore Ollomo Gabin','Abeme Ollomo Gisèle','Ntsame Be Linda','Nnang Ollomo Romuald','Ntsame Mimbo Marie','Ekore Be Sidney','Ndong Menie Emery',"Aba'a Edouard",'Beh Minko J. Martial','Mendame Ndong R.','Ossele Ekang Prudent',"N'nang Zue Edvin",'Beh Obame Narcisse',"N'nang Meye Leoneld",'Be Ekore Ghislaine','Mba Obame Boris','Obone Ndong Laetitia','Obone Zome épse Madegha','Biveghe Missang Francine','Eyeghe Ekore Abel','Essame Nanette','Ndong Ollomo Eric Richard','Ndong Aziel Blanchard','Ulrich Beh Essono','Okome Mve Stella','Nzang Nghema Yasmine','Freddy Mendame','Judith Esseng épse Nguema'];
const pr=[];for(let i=0;i<present.length;i+=3)pr.push([0,1,2].map(k=>present[i+k]?`${i+k+1}. ${present[i+k]}`:''));
const cw=[W/3|0,W/3|0,W-2*(W/3|0)];
const presT=new Table({width:{size:W,type:WidthType.DXA},columnWidths:cw,rows:pr.map(r=>new TableRow({cantSplit:true,children:r.map((c,j)=>cell(c,cw[j]))}))});

const kv=(k,v)=>new TableRow({children:[cell(k,2400,{fill:LIGHT,bold:true}),cell(v,W-2400)]});
const info=new Table({width:{size:W,type:WidthType.DXA},columnWidths:[2400,W-2400],rows:[
 kv('Date','Samedi 03 octobre 2026'),kv('Objet','Réunion de rentrée des activités : bilan de Mboma 2026 (période des grandes vacances) et projets à venir'),kv('Participants','29 personnes présentes (liste en annexe)'),kv('Document','Compte rendu rédigé à partir du compte rendu de séance et du bilan AGM Mboma 2026')]});

const fin=table([3000,3300,3338],[
 ['Action','Montant','Financement'],
 ['Mariages','930 000 FCFA (total reçu)','100 % AGM'],
 ['Caravane médicale','≈ 4 100 000 FCFA','100 % partenaires'],
 ['Retraits de deuil groupés','1 220 000 FCFA','100 % AGM'],
 ['Nettoyage du village','230 000 FCFA','100 % AGM']]);
const wed=table([2000,4200,3438],[
 ['Date','Marié(e)','Précision'],
 ['05/12/2026','Ulrich Beh Essono','Président AGM'],
 ['16 et 18/12/2026','Frédéric Mendame','Secrétaire général AGM'],
 ['24 et 26/12/2026','Abel Eyeghe Ekore','']]);

const proj=['Fabrique de pierres tombales pour le cimetière communautaire (noms, prénoms, dates de naissance et de décès).','Achat de panneaux solaires pour tout le village.','Sport et culture Mboma 2027.','Groupe électrogène communautaire pour alimenter tout le village.','Relance du groupe de danse GSM nouvelle génération.',"Lancement d'une tontine (pour ceux qui le souhaitent).","Réhabilitation de l'église : peinture, bancs, construction d'un presbytère ou d'une chambre pour le prêtre.","Achat d'un poteau électrique de BIBASSE à BAGA et de compteur d'électricité.",'Inhumation des personnes dans le cimetière commun.','Maintien de la randonnée et de la messe de Toussaint.'];

const children=[
 titleBlock,spacer(),info,
 h1('1. Introduction'),
 p("La période des grandes vacances 2026 a été particulièrement riche en activités pour l'Association Génération Soleil (AGM). À travers plusieurs initiatives, l'association a mobilisé ses membres, ses partenaires et ses ressources afin de contribuer concrètement à la vie de la communauté."),
 h1('2. Bilan de Mboma 2026'),
 h2('2.1 Mariages des oncles'),
 bul([t("Les mariages de Monsieur "),b('Eric Ndong Ollomo'),t(' et de Monsieur '),b('Valentin Mendame'),t(' ont été célébrés ; les festivités se sont bien déroulées.')]),
 bul([t("Total reçu pour les mariages : "),b('930 000 FCFA'),t(", financés à 100 % par l'AGM.")]),
 bul("La contribution traduit la volonté de l'AGM de renforcer la solidarité entre ses membres et d'être présente dans les moments importants de leur vie familiale."),
 h2('2.2 Caravane médicale'),
 bul([t("Opération évaluée à environ "),b('4 100 000 FCFA'),t(', entièrement financée par les partenaires.')]),
 bul('Les consultations et prestations médicales ont été offertes gratuitement à la communauté.'),
 bul("Les médecins ont été logés, nourris et transportés grâce aux partenaires ; l'aide a été apportée en grande partie en nature (billets d'avion, chaises, tentes, médicaments…)."),
 bul([t('Quatre pharmacies ont apporté leur soutien : '),b('Razel'),t(', '),b('Les Marguerites'),t(', '),b('Avorebam'),t('…')]),
 bul("Un partenaire a pris en charge les billets d'avion des médecins et le carburant du Docteur Cheick."),
 bul([b('Romuald'),t(" a réglé l'hébergement des quatre médecins à EDEN PARK ; "),b('Ma Janvier'),t(' a pris en charge la location des tentes et des chaises.')]),
 bul('Les médicaments restants sont à la disposition de chacun au village Mboma.'),
 h2('2.3 Retraits de deuil groupés'),
 bul([t('Six (6) danses ont été mobilisées pour un coût global d’environ '),b('1 220 000 FCFA'),t(', financé à 100 % par l’AGM.')]),
 bul([t('Le budget arrêté était de '),b('4 millions FCFA'),t('; seuls '),b('2 millions'),t(' ont été cotisés. '),b('600 000 FCFA'),t(' ont été prélevés sur la caisse AGM pour pallier le déficit des personnes n’ayant pas cotisé.')]),
 bul('Malgré cela, la nourriture, la boisson et le paiement des invités ont été entièrement réglés.'),
 h2('2.4 Nettoyage du village'),
 bul([t('Opération de nettoyage du village pour un montant de '),b('230 000 FCFA'),t(', financée à 100 % par l’AGM.')]),
 h2('2.5 Synthèse financière'),
 fin,spacer(),
 p([t('Au total, les actions menées par l’AGM au cours de Mboma 2026 représentent '),b('environ 8 000 000 FCFA'),t('.')]),
 h1('3. Projets à venir'),
 h2('3.1 Mariages de décembre 2026'),
 wed,spacer(),
 p([t('Les catégories de cotisation sont connues. La caisse pour cette circonstance est ouverte auprès de la trésorière générale, '),b('Mme Nanette Essame'),t('.')]),
 h2('3.2 Corps de garde'),
 p('Le projet du corps de garde est renvoyé à une date ultérieure.'),
 h2('3.3 Mboma 2027 : propositions de projets'),
 p('L’AGM invite les membres à soumettre leurs propositions de projets. Les idées évoquées en réunion sont les suivantes :'),
 ...proj.map(num),
 h1('4. Divers'),
 bul([t('Reprise des cotisations mensuelles. Les cotisations ont atteint environ '),b('700 000 FCFA'),t(' en caisse ; cette somme a servi à combler le déficit des retraits de deuil groupés.')]),
 bul([b('Huit (8) nouveaux membres'),t(' ont rejoint l’AGM, dont cinq absents. Bienvenue à Francine, Yasmine et Laetitia, ainsi qu’aux autres.')]),
 bul([t('Dès le '),b('lundi 05/10/2026'),t(', le président se rendra au Ministère de l’Intérieur pour soumettre le récépissé de l’AGM afin d’obtenir une reconnaissance légale et nationale de l’association.')]),
 h1('5. Conclusion'),
 p("À travers ces actions, Mboma 2026 a permis à l'AGM de traduire ses valeurs de solidarité, de fraternité, d'entraide et de responsabilité communautaire en actions concrètes. Ce bilan est avant tout le résultat d'une dynamique collective : les membres qui se mobilisent, les bénévoles qui donnent de leur temps et les partenaires qui nous font confiance."),
 new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:160,after:0},children:[new TextRun({text:'AGM : Une association, une communauté, un engagement.',font:'Calibri',size:24,italics:true,bold:true,color:BLUE})]}),
 new Paragraph({children:[new d.PageBreak()]}),
 h1('Annexe : liste des présents (29 personnes)'),
 presT,
];

const doc=new Document({
 creator:'AGM',title:'Compte rendu de la réunion du 03/10/2026',description:'Archive AGM',
 styles:{default:{document:{run:{font:'Calibri',size:22}}},paragraphStyles:[
  {id:'Heading1',name:'Heading 1',basedOn:'Normal',next:'Normal',quickFormat:true,run:{size:30,bold:true,font:'Calibri',color:BLUE},paragraph:{spacing:{before:320,after:140},outlineLevel:0}},
  {id:'Heading2',name:'Heading 2',basedOn:'Normal',next:'Normal',quickFormat:true,run:{size:25,bold:true,font:'Calibri',color:BROWN},paragraph:{spacing:{before:220,after:100},outlineLevel:1}}]},
 numbering:{config:[
  {reference:'bul',levels:[{level:0,format:LevelFormat.BULLET,text:'•',alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:540,hanging:270}},run:{color:ORANGE}}}]},
  {reference:'num',levels:[{level:0,format:LevelFormat.DECIMAL,text:'%1.',alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:540,hanging:360}},run:{bold:true,color:BLUE}}}]}]},
 sections:[{properties:{page:{size:{width:11906,height:16838},margin:{top:1134,bottom:1134,left:1134,right:1134}}},
  footers:{default:new Footer({children:[new Paragraph({tabStops:[{type:TabStopType.RIGHT,position:W}],border:{top:{style:BorderStyle.SINGLE,size:6,color:ORANGE,space:4}},children:[new TextRun({text:'AGM · Compte rendu de la réunion du 03/10/2026',font:'Calibri',size:18,color:'555555'}),new TextRun({text:'\tPage ',font:'Calibri',size:18,color:'555555'}),new TextRun({children:[PageNumber.CURRENT],font:'Calibri',size:18,color:'555555'}),new TextRun({text:' / ',font:'Calibri',size:18,color:'555555'}),new TextRun({children:[PageNumber.TOTAL_PAGES],font:'Calibri',size:18,color:'555555'})]})]})},
  children}]});
Packer.toBuffer(doc).then(buf=>{fs.writeFileSync('CR_AGM_reunion_03-10-2026.docx',buf);console.log('ok',buf.length)});
