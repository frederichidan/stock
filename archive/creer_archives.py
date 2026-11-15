"""Archive des visuels du Rugby Club Akanda : volumes thématiques de moins de 29 Mo + une archive unique qui les regroupe.

Chaque volume est un ZIP autonome (il s'ouvre seul) et contient le sommaire LISEZMOI.txt.
Les fichiers sont renommés proprement ; les sources (HTML, scripts, polices) ne sont pas incluses.

Usage : python3 archive/creer_archives.py <dossier de sortie>   (depuis la racine du dépôt)
"""
import os
import sys
import zipfile

LIMITE = 29 * 1024 * 1024
A = 'affiches/'
V = 'video/'

VOLUMES = [
    ('RCA-1-Identite-visuelle', 'Écusson, logos du sponsor Bernabé, bannière et publications Facebook', [
        (A + 'ecusson-rugby-club-akanda/ecusson-v2.png', 'Ecusson/ecusson-rca.png'),
        (A + 'ecusson-rugby-club-akanda/ecusson-8k.png', 'Ecusson/ecusson-rca-8k.png'),
        (A + 'ecusson-rugby-club-akanda/ecusson-8k.pdf', 'Ecusson/ecusson-rca-8k.pdf'),
        (A + 'ecusson-rugby-club-akanda/ecusson-vectoriel.svg', 'Ecusson/ecusson-rca-vectoriel.svg'),
        (A + 'polo-bernabe/bernabe.svg', 'Sponsor-Bernabe/logo-bernabe-rouge-blanc.svg'),
        (A + 'polo-bernabe/bernabe-marine.svg', 'Sponsor-Bernabe/logo-bernabe-rouge-marine.svg'),
        (A + 'polo-bernabe/maquette-photo/logo-bernabe-1200.png', 'Sponsor-Bernabe/logo-bernabe-rouge-blanc.png'),
        (A + 'banniere-facebook/banniere-facebook-1640x624.png', 'Facebook/banniere-facebook-1640x624.png'),
        (A + 'banniere-facebook/banniere-facebook-3280x1248.png', 'Facebook/banniere-facebook-3280x1248.png'),
        ('facebook/publications-27-10-2026.md', 'Facebook/publications-27-10-2026.txt'),
    ]),
    ('RCA-2-Affiches', 'Assemblée générale, recrutement, entraînements', [
        (A + 'ag-rugby-club-akanda/affiche.png', 'Assemblee-generale/affiche-ag.png'),
        (A + 'ag-rugby-club-akanda/affiche.pdf', 'Assemblee-generale/affiche-ag.pdf'),
        (A + 'recrutement-rugby-club-akanda/affiche.png', 'Recrutement/affiche-recrutement-a4.png'),
        (A + 'recrutement-rugby-club-akanda/affiche.pdf', 'Recrutement/affiche-recrutement-a4.pdf'),
        (A + 'recrutement-rugby-club-akanda/affiche-2x3.png', 'Recrutement/affiche-recrutement-2x3.png'),
        (A + 'recrutement-rugby-club-akanda/affiche-2x3.pdf', 'Recrutement/affiche-recrutement-2x3.pdf'),
        (A + 'entrainement-04-10-2026/affiche.png', 'Entrainement-4-octobre/affiche-entrainement-4-octobre.png'),
        (A + 'entrainement-04-10-2026/affiche.pdf', 'Entrainement-4-octobre/affiche-entrainement-4-octobre.pdf'),
        (A + 'entrainement-04-10-2026/affiche-2x3.png', 'Entrainement-4-octobre/affiche-entrainement-4-octobre-2x3.png'),
        (A + 'entrainement-04-10-2026/affiche-2x3.pdf', 'Entrainement-4-octobre/affiche-entrainement-4-octobre-2x3.pdf'),
        (A + 'entrainements-seniors/affiche.png', 'Entrainements-seniors/affiche-entrainements-seniors.png'),
        (A + 'entrainements-seniors/affiche.pdf', 'Entrainements-seniors/affiche-entrainements-seniors.pdf'),
        (A + 'entrainements-seniors/affiche-2x3.png', 'Entrainements-seniors/affiche-entrainements-seniors-2x3.png'),
        (A + 'entrainements-seniors/affiche-2x3.pdf', 'Entrainements-seniors/affiche-entrainements-seniors-2x3.pdf'),
    ]),
    ('RCA-3-Communiques-et-fiches', 'Communiqués, fiche individuelle, fiches postes du rugby à 7', [
        (A + 'communique-fiches/affiche.png', 'Communique-fiches-dernier-delai/communique-dernier-delai-a4.png'),
        (A + 'communique-fiches/affiche.pdf', 'Communique-fiches-dernier-delai/communique-dernier-delai-a4.pdf'),
        (A + 'communique-fiches/affiche-2x3.png', 'Communique-fiches-dernier-delai/communique-dernier-delai-2x3.png'),
        (A + 'communique-fiches/affiche-2x3.pdf', 'Communique-fiches-dernier-delai/communique-dernier-delai-2x3.pdf'),
        (A + 'communique-equipements/communique.png', 'Communique-equipements/communique-equipements.png'),
        (A + 'communique-equipements/communique.pdf', 'Communique-equipements/communique-equipements.pdf'),
        (A + 'fiche-individuelle/fiche-individuelle-8k.png', 'Fiche-individuelle/fiche-individuelle-8k.png'),
        (A + 'fiche-individuelle/fiche-individuelle.pdf', 'Fiche-individuelle/fiche-individuelle.pdf'),
        (A + 'fiches-postes/fiches-postes-rugby-a-7.pdf', 'Fiches-postes/fiches-postes-rugby-a-7.pdf'),
    ] + [(A + f'fiches-postes/fiche-{n}.png', f'Fiches-postes/fiche-{n}.png') for n in (
        '0-les-7-postes', '1-pilier-gauche', '2-talonneur', '3-pilier-droit',
        '4-demi-de-melee', '5-demi-d-ouverture', '6-centre', '7-ailier')]),
    ('RCA-4-Porte-documents', 'Porte-documents A4 prêt à imprimer', [
        (A + 'porte-documents/porte-documents-apercu.png', 'Porte-documents/porte-documents-apercu.png'),
        (A + 'porte-documents/porte-documents-ext.pdf', 'Porte-documents/porte-documents-exterieur.pdf'),
        (A + 'porte-documents/porte-documents-int.pdf', 'Porte-documents/porte-documents-interieur.pdf'),
        (A + 'porte-documents/porte-documents-gabarit.pdf', 'Porte-documents/porte-documents-gabarit-decoupe.pdf'),
    ]),
    ('RCA-5-Maillots-polos-casquettes', 'Maillots, polos, casquettes et maquette photo avec le sponsor', [
        (A + 'maillots/maillots-8k.png', 'Maillots/maillots-domicile-exterieur-8k.png'),
        (A + 'maillots/maillots.pdf', 'Maillots/maillots-domicile-exterieur.pdf'),
        (A + 'polo-bernabe/polos-bleu-blanc-apercu.png', 'Polos/polos-bleu-blanc-apercu.png'),
        (A + 'polo-bernabe/polos-bleu-blanc.pdf', 'Polos/polos-bleu-blanc.pdf'),
        (A + 'polo-bernabe/polo-bernabe-apercu.png', 'Polos/polo-bernabe-logo-manche-apercu.png'),
        (A + 'polo-bernabe/tenue-polo-casquette-apercu.png', 'Tenue-polo-casquette/tenue-polo-casquette-apercu.png'),
        (A + 'polo-bernabe/tenue-polo-casquette.pdf', 'Tenue-polo-casquette/tenue-polo-casquette.pdf'),
        (A + 'polo-bernabe/maquette-photo/maquette-polo-casquette-bernabe-4k.jpg', 'Maquette-photo/maquette-polo-casquette-bernabe-4k.jpg'),
        (A + 'polo-bernabe/maquette-photo/maquette-polo-casquette-bernabe-apercu.jpg', 'Maquette-photo/maquette-polo-casquette-bernabe-apercu.jpg'),
    ]),
    ('RCA-6-Polos-detoures', 'Polos bleu et blanc, face et dos, sur fond transparent (pour montages)', [
        (A + 'polo-bernabe/polo-bleu-face.png', 'Polos-detoures/polo-bleu-face.png'),
        (A + 'polo-bernabe/polo-bleu-dos.png', 'Polos-detoures/polo-bleu-dos.png'),
        (A + 'polo-bernabe/polo-blanc-face.png', 'Polos-detoures/polo-blanc-face.png'),
        (A + 'polo-bernabe/polo-blanc-dos.png', 'Polos-detoures/polo-blanc-dos.png'),
    ]),
    ('RCA-7-Videos-recrutement-ecole', 'Spot recrutement et spot école de rugby (Full HD)', [
        (V + 'spot-recrutement/spot-recrutement-rca-1080p.mp4', 'Videos/spot-recrutement-rca-1080p.mp4'),
        (V + 'spot-ecole-de-rugby/spot-ecole-de-rugby-rca-1080p.mp4', 'Videos/spot-ecole-de-rugby-rca-1080p.mp4'),
        (V + 'spot-ecole-de-rugby/photos/photo1-rca.jpg', 'Photos-ecole-de-rugby/photo1-rca.jpg'),
        (V + 'spot-ecole-de-rugby/photos/photo2-rca.jpg', 'Photos-ecole-de-rugby/photo2-rca.jpg'),
        (V + 'spot-ecole-de-rugby/photos/photo4-rca.jpg', 'Photos-ecole-de-rugby/photo4-rca.jpg'),
    ]),
    ('RCA-8-Video-regles-rugby-a-7', 'Spot « Les règles du rugby à 7 » (Full HD, 2 min 45)', [
        (V + 'spot-regles-rugby-7/spot-regles-rugby-7-1080p.mp4', 'Videos/spot-regles-rugby-a-7-1080p.mp4'),
    ]),
]

