# Mariage de Raïka & Frédéric — pochette passeport, billets d'invitation, carte de menu, étiquettes de bouteilles et cartes de table

Supports imprimables du « Passeport de Mariage ». La pochette passeport est en **lilas, violet
& or** : extérieur violet améthyste, lettres violet presque noir, ornements or antique ; intérieur ivoire et lilas très pâle. Les billets d'invitation existent en deux
catégories : **premium** pour les invités VIP, en **or champagne**, et **classique** pour les
autres invités, en **argent**. La carte de menu, les étiquettes de bouteilles et les 30
cartes de table sont en **blanc & or** : fond blanc, textes et décors dorés. Ces palettes sans violet, à fond clair,
sont plus légères à l'impression. Il n'y a pas de photo du couple : le visuel
principal est le monogramme **R & F**, avec l'initiale de la mariée placée avant celle du marié.

## Imprimer sur la Xerox VersaLink B7035 : `export/xerox-b7035/`

La VersaLink B7035 est une imprimante **laser noir et blanc** (1200 × 1200 dpi). Elle traduit
toute couleur en gris, et tout gris en trame de points : un texte doré, bronze, argent ou violet
y sort tramé, aux bords crénelés et flous, et un fond foncé consomme beaucoup de toner. Seul le
noir plein s'imprime parfaitement net. Le dossier `export/xerox-b7035/` contient donc une
**édition noir et blanc** de tous les supports, conçue pour elle :

- textes, filets, ornements et monogrammes en **noir plein**, sur fond blanc ; seuls les
  bandeaux et les pastilles gardent un gris très clair (≈ 8 %) ; guillochis et rosaces, qui
  n'y seraient que des pointillés gris, sont retirés ;
- PDF en **niveaux de gris** (le noir des textes y est un noir pur, toner seul) ; dans les
  `…-A4-8k.pdf`, dessins en image 8K sans perte (≈ 1 000 dpi) et textes vectoriels ;
  les `…-A4-vectoriel.pdf` sont entièrement vectoriels ;
- mêmes planches, mêmes formats et mêmes réglages qu'en couleur (A4 portrait, recto verso bord
  long ; cartes de table et étiquettes en recto seul).

