# Mariage de Raïka & Frédéric — pochette passeport, billet d'invitation et carte de menu

Supports imprimables aux couleurs violet & or du « Passeport de Mariage ».
Il n'y a pas de photo du couple : le visuel principal est le monogramme **R & F**,
avec l'initiale de la mariée placée avant celle du marié.

| Fichier | Contenu | Format |
|---|---|---|
| `pochette-passeport.html` | Extérieur : dos (alliances et déclaration pour l'union) et couverture « Passeport de Mariage » datée du 18 décembre 2026. Intérieur : invitation avec les tampons des escales, et page d'identité où le monogramme remplace la photo | feuille A5 210 × 148 mm, pliée en passeport A6 (105 × 148 mm) |
| `billet-invitation.html` | Recto : carte d'embarquement avec talon. Verso : programme du voyage (3 escales) | 210 × 99 mm (1/3 de A4) |
| `carte-menu.html` | Recto : menu de la soirée de gala. Verso : monogramme et devise | 99 × 210 mm (1/3 de A4) |
| `maquettes.html` | Maquettes de présentation (`?scene=pochette`, `billet`, `menu` ou `ensemble`) | 16:9 |
| `impression.html` | Planches pour l'imprimeur : fond perdu 3 mm + traits de coupe (`?doc=passeport`, `billet` ou `menu`) | format fini + 2 × 12 mm |
| `export/violet/` | Version A retenue : un dossier par élément (voir ci-dessous) | |
| `nuancier.html` | Les 4 versions de couleurs côte à côte (comparatif) | |

## Versions de couleurs

**Version retenue : A, Violet royal & or.** C'est la version par défaut (`theme: "violet"`
dans `infos.js`) et la seule exportée. Les 3 autres versions restent disponibles,
toutes tirées de la palette du mariage (nuit, violet royal, or antique, or champagne, argent) :

| Version | Dossier | Rendu |
|---|---|---|
| A. Violet royal & or (retenue) | `export/violet/` | fond violet, textes or et ivoire (comme le passeport) |
| B. Nuit, or & argent | `export/minuit/` (avec `--toutes`) | fond nuit très foncé, or et argent, programme sur fond foncé |
| C. Or champagne & violet | `export/champagne/` (avec `--toutes`) | fond champagne clair, prénoms violets, ornements or |
| D. Argent, violet & or | `export/argent/` (avec `--toutes`) | fond argent nacré, prénoms violets, ornements or |

## Contenu de `export/violet/`

Un dossier par élément (`pochette-passeport/`, `billet-invitation/`, `carte-menu/`), avec :

| Fichier | Usage |
|---|---|
| `…-maquette-8k.jpg` | Maquette de présentation réaliste (posé sur marbre, ombres, grain du papier), **7680 × 4320** (8K) |
| `…-imprimeur.pdf` | **PDF pour l'imprimeur** : fond perdu 3 mm, traits de coupe, repères de pli (pochette) |
| `…-format-fini.pdf` | PDF au format exact, sans fond perdu (imprimante personnelle, envoi numérique) |
| `…-recto-8k.jpg`, `…-verso-8k.jpg`, `…-exterieur-8k.jpg`, `…-interieur-8k.jpg`, `…-couverture-8k.jpg` | Chaque face à plat, **7680 px** sur le grand côté |

Et `ensemble-maquette-8k.jpg` : les trois supports réunis sur une même maquette.
Avec `--toutes`, les mêmes dossiers sont produits pour les 4 versions, plus un nuancier
comparatif de 4696 × 7680. Les PDF sont vectoriels, polices incluses : ils restent nets
à n'importe quelle taille d'impression. Leurs textes dorés sont redessinés en dégradé
vectoriel (sans masque de transparence) pour éviter les fines coutures que certains
logiciels affichent autour des textes en dégradé.

Pour voir une version dans le navigateur, ajoutez `?theme=` à l'adresse,
par exemple `billet-invitation.html?theme=champagne`. La version par défaut
se choisit dans `infos.js` (`theme: "violet"`). Les teintes sont réglées dans
`commun.css` et la liste des versions dans `themes.js`.

## Dates

- **Escale 1 : mariage coutumier**, mercredi 16 décembre 2026, à La Sablière (entrée Hôtel Onomo)
- **Escale 2 : mariage civil**, vendredi 18 décembre 2026, à l'Hôtel de ville de Libreville, à partir de 13h
- **Escale 3 : soirée de gala**, vendredi 18 décembre 2026, aux Anges d'Ema (Charbonnages, avant
  l'école conventionnée), avec la carte de menu

La couverture du passeport ne porte que la date du 18 décembre 2026 (réglage
`passeport.escaleCouverture` dans `infos.js`).

## Modifier les textes

Tous les textes personnalisables sont dans **`infos.js`** (les intitulés fixes comme « Carte d'embarquement » restent dans le code) : prénoms, lieux, horaires, contacts RSVP,
code vestimentaire, textes du passeport (verset, invitation, « Royaume de l'Amour »…)
et plats du menu. Les autres fichiers n'ont pas besoin d'être modifiés.

À valider avant l'impression (ce sont encore des propositions) :

- les horaires détaillés du mariage coutumier et de la soirée de gala, et le détail
  du programme du civil après 13h ;
- les numéros de téléphone RSVP (`XX XX XX XX`) et la date limite de réponse ;
- le menu, à valider avec le traiteur.

Le nom du ou des invités (« Passager(s) ») et le numéro de table restent en
pointillés pour être écrits à la main.

## Imprimer ou régénérer les fichiers

**Méthode simple :** ouvrir le fichier `.html` dans Google Chrome, puis
*Imprimer → Enregistrer au format PDF*, avec *Marges : aucune* et
*Graphiques d'arrière-plan* coché.

**Méthode automatique** (régénère `export/` pour la version choisie dans `infos.js` ; ajoutez `--toutes` pour les 4 versions et le nuancier) :

```bash
cd mariage-raika-frederic
npm install playwright
npx playwright install chromium
node exporter.js
```

### Recto verso, retournement sur le bord long

Tous les PDF (imprimeur et format fini) sont prévus pour un **recto verso avec
retournement sur le bord long** : page 1 = recto, page 2 = verso.

- **Pochette passeport** : la page 2 (intérieur) est volontairement **tête-bêche**
  (tournée de 180°). Avec un retournement sur le bord long, c'est ce qui place la page
  d'identité derrière le dos et l'invitation derrière la couverture, à l'endroit une fois
  la feuille pliée au milieu (repères « pli » sur le PDF imprimeur).
- **Billet** (paysage) : le verso se lit à l'endroit en retournant le billet de haut en bas.
- **Carte de menu** (portrait) : le verso se lit à l'endroit en retournant la carte
  de gauche à droite.

Faites un essai sur papier ordinaire avant le tirage final.

Conseils pour l'imprimeur : papier 300 à 350 g, finition mate ou soft-touch.
La dorure à chaud sur le monogramme et les prénoms donne un très bel effet.
Les PDF sont en RVB : l'imprimeur les convertit en CMJN (demandez une épreuve couleur,
le violet vif peut légèrement se ternir en quadrichromie).

## Polices

Great Vibes, Playfair Display, Cormorant Garamond, Montserrat et Space Mono sont incluses
dans `polices/` (licence SIL Open Font License, voir `polices/LICENCE-OFL.txt`).
Il n'y a donc pas besoin d'Internet pour afficher ou imprimer les fichiers.
