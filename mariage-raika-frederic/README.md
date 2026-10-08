# Mariage de Raïka & Frédéric — billet d'invitation et carte de menu

Supports imprimables aux couleurs violet & or du « Passeport de Mariage ».
Il n'y a pas de photo du couple : le visuel principal est le monogramme **R & F**,
avec l'initiale de la mariée placée avant celle du marié.

| Fichier | Contenu | Format |
|---|---|---|
| `billet-invitation.html` | Recto : carte d'embarquement avec talon. Verso : programme du voyage (3 escales) | 210 × 99 mm (1/3 de A4) |
| `carte-menu.html` | Recto : menu de la soirée de gala. Verso : monogramme et devise | 99 × 210 mm (1/3 de A4) |
| `export/<version>/` | PDF prêts pour l'imprimeur + JPG 300 dpi (pour WhatsApp et l'aperçu) | |
| `nuancier.html`, `export/nuancier.jpg` | Toutes les versions de couleurs côte à côte | |

## Versions de couleurs

Chaque support existe en 4 versions, toutes tirées de la palette du mariage
(nuit, violet royal, or antique, or champagne, argent) :

| Version | Dossier | Rendu |
|---|---|---|
| 1. Violet royal & or | `export/violet/` | fond violet, textes or et ivoire (comme le passeport) |
| 2. Nuit, or & argent | `export/minuit/` | fond nuit très foncé, or et argent, programme sur fond foncé |
| 3. Or champagne & violet | `export/champagne/` | fond champagne clair, prénoms violets, ornements or |
| 4. Argent, violet & or | `export/argent/` | fond argent nacré, prénoms violets, ornements or |

Pour voir une version dans le navigateur, ajoutez `?theme=` à l'adresse,
par exemple `billet-invitation.html?theme=champagne`. La version par défaut
se choisit dans `infos.js` (`theme: "violet"`). Les teintes sont réglées dans
`commun.css` et la liste des versions dans `themes.js`.

## Dates

- **Escale 1 : mariage coutumier**, mercredi 16 décembre 2026
- **Escale 2 : mariage civil**, vendredi 18 décembre 2026
- **Escale 3 : soirée de gala**, vendredi 18 décembre 2026 (avec la carte de menu)

## Modifier les textes

Tous les textes sont dans **`infos.js`** : prénoms, lieux, horaires, contacts RSVP,
code vestimentaire et plats du menu. Les autres fichiers n'ont pas besoin d'être modifiés.

À compléter avant l'impression (ce sont des exemples) :

- les lieux (« Lieu à préciser », « Mairie — à préciser », « Salle à préciser ») ;
- les horaires de chaque escale ;
- les numéros de téléphone RSVP (`XX XX XX XX`) et la date limite de réponse ;
- le menu, à valider avec le traiteur.

Le nom du ou des invités (« Passager(s) ») et le numéro de table restent en
pointillés pour être écrits à la main.

## Imprimer ou régénérer les fichiers

**Méthode simple :** ouvrir le fichier `.html` dans Google Chrome, puis
*Imprimer → Enregistrer au format PDF*, avec *Marges : aucune* et
*Graphiques d'arrière-plan* coché.

**Méthode automatique** (régénère tout le dossier `export/`, pour toutes les versions) :

```bash
cd mariage-raika-frederic
npm install playwright
npx playwright install chromium
node exporter.js
```

Conseils pour l'imprimeur : papier 300 à 350 g, finition mate ou soft-touch.
La dorure à chaud sur le monogramme et les prénoms donne un très bel effet.
Le format 1/3 de A4 permet d'imprimer 3 billets ou 3 menus par feuille A4.

## Polices

Great Vibes, Playfair Display, Cormorant Garamond et Montserrat sont incluses
dans `polices/` (licence SIL Open Font License, voir `polices/LICENCE-OFL.txt`).
Il n'y a donc pas besoin d'Internet pour afficher ou imprimer les fichiers.