Réglages sur la B7035 : imprimer le PDF à **100 %** (taille réelle), qualité / résolution la plus
haute (1200 dpi), recto verso **bord long**. Papier : **compatible laser** uniquement — jamais de
papier photo jet d'encre, dont le couchage ne supporte pas la chaleur du four ; bristol ou carte
mat ou satiné **jusqu'à 216 g/m²** par le départ manuel, en choisissant le type « Carte »
(« Cardstock ») dans le pilote. Les cartes de table, prévues en 200 à 250 g, restent donc à
216 g au plus sur cette machine. (Sources : fiche technique Xerox VersaLink B7025/B7030/B7035 et
article d'assistance Xerox KB0129600 sur les supports.)

## Les fichiers à utiliser en couleur : `export/violet/`

Un dossier par élément (`pochette-passeport/` et `pochette-passeport-violet-royal/` : les deux
versions de la pochette, voir plus bas ; `billet-invitation-premium/`,
`billet-invitation-classique/`, `carte-menu/`, `etiquette-vin/`, `etiquette-eau/`,
`cartes-tables/`) :

| Fichier | Usage |
|---|---|
| `…-A4-8k.pdf` | **À imprimer sur A4** (imprimante de bureau), recto verso bord long (étiquettes de bouteilles : recto seul, une page) : plusieurs exemplaires par feuille, fond perdu 3 mm, traits de coupe. Le fond et les dessins de chaque exemplaire sont une image 8K (≈ 1 000 dpi ; ≈ 650 dpi pour les feuilles A4 des cartes de table), sans transparence, avec un grain invisible qui évite les bandes dans les dégradés (sauf sur les supports blanc & or, dont le fond reste le blanc pur du papier) ; **tous les textes sont posés par-dessus en vectoriel** : l'imprimante les trace à sa pleine résolution, aussi nets que dans un traitement de texte, au lieu d'en imprimer une photo. Cartes de table : une feuille A4 entière par table, en `…-A4-8k-tables-01-a-10.pdf`, `…-11-a-20.pdf`, `…-21-a-30.pdf` (voir plus bas) |
| `…-A4-vectoriel.pdf` | La même planche en vectoriel (fichier léger, textes nets à toute taille), plutôt pour un imprimeur professionnel : elle contient des transparences que certains pilotes d'imprimante de bureau rendent moins bien |
| `…-maquette-8k.jpg` | Maquette de présentation réaliste, 7680 × 4320 (8K) |
| `…-maquette-8k.pdf` | La même maquette sur A4 paysage, centrée avec 10 mm de marge blanche (imprimable telle quelle à 100 %) |
| `…-recto-8k.jpg`, `…-verso-8k.jpg`, `…-exterieur-8k.jpg`, `…-interieur-8k.jpg`, `…-couverture-8k.jpg`, `…-face-8k.jpg` | Chaque face à plat, 7680 px sur le grand côté (partage numérique, WhatsApp…) ; pas pour les cartes de table |

Et `ensemble-maquette-8k.jpg` / `.pdf` : les trois supports réunis sur une même maquette.

## Impression sur A4

Pour tenir sur une feuille A4 avec fond perdu, traits de coupe et 8 mm de marge (zone que
les imprimantes n'impriment pas), les trois éléments sont imprimés à **88,5 %** de leur
dessin d'origine :

| Élément | Format fini | Par feuille A4 |
|---|---|---|
| Pochette passeport | ouverte 185,9 × 131 mm, pliée en deux : 92,9 × 131 mm | 2 (A4 portrait) |
| Billet d'invitation (premium ou classique) | 185,9 × 87,6 mm | 3 (A4 portrait) |
| Carte de menu | 87,6 × 185,9 mm | 3 (A4 portrait, cartes couchées l'une sous l'autre) |

Chaque PDF A4 a deux pages : **page 1 = rectos, page 2 = versos**. Toutes ces planches sont
en **A4 portrait**, pour l'impression **recto verso avec retournement sur le bord long**
(la feuille se retourne comme la page d'un livre), à **100 %** (taille réelle, sans
« ajuster à la page »). Les PDF sont au format A4 exact et demandent eux-mêmes ces réglages
(Acrobat Reader, Chrome et Edge les présélectionnent) : vérifiez-les tout de même dans la
fenêtre d'impression. Les versos sont placés et orientés pour tomber derrière les rectos :

- **Pochette** : une fois la feuille découpée et pliée au milieu (repères « pli » en
  pointillés), l'invitation se trouve derrière la couverture et la page d'identité derrière
  le dos, à l'endroit.
- **Billet** : le verso se lit à l'endroit en retournant le billet de haut en bas.
- **Carte de menu** : les cartes sont couchées sur la feuille (le haut des rectos vers la
  droite) ; une fois découpée, la carte se lit à l'endroit, et son verso aussi en la
  retournant de gauche à droite.

Faites un essai sur papier ordinaire avant le tirage final : si le verso est décalé,
vérifiez que l'impression est bien à 100 % et en « bord long ».

Découpe : suivre les traits de coupe (massicot ou cutter et règle) ; le fond perdu de 3 mm
absorbe les petits écarts. Conseils : papier 250 à 350 g, finition mate ou soft-touch ;
coins arrondis de 3 mm conseillés pour la pochette, comme sur la maquette.

## Étiquettes de bouteilles

Dans la charte du billet (carte d'embarquement, monogramme, trajet CLB → MAR, guillochis),
mais en **blanc & or** plutôt qu'en violet, comme la carte de menu : fond et bandeaux blancs,
textes, filets et ornements dorés. Seuls les textes et les décors demandent de l'encre, et
toutes les teintes restent dans la gamme d'une imprimante (écart ΔE < 2).

| Étiquette | Format (taille réelle) | Par feuille A4 | Fichier à imprimer |
|---|---|---|---|
| Vin (étiquette avant, bouteille de 75 cl) | 90 × 120 mm | 4 (A4 portrait) | `etiquette-vin/etiquette-vin-A4-8k.pdf` |
| Eau 33 cl (fait le tour de la bouteille) | 200 × 50 mm | 3 (A4 paysage) | `etiquette-eau/etiquette-eau-A4-8k.pdf` |

- Les étiquettes s'impriment **à 100 %** (elles doivent tomber juste sur les bouteilles) et
  **en recto seul** : chaque PDF n'a qu'une page.
- **Papier** : vin, papier adhésif A4 brillant ou mat, à découper aux traits de coupe ; eau,
  **adhésif vinyle résistant à l'eau** (les bouteilles sortent du frais et se couvrent de
  buée : un papier ordinaire gondole et l'encre jet d'encre coule). Avec une imprimante jet
  d'encre, prendre un vinyle « jet d'encre » et laisser sécher avant de découper.
- **Eau** : coller d'abord le bord gauche, faire le tour, puis rabattre le bord droit (le talon
  « 33 cl ») par-dessus : la bande de gauche, sans texte, passe dessous. Le bord droit doit
  recouvrir le gauche de 5 à 15 mm : l'étiquette de 200 mm convient donc à un **tour de
  bouteille de 18,5 à 19,5 cm** (diamètre d'environ 5,9 à 6,2 cm), courant pour les 33 cl.
  Mesurez le tour de vos bouteilles avec un ruban : en dessous de 18,5 cm, le talon cacherait
  l'avion et le monogramme ; au-dessus de 19,5 cm, le recouvrement serait trop court. Hors de
  cette plage, changer la largeur dans `etiquettes.js` (`FORMATS_ETIQUETTES.eau`, largeur =
  tour + 10 mm).
- Textes des étiquettes (« Première classe », « Cuvée », « Grand vin de mariage »,
  « Eau minérale », « 33 cl »…) : section `etiquettes` d'`infos.js`.

## Affiches A5 : `export/violet/affiches/`

Une affiche A5 (148 × 210 mm) par nom de la liste `affiches` de `infos.js` (Merveille, Karen,
Elhiska, Moreen, Wilfrida, Judith), dans la charte du menu et des cartes de table : fond blanc,
cadre doré, vol RF 1812, monogramme couronné, le nom en grande écriture (Satisfy, brun presque
noir), et en bas les prénoms des mariés et la date. Aperçu : `affiches.html` (une affiche par
page) ou `affiches.html?format=a4` (les feuilles A4 à imprimer), `?nom=Karen` pour une seule.

| Fichier | Usage |
|---|---|
| `affiches-A4-8k.pdf` | **À imprimer sur A4** : deux affiches par feuille A4 paysage (3 feuilles), à 100 %, recto seul, puis à couper en deux au milieu (repères en haut et en bas). Fond et dessins en image 8K, textes vectoriels |
| `affiches-A5-8k.pdf` | Les mêmes affiches une par page A5 (6 pages), pour une imprimante chargée en A5 ou un imprimeur |
| `affiches-A4-vectoriel.pdf`, `affiches-A5-vectoriel.pdf` | Les mêmes, entièrement vectorielles |
| `affiches-<nom>-8k.jpg`, `affiches-maquette-8k.jpg` / `.pdf` | Chaque affiche et la maquette en 8K |
| `whatsapp/` | Chaque affiche et la maquette en 2048 px sur le grand côté, JPEG léger (150 à 210 Ko) : nettes sur WhatsApp, y compris en qualité HD |

Fond blanc : ni fond perdu ni traits de coupe autour ; le cadre reste à 10 mm des bords, dans
la zone que toutes les imprimantes impriment. Papier conseillé : cartonné blanc 200 à 250 g
(216 g au plus sur la Xerox B7035). Édition noir et blanc : `export/xerox-b7035/affiches/`.
Pour ajouter, retirer ou corriger un nom : modifier la liste `affiches` de `infos.js`, puis
`node exporter.js --seulement=affiches` (et `--xerox-b7035 --seulement=affiches`).

## Invitation à la demande en mariage : `export/violet/invitation-demande/`

Un modèle simple de carte d'invitation à la cérémonie de demande en mariage, format A6
(105 × 148 mm), dans la même charte : fond blanc, cadre doré, monogramme couronné, « Demande en
mariage » et les prénoms en écriture, le texte d'invitation, puis la date, l'heure et le lieu.
Tous ses textes sont dans `infos.js`, rubrique `demande` (en-tête, titre, texte d'invitation,
ligne des prénoms, date, heure, lieu, précision sous le lieu, tenue, confirmation, mot de la
fin). **C'est une demande surprise** : l'invitation vient de Frédéric (« Invitation
surprise », « … à sa demande en mariage surprise à Raïka », « Chut… Raïka ne se doute de
rien ! ») ; ne pas l'envoyer à Raïka, ni dans un groupe où se trouve Raïka. **Date, heure ou lieu
laissés vides : la carte porte une ligne pointillée, à remplir à la main** ; tenue,
confirmation et précision vides ne s'affichent pas (la précision, seulement avec un lieu).
Couleurs : blanc & or (`couleurs.demande: "blanc"`), seul fond adapté à cette carte sans fond
perdu. Aperçu : `invitation-demande.html` (la
carte) ou `invitation-demande.html?format=a4` (la feuille à imprimer).

| Fichier | Usage |
|---|---|
| `invitation-demande-A4-8k.pdf` | **À imprimer sur A4** : quatre cartes par feuille, à 100 %, recto seul, puis à couper en quatre (repères au milieu de chaque bord et petite croix au centre). Fond et dessins en image 8K, textes vectoriels |
| `invitation-demande-A6-8k.pdf` | La carte seule sur une page A6, pour une imprimante chargée en A6 ou un imprimeur |
| `invitation-demande-A4-vectoriel.pdf`, `invitation-demande-A6-vectoriel.pdf` | Les mêmes, entièrement vectorielles |
| `invitation-demande-carte-8k.jpg` | La carte en 8K |
| `whatsapp/invitation-demande-carte-whatsapp.jpg` | La carte en 2048 px, JPEG léger, à envoyer sur WhatsApp |

Fond blanc : ni fond perdu ni traits de coupe autour ; le cadre reste à 7 mm des bords.
Papier conseillé : cartonné blanc 200 à 250 g (216 g au plus sur la Xerox B7035). Édition noir
et blanc : `export/xerox-b7035/invitation-demande/`. Après avoir rempli la date, l'heure et le
lieu dans `infos.js` : `node exporter.js --seulement=invitation-demande` (et `--xerox-b7035
--seulement=invitation-demande`).

## Cartes de table

Une carte par table, **30 en tout**, dans le même design que la carte de menu et les
étiquettes (blanc & or, cadre doré, vol RF 1812, monogramme, guillochis) : grand numéro et
**nom d'une fleur** en écriture dorée.

1 Rose · 2 Pivoine · 3 Orchidée · 4 Lys · 5 Tulipe · 6 Magnolia · 7 Camélia · 8 Jasmin ·
9 Hibiscus · 10 Gardénia · 11 Lavande · 12 Iris · 13 Dahlia · 14 Hortensia · 15 Marguerite ·
16 Tournesol · 17 Lilas · 18 Muguet · 19 Glycine · 20 Anémone · 21 Renoncule · 22 Freesia ·
23 Amaryllis · 24 Azalée · 25 Mimosa · 26 Jacinthe · 27 Lotus · 28 Bougainvillée ·
29 Frangipanier · 30 Coquelicot.

- Noms et nombre de tables : section `tables` d'`infos.js` (l'ordre de la liste donne les
  numéros). Aperçu : `cartes-tables.html` (toutes) ou `cartes-tables.html?table=5`.
- **En chevalet : une feuille A4 par table, pliée en deux.** La moitié basse de la feuille
  porte la carte à l'endroit, la moitié haute la même carte tournée de 180° : une fois la
  feuille pliée en deux, pli en haut, et posée en tente, le numéro et le nom se lisent **des
  deux côtés de la table**. Chaque face mesure 21 × 14,85 cm.
- À imprimer sur l'imprimante de bureau : `cartes-tables/cartes-tables-A4-8k-tables-01-a-10.pdf`,
  `…-11-a-20.pdf` et `…-21-a-30.pdf` (10 feuilles chacun, découpés pour rester sous 30 Mo ;
  fond et dessins de chaque feuille en image 8K, ≈ 650 dpi, textes en vectoriel). `cartes-tables-A4-vectoriel.pdf` (les 30
  feuilles) est plutôt pour un imprimeur professionnel : sa moitié tournée y forme un groupe de
  transparence, que certains pilotes d'imprimante de bureau rendent moins bien. **A4 portrait,
  à 100 %, recto seul** : rien à découper ni à aligner au verso. Le fond est blanc et le cadre doré reste à 10 mm des
  bords, dans la zone que toutes les imprimantes de bureau impriment.
- Pliage : deux petits repères dorés, dans les marges, marquent le milieu de la feuille.
  Marquer le pli (règle et pointe d'un couteau à beurre, ou plioir) avant de plier, côté
  imprimé à l'extérieur.
- Papier : cartonné blanc **200 à 250 g** (lisse, mat ou satiné), pour que le chevalet tienne
  debout ; vérifier le grammage maximal accepté par l'imprimante.

## Couleurs et impression

**Billet premium : or champagne, très atténué pour l'impression.** Fond presque blanc,
ivoire et champagne pâle, bandeaux d'un doré léger (#eadcb7 → #f2e8cf : environ deux fois
moins d'encre que la version précédente et trois fois moins qu'à l'origine ; les ors saturés
sortaient lourds et brouillés sur imprimante de bureau), guillochis très discrets, textes brun
presque noir (#2b2117, #3f3020), tirés de l'or antique (#a07a32) et de l'or champagne (#c9a464) de la
palette.
**Billet classique : argent** (#bcbec9 de la palette) : fond blanc nacré, bandeaux argentés,
textes graphite presque noir (#15171b). **Carte de menu, étiquettes de bouteilles et cartes de table : blanc & or.** Fond blanc (le
papier, sans encre) ; textes en brun presque noir (#2b2117) sur le menu et les étiquettes, en or
foncé presque bronze (#6e5530, #5e4a24) sur les cartes de table ; filets, pictogrammes et
ornements en or vif (#b8913f, #c39c4a) ; sur les cartes de table, titres et prénoms en dégradé
doré. Ces fonds clairs ne demandent que 0 à 77 % d'encre (contre
160 à 190 % pour les fonds violets) et toutes les teintes restent dans la gamme d'une
imprimante (écart ΔE < 2,5). Réglages dans `infos.js` : `billets` (nom, couleur et classe de
chaque catégorie : « Invité d'honneur » pour le premium, « Invité » pour le classique) et
`couleurs: { menu: "blanc", etiquettes: "blanc", tables: "blanc" }` (`"or"` pour l'or champagne, `"argent"`
pour l'argent ; pour le menu, `""` revient aux couleurs de la version).

**Pochette passeport : lilas, violet & or.** L'extérieur (couverture et dos) était un aplat
violet foncé (#6f4e9d, environ 180 % d'encre) : il chargeait le papier, et ses lettres claires,
« en réserve », s'imprimaient mal. Il devient un **lilas pâle**, de la même teinte (#f3eef8 au
centre, #e8dff1, #dccfea aux bords), environ quatre fois moins gourmand en encre, qui porte des
lettres **violet profond** (#3f2b59) et des ornements **dorés** : la même logique que
l'intérieur (ivoire, violet et or) et que le code vestimentaire « touches de violet & d'or ».
Toutes ces teintes sont dans la gamme d'une imprimante quadri (CMJN).

**Extérieur de la pochette sur papier cartonné, laser couleur.** Imprimé sur carton par une
laser couleur, ce lilas très pâle (9 à 26 % d'encre) sortait presque blanc : le toner rend les
teintes aussi claires en points épars, et l'or clair des ornements (contraste 1,3 à 1,7:1 avec
le lilas) s'y effaçait. La couverture et le dos passent donc à un **violet améthyste** franc
(#b596dc au centre, #a886d3, #9a76ca aux bords ; 60 à 85 % d'encre, environ quatre fois le
lilas mais moitié moins que l'ancien violet foncé, sans aplat lourd qui marbre ou casse au
pli) : textes violet presque noir (#1a0c30 et #1f0d40 : 5:1 au moins jusqu'au bord, 6 à 7:1 là
où ils sont posés), cadre et esperluette **or antique** en aplat plein (#5a3f0e, #4f370b),
alliances, monogramme et puce en dégradé d'or antique à or vif (#4f370b → #d4ae55), ruban de la
devise **or pâle** en aplat (#f2e3b9), guillochis plus marqués. L'intérieur garde ses couleurs
(ivoire, violet et or). Réglages : `passeport.css`, « Version violet, extérieur : laser couleur
sur papier cartonné ».

**Deux versions de la pochette.** L'extérieur existe en deux couleurs, au même intérieur :

| Dossier | Extérieur (couverture et dos) |
|---|---|
| `pochette-passeport/` | **violet améthyste** (ci-dessus) : lettres violet presque noir, ornements or antique ; 60 à 85 % d'encre |
| `pochette-passeport-violet-royal/` | **violet royal** (#6a46a6 au centre à #4a2c80 aux bords) : lettres or clair et ivoire (5:1 au centre, 8:1 aux bords), ornements or clair, ruban or pâle ; la couleur la plus soutenue, 130 à 160 % d'encre : rainer le pli avant de plier |

Aperçu : `pochette-passeport.html?exterieur=royal` (planche : `impression.html?doc=passeport&exterieur=royal`,
maquette : `maquettes.html?scene=pochette-royal`). L'édition noir et blanc n'a qu'une pochette :
en noir, les deux versions sont presque identiques.

**Netteté des textes.** Le Cormorant Garamond des textes courants a, dans sa graisse normale,
des déliés d'environ 0,1 mm qui pâlissent et s'estompent à l'impression jet d'encre : les
textes courants (Cormorant droit et italique, capitales Montserrat) sont désormais en
semi-gras (600). Tous sont dans les teintes foncées ci-dessus et posés en vectoriel dans les
PDF 8K (voir plus haut).

**Menu, pochette (les deux faces), billets (premium et classique) et étiquettes de vin et
d'eau.** Ce sont les supports dont les textes sortaient flous ou peu visibles. En plus de ce
qui précède :
- texte courant en **Lora** demi-gras (600, droit et italique) au lieu du Cormorant Garamond :
  son œil (la hauteur des minuscules) est bien plus grand et ses traits plus solides ; en
  9,5 pt, les plats du menu sont aussi lisibles qu'en Cormorant de 12 pt ;
- toute l'écriture manuscrite passe de la Great Vibes, aux déliés très fins, à la **Satisfy**,
  aux pleins épais (« Menu », prénoms, « de Mariage », « Programme du voyage », signature,
  « Bon voyage ! », devise, verset) ; les initiales du monogramme sont en **Norican**, épaisse
  elle aussi (seul, le F de Satisfy se lirait 7) ;
- les lettres sont en **aplat** d'une seule teinte presque noire, au lieu du dégradé doré dont
  la partie claire pâlissait le texte : brun (#2b2117) sur le menu, les étiquettes et le billet
  premium, graphite (#15171b) sur le classique, violet très foncé (#2b1a45) sur la pochette ; l'or
  reste aux filets, cadres et ornements ; un texte uni s'imprime net sur tout pilote ;
- petites capitales (« ESCALE 1 », « ENTRÉES »…) et valeurs Montserrat en gras ;
- guillochis et rosace derrière les textes plus discrets ; titre « PASSEPORT » en Playfair
  Display noir (900).
Les cartes de table gardent leur dessin d'origine.

**Couverture et dos de la pochette.** « ROYAUME DE L'AMOUR » passe de 6 à 7 pt en gras, la date
de 10 à 11 pt. Comparées en simulant le débord d'encre d'un fond foncé dans des lettres
claires, Satisfy garde 77 % de la lettre contre 64 % pour la Great Vibes ; d'autres écritures
épaisses (Norican, Playball, Kaushan) ont été écartées pour les mots car le tréma de « Raïka »
s'y colle au k (Norican ne sert qu'aux initiales). Sur un fond foncé (thème minuit), les
lettres claires restent épaissies d'un contour de 0,08 mm de leur propre couleur.

Les détails fins sont dessinés pour tenir à l'impression (mesures sur l'imprimé, à 88,5 %) :
traits dorés d'au moins 0,18 mm, guillochis et halos en traits d'au moins 0,2 mm, petits textes
d'au moins 5,3 pt, sans transparence ; textes clairs sur le violet épaissis pour compenser
l'encre du fond (voir ci-dessus) ; petites étiquettes dorées des pages claires dans un or plus
foncé, lisible.

Couleurs principales de la pochette : extérieur améthyste #b596dc → #a886d3 → #9a76ca, lettres
#1a0c30 et #1f0d40, ornements or #4f370b → #d4ae55 ; intérieur ivoire #fdf9f1 → lilas très pâle
#efe7f5, lettres #2b1a45. Les PDF restent en RVB ; l'imprimante (ou l'imprimeur) les convertit sans perte
visible. Pour un tirage chez un imprimeur, une épreuve couleur reste conseillée.

### Réglages selon le papier

Billets et menus sur **papier couché brillant**, pochettes sur **papier couché mat** :

- **Imprimante jet d'encre** : utiliser du papier couché *jet d'encre* (papier photo brillant
  ou mat, recto verso). Le couché « offset » vendu pour l'imprimerie n'absorbe pas l'encre :
  elle reste humide, perle et bave dans les zones foncées. Dans le pilote, choisir le type de
  papier exact (« papier photo brillant » pour billets et menus, « papier photo mat » pour les
  pochettes) et la qualité la plus haute ; désactiver tout mode économie d'encre.
- **Imprimante laser** : choisir le type « brillant » / « épais » (ou « cartonné ») selon le
  grammage, pour que le toner soit bien fixé.
- **Pochettes sur carton, laser couleur** : carton **blanc et lisse** (satiné ou couché laser,
  200 à 250 g, dans la limite du bac manuel de l'imprimante) ; un carton crème ternit le
  violet, et sur un carton à grain (vergé, toilé, martelé) le toner ne descend pas dans les
  creux : aplats marbrés, petits textes troués. Passer les feuilles par le **bac manuel**, type
  de papier « épais » / « carte » correspondant au grammage (sinon le toner, mal cuit, sort
  pâle et s'efface au doigt), mode **couleur** forcé, qualité la plus haute, **économie de
  toner désactivée**, taille réelle (100 %). **Rainer** le pli avant de plier : sur le carton,
  le toner se fendille sur un pli non rainé. Imprimer une feuille d'essai avant le tirage.
- **Recto verso sur papier brillant** : laisser sécher le recto 10 à 15 minutes avant le verso.
  Si l'imprimante ne fait pas le recto verso sur ce papier, imprimer la page 1, puis remettre
  la feuille retournée sur le bord long et imprimer la page 2 (faire un essai sur papier
  ordinaire pour repérer le bon sens).

## Dates et lieux

- **Demande en mariage (surprise)**, dimanche 1er novembre 2026, dès 18h, au restaurant Iroko
  (Glass) : invitation `invitation-demande/`
- **Escale 1 : mariage coutumier**, mercredi 16 décembre 2026, à La Sablière (entrée Hôtel Onomo) :
  début de la cérémonie à 12h30
- **Escale 2 : mariage civil**, vendredi 18 décembre 2026, à l'Hôtel de ville de Libreville : arrivée
  des invités à 12h, célébration du mariage à 13h
- **Escale 3 : soirée de gala**, vendredi 18 décembre 2026, aux Anges d'Ema (Charbonnages, avant
  l'école conventionnée), avec la carte de menu

La couverture du passeport ne porte que la date du 18 décembre 2026 (réglage
`passeport.escaleCouverture` dans `infos.js`).

## Modifier les textes

Tous les textes personnalisables sont dans **`infos.js`** (les intitulés fixes comme
« Carte d'embarquement » restent dans le code) : prénoms, lieux, horaires, catégories de
billets (nom, couleur, classe), code vestimentaire, textes du passeport (texte du dos, invitation, « Royaume de l'Amour »…)
et plats du menu (buffet : entrées, plats chauds, accompagnements, desserts). Sur la carte, une
rubrique de plus de 6 plats s'affiche sur deux colonnes, et les précisions entre parenthèses
(ingrédients, morceau) en italique plus petit. Le recto est presque plein : avant d'ajouter
des plats, vérifier l'aperçu `carte-menu.html`.

À valider avant l'impression (ce sont encore des propositions) :

- les autres horaires du mariage coutumier (arrivée des invités proposée à 11h30, de la
  belle-famille à 12h00, fin de la cérémonie à 15h00), ceux de la soirée de gala, et l'heure
  du cocktail après le mariage civil (proposée à 14h).

Le nom du ou des invités (« Passager(s) ») et le numéro de table restent en
pointillés pour être écrits à la main.

## Régénérer les fichiers

```bash
cd mariage-raika-frederic
npm install
npx playwright install chromium
node exporter.js            # la version choisie dans infos.js (theme)
node exporter.js --toutes   # les 4 versions de couleurs et un nuancier comparatif
node exporter.js --seulement=etiquette-vin,etiquette-eau   # certains éléments seulement
node exporter.js --xerox-b7035   # édition noir et blanc pour laser monochrome (export/xerox-b7035/ ;
                                 # PDF convertis en niveaux de gris si Ghostscript, gs, est installé)
```

## Organisation du code

| Fichier | Rôle |
|---|---|
| `infos.js` | Tous les textes (le seul fichier à modifier) |
| `themes.js`, `commun.css` | Les 4 versions de couleurs, avec leur identifiant : A `violet` (retenue), B `minuit`, C `champagne`, D `argent` |
| `passeport.js/.css`, `billet.js/.css`, `menu.js/.css`, `etiquettes.js/.css`, `tables.js/.css`, `affiches.js/.css`, `demande.js/.css` | Dessin de chaque élément (`demande` : invitation à la demande en mariage) |
| `pochette-passeport.html`, `billet-invitation.html`, `carte-menu.html`, `etiquette-vin.html`, `etiquette-eau.html`, `cartes-tables.html`, `affiches.html`, `invitation-demande.html` | Aperçu de chaque élément dans le navigateur, au format d'origine (`billet-invitation.html?categorie=classique` pour le billet classique ; `cartes-tables.html` : les feuilles A4 à imprimer, `?table=5` pour une seule ; `?theme=minuit`, par exemple, pour une autre version : billets, menu, étiquettes et cartes de table gardent les couleurs réglées dans `infos.js`) |
| `impression.html` | Planches A4 (`?doc=passeport`, `billet`, `menu`, `vin` ou `eau` ; `&categorie=classique` pour le billet classique). Les cartes de table, elles, sont déjà des feuilles A4 : `cartes-tables.html` |
| `maquettes.html` | Maquettes (`?scene=pochette`, `billet`, `billet-classique`, `menu`, `ensemble`, `vin`, `eau`, `tables` ou `affiches`) |
| `nuancier.html` | Les 4 versions de couleurs côte à côte |
| `exporter.js` | Génère tout le dossier `export/` |

## Polices

Great Vibes, Playfair Display, Cormorant Garamond, Montserrat, Space Mono, Norican et Lora sont incluses
dans `polices/` (licence SIL Open Font License, voir `polices/LICENCE-OFL.txt` ; Satisfy, de
l'extérieur de la pochette : licence Apache 2.0, voir `polices/LICENCE-APACHE-2.0-satisfy.txt`).
Il n'y a donc pas besoin d'Internet pour afficher ou imprimer les fichiers.
