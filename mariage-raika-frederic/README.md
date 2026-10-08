# Mariage de Raïka & Frédéric — pochette passeport, billet d'invitation et carte de menu

Supports imprimables aux couleurs violet & or du « Passeport de Mariage » (version A,
Violet royal & or). Il n'y a pas de photo du couple : le visuel principal est le
monogramme **R & F**, avec l'initiale de la mariée placée avant celle du marié.

## Les fichiers à utiliser : `export/violet/`

Un dossier par élément (`pochette-passeport/`, `billet-invitation/`, `carte-menu/`) :

| Fichier | Usage |
|---|---|
| `…-A4-8k.pdf` | **À imprimer sur A4**, recto verso bord long : plusieurs exemplaires par feuille, fond perdu 3 mm, traits de coupe. Chaque exemplaire est une image 8K (≈ 1 000 dpi) |
| `…-A4-vectoriel.pdf` | La même planche en vectoriel (fichier plus léger, textes nets à toute taille) |
| `…-maquette-8k.jpg` | Maquette de présentation réaliste, 7680 × 4320 (8K) |
| `…-maquette-8k.pdf` | La même maquette sur A4 paysage, centrée avec 10 mm de marge blanche (imprimable telle quelle à 100 %) |
| `…-recto-8k.jpg`, `…-verso-8k.jpg`, `…-exterieur-8k.jpg`, `…-interieur-8k.jpg`, `…-couverture-8k.jpg` | Chaque face à plat, 7680 px sur le grand côté (partage numérique, WhatsApp…) |

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
« ajuster à la page »). Les versos sont placés et orientés pour tomber derrière les rectos :

- **Pochette** : une fois la feuille découpée et pliée au milieu (repères « pli » en
  pointillés), l'invitation se trouve derrière la couverture et la page d'identité derrière
  le dos, à l'endroit.
- **Billet** : le verso se lit à l'endroit en retournant le billet de haut en bas.
- **Carte de menu** : le verso se lit à l'endroit en retournant la carte de gauche à droite.

Faites un essai sur papier ordinaire avant le tirage final : si le verso est décalé,
vérifiez que l'impression est bien à 100 % et en « bord long ».

Découpe : suivre les traits de coupe (massicot ou cutter et règle) ; le fond perdu de 3 mm
absorbe les petits écarts. Conseils : papier 250 à 350 g, finition mate ou soft-touch ;
coins arrondis de 3 mm conseillés pour la pochette, comme sur la maquette. Les PDF sont en
RVB : demandez une épreuve couleur si vous passez par un imprimeur (le violet vif peut
légèrement se ternir en quadrichromie).

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
```

## Organisation du code

| Fichier | Rôle |
|---|---|
| `infos.js` | Tous les textes (le seul fichier à modifier) |
| `themes.js`, `commun.css` | Les 4 versions de couleurs, avec leur identifiant : A `violet` (retenue), B `minuit`, C `champagne`, D `argent` |
| `passeport.js/.css`, `billet.js/.css`, `menu.js/.css` | Dessin de chaque élément |
| `pochette-passeport.html`, `billet-invitation.html`, `carte-menu.html` | Aperçu de chaque élément dans le navigateur, au format d'origine (`?theme=minuit`, par exemple, pour une autre version) |
| `impression.html` | Planches A4 (`?doc=passeport`, `billet` ou `menu`) |
| `maquettes.html` | Maquettes (`?scene=pochette`, `billet`, `menu` ou `ensemble`) |
| `nuancier.html` | Les 4 versions de couleurs côte à côte |
| `exporter.js` | Génère tout le dossier `export/` |

## Polices

Great Vibes, Playfair Display, Cormorant Garamond, Montserrat et Space Mono sont incluses
dans `polices/` (licence SIL Open Font License, voir `polices/LICENCE-OFL.txt`).
Il n'y a donc pas besoin d'Internet pour afficher ou imprimer les fichiers.
