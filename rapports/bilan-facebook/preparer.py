"""Prépare donnees.json pour generer.js à partir des deux réponses Supermetrics (Facebook Insights, ds_id FB).

Entrées : les tableaux « data » renvoyés par data_query (compress=false), enregistrés tels quels
(première ligne = en-têtes), avec les champs demandés dans cet ordre :
  jours.json        : Date, page_followers, page_media_view, page_post_engagements, page_post_reactions_total, page_video_views
  publications.json : Date, post_ID, post_type, post_message, post_media_views, post_total_media_views_unique,
                      post_reactions_total, post_comments_on_post, post_shares_on_post
Le texte des publications peut être réduit à sa première ligne.

usage : python3 preparer.py jours.json publications.json sortie.json --debut AAAA-MM-JJ --fin AAAA-MM-JJ [--dernier AAAA-MM-JJ]
"""
import argparse, json

ap = argparse.ArgumentParser()
ap.add_argument('jours'); ap.add_argument('publications'); ap.add_argument('sortie')
ap.add_argument('--debut', required=True); ap.add_argument('--fin', required=True); ap.add_argument('--dernier')
a = ap.parse_args()


def lignes(f):
    t = json.load(open(f, encoding='utf-8'))
    if isinstance(t, dict):
        t = t.get('data', t)
    return t[1:] if t and isinstance(t[0], list) and isinstance(t[0][0], str) and not t[0][0][:1].isdigit() else t


n = lambda v: 0 if v in (None, '', 'null') else int(float(v))
jours = [{'date': r[0], 'abonnes': n(r[1]), 'vues': n(r[2]), 'interactions': n(r[3]), 'reactions': n(r[4]), 'vues_video': n(r[5])}
         for r in lignes(a.jours)]
pubs = []
for r in lignes(a.publications):
    t = str(r[2] or '')
    pubs.append({'date': r[0], 'post_id': r[1], 'type_fb': t,
                 'type': 'Vidéo' if 'video' in t or 'reel' in t else ('Photo' if t in ('photo', 'cover_photo', 'profile_media', 'album') else 'Autre'),
                 'message': str(r[3] or '').split('\n')[0][:200], 'vues': n(r[4]), 'personnes': n(r[5]), 'reactions': n(r[6]),
                 'commentaires': n(r[7]), 'partages': n(r[8]), 'lien': 'https://www.facebook.com/' + str(r[1])})
d = {'page': 'Rugby Club Akanda', 'periode': {'debut': a.debut, 'fin': a.fin}, 'extrait_le': a.fin, 'jours': jours, 'publications': pubs}
if a.dernier:
    d['dernier_bilan'] = a.dernier
json.dump(d, open(a.sortie, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(a.sortie, len(jours), 'jours,', len(pubs), 'publications')
