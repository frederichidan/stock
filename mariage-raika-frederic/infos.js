/* ==================================================================
   INFORMATIONS DU MARIAGE
   C'est le seul fichier à modifier pour changer les textes de la pochette
   passeport, du billet d'invitation, de la carte de menu et des étiquettes
   de bouteilles.
   Restent à valider (propositions) : les horaires du coutumier et de la
   soirée, et l'heure du cocktail du civil.
   ================================================================== */

const INFOS = {
  // Couleurs : "violet" (version A, retenue), "minuit", "champagne" ou "argent" (voir themes.js).
  theme: "violet",
  // Couleurs de la carte de menu et des étiquettes de bouteilles : "blanc" = blanc & or (fond
  // blanc, textes et décors dorés), "or" = or champagne (fond ivoire, bandeaux dorés), "argent"
  // = argent ; pour le menu, "" = les couleurs de la version ci-dessus (pour les étiquettes,
  // toute autre valeur revient au blanc & or). La pochette passeport garde celles de la
  // version ; les billets ont une couleur par catégorie (`billets` plus bas).
  couleurs: { menu: "blanc", etiquettes: "blanc" },

  // Le prénom féminin se place avant le prénom masculin.
  mariee: "Raïka",
  marie: "Frédéric",

  devise: "Deux valent mieux qu’un",
  deviseSource: "Ecclésiaste 4:9",

  /* ---------------------------- Billet ---------------------------- */
  invitationBillet: "ont la joie de vous inviter à embarquer pour leur mariage",
  vol: "RF 1812", // initiales R·F + date du mariage civil (18/12)
  depart: { code: "CLB", ville: "Célibat" },
  arrivee: { code: "MAR", ville: "Mariage" },
  classe: "Invité d’honneur", // classe affichée sur les étiquettes d'eau
  porte: "Cœur",

  // Deux catégories de billets : premium pour les invités VIP (or champagne) et classique pour
  // les autres invités (argent). `couleur` : "or", "argent" ou "" (couleurs de la version).
  billets: {
    premium: { nom: "Premium", couleur: "or", classe: "Invité d’honneur" },
    classique: { nom: "Classique", couleur: "argent", classe: "Invité" },
  },

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
        // Début de la cérémonie à 12h30.
        ["11h30", "Arrivée des invités"],
        ["12h00", "Arrivée de la belle-famille"],
        ["12h30", "Début de la cérémonie"],
        ["15h00", "Fin de la cérémonie & photos"],
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
        // Accueil des invités à 12h, célébration à 13h.
        ["12h00", "Arrivée des invités"],
        ["12h30", "Arrivée du futur marié"],
        ["12h45", "Arrivée de la future mariée"],
        ["13h00", "Célébration du mariage"],
        ["14h00", "Cocktail & séance photos"],
      ],
    },
    {
      escale: "Escale 3",
      titre: "Soirée de gala",
      jour: "Vendredi",
      date: "18 décembre 2026",
      dateCourte: "18.12.2026",
      lieu: "Les Anges d’Ema",
      precision: "Charbonnages, avant l’école conventionnée",
      programme: [
        ["19h00", "Accueil des invités"],
        ["20h00", "Entrée des mariés"],
        ["20h30", "Ouverture du buffet"],
        ["22h00", "Pièce montée"],
        ["22h30", "Ouverture du bal"],
      ],
    },
  ],

  codeVestimentaire: "Touches de violet & d’or",

  /* ----------------------- Pochette passeport ----------------------- */
  passeport: {
    titre: "Passeport",
    sousTitre: "de Mariage",
    emetteur: "Royaume de l’Amour",
    numero: "RF181226",
    // Escale dont la date figure sur la couverture et la page d'identité (2 = mariage civil, 18 décembre).
    escaleCouverture: 2,
    nationalite: "Amour",
    validite: "Pour la vie",
    // Texte au dos de la pochette ; `versetSource` vide = pas de référence affichée.
    verset:
      "Seigneur, je déclare que mon union sera protégée de toute attaque. Ce que tu unis dans ma vie ne sera jamais séparé par la jalousie, la pauvreté ou l’adversité.",
    versetSource: "",
    invitation:
      "ont l’immense joie de vous convier à leur union et seraient honorés de votre présence à chacune des escales de ce beau voyage.",
    bonVoyage: "Bon voyage\u202f!",
  },

  /* --------------------- Étiquettes de bouteilles --------------------- */
  // Vin : étiquette avant de 90 × 120 mm. Eau 33 cl : étiquette qui fait le tour de la
  // bouteille, 200 × 50 mm (voir etiquettes.js pour changer les formats).
  etiquettes: {
    vin: {
      classe: "Première classe",
      titre: "Cuvée",
      mention: "Grand vin de mariage",
    },
    eau: {
      nom: "Eau minérale",
      contenance: "33 cl",
      mention: "Rafraîchissement à bord",
      voeu: "vous souhaitent un agréable voyage",
    },
  },

  /* ------------------------- Carte de menu ------------------------- */
  menu: {
    titre: "Menu",
    evenement: "Soirée de gala",
    date: "Vendredi 18 décembre 2026",
    // Une rubrique de plus de 6 plats s'affiche sur deux colonnes.
    rubriques: [
      {
        titre: "Entrées",
        plats: [
          "Salade 1 (laitue, œuf, tomate, avocat, carotte)",
          "Salade 2 (pâtes, thon, maïs, olive, concombre)",
        ],
      },
      {
        titre: "Plats chauds",
        plats: [
          "Brochette de poisson",
          "Brochette de viande",
          "Brochette de poulet",
          "Brochette de crevettes",
          "Cotis braisé",
          "Poulet braisé (pilon)",
          "Poisson frit",
          "Poisson au four",
          "Poisson salé",
          "Follong (maquereau fumé, carotte)",
          "Saucisse de Toulouse",
          "Aubergine",
          "Sanglier",
          "Porc-épic",
          "Queue de bœuf sautée",
          "Mini paquet de concombre",
          "Mini paquet d’arachide",
        ],
      },
      {
        titre: "Accompagnements",
        plats: [
          "Riz cantonais",
          "Riz rouge / jaune",
          "Banane vapeur",
          "Beignet",
          "Manioc / fang obamba",
          "Petits pains",
          "Patates grillées",
        ],
      },
      {
        titre: "Desserts",
        plats: ["Crêpes", "Plateau de fruits", "Gâteaux"],
      },
    ],
  },
};
