/* ==================================================================
   INFORMATIONS DU MARIAGE
   C'est le seul fichier à modifier pour changer les textes de la pochette
   passeport, du billet d'invitation et de la carte de menu.
   Restent à valider (propositions) : les horaires du coutumier et de la
   soirée, le détail du programme du civil après 13h, la date limite et
   les contacts RSVP, et le menu.
   ================================================================== */

const INFOS = {
  // Couleurs : "violet" (version A, retenue), "minuit", "champagne" ou "argent" (voir themes.js).
  theme: "violet",

  // Le prénom féminin se place avant le prénom masculin.
  mariee: "Raïka",
  marie: "Frédéric",

  devise: "Deux valent mieux qu'un",
  deviseSource: "Ecclésiaste 4:9",

  /* ---------------------------- Billet ---------------------------- */
  invitationBillet: "ont la joie de vous inviter à embarquer pour leur mariage",
  vol: "RF 1812", // initiales R·F + date du mariage civil (18/12)
  depart: { code: "CLB", ville: "Célibat" },
  arrivee: { code: "MAR", ville: "Mariage" },
  classe: "Invité d'honneur",
  porte: "Cœur",

  // Les étapes s'affichent dans cet ordre (ordre chronologique).
  // `precision` (facultatif) s'affiche sous le lieu, en plus petit.
  evenements: [
    {
      escale: "Escale 1",
      titre: "Mariage coutumier",
      jour: "Mercredi",
      date: "16 décembre 2026",
      dateCourte: "16.12.2026",
      lieu: "La Sablière",
      precision: "Entrée Hôtel Onomo",
      programme: [
        ["14h00", "Arrivée des invités"],
        ["14h30", "Arrivée de la belle-famille"],
        ["15h00", "Début de la cérémonie"],
        ["17h30", "Fin de la cérémonie & photos"],
      ],
    },
    {
      escale: "Escale 2",
      titre: "Mariage civil",
      jour: "Vendredi",
      date: "18 décembre 2026",
      dateCourte: "18.12.2026",
      lieu: "Hôtel de ville de Libreville",
      programme: [
        ["13h00", "Arrivée des invités"],
        ["13h30", "Arrivée du futur marié"],
        ["13h45", "Arrivée de la future mariée"],
        ["14h00", "Célébration du mariage"],
        ["15h00", "Cocktail & séance photos"],
      ],
    },
    {
      escale: "Escale 3",
      titre: "Soirée de gala",
      jour: "Vendredi",
      date: "18 décembre 2026",
      dateCourte: "18.12.2026",
      lieu: "Les Anges d'Ema",
      precision: "Charbonnages, avant l'école conventionnée",
      programme: [
        ["19h00", "Accueil des invités"],
        ["20h00", "Entrée des mariés"],
        ["20h30", "Ouverture du buffet"],
        ["22h00", "Pièce montée"],
        ["22h30", "Ouverture du bal"],
      ],
    },
  ],

  rsvp: {
    avant: "30 novembre 2026",
    contacts: ["Raïka · XX XX XX XX", "Frédéric · XX XX XX XX"],
  },
  codeVestimentaire: "Touches de violet & d'or",

  /* ----------------------- Pochette passeport ----------------------- */
  passeport: {
    titre: "Passeport",
    sousTitre: "de Mariage",
    emetteur: "Royaume de l'Amour",
    numero: "RF181226",
    // Escale dont la date figure sur la couverture et la page d'identité (2 = mariage civil, 18 décembre).
    escaleCouverture: 2,
    nationalite: "Amour",
    validite: "Pour la vie",
    // Texte au dos de la pochette ; `versetSource` vide = pas de référence affichée.
    verset:
      "Seigneur, je déclare que mon union sera protégée de toute attaque. Ce que tu unis dans ma vie ne sera jamais séparé par la jalousie, la pauvreté ou l'adversité.",
    versetSource: "",
    invitation:
      "ont l'immense joie de vous convier à leur union et seraient honorés de votre présence à chacune des escales de ce beau voyage.",
    bonVoyage: "Bon voyage !",
  },

  /* ------------------------- Carte de menu ------------------------- */
  menu: {
    titre: "Menu",
    evenement: "Soirée de gala",
    date: "Vendredi 18 décembre 2026",
    rubriques: [
      {
        titre: "Cocktail de bienvenue",
        plats: [
          "Cocktail signature « Violet Royal »",
          "Feuilletés, accras & brochettes de crevettes",
        ],
      },
      {
        titre: "Entrée",
        plats: ["Salade d'avocat & crevettes, vinaigrette aux agrumes"],
      },
      {
        titre: "Plats",
        plats: [
          "Poulet braisé, sauce nyembwe",
          "Filet de capitaine grillé, beurre citronné",
          "Riz parfumé, bananes plantains & légumes sautés",
        ],
      },
      {
        titre: "Desserts",
        plats: [
          "Pièce montée des mariés",
          "Salade de fruits exotiques & mignardises",
        ],
      },
      {
        titre: "Boissons",
        plats: [
          "Champagne, vins rouges & blancs",
          "Jus de bissap & de gingembre, sodas, eaux",
        ],
      },
    ],
  },
};
