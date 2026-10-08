/* ==================================================================
   INFORMATIONS DU MARIAGE
   C'est le seul fichier à modifier pour changer les textes du billet
   d'invitation et de la carte de menu. Les lieux, horaires et contacts
   ci-dessous sont des exemples à remplacer.
   ================================================================== */

const INFOS = {
  // Couleurs : "violet", "minuit", "champagne" ou "argent" (voir themes.js).
  theme: "violet",

  // Le prénom féminin se place avant le prénom masculin.
  mariee: "Raïka",
  marie: "Frédéric",

  devise: "Deux valent mieux qu'un",
  deviseSource: "Ecclésiaste 4:9",

  /* ---------------------------- Billet ---------------------------- */
  vol: "RF 1812", // initiales R·F + date du mariage civil (18/12)
  depart: { code: "CLB", ville: "Célibat" },
  arrivee: { code: "MAR", ville: "Mariage" },
  classe: "Invité d'honneur",
  porte: "Cœur",

  // Les étapes s'affichent dans cet ordre (ordre chronologique).
  evenements: [
    {
      escale: "Escale 1",
      titre: "Mariage coutumier",
      jour: "Mercredi",
      date: "16 décembre 2026",
      dateCourte: "16.12.2026",
      lieu: "Lieu à préciser",
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
      lieu: "Mairie — à préciser",
      programme: [
        ["10h00", "Arrivée des invités"],
        ["10h30", "Arrivée du futur marié"],
        ["10h45", "Arrivée de la future mariée"],
        ["11h00", "Célébration du mariage"],
        ["12h00", "Cocktail & séance photos"],
      ],
    },
    {
      escale: "Escale 3",
      titre: "Soirée de gala",
      jour: "Vendredi",
      date: "18 décembre 2026",
      dateCourte: "18.12.2026",
      lieu: "Salle à préciser",
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
    nationalite: "Amour",
    validite: "Pour la vie",
    verset: "Celui qui trouve une femme trouve le bonheur ; c'est une grâce qu'il obtient de l'Éternel.",
    versetSource: "Proverbes 18:22",
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
