# Mariage de Raïka & Frédéric — pochette passeport, billet d'invitation et carte de menu

Supports imprimables aux couleurs violet & or du « Passeport de Mariage ».
Il n'y a pas de photo du couple : le visuel principal est le monogramme **R & F**,
avec l'initiale de la mariée placée avant celle du marié.

| Fichier | Contenu | Format |
|---|---|---|
| `pochette-passeport.html` | Extérieur : dos (alliances et déclaration pour l'union) et couverture « Passeport de Mariage » datée du 18 décembre 2026. Intérieur : invitation avec les tampons des escales, et page d'identité où le monogramme remplace la photo | feuille A5 210 × 148 mm, pliée en passeport A6 (105 × 148 mm) |
| `billet-invitation.html` | Recto : carte d'embarquement avec talon. Verso : programme du voyage (3 escales) | 210 × 99 mm (1/3 de A4) |
| `carte-menu.html` | Recto : menu de la soirée de gala. Verso : monogramme et devise | 99 × 210 mm (1/3 de A4) |
| `export/violet/` | Version A retenue : PDF vectoriels prêts pour l'imprimeur + images JPG en 8K | |
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

## Rendus 8K

Chaque face est exportée en JPG avec **7680 pixels sur le grand côté** (8K) :
7680 × 3620 pour le billet, 3620 × 7680 pour le menu, 7680 × 5412 pour la pochette
ouverte, et 5448 × 7680 pour la couverture seule (`passeport-couverture.jpg`,
pratique à partager). Avec `--toutes`, un nuancier comparatif de 4696 × 7680 est aussi
produit. Les PDF sont vectoriels : ils restent nets à n'importe quelle taille d'impression.

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

Conseils pour l'imprimeur : papier 300 à 350 g, finition mate ou soft-touch.
La dorure à chaud sur le monogramme et les prénoms donne un très bel effet.
Le format 1/3 de A4 permet d'imprimer 3 billets ou 3 menus par feuille A4.
Pochette passeport : imprimer le PDF en recto verso sur une feuille A5, avec retournement
sur le bord court (148 mm), puis plier au milieu. Faites un essai pour vérifier que
l'intérieur se trouve bien derrière la couverture.

## Polices

Great Vibes, Playfair Display, Cormorant Garamond, Montserrat et Space Mono sont incluses
dans `polices/` (licence SIL Open Font License, voir `polices/LICENCE-OFL.txt`).
Il n'y a donc pas besoin d'Internet pour afficher ou imprimer les fichiers.
