# Bilan Facebook du RCA en PDF

Rapport de 2 pages A4 sur la page Facebook du Rugby Club Akanda (page 1366308376572989) :
chiffres clés, abonnés, vues par jour, points clés, publications depuis le dernier bilan,
top 10 des publications, moyennes par type de publication et publications qui font le plus réagir.

## Produire un bilan

1. Interroger Supermetrics (Facebook Insights, `ds_id` FB, compte `1366308376572989`,
   `date_range_type` `last_30_days_inc`, fuseau `Africa/Libreville`, `compress` false) :
   - jours : `Date,page_followers,page_media_view,page_post_engagements,page_post_reactions_total,page_video_views`
   - publications : `Date,post_ID,post_type,post_message,post_media_views,post_total_media_views_unique,post_reactions_total,post_comments_on_post,post_shares_on_post`
     avec `settings: {"include_all_published_posts": true}`
2. Enregistrer chaque tableau `data` dans `jours.json` et `publications.json` (le texte d'une publication peut être réduit à sa première ligne).
3. `python3 preparer.py jours.json publications.json donnees.json --debut <premier jour> --fin <dernier jour> --dernier <date du bilan précédent>`
4. `PW=$(npm root -g)/playwright node generer.js donnees.json` → `pdf/bilan-facebook-rca-<dernier jour>.pdf`

Les titres et les types de publication (vidéos des règles, fiches postes, compétitions, vie du club…)
sont déduits automatiquement du texte des publications, dans `rapport.html`.
