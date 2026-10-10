# Mariage de Raïka & Frédéric — pochette passeport, billet d'invitation, carte de menu et étiquettes de bouteilles

Supports imprimables aux couleurs violet & or du « Passeport de Mariage » (version A,
Violet améthyste & or). Il n'y a pas de photo du couple : le visuel principal est le
monogramme **R & F**, avec l'initiale de la mariée placée avant celle du marié.

## Les fichiers à utiliser : `export/violet/`

Un dossier par élément (`pochette-passeport/`, `billet-invitation/`, `carte-menu/`,
`etiquette-vin/`, `etiquette-eau/`) :

| Fichier | Usage |
|---|---|
| `…-A4-8k.pdf` | **À imprimer sur A4** (imprimante de bureau), recto verso bord long : plusieurs exemplaires par feuille, fond perdu 3 mm, traits de coupe. Chaque exemplaire est une image 8K (≈ 1 000 dpi), sans transparence, avec un grain invisible qui évite les bandes dans les dégradés |
| `…-A4-vectoriel.pdf` | La même planche en vectoriel (fichier léger, textes nets à toute taille), plutôt pour un imprimeur professionnel : elle contient des transparences que certains pilotes d'imprimante de bureau rendent moins bien |
| `…-maquette-8k.jpg` | Maquette de présentation réaliste, 7680 × 4320 (8K) |
| `…-maquette-8k.pdf` | La même maquette sur A4 paysage, centrée avec 10 mm de marge blanche (imprimable telle quelle à 100 %) |
| `…-recto-8k.jpg`, `…-verso-8k.jpg`, `…-exterieur-8k.jpg`, `…-interieur-8k.jpg`, `…-couverture-8k.jpg`, `…-face-8k.jpg` | Chaque face à plat, 7680 px sur le grand côté (partage numérique, WhatsApp…) |

Et `ensemble-maquette-8k.jpg` / `.pdf` : les trois supports réunis sur une même maquette.

## Impression sur A4

Pour tenir sur une feuille A4 avec fond perdu, traits de coupe et 8 mm de marge (zone que
les imprimantes n'impriment pas), les trois éléments sont imprimés à **88,5 %** de leur
dessin d'origine :

| Élément | Format fini | Par feuille A4 |
|---|---|---|
| Pochette passeport | ouverte 185,9 × 131 mm, pliée en deux : 92,9 × 131 mm | 2 (A4 portrait) |
| Billet d'invitation | 185,9 × 87,6 mm | 3 (A4 portrait) |
| Carte de menu | 87,6 × 185,9 mm | 3 (A4 paysage) |

Chaque PDF A4 a deux pages : **page 1 = rectos, page 2 = versos**. Imprimer en
**recto verso avec retournement sur le bord long**, à **100 %** (taille réelle, sans
« ajuster à la page »). Les PDF sont au format A4 exact et demandent eux-mêmes ces réglages
(Acrobat Reader, Chrome et Edge les présélectionnent) : vérifiez-les tout de même dans la
fenêtre d'impression. Les versos sont placés et orientés pour tomber derrière les rectos :

- **Pochette** : une fois la feuille découpée et pliée au milieu (repères « pli » en
  pointillés), l'invitation se trouve derrière la couverture et la page d'identité derrière
  le dos, à l'endroit.
- **Billet** : le verso se lit à l'endroit en retournant le billet de haut en bas.
- **Carte de menu** : le verso se lit à l'endroit en retournant la carte de gauche à droite.

Faites un essai sur papier ordinaire avant le tirage final : si le verso est décalé,
vérifiez que l'impression est bien à 100 % et en « bord long ».

Découpe : suivre les traits de coupe (massicot ou cutter et règle) ; le fond perdu de 3 mm
absorbe les petits écarts. Conseils : papier 250 à 350 g, finition mate ou soft-touch ;
coins arrondis de 3 mm conseillés pour la pochette, comme sur la maquette.

## Étiquettes de bouteilles

Dans la charte du billet (carte d'embarquement, monogramme, trajet CLB → MAR, guillochis),
mais en **or champagne** plutôt qu'en violet : fond ivoire et champagne, bandeaux dorés,
textes bronze foncé. Le fond clair demande très peu d'encre (35 à 65 % en moyenne) et toutes
les teintes restent dans la gamme d'une imprimante (écart ΔE < 2).

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
- **Eau** : l'étiquette de 200 mm convient aux bouteilles de 33 cl courantes (environ 6 cm de
  diamètre, 19 cm de tour). Coller d'abord le bord gauche, faire le tour, puis rabattre le bord
  droit (le talon « 33 cl ») par-dessus : les 15 premiers millimètres, sans texte, passent
  dessous. Mesurez le tour de vos bouteilles avec un ruban : s'il dépasse 19,5 cm, le format se
  change dans `etiquettes.js` (`FORMATS_ETIQUETTES`).
- Textes des étiquettes (« Première classe », « Cuvée », « Grand vin de mariage »,
  « Eau minérale », « 33 cl »…) : section `etiquettes` d'`infos.js`.

## Couleurs et impression

Le violet royal d'origine, très foncé et très saturé, sortait de la gamme des imprimantes : à
l'impression il ressortait terne, presque noir sur les bords, avec beaucoup d'encre. Il est
remplacé par un **violet améthyste** plus clair, de même teinte, et toutes les couleurs
(violets, ors, ivoire) ont été choisies dans la gamme d'une imprimante quadri (CMJN) :

- écart entre l'écran et l'impression inférieur à 2 (ΔE), soit invisible à l'œil, contre 25
  en moyenne pour l'ancien violet ;
- au plus 186 % d'encre sur les aplats violets (250 % pour les petits textes), contre près de
  300 % avant : sur papier couché, l'encre ne pénètre pas ; moins chargée, elle sèche sans
  perler ni marbrer.

Les détails fins sont dessinés pour tenir à l'impression (mesures sur l'imprimé, à 88,5 %) :
traits dorés d'au moins 0,18 mm, guillochis et halos en traits d'au moins 0,2 mm, petits textes
d'au moins 5,3 pt, sans transparence ; textes clairs sur le violet très légèrement épaissis
(0,04 mm) pour compenser l'encre du fond ; petites étiquettes dorées des pages claires dans un
or plus foncé, lisible.

