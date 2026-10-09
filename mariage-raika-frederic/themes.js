/* Déclinaisons de couleurs, toutes tirées de la palette du mariage :
   nuit #1c1036 · violet royal #4a2384 · or antique #a07a32 · or champagne #c9a464 · argent #bcbec9.
   La version retenue (violet) utilise un violet améthyste plus clair, imprimable : #674696.

   `principal` : fond du recto du billet et de la carte de menu ;
   `verso`     : fond du verso du billet (programme).
   « sombre » = textes clairs sur fond foncé, « clair » = textes violets sur fond clair.
   Les couleurs elles-mêmes sont définies dans commun.css. */

const THEMES = {
  violet: { nom: "Violet améthyste & or", principal: "sombre", verso: "clair" },
  minuit: { nom: "Nuit, or & argent", principal: "sombre", verso: "sombre" },
  champagne: { nom: "Or champagne & violet", principal: "clair", verso: "clair" },
  argent: { nom: "Argent, violet & or", principal: "clair", verso: "clair" },
};

if (typeof module !== "undefined") module.exports = THEMES;