COMPRESSE = ('.pdf', '.svg', '.txt', '.md')


def sommaire():
    lignes = ['RUGBY CLUB AKANDA – ARCHIVE DES VISUELS', '=' * 40, '',
              'L’archive est découpée en volumes thématiques (chacun s’ouvre seul) :', '']
    for nom, titre, fichiers in VOLUMES:
        lignes.append(f'{nom}.zip – {titre}')
        lignes += [f'    {dst}' for _, dst in fichiers]
        lignes.append('')
    lignes += [
        'Formats :',
        '  - PDF : à utiliser pour l’impression (qualité maximale).',
        '  - PNG / JPG : pour WhatsApp, Facebook et les écrans.',
        '  - SVG : logos vectoriels, agrandissables à l’infini (broderie, sérigraphie, signalétique).',
        '',
        'Figma (tenue officielle, éléments modifiables) : https://www.figma.com/design/fJAwNIesfzqi2M7PzSMSUV',
        'Versions 4K des vidéos et PNG 8K des affiches : disponibles sur demande (trop lourdes pour un envoi direct).',
        '',
        'Plus qu’un club, une famille !',
    ]
    return '\n'.join(lignes) + '\n'


def main(sortie):
    os.makedirs(sortie, exist_ok=True)
    txt = sommaire()
    for nom, titre, fichiers in VOLUMES:
        chemin = os.path.join(sortie, nom + '.zip')
        with zipfile.ZipFile(chemin, 'w') as z:
            z.writestr(f'{nom}/LISEZMOI.txt', txt, compress_type=zipfile.ZIP_DEFLATED)
            for src, dst in fichiers:
                mode = zipfile.ZIP_DEFLATED if src.lower().endswith(COMPRESSE) else zipfile.ZIP_STORED
                z.write(src, f'{nom}/{dst}', compress_type=mode)
        taille = os.path.getsize(chemin)
        print(f'{nom}.zip  {taille / 1024 / 1024:5.1f} Mo  ({len(fichiers)} fichiers)')
        assert taille < LIMITE, f'{nom} dépasse la limite'
    with open(os.path.join(sortie, 'LISEZMOI.txt'), 'w') as f:
        f.write(txt)
    # archive unique regroupant les 8 volumes
    complet = os.path.join(sortie, 'RCA-Visuels-Complet.zip')
    with zipfile.ZipFile(complet, 'w') as z:
        z.writestr('RCA-Visuels-Complet/LISEZMOI.txt', txt, compress_type=zipfile.ZIP_DEFLATED)
        for nom, _, _ in VOLUMES:
            z.write(os.path.join(sortie, nom + '.zip'), f'RCA-Visuels-Complet/{nom}.zip', compress_type=zipfile.ZIP_STORED)
    print(f'RCA-Visuels-Complet.zip  {os.path.getsize(complet) / 1024 / 1024:5.1f} Mo')


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'archive-rca')