Couleurs principales : fond #7e5ea9 → #6f4e9d → #61438d, bandeaux #61438d / #6a4998, or
#e2c487. Les PDF restent en RVB ; l'imprimante (ou l'imprimeur) les convertit sans perte
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
- **Recto verso sur papier brillant** : laisser sécher le recto 10 à 15 minutes avant le verso.
  Si l'imprimante ne fait pas le recto verso sur ce papier, imprimer la page 1, puis remettre
  la feuille retournée sur le bord long et imprimer la page 2 (faire un essai sur papier
  ordinaire pour repérer le bon sens).

## Dates et lieux

- **Escale 1 : mariage coutumier**, mercredi 16 décembre 2026, à La Sablière (entrée Hôtel Onomo)
- **Escale 2 : mariage civil**, vendredi 18 décembre 2026, à l'Hôtel de ville de Libreville, à partir de 13h
- **Escale 3 : soirée de gala**, vendredi 18 décembre 2026, aux Anges d'Ema (Charbonnages, avant
  l'école conventionnée), avec la carte de menu

La couverture du passeport ne porte que la date du 18 décembre 2026 (réglage
`passeport.escaleCouverture` dans `infos.js`).

## Modifier les textes

Tous les textes personnalisables sont dans **`infos.js`** (les intitulés fixes comme
« Carte d'embarquement » restent dans le code) : prénoms, lieux, horaires, contacts RSVP,
code vestimentaire, textes du passeport (texte du dos, invitation, « Royaume de l'Amour »…)
et plats du menu.

À valider avant l'impression (ce sont encore des propositions) :

- les horaires détaillés du mariage coutumier et de la soirée de gala, et le détail
  du programme du civil après 13h ;
- les numéros de téléphone RSVP (`XX XX XX XX`) et la date limite de réponse ;
- le menu, à valider avec le traiteur.

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
```

## Organisation du code

| Fichier | Rôle |
|---|---|
| `infos.js` | Tous les textes (le seul fichier à modifier) |
| `themes.js`, `commun.css` | Les 4 versions de couleurs, avec leur identifiant : A `violet` (retenue), B `minuit`, C `champagne`, D `argent` |
| `passeport.js/.css`, `billet.js/.css`, `menu.js/.css`, `etiquettes.js/.css` | Dessin de chaque élément |
| `pochette-passeport.html`, `billet-invitation.html`, `carte-menu.html`, `etiquette-vin.html`, `etiquette-eau.html` | Aperçu de chaque élément dans le navigateur, au format d'origine (`?theme=minuit`, par exemple, pour une autre version ; les étiquettes restent en or champagne) |
| `impression.html` | Planches A4 (`?doc=passeport`, `billet`, `menu`, `vin` ou `eau`) |
| `maquettes.html` | Maquettes (`?scene=pochette`, `billet`, `menu`, `ensemble`, `vin` ou `eau`) |
| `nuancier.html` | Les 4 versions de couleurs côte à côte |
| `exporter.js` | Génère tout le dossier `export/` |

## Polices

Great Vibes, Playfair Display, Cormorant Garamond, Montserrat et Space Mono sont incluses
dans `polices/` (licence SIL Open Font License, voir `polices/LICENCE-OFL.txt`).
Il n'y a donc pas besoin d'Internet pour afficher ou imprimer les fichiers.
