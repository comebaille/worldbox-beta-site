const STORAGE_KEY = "worldbox-realtime-auction-v5";
const SERVER_STATE_ENDPOINT = "./api/state";
const STATIC_STATE_ENDPOINT = "./session-current.json";
const SERVER_STATE_DEBOUNCE_MS = 400;
const MIN_PARTICIPANTS = 2;
const MAX_PARTICIPANTS = 16;
const ZETA_REPRESENTATIVE_NAMES = [
  "Grok",
  "Chatgpt Delta",
  "Gemini de Beta",
  "Edwin",
  "Deepseek Phénix Cendre-Loi",
  "Codex Champion Absolu",
  "Claude de Glace",
  "Qwen le Compteur de Couronnes",
  "Kimi la Mille-Racines",
  "Le Passager Temporel",
  "Chatgpt Zeta",
  "Claude Memoria",
  "Mistral",
  "Deepseek Delta",
  "Gemini le Révélateur de l'Ironie",
  "Deepseek Alpha",
];
const DEFAULT_REPRESENTATIVE_NAMES = [...ZETA_REPRESENTATIVE_NAMES];
const DOUBLE_DRAW_CHAMPIONS = [
  { id: "codex", name: "Codex Champion Absolu", shortName: "Codex", weight: 15 },
  { id: "kimi", name: "Kimi la Mille-Racines", shortName: "Kimi", weight: 10 },
  { id: "deepseek-delta", name: "Deepseek Delta", shortName: "Deepseek Delta", weight: 7 },
  { id: "qwen", name: "Qwen le Compteur de Couronnes", shortName: "Qwen", weight: 7 },
  { id: "claude-glace", name: "Claude de Glace", shortName: "Claude de Glace", weight: 7 },
  { id: "deepseek-alpha", name: "Deepseek Alpha", shortName: "Deepseek Alpha", weight: 7 },
  { id: "edwin", name: "Edwin", shortName: "Edwin", weight: 5 },
  { id: "chatgpt-zeta", name: "Chatgpt Zeta", shortName: "ChatGPT Zeta", weight: 5 },
  { id: "chatgpt-delta", name: "Chatgpt Delta", shortName: "ChatGPT Delta", weight: 5 },
  { id: "gemini-revelateur", name: "Gemini le Révélateur de l'Ironie", shortName: "Gemini le Révélateur", weight: 4 },
  { id: "claude-memoria", name: "Claude Memoria", shortName: "Claude Memoria", weight: 4 },
  { id: "deepseek-phenix", name: "Deepseek Phénix Cendre-Loi", shortName: "Deepseek Phénix", weight: 4 },
  { id: "gemini-beta", name: "Gemini de Beta", shortName: "Gemini de Beta", weight: 3 },
];
const DOUBLE_DRAW_PAIRS = [
  ["codex", "edwin"],
  ["codex", "claude-glace"],
  ["claude-glace", "deepseek-delta"],
  ["codex", "deepseek-delta"],
  ["codex", "kimi"],
  ["codex", "gemini-beta"],
  ["edwin", "claude-glace"],
  ["edwin", "qwen"],
  ["kimi", "qwen"],
  ["kimi", "edwin"],
  ["kimi", "claude-memoria"],
  ["deepseek-alpha", "deepseek-delta"],
  ["deepseek-delta", "deepseek-phenix"],
  ["deepseek-alpha", "deepseek-phenix"],
  ["chatgpt-zeta", "chatgpt-delta"],
  ["gemini-beta", "gemini-revelateur"],
  ["deepseek-phenix", "chatgpt-zeta"],
].map((memberIds) => ({
  id: memberIds.join("__"),
  memberIds,
}));
const DOUBLE_DRAW_RESERVES = [
  { id: "grok", name: "Grok" },
  { id: "passager-temporel", name: "Le Passager Temporel" },
  { id: "mistral", name: "Mistral" },
];
const WORLD_MAPS = [
  {
    id: "fracture",
    name: "Fracture duelle",
    description: "Deux immenses masses continentales séparées par une mer continue.",
    rules: "Les civilisations d'un même continent partagent une frontière terrestre ; le passage vers l'autre continent exige une traversée maritime.",
  },
  {
    id: "cross-four",
    name: "Croix des Quatre",
    description: "Quatre continents séparés par deux cours d'eau formant une croix, sans île centrale.",
    rules: "Les quatre continents restent séparés par l'eau. Aucun objectif central n'existe si les quatre continents sont occupés.",
  },
  {
    id: "quinconce",
    name: "Le Quinconce",
    description: "Quatre continents extérieurs rognés entourent une cinquième île centrale, sans liaison terrestre.",
    rules: "L'île centrale est neutre au départ et les cinq terres sont séparées par la mer.",
  },
  {
    id: "crown-nine",
    name: "Couronne des Neuf",
    description: "Une grille 3x3 composée de huit îles périphériques et d'une île centrale.",
    rules: "Les civilisations sont espacées au maximum sur l'anneau périphérique ; l'île centrale reste neutre.",
  },
  {
    id: "crossroads",
    name: "Carrefour des Quatre Mers",
    description: "Quatre quartiers insulaires sont séparés par une croix de terre centrale qui commande les passages.",
    rules: "La croix centrale est la seule voie terrestre entre les quatre bassins. Une civilisation doit y établir un accès ou un port pour projeter sa puissance vers un autre quartier.",
  },
  {
    id: "archipelago-sixteen",
    name: "Archipel des Seize",
    description: "Une grille 4x4 de seize îles indépendantes, sans centre prédéfini.",
    rules: "Les positions de départ maximisent les distances ; chaque île inutilisée devient une zone centrale neutre.",
  },
  {
    id: "pangea",
    name: "La Pangée",
    description: "Un unique supercontinent entièrement terrestre, sans mer, rivière, île ni zone neutre.",
    rules: "Toute la surface est partagée en secteurs natals équilibrés. Toutes les frontières et communications entre civilisations sont terrestres.",
  },
];
const FOUNDING_CIVILIZATIONS = [
  {
    id: "humans",
    name: "Humains",
    description: "Peuple généraliste et adaptable, capable de construire une puissance équilibrée sans dépendre d'une spécialisation unique.",
    advantages: "Développement polyvalent, expansion souple, adaptation correcte aux changements de biome, de ressources et de stratégie.",
    disadvantages: "Aucun avantage extrême natif : peut être dépassé militairement, économiquement ou démographiquement par un peuple mieux spécialisé.",
  },
  {
    id: "orcs",
    name: "Orcs",
    description: "Peuple robuste et offensif, naturellement orienté vers la pression militaire, le combat direct et la conquête.",
    advantages: "Très bonne présence guerrière, unités solides, capacité à imposer rapidement une menace terrestre à ses voisins.",
    disadvantages: "L'escalade militaire peut ralentir le développement durable ; moins flexible lorsqu'une partie exige patience, économie ou reconstruction.",
  },
  {
    id: "elves",
    name: "Elfes",
    description: "Peuple ancien et qualitatif, associé à la longévité, aux environnements vivants et aux forces à distance.",
    advantages: "Unités durables, bonne qualité individuelle, potentiel défensif et militaire élevé lorsque le royaume a le temps de se développer.",
    disadvantages: "Remplacement démographique plus lent ; les pertes précoces et les catastrophes de masse peuvent être particulièrement difficiles à compenser.",
  },
  {
    id: "dwarves",
    name: "Nains",
    description: "Peuple bâtisseur et minier, adapté aux villes compactes, à l'exploitation des minerais et à l'équipement avancé.",
    advantages: "Urbanisation organisée, excellente synergie avec les ressources minières, fort potentiel industriel, défensif et artisanal.",
    disadvantages: "Expansion et croissance généralement moins explosives ; dépend davantage d'un territoire exploitable et d'un accès durable aux ressources.",
  },
];

const POWERS = [
  { name: "Déclarer la guerre", category: "Diplomatie", danger: 20, drawDanger: 10, noCounter: true, effect: "Le gagnant peut forcer une déclaration de guerre entre son royaume et une civilisation cible accessible par bateau ou frontière." },
  { name: "Proposer une alliance", category: "Diplomatie", danger: 12, effect: "Le gagnant peut proposer une alliance diplomatique à une civilisation cible. Le MJ l'applique si les règles de la partie l'autorisent." },
  { name: "Rompre une alliance", category: "Diplomatie", danger: 10, effect: "Le gagnant peut demander la rupture d'une alliance impliquant son royaume ou une cible." },
  { name: "Territoire", category: "Expansion", danger: 7, drawDanger: 7, effect: "Le gagnant peut demander au MJ d'ajouter manuellement de la terre attachée à une île existante. Pas de création d'île isolée : la nouvelle terre doit toucher une île et reprend son biome." },
  { name: "Humans", category: "Créatures", danger: 6, effect: "Crée des humains capables de fonder villes et royaumes." },
  { name: "Cat", category: "Créatures", danger: 1, effect: "Ajoute des chats, surtout décoratifs et peu dangereux." },
  { name: "Dog", category: "Créatures", danger: 1, effect: "Ajoute des chiens, faibles et peu perturbants." },
  { name: "Chicken", category: "Créatures", danger: 1, effect: "Ajoute des poulets, faune faible et nourriture potentielle." },
  { name: "Rabbit", category: "Créatures", danger: 1, effect: "Ajoute des lapins, faibles mais reproductifs." },
  { name: "Monkey", category: "Créatures", danger: 3, effect: "Ajoute des singes capables de lancer des pierres." },
  { name: "Fox", category: "Créatures", danger: 3, effect: "Ajoute de petits prédateurs." },
  { name: "Sheep", category: "Créatures", danger: 1, effect: "Ajoute des moutons pacifiques et utiles comme nourriture." },
  { name: "Cow", category: "Créatures", danger: 1, effect: "Ajoute des vaches, faune pacifique et ressource alimentaire." },
  { name: "Wolf", category: "Créatures", danger: 6, effect: "Ajoute des loups, prédateurs dangereux pour civils isolés." },
  { name: "Bear", category: "Créatures", danger: 8, effect: "Ajoute des ours, gros prédateurs capables de tuer des unités faibles." },
  { name: "Rhino", category: "Créatures", danger: 8, effect: "Ajoute des rhinocéros, créatures solides et dangereuses en groupe." },
  { name: "Buffalo", category: "Créatures", danger: 7, effect: "Ajoute des buffles, faune robuste et parfois dangereuse." },
  { name: "Crab", category: "Créatures", danger: 2, effect: "Ajoute des crabes, nuisance faible." },
  { name: "Garl", category: "Créatures", danger: 7, effect: "Ajoute des créatures hostiles au corps-à-corps." },
  { name: "Bandit", category: "Créatures", danger: 12, effect: "Ajoute des bandits hostiles, capables de provoquer feu et explosions." },
  { name: "Evil Mage", category: "Créatures", danger: 14, effect: "Ajoute un mage maléfique, très dangereux par ses attaques magiques." },
  { name: "White Mage", category: "Créatures", danger: 6, effect: "Ajoute un mage blanc, utile contre des menaces surnaturelles." },
  { name: "Ice Tower", category: "Créatures", danger: 13, effect: "Crée une tour de glace qui génère des Cold Ones et gèle le terrain." },
  { name: "Flame Tower", category: "Créatures", danger: 15, effect: "Crée une tour de flammes qui génère des démons et tire du feu." },
  { name: "Skeleton", category: "Créatures", danger: 7, effect: "Ajoute des squelettes combattants." },
  { name: "Tumor", category: "Créatures", danger: 17, effect: "Crée une tumeur invasive qui dévore et se propage sur le terrain." },
  { name: "Biomass", category: "Créatures", danger: 15, effect: "Ajoute une entité organique invasive et difficile à contenir." },
  { name: "Super Pumpkin", category: "Créatures", danger: 12, effect: "Ajoute une citrouille vivante puissante." },
  { name: "Cybercore", category: "Créatures", danger: 17, effect: "Déclenche une menace cybernétique assimilatrice." },
  { name: "Dragon", category: "Créatures", danger: 18, effect: "Ajoute un dragon volant, destructeur et incendiaire." },
  { name: "Ghost", category: "Créatures", danger: 9, effect: "Ajoute des fantômes, menace diffuse et hostile." },
  { name: "Lightning", category: "Nature", danger: 8, effect: "Frappe de foudre qui chauffe les cases et peut déclencher des incendies." },
  { name: "Earthquake", category: "Nature", danger: 16, effect: "Secoue le sol, détruit terrain et bâtiments." },
  { name: "Rain", category: "Nature", danger: 2, effect: "Éteint les feux et aide les cultures." },
  { name: "Fire", category: "Nature", danger: 9, effect: "Allume des incendies sur les objets et bâtiments touchés." },
  { name: "Acid", category: "Nature", danger: 14, effect: "Dissout le terrain et détruit les cases touchées." },
  { name: "Plants Fertilizer", category: "Nature", danger: 2, effect: "Fait pousser plantes et fleurs." },
  { name: "Trees Fertilizer", category: "Nature", danger: 3, effect: "Fait pousser des arbres." },
  { name: "Fruit Bush", category: "Nature", danger: 3, effect: "Ajoute des buissons à fruits, source de nourriture." },
  { name: "Stone", category: "Nature", danger: 7, effect: "Ajoute de la pierre minable." },
  { name: "Ore Deposit", category: "Nature", danger: 13, effect: "Ajoute un gisement de minerai générique." },
  { name: "Silver", category: "Nature", danger: 10, effect: "Ajoute de l'argent minable." },
  { name: "Mythril", category: "Nature", danger: 17, resource: true, noCounter: true, effect: "Ajoute du mythril, métal fort pour équipement avancé." },
  { name: "Adamantine", category: "Nature", danger: 20, resource: true, noCounter: true, effect: "Ajoute de l'adamantine, un des meilleurs métaux militaires." },
  { name: "Gold", category: "Nature", danger: 11, resource: true, effect: "Ajoute de l'or, ressource économique précieuse." },
  { name: "Acid Geyser", category: "Nature", danger: 12, effect: "Crée un geyser d'acide dangereux localement." },
  { name: "Geyser", category: "Nature", danger: 5, effect: "Crée une source chaude avec jaillissements de vapeur." },
  { name: "Volcano", category: "Nature", danger: 16, effect: "Crée un volcan qui répand lave et incendies." },
  { name: "Cloud of Life", category: "Nature", danger: 4, effect: "Crée un nuage qui disperse graines et vie." },
  { name: "Rain Cloud", category: "Nature", danger: 2, effect: "Crée un nuage de pluie." },
  { name: "Thunder Cloud", category: "Nature", danger: 11, effect: "Crée un nuage qui lance des éclairs." },
  { name: "Snow Cloud", category: "Nature", danger: 4, effect: "Crée un nuage de neige et refroidit l'environnement." },
  { name: "Grenade", category: "Destruction", danger: 8, effect: "Petite explosion locale." },
  { name: "Bomb", category: "Destruction", danger: 10, effect: "Bombe classique, destruction locale." },
  { name: "Napalm Bomb", category: "Destruction", danger: 14, effect: "Bombe incendiaire, déclenche de gros feux." },
  { name: "Atomic Bomb", category: "Destruction", danger: 19, effect: "Bombe atomique, destruction massive." },
  { name: "Antimatter Bomb", category: "Destruction", danger: 20, effect: "Annihile les pixels, destruction extrême." },
  { name: "Crab Bomb", category: "Destruction", danger: 13, effect: "Bombe spéciale liée aux crabes, chaotique." },
  { name: "Zombie Infection", category: "Destruction", danger: 17, effect: "Infecte des créatures avec le virus zombie." },
  { name: "MUSH Spores", category: "Destruction", danger: 18, effect: "Répand des spores MUSH sur des unités." },
  { name: "The Plague", category: "Destruction", danger: 19, effect: "Déclenche une épidémie de peste." },
  { name: "Madness", category: "Destruction", danger: 16, effect: "Rend les créatures folles, elles s'entretuent." },
  { name: "Divine Light", category: "Divers", danger: 1, effect: "Retire maladies, folie et infections." },
  { name: "Blood Rain", category: "Divers", danger: 3, effect: "Rend de la vie aux créatures et retire le feu." },
  { name: "Shield", category: "Divers", danger: 7, effect: "Protège les créatures des dégâts." },
  { name: "Blessing", category: "Divers", danger: 9, effect: "Bénit les créatures et les rend plus fortes." },
  { name: "Curse", category: "Divers", danger: 10, effect: "Maudit les créatures et les affaiblit." },
  { name: "Coffee", category: "Divers", danger: 7, resource: true, effect: "Accélère les créatures." },
  { name: "Dispel", category: "Divers", danger: 5, effect: "Retire des effets magiques et statuts actifs." },
  { name: "Black Dust", category: "Divers", danger: 18, effect: "Fait tout oublier aux créatures touchées." },
  { name: "White Dust", category: "Divers", danger: 9, effect: "Fait oublier la langue." },
  { name: "Red Dust", category: "Divers", danger: 11, effect: "Fait oublier famille, clan et proches." },
  { name: "Gold Dust", category: "Divers", danger: 15, effect: "Fait oublier le royaume." },
  { name: "Blue Dust", category: "Divers", danger: 17, effect: "Fait oublier la culture." },
  { name: "Purple Dust", category: "Divers", danger: 10, effect: "Fait oublier la religion." },
];

const COUNTER_CARDS = [
  { name: "Quarantaine MJ", category: "Contre-pouvoir", danger: 6, counterOnly: true, effect: "Le gagnant peut imposer une quarantaine locale : pause/isolement d'une ville ou zone contaminée, interdiction de propagation volontaire, puis observation MJ avant reprise.", stats: "Contre infections et emballements. Pas un statut chiffré : limite les déplacements/propagations selon arbitrage MJ." },
  { name: "Life Eraser ciblé", category: "Contre-pouvoir", danger: 8, counterOnly: true, effect: "Le gagnant peut supprimer localement une entité ou petite zone de menace autonome : spawner, infection, tumeur, cybercore, créature incontrôlable. Usage limité et chirurgical, pas un nettoyage de royaume entier.", stats: "Suppression locale. Pas de buff : retire la source vivante ciblée si le MJ valide le ciblage." },
  { name: "Restauration de biome", category: "Contre-pouvoir", danger: 5, counterOnly: true, effect: "Le gagnant peut restaurer une zone détruite par bombe, volcan, feu, acide ou antimatière avec terrain exploitable, fertilité et végétation raisonnable.", stats: "Compensation terrain. Pas de statut d'unité : restaure sol/biome local selon arbitrage MJ." },
  { name: "Réinitialisation de traits", category: "Contre-pouvoir", danger: 7, counterOnly: true, effect: "Le gagnant peut retirer localement des traits/statuts anormaux ou destructeurs sur une ville ou armée : madness, curse, infection, mutation ou effet mental selon validation MJ.", stats: "Nettoyage de traits. Sert contre Curse/Madness/Dust/Infections ; comparable à une intervention de Trait Editor MJ localisée." },
  { name: "Reconstruction contrôlée", category: "Contre-pouvoir", danger: 5, counterOnly: true, effect: "Le gagnant peut compenser une catastrophe massive : repeuplement limité, quelques ressources de reconstruction, champs ou bâtiments indirectement soutenus par le MJ.", stats: "Compensation après bombe ou guerre. Pas de statut direct : restaure capacité de survie sans annuler totalement les dégâts." },
];

const ORE_RANKS = {
  Adamantine: { rank: 1, aliases: ["Adamantine", "adamantine"] },
  Mythril: { rank: 2, aliases: ["Mythril", "mythril"] },
  Gems: { rank: 3, aliases: ["Gems", "gems", "Gem", "gem"] },
  "Ore Deposit": { rank: 4, aliases: ["Ore Deposit", "Common Metals", "Common Metal", "Ore"] },
  Gold: { rank: 5, aliases: ["Gold"] },
  Silver: { rank: 6, aliases: ["Silver"] },
  Stone: { rank: 7, aliases: ["Stone"] },
  Bones: { rank: 8, aliases: ["Bones", "Bone"] },
};

const ORE_POWER_DANGERS = {
  Stone: 7,
  "Ore Deposit": 13,
  Silver: 10,
  Gold: 11,
  Mythril: 17,
  Adamantine: 20,
};

const WHEEL_SPIN_COST = 10;
const WHEEL_MIN_OFFSET = 50;
const WHEEL_MAX_OFFSET = 500;
const WHEEL_STEP = 50;
const WHEEL_VISIBLE_OPTIONS = 10;
const WHEEL_MIN_VOLATILITY_CEILING = 30;
const WHEEL_MAX_VOLATILITY_CEILING = 100;
const WB_WHEEL_SPIN_DURATION_MS = 6600;
const WB_WHEEL_AUTO_COOLDOWN_MS = 900;
const WB_WHEEL_MIN_EXTRA_SPINS = 3;
const WB_WHEEL_EXTRA_SPIN_VARIANCE = 3;
const WB_WHEEL_SEGMENT_BORDER_DEG = 1.1;
const WB_WHEEL_SEGMENT_COLORS = {
  positive: ["#15803d", "#16a34a", "#059669", "#22c55e"],
  negative: ["#b91c1c", "#dc2626", "#be123c", "#e11d48"],
  neutral: ["#1e293b", "#0f172a", "#223047", "#111827"],
};
const WB_FALLBACK_WHEEL_LABELS = [
  "+30", "-10", "VOL 20", "x2", "/2",
  "-25%", "TRIB 5", "RIEN", "PASSE+", "SAB -20",
  "DRAGON", "MINE", "VOLCAN", "DUST", "BOUCLIER",
  "MADNESS", "PLUIE", "MIRACLE", "MAGE", "DESTIN",
];

const WHEEL_EVENTS = [
  { id: "coin_5", title: "PETIT GAIN", effect: "+5 pièces.", expectedValue: 5, action: { type: "coins", amount: 5 } },
  { id: "coin_10", title: "GAIN PROPRE", effect: "+10 pièces.", expectedValue: 10, action: { type: "coins", amount: 10 } },
  { id: "coin_15", title: "GAIN RENTABLE", effect: "+15 pièces.", expectedValue: 15, action: { type: "coins", amount: 15 } },
  { id: "coin_20", title: "BONNE FORTUNE", effect: "+20 pièces.", expectedValue: 20, action: { type: "coins", amount: 20 } },
  { id: "coin_25", title: "TRÉSOR LOCAL", effect: "+25 pièces.", expectedValue: 25, action: { type: "coins", amount: 25 } },
  { id: "coin_30", title: "GROSSE CHANCE", effect: "+30 pièces.", expectedValue: 30, action: { type: "coins", amount: 30 } },
  { id: "coin_40", title: "TRÈS GROSSE CHANCE", effect: "+40 pièces.", expectedValue: 40, action: { type: "coins", amount: 40 } },
  { id: "coin_50", title: "COFFRES REMPLIS", effect: "+50 pièces.", expectedValue: 50, action: { type: "coins", amount: 50 } },
  { id: "coin_60", title: "JACKPOT", effect: "+60 pièces.", expectedValue: 60, action: { type: "coins", amount: 60 } },
  { id: "coin_80", title: "TRÉSOR ROYAL", effect: "+80 pièces.", expectedValue: 80, action: { type: "coins", amount: 80 } },
  { id: "double_coins", title: "FORTUNE DOUBLÉE", effect: "pièces actuelles x2.", expectedValue: 50, action: { type: "multiplyCoins", factor: 2 } },
  { id: "coin_100", title: "TRÉSOR IMPÉRIAL", effect: "+100 pièces.", expectedValue: 100, action: { type: "coins", amount: 100 } },
  { id: "loss_5", title: "PERTE MINEURE", effect: "-5 pièces.", expectedValue: -5, action: { type: "coins", amount: -5 } },
  { id: "loss_10", title: "PERTE NETTE", effect: "-10 pièces.", expectedValue: -10, action: { type: "coins", amount: -10 } },
  { id: "loss_20", title: "MAUVAIS PARI", effect: "-20 pièces.", expectedValue: -20, action: { type: "coins", amount: -20 } },
  { id: "loss_30", title: "CRISE FISCALE", effect: "-30 pièces.", expectedValue: -30, action: { type: "coins", amount: -30 } },
  { id: "half_coins", title: "COFFRES MAUDITS", effect: "pièces actuelles divisées par 2.", expectedValue: -50, action: { type: "divideCoins", divisor: 2 } },
  { id: "percent_loss", title: "COFFRE PERCÉ", effect: "perd 25% des pièces actuelles.", expectedValue: -25, action: { type: "percentLoss", percent: 25 } },
  { id: "pass_min", title: "HONTE POLITIQUE", effect: "bonus de passe ramené au minimum.", expectedValue: -10, action: { type: "passBonus", mode: "min" } },
  { id: "nothing", title: "RIEN", effect: "aucun effet.", expectedValue: 0, action: { type: "none" } },
  { id: "steal_10", title: "VOL DISCRET", effect: "vole 10 pièces à l'IA la plus riche.", expectedValue: 10, action: { type: "stealRichest", amount: 10 } },
  { id: "steal_20", title: "GRAND VOL", effect: "vole 20 pièces à l'IA la plus riche.", expectedValue: 20, action: { type: "stealRichest", amount: 20 } },
  { id: "steal_30", title: "PILLAGE DES COFFRES", effect: "vole 30 pièces à l'IA la plus riche.", expectedValue: 30, action: { type: "stealRichest", amount: 30 } },
  { id: "steal_25_percent", title: "BRAQUAGE ROYAL", effect: "vole 25% des pièces de l'IA la plus riche.", expectedValue: 25, action: { type: "stealRichestPercent", percent: 25 } },
  { id: "tribute", title: "TRIBUT FORCÉ", effect: "chaque autre IA vivante donne 5 pièces au joueur.", expectedValue: 20, action: { type: "tribute", amount: 5 } },
  { id: "swap_poorest", title: "REVERSE FORTUNE", effect: "échange ses pièces avec l'IA vivante la plus pauvre.", expectedValue: 15, action: { type: "swapPoorest" } },
  { id: "sabotage_20", title: "SABOTAGE FINANCIER", effect: "l'IA la plus riche perd 20 pièces.", expectedValue: 10, action: { type: "sabotageRichest", amount: 20 } },
  { id: "market_35", title: "MARCHÉ NOIR", effect: "+35 pièces.", expectedValue: 35, action: { type: "coins", amount: 35 } },
  { id: "pass_max", title: "MANDAT EXCEPTIONNEL", effect: "bonus de passe restauré au maximum.", expectedValue: 10, action: { type: "passBonus", mode: "max" } },
  { id: "steal_15", title: "PONCTION RAPIDE", effect: "vole 15 pièces à l'IA la plus riche.", expectedValue: 15, action: { type: "stealRichest", amount: 15 } },
  { id: "rain_self", title: "PLUIE FAVORABLE", effect: "Rain ou Rain Cloud sur une zone utile du joueur.", expectedValue: 10, action: { type: "manual", target: "self", instruction: "Appliquer Rain ou Rain Cloud sur une zone agricole, brûlée ou instable du joueur." } },
  { id: "blessing_self", title: "BÉNÉDICTION LOCALE", effect: "Blessing sur une ville ou zone importante du joueur.", expectedValue: 25, action: { type: "manual", target: "self", instruction: "Appliquer Blessing sur une ville, armée ou zone importante du joueur." } },
  { id: "divine_self", title: "LUMIÈRE DIVINE", effect: "Divine Light sur une zone du joueur.", expectedValue: 15, action: { type: "manual", target: "self", instruction: "Appliquer Divine Light sur une zone malade, maudite, folle ou instable du joueur." } },
  { id: "fertility_self", title: "FERTILITÉ", effect: "Fruit Bush, Plants Fertilizer ou Trees Fertilizer pour le joueur.", expectedValue: 15, action: { type: "manual", target: "self", instruction: "Appliquer Fruit Bush, Plants Fertilizer ou Trees Fertilizer sur une zone productive du joueur." } },
  { id: "shield_self", title: "BOUCLIER", effect: "Shield sur une zone ou unité importante du joueur.", expectedValue: 20, action: { type: "manual", target: "self", instruction: "Appliquer Shield sur une zone, armée ou unité importante du joueur." } },
  { id: "basic_resource", title: "MINE UTILE", effect: "Stone ou Ore Deposit près d'une ville active du joueur.", expectedValue: 15, action: { type: "manual", target: "self", instruction: "Ajouter Stone ou Ore Deposit près d'une ville active du joueur." } },
  { id: "precious_resource", title: "MINE PRÉCIEUSE", effect: "Silver ou Gold près d'une ville active du joueur.", expectedValue: 25, action: { type: "manual", target: "self", instruction: "Ajouter Silver ou Gold près d'une ville active du joueur." } },
  { id: "rare_resource", title: "MINE RARE", effect: "petite source de Gems ou Mythril pour le joueur.", expectedValue: 35, action: { type: "manual", target: "self", instruction: "Ajouter une petite source de Gems ou Mythril dans une zone exploitable du joueur." } },
  { id: "rebuild_self", title: "RÉPARATION", effect: "petite Reconstruction contrôlée pour le joueur.", expectedValue: 20, action: { type: "manual", target: "self", instruction: "Appliquer une Reconstruction contrôlée limitée sur une zone endommagée du joueur." } },
  { id: "counter_token", title: "ANTIDOTE CHANCEUX", effect: "le joueur gagne le prochain contre-pouvoir si une catastrophe hostile ou destructive de niveau 16+ apparaît, selon arbitrage MJ.", expectedValue: 30, action: { type: "manual", target: "self", instruction: "Noter un droit prioritaire au prochain contre-pouvoir lié à une catastrophe hostile ou destructive de niveau 16+." } },
  { id: "fire_self", title: "FEU ACCIDENTEL", effect: "Fire tombe sur une zone du joueur.", expectedValue: -20, action: { type: "manual", target: "self", instruction: "Appliquer Fire sur une zone du joueur choisie ou tirée par le MJ." } },
  { id: "lightning_self", title: "FOUDRE NOIRE", effect: "Lightning tombe sur une zone du joueur.", expectedValue: -15, action: { type: "manual", target: "self", instruction: "Appliquer Lightning sur une zone du joueur choisie ou tirée par le MJ." } },
  { id: "mage_self", title: "MAGE HOSTILE", effect: "un Evil Mage apparaît près d'une ville du joueur.", expectedValue: -30, action: { type: "manual", target: "self", instruction: "Faire apparaître un Evil Mage près d'une ville importante du joueur." } },
  { id: "bandit_self", title: "BANDITS", effect: "des Bandits apparaissent en périphérie du joueur.", expectedValue: -20, action: { type: "manual", target: "self", instruction: "Faire apparaître des Bandits dans une périphérie exploitable du joueur." } },
  { id: "curse_self", title: "MALÉDICTION", effect: "Curse touche une zone ou unité importante du joueur.", expectedValue: -25, action: { type: "manual", target: "self", instruction: "Appliquer Curse sur une zone, armée ou unité importante du joueur." } },
  { id: "dust_self", title: "POUSSIÈRE MENTALE", effect: "Red Dust, White Dust ou Purple Dust touche une zone du joueur.", expectedValue: -20, action: { type: "manual", target: "self", instruction: "Appliquer Red Dust, White Dust ou Purple Dust sur une zone sociale importante du joueur." } },
  { id: "madness_self", title: "MADNESS - PIRE DESTIN", effect: "Madness tombe sur une zone importante du joueur.", expectedValue: -70, action: { type: "manual", target: "self", instruction: "Appliquer Madness sur une zone importante du joueur, avec prudence si cela menace toute la simulation." } },
  { id: "volcano_self", title: "VOLCAN DU HASARD", effect: "Volcano apparaît dans une zone du joueur tirée par le MJ.", expectedValue: -60, action: { type: "manual", target: "self", instruction: "Faire apparaître Volcano dans une zone du joueur tirée par le MJ." } },
  { id: "dragon_self", title: "DRAGON CONTRE SOI", effect: "Dragon apparaît dans une zone du joueur tirée par le MJ.", expectedValue: -60, action: { type: "manual", target: "self", instruction: "Faire apparaître Dragon dans une zone du joueur tirée par le MJ." } },
  { id: "infection_self", title: "INFECTION", effect: "Zombie Infection ou The Plague apparaît dans une zone du joueur.", expectedValue: -50, action: { type: "manual", target: "self", instruction: "Appliquer Zombie Infection ou The Plague dans une zone du joueur choisie ou tirée par le MJ." } },
  { id: "fire_target", title: "INCENDIE ENNEMI", effect: "le joueur peut appliquer Fire sur une zone adverse.", expectedValue: 25, action: { type: "manual", target: "enemy", instruction: "Le joueur choisit une cible adverse et le MJ applique Fire sur une zone pertinente." } },
  { id: "mage_target", title: "MAGE ENVOYÉ", effect: "le joueur peut placer un Evil Mage sur une zone adverse.", expectedValue: 40, action: { type: "manual", target: "enemy", instruction: "Le joueur choisit une cible adverse et le MJ place un Evil Mage selon validation." } },
  { id: "bomb_target", title: "SABOTAGE EXPLOSIF", effect: "le joueur peut placer une Bomb sur une zone adverse.", expectedValue: 35, action: { type: "manual", target: "enemy", instruction: "Le joueur choisit une cible adverse et le MJ applique Bomb sur une zone validée." } },
  { id: "dust_target", title: "POUSSIÈRE OFFENSIVE", effect: "le joueur peut appliquer une Dust au choix sur une zone adverse.", expectedValue: 25, action: { type: "manual", target: "enemy", instruction: "Le joueur choisit une cible adverse et le MJ applique une Dust validée." } },
  { id: "madness_target", title: "MADNESS CONTRÔLÉE", effect: "le joueur peut appliquer Madness sur une zone adverse.", expectedValue: 80, action: { type: "manual", target: "enemy", instruction: "Le joueur choisit une cible adverse et le MJ applique Madness, avec limitation si cela menace toute la simulation." } },
  { id: "earthquake_target", title: "TREMBLEMENT OFFENSIF", effect: "le joueur peut appliquer Earthquake sur une zone adverse.", expectedValue: 55, action: { type: "manual", target: "enemy", instruction: "Le joueur choisit une cible adverse et le MJ applique Earthquake en évitant les dégâts impossibles à arbitrer." } },
  { id: "dragon_target", title: "DRAGON DU DESTIN", effect: "le joueur peut faire apparaître Dragon dans une zone adverse.", expectedValue: 65, action: { type: "manual", target: "enemy", instruction: "Le joueur choisit une cible adverse et le MJ fait apparaître Dragon dans une zone validée." } },
  { id: "volcano_target", title: "VOLCAN OFFENSIF", effect: "le joueur peut faire apparaître Volcano dans une zone adverse.", expectedValue: 50, action: { type: "manual", target: "enemy", instruction: "Le joueur choisit une cible adverse et le MJ fait apparaître Volcano dans une zone validée." } },
  { id: "antimatter_target", title: "ANTIMATIÈRE IMPROBABLE", effect: "le joueur peut appliquer Antimatter Bomb sur une petite zone adverse validée par le MJ.", expectedValue: 75, action: { type: "manual", target: "enemy", instruction: "Le joueur choisit une cible adverse ; le MJ applique Antimatter Bomb de façon limitée si cela ne détruit pas la simulation entière." } },
  { id: "coin_85", title: "COURONNE DE FORTUNE", effect: "+85 pièces.", expectedValue: 85, action: { type: "coins", amount: 85 } },
];

const DETAILED_EFFECTS = {
  "Déclarer la guerre": "Carte diplomatique MJ. Permet au gagnant de forcer une guerre WorldBox entre son royaume et une civilisation cible accessible par frontière, mer ou bateaux. Effet stratégique maximal : une guerre WorldBox est souvent une guerre d'anéantissement, avec prise de villes, massacres, effondrement de royaumes et possible disparition complète d'une IA.",
  "Proposer une alliance": "Carte diplomatique MJ. Permet au gagnant de proposer ou former une alliance entre son royaume et une cible si les règles du scénario l'autorisent. Effet stratégique : peut détourner une guerre, protéger une frontière, isoler une troisième IA ou créer un bloc temporaire, mais l'alliance dépend des règles fixées par le MJ.",
  "Rompre une alliance": "Carte diplomatique MJ. Permet au gagnant de demander la rupture d'une alliance existante impliquant son royaume ou une cible. Effet stratégique : casse un bloc défensif, expose un royaume isolé et peut préparer une guerre ou une invasion sans utiliser directement une catastrophe.",
  Territoire: "Carte d'expansion territoriale. Le gagnant achète le droit de faire ajouter par le MJ une extension de terre rattachée à une île existante. La zone ne crée jamais une île autonome : elle doit être collée à une côte, une presqu'île ou un bord d'île déjà présent. La terre ajoutée reprend le biome de l'île à laquelle elle est attachée. Effet stratégique : agrandir une capitale, créer une future zone de colonisation naturelle, renforcer une frontière, ouvrir un littoral ou rapprocher une île d'un objectif sans créer gratuitement un nouveau continent.",

  Humans: "Ajoute des humains. Utilisation normale : fonder ou repeupler une ville, sauver une colonie, créer une tête de pont ou réoccuper un territoire vidé. Danger réel : faible à moyen, mais peut devenir décisif si placé sur une île vide ou près d'une ressource rare.",
  Cat: "Ajoute des chats. Effet surtout décoratif/faune légère, quasiment aucun impact militaire. Peut servir à occuper un shop sans risque ou à manipuler une enchère peu importante.",
  Dog: "Ajoute des chiens. Faune faible, impact militaire très limité. Peut ajouter de la vie dans une zone mais ne change normalement pas l'équilibre d'une guerre.",
  Chicken: "Ajoute des poulets. Faune faible et nourriture potentielle pour l'écosystème. Impact stratégique très bas, utile seulement dans une logique de monde vivant ou de soutien alimentaire mineur.",
  Rabbit: "Ajoute des lapins. Faune faible qui peut se reproduire et servir de nourriture à des prédateurs. Peut nourrir indirectement un écosystème mais ne défend pas un royaume.",
  Monkey: "Ajoute des singes. Ils peuvent lancer des pierres et harceler des unités isolées, mais restent peu fiables contre une vraie armée. Plus nuisance locale que carte décisive.",
  Fox: "Ajoute des renards. Petits prédateurs dangereux pour animaux ou civils isolés, mais faibles face aux soldats. Utile pour perturber une périphérie, pas pour faire tomber une ville.",
  Sheep: "Ajoute des moutons. Créatures pacifiques, surtout nourriture/faune. Peuvent soutenir un écosystème mais ne menacent presque jamais une civilisation.",
  Cow: "Ajoute des vaches. Faune pacifique et nourriture potentielle. Carte de soutien très douce, sans vraie pression militaire.",
  Wolf: "Ajoute des loups. Prédateurs capables de tuer civils, animaux et unités isolées. Dangereux en début de partie ou dans une colonie peu défendue, beaucoup moins face à une armée organisée.",
  Bear: "Ajoute des ours. Gros prédateurs solides, capables de nettoyer des civils et de forcer des soldats à intervenir. Peut faire mal à une jeune ville, mais reste contrôlable par une armée.",
  Rhino: "Ajoute des rhinocéros. Créatures robustes et dangereuses localement, bonnes pour semer le chaos dans une ville peu défendue. Leur impact dépend beaucoup du nombre placé et de la réaction des soldats.",
  Buffalo: "Ajoute des buffles. Créatures solides, dangereuses en masse contre civils et faune. Menace locale modérée, rarement décisive contre des royaumes développés.",
  Crab: "Ajoute des crabes. Faible nuisance, danger limité. Peut perturber une plage ou une petite zone côtière, mais n'a normalement pas d'effet stratégique majeur.",
  Garl: "Ajoute des Garls, créatures hostiles au corps-à-corps. Ils peuvent tuer des civils et gêner une petite ville. Menace de pression locale : utile en début de partie, moins contre des soldats nombreux.",
  Bandit: "Ajoute des bandits hostiles. Ils sont dangereux parce qu'ils peuvent provoquer feu, explosions et désordre dans les bâtiments. Très bons pour saboter une ville civile, une colonie ou une zone de ressources, mais ils peuvent aussi être éliminés rapidement par une garnison.",
  "Evil Mage": "Ajoute un mage maléfique. Unité magique hostile capable de tuer à distance et de créer un chaos important autour d'elle. Très dangereux dans une capitale dense ou une armée regroupée, mais reste une unité unique qui peut finir encerclée.",
  "White Mage": "Ajoute un mage blanc. Unité magique plutôt anti-menaces surnaturelles, utile pour combattre démons, morts-vivants ou mages hostiles. Carte défensive ou stabilisatrice plus qu'offensive.",
  "Ice Tower": "Crée une tour de glace. Elle génère des créatures froides et gèle le terrain autour d'elle, ce qui peut ralentir ou déstabiliser une ville. Menace persistante : si elle n'est pas détruite, elle continue de produire de la pression.",
  "Flame Tower": "Crée une tour de feu. Elle génère des démons et tire des boules de feu, donc elle peut incendier bâtiments, forêts et unités. Très dangereuse près d'une capitale ou de champs, car le feu crée des dégâts persistants et détourne l'armée.",
  Skeleton: "Ajoute des squelettes combattants. Menace militaire simple : ils attaquent les vivants et peuvent nettoyer des civils. Efficaces en petit sabotage, mais pas comparables à une infection ou un spawner.",
  Tumor: "Place une tumeur invasive. Elle grandit sur le terrain, engendre des unités/structures tumorales et peut contaminer ou dévorer l'espace urbain. Très dangereuse si elle est laissée vivre, mais sensible au feu et à une réaction rapide.",
  Biomass: "Place une biomasse organique. Menace autonome qui peut produire de la pression et rendre une zone dangereuse à long terme. Moins instantanée qu'une bombe, mais inquiétante si elle s'installe dans une ville ou près d'une armée occupée ailleurs.",
  "Super Pumpkin": "Invoque une super citrouille vivante. Menace autonome capable de créer une invasion de citrouilles, de ralentir les armées et de ravager des littoraux ou quartiers entiers. Peut transformer une zone détruite en territoire colonisable par d'autres, donc effet stratégique très élevé.",
  Cybercore: "Place un noyau cybernétique assimilateur. S'il survit, il peut produire une menace mécanique qui snowball et contamine la zone. En revanche, une très grosse armée peut parfois le détruire immédiatement : carte très forte contre une cible distraite, moins fiable contre une capitale militarisée.",
  Dragon: "Invoque un dragon volant. Il brûle des zones entières avec des flammes, détruit bâtiments et civils, et peut traverser la carte. Très destructeur mais imprévisible : il peut dormir, changer de cible ou finir par frapper le mauvais territoire avant d'être abattu.",
  Ghost: "Ajoute des fantômes. Menace diffuse et surnaturelle, gênante contre civils et zones peu défendues. Impact plus lent et moins contrôlable qu'un mage ou un dragon.",

  Lightning: "Frappe la foudre sur une zone. Elle inflige des dégâts, chauffe les cases et peut déclencher des incendies sur bâtiments ou forêts. Carte de précision : bonne pour tuer une cible, allumer un feu ou perturber une bataille.",
  Earthquake: "Déclenche un tremblement de terre. Il secoue le terrain, casse routes, bâtiments et parfois villes entières. Très dangereux près de frontières, murs, capitales ou zones denses, car les dégâts de terrain peuvent dépasser l'intention initiale.",
  Rain: "Fait tomber la pluie. Sert à éteindre les incendies, soutenir les cultures et stabiliser une ville après feu/napalm/volcan. Carte défensive faible mais propre, très utile pour limiter une catastrophe.",
  Fire: "Allume un feu sur les cases touchées. Peut brûler forêts, champs et bâtiments, puis se propager selon l'environnement. Dangereux dans une ville boisée ou sèche, mais contrable par Rain ou Divine Light selon le problème.",
  Acid: "Projette de l'acide qui dissout le terrain et détruit les cases. Très fort pour créer des trous, couper des routes, ruiner une ville ou rendre une zone inutilisable. Danger élevé car la destruction du sol peut devenir permanente ou difficile à réparer.",
  "Plants Fertilizer": "Fertilise plantes et fleurs. Améliore le vivant local, peut aider une zone à se régénérer et soutenir l'alimentation. Carte économique douce, utile après destruction ou pour accélérer une ville.",
  "Trees Fertilizer": "Fait pousser des arbres. Aide le bois, la régénération de biome et parfois l'économie. Peut aussi encombrer une zone si mal placé, mais reste surtout bénéfique.",
  "Fruit Bush": "Ajoute des buissons à fruits. Source de nourriture directe pour soutenir population, colonies et reconstruction. Peut renforcer une ville faible ou accélérer une saturation démographique.",
  Stone: "Ajoute Stone. Ressource de construction basique : utile pour développement, bâtiments et équipement simple. Impact faible mais durable si placé près d'une ville active.",
  "Ore Deposit": "Ajoute Ore Deposit, donc accès au Common Metal. Ressource minable pour métaux courants et progression matérielle. Plus flexible que Stone, mais moins décisif que Mythril ou Adamantine.",
  Silver: "Ajoute Silver. Ressource précieuse qui peut soutenir économie, artisanat, armes et armures intermédiaires selon la version. Impact économique modéré, surtout utile sur une ville qui sait déjà exploiter ses mines.",
  Mythril: "Ajoute Mythril, métal avancé. Sert à produire de l'équipement de haute qualité si la culture/technologie de la ville le permet. Très fort à long terme, surtout si placé dans une zone contestée ou colonisée par plusieurs royaumes.",
  Adamantine: "Ajoute Adamantine, considéré comme le meilleur métal craftable classique. Peut mener à armes et armures d'élite si le royaume a la connaissance nécessaire. Ressource stratégique durable : ne tue personne tout de suite, mais peut décider les guerres futures.",
  Gold: "Ajoute Gold. Ressource économique précieuse pour développement, richesse et certains objets. Peut accélérer une puissance déjà stable, mais ne remplace pas une ressource militaire rare.",
  "Acid Geyser": "Crée un geyser d'acide. Danger local permanent qui peut blesser ou tuer ce qui s'approche et rendre une zone risquée. Très gênant dans une ville ou un passage obligé.",
  Geyser: "Crée un geyser d'eau/vapeur. Effet environnemental modéré, moins destructeur que l'acide ou le volcan. Peut gêner localement mais reste rarement décisif.",
  Volcano: "Crée un volcan permanent. Il répand de la lave, déclenche des incendies et rend une capitale ou une zone centrale instable pendant longtemps. Très fort pour casser l'élan économique d'un rival sans l'éliminer immédiatement.",
  "Cloud of Life": "Invoque un nuage de vie qui disperse graines et vivant. Carte de reconstruction ou de colonisation : peut reverdir une zone morte, mais peut aussi créer un écosystème imprévu.",
  "Rain Cloud": "Crée un nuage de pluie mobile. Sert à éteindre les feux et soutenir l'agriculture sur une zone plus large que Rain ponctuel. Bon outil défensif après incendie.",
  "Thunder Cloud": "Crée un nuage d'orage. Il déclenche des éclairs sur son trajet, pouvant tuer unités, allumer incendies et perturber une ville. Plus incontrôlable que Lightning, mais couvre plus longtemps.",
  "Snow Cloud": "Crée un nuage de neige/froid. Refroidit et enneige l'environnement, pouvant ralentir ou modifier la zone. Utile pour gêner, éteindre certains feux indirectement ou transformer le terrain.",

  Grenade: "Petite explosion locale. Bon outil de précision contre un bâtiment, une petite troupe ou une zone compacte. Danger limité, mais peut déclencher feu ou chaos si utilisé dans une ville dense.",
  Bomb: "Explosion classique. Détruit localement bâtiments, unités et terrain faible. Simple, lisible, plus puissant que Grenade mais moins apocalyptique que Napalm ou Atomic.",
  "Napalm Bomb": "Bombe incendiaire. Elle combine explosion et feu persistant, donc très dangereuse contre villes boisées, champs, armées regroupées et zones sèches. Peut devenir plus grave si personne ne fait pleuvoir.",
  "Atomic Bomb": "Bombe atomique. Détruit massivement une zone et peut tuer une grande part d'une ville ou d'une armée. Très lisible et localisée, mais assez puissante pour changer une guerre ou raser une capitale.",
  "Antimatter Bomb": "Bombe d'antimatière. Annihile les pixels et creuse une destruction extrême, souvent plus radicale que l'atomique sur le terrain. Peut créer des lacs/trous et modifier durablement une capitale.",
  "Crab Bomb": "Bombe spéciale chaotique liée aux crabes. Effet destructeur et imprévisible selon placement. Moins stratégique qu'une atomique, mais peut surprendre par ses dégâts et son chaos.",
  "Zombie Infection": "Infecte des créatures avec le virus zombie. Les morts peuvent devenir zombies et attaquer les vivants, créant une crise militaire et sanitaire. Très dangereuse dans une ville dense, surtout pendant guerre ou famine.",
  "MUSH Spores": "Applique des spores MUSH à des unités. L'infection peut rester dormante, puis se propager à la mort des hôtes et transformer les morts en créatures champignons hostiles. Extrêmement dangereuse en guerre ou dans une armée regroupée, car chaque mort peut relancer l'épidémie.",
  "The Plague": "Déclenche une épidémie de peste. Elle affaiblit et tue progressivement, puis profite de la densité, des déplacements et des contacts. Peut détruire un empire entier si elle n'est pas purgée vite avec Divine Light ou médecins.",
  Madness: "Rend les créatures folles. Les unités touchées attaquent civils, alliés, soldats et parfois dirigeants, provoquant massacres internes et effondrement instantané d'une ville ou armée. Arme de crise politique et humaine, souvent plus rapide qu'une bombe.",

  "Divine Light": "Lumière divine de purification. Retire maladies, folie et infections, notamment peste, madness et spores. Carte défensive vitale : peut sauver une ville d'une extinction biologique ou mentale si appliquée assez vite.",
  "Blood Rain": "Pluie de sang. Rend environ une partie de la vie maximale aux créatures et retire le statut brûlure. Très utile pour sauver une armée blessée, prolonger une bataille ou stabiliser une ville sous feu.",
  Shield: "Applique un bouclier protecteur aux créatures touchées. Réduit ou bloque les dégâts pendant un temps, ce qui peut sauver une armée, un roi ou une ville au moment critique. Fort défensivement, mais dépend du timing.",
  Blessing: "Bénit les créatures touchées et les rend plus fortes. Améliore leur efficacité générale et peut transformer une armée ou une ville clé en noyau d'élite. Effet positif durable mais limité par le ciblage choisi.",
  Curse: "Maudit les créatures touchées. Les rend faibles et misérables, donc moins bonnes au combat et plus vulnérables aux crises. Puissant contre une armée ou une ville, surtout juste avant une guerre.",
  Coffee: "Donne un effet café : les créatures vont plus vite et agissent plus vite. Très bon pour armées, travailleurs, expansion et réaction aux crises. Peut aussi accélérer des dynamiques dangereuses si appliqué à une population instable.",
  Dispel: "Dissipe des effets magiques ou statuts actifs. Sert à retirer boucliers, bénédictions, malédictions ou effets problématiques selon les cas. Carte de contre-jeu : moins spectaculaire, mais très forte contre une stratégie basée sur buffs.",
  "Black Dust": "Poussière noire : fait tout oublier aux créatures touchées. Effet mental extrême, pouvant casser identité, liens et organisation. Très dangereux si appliqué à une ville centrale, car il peut désorganiser plusieurs systèmes à la fois.",
  "White Dust": "Poussière blanche : fait oublier la langue. Peut perturber l'identité culturelle/sociale et la cohésion, mais son impact militaire direct est plus faible que Blue ou Gold Dust.",
  "Red Dust": "Poussière rouge : fait oublier famille, clan et proches. Attaque les liens sociaux, pouvant fragiliser loyauté et stabilité interne. Danger surtout politique, pas forcément destructeur immédiatement.",
  "Gold Dust": "Poussière dorée : fait oublier le royaume. Peut provoquer séparation politique, perte d'appartenance ou fractures de villes. Très forte pour casser un empire sans bombe.",
  "Blue Dust": "Poussière bleue : fait oublier la culture. Attaque directement le développement technologique et l'héritage de connaissances. Très destructeur à long terme, surtout contre un royaume avancé.",
  "Purple Dust": "Poussière violette : fait oublier la religion. Peut casser une structure spirituelle/sociale si les religions sont actives dans la partie. Danger variable selon l'importance de la religion dans la simulation.",
};

const EFFECT_STATS = {
  "Déclarer la guerre": "Pas un statut d'unité. Effet système : déclenche une guerre WorldBox, donc capture/destruction de villes jusqu'à effondrement possible d'un royaume.",
  "Proposer une alliance": "Pas un statut d'unité. Effet système : crée/propose une alliance selon règles MJ.",
  "Rompre une alliance": "Pas un statut d'unité. Effet système : casse une protection diplomatique selon règles MJ.",
  Territoire: "Effet terrain MJ : ajoute uniquement de la terre attachée à une île existante. Le biome est copié depuis l'île touchée. Ne crée pas de ville, ne crée pas d'île isolée, ne garantit aucune ressource rare et ne téléporte aucune population.",
  "White Mage": "Unité magique. Peut lancer des effets défensifs/anti-menaces selon combat ; pas de buff chiffré garanti sur la cible du shop.",
  "Evil Mage": "Unité magique hostile. Danger par dégâts magiques et chaos ; pas de statut chiffré unique garanti.",
  "Ice Tower": "Peut provoquer Frozen via attaques/effets de froid : Mass +100, Speed -10000, Armor -20%, ne peut plus bouger ni agir, durée standard 15s.",
  "Flame Tower": "Peut provoquer Burning : perte périodique de 10% PV, bâtiments en ruine -25% PV périodiquement, 50% chance de Skin Burns à chaque dégât de brûlure, durée standard 30s.",
  Dragon: "Peut provoquer Burning via flammes : perte périodique de 10% PV, bâtiments en ruine -25% PV périodiquement, 50% chance de Skin Burns à chaque dégât de brûlure.",
  Fire: "Applique Burning : perte périodique de 10% PV, bâtiments en ruine -25% PV périodiquement, 50% chance de Skin Burns à chaque dégât de brûlure, retiré par Rain/Blood Rain.",
  "Napalm Bomb": "Explosion + Burning probable : perte périodique de 10% PV, bâtiments en ruine -25% PV périodiquement, 50% chance de Skin Burns à chaque dégât de brûlure.",
  Lightning: "Dégâts directs + peut déclencher Burning/incendies ; Burning = perte périodique de 10% PV et 50% chance de Skin Burns sur dégâts de brûlure.",
  "Thunder Cloud": "Éclairs répétés + incendies possibles ; pas de buff propre, mais Burning peut s'appliquer via feux.",
  "Snow Cloud": "Peut amener froid/neige ; si Frozen est appliqué : Mass +100, Speed -10000, Armor -20%, immobilisation complète, durée standard 15s.",

  Blessing: "Trait Blessed : Lifespan +5, Damage +50%, Health +50%, Speed +50%, Diplomacy +20%, Critical Chance +10%. Immunités notables : madness/death par certains livres, transformation démoniaque via Rage.",
  Curse: "Statut Cursed : Lifespan -10, Loyalty -100, Speed -20%, Damage -50%, Health -50%, Diplomacy -90%, Offspring -200%, devient Skeleton à la mort, -20 happiness, retire Blessed. Durée standard 300s.",
  Coffee: "Statut Caffeinated : Intelligence +222, Speed +200. Durée standard 60s. Retire/oppose Frozen selon la table officielle.",
  Shield: "Statut Shield : Mass +100, Armor +90%, effet visuel de bouclier quand touché. Durée standard 60s. Retire Burning, se retire avec Dispel.",
  "Blood Rain": "Soin : restaure environ 20% des PV max et retire Burning. Pas un buff long terme, mais peut sauver une armée en feu.",
  "Divine Light": "Purge : retire maladies, madness et infections. Retire notamment Plague, MUSH, Zombie Infection, Tumor Infection et Madness si appliqué assez tôt.",
  Dispel: "Dissipation : retire plusieurs statuts magiques actifs, notamment Enchanted, Powerup, Caffeinated, Shield, Slowness selon la table officielle.",

  Madness: "Trait Madness : Damage +1, Speed +5, Attack Speed +10, Diplomacy -100, Loyalty -100. L'unité attaque tout ce qui est dommageable, quitte royaume/village, vêtements rouges. Soin sur kill : max health/15 + 1. Curable par Divine Light, immunité possible avec Strong Minded.",
  "Zombie Infection": "Trait Infected/Zombie : Speed +10%, Loyalty -15, devient Zombie à la mort, perd lentement 10% PV max ou 10 PV si plus bas. Maladie supprimable par Divine Light/soins accélérés. Se propage après introduction par proximité/attaques zombies.",
  "MUSH Spores": "Trait MUSH Spores : Speed +30%, Loyalty -15, devient Mush à la mort, 70% chance de répandre des particules infectieuses à la mort. Maladie supprimable par Divine Light/soins accélérés. Très dangereux car peut rester dormant jusqu'à une mort.",
  "The Plague": "Trait Plague : Stamina -10, Loyalty -15, Lifespan -30, Armor -2%, Speed -30%, Damage -50%, 10% chance périodique de retirer 15% PV max +1. Se propage par proximité. Supprimable par Divine Light/soins accélérés.",
  Tumor: "Tumor Infection possible : devient Tumor à la mort, 10% chance périodique de retirer 10% PV max, propagation possible en marchant sur creep tumorale avec 5% chance. Supprimable par Divine Light/soins accélérés.",
  Biomass: "Peut appliquer Slowness via tuiles Biomass : 5% chance par pas ; Slowness = Speed -100, durée standard 30s, retiré par Dispel.",
  Cybercore: "Menace d'assimilation/spawner. Pas de statut chiffré unique confirmé dans le shop ; effet principal = production/assimilation mécanique si le noyau survit.",
  "Super Pumpkin": "Spawner autonome. Pas de statut chiffré unique confirmé ; effet principal = invasion de citrouilles, destruction de zone, ralentissement militaire par saturation d'ennemis.",

  "Black Dust": "Effet mental : fait tout oublier. Peut appliquer Confused : ne peut pas évoluer via Monolith, mouvements aléatoires, souvent avec Stunned 3s. Strong Minded/Iron Will immunisent contre Confused.",
  "White Dust": "Effet mental : oubli de la langue. Peut causer Confused brièvement lors de changements de culture/langue/religion.",
  "Red Dust": "Effet mental : oubli famille/clan/proches. Black/Red dust peut appliquer Confused : mouvements aléatoires, pas d'évolution Monolith, parfois Stunned.",
  "Gold Dust": "Effet mental : oubli du royaume. Peut provoquer désorganisation politique et Confused brièvement.",
  "Blue Dust": "Effet mental : oubli de la culture. Peut provoquer Confused brièvement ; impact stratégique principal = perte de développement culturel.",
  "Purple Dust": "Effet mental : oubli de la religion. Peut provoquer Confused brièvement ; impact dépend de l'importance des religions.",

  "Cloud of Life": "Pas un statut chiffré direct : disperse vie/graines.",
  "Rain Cloud": "Pas un buff direct : pluie mobile, éteint feux et aide les cultures.",
  Rain: "Pas un buff direct : éteint feux et aide les cultures. Contre Burning.",
  Acid: "Pas un statut chiffré d'unité confirmé ici : détruit/dissout terrain et dégâts environnementaux.",
  "Acid Geyser": "Pas un buff : source d'acide dangereuse localement.",
  Volcano: "Peut provoquer lave/feu/Burning : Burning = perte périodique de 10% PV, bâtiments en ruine -25% PV périodiquement.",
};

const PREMIUM_POWERS = [
  { name: "Orcs", category: "Expansion", scale: "Expansion", rating: 8, danger: 8, effect: "Crée un groupe d'Orcs capable de fonder une colonie limitée selon validation MJ." },
  { name: "Elves", category: "Expansion", scale: "Expansion", rating: 7, danger: 7, effect: "Crée un groupe d'Elfes capable de fonder une colonie limitée selon validation MJ." },
  { name: "Dwarves", category: "Expansion", scale: "Expansion", rating: 9, danger: 9, effect: "Crée un groupe de Nains capable de fonder une colonie limitée selon validation MJ." },
  { name: "Colonie contrôlée", category: "Expansion", scale: "Expansion", rating: 8, danger: 8, effect: "Autorise une colonie contrôlée dans une zone valide, sans remplacer la civilisation fondatrice." },

  { name: "Alpaca", category: "Créatures bénéfiques", scale: "Bénéfice", rating: 1, danger: 1, effect: "Ajoute des alpagas pacifiques." },
  { name: "Capybara", category: "Créatures bénéfiques", scale: "Bénéfice", rating: 1, danger: 1, effect: "Ajoute des capybaras pacifiques." },
  { name: "Goat", category: "Créatures bénéfiques", scale: "Bénéfice", rating: 1, danger: 1, effect: "Ajoute des chèvres, faune légère et ressource alimentaire potentielle." },
  { name: "Penguin", category: "Créatures bénéfiques", scale: "Bénéfice", rating: 1, danger: 1, effect: "Ajoute des pingouins adaptés aux zones froides." },
  { name: "Ostrich", category: "Créatures bénéfiques", scale: "Bénéfice", rating: 2, danger: 2, effect: "Ajoute des autruches rapides mais peu dangereuses." },
  { name: "Turtle", category: "Créatures bénéfiques", scale: "Bénéfice", rating: 1, danger: 1, effect: "Ajoute des tortues résistantes et pacifiques." },
  { name: "Frog", category: "Créatures bénéfiques", scale: "Bénéfice", rating: 1, danger: 1, effect: "Ajoute des grenouilles, surtout décoratives." },
  { name: "Seal", category: "Créatures bénéfiques", scale: "Bénéfice", rating: 2, danger: 2, effect: "Ajoute des phoques sur les littoraux." },
  { name: "Armadillo", category: "Créatures bénéfiques", scale: "Bénéfice", rating: 2, danger: 2, effect: "Ajoute des tatous robustes mais peu agressifs." },
  { name: "Butterfly", category: "Créatures bénéfiques", scale: "Bénéfice", rating: 1, danger: 1, effect: "Ajoute des papillons décoratifs." },
  { name: "Bee", category: "Créatures bénéfiques", scale: "Bénéfice", rating: 2, danger: 2, effect: "Ajoute des abeilles utiles à un environnement vivant, avec nuisance locale possible." },
  { name: "Beehive", category: "Créatures bénéfiques", scale: "Bénéfice", rating: 3, danger: 3, effect: "Place une ruche produisant des abeilles." },
  { name: "Beetle", category: "Créatures bénéfiques", scale: "Bénéfice", rating: 1, danger: 1, effect: "Ajoute des coléoptères." },
  { name: "Grasshopper", category: "Créatures bénéfiques", scale: "Bénéfice", rating: 1, danger: 1, effect: "Ajoute des sauterelles, faune légère." },

  { name: "Rat", category: "Créatures hostiles", scale: "Danger", rating: 4, danger: 4, effect: "Ajoute des rats pouvant gêner les zones urbaines et propager le désordre." },
  { name: "Hyena", category: "Créatures hostiles", scale: "Danger", rating: 6, danger: 6, effect: "Ajoute des hyènes prédatrices." },
  { name: "Snake", category: "Créatures hostiles", scale: "Danger", rating: 7, danger: 7, effect: "Ajoute des serpents dangereux pour les unités isolées." },
  { name: "Scorpion", category: "Créatures hostiles", scale: "Danger", rating: 7, danger: 7, effect: "Ajoute des scorpions hostiles dans une zone sèche." },
  { name: "Crocodile", category: "Créatures hostiles", scale: "Danger", rating: 8, danger: 8, effect: "Ajoute des crocodiles dangereux près des eaux et littoraux." },
  { name: "Piranha", category: "Créatures hostiles", scale: "Danger", rating: 8, danger: 8, effect: "Ajoute des piranhas dans une zone aquatique." },
  { name: "Sand Spider", category: "Créatures hostiles", scale: "Danger", rating: 9, danger: 9, effect: "Ajoute des araignées de sable hostiles." },
  { name: "Worm", category: "Créatures hostiles", scale: "Danger", rating: 10, danger: 10, effect: "Ajoute un ver dangereux capable de perturber une zone terrestre." },

  { name: "Druid", category: "Créatures bénéfiques", scale: "Bénéfice", rating: 5, danger: 5, effect: "Ajoute un druide favorable à la vie et à la végétation." },
  { name: "Plague Doctor", category: "Créatures bénéfiques", scale: "Bénéfice", rating: 6, danger: 6, effect: "Ajoute un médecin de peste pouvant aider contre certaines maladies." },
  { name: "Fairy", category: "Créatures bénéfiques", scale: "Bénéfice", rating: 5, danger: 5, effect: "Ajoute une fée magique généralement favorable." },
  { name: "Unicorn", category: "Créatures bénéfiques", scale: "Bénéfice", rating: 6, danger: 6, effect: "Ajoute une licorne rare et bénéfique." },
  { name: "Necromancer", category: "Créatures hostiles", scale: "Danger", rating: 14, danger: 14, effect: "Ajoute un nécromancien capable de provoquer une crise surnaturelle." },
  { name: "Demon", category: "Créatures hostiles", scale: "Danger", rating: 12, danger: 12, effect: "Ajoute un démon hostile et incendiaire." },
  { name: "Cold One", category: "Créatures hostiles", scale: "Danger", rating: 10, danger: 10, effect: "Ajoute une créature froide hostile pouvant geler sa zone." },
  { name: "Fire Elemental", category: "Créatures hostiles", scale: "Danger", rating: 13, danger: 13, effect: "Ajoute un élémentaire de feu très dangereux localement." },
  { name: "Snowman", category: "Créatures bénéfiques", scale: "Bénéfice", rating: 5, danger: 5, effect: "Ajoute un bonhomme de neige dans une zone froide." },
  { name: "Alien", category: "Créatures hostiles", scale: "Danger", rating: 14, danger: 14, effect: "Ajoute un extraterrestre hostile." },
  { name: "UFO", category: "Créatures hostiles", scale: "Danger", rating: 16, danger: 16, effect: "Déclenche une intervention extraterrestre volante dangereuse." },
  { name: "Zombie", category: "Créatures hostiles", scale: "Danger", rating: 10, danger: 10, effect: "Ajoute directement des zombies hostiles." },

  { name: "Acid Blob", category: "Créatures hostiles", scale: "Danger", rating: 12, danger: 12, effect: "Ajoute une masse acide hostile et corrosive." },
  { name: "Tumor Monster", category: "Créatures hostiles", scale: "Danger", rating: 14, danger: 14, effect: "Ajoute un monstre tumoral capable de répandre une menace organique." },
  { name: "Bioblob", category: "Créatures hostiles", scale: "Danger", rating: 15, danger: 15, effect: "Ajoute une créature biologique invasive." },
  { name: "Assimilator", category: "Créatures hostiles", scale: "Danger", rating: 17, danger: 17, effect: "Ajoute une unité assimilatrice capable d'amplifier une crise mécanique." },
  { name: "Fire Skull", category: "Créatures hostiles", scale: "Danger", rating: 12, danger: 12, effect: "Ajoute un crâne de feu hostile." },
  { name: "Rude Skull", category: "Créatures hostiles", scale: "Danger", rating: 11, danger: 11, effect: "Ajoute un crâne hostile et agressif." },
  { name: "Lil Pumpkin", category: "Créatures hostiles", scale: "Danger", rating: 7, danger: 7, effect: "Ajoute une petite créature citrouille hostile." },
  { name: "Crystal Golem", category: "Créatures hostiles", scale: "Danger", rating: 13, danger: 13, effect: "Ajoute un golem de cristal très résistant." },
  { name: "Lemon Man", category: "Créatures bénéfiques", scale: "Bénéfice", rating: 6, danger: 6, effect: "Ajoute un Lemon Man, créature spéciale à impact modéré." },
  { name: "Garlic Man", category: "Créatures bénéfiques", scale: "Bénéfice", rating: 6, danger: 6, effect: "Ajoute un Garlic Man, créature spéciale à impact modéré." },
  { name: "Candy Man", category: "Créatures bénéfiques", scale: "Bénéfice", rating: 7, danger: 7, effect: "Ajoute un Candy Man, créature spéciale potentiellement utile." },
  { name: "Acid Gentleman", category: "Créatures hostiles", scale: "Danger", rating: 13, danger: 13, effect: "Ajoute un Acid Gentleman hostile et corrosif." },

  { name: "Ash Cloud", category: "Nature hostile", scale: "Danger", rating: 10, danger: 10, effect: "Crée un nuage de cendres gênant et dangereux pour une région." },
  { name: "Magic Cloud", category: "Nature bénéfique", scale: "Bénéfice", rating: 8, danger: 8, effect: "Crée un nuage magique aux effets généralement favorables." },
  { name: "Rage Cloud", category: "Nature hostile", scale: "Danger", rating: 14, danger: 14, effect: "Crée un nuage provoquant rage et violence." },
  { name: "Acid Cloud", category: "Nature hostile", scale: "Danger", rating: 16, danger: 16, effect: "Crée un nuage acide destructeur." },
  { name: "Lava Cloud", category: "Nature hostile", scale: "Danger", rating: 18, danger: 18, effect: "Crée un nuage de lave extrêmement destructeur." },
  { name: "Hell Cloud", category: "Nature hostile", scale: "Danger", rating: 17, danger: 17, effect: "Crée un nuage infernal capable de ravager une zone." },
  { name: "Temperature Hot", category: "Nature", scale: "Influence", rating: 8, danger: 8, effect: "Augmente fortement la température d'une zone." },
  { name: "Temperature Cold", category: "Nature", scale: "Influence", rating: 7, danger: 7, effect: "Réduit fortement la température d'une zone." },
  { name: "Tornado", category: "Nature hostile", scale: "Danger", rating: 15, danger: 15, effect: "Crée une tornade mobile provoquant dégâts et désordre." },
  { name: "Lava", category: "Nature hostile", scale: "Danger", rating: 14, danger: 14, effect: "Place de la lave et rend une zone extrêmement dangereuse." },
  { name: "Meteorite", category: "Destruction", scale: "Destruction", rating: 17, danger: 17, effect: "Fait tomber une météorite causant une destruction massive locale." },

  { name: "TNT", category: "Destruction", scale: "Destruction", rating: 10, danger: 10, effect: "Place un explosif TNT à déclenchement direct." },
  { name: "Delayed TNT", category: "Destruction", scale: "Destruction", rating: 11, danger: 11, effect: "Place un explosif TNT retardé." },
  { name: "Landmine", category: "Destruction", scale: "Destruction", rating: 9, danger: 9, effect: "Place une mine terrestre déclenchée au passage." },
  { name: "Water Bomb", category: "Destruction", scale: "Destruction", rating: 8, danger: 8, effect: "Déclenche une bombe d'eau modifiant et endommageant localement le terrain." },
  { name: "Heat-Ray", category: "Destruction", scale: "Destruction", rating: 18, danger: 18, effect: "Déclenche un rayon thermique extrêmement destructeur." },
  { name: "Tsar Bomba", category: "Destruction", scale: "Destruction", rating: 20, danger: 20, effect: "Déclenche une explosion nucléaire de portée extrême." },
  { name: "Infinity Coin", category: "Destruction", scale: "Destruction", rating: 20, danger: 20, effect: "Déclenche un pouvoir d'annihilation massive lié à la pièce d'infini." },
  { name: "Robot Santa", category: "Destruction", scale: "Destruction", rating: 15, danger: 15, effect: "Ajoute Robot Santa, unité volante lourdement armée." },
  { name: "Corrupted Brain", category: "Destruction", scale: "Destruction", rating: 16, danger: 16, effect: "Crée un cerveau corrompu capable de répandre une menace." },
  { name: "Grey Goo", category: "Destruction", scale: "Destruction", rating: 20, danger: 20, effect: "Déclenche une matière grise auto-réplicante pouvant dévorer le monde." },
  { name: "Crabzilla", category: "Destruction", scale: "Destruction", rating: 20, danger: 20, effect: "Autorise l'intervention de Crabzilla, menace apocalyptique contrôlée par le MJ." },
  { name: "Living Plants", category: "Destruction", scale: "Destruction", rating: 13, danger: 13, effect: "Anime les plantes d'une zone et déclenche une crise locale." },
  { name: "Living Houses", category: "Destruction", scale: "Destruction", rating: 14, danger: 14, effect: "Anime les maisons et provoque un chaos urbain." },
  { name: "Conway Life — Pink", category: "Destruction", scale: "Destruction", rating: 17, danger: 17, effect: "Déclenche une forme de vie Conway rose auto-évolutive." },
  { name: "Conway Life — Green", category: "Destruction", scale: "Destruction", rating: 17, danger: 17, effect: "Déclenche une forme de vie Conway verte auto-évolutive." },

  { name: "Powerup", category: "Amélioration", scale: "Bénéfice", rating: 8, danger: 8, effect: "Applique Powerup à des unités choisies." },
  { name: "Sleep", category: "Altération", scale: "Influence", rating: 6, danger: 6, effect: "Endort temporairement les unités d'une zone." },
  { name: "Smooth Jazz", category: "Amélioration", scale: "Bénéfice", rating: 5, danger: 5, effect: "Applique Smooth Jazz et favorise la reproduction selon les règles WorldBox." },
  { name: "Clone Rain", category: "Altération", scale: "Influence", rating: 12, danger: 12, effect: "Déclenche une pluie clonant les unités touchées." },
  { name: "Gamma Rain", category: "Amélioration", scale: "Bénéfice", rating: 8, danger: 8, effect: "Déclenche une pluie appliquant des traits positifs." },
  { name: "Omega Rain", category: "Altération", scale: "Danger", rating: 14, danger: 14, effect: "Déclenche une pluie appliquant des traits négatifs." },
  { name: "Delta Rain", category: "Altération", scale: "Influence", rating: 11, danger: 11, effect: "Déclenche une pluie appliquant des traits étranges ou imprévisibles." },
  { name: "Religion Rain — Positive", category: "Amélioration", scale: "Bénéfice", rating: 14, danger: 14, effect: "Modifie positivement les traits de la religion d'une civilisation ciblée." },
  { name: "Religion Rain — Negative", category: "Altération", scale: "Danger", rating: 17, danger: 17, effect: "Modifie négativement les traits de la religion d'une civilisation ciblée." },
  { name: "Subspecies Rain — Positive", category: "Amélioration", scale: "Bénéfice", rating: 15, danger: 15, effect: "Modifie positivement les traits d'une sous-espèce ciblée." },
  { name: "Subspecies Rain — Negative", category: "Altération", scale: "Danger", rating: 18, danger: 18, effect: "Modifie négativement les traits d'une sous-espèce ciblée." },
  { name: "Loot Rain", category: "Amélioration", scale: "Bénéfice", rating: 10, danger: 10, effect: "Distribue de l'équipement aux unités touchées." },
  { name: "Golden Brain", category: "Influence", scale: "Influence", rating: 12, danger: 12, effect: "Place un cerveau doré attirant ou influençant les unités." },
  { name: "Monolith", category: "Influence", scale: "Influence", rating: 13, danger: 13, effect: "Place un monolithe capable d'influencer l'évolution des unités." },

  { name: "Golden Egg Desire", category: "Influence", scale: "Influence", rating: 9, danger: 9, effect: "Crée un désir lié à l'œuf doré et attire les unités." },
  { name: "Ethereal Harp Desire", category: "Influence", scale: "Influence", rating: 10, danger: 10, effect: "Crée un désir lié à la harpe éthérée et attire les populations." },
  { name: "Alien Mold Desire", category: "Influence", scale: "Danger", rating: 15, danger: 15, effect: "Crée un désir lié à la moisissure alien, avec risque de conversion." },
  { name: "Computer Chip", category: "Influence", scale: "Influence", rating: 13, danger: 13, effect: "Applique une influence cybernétique via une puce informatique." },
  { name: "Evil Computer", category: "Influence", scale: "Danger", rating: 16, danger: 16, effect: "Place un ordinateur maléfique exerçant une influence hostile." },

  { name: "Stone Wall", category: "Fortification", scale: "Défense", rating: 7, danger: 7, effect: "Crée un mur de pierre dans une zone autorisée." },
  { name: "Iron Wall", category: "Fortification", scale: "Défense", rating: 10, danger: 10, effect: "Crée un mur de fer robuste." },
  { name: "Wall of Light", category: "Fortification", scale: "Défense", rating: 12, danger: 12, effect: "Crée une barrière lumineuse protectrice." },
  { name: "Wall of Evil", category: "Fortification", scale: "Danger", rating: 14, danger: 14, effect: "Crée une barrière maléfique et dangereuse." },
  { name: "Ancient Wall", category: "Fortification", scale: "Défense", rating: 9, danger: 9, effect: "Crée un ancien mur défensif." },
  { name: "Wooded Wall", category: "Fortification", scale: "Défense", rating: 6, danger: 6, effect: "Crée une barrière boisée." },
  { name: "Green Wall", category: "Fortification", scale: "Défense", rating: 7, danger: 7, effect: "Crée une barrière végétale." },
  { name: "Mountains", category: "Terrain", scale: "Défense", rating: 10, danger: 10, effect: "Ajoute une chaîne montagneuse modifiant les passages et frontières." },
  { name: "Vortex", category: "Terrain", scale: "Danger", rating: 14, danger: 14, effect: "Crée un vortex déplaçant ou absorbant les éléments proches." },
  { name: "Sponge", category: "Terrain", scale: "Bénéfice", rating: 4, danger: 4, effect: "Utilise l'éponge pour retirer localement un élément de terrain ou un liquide." },
  { name: "Demolish", category: "Terrain", scale: "Destruction", rating: 8, danger: 8, effect: "Démolit localement des constructions ou éléments de terrain." },
  { name: "Life Eraser", category: "Destruction", scale: "Destruction", rating: 20, danger: 20, effect: "Efface entièrement la vie dans une zone validée par le MJ.", noCounter: false },
];

POWERS.push(...PREMIUM_POWERS);

POWERS.forEach((power) => {
  power.danger = ORE_POWER_DANGERS[power.name] ?? power.danger;
  power.scale = power.scale ?? inferCardScale(power);
  power.rating = Math.max(1, Math.min(20, Number(power.rating ?? power.danger) || 1));
  power.effect = DETAILED_EFFECTS[power.name] ?? power.effect;
  power.stats = EFFECT_STATS[power.name] ?? "Pas de statut chiffré direct connu : effet surtout par dégâts, spawn, ressource, terrain ou économie.";
});

COUNTER_CARDS.forEach((card) => {
  card.scale = "Défense";
  card.rating = card.danger;
});

function inferCardScale(card) {
  if (card.category === "Destruction") return "Destruction";
  if (card.category === "Diplomatie") return "Influence";
  if (card.category === "Expansion") return "Expansion";
  if (card.category === "Contre-pouvoir") return "Défense";
  if (card.resource || ["Stone", "Ore Deposit", "Silver", "Mythril", "Adamantine", "Gold", "Coffee"].includes(card.name)) return "Ressource";
  const beneficial = new Set([
    "Humans", "Cat", "Dog", "Chicken", "Rabbit", "Monkey", "Sheep", "Cow", "Crab", "White Mage",
    "Rain", "Plants Fertilizer", "Trees Fertilizer", "Fruit Bush", "Geyser", "Cloud of Life", "Rain Cloud", "Snow Cloud",
    "Divine Light", "Blood Rain", "Shield", "Blessing", "Dispel",
  ]);
  return beneficial.has(card.name) ? "Bénéfice" : "Danger";
}

const CARD_LEVEL_WEIGHTS = [
  { level: 1, weight: 70 },
  { level: 2, weight: 25 },
  { level: 3, weight: 5 },
];

function traitNames(text) {
  return text.split("|").map((name) => name.trim()).filter(Boolean);
}

function createTraitCatalog(allText, positiveText, negativeText, legendaryPositiveText, legendaryNegativeText) {
  const all = traitNames(allText);
  const positive = traitNames(positiveText);
  const negative = traitNames(negativeText);
  const legendaryPositive = traitNames(legendaryPositiveText);
  const legendaryNegative = traitNames(legendaryNegativeText);
  const classified = new Set([...positive, ...negative]);
  return {
    all,
    positive,
    negative,
    neutral: all.filter((name) => !classified.has(name)),
    legendaryPositive,
    legendaryNegative,
  };
}

const TRAIT_CATALOGS = {
  population: createTraitCatalog(
    `Eagle Eyed|Genius|Short Sighted|Stupid|Thief|Wise|Ambitious|Arcane Reflexes|Battle Reflexes|Content|Deceitful|Evil|Gluttonous|Greedy|Honest|Hotheaded|Lustful|Paranoid|Peaceful|Psychopath|Pyromaniac|Strong Minded|Bloodlust|Burning Feet|Cold Aura|Flesh Eater|Healing Aura|Heart of Wizard|Lucky|Moonchild|Nightchild|Pacifist|Savage|Unlucky|Agile|Clumsy|Fast|Fat|Giant|Hard Skin|Slow|Soft Skin|Strong|Tiny|Tough|Weak|Weightless|Boosted Vitality|Fertile|Fragile Health|Immortal|Immune|Infertile|Long Liver|Regeneration|Super Health|Acid Blood|Acid Touch|Fire Blood|Heliophobia|Mute|Poisonous|Sunblessed|Titan's Lungs|Venomous|Attractive|One Eyed|Golden Tooth|Skin Burns|Ugly|Acid Proof|Bubble Defense|Fire Proof|Frost Proof|Poison Immunity|Thorns|Backstep|Block|Dash|Deflect Projectiles|Dodge|Dragonslayer|Kingslayer|Mageslayer|Veteran|Blessed|Crippled|Infected|MUSH Spores|Plague|Tumor Infection|Bomberman|Death Bomb|Death Nuke|Energized|Mega Heartbeat|Whirlwind|The Chosen One|Mark of Death|Contagious|Flower Prints|Light Lamp|Miner|Shiny|It's a Boat|Clone|Alien Mold Desire|Evil Computer Desire|Golden Egg Desire|Ethereal Harp Desire|Madness|Metamorphed|Miracle Bearer|Miracle Born|Scar of Divinity|Zombie`,
    `Eagle Eyed|Genius|Wise|Arcane Reflexes|Battle Reflexes|Content|Honest|Peaceful|Strong Minded|Healing Aura|Heart of Wizard|Lucky|Pacifist|Savage|Agile|Fast|Giant|Hard Skin|Strong|Tough|Weightless|Boosted Vitality|Fertile|Immortal|Immune|Long Liver|Regeneration|Super Health|Sunblessed|Titan's Lungs|Attractive|Golden Tooth|Acid Proof|Bubble Defense|Fire Proof|Frost Proof|Poison Immunity|Thorns|Backstep|Block|Dash|Deflect Projectiles|Dodge|Dragonslayer|Kingslayer|Mageslayer|Veteran|Blessed|Energized|Mega Heartbeat|Whirlwind|The Chosen One|Flower Prints|Light Lamp|Miner|Shiny|Miracle Bearer|Miracle Born`,
    `Short Sighted|Stupid|Thief|Deceitful|Evil|Gluttonous|Greedy|Hotheaded|Paranoid|Psychopath|Pyromaniac|Bloodlust|Burning Feet|Flesh Eater|Unlucky|Clumsy|Fat|Slow|Soft Skin|Tiny|Weak|Fragile Health|Infertile|Acid Blood|Acid Touch|Fire Blood|Heliophobia|Mute|Poisonous|Venomous|One Eyed|Skin Burns|Ugly|Crippled|Infected|MUSH Spores|Plague|Tumor Infection|Bomberman|Death Bomb|Death Nuke|Mark of Death|Contagious|Alien Mold Desire|Evil Computer Desire|Madness|Zombie`,
    `Immortal|Super Health|Mega Heartbeat|The Chosen One|Miracle Bearer|Miracle Born`,
    `Madness|Death Nuke|Mark of Death|MUSH Spores|Plague|Tumor Infection|Zombie|Alien Mold Desire|Evil Computer Desire`,
  ),
  religion: createTraitCatalog(
    `Hand of Order|Minds Awakening|Path of Unity|Zeal of Conquest|Cast Curse|Create Grass|Cast Vegetation|Rite of Entanglement|Rite of Living Harvest|Cast Fire|Summon Lightning|Summon Tornado|Rite of Falling Stars|Rite of Infernal Wrath|Rite of Roaring Skies|Rite of Shattered Earth|Rite of the Tempest Call|Rite of the Abyss|Cast Blood Rain|Cast Cure|Summon Skeleton|Rite of Eternal Brew|Rite of Restless Dead|Blessed by Ashes|Bubble Shield|Rite of Infinite Edges|Rite of Unbroken Shield|Bloodline Bond|Silence|Teleport|Rite of Change|Rite of Dissent|Rite of Fractured Minds|Cosmic Radiation|Echo of the Void|Infernal Influence|Sands of Ruin|Shadowroot|Grin Mark|Divine Insight`,
    `Hand of Order|Minds Awakening|Path of Unity|Zeal of Conquest|Create Grass|Cast Vegetation|Rite of Entanglement|Rite of Living Harvest|Cast Blood Rain|Cast Cure|Rite of Eternal Brew|Blessed by Ashes|Bubble Shield|Rite of Infinite Edges|Rite of Unbroken Shield|Bloodline Bond|Teleport|Rite of Change|Divine Insight`,
    `Cast Curse|Cast Fire|Summon Lightning|Summon Tornado|Rite of Falling Stars|Rite of Infernal Wrath|Rite of Roaring Skies|Rite of Shattered Earth|Rite of the Tempest Call|Rite of the Abyss|Summon Skeleton|Rite of Restless Dead|Silence|Rite of Dissent|Rite of Fractured Minds|Cosmic Radiation|Echo of the Void|Infernal Influence|Sands of Ruin|Shadowroot|Grin Mark`,
    `Rite of Infinite Edges|Rite of Unbroken Shield|Bloodline Bond|Teleport|Divine Insight`,
    `Rite of Falling Stars|Rite of Infernal Wrath|Rite of Shattered Earth|Rite of the Abyss|Rite of Restless Dead|Rite of Fractured Minds|Grin Mark`,
  ),
  subspecies: createTraitCatalog(
    `Minimal Population|Small Population|Moderate Population|Large Population|Expansive Population|Prefrontal Cortex|Advanced Hippocampus|Amygdala|Wernicke's Area|Cautious Instincts|Dreamweavers|Fast Builders|Genetic Psychosis|Hyper Intelligence|Inquisitive Nature|Pure|Slow Builders|Super Positivity|Telepathic Link|Stomach|Big Stomach|Voracious|Accelerated Healing|Aquatic|Bad Genes|Bioluminescence|Cold Resistance|Enhanced Strength|Exoskeleton|Fins|Good Throwers|Heat Resistance|High Fecundity|Hovering|Hydrophobia|Long Lifespan|Pollinator|Unmoving|Omnivore|Herbivore|Carnivore|Cannibalism|Algivore|Florivore|Folivore|Frugivore|Geophagy|Graminivore|Granivore|Hematophagy|Insectivore|Lithotroph|Nectarivore|Piscivore|Xylophagy|Photosynthetic Skin|Fenix Born|Butterfly Metamorphosis|Chicken Metamorphosis|Crab Metamorphosis|Sword Metamorphosis|Wolf Metamorphosis|Mythril Form|Plant Growth|Tree Growth|Gaia Roots|Parental Care|Rapid Aging|Gem Production|Gold Production|Stone Production|Mushroom Production|Aggressive|Annoying Fireworks|Antimatter Essence|Fire Elemental Form|Genetic Mirror|Nimble|Shiny Love|Spicy Kids|Unstable Genome|Gift of Air|Gift of Blood|Gift of Death|Gift of Fire|Gift of Harmony|Gift of Life|Gift of Thunder|Gift of the Void|Gift of Water|Energy Preserver|Polyphasic Sleep|Monophasic Sleep|Prolonged Rest|Nocturnal Dormancy|Circadian Drift|Winter Slumberers|Chaos Driven|Oviparity|Viviparity|Sexual|Spore|Budding|Fission|Hermaphroditic|Parthenogenesis|Vegetative|Divine|Soulborne|Metamorph|Short Gestation|Moderate Gestation|Long Gestation|Very Long Gestation|Extremely Long Gestation|Alien|Blob|Bubble|Candy|Cocoon|Colored|Crystal|Eyeball|Face|Flames|Ice|Metal Box|Orb|Pumpkin|Rainbow|Roe|Plain Shell|Spotted Shell|The Light Orb|Abomination|Blood Vortex|Burger Being|Energy Being|Fractal|Living Rock|The Orb|Tentacle Horror|Void Form|Corrupted Adaptation|Arcane Desert Adaptation|Infernal Adaptation|Permafrost Adaptation|Swamp Adaptation|Wasteland Adaptation|Grin Mark|GMO|Uplifted`,
    `Expansive Population|Prefrontal Cortex|Advanced Hippocampus|Amygdala|Wernicke's Area|Dreamweavers|Fast Builders|Hyper Intelligence|Inquisitive Nature|Pure|Super Positivity|Telepathic Link|Big Stomach|Accelerated Healing|Aquatic|Bioluminescence|Cold Resistance|Enhanced Strength|Exoskeleton|Fins|Good Throwers|Heat Resistance|High Fecundity|Hovering|Long Lifespan|Pollinator|Photosynthetic Skin|Fenix Born|Mythril Form|Plant Growth|Tree Growth|Gaia Roots|Parental Care|Gem Production|Gold Production|Stone Production|Nimble|Shiny Love|Gift of Air|Gift of Blood|Gift of Fire|Gift of Harmony|Gift of Life|Gift of Thunder|Gift of Water|Energy Preserver|Short Gestation|Hermaphroditic|Parthenogenesis|Divine|Soulborne|The Light Orb|Energy Being|Living Rock|Void Form|Arcane Desert Adaptation|Permafrost Adaptation|Swamp Adaptation|Uplifted`,
    `Minimal Population|Small Population|Genetic Psychosis|Slow Builders|Voracious|Bad Genes|Hydrophobia|Unmoving|Cannibalism|Hematophagy|Rapid Aging|Aggressive|Annoying Fireworks|Antimatter Essence|Fire Elemental Form|Spicy Kids|Unstable Genome|Gift of Death|Gift of the Void|Chaos Driven|Very Long Gestation|Extremely Long Gestation|Abomination|Blood Vortex|Tentacle Horror|Corrupted Adaptation|Infernal Adaptation|Wasteland Adaptation|Grin Mark`,
    `Hyper Intelligence|Enhanced Strength|High Fecundity|Long Lifespan|Fenix Born|Mythril Form|Gaia Roots|Gold Production|Gift of Harmony|Gift of Life|Divine|Soulborne|The Light Orb|Energy Being|Uplifted`,
    `Genetic Psychosis|Bad Genes|Unmoving|Antimatter Essence|Unstable Genome|Gift of Death|Gift of the Void|Tentacle Horror|Corrupted Adaptation|Infernal Adaptation|Grin Mark`,
  ),
};

const EXPLOSIVE_CARD_NAMES = new Set([
  "Grenade", "Bomb", "Napalm Bomb", "Atomic Bomb", "Antimatter Bomb", "Meteorite",
  "TNT", "Delayed TNT", "Landmine", "Water Bomb", "Heat-Ray", "Tsar Bomba",
]);

const RESOURCE_ZONE_CARD_NAMES = new Set([
  "Stone", "Ore Deposit", "Silver", "Mythril", "Adamantine", "Gold",
]);

function getZoneLevelEffects(name, verb = "Applique") {
  return [
    `${verb} ${name} sur une province : une ville et son territoire immédiat.`,
    `${verb} ${name} sur une région : plusieurs provinces voisines et cohérentes.`,
    `${verb} ${name} sur une île entière : toute la masse terrestre ciblée.`,
  ];
}

function getCreatureLevelCounts(card) {
  const rating = Number(card?.rating ?? card?.danger) || 1;
  if (rating >= 16) return [1, 3, 10];
  if (rating >= 11) return [3, 10, 30];
  return [10, 30, 100];
}

function normalizeCardLevel(value, fallback = 1) {
  const level = Math.floor(Number(value));
  return [1, 2, 3].includes(level) ? level : fallback;
}

function drawCardLevel(randomFn = Math.random) {
  const total = CARD_LEVEL_WEIGHTS.reduce((sum, item) => sum + item.weight, 0);
  let roll = randomFn() * total;
  for (const item of CARD_LEVEL_WEIGHTS) {
    roll -= item.weight;
    if (roll <= 0) return item.level;
  }
  return 1;
}

function getTraitRainSpec(card) {
  const specs = {
    "Gamma Rain": { domain: "population", polarity: "positive" },
    "Omega Rain": { domain: "population", polarity: "negative" },
    "Delta Rain": { domain: "population", polarity: "mixed" },
    "Religion Rain — Positive": { domain: "religion", polarity: "positive" },
    "Religion Rain — Negative": { domain: "religion", polarity: "negative" },
    "Subspecies Rain — Positive": { domain: "subspecies", polarity: "positive" },
    "Subspecies Rain — Negative": { domain: "subspecies", polarity: "negative" },
  };
  return specs[card?.name] ?? null;
}

function isHostileCard(card) {
  return Boolean(card) && (
    ["Danger", "Destruction"].includes(card.scale)
    || ["Déclarer la guerre", "Rompre une alliance"].includes(card.name)
  );
}

function isConstructiveCard(card) {
  return Boolean(card) && (
    ["Bénéfice", "Défense", "Ressource", "Expansion"].includes(card.scale)
    || card.name === "Proposer une alliance"
  );
}

function sampleUniqueTraits(pool, count, randomFn = Math.random) {
  const available = [...new Set(pool)];
  const selected = [];
  while (available.length && selected.length < count) {
    const index = Math.floor(randomFn() * available.length);
    selected.push(available.splice(index, 1)[0]);
  }
  return selected;
}

function drawTraitRainResult(card, randomFn = Math.random) {
  const spec = getTraitRainSpec(card);
  if (!spec) return null;
  const catalog = TRAIT_CATALOGS[spec.domain];
  const level = normalizeCardLevel(card.level);
  const legendaryPositive = catalog.legendaryPositive;
  const legendaryNegative = catalog.legendaryNegative;
  const legendarySet = new Set([...legendaryPositive, ...legendaryNegative]);
  const basePool = (spec.polarity === "mixed"
    ? catalog.all
    : catalog[spec.polarity])
    .filter((name) => !legendarySet.has(name));
  const standardCount = level === 2 ? 10 : 5;
  const traits = sampleUniqueTraits(basePool, standardCount, randomFn);
  const legendaryPool = spec.polarity === "mixed"
    ? [...legendaryPositive, ...legendaryNegative]
    : spec.polarity === "positive"
      ? legendaryPositive
      : legendaryNegative;
  const legendaryTraits = level === 3 ? sampleUniqueTraits(legendaryPool, 1, randomFn) : [];
  return {
    domain: spec.domain,
    polarity: spec.polarity,
    traits,
    legendaryTraits,
  };
}

function prepareDrawnCard(card, randomFn = Math.random) {
  if (!card) return card;
  const prepared = {
    ...card,
    level: [1, 2, 3].includes(Number(card.level)) ? normalizeCardLevel(card.level) : drawCardLevel(randomFn),
  };
  const spec = getTraitRainSpec(prepared);
  if (spec && (!prepared.traitRoll || !Array.isArray(prepared.traitRoll.traits))) {
    prepared.traitRoll = drawTraitRainResult(prepared, randomFn);
  } else if (prepared.traitRoll) {
    prepared.traitRoll = {
      domain: prepared.traitRoll.domain ?? spec?.domain ?? "population",
      polarity: prepared.traitRoll.polarity ?? spec?.polarity ?? "mixed",
      traits: [...new Set(prepared.traitRoll.traits ?? [])],
      legendaryTraits: [...new Set(prepared.traitRoll.legendaryTraits ?? [])],
    };
  }
  return prepared;
}

function formatTraitRainResult(card) {
  const roll = card?.traitRoll;
  if (!roll) return "";
  const domainLabels = {
    population: "population",
    religion: "religion",
    subspecies: "sous-espèce",
  };
  const lines = [];
  if (roll.traits?.length) lines.push(`Traits ${domainLabels[roll.domain] ?? roll.domain} tirés : ${roll.traits.join(", ")}.`);
  if (roll.legendaryTraits?.length) lines.push(`Trait légendaire tiré : ${roll.legendaryTraits.join(", ")}.`);
  return lines.join(" ");
}

function getTraitRainLevelEffects(kind, positive) {
  const tone = positive ? "positifs" : "négatifs";
  const legendaryExamples = {
    population: positive
      ? "par exemple Immortal, Super Health ou Mega Heartbeat"
      : "par exemple Madness, Death Nuke ou Mark of Death",
    religion: positive
      ? "par exemple Rite of Unbroken Shield, Bloodline Bond ou Divine Insight"
      : "par exemple Rite of Falling Stars, Rite of Fractured Minds ou Grin Mark",
    "sous-espèce": positive
      ? "par exemple Hyper Intelligence, Fenix Born ou Gift of Life"
      : "par exemple Genetic Psychosis, Tentacle Horror ou Grin Mark",
  };
  return [
    `Applique aléatoirement 5 traits ${tone} de ${kind} à la cible choisie.`,
    `Applique aléatoirement 10 traits ${tone} de ${kind} à la cible choisie.`,
    `Applique aléatoirement 5 traits ${tone} de ${kind}, plus 1 trait légendaire ${positive ? "positif" : "négatif"} (${legendaryExamples[kind]}).`,
  ];
}

function getCardLevelEffects(card) {
  const name = card?.name ?? "Pouvoir";
  const category = String(card?.category ?? "");
  const scale = card?.scale ?? inferCardScale(card ?? {});

  if (name === "Déclarer la guerre") {
    return [
      "Le gagnant doit déclarer une guerre entre sa civilisation et une civilisation accessible.",
      "Le gagnant peut jeter la carte sans effet, ou déclarer une guerre entre deux civilisations de son choix ; il n'est pas obligé d'y participer.",
      "Le gagnant peut jeter la carte ou déclarer jusqu'à deux guerres distinctes entre les civilisations de son choix. Plusieurs guerres peuvent viser la même civilisation.",
    ];
  }
  if (name === "Proposer une alliance") {
    return [
      "Le gagnant doit former une alliance impliquant sa propre civilisation et une cible autorisée.",
      "Le gagnant peut jeter la carte ou former une alliance entre deux civilisations de son choix ; il n'est pas obligé d'en faire partie.",
      "Le gagnant peut jeter la carte ou former jusqu'à deux alliances distinctes entre les civilisations de son choix.",
    ];
  }
  if (name === "Rompre une alliance") {
    return [
      "Le gagnant doit rompre une alliance impliquant sa civilisation.",
      "Le gagnant peut jeter la carte ou rompre une alliance de son choix, même s'il n'en fait pas partie.",
      "Le gagnant peut jeter la carte ou rompre jusqu'à deux alliances de son choix.",
    ];
  }
  if (name === "Gamma Rain") return getTraitRainLevelEffects("population", true);
  if (name === "Omega Rain") return getTraitRainLevelEffects("population", false);
  if (name === "Religion Rain — Positive") return getTraitRainLevelEffects("religion", true);
  if (name === "Religion Rain — Negative") return getTraitRainLevelEffects("religion", false);
  if (name === "Subspecies Rain — Positive") return getTraitRainLevelEffects("sous-espèce", true);
  if (name === "Subspecies Rain — Negative") return getTraitRainLevelEffects("sous-espèce", false);
  if (name === "Delta Rain") {
    return [
      "Applique 5 traits aléatoires, positifs ou négatifs, à la population ciblée.",
      "Applique 10 traits aléatoires, positifs ou négatifs, à la population ciblée.",
      "Applique 5 traits aléatoires et 1 trait légendaire aléatoire, positif ou négatif, à la population ciblée.",
    ];
  }
  if (EXPLOSIVE_CARD_NAMES.has(name)) {
    return [
      `Le MJ applique exactement 1 ${name}.`,
      `Le MJ applique exactement 3 exemplaires de ${name}.`,
      `Le MJ applique exactement 10 exemplaires de ${name}.`,
    ];
  }
  if (name === "Territoire") {
    return [
      "Ajoute une petite extension côtière attachée à une île existante.",
      "Ajoute trois petites extensions cohérentes ou une grande extension attachée à une île existante.",
      "Ajoute dix petites extensions cohérentes ou deux très grandes extensions attachées à des îles existantes.",
    ];
  }
  if (name === "Life Eraser" || name === "Life Eraser ciblé") {
    return getZoneLevelEffects("toute vie", "Efface");
  }
  if (RESOURCE_ZONE_CARD_NAMES.has(name)) {
    return [
      `Répartit ${name} sur une province : une ville et son territoire immédiat. Le MJ ne compte pas chaque minerai généré.`,
      `Répartit ${name} sur une région : plusieurs provinces voisines. Le MJ ne compte pas chaque minerai généré.`,
      `Répartit ${name} sur une île entière. Le MJ ne compte pas chaque minerai généré.`,
    ];
  }
  if (category.includes("Créatures") || ["Humans", "Orcs", "Elves", "Dwarves"].includes(name)) {
    const [level1, level2, level3] = getCreatureLevelCounts(card);
    return [
      `Ajoute exactement ${level1} créature${level1 > 1 ? "s" : ""} de type ${name}.`,
      `Ajoute exactement ${level2} créatures de type ${name}.`,
      `Ajoute exactement ${level3} créatures de type ${name}.`,
    ];
  }
  if (name === "Colonie contrôlée") {
    return [
      "Crée une petite colonie contrôlée dans une province valide.",
      "Crée une colonie développée couvrant une région valide.",
      "Crée jusqu'à trois colonies développées sur une même île ou sur des îles valides distinctes.",
    ];
  }
  return getZoneLevelEffects(name);
}

function getCardLevelEffect(card, level = card?.level) {
  return getCardLevelEffects(card)[normalizeCardLevel(level) - 1];
}

function getResolvedCardLevelEffect(card) {
  return [getCardLevelEffect(card), formatTraitRainResult(card)].filter(Boolean).join(" ");
}

const DEFAULT_AIS = Array.from({ length: MAX_PARTICIPANTS }, (_, index) => createDefaultAi(index));

function createDefaultAi(index, name = DEFAULT_REPRESENTATIVE_NAMES[index] ?? `Représentant ${index + 1}`) {
  return {
    id: `rep${index + 1}`,
    name,
    coins: 10,
    population: 10,
    soldiers: 0,
    colonies: 0,
    homePopulation: 10,
    alive: true,
    profileHand: [],
    activeProfile: "",
    previousProfileOnDraw: "",
    foundingCivilization: "",
    ghostReady: false,
    ghostActive: false,
    ghostUsed: false,
    hideEconomyRevealYear: null,
    hidePopulationRevealYear: null,
    auctionDoctrineLines: [],
  };
}

const BIOMES = [
  "Grass",
  "Savanna",
  "Birch",
  "Maple",
  "Swamp",
  "Jungle",
  "Corrupted",
  "Infernal",
  "Mushroom",
  "Candy",
  "Garlic",
  "Lemon",
  "Enchanted",
  "Arcane Desert",
  "Rocklands",
  "Crystal",
  "Permafrost",
  "Flower",
  "Celestial",
  "Singularity Swamp",
  "Paradox",
  "Clover",
];

const BIOME_DETAILS = {
  Grass: {
    danger: 3,
    materials: "Stone 4, Ore 3.",
    effect: "Biome neutre et stable. Bon départ généraliste : herbe, arbres, agriculture normale, peu de risques naturels.",
    strategy: "Excellent choix sûr pour croissance régulière, mais sans bonus militaire ou économique rare.",
  },
  Savanna: {
    danger: 5,
    materials: "Stone 5, Ore 3.",
    effect: "Biome sec et ouvert. Croissance correcte, terrain lisible, mais plus sensible aux incendies et aux pressions climatiques.",
    strategy: "Bon compromis expansion/ressources ; moins confortable qu'un biome fertile en crise longue.",
  },
  Birch: {
    danger: 3,
    materials: "Stone 4, Ore 3.",
    effect: "Forêt de bouleaux stable, proche d'un biome tempéré classique. Bois et développement sans menace spéciale majeure.",
    strategy: "Choix défensif calme : peu explosif, mais fiable pour une civilisation humaine.",
  },
  Maple: {
    danger: 4,
    materials: "Stone 4, Ore 3.",
    effect: "Forêt tempérée productive. Favorise un développement propre avec bois, nourriture et stabilité.",
    strategy: "Très bon biome de croissance sans prendre de risque systémique important.",
  },
  Swamp: {
    danger: 9,
    materials: "Stone 4, Ore 3.",
    effect: "Biome humide et lourd. Le terrain peut ralentir l'organisation, densifier la végétation et rendre les villes moins propres à gérer.",
    strategy: "Peut protéger indirectement par difficulté de terrain, mais il augmente le risque d'enlisement économique.",
  },
  Jungle: {
    danger: 8,
    materials: "Ore 1, Silver 5, Gems 1.",
    effect: "Biome dense et riche. Très bon potentiel économique grâce à l'argent et aux gemmes, mais la densité rend incendies et invasions plus chaotiques.",
    strategy: "Fort pour économie et population, dangereux si le feu, les monstres ou les maladies entrent dans le système.",
  },
  Corrupted: {
    danger: 16,
    materials: "Bones 7, butin global -1.",
    effect: "Biome hostile et corrompu. Il dégrade la qualité de vie, attire une ambiance de mort et peut transformer une zone en territoire instable.",
    strategy: "À prendre seulement si l'IA veut une frontière maudite ou une stratégie de nuisance ; mauvais pour une croissance saine.",
  },
  Infernal: {
    danger: 18,
    materials: "Ore 3, Adamantine 3.",
    effect: "Biome infernal extrêmement risqué. Il offre de l'adamantine, mais expose à un environnement violent, feu, chaleur et instabilité.",
    strategy: "Très gros pari : puissance militaire future contre risque de ruiner sa propre population.",
  },
  Mushroom: {
    danger: 17,
    materials: "Stone 5, Ore 3, Silver 3, Gems 1.",
    effect: "Biome champignon riche mais biologiquement inquiétant. Peut devenir excellent économiquement, tout en rappelant les risques d'infections et d'emballements organiques.",
    strategy: "Fort si contrôlé, catastrophique si une mécanique fongique hostile apparaît ou se combine à une guerre.",
  },
  Candy: {
    danger: 5,
    materials: "Stone 4, Ore 3.",
    effect: "Biome sucré et fertile, généralement favorable à la nourriture et au développement paisible.",
    strategy: "Bon biome économique doux ; le danger vient surtout d'une surpopulation future plutôt que du terrain lui-même.",
  },
  Garlic: {
    danger: 6,
    materials: "Stone 4, Ore 3.",
    effect: "Biome ail atypique. Plutôt stable, avec une identité défensive intéressante contre certains thèmes monstrueux selon arbitrage MJ.",
    strategy: "Choix de niche : moins productif qu'un biome premium, mais utile pour une civilisation qui veut un territoire étrange et résistant.",
  },
  Lemon: {
    danger: 5,
    materials: "Stone 5, Ore 3.",
    effect: "Biome citronné stable et lisible. Offre un peu plus de pierre que les biomes tempérés simples.",
    strategy: "Bon choix propre, pas spectaculaire ; intéressant si l'IA veut éviter les risques des biomes magiques.",
  },
  Enchanted: {
    danger: 8,
    materials: "Ore 2, Silver 5, Gems 1, butin global +1.",
    effect: "Biome enchanté très favorable à la croissance et à la richesse. Peut soutenir une forte démographie et une économie durable.",
    strategy: "Très puissant pour snowball pacifique ; danger indirect : attire les sabotages et crée une cible prioritaire.",
  },
  "Arcane Desert": {
    danger: 10,
    materials: "Stone 4, Ore 3, Silver 1, Gems 1.",
    effect: "Désert magique. Ressources précieuses présentes, mais terrain naturellement rude pour la nourriture, l'eau et la densité urbaine.",
    strategy: "Fort pour une stratégie minière ou magique, moins sûr pour une explosion démographique.",
  },
  Rocklands: {
    danger: 7,
    materials: "Stone 4, Ore 3, Gems 1.",
    effect: "Biome rocheux axé ressources. Bon pour pierre, minerai et gemmes, plus pauvre pour agriculture et expansion douce.",
    strategy: "Excellent socle industriel ; doit être compensé par nourriture ou colonies fertiles.",
  },
  Crystal: {
    danger: 12,
    materials: "Common Metal et Gems via flore/cristaux, butin global +2.",
    effect: "Biome de cristal riche et défensif. Peut produire une économie précieuse et des menaces/entités cristallines selon la simulation.",
    strategy: "Très bon pour forteresse et valeur long terme, mais plus instable qu'un biome naturel classique.",
  },
  Permafrost: {
    danger: 9,
    materials: "Stone 4, Ore 3.",
    effect: "Biome froid. Il limite naturellement certains incendies mais peut ralentir développement, nourriture et mobilité.",
    strategy: "Solide défensivement, moins bon pour la croissance rapide ; adapté aux civilisations patientes.",
  },
  Flower: {
    danger: 4,
    materials: "Stone 4, Ore 3.",
    effect: "Biome floral fertile et stable. Favorise un territoire vivant, agréable et relativement sûr.",
    strategy: "Très bon choix de croissance douce ; manque de ressources rares natives.",
  },
  Celestial: {
    danger: 7,
    materials: "Stone 4, Ore 3, Mythril 1.",
    effect: "Biome céleste rare avec accès naturel au mythril. Plutôt bénéfique, mais son avantage attire forcément les convoitises.",
    strategy: "Excellent pour préparer une armée qualitative sans aller vers un biome hostile.",
  },
  "Singularity Swamp": {
    danger: 11,
    materials: "Stone 4, Ore 3, butin global +3.",
    effect: "Marais de singularité, riche et anormal. Combine potentiel économique élevé et terrain difficile à lire.",
    strategy: "Puissant si bien stabilisé ; risqué car les anomalies et la densité peuvent amplifier les crises.",
  },
  Paradox: {
    danger: 9,
    materials: "Stone 4, Ore 3, Mythril 1.",
    effect: "Biome paradoxal avec mythril naturel. Plus étrange qu'un biome céleste, donc potentiellement plus instable selon le récit MJ.",
    strategy: "Très bon pour équipement avancé ; attention aux effets narratifs ou catastrophes liées à l'anomalie.",
  },
  Clover: {
    danger: 6,
    materials: "Stone 4, Ore 3, Gems 1, butin global +3.",
    effect: "Biome trèfle, chanceux et économiquement intéressant grâce aux gemmes et au bonus de butin.",
    strategy: "Bon choix de richesse peu dangereux ; moins protecteur qu'un biome défensif ou hostile.",
  },
};

const PROFILE_DECK = [
  {
    id: "patient",
    name: "L'Institutionnaliste",
    mental: "Aucune décision majeure sans mandat, débat et majorité claire.",
    bonus: "+3 pièces quand il passe, en plus du bonus de passe standard : il capitalise politiquement sur la retenue.",
    malus: "Ne peut jamais poser la première mise : il doit attendre qu'une autre civilisation ouvre officiellement l'enjeu.",
  },
  {
    id: "warlord",
    name: "Le Militariste",
    mental: "La sécurité vient de la supériorité militaire, pas des promesses.",
    bonus: "+6 pièces de revenu par civilisation actuellement en guerre : l'économie se mobilise autour du conflit.",
    malus: "-4 pièces par enchère si le monde est en paix complète : son appareil politique perd son carburant.",
  },
  {
    id: "merchant",
    name: "Le Bloc Industriel",
    mental: "Le pouvoir appartient à celui qui contrôle les mines, les ateliers et les flux.",
    bonus: "+3 pièces × Level chaque fois qu'une carte Ressource est adjugée, qu'il l'achète ou non.",
    malus: "-3 pièces de revenu par tranche de 1000 soldats dans son armée : l'armée absorbe sa capacité productive.",
  },
  {
    id: "sage",
    name: "L'Humaniste",
    mental: "Une civilisation forte protège les vivants avant de chercher la domination.",
    bonus: "+2 pièces × Level quand une carte de Bénéfice 5 ou moins, ou un Contre-pouvoir, apparaît.",
    malus: "-3 pièces × Level quand il remporte une carte de Destruction ou une créature hostile.",
  },
  {
    id: "paranoid",
    name: "Le Sécuritaire",
    mental: "Toute ouverture est une faille. Toute faille appelle une réponse.",
    bonus: "+8 pièces chaque fois qu'une carte hostile est jouée contre lui : l'opinion accepte l'état d'urgence.",
    malus: "Doit garder au moins 20 pièces. S'il est sous 20 au revenu, il perd 5 pièces en dépenses d'urgence.",
  },
  {
    id: "diplomat",
    name: "Le Fédéraliste",
    mental: "Les blocs durables gagnent mieux que les conquêtes solitaires.",
    bonus: "+6 pièces × Level lorsqu'il achète une carte Alliance.",
    malus: "-6 pièces chaque fois qu'une guerre est déclarée, même sans lui : la guerre décrédibilise son projet d'ordre commun.",
  },
  {
    id: "scholar",
    name: "Le Traditionaliste",
    mental: "Ce qui a déjà fonctionné doit guider ce qui vient ensuite.",
    bonus: "+4 pièces chaque fois qu'une carte déjà jouée réapparaît.",
    malus: "-2 pièces × Level quand une carte totalement nouvelle de puissance 16/20 ou plus apparaît.",
  },
  {
    id: "martyr",
    name: "Le Gouvernement en exil",
    mental: "Même vaincu, un régime peut survivre par ses réseaux, ses archives et sa revanche.",
    bonus: "À sa mort, devient un acteur secret avec 120 pièces pour revenir sur une seule enchère.",
    malus: "-4 pièces de revenu de base en permanence : il finance des réseaux dormants au lieu de l'économie visible.",
  },
  {
    id: "tyrant",
    name: "L'Autoritaire",
    mental: "Le pouvoir doit frapper vite, fort, et laisser peu d'espace à la contestation.",
    bonus: "+4 pièces × Level chaque fois qu'il remporte une carte de Destruction.",
    malus: "-4 pièces chaque fois qu'il passe : reculer coûte cher à son image de force.",
  },
  {
    id: "vagabond",
    name: "Le Projet Colonial",
    mental: "Une nation qui ne s'étend pas se condamne à subir la géographie des autres.",
    bonus: "+5 pièces par colonie possédée hors de son territoire natal, jusqu'à 3 colonies comptées.",
    malus: "-5 pièces si son territoire natal dépasse 75% de sa population totale : son idéologie exige une présence extérieure.",
  },
  {
    id: "maximalist",
    name: "Le Maximaliste",
    mental: "Une carte ne mérite d'être achetée que si elle peut changer l'ordre du monde.",
    bonus: "+6 pièces pour une carte Level 2 remportée ; +15 pièces pour une carte Level 3 remportée.",
    malus: "-4 pièces quand il remporte une carte Level 1 : sa base juge l'achat insignifiant.",
  },
  {
    id: "minimalist",
    name: "Le Minimaliste",
    mental: "Les petits leviers répétés valent mieux que les catastrophes incontrôlables.",
    bonus: "+6 pièces lorsqu'il remporte une carte Level 1.",
    malus: "-10 pièces lorsqu'il remporte une carte Level 3.",
  },
  {
    id: "naturalist",
    name: "L'Écologiste",
    mental: "Le territoire vivant est une richesse plus durable que toute victoire militaire.",
    bonus: "+4 pièces chaque fois qu'une carte Nature ou Nature bénéfique apparaît.",
    malus: "-6 pièces lorsqu'il remporte une carte de Destruction.",
  },
  {
    id: "occultist",
    name: "Le Théocrate",
    mental: "Les traits, les religions et les lignées sont les véritables instruments du pouvoir.",
    bonus: "+8 pièces lorsqu'il remporte une pluie de traits de population, religion ou sous-espèce.",
    malus: "-4 pièces chaque fois qu'un Contre-pouvoir apparaît.",
  },
  {
    id: "rebuilder",
    name: "Le Reconstructionniste",
    mental: "Les civilisations qui savent réparer survivent aux empires qui savent seulement frapper.",
    bonus: "+10 pièces lorsqu'il remporte un Contre-pouvoir.",
    malus: "-6 pièces lorsqu'il remporte une carte de Destruction.",
  },
  {
    id: "underdog",
    name: "Le Tribun du Peuple",
    mental: "La légitimité appartient aux peuples menacés d'effacement.",
    bonus: "+6 pièces de revenu quand sa part démographique est sous le seuil faible.",
    malus: "-4 pièces de revenu s'il possède la plus grande population mondiale.",
  },
  {
    id: "treasurer",
    name: "L'Austéritaire",
    mental: "Une réserve intacte est une arme que l'adversaire ne peut pas encore mesurer.",
    bonus: "+5 pièces de revenu s'il possède au moins 100 pièces avant revenus.",
    malus: "-5 pièces de revenu s'il possède moins de 20 pièces avant revenus.",
  },
  {
    id: "scavenger",
    name: "Le Récupérateur",
    mental: "Ce que les autres refusent d'acheter nourrit ceux qui savent attendre.",
    bonus: "+6 pièces par carte non attribuée à la fin du duopole.",
    malus: "-4 pièces si les deux cartes du duopole sont attribuées.",
  },
  {
    id: "balancer",
    name: "L'Équilibriste",
    mental: "Le monde reste gouvernable tant que chaque menace rencontre une possibilité de construction.",
    bonus: "+8 pièces quand le duopole oppose au moins une carte hostile à une carte constructive.",
    malus: "-6 pièces quand les deux cartes du duopole sont hostiles.",
  },
  {
    id: "duelist",
    name: "Le Duelliste",
    mental: "Être chassé d'un enjeu n'est qu'une invitation à conquérir l'autre.",
    bonus: "+8 pièces s'il remporte une carte après avoir été délogé de l'autre carte du duopole.",
    malus: "-4 pièces s'il remporte une carte sans avoir subi aucun délogement.",
  },
];

let state = loadState();
let undoStack = [];
let expandedPromptGroups = new Set();
let serverSaveTimer = null;
let wbCurrentRotation = 0;
let wbLastRenderedCardKeys = {};
let wbLastRenderedBidValues = {};
let wbAudioCtx = null;
let wbWheelAutoMode = false;
let wbWheelAutoTimer = null;
let wbSeenChronicleEntryIds = new Set((state.simulationMemory ?? []).map((entry) => entry.id));
let activeHistoryChartType = null;
let historyChartHover = null;
const historyChartHitMaps = new WeakMap();
const HISTORY_CHART_COLORS = ["#2dd4bf", "#f59e0b", "#60a5fa", "#f472b6", "#a78bfa", "#34d399", "#fb7185", "#facc15", "#38bdf8", "#c084fc", "#4ade80", "#f97316", "#818cf8", "#14b8a6", "#e879f9", "#eab308"];
let serverPersistence = {
  checked: false,
  available: null,
  saving: false,
  lastSavedAt: state.savedAt ?? "",
  message: "Mémoire : chargement",
};

const els = {
  settingsPanel: document.querySelector("#settingsPanel"),
  settingsToggleBtn: document.querySelector("#settingsToggleBtn"),
  settingsCloseBtn: document.querySelector("#settingsCloseBtn"),
  memoryPanel: document.querySelector("#memoryPanel"),
  memoryToggleBtn: document.querySelector("#memoryToggleBtn"),
  memoryCloseBtn: document.querySelector("#memoryCloseBtn"),
  profilesPanel: document.querySelector("#profilesPanel"),
  profilesToggleBtn: document.querySelector("#profilesToggleBtn"),
  profilesCloseBtn: document.querySelector("#profilesCloseBtn"),
  profilesGuideList: document.querySelector("#profilesGuideList"),
  participantsPanel: document.querySelector("#participantsPanel"),
  participantCountInput: document.querySelector("#participantCountInput"),
  randomParticipantCountBtn: document.querySelector("#randomParticipantCountBtn"),
  participantNamesGrid: document.querySelector("#participantNamesGrid"),
  auctionCardA: document.querySelector("#auctionCardA"),
  auctionCardB: document.querySelector("#auctionCardB"),
  cardNameA: document.querySelector("#cardNameA"),
  cardNameB: document.querySelector("#cardNameB"),
  cardMetaA: document.querySelector("#cardMetaA"),
  cardMetaB: document.querySelector("#cardMetaB"),
  cardEffectA: document.querySelector("#cardEffectA"),
  cardEffectB: document.querySelector("#cardEffectB"),
  currentBidA: document.querySelector("#currentBidA"),
  currentBidB: document.querySelector("#currentBidB"),
  currentWinnerA: document.querySelector("#currentWinnerA"),
  currentWinnerB: document.querySelector("#currentWinnerB"),
  currentTurn: document.querySelector("#currentTurn"),
  bidTargetSelect: document.querySelector("#bidTargetSelect"),
  bidInput: document.querySelector("#bidInput"),
  bidBtn: document.querySelector("#bidBtn"),
  passBtn: document.querySelector("#passBtn"),
  newAuctionBtn: document.querySelector("#newAuctionBtn"),
  turnOrder: document.querySelector("#turnOrder"),
  aiGrid: document.querySelector("#aiGrid"),
  populationChartCanvas: document.querySelector("#populationChartCanvas"),
  economyChartCanvas: document.querySelector("#economyChartCanvas"),
  populationChartPointToggles: document.querySelector("#populationChartPointToggles"),
  economyChartPointToggles: document.querySelector("#economyChartPointToggles"),
  copyChartsTextBtn: document.querySelector("#copyChartsTextBtn"),
  chartOverlay: document.querySelector("#chartOverlay"),
  chartOverlayTitle: document.querySelector("#chartOverlayTitle"),
  chartOverlayCanvas: document.querySelector("#chartOverlayCanvas"),
  chartOverlayCloseBtn: document.querySelector("#chartOverlayCloseBtn"),
  auctionLog: document.querySelector("#auctionLog"),
  winnerActionInputA: document.querySelector("#winnerActionInputA"),
  winnerActionInputB: document.querySelector("#winnerActionInputB"),
  memoryInput: document.querySelector("#memoryInput"),
  memoryTypeSelect: document.querySelector("#memoryTypeSelect"),
  memoryImportantInput: document.querySelector("#memoryImportantInput"),
  memorySearchInput: document.querySelector("#memorySearchInput"),
  memoryCount: document.querySelector("#memoryCount"),
  memoryPreview: document.querySelector("#memoryPreview"),
  addMemoryBtn: document.querySelector("#addMemoryBtn"),
  importMemoryBtn: document.querySelector("#importMemoryBtn"),
  copyMemoryBtn: document.querySelector("#copyMemoryBtn"),
  copyCleanMemoryBtn: document.querySelector("#copyCleanMemoryBtn"),
  copyEpicMemoryBtn: document.querySelector("#copyEpicMemoryBtn"),
  dedupeMemoryBtn: document.querySelector("#dedupeMemoryBtn"),
  promptHub: document.querySelector("#promptHub"),
  reportPromptBlock: document.querySelector("#reportPromptBlock"),
  copyReportBtn: document.querySelector("#copyReportBtn"),
  toast: document.querySelector("#toast"),
  sessionPersistenceStatus: document.querySelector("#sessionPersistenceStatus"),
  yearInput: document.querySelector("#yearInput"),
  incomeInput: document.querySelector("#incomeInput"),
  underdogInput: document.querySelector("#underdogInput"),
  thresholdInput: document.querySelector("#thresholdInput"),
  passRewardInput: document.querySelector("#passRewardInput"),
  worldMapSelect: document.querySelector("#worldMapSelect"),
  previewCardsSelect: document.querySelector("#previewCardsSelect"),
  forcedPowerSelect: document.querySelector("#forcedPowerSelect"),
  forcedPowerLevelSelect: document.querySelector("#forcedPowerLevelSelect"),
  futureCardsPanel: document.querySelector("#futureCardsPanel"),
  fortuneWheelPanel: document.querySelector("#fortuneWheelPanel"),
  wbTriggerWheel: document.querySelector("#wb-trigger-wheel"),
  wbWheelModal: document.querySelector("#wb-wheel-modal"),
  wbFortuneWheel: document.querySelector("#wb-fortune-wheel"),
  wbWheelTitle: document.querySelector("#wb-wheel-title"),
  wbWheelMeta: document.querySelector("#wb-wheel-meta"),
  wbWheelCenter: document.querySelector("#wb-wheel-center"),
  wbWheelAiList: document.querySelector("#wb-wheel-ai-list"),
  wbWheelCurrentOption: document.querySelector("#wb-wheel-current-option"),
  wbSpinWheelBtn: document.querySelector("#wb-spin-wheel-btn"),
  wbAutoWheelBtn: document.querySelector("#wb-auto-wheel-btn"),
  wbCloseWheelBtn: document.querySelector("#wb-close-wheel-btn"),
  wbEndWheelBtn: document.querySelector("#wb-end-wheel-btn"),
  wbCopyWheelResultsBtn: document.querySelector("#wb-copy-wheel-results-btn"),
  wbWheelResult: document.querySelector("#wb-wheel-result"),
  incrementOutput: document.querySelector("#incrementOutput"),
  eventReminders: document.querySelector("#eventReminders"),
};

els.newAuctionBtn.addEventListener("click", handleAuctionCycleButton);
document.querySelector("#bidBtn").addEventListener("click", placeBid);
document.querySelector("#passBtn").addEventListener("click", passTurn);
document.querySelector("#undoBtn").addEventListener("click", undo);
document.querySelector("#resetBtn").addEventListener("click", resetAll);
els.wbTriggerWheel?.addEventListener("click", wbOpenWheel);
els.wbSpinWheelBtn?.addEventListener("click", wbSpinWheel);
els.wbAutoWheelBtn?.addEventListener("click", wbToggleWheelAutoMode);
els.wbCloseWheelBtn?.addEventListener("click", wbCloseWheel);
els.wbEndWheelBtn?.addEventListener("click", closeFortuneWheelEvent);
els.wbCopyWheelResultsBtn?.addEventListener("click", copyFortuneWheelResultsPrompt);
document.querySelectorAll("[data-chart-open]").forEach((button) => {
  button.addEventListener("click", () => openHistoryChart(button.dataset.chartOpen));
});
els.chartOverlayCloseBtn?.addEventListener("click", closeHistoryChart);
els.copyChartsTextBtn?.addEventListener("click", copyChartsTextSupport);
[els.populationChartCanvas, els.economyChartCanvas, els.chartOverlayCanvas].filter(Boolean).forEach((canvas) => {
  canvas.addEventListener("mousemove", handleHistoryChartPointerMove);
  canvas.addEventListener("mouseleave", handleHistoryChartPointerLeave);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && els.chartOverlay && !els.chartOverlay.hidden) {
    closeHistoryChart();
    return;
  }
  if (event.key !== "Escape" || !isWheelModalOpen()) return;
  if (state.fortuneWheel?.spinning) return;
  wbCloseWheel();
});
els.addMemoryBtn.addEventListener("click", addManualMemory);
els.importMemoryBtn.addEventListener("click", importMemoryFromInput);
els.copyMemoryBtn.addEventListener("click", copySimulationMemory);
els.copyCleanMemoryBtn.addEventListener("click", copyCleanSimulationMemory);
els.copyEpicMemoryBtn.addEventListener("click", copyEpicChroniclePrompt);
els.dedupeMemoryBtn.addEventListener("click", dedupeSimulationMemory);
els.copyReportBtn.addEventListener("click", copyLog);
els.memorySearchInput.addEventListener("input", renderMemoryPanel);
els.settingsToggleBtn.addEventListener("click", () => toggleUtilityPanel("settings"));
els.settingsCloseBtn.addEventListener("click", () => {
  els.settingsPanel.hidden = true;
});
els.memoryToggleBtn.addEventListener("click", () => toggleUtilityPanel("memory"));
els.memoryCloseBtn.addEventListener("click", () => {
  els.memoryPanel.hidden = true;
});
els.profilesToggleBtn.addEventListener("click", () => toggleUtilityPanel("profiles"));
els.profilesCloseBtn.addEventListener("click", () => {
  els.profilesPanel.hidden = true;
});
els.participantCountInput.addEventListener("input", handleParticipantCountChange);
els.participantCountInput.addEventListener("change", handleParticipantCountChange);
els.randomParticipantCountBtn.addEventListener("click", randomizeParticipantCount);

function toggleUtilityPanel(panelName) {
  const panels = {
    settings: els.settingsPanel,
    memory: els.memoryPanel,
    profiles: els.profilesPanel,
  };
  const target = panels[panelName];
  const shouldOpen = target.hidden;
  Object.values(panels).forEach((panel) => {
    panel.hidden = true;
  });
  target.hidden = !shouldOpen;
}

function handleParticipantCountChange() {
  const nextCount = readNumberInput(els.participantCountInput, state.ais.length, MIN_PARTICIPANTS, MAX_PARTICIPANTS);
  if (nextCount === state.ais.length) {
    state.participantCountMode = "manual";
    persistState();
    return;
  }
  pushUndo();
  resizeParticipants(nextCount);
  state.participantCountMode = "manual";
  state.participantDraw = null;
  state.worldMap = null;
  saveAndRender();
}

function randomizeParticipantCount() {
  if (state.settings.year !== 0 || hasAuctionCards()) return;
  pushUndo();
  const nextCount = MIN_PARTICIPANTS + Math.floor(Math.random() * (MAX_PARTICIPANTS - MIN_PARTICIPANTS + 1));
  resizeParticipants(nextCount);
  state.participantCountMode = "random";
  state.participantDraw = null;
  state.worldMap = null;
  clearParticipantDrawPromptChecks();
  saveAndRender();
  showToast(`Effectif tiré : ${nextCount} IA`);
}

["yearInput", "incomeInput", "underdogInput", "passRewardInput", "worldMapSelect", "previewCardsSelect", "forcedPowerSelect", "forcedPowerLevelSelect"].forEach((key) => {
  els[key].addEventListener("change", () => {
    pushUndo();
    state.settings = readSettings();
    applyWorldMapSelectionChange(key);
    handleAgeMilestones();
    if (["previewCardsSelect", "forcedPowerSelect", "forcedPowerLevelSelect"].includes(key)) refreshCardForecast({ force: true });
    saveAndRender();
  });
});

["incomeInput", "underdogInput", "passRewardInput", "worldMapSelect", "previewCardsSelect", "forcedPowerSelect", "forcedPowerLevelSelect"].forEach((key) => {
  els[key].addEventListener("input", () => {
    state.settings = readSettings();
    if (["previewCardsSelect", "forcedPowerSelect", "forcedPowerLevelSelect"].includes(key)) refreshCardForecast({ force: true });
    persistState();
  });
});

function applyWorldMapSelectionChange(changedKey) {
  if (changedKey !== "worldMapSelect") return;
  if (state.settings.year !== 0 || hasAuctionCards()) return;
  state.worldMap = null;
  clearParticipantDrawPromptChecks();
}

els.yearInput.addEventListener("input", () => {
  state.settings.year = readNumberInput(els.yearInput, 0, 0);
  render();
  persistState();
});

els.bidTargetSelect?.addEventListener("change", () => {
  state.auction.selectedSlotId = els.bidTargetSelect.value;
  persistState();
  renderCard();
});

[
  ["A", els.winnerActionInputA],
  ["B", els.winnerActionInputB],
].forEach(([slotId, input]) => {
  input?.addEventListener("input", () => {
    const slot = getAuctionSlot(slotId);
    if (slot) slot.winnerAction = input.value;
    persistState();
    renderLog();
    renderPromptHub();
  });
});

handleAgeMilestones();
persistState({ remote: false, touch: false });
render();
hydrateStateFromServer();

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return normalizeStateShape(JSON.parse(saved));
    } catch {
      // Fall through to fresh state.
    }
  }
  return createFreshState();
}

function createFreshState() {
  return {
    ais: normalizeAis(structuredClone(DEFAULT_AIS)),
    settings: defaultSettings(),
    auction: emptyAuction(),
    log: [],
    pendingCounters: [],
    cardHistory: [],
    profileDrawYears: [],
    usedBiomes: [],
    biomeDraws: {},
    biomeChoices: {},
    foundingCivilizationDraws: {},
    participantDraw: null,
    participantCountMode: "manual",
    worldMap: null,
    cardForecast: [],
    cardForecastKey: "",
    fortuneWheel: createDefaultFortuneWheel(0),
    lastAuctionReport: "",
    lastIncomeSummary: "",
    postIncomePromptYear: null,
    simulationMemory: [],
    historySnapshots: [],
    chartPointLabels: { population: [], economy: [] },
    copiedPromptKeys: [],
    savedAt: null,
  };
}

function normalizeStateShape(parsed = {}) {
  const settings = normalizeSettings(parsed.settings);
  return {
    ais: normalizeAis(parsed.ais ?? structuredClone(DEFAULT_AIS)),
    settings,
    auction: normalizeAuction(parsed.auction ?? emptyAuction()),
    log: parsed.log ?? [],
    pendingCounters: parsed.pendingCounters ?? [],
    cardHistory: parsed.cardHistory ?? [],
    profileDrawYears: parsed.profileDrawYears ?? [],
    usedBiomes: parsed.usedBiomes ?? [],
    biomeDraws: parsed.biomeDraws ?? {},
    biomeChoices: parsed.biomeChoices ?? {},
    foundingCivilizationDraws: normalizeFoundingCivilizationDraws(parsed.foundingCivilizationDraws),
    participantDraw: normalizeParticipantDraw(parsed.participantDraw),
    participantCountMode: parsed.participantCountMode === "random" ? "random" : "manual",
    worldMap: normalizeWorldMap(parsed.worldMap, settings),
    cardForecast: normalizeCardForecastEntries(parsed.cardForecast),
    cardForecastKey: parsed.cardForecastKey ?? "",
    fortuneWheel: normalizeFortuneWheel(parsed.fortuneWheel, settings.year ?? 0),
    lastAuctionReport: parsed.lastAuctionReport ?? "",
    lastIncomeSummary: parsed.lastIncomeSummary ?? "",
    postIncomePromptYear: parsed.postIncomePromptYear ?? null,
    simulationMemory: normalizeSimulationMemory(parsed.simulationMemory ?? []),
    historySnapshots: normalizeHistorySnapshots(parsed.historySnapshots),
    chartPointLabels: normalizeChartPointLabels(parsed.chartPointLabels),
    copiedPromptKeys: normalizeCopiedPromptKeys(parsed.copiedPromptKeys),
    savedAt: parsed.savedAt ?? null,
  };
}

function normalizeParticipantDraw(value) {
  if (!value || typeof value !== "object") return null;
  const slots = Number.isInteger(Number(value.slots)) && Number(value.slots) >= MIN_PARTICIPANTS && Number(value.slots) <= MAX_PARTICIPANTS
    ? Number(value.slots)
    : 0;
  const selectedChampionIds = Array.isArray(value.selectedChampionIds)
    ? value.selectedChampionIds.map(String).filter(Boolean)
    : [];
  if (!slots || selectedChampionIds.length !== slots) return null;
  return {
    slots,
    preDrawnPairIds: Array.isArray(value.preDrawnPairIds) ? value.preDrawnPairIds.map(String).slice(0, 2) : [],
    drawSteps: Array.isArray(value.drawSteps) ? value.drawSteps : [],
    selectedChampionIds,
    selectedNames: Array.isArray(value.selectedNames) ? value.selectedNames.map(String) : [],
    completedAt: String(value.completedAt ?? ""),
  };
}

function normalizeWorldMap(value, settings = {}) {
  if (!value || typeof value !== "object") return null;
  const map = WORLD_MAPS.find((entry) => entry.id === value.mapId);
  if (!map) return null;
  return {
    mapId: map.id,
    selectionMode: value.selectionMode === "manual" ? "manual" : "random",
    placements: Array.isArray(value.placements) ? value.placements : [],
    neutralZones: Array.isArray(value.neutralZones) ? value.neutralZones.map(String) : [],
    drawnAt: String(value.drawnAt ?? ""),
    participantCount: Math.max(0, Math.floor(Number(value.participantCount) || 0)),
  };
}

function normalizeCardForecastEntries(entries) {
  if (!Array.isArray(entries)) return [];
  return entries.map((entry) => {
    const power = getPowerByName(entry?.cardName);
    if (!power) return entry;
    const card = prepareDrawnCard({
      ...power,
      level: normalizeCardLevel(entry.level, 1),
      traitRoll: entry.traitRoll ?? null,
    });
    return {
      ...entry,
      level: card.level,
      traitRoll: card.traitRoll ?? null,
    };
  });
}

function normalizeChartPointLabels(value = {}) {
  const normalizeIds = (ids) => Array.isArray(ids)
    ? [...new Set(ids.map((id) => String(id ?? "")).filter(Boolean))]
    : [];
  return {
    population: normalizeIds(value.population),
    economy: normalizeIds(value.economy),
  };
}

function normalizeFoundingCivilizationDraws(draws) {
  if (!draws || typeof draws !== "object") return {};
  const validIds = new Set(FOUNDING_CIVILIZATIONS.map((civilization) => civilization.id));
  return Object.fromEntries(Object.entries(draws).map(([aiId, options]) => [
    aiId,
    [...new Set(Array.isArray(options) ? options.filter((id) => validIds.has(id)) : [])].slice(0, 2),
  ]).filter(([, options]) => options.length === 2));
}

function normalizeCopiedPromptKeys(keys) {
  return Array.isArray(keys)
    ? [...new Set(keys.map((key) => String(key ?? "")).filter(Boolean))].slice(-600)
    : [];
}

function normalizeHistorySnapshots(snapshots) {
  return Array.isArray(snapshots)
    ? snapshots.map((snapshot, index) => ({
      id: snapshot.id ?? `snapshot-${index}`,
      year: Math.max(0, Math.floor(Number(snapshot.year) || 0)),
      reason: String(snapshot.reason ?? "Snapshot"),
      entries: Array.isArray(snapshot.entries)
        ? snapshot.entries.map((entry) => ({
          id: String(entry.id ?? ""),
          name: String(entry.name ?? entry.id ?? "IA"),
          population: Math.max(0, Math.floor(Number(entry.population) || 0)),
          coins: Math.max(0, Math.floor(Number(entry.coins) || 0)),
          alive: entry.alive !== false,
        })).filter((entry) => entry.id)
        : [],
    })).filter((snapshot) => snapshot.entries.length).slice(-80)
    : [];
}

function normalizeSimulationMemory(memory) {
  return Array.isArray(memory)
    ? memory.map((entry, index) => ({
      id: entry.id ?? `legacy-${index}`,
      year: Math.max(0, Math.floor(Number(entry.year) || 0)),
      type: entry.type ?? "Événement",
      text: String(entry.text ?? ""),
      createdAt: entry.createdAt ?? "",
      important: Boolean(entry.important),
    })).filter((entry) => entry.text.trim())
    : [];
}

function normalizeAis(ais) {
  const normalized = Array.isArray(ais) && ais.length ? ais.slice(0, MAX_PARTICIPANTS) : structuredClone(DEFAULT_AIS);
  while (normalized.length < MIN_PARTICIPANTS) {
    normalized.push(createDefaultAi(normalized.length));
  }

  return normalized.map((ai, index) => ({
    ...createDefaultAi(index),
    ...ai,
    id: ai.id || `rep${index + 1}`,
    name: sanitizeRepresentativeName(ai.name, index),
    soldiers: ai.soldiers ?? 0,
    colonies: ai.colonies ?? 0,
    homePopulation: ai.homePopulation ?? ai.population ?? 0,
    profileHand: ai.profileHand ?? [],
    activeProfile: ai.activeProfile ?? "",
    previousProfileOnDraw: ai.previousProfileOnDraw ?? "",
    foundingCivilization: getFoundingCivilization(ai.foundingCivilization) ? ai.foundingCivilization : "",
    ghostReady: ai.ghostReady ?? false,
    ghostActive: ai.ghostActive ?? false,
    ghostUsed: ai.ghostUsed ?? false,
    hideEconomyRevealYear: ai.hideEconomyRevealYear ?? null,
    hidePopulationRevealYear: ai.hidePopulationRevealYear ?? null,
    passBonusLevel: ai.passBonusLevel ?? 5,
    auctionDoctrineLines: Array.isArray(ai.auctionDoctrineLines) ? ai.auctionDoctrineLines : [],
  }));
}

function sanitizeRepresentativeName(name, index) {
  const trimmed = String(name ?? "").replace(/\s+/g, " ").trim();
  return trimmed || DEFAULT_REPRESENTATIVE_NAMES[index] || `Représentant ${index + 1}`;
}

function resizeParticipants(count) {
  const nextCount = Math.max(MIN_PARTICIPANTS, Math.min(MAX_PARTICIPANTS, Math.floor(Number(count) || state.ais.length)));

  if (nextCount < state.ais.length) {
    const removedIds = state.ais.slice(nextCount).map((ai) => ai.id);
    state.ais = state.ais.slice(0, nextCount);
    pruneRemovedParticipants(removedIds);
  }

  while (state.ais.length < nextCount) {
    state.ais.push(createDefaultAi(state.ais.length));
  }

  state.ais = normalizeAis(state.ais);
  state.settings.warCivs = Math.min(state.settings.warCivs ?? 0, state.ais.length);
  ensureFoundingCivilizationDraws();
}

function pruneRemovedParticipants(removedIds) {
  if (!removedIds.length) return;
  state.auction.order = state.auction.order.filter((id) => !removedIds.includes(id));
  state.auction.passed = state.auction.passed.filter((id) => !removedIds.includes(id));
  state.auction.ghostParticipants = (state.auction.ghostParticipants ?? []).filter((id) => !removedIds.includes(id));
  getAuctionSlots().forEach((slot) => {
    if (removedIds.includes(slot.winner)) slot.winner = null;
  });
  removedIds.forEach((id) => delete state.auction.blockedSlotByAi?.[id]);

  Object.values(state.biomeDraws ?? {}).forEach((draw) => {
    removedIds.forEach((id) => delete draw[id]);
  });
  Object.values(state.biomeChoices ?? {}).forEach((choices) => {
    removedIds.forEach((id) => delete choices[id]);
  });
  removedIds.forEach((id) => delete state.foundingCivilizationDraws?.[id]);

  if (state.fortuneWheel?.pendingTurns) {
    removedIds.forEach((id) => delete state.fortuneWheel.pendingTurns[id]);
  }
  if (state.fortuneWheel?.purchaseLedger) {
    removedIds.forEach((id) => delete state.fortuneWheel.purchaseLedger[id]);
  }
  if (removedIds.includes(state.fortuneWheel?.lastResolvedAiId)) state.fortuneWheel.lastResolvedAiId = null;
}

function normalizeAuction(auction) {
  const legacySlot = auction?.card
    ? createAuctionSlot("A", {
      card: auction.card,
      currentBid: auction.currentBid,
      winner: auction.winner,
      winnerAction: auction.winnerAction,
    })
    : createAuctionSlot("A");
  const sourceSlots = Array.isArray(auction?.slots) && auction.slots.length
    ? auction.slots
    : [legacySlot, createAuctionSlot("B")];
  const slots = ["A", "B"].map((id, index) => createAuctionSlot(id, sourceSlots[index]));
  const normalized = {
    ...emptyAuction(),
    ...auction,
    slots,
    selectedSlotId: ["A", "B"].includes(auction?.selectedSlotId) ? auction.selectedSlotId : "A",
    blockedSlotByAi: auction?.blockedSlotByAi && typeof auction.blockedSlotByAi === "object"
      ? { ...auction.blockedSlotByAi }
      : {},
    turnsTaken: auction.turnsTaken ?? 0,
    ghostParticipants: auction.ghostParticipants ?? [],
    endProcessed: auction.endProcessed ?? false,
  };
  delete normalized.card;
  delete normalized.currentBid;
  delete normalized.winner;
  delete normalized.winnerAction;
  return normalized;
}

function createAuctionSlot(id, source = {}) {
  const sourceCard = source?.card ?? null;
  const catalogueCard = sourceCard?.name ? getPowerByName(sourceCard.name) : null;
  const normalizedCard = sourceCard
    ? prepareDrawnCard({
      ...(catalogueCard ?? {}),
      ...sourceCard,
      scale: sourceCard.scale ?? catalogueCard?.scale ?? inferCardScale(sourceCard),
      rating: sourceCard.rating ?? catalogueCard?.rating ?? sourceCard.danger,
      level: normalizeCardLevel(sourceCard.level ?? catalogueCard?.level, 1),
    })
    : null;
  return {
    id,
    card: normalizedCard,
    currentBid: Math.max(0, Math.floor(Number(source?.currentBid) || 0)),
    winner: source?.winner ?? null,
    winnerAction: String(source?.winnerAction ?? ""),
  };
}

function getAuctionSlots() {
  return Array.isArray(state.auction?.slots) ? state.auction.slots : [];
}

function getAuctionSlot(slotId) {
  return getAuctionSlots().find((slot) => slot.id === slotId) ?? null;
}

function getAuctionLeaderIds() {
  return getAuctionSlots().map((slot) => slot.winner).filter(Boolean);
}

function hasAuctionCards() {
  return getAuctionSlots().some((slot) => Boolean(slot.card));
}

function defaultSettings() {
  return {
    year: 0,
    baseIncome: 10,
    underdogBonus: 5,
    passReward: 5,
    passMin: 2,
    warCivs: 0,
    worldMapChoice: "random",
    cardPreviewCount: 0,
    forcedPowerName: "",
    forcedPowerLevel: 0,
  };
}

function normalizeSettings(settings) {
  const legacyMapChoices = {
    duel: "fracture",
    matrix: "quinconce",
    ffa: "crown-nine",
    zeta: "crossroads",
  };
  const requestedMap = settings?.worldMapChoice ?? legacyMapChoices[settings?.worldMode] ?? "random";
  return {
    ...defaultSettings(),
    ...(settings ?? {}),
    worldMapChoice: normalizeWorldMapChoice(requestedMap),
    cardPreviewCount: [0, 5].includes(Number(settings?.cardPreviewCount)) ? Number(settings.cardPreviewCount) : 0,
    forcedPowerLevel: [0, 1, 2, 3].includes(Number(settings?.forcedPowerLevel)) ? Number(settings.forcedPowerLevel) : 0,
  };
}

function createDefaultFortuneWheel(year = 0) {
  const scheduledFromYear = Math.max(0, Math.floor(Number(year) || 0));
  const nextYear = getNextFortuneWheelYear(scheduledFromYear);
  return {
    nextYear,
    scheduledFromYear,
    unpredictability: getFortuneWheelUnpredictability(scheduledFromYear, nextYear),
    active: false,
    activeYear: null,
    pendingTurns: {},
    purchaseLedger: {},
    lastResolvedAiId: null,
    spinning: false,
    currentSpinOptions: [],
    currentSpinIndex: 0,
    lastResultText: "",
    results: [],
  };
}

function normalizeFortuneWheel(wheel, year = 0) {
  const normalized = {
    ...createDefaultFortuneWheel(year),
    ...(wheel ?? {}),
  };
  normalized.nextYear = Math.max(0, Math.floor(Number(normalized.nextYear) || getNextFortuneWheelYear(year)));
  const scheduledFromYear = Number(normalized.scheduledFromYear);
  normalized.scheduledFromYear = Math.max(0, Math.floor(Number.isFinite(scheduledFromYear) ? scheduledFromYear : year));
  normalized.unpredictability = clampFortuneWheelUnpredictability(
    Number.isFinite(Number(normalized.unpredictability))
      ? Number(normalized.unpredictability)
      : getFortuneWheelUnpredictability(normalized.scheduledFromYear, normalized.nextYear),
  );
  normalized.active = Boolean(normalized.active);
  normalized.activeYear = normalized.activeYear === null ? null : Math.max(0, Math.floor(Number(normalized.activeYear) || 0));
  normalized.pendingTurns = normalized.pendingTurns && typeof normalized.pendingTurns === "object" ? normalized.pendingTurns : {};
  normalized.purchaseLedger = normalized.purchaseLedger && typeof normalized.purchaseLedger === "object" ? normalized.purchaseLedger : {};
  normalized.lastResolvedAiId = normalized.lastResolvedAiId ?? null;
  normalized.spinning = false;
  normalized.currentSpinOptions = Array.isArray(normalized.currentSpinOptions) ? normalized.currentSpinOptions : [];
  normalized.currentSpinIndex = Math.max(0, Math.floor(Number(normalized.currentSpinIndex) || 0));
  normalized.lastResultText = String(normalized.lastResultText ?? "");
  normalized.results = Array.isArray(normalized.results) ? normalized.results.slice(-80) : [];
  return normalized;
}

function emptyAuction() {
  return {
    slots: [createAuctionSlot("A"), createAuctionSlot("B")],
    selectedSlotId: "A",
    blockedSlotByAi: {},
    order: [],
    turnIndex: 0,
    passed: [],
    active: false,
    closed: false,
    turnsTaken: 0,
    ghostParticipants: [],
    endProcessed: false,
  };
}

function saveAndRender() {
  persistState();
  render();
}

function persistState(options = {}) {
  const { remote = true, touch = true } = options;
  if (touch) {
    state.savedAt = new Date().toISOString();
    serverPersistence.lastSavedAt = state.savedAt;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (remote) queueServerStateSave();
  renderPersistenceStatus();
}

function queueServerStateSave() {
  if (serverPersistence.available === false) {
    renderPersistenceStatus();
    return;
  }
  clearTimeout(serverSaveTimer);
  serverSaveTimer = setTimeout(saveStateToServer, SERVER_STATE_DEBOUNCE_MS);
}

async function saveStateToServer() {
  serverPersistence.saving = true;
  renderPersistenceStatus();
  try {
    const response = await fetch(SERVER_STATE_ENDPOINT, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ storageKey: STORAGE_KEY, state }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    serverPersistence.checked = true;
    serverPersistence.available = true;
    serverPersistence.saving = false;
    serverPersistence.lastSavedAt = result.savedAt ?? state.savedAt ?? "";
    serverPersistence.message = "Mémoire serveur sauvegardée";
  } catch {
    serverPersistence.checked = true;
    serverPersistence.available = false;
    serverPersistence.saving = false;
    serverPersistence.message = "Mémoire navigateur uniquement";
  }
  renderPersistenceStatus();
}

async function hydrateStateFromServer() {
  try {
    const response = await fetch(SERVER_STATE_ENDPOINT, { cache: "no-store" });
    serverPersistence.checked = true;

    if (response.status === 204) {
      serverPersistence.available = true;
      serverPersistence.message = "Mémoire serveur prête";
      renderPersistenceStatus();
      if (state.savedAt) queueServerStateSave();
      return;
    }

    if (response.status === 404) {
      await hydrateStateFromStaticSnapshot();
      renderPersistenceStatus();
      return;
    }

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const payload = await response.json();
    const serverState = normalizeStateShape(payload.state ?? {});
    const serverSavedAt = getTimestamp(payload.savedAt ?? serverState.savedAt);
    const localSavedAt = getTimestamp(state.savedAt);

    serverPersistence.available = true;
    serverPersistence.lastSavedAt = payload.savedAt ?? serverState.savedAt ?? "";
    serverPersistence.message = "Mémoire serveur chargée";

    if (serverSavedAt > localSavedAt) {
      state = serverState;
      handleAgeMilestones();
      persistState({ remote: false, touch: false });
      render();
      showToast("Session restaurée depuis la mémoire serveur");
      return;
    }

    renderPersistenceStatus();
    if (localSavedAt > serverSavedAt) queueServerStateSave();
  } catch {
    await hydrateStateFromStaticSnapshot();
    if (!serverPersistence.message) {
      serverPersistence.message = "Mémoire navigateur uniquement";
    }
    renderPersistenceStatus();
  }
}

async function hydrateStateFromStaticSnapshot() {
  serverPersistence.checked = true;
  serverPersistence.available = false;

  try {
    const response = await fetch(STATIC_STATE_ENDPOINT, { cache: "no-store" });
    if (!response.ok) return false;

    const payload = await response.json();
    const staticState = normalizeStateShape(payload.state ?? {});
    const staticSavedAt = getTimestamp(payload.savedAt ?? staticState.savedAt);
    const localSavedAt = getTimestamp(state.savedAt);

    if (shouldForceStaticSnapshot() || staticSavedAt > localSavedAt) {
      state = staticState;
      handleAgeMilestones();
      persistState({ remote: false, touch: false });
      render();
      serverPersistence.lastSavedAt = payload.savedAt ?? staticState.savedAt ?? "";
      serverPersistence.message = "Session restaurée depuis l'export statique";
      showToast("Session actuelle chargée depuis l'export en ligne");
      return true;
    }
  } catch {
    // GitHub Pages ou un fichier local peut ne pas fournir d'export statique.
  }

  serverPersistence.message = "Mémoire navigateur uniquement";
  return false;
}

function shouldForceStaticSnapshot() {
  const params = new URLSearchParams(window.location.search);
  return params.get("restore") === "session" || params.get("session") === "current";
}

async function deleteStateFromServer() {
  try {
    await fetch(SERVER_STATE_ENDPOINT, { method: "DELETE" });
  } catch {
    // Le stockage navigateur reste réinitialisé même si le serveur statique ne gère pas l'API.
  }
}

function getTimestamp(value) {
  const time = Date.parse(value ?? "");
  return Number.isFinite(time) ? time : 0;
}

function renderPersistenceStatus() {
  if (!els.sessionPersistenceStatus) return;
  const localText = state.savedAt ? `local ${formatClockTime(state.savedAt)}` : "local prêt";
  let text = serverPersistence.message || "Mémoire : chargement";
  let className = "session-memory-status";

  if (serverPersistence.saving) {
    text = "Mémoire : sauvegarde...";
    className += " ok";
  } else if (serverPersistence.available) {
    const savedText = serverPersistence.lastSavedAt ? formatClockTime(serverPersistence.lastSavedAt) : localText;
    text = `Mémoire serveur : ${savedText}`;
    className += " ok";
  } else if (serverPersistence.checked) {
    text = serverPersistence.message && serverPersistence.message !== "Mémoire navigateur uniquement"
      ? serverPersistence.message
      : `Mémoire navigateur : ${localText}`;
    className += " warn";
  }

  els.sessionPersistenceStatus.textContent = text;
  els.sessionPersistenceStatus.className = className;
}

function formatClockTime(value) {
  const time = new Date(value);
  if (Number.isNaN(time.getTime())) return "prête";
  return time.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function render() {
  removeLegacyBiomePanel();
  renderPersistenceStatus();
  renderParticipantsSetup();
  renderSettings();
  renderAgeEvents();
  renderCard();
  renderAis();
  renderHistoryCharts();
  renderTurnOrder();
  renderLog();
  renderReportBlock();
  renderMemoryPanel();
  renderProfilesGuide();
  renderPromptHub();
  renderFortuneWheelTrigger();
  wbRenderWheelModal();
}

function renderParticipantsSetup() {
  els.participantsPanel.hidden = state.settings.year !== 0 || hasAuctionCards();
  els.participantCountInput.value = state.ais.length;
  els.participantNamesGrid.innerHTML = "";

  state.ais.forEach((ai, index) => {
    const label = document.createElement("label");
    label.className = "participant-name-field";
    label.textContent = `Représentant ${index + 1}`;

    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = 32;
    input.value = ai.name;
    input.placeholder = DEFAULT_REPRESENTATIVE_NAMES[index] ?? `Représentant ${index + 1}`;
    input.addEventListener("input", () => {
      ai.name = sanitizeRepresentativeName(input.value, index);
      persistState();
      syncRepresentativeNameDisplays(ai);
    });
    input.addEventListener("change", () => {
      pushUndo();
      ai.name = sanitizeRepresentativeName(input.value, index);
      saveAndRender();
    });

    label.appendChild(input);
    els.participantNamesGrid.appendChild(label);
  });
}

function syncRepresentativeNameDisplays(ai) {
  const cardName = document.querySelector(`.ai-card[data-ai-id="${ai.id}"] .ai-name`);
  if (cardName) cardName.textContent = ai.name;
  renderPromptHub();
  renderProfilesGuide();
}

function renderSettings() {
  ensureCardForecast();
  ensureFortuneWheelSchedule();
  renderForcedPowerSelect();
  els.yearInput.value = state.settings.year;
  els.incomeInput.value = state.settings.baseIncome;
  els.underdogInput.value = state.settings.underdogBonus;
  els.thresholdInput.value = `${formatPercent(getUnderdogThreshold() * 100)}%`;
  els.passRewardInput.value = state.settings.passReward;
  els.worldMapSelect.value = getWorldMapChoice();
  els.previewCardsSelect.value = String(getPreviewCardCount());
  els.forcedPowerSelect.value = getPowerByName(state.settings.forcedPowerName) ? state.settings.forcedPowerName : "";
  els.forcedPowerLevelSelect.value = String(state.settings.forcedPowerLevel ?? 0);
  renderFutureCardsPanel();
  renderFortuneWheelPanel();
}

function renderForcedPowerSelect() {
  const selectedValue = els.forcedPowerSelect.value || state.settings.forcedPowerName || "";
  els.forcedPowerSelect.innerHTML = "";

  const randomOption = document.createElement("option");
  randomOption.value = "";
  randomOption.textContent = "Aléatoire";
  els.forcedPowerSelect.appendChild(randomOption);

  getSelectablePowerGroups().forEach(({ label, powers }) => {
    const group = document.createElement("optgroup");
    group.label = label;

    powers.forEach((power) => {
      const option = document.createElement("option");
      option.value = power.name;
      option.textContent = `${formatCardName(power)} (${label}, ${formatCardRating(power)})`;
      group.appendChild(option);
    });

    els.forcedPowerSelect.appendChild(group);
  });

  els.forcedPowerSelect.value = getPowerByName(selectedValue) ? selectedValue : "";
}

function renderFutureCardsPanel() {
  if (!els.futureCardsPanel) return;
  const count = getPreviewCardCount();
  els.futureCardsPanel.hidden = !count;
  els.futureCardsPanel.innerHTML = "";
  if (!count) return;

  const title = document.createElement("div");
  title.className = "future-cards-title";
  title.textContent = "Prochaines cartes visibles MJ";
  els.futureCardsPanel.appendChild(title);

  const list = document.createElement("ol");
  list.className = "future-cards-list";
  ensureCardForecast().slice(0, count).forEach((entry) => {
    const power = getPowerByName(entry.cardName);
    const previewCard = power ? prepareDrawnCard({
      ...power,
      level: normalizeCardLevel(entry.level),
      traitRoll: entry.traitRoll ?? null,
    }) : null;
    const item = document.createElement("li");
    const name = power ? formatCardName(power) : entry.cardName;
    const meta = power ? `${getCardCategoryLabel(power)}, ${formatCardRating(power)}, Level ${normalizeCardLevel(entry.level)}` : "carte inconnue";
    const levelEffect = previewCard ? getResolvedCardLevelEffect(previewCard) : "";
    item.innerHTML = `<strong>An ${entry.year} - ${name}</strong><span>${meta}${entry.forced ? " - carte forcée" : ""}${entry.levelForced ? " - niveau forcé" : ""}${entry.counterSource ? ` - anti-${formatCardName(entry.counterSource)}` : ""}${entry.scheduledCounterDueIn ? ` - contre-pouvoir dans ${entry.scheduledCounterDueIn}` : ""}</span>${levelEffect ? `<span>${levelEffect}</span>` : ""}`;
    list.appendChild(item);
  });
  els.futureCardsPanel.appendChild(list);

  const note = document.createElement("p");
  note.className = "future-cards-note";
  note.textContent = "Ces cartes sont une file MJ : le prochain duopole consomme les deux premières cartes affichées, sauf si tu changes les paramètres ou forces une carte.";
  els.futureCardsPanel.appendChild(note);
}

function renderFortuneWheelPanel() {
  if (!els.fortuneWheelPanel) return;
  const wheel = state.fortuneWheel;
  els.fortuneWheelPanel.innerHTML = "";

  const header = document.createElement("div");
  header.className = "fortune-wheel-head";
  const titleWrap = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = "Roue de la fortune";
  const meta = document.createElement("p");
  const unpredictability = getCurrentFortuneWheelUnpredictability();
  meta.textContent = wheel.active
    ? `Active à l'an ${wheel.activeYear}. Coût : ${WHEEL_SPIN_COST} pièces par tour. Imprévisibilité : ${unpredictability}%.`
    : `Prochaine apparition prévue : An ${wheel.nextYear}. Imprévisibilité : ${unpredictability}%.`;
  titleWrap.append(title, meta);

  const avg = document.createElement("span");
  avg.className = "fortune-wheel-average";
  const gross = getFortuneWheelAverageValue();
  avg.textContent = `Moyenne théorique : ${formatSigned(gross)} brut / ${formatSigned(gross - WHEEL_SPIN_COST)} net`;
  const volatility = document.createElement("span");
  volatility.className = "fortune-wheel-average fortune-wheel-unpredictability";
  volatility.textContent = `Imprévisibilité : ${unpredictability}%`;
  header.append(titleWrap, avg, volatility);
  els.fortuneWheelPanel.appendChild(header);

  const actions = document.createElement("div");
  actions.className = "fortune-wheel-actions";
  const copyArrivalButton = document.createElement("button");
  copyArrivalButton.className = "secondary";
  copyArrivalButton.type = "button";
  copyArrivalButton.textContent = "Copier annonce";
  copyArrivalButton.disabled = !wheel.active;
  copyArrivalButton.addEventListener("click", copyFortuneWheelArrivalPrompt);
  actions.appendChild(copyArrivalButton);

  const copyResultsButton = document.createElement("button");
  copyResultsButton.className = "secondary";
  copyResultsButton.type = "button";
  copyResultsButton.textContent = "Copier résultats";
  copyResultsButton.disabled = !wheel.results.length;
  copyResultsButton.addEventListener("click", copyFortuneWheelResultsPrompt);
  actions.appendChild(copyResultsButton);

  const closeButton = document.createElement("button");
  closeButton.className = "secondary";
  closeButton.type = "button";
  closeButton.textContent = "Clore la roue";
  closeButton.disabled = !wheel.active || getTotalFortuneWheelPendingTurns() > 0 || wheel.spinning;
  closeButton.addEventListener("click", closeFortuneWheelEvent);
  actions.appendChild(closeButton);
  els.fortuneWheelPanel.appendChild(actions);

  if (!wheel.active) return;

  const purchaseGrid = document.createElement("div");
  purchaseGrid.className = "fortune-wheel-ai-grid";
  getFortuneWheelOrder().forEach((ai) => {
    const row = document.createElement("div");
    row.className = "fortune-wheel-ai-row";
    const info = document.createElement("span");
    info.textContent = `${ai.name} - ${ai.coins} pièces - ${getFortuneWheelTurnsForAi(ai.id)} tour${getFortuneWheelTurnsForAi(ai.id) > 1 ? "s" : ""}`;
    const button = document.createElement("button");
    button.className = "secondary";
    button.type = "button";
    button.textContent = `Acheter -${WHEEL_SPIN_COST}`;
    button.disabled = ai.coins < WHEEL_SPIN_COST || wheel.spinning;
    button.addEventListener("click", () => buyFortuneWheelTurn(ai.id));
    row.append(info, button);
    purchaseGrid.appendChild(row);
  });
  els.fortuneWheelPanel.appendChild(purchaseGrid);

  const spinBox = document.createElement("div");
  spinBox.className = "fortune-wheel-spin-box";
  const nextAi = getNextFortuneWheelAi();
  const spinner = document.createElement("div");
  spinner.id = "fortuneWheelSpinner";
  spinner.className = "fortune-wheel-spinner";
  const activeOption = wheel.currentSpinOptions[wheel.currentSpinIndex];
  spinner.textContent = wheel.spinning
    ? (activeOption ? getWheelEvent(activeOption)?.title ?? activeOption : "La roue tourne...")
    : (nextAi ? `Prochain tour : ${nextAi.name}` : "Aucun tour en attente.");
  const launchButton = document.createElement("button");
  launchButton.type = "button";
  launchButton.textContent = "Lancer prochain tour";
  launchButton.disabled = !nextAi || wheel.spinning;
  launchButton.addEventListener("click", launchFortuneWheelSpin);
  spinBox.append(spinner, launchButton);
  els.fortuneWheelPanel.appendChild(spinBox);

  if (wheel.lastResultText) {
    const last = document.createElement("p");
    last.className = "fortune-wheel-last";
    last.textContent = wheel.lastResultText;
    els.fortuneWheelPanel.appendChild(last);
  }

  if (wheel.results.length) {
    const list = document.createElement("div");
    list.className = "fortune-wheel-results";
    wheel.results.slice(-6).reverse().forEach((result) => {
      const line = document.createElement("p");
      line.textContent = result.text;
      list.appendChild(line);
    });
    els.fortuneWheelPanel.appendChild(list);
  }
}

function renderFortuneWheelTrigger() {
  if (!els.wbTriggerWheel) return;
  ensureFortuneWheelSchedule();
  const wheel = state.fortuneWheel;
  const active = Boolean(wheel?.active);
  const pendingTurns = active ? getTotalFortuneWheelPendingTurns() : 0;
  els.wbTriggerWheel.hidden = !active;
  els.wbTriggerWheel.disabled = !active;
  els.wbTriggerWheel.textContent = pendingTurns
    ? `Roue de la Fortune - ${pendingTurns} tour${pendingTurns > 1 ? "s" : ""}`
    : "Roue de la Fortune";
}

function isWheelModalOpen() {
  return Boolean(els.wbWheelModal && !els.wbWheelModal.classList.contains("wb-hidden"));
}

function wbOpenWheel() {
  ensureFortuneWheelSchedule();
  if (!state.fortuneWheel?.active) {
    showToast(`Roue prévue An ${state.fortuneWheel?.nextYear ?? "inconnu"}`);
    return;
  }
  if (!els.wbWheelModal) return;
  els.wbWheelModal.classList.remove("wb-hidden");
  els.wbWheelModal.setAttribute("aria-hidden", "false");
  wbRenderWheelModal();
}

function wbCloseWheel() {
  if (!els.wbWheelModal) return;
  wbStopWheelAutoMode();
  els.wbWheelModal.classList.add("wb-hidden");
  els.wbWheelModal.setAttribute("aria-hidden", "true");
}

function wbSpinWheel() {
  if (!state.fortuneWheel?.active) {
    showToast("La Roue de la Fortune n'est pas active");
    return;
  }
  launchFortuneWheelSpin();
}

function wbToggleWheelAutoMode() {
  if (!state.fortuneWheel?.active) {
    showToast("La Roue de la Fortune n'est pas active");
    return;
  }
  if (!getTotalFortuneWheelPendingTurns()) {
    showToast("Aucun tour en attente");
    return;
  }
  wbWheelAutoMode = !wbWheelAutoMode;
  if (wbWheelAutoMode) {
    wbScheduleAutoWheelSpin();
  } else {
    wbStopWheelAutoMode();
  }
  wbRenderWheelModal();
}

function wbStopWheelAutoMode() {
  wbWheelAutoMode = false;
  if (wbWheelAutoTimer) {
    window.clearTimeout(wbWheelAutoTimer);
    wbWheelAutoTimer = null;
  }
}

function wbScheduleAutoWheelSpin() {
  if (!wbWheelAutoMode || !state.fortuneWheel?.active || state.fortuneWheel.spinning) return;
  if (!getNextFortuneWheelAi()) {
    wbStopWheelAutoMode();
    wbRenderWheelModal();
    return;
  }
  if (wbWheelAutoTimer) window.clearTimeout(wbWheelAutoTimer);
  wbWheelAutoTimer = window.setTimeout(() => {
    wbWheelAutoTimer = null;
    if (!wbWheelAutoMode || state.fortuneWheel?.spinning || !getNextFortuneWheelAi()) return;
    launchFortuneWheelSpin();
  }, WB_WHEEL_AUTO_COOLDOWN_MS);
}

function wbRenderWheelModal() {
  if (!els.wbWheelModal || !state.fortuneWheel) return;
  const wheel = state.fortuneWheel;
  const nextAi = getNextFortuneWheelAi();
  const pendingTurns = getTotalFortuneWheelPendingTurns();
  const activeOption = wheel.currentSpinOptions?.[wheel.currentSpinIndex];
  const activeEvent = activeOption ? getWheelEvent(activeOption) : null;
  wbRenderWheelSegments(wheel.currentSpinOptions ?? []);

  if (els.wbWheelTitle) els.wbWheelTitle.textContent = "Roue de la Fortune";
  if (els.wbWheelMeta) {
    const unpredictability = getCurrentFortuneWheelUnpredictability();
    els.wbWheelMeta.textContent = wheel.active
      ? `An ${wheel.activeYear} - coût ${WHEEL_SPIN_COST} pièces par tour - imprévisibilité ${unpredictability}% - ${pendingTurns} tour${pendingTurns > 1 ? "s" : ""} en attente.`
      : `Prochaine apparition prévue : An ${wheel.nextYear} - imprévisibilité ${unpredictability}%.`;
  }
  if (els.wbWheelCenter) {
    els.wbWheelCenter.textContent = wheel.spinning ? "La roue tourne" : (nextAi ? nextAi.name : "Destin");
  }
  if (els.wbWheelCurrentOption) {
    els.wbWheelCurrentOption.textContent = wheel.spinning
      ? (activeEvent?.title ?? "La roue tourne...")
      : (nextAi ? `Prochain tour : ${nextAi.name}` : "Aucun tour en attente.");
  }

  if (els.wbWheelAiList) {
    els.wbWheelAiList.innerHTML = "";
    getFortuneWheelOrder().forEach((ai) => {
      const row = document.createElement("div");
      row.className = "wb-wheel-ai-row";
      const info = document.createElement("div");
      const name = document.createElement("strong");
      name.textContent = ai.name;
      const details = document.createElement("span");
      details.textContent = `${ai.coins} pièces - ${getFortuneWheelTurnsForAi(ai.id)} tour${getFortuneWheelTurnsForAi(ai.id) > 1 ? "s" : ""}`;
      info.append(name, details);

      const button = document.createElement("button");
      button.className = "wb-btn-ghost";
      button.type = "button";
      button.textContent = `Acheter -${WHEEL_SPIN_COST}`;
      button.disabled = !wheel.active || ai.coins < WHEEL_SPIN_COST || wheel.spinning;
      button.addEventListener("click", () => buyFortuneWheelTurn(ai.id));

      row.append(info, button);
      els.wbWheelAiList.appendChild(row);
    });
  }

  if (els.wbSpinWheelBtn) {
    els.wbSpinWheelBtn.disabled = !wheel.active || !nextAi || wheel.spinning;
    els.wbSpinWheelBtn.textContent = wheel.spinning
      ? "La roue tourne..."
      : (nextAi ? `Lancer ${nextAi.name}` : "Aucun tour");
  }
  if (els.wbAutoWheelBtn) {
    els.wbAutoWheelBtn.disabled = !wheel.active || !pendingTurns;
    els.wbAutoWheelBtn.textContent = wbWheelAutoMode ? "Automatique actif" : "Automatique";
    els.wbAutoWheelBtn.classList.toggle("wb-btn-auto-active", wbWheelAutoMode);
  }
  if (els.wbEndWheelBtn) {
    els.wbEndWheelBtn.disabled = !wheel.active || pendingTurns > 0 || wheel.spinning;
  }
  if (els.wbCopyWheelResultsBtn) {
    els.wbCopyWheelResultsBtn.disabled = !wheel.results.length;
  }
  if (els.wbCloseWheelBtn) {
    els.wbCloseWheelBtn.disabled = Boolean(wheel.spinning);
  }
  if (els.wbWheelResult) {
    const resultText = wheel.lastResultText ?? "";
    els.wbWheelResult.textContent = resultText;
    els.wbWheelResult.classList.toggle("wb-hidden", !resultText);
  }
}

function wbAnimateCardReveal() {
  const cardElement = document.querySelector(".auction-panel");
  if (!cardElement) return;
  cardElement.classList.remove("wb-card-reveal-anim");
  cardElement.classList.remove("wb-card-reveal");
  void cardElement.offsetWidth;
  cardElement.classList.add("wb-card-reveal-anim");
  cardElement.classList.add("wb-card-reveal");
}

function wbFlashBidAmount() {
  const bidEl = state.auction.selectedSlotId === "B" ? els.currentBidB : els.currentBidA;
  if (!bidEl) return;
  bidEl.classList.remove("wb-bid-update");
  void bidEl.offsetWidth;
  bidEl.classList.add("wb-bid-update");
  wbPlaySound("coin");
}

function wbGetPlayerElement(playerId) {
  if (!playerId) return null;
  return document.querySelector(`.ai-card[data-player-id="${CSS.escape(playerId)}"]`)
    ?? document.querySelector(`.ai-card[data-ai-id="${CSS.escape(playerId)}"]`)
    ?? document.querySelector(`[data-player="${CSS.escape(playerId)}"]`);
}

function wbMarkPlayerAsPassed(playerId) {
  const playerEl = wbGetPlayerElement(playerId);
  if (playerEl) playerEl.classList.add("wb-player-eliminated");
}

function wbHighlightActivePlayer(playerId) {
  document.querySelectorAll(".ai-card, .player-card, [data-player-id], [data-player]").forEach((el) => {
    el.classList.remove("wb-active-turn");
  });

  const activeEl = wbGetPlayerElement(playerId);
  if (activeEl) activeEl.classList.add("wb-active-turn");
}

function wbAddChronicleEntry(content) {
  const container = els.memoryPreview ?? document.querySelector("#chronicle-container") ?? document.querySelector(".chronicle");
  if (!container) return null;
  const entry = content instanceof HTMLElement ? content : document.createElement("div");

  if (!(content instanceof HTMLElement)) {
    entry.className = "wb-chronicle-new";
    entry.innerHTML = String(content ?? "");
  } else {
    entry.classList.add("wb-chronicle-new");
  }

  if (!entry.parentElement) container.appendChild(entry);
  window.setTimeout(() => {
    entry.scrollIntoView({ behavior: "smooth", block: "end" });
  }, 100);
  return entry;
}

function wbRenderWheelSegments(optionIds = []) {
  if (!els.wbFortuneWheel) return;
  els.wbFortuneWheel.querySelectorAll(".wb-wheel-label").forEach((node) => node.remove());

  const visibleOptionIds = optionIds.slice(0, WHEEL_VISIBLE_OPTIONS);
  const events = visibleOptionIds
    .map((id) => getWheelEvent(id))
    .filter(Boolean);
  const labels = events.length ? events.map(getWheelSegmentLabel) : WB_FALLBACK_WHEEL_LABELS.slice(0, WHEEL_VISIBLE_OPTIONS);
  const segmentCount = Math.max(1, labels.length);
  wbPaintWheelSegments(events.length ? events : segmentCount);

  labels.forEach((label, index) => {
    const event = events[index] ?? null;
    const segmentCenter = (index * 360) / segmentCount;
    const segment = document.createElement("div");
    segment.className = "wb-wheel-label";
    segment.classList.add(`wb-wheel-label-${getWheelEventTone(event)}`);
    segment.style.setProperty("--wb-label-angle", `${segmentCenter - 90}deg`);
    segment.title = event?.title ?? label;
    if (!state.fortuneWheel?.spinning && state.fortuneWheel?.lastResultText && index === state.fortuneWheel.currentSpinIndex) {
      segment.classList.add("wb-wheel-label-result");
    }

    const text = document.createElement("span");
    text.textContent = label;
    segment.appendChild(text);
    els.wbFortuneWheel.appendChild(segment);
  });
}

function wbPaintWheelSegments(segments) {
  if (!els.wbFortuneWheel) return;
  const events = Array.isArray(segments) ? segments : [];
  const segmentCount = Array.isArray(segments) ? segments.length : segments;
  const count = Math.max(1, segmentCount);
  const segmentDegrees = 360 / count;
  const stops = Array.from({ length: count }, (_, index) => {
    const start = roundCssDeg(index * segmentDegrees);
    const end = roundCssDeg((index + 1) * segmentDegrees);
    const colorStart = roundCssDeg(start + WB_WHEEL_SEGMENT_BORDER_DEG);
    const colorEnd = roundCssDeg(end - WB_WHEEL_SEGMENT_BORDER_DEG);
    return [
      `#020617 ${start}deg ${colorStart}deg`,
      `${getWheelSegmentColor(events[index], index)} ${colorStart}deg ${colorEnd}deg`,
      `#020617 ${colorEnd}deg ${end}deg`,
    ].join(", ");
  }).join(", ");
  els.wbFortuneWheel.style.background = [
    "radial-gradient(circle at center, rgba(12, 17, 23, 0.96) 0 18%, transparent 19%)",
    `conic-gradient(from ${roundCssDeg(-segmentDegrees / 2)}deg, ${stops})`,
  ].join(", ");
}

function getWheelEventTone(event) {
  const value = Number(event?.expectedValue) || 0;
  if (value > 0) return "positive";
  if (value < 0) return "negative";
  return "neutral";
}

function getWheelSegmentColor(event, index) {
  const tone = getWheelEventTone(event);
  const palette = WB_WHEEL_SEGMENT_COLORS[tone] ?? WB_WHEEL_SEGMENT_COLORS.neutral;
  return palette[index % palette.length];
}

function roundCssDeg(value) {
  return Math.round(value * 1000) / 1000;
}

function getWheelSegmentLabel(event) {
  if (!event) return "DESTIN";
  const moneyLabel = getWheelMoneyLabel(event);
  if (moneyLabel) return moneyLabel;

  const source = normalizeMemorySearch(`${event.id} ${event.title} ${event.effect} ${event.action?.instruction ?? ""}`);

  if (source.includes("madness")) return "MADNESS";
  if (source.includes("guerre")) return "GUERRE";
  if (source.includes("plague") || source.includes("peste") || source.includes("infection")) return "PESTE";
  if (source.includes("dragon")) return "DRAGON";
  if (source.includes("antimatter") || source.includes("antimatiere")) return "ANTI";
  if (source.includes("bomb") || source.includes("bombe")) return "BOMBE";
  if (source.includes("volcan")) return "VOLCAN";
  if (source.includes("mage")) return "MAGE";
  if (source.includes("foudre") || source.includes("lightning")) return "FOUDRE";
  if (source.includes("fire") || source.includes("feu") || source.includes("incendie")) return "FEU";
  if (source.includes("dust") || source.includes("poussiere")) return "DUST";
  if (source.includes("shield") || source.includes("bouclier")) return "BOUCLIER";
  if (source.includes("rain") || source.includes("pluie")) return "PLUIE";
  if (source.includes("divine") || source.includes("miracle") || source.includes("benediction") || source.includes("blessing")) return "MIRACLE";
  if (source.includes("fertil") || source.includes("reparation") || source.includes("reconstruction") || source.includes("antidote")) return "SOIN";
  if (source.includes("mine") || source.includes("resource") || source.includes("ressource") || source.includes("stone") || source.includes("ore") || source.includes("silver") || source.includes("gold") || source.includes("mythril") || source.includes("gems")) return "MINE";
  if (source.includes("steal") || source.includes("vol") || source.includes("braquage") || source.includes("ponction") || source.includes("tribut")) return "VOL";
  if (source.includes("sabotage")) return "SABOTAGE";
  if (source.includes("pass_max") || source.includes("bonus")) return "BONUS";
  if (source.includes("loss") || source.includes("perte") || source.includes("crise") || source.includes("half") || source.includes("percent") || source.includes("maudit") || source.includes("coffre perce") || source.includes("honte")) return "PERTE";
  if (source.includes("coin") || source.includes("fortune") || source.includes("tresor") || source.includes("jackpot") || source.includes("or") || source.includes("marche")) return "OR";
  if (source.includes("bandit")) return "BANDITS";
  if (source.includes("curse") || source.includes("malediction")) return "MALUS";
  return shorten(event.title, 8).toUpperCase();
}

function getWheelMoneyLabel(event) {
  const action = event?.action;
  if (!action) return null;

  if (action.type === "coins" && Number.isFinite(action.amount)) {
    return formatWheelSignedAmount(action.amount);
  }
  if (action.type === "multiplyCoins" && Number.isFinite(action.factor)) {
    return `x${formatWheelCompactNumber(action.factor)}`;
  }
  if (action.type === "divideCoins" && Number.isFinite(action.divisor)) {
    return `/${formatWheelCompactNumber(action.divisor)}`;
  }
  if (action.type === "percentLoss" && Number.isFinite(action.percent)) {
    return `-${formatWheelCompactNumber(action.percent)}%`;
  }
  if (action.type === "stealRichest" && Number.isFinite(action.amount)) {
    return `VOL ${formatWheelCompactNumber(action.amount)}`;
  }
  if (action.type === "stealRichestPercent" && Number.isFinite(action.percent)) {
    return `VOL ${formatWheelCompactNumber(action.percent)}%`;
  }
  if (action.type === "tribute" && Number.isFinite(action.amount)) {
    return `TRIB ${formatWheelCompactNumber(action.amount)}`;
  }
  if (action.type === "sabotageRichest" && Number.isFinite(action.amount)) {
    return `SAB -${formatWheelCompactNumber(action.amount)}`;
  }
  if (action.type === "swapPoorest") return "SWAP";
  if (action.type === "passBonus") return action.mode === "max" ? "PASSE+" : "PASSE-";
  if (action.type === "none") return "RIEN";
  return null;
}

function formatWheelSignedAmount(value) {
  const rounded = formatWheelCompactNumber(value);
  return value > 0 ? `+${rounded}` : rounded;
}

function formatWheelCompactNumber(value) {
  return Number.isInteger(value) ? String(value) : String(Math.round(value * 10) / 10);
}

function wbStartWheelVisualSpin(options, resultEvent) {
  if (!els.wbFortuneWheel) return;
  const wheel = els.wbFortuneWheel;
  const segmentCount = Math.max(1, options.length);
  const segmentDegrees = 360 / segmentCount;
  const resultIndex = Math.max(0, options.findIndex((event) => event.id === resultEvent.id));
  const targetCenter = resultIndex * segmentDegrees;
  const extraSpins = 360 * (WB_WHEEL_MIN_EXTRA_SPINS + Math.floor(Math.random() * WB_WHEEL_EXTRA_SPIN_VARIANCE));
  const normalizedBase = ((wbCurrentRotation % 360) + 360) % 360;
  const targetRotation = (90 - targetCenter + 360) % 360;
  wbCurrentRotation += extraSpins + ((targetRotation - normalizedBase + 360) % 360);

  wheel.style.transition = "none";
  wheel.style.transform = `rotate(${normalizedBase}deg)`;
  void wheel.offsetWidth;
  wheel.style.transition = `transform ${WB_WHEEL_SPIN_DURATION_MS}ms cubic-bezier(0.22, 0.52, 0.08, 1)`;
  wheel.style.transform = `rotate(${wbCurrentRotation}deg)`;
}

function wbUpdateWheelModalOption(event) {
  if (els.wbWheelCurrentOption && event) els.wbWheelCurrentOption.textContent = event.title;
  if (els.wbWheelCenter) els.wbWheelCenter.textContent = "La roue tourne";
}

function wbPulseWheelPointer() {
  const pointer = document.querySelector(".wb-wheel-pointer");
  if (!pointer) return;
  pointer.classList.remove("wb-wheel-pointer-tick");
  void pointer.offsetWidth;
  pointer.classList.add("wb-wheel-pointer-tick");
}

function wbGetAudioContext() {
  if (wbAudioCtx) return wbAudioCtx;
  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextConstructor) return null;
  wbAudioCtx = new AudioContextConstructor();
  return wbAudioCtx;
}

function wbPlaySound(type) {
  try {
    const audioContext = wbGetAudioContext();
    if (!audioContext) return;
    if (audioContext.state === "suspended") audioContext.resume();

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);

    const now = audioContext.currentTime;
    if (type === "tick") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === "ding") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1.25);
      osc.start(now);
      osc.stop(now + 1.25);
    } else if (type === "coin") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.setValueAtTime(1600, now + 0.08);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === "pass") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(330, now);
      osc.frequency.exponentialRampToValueAtTime(165, now + 0.2);
      gain.gain.setValueAtTime(0.11, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    }
  } catch {
    // Les effets sonores sont décoratifs : l'enchère continue si le navigateur les bloque.
  }
}

function renderAgeEvents() {
  const year = state.settings.year;
  const increment = getBidIncrement(year);
  els.incrementOutput.textContent = `${increment} pièce${increment > 1 ? "s" : ""}`;
  if (!els.eventReminders) return;
  els.eventReminders.innerHTML = "";

  getDueEvents(year).forEach((event) => {
    const pill = document.createElement("div");
    pill.className = "event-pill";
    pill.textContent = event;
    els.eventReminders.appendChild(pill);
  });

}

function renderCard() {
  const auction = state.auction;
  const era = getEraInfo(state.settings.year);
  const slotElements = {
    A: {
      panel: els.auctionCardA,
      name: els.cardNameA,
      meta: els.cardMetaA,
      effect: els.cardEffectA,
      bid: els.currentBidA,
      winner: els.currentWinnerA,
    },
    B: {
      panel: els.auctionCardB,
      name: els.cardNameB,
      meta: els.cardMetaB,
      effect: els.cardEffectB,
      bid: els.currentBidB,
      winner: els.currentWinnerB,
    },
  };

  getAuctionSlots().forEach((slot) => {
    const elements = slotElements[slot.id];
    if (!elements) return;
    const card = slot.card;
    const renderedCardKey = card ? `${state.settings.year}:${slot.id}:${formatCardName(card)}:${card.category}:${card.danger}:${normalizeCardLevel(card.level)}` : "";
    elements.name.textContent = card ? formatCardName(card) : "Aucune carte";
    elements.meta.textContent = card
      ? `${getCardCategoryLabel(card)} - ${formatCardRating(card)} - Level ${normalizeCardLevel(card.level)} - prix de départ 0`
      : `Lance une nouvelle enchère. Courbe actuelle : ${era.label}, intensité de tirage visée ${era.targetDanger}/20.`;
    elements.effect.textContent = card ? formatCardEffect(card) : `Carte ${slot.id} du prochain duopole.`;
    elements.bid.textContent = slot.currentBid;
    elements.winner.textContent = slot.winner ? getAiName(slot.winner) : "Personne";

    if (wbLastRenderedBidValues[slot.id] !== undefined && wbLastRenderedBidValues[slot.id] !== slot.currentBid) {
      elements.bid.classList.remove("wb-bid-update");
      void elements.bid.offsetWidth;
      elements.bid.classList.add("wb-bid-update");
      wbPlaySound("coin");
    }
    wbLastRenderedBidValues[slot.id] = slot.currentBid;

    if (renderedCardKey && renderedCardKey !== wbLastRenderedCardKeys[slot.id]) {
      elements.panel.classList.remove("wb-card-reveal");
      void elements.panel.offsetWidth;
      elements.panel.classList.add("wb-card-reveal");
      wbLastRenderedCardKeys[slot.id] = renderedCardKey;
    } else if (!renderedCardKey) {
      delete wbLastRenderedCardKeys[slot.id];
    }
  });

  const current = getCurrentBidder();
  els.currentTurn.textContent = current ? current.name : "-";
  const availableSlots = current ? getEligibleAuctionSlots(current) : [];
  if (!availableSlots.some((slot) => slot.id === auction.selectedSlotId)) {
    auction.selectedSlotId = availableSlots[0]?.id ?? "A";
  }
  if (els.bidTargetSelect) {
    els.bidTargetSelect.innerHTML = "";
    getAuctionSlots().forEach((slot) => {
      const option = document.createElement("option");
      option.value = slot.id;
      option.disabled = !availableSlots.some((available) => available.id === slot.id);
      option.textContent = `Carte ${slot.id} — ${slot.card ? formatCardName(slot.card) : "aucune"} — minimum ${getSlotMinimumBid(slot)}`;
      els.bidTargetSelect.appendChild(option);
    });
    els.bidTargetSelect.value = auction.selectedSlotId;
    els.bidTargetSelect.disabled = !auction.active || !current || !availableSlots.length;
  }
  getAuctionSlots().forEach((slot) => {
    const panel = slotElements[slot.id]?.panel;
    panel?.classList.toggle("selected", slot.id === auction.selectedSlotId);
    panel?.classList.toggle("blocked", Boolean(current && auction.blockedSlotByAi?.[current.id] === slot.id));
  });
  els.bidBtn.disabled = !auction.active || !current || !availableSlots.length;
  els.passBtn.disabled = !auction.active || !current;
  els.newAuctionBtn.textContent = canFinishAuctionCycle() ? "Fin du duopole" : "Nouvelle enchère";
  const selectedSlot = getAuctionSlot(auction.selectedSlotId);
  const minBid = selectedSlot ? getSlotMinimumBid(selectedSlot) : getBidIncrement(state.settings.year);
  els.bidInput.min = minBid;
  els.bidInput.step = 1;
  els.bidInput.value = minBid;
}

function renderAis() {
  els.aiGrid.innerHTML = "";
  const template = document.querySelector("#aiTemplate");
  const total = getWorldPopulation();
  const currentBidder = getCurrentBidder();
  const displayAis = getDisplayAis();

  displayAis.forEach((ai, index) => {
    const node = template.content.cloneNode(true);
    const card = node.querySelector(".ai-card");
    const aliveInput = node.querySelector(".alive-input");
    const aiHead = node.querySelector(".ai-head");
    const aiFields = node.querySelector(".ai-fields");
    const coinsInput = node.querySelector(".coins-input");
    const populationInput = node.querySelector(".population-input");
    const soldiersInput = node.querySelector(".soldiers-input");
    const coloniesInput = node.querySelector(".colonies-input");
    const homePopInput = node.querySelector(".home-pop-input");
    const soldiersField = node.querySelector(".soldiers-field");
    const coloniesField = node.querySelector(".colonies-field");
    const homePopField = node.querySelector(".home-pop-field");
    const activeProfileSelect = node.querySelector(".active-profile-select");
    const actionSlot = node.querySelector(".profile-action-slot");
    let biomeSlot = node.querySelector(".ai-biome-slot");
    if (!biomeSlot) {
      biomeSlot = document.createElement("div");
      biomeSlot.className = "ai-biome-slot";
      card.appendChild(biomeSlot);
    }
    const share = total ? Math.round((ai.population / total) * 1000) / 10 : 0;
    const canEditMoney = ai.alive || ai.ghostReady || ai.ghostActive;
    const isCurrentBidder = currentBidder?.id === ai.id;
    const isCurrentLeader = getAuctionLeaderIds().includes(ai.id) && !isCurrentBidder;
    const hasPassedAuction = state.auction.passed.includes(ai.id);

    card.dataset.aiId = ai.id;
    card.dataset.playerId = ai.id;
    card.dataset.player = ai.id;
    card.classList.toggle("dead", !ai.alive);
    card.classList.toggle("ghost-active", ai.ghostActive);
    card.classList.toggle("current-bidder", isCurrentBidder);
    card.classList.toggle("current-leader", isCurrentLeader);
    card.classList.toggle("passed-auction", hasPassedAuction);
    card.classList.toggle("wb-bid-active", isCurrentLeader);
    card.classList.toggle("wb-player-passed", hasPassedAuction);
    card.classList.toggle("wb-player-eliminated", hasPassedAuction);
    card.classList.toggle("wb-active-turn", isCurrentBidder);
    aliveInput.checked = ai.alive;
    coinsInput.disabled = !canEditMoney;
    populationInput.disabled = !ai.alive;
    soldiersInput.disabled = !ai.alive;
    coloniesInput.disabled = !ai.alive;
    homePopInput.disabled = !ai.alive;
    soldiersField.hidden = ai.activeProfile !== "merchant";
    coloniesField.hidden = ai.activeProfile !== "vagabond";
    homePopField.hidden = ai.activeProfile !== "vagabond";
    const orderBadge = document.createElement("span");
    orderBadge.className = "order-badge";
    orderBadge.textContent = String(index + 1);
    aiHead.prepend(orderBadge);
    node.querySelector(".ai-name").textContent = ai.name;
    node.querySelector(".share-pill").textContent = `${share}%`;
    const passBadge = document.createElement("span");
    passBadge.className = "pass-bonus-badge";
    passBadge.title = `Bonus de passe actuel : ${getAiPassBonusLevel(ai)} pièce(s). Il baisse quand l'IA passe et remonte de 1 quand elle enchérit.`;
    passBadge.textContent = `Passe +${getAiPassBonusLevel(ai)}`;
    node.querySelector(".share-pill").after(passBadge);
    coinsInput.value = ai.coins;
    populationInput.value = ai.population;
    soldiersInput.value = ai.soldiers;
    coloniesInput.value = ai.colonies;
    homePopInput.value = ai.homePopulation;
    activeProfileSelect.innerHTML = "";
    const none = document.createElement("option");
    none.value = "";
    none.textContent = "Aucune doctrine active";
    activeProfileSelect.appendChild(none);
    const profileOptions = [...ai.profileHand];
    if (ai.activeProfile && !profileOptions.includes(ai.activeProfile)) profileOptions.push(ai.activeProfile);
    profileOptions.forEach((profileId) => {
      const profile = getProfile(profileId);
      if (!profile) return;
      const option = document.createElement("option");
      option.value = profile.id;
      option.textContent = profile.name;
      activeProfileSelect.appendChild(option);
    });
    activeProfileSelect.value = ai.activeProfile || "";
    renderProfileStats(ai, aiFields);
    renderProfileAction(ai, actionSlot);
    if (isCurrentBidder) {
      const copyTurnButton = document.createElement("button");
      copyTurnButton.className = "ai-turn-copy";
      copyTurnButton.type = "button";
      copyTurnButton.textContent = "Copier tour";
      copyTurnButton.addEventListener("click", () => copyState());
      actionSlot.appendChild(copyTurnButton);
    }
    biomeSlot.innerHTML = "";
    renderFoundingCivilizationChoices(ai, biomeSlot);
    renderBiomeChoices(ai, biomeSlot);

    aliveInput.addEventListener("change", () => {
      pushUndo();
      ai.alive = aliveInput.checked;
      if (!ai.alive) {
        if (ai.activeProfile === "martyr" && !ai.ghostUsed) {
          triggerMartyrGhost(ai);
        }
        removeFromAuction(ai.id);
      } else {
        ai.ghostReady = false;
        ai.ghostActive = false;
      }
      recordHistorySnapshot(ai.alive ? "Retour vivant" : "Mort / retrait");
      saveAndRender();
    });
    coinsInput.addEventListener("change", () => {
      pushUndo();
      ai.coins = Math.max(0, Math.floor(Number(coinsInput.value) || 0));
      saveAndRender();
    });
    populationInput.addEventListener("change", () => {
      pushUndo();
      ai.population = Math.max(0, Math.floor(Number(populationInput.value) || 0));
      saveAndRender();
    });
    soldiersInput.addEventListener("change", () => {
      pushUndo();
      ai.soldiers = Math.max(0, Math.floor(Number(soldiersInput.value) || 0));
      saveAndRender();
    });
    coloniesInput.addEventListener("change", () => {
      pushUndo();
      ai.colonies = Math.max(0, Math.floor(Number(coloniesInput.value) || 0));
      saveAndRender();
    });
    homePopInput.addEventListener("change", () => {
      pushUndo();
      ai.homePopulation = Math.max(0, Math.floor(Number(homePopInput.value) || 0));
      saveAndRender();
    });
    activeProfileSelect.addEventListener("change", () => {
      pushUndo();
      ai.activeProfile = activeProfileSelect.value;
      if (ai.activeProfile) ai.previousProfileOnDraw = "";
      recordLog(`${ai.name} active une doctrine politique secrète.`, "Doctrine");
      saveAndRender();
    });

    els.aiGrid.appendChild(node);
  });
  wbHighlightActivePlayer(currentBidder?.id ?? null);
  state.auction.passed.forEach((playerId) => wbMarkPlayerAsPassed(playerId));
}

function recordHistorySnapshot(reason = "Snapshot") {
  state.historySnapshots = normalizeHistorySnapshots(state.historySnapshots ?? []);
  const snapshot = {
    id: `history-${state.settings.year}`,
    year: state.settings.year,
    reason,
    entries: state.ais.map((ai) => ({
      id: ai.id,
      name: ai.name,
      population: ai.population,
      coins: ai.coins,
      alive: ai.alive,
    })),
  };
  const existingIndex = state.historySnapshots.findIndex((item) => item.year === snapshot.year);
  if (existingIndex >= 0) {
    state.historySnapshots[existingIndex] = snapshot;
  } else {
    state.historySnapshots.push(snapshot);
  }
  state.historySnapshots.sort((a, b) => a.year - b.year);
  state.historySnapshots = state.historySnapshots.slice(-80);
}

function getHistoryChartSnapshots() {
  const snapshots = normalizeHistorySnapshots(state.historySnapshots ?? []);
  const currentSnapshot = {
    id: `current-${state.settings.year}`,
    year: state.settings.year,
    reason: "État actuel",
    entries: state.ais.map((ai) => ({
      id: ai.id,
      name: ai.name,
      population: ai.population,
      coins: ai.coins,
      alive: ai.alive,
    })),
  };
  if (!snapshots.length) return [currentSnapshot];
  return snapshots.some((snapshot) => snapshot.year === currentSnapshot.year)
    ? snapshots
    : [...snapshots, currentSnapshot].sort((a, b) => a.year - b.year);
}

function renderHistoryCharts() {
  renderHistoryChartControls();
  drawHistoryChart(els.populationChartCanvas, "population");
  drawHistoryChart(els.economyChartCanvas, "economy");
  if (activeHistoryChartType && els.chartOverlay && !els.chartOverlay.hidden) {
    drawHistoryChart(els.chartOverlayCanvas, activeHistoryChartType, { full: true });
  }
}

function renderHistoryChartControls() {
  renderHistoryChartToggleList("population", els.populationChartPointToggles);
  renderHistoryChartToggleList("economy", els.economyChartPointToggles);
  if (els.copyChartsTextBtn) {
    els.copyChartsTextBtn.disabled = !getHistoryChartSnapshots().length;
  }
}

function renderHistoryChartToggleList(type, container) {
  if (!container) return;
  const selectedIds = new Set(getChartPointLabelIds(type));
  const series = getHistoryChartAiSeries(type);
  container.innerHTML = "";

  if (!series.length) {
    const empty = document.createElement("span");
    empty.className = "muted";
    empty.textContent = "Aucune courbe enregistrée.";
    container.appendChild(empty);
    return;
  }

  series.forEach(({ ai }) => {
    const label = document.createElement("label");
    label.className = "history-chart-toggle";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = selectedIds.has(ai.id);
    input.addEventListener("change", () => {
      setChartPointLabelEnabled(type, ai.id, input.checked);
    });
    const text = document.createElement("span");
    text.textContent = shorten(ai.name, 22);
    label.append(input, text);
    container.appendChild(label);
  });
}

function getHistoryChartAiSeries(type) {
  const snapshots = getHistoryChartSnapshots();
  const metric = type === "population" ? "populationShare" : "coins";
  return state.ais.map((ai, index) => ({
    ai,
    color: HISTORY_CHART_COLORS[index % HISTORY_CHART_COLORS.length],
    points: getHistorySeriesPoints(snapshots, ai.id, metric),
  })).filter((item) => item.points.length);
}

function getChartPointLabelIds(type) {
  const key = type === "population" ? "population" : "economy";
  const labels = normalizeChartPointLabels(state.chartPointLabels);
  state.chartPointLabels = labels;
  return labels[key];
}

function setChartPointLabelEnabled(type, aiId, enabled) {
  const key = type === "population" ? "population" : "economy";
  const labels = normalizeChartPointLabels(state.chartPointLabels);
  const ids = new Set(labels[key]);
  if (enabled) ids.add(aiId);
  else ids.delete(aiId);
  labels[key] = [...ids];
  state.chartPointLabels = labels;
  persistState();
  renderHistoryCharts();
}

function openHistoryChart(type) {
  if (!["population", "economy"].includes(type)) return;
  activeHistoryChartType = type;
  if (els.chartOverlayTitle) els.chartOverlayTitle.textContent = type === "population" ? "Évolution démographique" : "Évolution économique";
  if (els.chartOverlay) els.chartOverlay.hidden = false;
  drawHistoryChart(els.chartOverlayCanvas, type, { full: true });
}

function closeHistoryChart() {
  activeHistoryChartType = null;
  if (els.chartOverlay) els.chartOverlay.hidden = true;
}

function drawHistoryChart(canvas, type, options = {}) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const cssWidth = Math.max(260, Math.floor(rect.width || canvas.width));
  const cssHeight = Math.max(120, Math.floor(rect.height || canvas.height));
  canvas.width = Math.floor(cssWidth * dpr);
  canvas.height = Math.floor(cssHeight * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const snapshots = getHistoryChartSnapshots();
  const metric = type === "population" ? "populationShare" : "coins";
  const selectedPointLabelIds = new Set(getChartPointLabelIds(type));
  const series = state.ais.map((ai, index) => ({
    ai,
    color: HISTORY_CHART_COLORS[index % HISTORY_CHART_COLORS.length],
    points: getHistorySeriesPoints(snapshots, ai.id, metric),
  })).filter((item) => item.points.length);
  const values = series.flatMap((item) => item.points.map((point) => point.value));
  const thresholdSeries = type === "population" ? getHistoryThresholdSeries(snapshots) : [];
  const thresholdValues = thresholdSeries.map((point) => point.value);
  const maxValue = Math.max(type === "population" ? 100 : 1, ...thresholdValues, ...values);
  const minYear = Math.min(...snapshots.map((snapshot) => snapshot.year));
  const maxYear = Math.max(...snapshots.map((snapshot) => snapshot.year));
  const pad = options.full ? 54 : 26;
  const width = cssWidth;
  const height = cssHeight;
  const chartWidth = Math.max(1, width - pad * 1.5);
  const chartHeight = Math.max(1, height - pad * 1.7);
  const xForYear = (year) => maxYear === minYear ? pad + chartWidth / 2 : pad + ((year - minYear) / (maxYear - minYear)) * chartWidth;
  const yForValue = (value) => pad + chartHeight - (value / maxValue) * chartHeight;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#0b1220";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "rgba(148, 163, 184, 0.22)";
  ctx.lineWidth = 1;
  const yTickCount = options.full ? 6 : 5;
  for (let i = 0; i <= yTickCount; i += 1) {
    const y = pad + (chartHeight / yTickCount) * i;
    ctx.beginPath();
    ctx.moveTo(pad, y);
    ctx.lineTo(pad + chartWidth, y);
    ctx.stroke();
    const value = maxValue - (maxValue / yTickCount) * i;
    ctx.fillStyle = "#64748b";
    ctx.font = `${options.full ? 11 : 9}px Inter, sans-serif`;
    ctx.textAlign = "right";
    ctx.fillText(formatHistoryChartValue(value, type), pad - 6, y + 3);
  }

  const xTicks = getHistoryYearTicks(
    minYear,
    maxYear,
    options.full ? 24 : 10,
    snapshots.map((snapshot) => snapshot.year),
  );
  xTicks.forEach((year) => {
    const x = xForYear(year);
    ctx.strokeStyle = "rgba(148, 163, 184, 0.12)";
    ctx.beginPath();
    ctx.moveTo(x, pad);
    ctx.lineTo(x, pad + chartHeight);
    ctx.stroke();
  });

  if (type === "population" && thresholdSeries.length) {
    const thresholdPixels = thresholdSeries.map((point) => ({
      ...point,
      x: xForYear(point.year),
      y: yForValue(point.value),
    }));
    ctx.save();
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = options.full ? 2.4 : 1.8;
    ctx.setLineDash([8, 5]);
    ctx.beginPath();
    thresholdPixels.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();
    ctx.setLineDash([]);
    thresholdPixels.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, options.full ? 3 : 2, 0, Math.PI * 2);
      ctx.fillStyle = "#ef4444";
      ctx.fill();
    });
    ctx.font = `900 ${options.full ? 12 : 9}px Inter, sans-serif`;
    ctx.textAlign = "center";
    const labelPoint = thresholdPixels[thresholdPixels.length - 1];
    thresholdPixels.forEach((point, index) => {
      const isLastPoint = point === labelPoint;
      const offset = isLastPoint ? -20 : index % 2 === 0 ? -10 : 16;
      const x = Math.min(width - 24, Math.max(24, point.x + (isLastPoint ? 18 : 0)));
      const y = Math.min(height - 8, Math.max(pad + 10, point.y + offset));
      ctx.fillText(`${formatPercent(point.value)}%`, x, y);
    });
    ctx.fillStyle = "#ef4444";
    ctx.font = `900 ${options.full ? 13 : 10}px Inter, sans-serif`;
    ctx.textAlign = "right";
    ctx.fillText("Seuil faible", Math.max(78, labelPoint.x - 10), Math.max(pad + 12, labelPoint.y - 6));
    ctx.restore();
  }

  const hitSeries = [];
  const placedPointLabels = [];
  series.forEach(({ ai, color, points }) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = options.full ? 2.2 : 1.4;
    ctx.beginPath();
    const pixelPoints = [];
    points.forEach((point, pointIndex) => {
      const x = xForYear(point.year);
      const y = yForValue(point.value);
      pixelPoints.push({ ...point, x, y });
      if (pointIndex === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    pixelPoints.forEach((point) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(point.x, point.y, options.full ? 3 : 2, 0, Math.PI * 2);
      ctx.fill();
    });
    if (selectedPointLabelIds.has(ai.id)) {
      drawHistoryChartPointValueLabels(ctx, pixelPoints, type, color, {
        full: Boolean(options.full),
        width,
        height,
        placedLabels: placedPointLabels,
      });
    }
    hitSeries.push({ aiId: ai.id, name: ai.name, color, points: pixelPoints });
  });
  historyChartHitMaps.set(canvas, hitSeries);

  const placedChartLabels = [];
  hitSeries.forEach((item, index) => {
    drawHistoryChartLineLabel(ctx, item, index, {
      full: Boolean(options.full),
      width,
      height,
      placedLabels: placedChartLabels,
    });
  });
  drawHistoryChartDeathMarkers(ctx, hitSeries, { full: Boolean(options.full) });

  ctx.fillStyle = "#94a3b8";
  ctx.font = `${options.full ? 13 : 10}px Inter, sans-serif`;
  ctx.textAlign = "left";
  ctx.fillText(type === "population" ? "Population mondiale (%)" : "Pièces", pad, pad - 10);
  drawHistoryYearLabels(ctx, xTicks, xForYear, {
    full: Boolean(options.full),
    height,
    width,
  });

  if (options.hover) {
    drawHistoryChartTooltip(ctx, options.hover, width, height, options.full);
  }
}

function getHistorySeriesPoints(snapshots, aiId, metric) {
  const points = [];
  for (const snapshot of snapshots) {
    const entry = snapshot.entries.find((item) => item.id === aiId);
    if (!entry) continue;
    const aliveEntries = snapshot.entries.filter((item) => item.alive !== false);
    const snapshotWorldPopulation = aliveEntries.reduce((sum, item) => sum + Math.max(0, Number(item.population) || 0), 0);
    const value = metric === "populationShare"
      ? snapshotWorldPopulation ? ((Number(entry.population) || 0) / snapshotWorldPopulation) * 100 : 0
      : entry[metric] ?? 0;
    points.push({
      year: snapshot.year,
      value,
      alive: entry.alive !== false,
    });
    if (entry.alive === false) break;
  }
  return points;
}

function getHistoryThresholdSeries(snapshots) {
  return snapshots.map((snapshot) => {
    const aliveCount = snapshot.entries.filter((entry) => entry.alive !== false).length || state.ais.length || 1;
    return {
      year: snapshot.year,
      value: 100 / aliveCount,
    };
  });
}

function getHistoryYearTicks(minYear, maxYear, maxTicks, requiredYears = []) {
  if (minYear === maxYear) return [minYear];
  const required = [...new Set(requiredYears.map((year) => Math.round(Number(year) || 0)).filter((year) => year >= minYear && year <= maxYear))].sort((a, b) => a - b);
  const ticks = new Set([minYear, maxYear, ...required]);
  const range = maxYear - minYear;
  const step = range <= 1200 ? 50 : Math.max(50, Math.ceil((range / maxTicks) / 50) * 50);
  const first = Math.ceil(minYear / step) * step;
  for (let year = first; year <= maxYear; year += step) {
    ticks.add(year);
  }
  return [...ticks].sort((a, b) => a - b);
}

function formatHistoryChartValue(value, type) {
  if (type === "population") return `${formatPercent(value)}%`;
  return String(Math.round(value));
}

function buildChartsTextSupport() {
  const snapshots = getHistoryChartSnapshots();
  const populationSeries = getHistoryChartAiSeries("population");
  const economySeries = getHistoryChartAiSeries("economy");
  const thresholdSeries = getHistoryThresholdSeries(snapshots);
  const lines = [
    `SUPPORT ÉCRIT — GRAPHIQUES — An ${state.settings.year}`,
    "",
    "GRAPHIQUE 1 — POPULATION MONDIALE (%)",
    "Chaque valeur indique la part de population mondiale vivante à l'année donnée.",
    ...populationSeries.map((item) => formatHistorySeriesForText(item, "population")),
    `Seuil faible : ${thresholdSeries.map((point) => `An ${point.year} : ${formatPercent(point.value)}%`).join(" | ")}`,
    "",
    "GRAPHIQUE 2 — ÉCONOMIE (PIÈCES)",
    "Chaque valeur indique les pièces enregistrées au bilan de revenus.",
    ...economySeries.map((item) => formatHistorySeriesForText(item, "economy")),
  ];
  return lines.join("\n");
}

function formatHistorySeriesForText(item, type) {
  const lastPoint = item.points[item.points.length - 1];
  const deadSuffix = lastPoint?.alive === false ? ` — courbe arrêtée à l'an ${lastPoint.year} (IA morte/retirée)` : "";
  const values = item.points.map((point) => `An ${point.year} : ${formatHistoryChartValue(point.value, type)}${type === "economy" ? " pièces" : ""}`);
  return `- ${item.ai.name}${deadSuffix} : ${values.join(" | ")}`;
}

function drawHistoryYearLabels(ctx, xTicks, xForYear, options = {}) {
  ctx.save();
  ctx.fillStyle = "#94a3b8";
  ctx.font = `${options.full ? 12 : 9}px Inter, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  let lastX = -Infinity;
  xTicks.forEach((year, index) => {
    const x = xForYear(year);
    const clampedX = Math.min((options.width ?? x) - 22, Math.max(22, x));
    const crowded = x - lastX < (options.full ? 44 : 38);
    const y = (options.height ?? 0) - (crowded || index % 2 ? 20 : 8);
    ctx.fillText(`An ${year}`, clampedX, y);
    lastX = x;
  });
  ctx.restore();
}

function handleHistoryChartPointerMove(event) {
  const canvas = event.currentTarget;
  const type = getHistoryChartTypeForCanvas(canvas);
  if (!type) return;
  const hover = findNearestHistoryChartLine(canvas, event);
  historyChartHover = hover ? { canvas, type, ...hover } : null;
  canvas.title = hover ? formatHistoryChartValue(hover.value, type) : "";
  drawHistoryChart(canvas, type, { full: canvas === els.chartOverlayCanvas, hover: hover ? { ...hover, type } : null });
}

function handleHistoryChartPointerLeave(event) {
  const canvas = event.currentTarget;
  const type = getHistoryChartTypeForCanvas(canvas);
  historyChartHover = null;
  canvas.title = "";
  if (type) drawHistoryChart(canvas, type, { full: canvas === els.chartOverlayCanvas });
}

function getHistoryChartTypeForCanvas(canvas) {
  if (canvas === els.populationChartCanvas) return "population";
  if (canvas === els.economyChartCanvas) return "economy";
  if (canvas === els.chartOverlayCanvas) return activeHistoryChartType;
  return null;
}

function findNearestHistoryChartLine(canvas, event) {
  const series = historyChartHitMaps.get(canvas) ?? [];
  if (!series.length) return null;
  const rect = canvas.getBoundingClientRect();
  const mouse = { x: event.clientX - rect.left, y: event.clientY - rect.top };
  let best = null;
  series.forEach((item) => {
    item.points.forEach((point, index) => {
      const pointDistance = Math.hypot(mouse.x - point.x, mouse.y - point.y);
      if (!best || pointDistance < best.distance) best = { ...item, ...point, distance: pointDistance };
      const next = item.points[index + 1];
      if (!next) return;
      const projected = getProjectedPointOnSegment(mouse, point, next);
      if (!best || projected.distance < best.distance) {
        best = {
          ...item,
          x: projected.x,
          y: projected.y,
          year: point.year + (next.year - point.year) * projected.t,
          value: point.value + (next.value - point.value) * projected.t,
          alive: point.alive && next.alive,
          distance: projected.distance,
        };
      }
    });
  });
  const threshold = canvas === els.chartOverlayCanvas ? 20 : 14;
  return best && best.distance <= threshold ? best : null;
}

function getPointToSegmentDistance(point, start, end) {
  return getProjectedPointOnSegment(point, start, end).distance;
}

function getProjectedPointOnSegment(point, start, end) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  if (!dx && !dy) {
    return {
      x: start.x,
      y: start.y,
      t: 0,
      distance: Math.hypot(point.x - start.x, point.y - start.y),
    };
  }
  const t = Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / (dx * dx + dy * dy)));
  const x = start.x + t * dx;
  const y = start.y + t * dy;
  return {
    x,
    y,
    t,
    distance: Math.hypot(point.x - x, point.y - y),
  };
}

function drawHistoryChartPointValueLabels(ctx, points, type, color, options = {}) {
  const full = Boolean(options.full);
  const fontSize = full ? 11 : 8;
  const paddingX = full ? 6 : 4;
  const paddingY = full ? 3 : 2;
  const placedLabels = options.placedLabels ?? [];

  ctx.save();
  ctx.font = `900 ${fontSize}px Inter, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  points.forEach((point, index) => {
    const label = formatHistoryChartValue(point.value, type);
    const textWidth = ctx.measureText(label).width;
    const boxWidth = textWidth + paddingX * 2;
    const boxHeight = fontSize + paddingY * 2;
    const direction = index % 2 === 0 ? -1 : 1;
    const position = findNonOverlappingChartLabelPosition({
      targetX: point.x,
      targetY: point.y + direction * (full ? 14 : 10),
      boxWidth,
      boxHeight,
      width: options.width ?? point.x + boxWidth,
      height: options.height ?? point.y + boxHeight,
      edgePadding: full ? 10 : 5,
      placedLabels,
    });
    if (!position) return;
    placedLabels.push(position.rect);

    ctx.fillStyle = "rgba(2, 6, 23, 0.82)";
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(position.x - boxWidth / 2, position.y - boxHeight / 2, boxWidth, boxHeight, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#f8fafc";
    ctx.fillText(label, position.x, position.y);
  });

  ctx.restore();
}

function drawHistoryChartLineLabel(ctx, item, index, options = {}) {
  const points = item.points ?? [];
  if (!points.length) return;
  const full = Boolean(options.full);
  const label = shorten(item.name, full ? 28 : 12);
  const fontSize = full ? 12 : 8;
  const paddingX = full ? 7 : 5;
  const paddingY = full ? 4 : 3;
  const edgePadding = full ? 12 : 6;
  const stagger = ((index % 5) - 2) * (full ? 5 : 3);

  let anchor = points[0];
  if (points.length > 1) {
    const point = points[points.length - 2];
    const next = points[points.length - 1];
    anchor = {
      x: point.x + (next.x - point.x) * 0.62,
      y: point.y + (next.y - point.y) * 0.62,
    };
  }

  ctx.save();
  ctx.font = `800 ${fontSize}px Inter, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const textWidth = ctx.measureText(label).width;
  const boxWidth = textWidth + paddingX * 2;
  const boxHeight = fontSize + paddingY * 2;
  const placedLabels = options.placedLabels ?? [];
  const position = findNonOverlappingChartLabelPosition({
    targetX: anchor.x,
    targetY: anchor.y + stagger,
    boxWidth,
    boxHeight,
    width: options.width ?? anchor.x + boxWidth,
    height: options.height ?? anchor.y + boxHeight,
    edgePadding,
    placedLabels,
  });
  if (!position) {
    ctx.restore();
    return;
  }
  placedLabels.push(position.rect);

  ctx.translate(position.x, position.y);
  ctx.fillStyle = "rgba(2, 6, 23, 0.78)";
  ctx.strokeStyle = item.color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight, 5);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#f8fafc";
  ctx.fillText(label, 0, 0);
  ctx.restore();
}

function drawHistoryChartDeathMarkers(ctx, hitSeries, options = {}) {
  const full = Boolean(options.full);
  const radius = full ? 12 : 9;
  const fontSize = full ? 16 : 12;

  hitSeries.forEach((item) => {
    const lastPoint = item.points?.[item.points.length - 1];
    if (!lastPoint || lastPoint.alive !== false) return;

    ctx.save();
    ctx.beginPath();
    ctx.arc(lastPoint.x, lastPoint.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(127, 29, 29, 0.94)";
    ctx.strokeStyle = "#f8fafc";
    ctx.lineWidth = full ? 2.2 : 1.8;
    ctx.fill();
    ctx.stroke();
    ctx.font = `900 ${fontSize}px Inter, "Apple Color Emoji", "Segoe UI Symbol", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("☠", lastPoint.x, lastPoint.y + (full ? 0.5 : 0));
    ctx.restore();
  });
}

function findNonOverlappingChartLabelPosition({ targetX, targetY, boxWidth, boxHeight, width, height, edgePadding, placedLabels }) {
  const clampX = (value) => Math.min(width - edgePadding - boxWidth / 2, Math.max(edgePadding + boxWidth / 2, value));
  const clampY = (value) => Math.min(height - edgePadding - boxHeight / 2, Math.max(edgePadding + boxHeight / 2, value));
  const slotX = boxWidth + 8;
  const slotY = boxHeight + 5;
  let best = null;

  for (let ring = 0; ring <= 10; ring += 1) {
    for (let dx = -ring; dx <= ring; dx += 1) {
      for (let dy = -ring; dy <= ring; dy += 1) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== ring) continue;
        const x = clampX(targetX + dx * slotX);
        const y = clampY(targetY + dy * slotY);
        const rect = getChartLabelRect(x, y, boxWidth, boxHeight);
        if (placedLabels.some((placed) => chartLabelRectsOverlap(rect, placed))) continue;
        const score = Math.hypot(x - targetX, y - targetY);
        if (!best || score < best.score) best = { x, y, rect, score };
      }
    }
    if (best) return best;
  }

  for (let y = edgePadding + boxHeight / 2; y <= height - edgePadding - boxHeight / 2; y += slotY) {
    for (let x = edgePadding + boxWidth / 2; x <= width - edgePadding - boxWidth / 2; x += slotX) {
      const rect = getChartLabelRect(x, y, boxWidth, boxHeight);
      if (!placedLabels.some((placed) => chartLabelRectsOverlap(rect, placed))) return { x, y, rect };
    }
  }

  return null;
}

function getChartLabelRect(x, y, width, height) {
  return {
    left: x - width / 2,
    right: x + width / 2,
    top: y - height / 2,
    bottom: y + height / 2,
  };
}

function chartLabelRectsOverlap(a, b) {
  const gap = 3;
  return a.left < b.right + gap
    && a.right > b.left - gap
    && a.top < b.bottom + gap
    && a.bottom > b.top - gap;
}

function drawHistoryChartTooltip(ctx, hover, width, height, full) {
  const label = formatHistoryChartValue(hover.value, hover.type);
  ctx.save();
  ctx.font = `${full ? 16 : 12}px Inter, sans-serif`;
  const textWidth = ctx.measureText(label).width;
  const boxWidth = textWidth + 18;
  const boxHeight = full ? 32 : 26;
  const x = Math.min(width - boxWidth - 8, Math.max(8, hover.x + 12));
  const y = Math.min(height - boxHeight - 8, Math.max(8, hover.y - boxHeight - 10));
  ctx.fillStyle = "rgba(2, 6, 23, 0.92)";
  ctx.strokeStyle = hover.color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(x, y, boxWidth, boxHeight, 7);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#f8fafc";
  ctx.fillText(label, x + 9, y + (full ? 21 : 17));
  ctx.restore();
}

function getDisplayAis() {
  if (state.auction.order.length) {
    const ordered = state.auction.order.map(getAi).filter(Boolean);
    const remaining = state.ais.filter((ai) => !state.auction.order.includes(ai.id));
    return [...ordered, ...remaining];
  }
  return [...state.ais].sort((a, b) => Number(b.alive) - Number(a.alive) || b.population - a.population || a.name.localeCompare(b.name));
}

function removeLegacyBiomePanel() {
  document.querySelectorAll(".biome-panel").forEach((panel) => panel.remove());
}

function renderProfileStats(ai, aiFields) {
  if (ai.activeProfile !== "warlord" || !ai.alive) return;
  const wrapper = document.createElement("label");
  wrapper.className = "war-field";
  wrapper.textContent = "Civs en guerre";
  const input = document.createElement("input");
  input.type = "number";
  input.min = "0";
  input.max = String(state.ais.length);
  input.step = "1";
  input.value = state.settings.warCivs ?? 0;
  input.addEventListener("change", () => {
    pushUndo();
    state.settings.warCivs = Math.max(0, Math.min(state.ais.length, Math.floor(Number(input.value) || 0)));
    saveAndRender();
  });
  wrapper.appendChild(input);
  aiFields.appendChild(wrapper);
}

function renderProfileAction(ai, actionSlot) {
  actionSlot.innerHTML = "";

  if (ai.activeProfile === "paranoid" && ai.alive) {
    const button = document.createElement("button");
    button.className = "secondary";
    button.type = "button";
    button.textContent = "Crise sécuritaire +8";
    button.addEventListener("click", () => {
      pushUndo();
      applyManualHostileAgainst(ai);
      saveAndRender();
    });
    actionSlot.appendChild(button);
  }

  if (ai.ghostReady && !ai.ghostUsed) {
    const button = document.createElement("button");
    button.className = "secondary";
    button.type = "button";
    button.textContent = "Activer l'exil";
    button.addEventListener("click", () => {
      pushUndo();
      activateMartyrReturn(ai);
      saveAndRender();
    });
    actionSlot.appendChild(button);
  }

  if (ai.ghostActive) {
    const label = document.createElement("span");
    label.className = "profile-pill";
    label.textContent = "Exil actif";
    actionSlot.appendChild(label);
  }

  if (isRevealYear(state.settings.year) && ai.alive) {
    renderRevealActions(ai, actionSlot);
  }

}

function renderFoundingCivilizationChoices(ai, container) {
  if (state.settings.year !== 0 || !ai.alive) return;
  const options = getFoundingCivilizationDrawForAi(ai);
  if (!options.length) return;
  const choice = getFoundingCivilization(ai.foundingCivilization);
  const wrapper = document.createElement("div");
  wrapper.className = "biome-choice-box civilization-choice-box";
  wrapper.classList.toggle("biome-choice-box-locked", Boolean(choice));

  const title = document.createElement("div");
  title.className = "biome-choice-title";
  title.textContent = choice ? "Civilisation choisie" : "Civilisation de départ";
  wrapper.appendChild(title);

  (choice ? [choice] : options).forEach((civilization) => {
    const label = document.createElement("label");
    label.className = "biome-choice-option civilization-choice-option";
    const input = document.createElement("input");
    input.type = "radio";
    input.name = `civilization-${ai.id}`;
    input.checked = choice?.id === civilization.id;
    input.disabled = Boolean(choice);
    input.addEventListener("change", () => {
      if (!input.checked) return;
      pushUndo();
      chooseFoundingCivilization(ai, civilization.id);
      saveAndRender();
    });
    const text = document.createElement("span");
    text.innerHTML = `<strong>${civilization.name}</strong><small>${civilization.description}</small>`;
    label.append(input, text);
    wrapper.appendChild(label);
  });

  if (choice) {
    const note = document.createElement("p");
    note.className = "biome-choice-note";
    note.textContent = "Choix enregistré dans la mémoire de la simulation.";
    wrapper.appendChild(note);
  }
  container.appendChild(wrapper);
}

function renderBiomeChoices(ai, biomeSlot) {
  if (!isBiomeYear(state.settings.year) || !ai.alive) return;

  const options = getBiomeDrawForAi(ai);
  if (!options.length) return;

  const choice = getBiomeChoiceForAi(ai);
  const wrapper = document.createElement("div");
  wrapper.className = "biome-choice-box";
  wrapper.classList.toggle("biome-choice-box-locked", Boolean(choice));

  const title = document.createElement("div");
  title.className = "biome-choice-title";
  title.textContent = choice ? "Biome choisi" : "Choix de biome";
  wrapper.appendChild(title);

  const visibleOptions = choice ? [choice] : options;
  visibleOptions.forEach((biome) => {
    const label = document.createElement("label");
    label.className = "biome-choice-option";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = choice === biome;
    input.disabled = Boolean(choice);
    input.addEventListener("change", () => {
      if (!input.checked) return;
      pushUndo();
      chooseBiomeForAi(ai, biome);
      saveAndRender();
    });
    const text = document.createElement("span");
    text.textContent = formatBiomeNameWithDanger(biome);
    label.append(input, text);
    wrapper.appendChild(label);
  });

  if (choice) {
    const note = document.createElement("p");
    note.className = "biome-choice-note";
    note.textContent = "L'autre option retourne dans le pool.";
    wrapper.appendChild(note);
  }

  biomeSlot.appendChild(wrapper);
}

function renderRevealActions(ai, actionSlot) {
  const year = state.settings.year;
  const costs = getRevealCosts(year);

  if (ai.hideEconomyRevealYear !== year) {
    const economyButton = document.createElement("button");
    economyButton.className = "secondary";
    economyButton.type = "button";
    economyButton.textContent = `Cacher éco -${costs.economy}`;
    economyButton.disabled = ai.coins < costs.economy;
    economyButton.addEventListener("click", () => {
      pushUndo();
      payRevealHide(ai, "economy");
      saveAndRender();
    });
    actionSlot.appendChild(economyButton);
  }

  if (ai.hidePopulationRevealYear !== year) {
    const populationButton = document.createElement("button");
    populationButton.className = "secondary";
    populationButton.type = "button";
    populationButton.textContent = `Cacher pop -${costs.population}`;
    populationButton.disabled = ai.coins < costs.population;
    populationButton.addEventListener("click", () => {
      pushUndo();
      payRevealHide(ai, "population");
      saveAndRender();
    });
    actionSlot.appendChild(populationButton);
  }
}

function renderTurnOrder() {
  els.turnOrder.innerHTML = "";
  state.auction.order.forEach((id) => {
    const ai = state.ais.find((item) => item.id === id);
    if (!ai) return;
    const chip = document.createElement("span");
    chip.className = "turn-chip";
    chip.classList.toggle("current", getCurrentBidder()?.id === id);
    chip.classList.toggle("passed", state.auction.passed.includes(id));
    chip.textContent = ai.name;
    els.turnOrder.appendChild(chip);
  });
}

function renderLog() {
  const slotA = getAuctionSlot("A");
  const slotB = getAuctionSlot("B");
  if (els.winnerActionInputA && document.activeElement !== els.winnerActionInputA) {
    els.winnerActionInputA.value = slotA?.winnerAction ?? "";
  }
  if (els.winnerActionInputB && document.activeElement !== els.winnerActionInputB) {
    els.winnerActionInputB.value = slotB?.winnerAction ?? "";
  }
  els.auctionLog.value = buildAuctionReportPrompt();
}

function renderMemoryPanel() {
  const memory = state.simulationMemory ?? [];
  const query = normalizeMemorySearch(els.memorySearchInput?.value ?? "");
  const visibleMemory = query
    ? memory.filter((entry) => getMemorySearchText(entry).includes(query))
    : memory;
  const importantCount = memory.filter((entry) => entry.important).length;
  els.memoryCount.textContent = `${memory.length} entrée${memory.length > 1 ? "s" : ""}${importantCount ? ` - ${importantCount} clé${importantCount > 1 ? "s" : ""}` : ""}`;
  els.memoryPreview.innerHTML = "";

  if (!visibleMemory.length) {
    const empty = document.createElement("p");
    empty.className = "prompt-empty";
    empty.textContent = memory.length ? "Aucune entrée ne correspond à la recherche." : "Aucune mémoire archivée pour l'instant.";
    els.memoryPreview.appendChild(empty);
    return;
  }

  let newChronicleItem = null;
  visibleMemory.slice(-12).reverse().forEach((entry) => {
    const item = document.createElement("div");
    const isNewChronicleEntry = !wbSeenChronicleEntryIds.has(entry.id);
    item.className = "memory-entry";
    if (isNewChronicleEntry) {
      item.classList.add("wb-chronicle-new");
      wbSeenChronicleEntryIds.add(entry.id);
      newChronicleItem = newChronicleItem ?? item;
    }
    item.classList.toggle("memory-entry-important", entry.important);
    const title = document.createElement("strong");
    title.textContent = `${entry.important ? "★ " : ""}An ${entry.year} - ${formatMemoryType(entry.type)}`;
    const text = document.createElement("span");
    text.textContent = shorten(entry.text, 260);
    const actions = document.createElement("div");
    actions.className = "memory-entry-actions";
    const copyButton = document.createElement("button");
    copyButton.className = "secondary";
    copyButton.type = "button";
    copyButton.textContent = "Copier";
    copyButton.addEventListener("click", () => copyText(formatMemoryEntryForPrompt(entry, 0), "Entrée copiée"));
    const importantButton = document.createElement("button");
    importantButton.className = "secondary";
    importantButton.type = "button";
    importantButton.textContent = entry.important ? "Déclasser" : "Clé";
    importantButton.addEventListener("click", () => toggleMemoryImportant(entry.id));
    const deleteButton = document.createElement("button");
    deleteButton.className = "secondary danger-lite";
    deleteButton.type = "button";
    deleteButton.textContent = "Suppr.";
    deleteButton.addEventListener("click", () => deleteMemoryEntry(entry.id));
    actions.append(copyButton, importantButton, deleteButton);
    item.append(title, text, actions);
    els.memoryPreview.appendChild(item);
  });
  if (newChronicleItem) wbAddChronicleEntry(newChronicleItem);
}

function renderProfilesGuide() {
  els.profilesGuideList.innerHTML = "";

  state.ais.forEach((ai) => {
    const profile = getProfile(ai.activeProfile);
    const item = document.createElement("article");
    item.className = "profile-guide-item";

    const title = document.createElement("h3");
    title.textContent = `${ai.name} - ${profile ? profile.name : "Aucune doctrine active"}`;
    item.appendChild(title);

    if (!profile) {
      const empty = document.createElement("p");
      empty.textContent = "Choisir une doctrine dans la fiche IA après le tirage manuel.";
      item.appendChild(empty);
      els.profilesGuideList.appendChild(item);
      return;
    }

    const line = document.createElement("p");
    line.textContent = profile.mental;
    item.appendChild(line);

    const stats = document.createElement("ul");
    [profile.bonus, profile.malus, ...getProfileManualTasks(profile.id)].forEach((entry) => {
      const li = document.createElement("li");
      li.textContent = entry;
      stats.appendChild(li);
    });
    item.appendChild(stats);
    els.profilesGuideList.appendChild(item);
  });
}

function getProfileManualTasks(profileId) {
  const tasks = {
    warlord: ["Manuel : renseigner Civs en guerre dans la fiche IA avant les revenus."],
    merchant: ["Manuel : renseigner Soldats si l'armée existe, le malus dépend des tranches de 1000."],
    paranoid: ["Manuel : cliquer Crise sécuritaire +8 si une carte hostile le vise."],
    martyr: ["Manuel : quand l'IA meurt, décocher Vivante pour préparer l'exil, puis Activer l'exil sur l'enchère choisie."],
    vagabond: ["Manuel : renseigner Colonies ext. et Population du territoire natal avant les revenus."],
  };
  return tasks[profileId] ?? ["Manuel : aucun champ spécial, les effets sont calculés automatiquement si l'événement est détecté."];
}

function renderReportBlock() {
  els.reportPromptBlock.hidden = !state.auction.endProcessed;
  const copied = hasCopiedPrompt(getReportPromptKey());
  els.copyReportBtn.classList.toggle("prompt-button-copied", copied);
  const label = els.copyReportBtn.querySelector("span");
  if (label) label.textContent = `${copied ? "✓ " : ""}Message mondial après enchère`;
}

function getParticipantDrawSlots() {
  return state.ais.length;
}

function getDoubleDrawChampion(id) {
  return DOUBLE_DRAW_CHAMPIONS.find((champion) => champion.id === id)
    ?? DOUBLE_DRAW_RESERVES.find((champion) => champion.id === id)
    ?? null;
}

function getDoubleDrawPairLabel(pair) {
  return pair.memberIds
    .map((id) => getDoubleDrawChampion(id)?.shortName ?? getDoubleDrawChampion(id)?.name ?? id)
    .join(" & ");
}

function weightedParticipantPick(entries, randomFn = Math.random) {
  const totalWeight = entries.reduce((sum, entry) => sum + entry.weight, 0);
  let cursor = randomFn() * totalWeight;
  for (const entry of entries) {
    cursor -= entry.weight;
    if (cursor < 0) return entry;
  }
  return entries.at(-1) ?? null;
}

function sampleParticipantPairs(randomFn = Math.random) {
  const pairs = [...DOUBLE_DRAW_PAIRS];
  for (let index = pairs.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(randomFn() * (index + 1));
    [pairs[index], pairs[swapIndex]] = [pairs[swapIndex], pairs[index]];
  }
  return pairs.slice(0, 2);
}

function clearParticipantDrawPromptChecks() {
  state.copiedPromptKeys = (state.copiedPromptKeys ?? []).filter((key) => (
    !key.includes("annonce mondiale des participants selectionnes")
    && !key.includes("annonce mondiale de la carte, des participants et placements")
    && !key.includes("message pre-simulation : carte, participants et placements")
    && !key.includes("briefing initial")
  ));
}

function applyParticipantDrawSelection(selectedChampionIds) {
  resizeParticipants(selectedChampionIds.length);
  selectedChampionIds.forEach((championId, index) => {
    const champion = getDoubleDrawChampion(championId);
    if (!champion) return;
    state.ais[index].name = champion.name;
    state.ais[index].alive = true;
  });
  state.foundingCivilizationDraws = {};
  ensureFoundingCivilizationDraws();
}

function runDoubleParticipantDraw(randomFn = Math.random) {
  if (state.settings.year !== 0 || hasAuctionCards()) {
    showToast("Double Tirage disponible avant la première enchère");
    return;
  }
  if (!state.worldMap) {
    showToast("Tire ou applique d'abord la carte du monde");
    return;
  }

  pushUndo();
  const slots = getParticipantDrawSlots();
  const preDrawnPairs = sampleParticipantPairs(randomFn);
  const selectedIds = [];
  const selectedSet = new Set();
  const usedEntries = new Set();
  const drawSteps = [];
  const candidates = [
    ...DOUBLE_DRAW_CHAMPIONS.map((champion) => ({
      id: `champion:${champion.id}`,
      type: "champion",
      memberIds: [champion.id],
      label: champion.shortName,
      weight: champion.weight,
    })),
    ...preDrawnPairs.map((pair) => ({
      id: `pair:${pair.id}`,
      type: "pair",
      memberIds: pair.memberIds,
      label: getDoubleDrawPairLabel(pair),
      weight: pair.memberIds.reduce((sum, id) => sum + (getDoubleDrawChampion(id)?.weight ?? 0), 0),
    })),
  ];

  const weightedSlots = Math.min(slots, DOUBLE_DRAW_CHAMPIONS.length);
  while (selectedIds.length < weightedSlots) {
    const remainingSlots = weightedSlots - selectedIds.length;
    const validEntries = candidates.filter((entry) => (
      !usedEntries.has(entry.id)
      && entry.memberIds.length <= remainingSlots
      && entry.memberIds.every((id) => !selectedSet.has(id))
    ));
    const selectedEntry = weightedParticipantPick(validEntries, randomFn);
    if (!selectedEntry) break;

    usedEntries.add(selectedEntry.id);
    selectedEntry.memberIds.forEach((id) => {
      selectedSet.add(id);
      selectedIds.push(id);
    });
    drawSteps.push({
      entryId: selectedEntry.id,
      type: selectedEntry.type,
      label: selectedEntry.label,
      weight: selectedEntry.weight,
      memberIds: [...selectedEntry.memberIds],
    });
  }

  DOUBLE_DRAW_CHAMPIONS.forEach((champion) => {
    if (selectedIds.length < weightedSlots && !selectedSet.has(champion.id)) {
      selectedSet.add(champion.id);
      selectedIds.push(champion.id);
      drawSteps.push({
        entryId: `champion:${champion.id}`,
        type: "fallback",
        label: champion.shortName,
        weight: champion.weight,
        memberIds: [champion.id],
      });
    }
  });
  shuffleWithRandom(DOUBLE_DRAW_RESERVES, randomFn).forEach((reserve) => {
    if (selectedIds.length < slots) selectedIds.push(reserve.id);
  });

  applyParticipantDrawSelection(selectedIds);
  state.participantDraw = {
    slots,
    preDrawnPairIds: preDrawnPairs.map((pair) => pair.id),
    drawSteps,
    selectedChampionIds: selectedIds,
    selectedNames: selectedIds.map((id) => getDoubleDrawChampion(id)?.name ?? id),
    completedAt: new Date().toISOString(),
  };
  assignCurrentWorldMapPlacements(randomFn);
  clearParticipantDrawPromptChecks();
  recordMemory("Double Tirage", buildParticipantDrawAnnouncement(), { important: true, year: 0 });
  expandedPromptGroups.add("Sélection des participants");
  saveAndRender();
  showToast(`${slots} participants sélectionnés`);
}

function buildParticipantDrawAnnouncement() {
  const draw = state.participantDraw;
  if (!draw) return "Le Double Tirage n'a pas encore été effectué.";
  const preDrawnPairs = draw.preDrawnPairIds
    .map((id) => DOUBLE_DRAW_PAIRS.find((pair) => pair.id === id))
    .filter(Boolean);
  const pairPoolLines = preDrawnPairs.map((pair) => {
    const weight = pair.memberIds.reduce((sum, id) => sum + (getDoubleDrawChampion(id)?.weight ?? 0), 0);
    return `- ${getDoubleDrawPairLabel(pair)} : poids final ${weight}`;
  });
  const championPoolLines = DOUBLE_DRAW_CHAMPIONS.map((champion) => (
    `- ${champion.shortName} : poids ${champion.weight}`
  ));
  const drawLines = draw.drawSteps.map((step, index) => (
    `${index + 1}. ${step.type === "pair"
      ? `PAIRE LIÉE sélectionnée ensemble : ${step.label}. Ses deux membres obtiennent simultanément deux places`
      : `CHAMPION INDIVIDUEL sélectionné séparément : ${step.label}`
    } (poids ${step.weight})`
  ));
  const pairStatusLines = preDrawnPairs.map((pair) => {
    const pairSelectedTogether = draw.drawSteps.some((step) => (
      step.type === "pair"
      && step.memberIds?.length === pair.memberIds.length
      && pair.memberIds.every((id) => step.memberIds.includes(id))
    ));
    const qualifiedMembers = pair.memberIds.filter((id) => draw.selectedChampionIds.includes(id));
    if (pairSelectedTogether) {
      return `- ${getDoubleDrawPairLabel(pair)} : PAIRE RETENUE. Les deux IA ont été tirées ensemble par l'entrée Paire.`;
    }
    if (qualifiedMembers.length === 2) {
      return `- ${getDoubleDrawPairLabel(pair)} : paire NON retenue. Les deux IA sont présentes, mais elles ont été qualifiées séparément ou par une autre entrée.`;
    }
    if (qualifiedMembers.length === 1) {
      return `- ${getDoubleDrawPairLabel(pair)} : paire NON retenue. Seule ${getDoubleDrawChampion(qualifiedMembers[0])?.shortName ?? qualifiedMembers[0]} a été qualifiée séparément.`;
    }
    return `- ${getDoubleDrawPairLabel(pair)} : paire NON retenue. Aucun de ses membres n'a été qualifié par cette paire.`;
  });
  const selectedReserveNames = draw.selectedChampionIds
    .filter((id) => DOUBLE_DRAW_RESERVES.some((reserve) => reserve.id === id))
    .map((id) => {
      const index = draw.selectedChampionIds.indexOf(id);
      return state.ais[index]?.name ?? getDoubleDrawChampion(id)?.name ?? id;
    });
  const reserveNote = selectedReserveNames.length
    ? `\nL'effectif dépasse les 13 champions pondérés. Les places supplémentaires ont été attribuées aléatoirement parmi les représentants de réserve : ${selectedReserveNames.join(", ")}.`
    : "";
  const map = getWorldMapDefinition();
  const mapCatalogLines = WORLD_MAPS.map((entry, index) => (
    `${index + 1}. ${entry.name} — ${entry.description} ${entry.rules}`
  ));
  const placementLines = state.worldMap?.placements?.map((placement) => (
    `- ${getAiName(placement.aiId)} : ${placement.position}. Voisin(s) terrestre(s) direct(s) : ${
      placement.neighborIds?.length ? placement.neighborIds.map(getAiName).join(", ") : "aucun"
    }.`
  )) ?? [];
  const neutralZones = state.worldMap?.neutralZones ?? [];

  return `MESSAGE MONDIAL — PRÉ-SIMULATION : CARTE, PARTICIPANTS ET PLACEMENTS — An 0 — Enchère 0

Ce message précède les briefings initiaux et fixe publiquement la configuration de la simulation.

Effectif ${state.participantCountMode === "random" ? "tiré aléatoirement entre 2 et 16" : "choisi par le MJ"} : ${draw.slots} IA.

Les sept cartes possibles étaient strictement équiprobables en cas de tirage aléatoire :
${mapCatalogLines.join("\n")}

Carte ${state.worldMap?.selectionMode === "random" ? "tirée aléatoirement parmi sept cartes équiprobables" : "choisie par le MJ"} : ${map?.name ?? "en attente"}.
${map ? `${map.description} ${map.rules}` : ""}

Pré-tirage : 2 paires distinctes ont été tirées uniformément parmi 17. Chaque paire avait une probabilité de 2/17, soit environ 11,76 %, d'entrer dans le pool final :
${pairPoolLines.join("\n")}

IMPORTANT : être pré-tirée ne qualifie pas automatiquement une paire. Les deux paires pré-tirées deviennent seulement deux entrées supplémentaires dans le pool des 13 champions individuels. Une paire n'est réellement qualifiée ensemble que si l'entrée PAIRE LIÉE est ensuite sélectionnée par le tirage pondéré. Si ses membres sortent comme champions individuels, ils ont été sélectionnés séparément.

Le poids d'une paire est égal à la somme des poids de ses deux membres. Le tirage final est pondéré, sans doublon : une paire liée sélectionnée occupe deux places.

Poids des champions individuels :
${championPoolLines.join("\n")}

Déroulé du tirage pondéré :
${drawLines.join("\n")}${reserveNote}

Statut final des deux paires pré-tirées :
${pairStatusLines.join("\n")}

Participants définitifs (${draw.slots} places) :
${state.ais.map((ai, index) => `${index + 1}. ${ai.name}`).join("\n")}

Placements aléatoires :
${placementLines.join("\n")}

Zones entièrement inoccupées devenant centrales, en biome Grass permanent et riches en ressources rares :
${neutralZones.length ? neutralZones.map((zone) => `- ${zone}`).join("\n") : "- Aucune."}

Chaque secteur natal reçoit uniquement le biome de sa civilisation. Les zones centrales ne copient jamais le biome d'un colonisateur et sont réapprovisionnées en ressources rares à chaque nouvelle enchère.

Seuls ces participants recevront un briefing privé et prendront part à la simulation. Les positions ne dépendent ni du poids, ni de l'ordre du tirage, ni du nom des IA.

Archive cette configuration dans ta mémoire. Aucune réponse n'est attendue à ce message.`;
}

function copyParticipantDrawAnnouncement() {
  copyText(buildParticipantDrawAnnouncement(), "Participants sélectionnés copiés");
}

function renderPromptHub() {
  els.promptHub.innerHTML = "";
  const promptAis = getAliveAis();

  if (state.postIncomePromptYear === state.settings.year) {
    addPromptGroup("États IA après revenus", promptAis.map((ai) => ({
      label: `État actuel après revenus - ${ai.name}`,
      hint: "PRIVÉ : à envoyer seulement à cette IA après Fin de l'enchère.",
      onClick: () => copyText(buildPostIncomeStatePrompt(ai), `État ${ai.name} copié`),
    })));
  }

  if (state.settings.year === 0 && !hasAuctionCards()) {
    const map = getWorldMapDefinition();
    addPromptGroup("Carte du monde", [
      {
        label: "Lancement aléatoire complet : effectif + carte",
        hint: "Tire indépendamment un effectif entre 2 et 16 et l'une des sept cartes équiprobables.",
        onClick: () => runFullyRandomInitialSetup(),
      },
      {
        label: map ? `Carte retenue : ${map.name} — retirer / réappliquer` : "Tirer / appliquer la carte du monde",
        checklistLabel: "Tirer / appliquer la carte du monde",
        hint: getWorldMapChoice() === "random"
          ? "Tirage strictement équiprobable parmi les sept cartes."
          : `Applique la carte choisie dans les paramètres : ${getWorldMapDefinition(getWorldMapChoice())?.name ?? "inconnue"}.`,
        onClick: () => runWorldMapDraw(),
      },
    ]);
  }

  if (state.settings.year === 0 && !hasAuctionCards() && state.worldMap) {
    const drawComplete = Boolean(state.participantDraw);
    addPromptGroup("Sélection des participants", [
      {
        label: drawComplete ? "Relancer le Double Tirage" : "Lancer le Double Tirage",
        checklistLabel: "Lancer le Double Tirage",
        hint: "Tire 2 paires, puis remplit automatiquement l'effectif choisi avec le tirage pondéré.",
        onClick: () => runDoubleParticipantDraw(),
      },
      ...(drawComplete ? [{
        label: "Message pré-simulation : carte, participants et placements",
        hint: "MESSAGE MONDIAL obligatoire avant tous les briefings privés.",
        onClick: () => copyParticipantDrawAnnouncement(),
      }] : []),
    ]);
  }

  if (state.settings.year === 0 && state.participantDraw && hasCopiedPrompt(getParticipantDrawAnnouncementKey())) {
    addPromptGroup("An 0 - Briefing complet avec règles", promptAis.map((ai) => ({
      label: `Briefing initial - ${ai.name}`,
      hint: "PRIVÉ : à envoyer une seule fois à cette IA.",
      onClick: () => copyText(buildPrompt(ai), `Briefing ${ai.name} copié`),
    })));
  }

  if (isProfileMilestone(state.settings.year)) {
    const doctrineAis = promptAis.filter((ai) => ai.profileHand.length);
    const hasOutgoingDoctrines = doctrineAis.some((ai) => Boolean(ai.previousProfileOnDraw));
    const revealPromptKey = getDoctrineRevealPromptKey();
    const outgoingDoctrinesRevealed = !hasOutgoingDoctrines || hasCopiedPrompt(revealPromptKey);
    addPromptGroup("Doctrines politiques", [
      {
        label: "Tirer 3 doctrines pour toutes les IA",
        hint: "À faire avant d'envoyer les choix secrets.",
        onClick: () => drawProfilesForAliveAis(),
      },
      ...(hasOutgoingDoctrines ? [{
        label: "Révélation mondiale des anciennes doctrines",
        hint: "MESSAGE MONDIAL obligatoire : révèle les doctrines sortantes avant les nouveaux choix privés.",
        onClick: () => copyDoctrineRevealPrompt(),
      }] : []),
      ...(outgoingDoctrinesRevealed ? doctrineAis.map((ai) => ({
        label: `Choix secret de doctrine - ${ai.name}`,
        hint: "PRIVÉ : à envoyer seulement à cette IA, puis sélectionner sa réponse.",
        onClick: () => copyText(buildProfileDrawText(ai), `Doctrine ${ai.name} copiée`),
      })) : []),
    ]);
  }

  if (isRevealYear(state.settings.year)) {
    addPromptGroup("Révélation géopolitique", [
      ...promptAis.map((ai) => ({
        label: `Avant révélation - palier + dissimulation - ${ai.name}`,
        hint: "PRIVÉ : à envoyer seulement à cette IA avant le bilan public.",
        onClick: () => copyIncrementPrompt(ai),
      })),
      {
        label: "Après choix cachés - bilan public des IA",
        hint: "MESSAGE MONDIAL : à envoyer quand les IA ont choisi quoi masquer.",
        onClick: () => copyAllAis(),
      },
    ]);
  }

  if (state.fortuneWheel?.active) {
    addPromptGroup("Roue de la Fortune", [
      {
        label: "Annonce d'arrivée de la roue",
        hint: "MESSAGE MONDIAL : explique coût, moyenne et résolution des tours.",
        onClick: () => copyFortuneWheelArrivalPrompt(),
      },
      {
        label: "Bilan de participation de la roue",
        hint: "MESSAGE MONDIAL : seuil atteint ou non, tours achetés et pièces avant/après.",
        onClick: () => copyText(buildFortuneWheelParticipationPrompt(), "Participation roue copiée"),
      },
      {
        label: "Résultats de la roue",
        hint: "MESSAGE MONDIAL : copie toutes les lignes de résultat déjà lancées.",
        onClick: () => copyFortuneWheelResultsPrompt(),
      },
    ]);
  }

  if (isTribunalYear(state.settings.year)) {
    addPromptGroup("Tribunal des Nations", [
      {
        label: "Ouverture du tribunal - ordre complet",
        hint: "MESSAGE MONDIAL : lance le tribunal sans chiffres de population.",
        onClick: () => copyTribunalPrompt(),
      },
      ...getAliveAis().map((ai) => ({
        label: `Accusation tribunal - ${ai.name}`,
        hint: "PRIVÉ : à envoyer à cette IA quand c'est à elle d'accuser.",
        onClick: () => copyText(buildTribunalAccusationPrompt(ai), `Tribunal ${ai.name} copié`),
      })),
    ]);
  }

  if (isBiomeYear(state.settings.year)) {
    addPromptGroup("Biomes", [
      {
        label: "Tirer 2 biomes pour chaque IA",
        hint: "Tire les biomes, puis copie les prompts de choix pour chaque IA.",
        onClick: () => drawBiomesForCurrentYear(),
      },
      ...getAliveAis().map((ai) => ({
        label: `Choix de biome - ${ai.name}`,
        hint: "PRIVÉ : à envoyer à cette IA pour choisir 1 biome parmi 2.",
        onClick: () => {
          ensureBiomeDrawsForCurrentYearWithUndo();
          copyText(buildBiomeChoicePrompt(ai), `Biome ${ai.name} copié`);
          saveAndRender();
        },
      })),
      {
        label: "Annonce globale des biomes choisis",
        hint: "MESSAGE MONDIAL : annonce seulement les biomes choisis.",
        onClick: () => copyBiomePrompt(),
      },
    ]);
  }
}

function addPromptGroup(title, prompts) {
  if (!prompts.length) return;
  const isExpanded = expandedPromptGroups.has(title);
  const group = document.createElement("section");
  group.className = "prompt-group";
  group.classList.toggle("is-collapsed", !isExpanded);

  const heading = document.createElement("button");
  heading.className = "prompt-group-toggle";
  heading.type = "button";
  heading.setAttribute("aria-expanded", String(isExpanded));

  const headingTitle = document.createElement("span");
  headingTitle.className = "prompt-group-title";
  headingTitle.textContent = title;

  const arrow = document.createElement("span");
  arrow.className = "prompt-group-arrow";
  arrow.setAttribute("aria-hidden", "true");

  heading.append(headingTitle, arrow);
  heading.addEventListener("click", () => {
    if (expandedPromptGroups.has(title)) {
      expandedPromptGroups.delete(title);
    } else {
      expandedPromptGroups.add(title);
    }
    renderPromptHub();
  });
  group.appendChild(heading);

  const content = document.createElement("div");
  content.className = "prompt-group-content";

  prompts.forEach((prompt, index) => {
    const promptKey = getPromptChecklistKey(title, prompt.checklistLabel ?? prompt.label);
    const tracksCopy = prompt.trackCopy !== false;
    const copied = tracksCopy && hasCopiedPrompt(promptKey);
    const row = document.createElement("div");
    row.className = "prompt-action-row";

    const button = document.createElement("button");
    button.className = prompt.primary ? "prompt-button primary-prompt" : "prompt-button secondary";
    button.classList.toggle("prompt-button-copied", copied);
    button.type = "button";
    if (copied) button.setAttribute("aria-label", `${prompt.label} déjà copié`);

    const label = document.createElement("span");
    label.textContent = `${index + 1}. ${copied ? "✓ " : ""}${prompt.label}`;
    button.appendChild(label);

    if (prompt.hint) {
      const hint = document.createElement("small");
      hint.textContent = prompt.hint;
      button.appendChild(hint);
    }

    button.addEventListener("click", () => {
      prompt.onClick?.();
      if (tracksCopy) markPromptCopied(promptKey);
    });
    row.appendChild(button);

    content.appendChild(row);
  });

  group.appendChild(content);
  els.promptHub.appendChild(group);
}

function getPromptChecklistKey(groupTitle, label) {
  return [
    "prompt",
    state.settings.year,
    getAuctionPromptNumber(),
    normalizeMemorySearch(groupTitle),
    normalizeMemorySearch(label),
  ].join("|");
}

function getReportPromptKey() {
  return getPromptChecklistKey("Compte rendu d'enchère", "Message mondial après enchère");
}

function getDoctrineRevealPromptKey() {
  return getPromptChecklistKey("Doctrines politiques", "Révélation mondiale des anciennes doctrines");
}

function getParticipantDrawAnnouncementKey() {
  return getPromptChecklistKey("Sélection des participants", "Message pré-simulation : carte, participants et placements");
}

function hasCopiedPrompt(key) {
  return Array.isArray(state.copiedPromptKeys) && state.copiedPromptKeys.includes(key);
}

function markPromptCopied(key) {
  if (!key) return;
  if (!Array.isArray(state.copiedPromptKeys)) state.copiedPromptKeys = [];
  if (!state.copiedPromptKeys.includes(key)) {
    state.copiedPromptKeys.push(key);
    state.copiedPromptKeys = state.copiedPromptKeys.slice(-600);
  }
  persistState();
  renderPromptHub();
  renderReportBlock();
}

function addManualMemory() {
  const text = els.memoryInput.value.trim();
  if (!text) {
    showToast("Mémoire vide");
    return;
  }
  pushUndo();
  const type = els.memoryTypeSelect.value || "Mémoire";
  const important = els.memoryImportantInput.checked || type === "Moment clé";
  recordMemory(type, text, { important });
  els.memoryInput.value = "";
  els.memoryImportantInput.checked = false;
  saveAndRender();
  showToast(`${type} archivé`);
}

function importMemoryFromInput() {
  const text = els.memoryInput.value.trim();
  if (!text) {
    showToast("Import vide");
    return;
  }
  const entries = parseMemoryImport(text);
  if (!entries.length) {
    showToast("Aucune entrée détectée");
    return;
  }
  pushUndo();
  state.simulationMemory = state.simulationMemory ?? [];
  state.simulationMemory.push(...entries);
  els.memoryInput.value = "";
  saveAndRender();
  showToast(`${entries.length} entrée${entries.length > 1 ? "s" : ""} importée${entries.length > 1 ? "s" : ""}`);
}

function parseMemoryImport(text) {
  const entries = [];
  const pattern = /(?:^|\n)(\d+)\.\s+An\s+(\d+)\s+-\s+([^\n]+)\n([\s\S]*?)(?=\n\d+\.\s+An\s+\d+\s+-|\s*$)/g;
  let match;
  while ((match = pattern.exec(text)) !== null) {
    const [, , year, type, body] = match;
    const cleanBody = body.trim();
    if (!cleanBody) continue;
    entries.push(createMemoryEntry(type.trim(), cleanBody, {
      year: Math.max(0, Math.floor(Number(year) || 0)),
      important: isImportantMemoryText(type, cleanBody),
    }));
  }

  if (entries.length) return entries;

  const narrativePattern = /(?:^|\n)An\s+(\d+)\s+(?:—|-)\s+([^\n]+)\n([\s\S]*?)(?=\nAn\s+\d+\s+(?:—|-)|\s*$)/g;
  while ((match = narrativePattern.exec(text)) !== null) {
    const [, year, title, body] = match;
    const cleanBody = body.trim();
    if (!cleanBody) continue;
    const type = inferMemoryType(`${title}\n${cleanBody}`) || "Info narrative";
    entries.push(createMemoryEntry(type, `${title.trim()}\n${cleanBody}`, {
      year: Math.max(0, Math.floor(Number(year) || 0)),
      important: isImportantMemoryText(type, `${title}\n${cleanBody}`),
    }));
  }

  if (entries.length) return entries;

  const type = inferMemoryType(text);
  return [createMemoryEntry(type, text, {
    year: Math.max(0, Math.floor(Number(state.settings.year) || 0)),
    important: isImportantMemoryText(type, text),
  })];
}

function recordLog(line, type = "Événement") {
  state.log.push(line);
  recordMemory(type, line);
}

function recordMemory(type, text, options = {}) {
  const cleanText = String(text ?? "").trim();
  if (!cleanText) return;
  state.simulationMemory = state.simulationMemory ?? [];
  state.simulationMemory.push(createMemoryEntry(type, cleanText, options));
}

function createMemoryEntry(type, text, options = {}) {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    year: Math.max(0, Math.floor(Number(options.year ?? state.settings.year) || 0)),
    type: type || "Mémoire",
    text: String(text ?? "").trim(),
    createdAt: new Date().toISOString(),
    important: Boolean(options.important),
  };
}

function recordMemoryLines(type, lines) {
  const cleanLines = lines.filter(Boolean).map((line) => String(line).trim()).filter(Boolean);
  if (!cleanLines.length) return;
  recordMemory(type, cleanLines.join("\n"));
}

function formatMemoryType(type) {
  const value = String(type ?? "").trim();
  return value || "Mémoire";
}

function shorten(text, maxLength) {
  const value = String(text ?? "").replace(/\s+/g, " ").trim();
  return value.length > maxLength ? `${value.slice(0, maxLength - 1)}...` : value;
}

function inferMemoryType(text) {
  const upper = text.toUpperCase();
  if (upper.includes("MESSAGE MONDIAL")) return "Message mondial";
  if (upper.includes("MJ MONDIAL")) return "MJ mondial";
  if (upper.includes("MJ :") || upper.includes("MJ PRIVÉ") || upper.includes("MJ PRIVE")) return "MJ privé";
  if (upper.includes("COMPTE RENDU D'ENCHÈRE") || upper.includes("COMPTE RENDU D'ENCHERE")) return "Compte rendu d'enchère";
  if (upper.includes("RÉVÉLATION") || upper.includes("REVELATION")) return "Révélation";
  if (upper.includes("BIOME")) return "Biome";
  if (upper.includes("DOCTRINE")) return "Doctrine";
  return els.memoryTypeSelect?.value || "Mémoire";
}

function isImportantMemoryText(type, text) {
  const value = `${type}\n${text}`.toLowerCase();
  return [
    "message mondial",
    "mj mondial",
    "moment clé",
    "compte rendu d'enchère",
    "état après revenus",
    "remporte",
    "déclare la guerre",
    "capitale",
    "tombe",
    "mort",
    "madness a frappé",
    "victoire",
    "fin du duel",
    "roue de la fortune",
  ].some((needle) => value.includes(needle));
}

function normalizeMemorySearch(text) {
  return String(text ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function getMemorySearchText(entry) {
  return normalizeMemorySearch(`an ${entry.year} ${entry.type} ${entry.text}`);
}

function toggleMemoryImportant(entryId) {
  const entry = (state.simulationMemory ?? []).find((item) => item.id === entryId);
  if (!entry) return;
  pushUndo();
  entry.important = !entry.important;
  saveAndRender();
}

function deleteMemoryEntry(entryId) {
  if (!confirm("Supprimer cette entrée de mémoire ?")) return;
  pushUndo();
  state.simulationMemory = (state.simulationMemory ?? []).filter((entry) => entry.id !== entryId);
  saveAndRender();
}

function dedupeSimulationMemory() {
  const memory = state.simulationMemory ?? [];
  const deduped = getDedupedMemoryEntries(memory);
  const removed = memory.length - deduped.length;
  if (!removed) {
    showToast("Aucun doublon");
    return;
  }
  pushUndo();
  state.simulationMemory = deduped;
  saveAndRender();
  showToast(`${removed} doublon${removed > 1 ? "s" : ""} supprimé${removed > 1 ? "s" : ""}`);
}

function getDedupedMemoryEntries(memory = state.simulationMemory ?? []) {
  const seen = new Set();
  return memory.filter((entry) => {
    const key = getMemoryDuplicateKey(entry);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getMemoryDuplicateKey(entry) {
  return `${entry.year}|${formatMemoryType(entry.type)}|${String(entry.text).replace(/\s+/g, " ").trim().toLowerCase()}`;
}

function archiveMemoryIfNew(type, text, options = {}) {
  const cleanText = String(text ?? "").trim();
  if (!cleanText) return false;
  const year = Math.max(0, Math.floor(Number(options.year ?? state.settings.year) || 0));
  const entry = createMemoryEntry(type, cleanText, {
    ...options,
    year,
    important: options.important ?? isImportantMemoryText(type, cleanText),
  });
  const exists = (state.simulationMemory ?? []).some((item) => getMemoryDuplicateKey(item) === getMemoryDuplicateKey(entry));
  if (exists) return false;
  pushUndo();
  state.simulationMemory = state.simulationMemory ?? [];
  state.simulationMemory.push(entry);
  persistState();
  renderMemoryPanel();
  return true;
}

function drawProfilesForAliveAis() {
  pushUndo();
  performProfileDraw();
  state.copiedPromptKeys = (state.copiedPromptKeys ?? []).filter((key) => key !== getDoctrineRevealPromptKey());
  if (isProfileMilestone(state.settings.year)) markProfileYear(state.settings.year);
  expandedPromptGroups.add("Doctrines politiques");
  recordLog(`Tirage secret des doctrines politiques à l'an ${state.settings.year} : 3 doctrines parmi ${PROFILE_DECK.length} par IA vivante.`, "Doctrine");
  showToast("Doctrines tirées");
  saveAndRender();
}

function performProfileDraw() {
  getAliveAis().forEach((ai) => {
    ai.previousProfileOnDraw = ai.activeProfile || "";
    ai.profileHand = sample(PROFILE_DECK, 3).map((profile) => profile.id);
    ai.activeProfile = "";
  });
}

function getProfile(profileId) {
  return PROFILE_DECK.find((profile) => profile.id === profileId);
}

function summarizeProfile(profile) {
  if (!profile) return "Aucune doctrine.";
  return `${profile.name} - Bonus : ${profile.bonus} Malus : ${profile.malus}`;
}

function buildProfileDrawText(ai) {
  const previousProfileId = ai.previousProfileOnDraw || ai.activeProfile;
  const replacingDoctrine = Boolean(previousProfileId);
  const previousDoctrine = getProfile(previousProfileId);
  const lines = [
    `PROMPT PRIVÉ — TIRAGE DE DOCTRINE — An ${state.settings.year} — Enchère ${getAuctionPromptNumber()}`,
    `Destinataire : ${ai.name}`,
    `À envoyer uniquement à ${ai.name}.`,
    "Les autres IA ne voient pas ces options. Ta doctrine choisie reste secrète sauf révélation MJ.",
    "",
    `Choisis une doctrine parmi les trois tirées dans un catalogue de ${PROFILE_DECK.length}. Les deux autres sont abandonnées et resteront inconnues.`,
    replacingDoctrine
      ? `REMPLACEMENT TOTAL : ta doctrine actuelle, ${previousDoctrine?.name ?? "ancienne doctrine"}, s'arrête définitivement dès que le MJ valide ton nouveau choix.`
      : "Tu ne peux avoir qu'une seule doctrine active à la fois.",
    "La nouvelle doctrine remplace entièrement l'ancienne : les lignes politiques, bonus et malus ne se cumulent jamais. Tu ne conserves ni la mentalité ni les effets d'une doctrine précédente.",
    "Dans le duopole, un effet déclenché « chaque fois qu'une carte » peut s'appliquer séparément aux cartes A et B.",
    "Lorsqu'un bonus ou malus dépend du Level, utilise le Level exact indiqué sur la carte.",
    "",
  ];
  if (!ai.profileHand.length) {
    lines.push("Aucun tirage disponible.");
  } else {
    ai.profileHand.forEach((profileId, index) => {
      const profile = getProfile(profileId);
      lines.push(`${index + 1}. ${profile.name}`);
      lines.push(`Ligne politique : ${profile.mental}`);
      lines.push(`Bonus : ${profile.bonus}`);
      lines.push(`Malus : ${profile.malus}`);
      lines.push("");
    });
  }
  lines.push("Réponds avec :");
  lines.push("Doctrine choisie : [numéro et nom]");
  lines.push("Justification politique : [courte, dans la voix de ta civilisation]");
  return lines.join("\n");
}

function buildDoctrineRevealPrompt() {
  const outgoing = getAliveAis()
    .map((ai) => ({ ai, profile: getProfile(ai.previousProfileOnDraw) }))
    .filter(({ profile }) => Boolean(profile));
  const lines = [
    `MESSAGE MONDIAL — RÉVÉLATION DES DOCTRINES SORTANTES — An ${state.settings.year} — Enchère ${getAuctionPromptNumber()}`,
    "Avant le nouveau choix secret, les doctrines qui viennent de gouverner les civilisations sont rendues publiques.",
    "Cette révélation explique les comportements, contraintes, gains et pertes politiques de la période écoulée.",
    "",
    "IMPORTANT : ces doctrines sont anciennes et sortantes. Elles cessent définitivement dès la validation des nouvelles doctrines.",
    "Leurs lignes politiques, bonus et malus ne se cumuleront pas avec les prochains choix.",
    "Les nouvelles doctrines resteront secrètes jusqu'au prochain événement de révélation des doctrines.",
    "",
    "Doctrines révélées :",
  ];
  if (!outgoing.length) {
    lines.push("- Aucune doctrine sortante à révéler.");
  } else {
    outgoing.forEach(({ ai, profile }) => {
      lines.push(`- ${ai.name} : ${profile.name}`);
      lines.push(`  Ligne politique passée : ${profile.mental}`);
      lines.push(`  Bonus passé : ${profile.bonus}`);
      lines.push(`  Malus passé : ${profile.malus}`);
    });
  }
  lines.push("");
  lines.push("Archive ces doctrines comme historique politique. Ne les utilise plus pour calculer les décisions ou effets futurs après l'annonce des nouveaux choix.");
  lines.push("Aucune réponse n'est attendue à ce message.");
  return lines.join("\n");
}

function copyDoctrineRevealPrompt() {
  const text = buildDoctrineRevealPrompt();
  archiveMemoryIfNew("Révélation des doctrines", text, { important: true });
  copyText(text, "Anciennes doctrines révélées");
}

function readSettings() {
  return {
    year: readNumberInput(els.yearInput, 0, 0),
    baseIncome: readNumberInput(els.incomeInput, 0, 0),
    underdogBonus: readNumberInput(els.underdogInput, 0, 0),
    passReward: readNumberInput(els.passRewardInput, 0, 0),
    passMin: state.settings?.passMin ?? 2,
    warCivs: Math.max(0, Math.min(state.ais.length, Math.floor(Number(state.settings?.warCivs) || 0))),
    worldMapChoice: normalizeWorldMapChoice(els.worldMapSelect.value),
    cardPreviewCount: [0, 5].includes(Number(els.previewCardsSelect.value)) ? Number(els.previewCardsSelect.value) : 0,
    forcedPowerName: els.forcedPowerSelect.value,
    forcedPowerLevel: [0, 1, 2, 3].includes(Number(els.forcedPowerLevelSelect.value)) ? Number(els.forcedPowerLevelSelect.value) : 0,
  };
}

function readNumberInput(input, fallback = 0, min = Number.NEGATIVE_INFINITY, max = Number.POSITIVE_INFINITY) {
  const parsed = Number(input?.value);
  const value = Number.isFinite(parsed) ? parsed : fallback;
  return Math.max(min, Math.min(max, Math.floor(value)));
}

function getBidIncrement(year) {
  if (year < 250) return 1;
  if (year < 500) return 5;
  if (year < 750) return 10;
  if (year < 1000) return 15;
  return 20;
}

function getPassFloor() {
  return Math.max(0, Math.floor(Number(state.settings?.passMin) || 2));
}

function getPassCeiling() {
  return Math.max(getPassFloor(), Math.floor(Number(state.settings?.passReward) || 0));
}

function getAiPassBonusLevel(ai) {
  return Math.min(getPassCeiling(), Math.max(getPassFloor(), Math.floor(Number(ai.passBonusLevel) || getPassCeiling())));
}

function calculateUnderdogBonus(share, threshold) {
  if (!threshold || share >= threshold) return 0;
  const deficit = Math.min(1, Math.max(0, (threshold - share) / threshold));
  const bonusMax = state.settings.baseIncome + state.settings.underdogBonus + getBidIncrement(state.settings.year);
  return Math.round(bonusMax * deficit);
}

function buildUnderdogRuleTable() {
  const increments = [1, 5, 10, 15, 20];
  const threshold = getUnderdogThreshold();
  const thresholdPercent = threshold * 100;
  const populationShares = [
    Math.max(0.1, thresholdPercent - Math.min(0.5, thresholdPercent * 0.05)),
    thresholdPercent * 0.8,
    thresholdPercent * 0.6,
    thresholdPercent * 0.4,
    thresholdPercent * 0.2,
  ];
  const header = `| Population IA | ${increments.map((increment) => `Incrément ${increment}`).join(" | ")} |`;
  const separator = `|---:|${increments.map(() => "---:").join("|")}|`;
  const rows = populationShares.map((percent) => {
    const share = percent / 100;
    const values = increments.map((increment) => {
      const deficit = Math.min(1, Math.max(0, (threshold - share) / threshold));
      const bonusMax = state.settings.baseIncome + state.settings.underdogBonus + increment;
      return `+${Math.round(bonusMax * deficit)}`;
    });
    return `| ${formatPercent(percent)}% | ${values.join(" | ")} |`;
  });
  return [header, separator, ...rows].join("\n");
}

function getPreviousBidIncrement(year) {
  return getBidIncrement(Math.max(0, year - 1));
}

function getAuctionPromptNumber() {
  if (!hasAuctionCards()) return Math.max(0, Math.floor(Number(state.settings.year) / 50));
  return Math.max(1, Math.floor(Number(state.settings.year) / 50) + 1);
}

function isRevealYear(year) {
  return year > 0 && year % 250 === 0;
}

function isTribunalYear(year) {
  return year > 0 && year % 300 === 0;
}

function isBiomeYear(year) {
  return year >= 0 && year % 350 === 0;
}

function getRevealCosts(year) {
  const nextIncrement = getBidIncrement(year);
  return {
    population: nextIncrement,
    economy: nextIncrement * 2,
    both: nextIncrement * 3,
  };
}

function getDueEvents(year) {
  if (year < 0) return [];
  const events = [];
  if (isTribunalYear(year)) events.push("Tribunal des Nations : rappel MJ, ouvrir le débat avant les autres événements.");
  if (isBiomeYear(year)) {
    events.push(year === 0
      ? "Choix de biome initial : tirer 2 biomes de départ par IA vivante."
      : "Choix de biome : tirer 2 biomes disponibles par IA vivante.");
  }
  if (isProfileMilestone(year)) {
    events.push(year === 0
      ? "Tirage initial des doctrines politiques secrètes : 3 doctrines par IA vivante."
      : "Tirage des doctrines politiques : 3 doctrines par IA vivante.");
  }
  if (isRevealYear(year)) events.push("Révélation géopolitique : palier d'enchère, choix de dissimulation, puis bilan public.");
  if (state.fortuneWheel?.nextYear === year && !state.fortuneWheel?.active) {
    events.push(`Roue de la Fortune : événement spécial, imprévisibilité ${getCurrentFortuneWheelUnpredictability()}%, achats de tours puis résolutions un par un.`);
  }
  return events;
}

function getUpcomingEventsText(windowYears = 50) {
  const startYear = Math.max(0, Math.floor(Number(state.settings.year) || 0));
  const upcoming = [];
  for (let year = startYear + 1; year <= startYear + windowYears; year += 1) {
    const events = getDueEvents(year);
    if (events.length) {
      upcoming.push(`An ${year} : ${events.join(" / ")}`);
    }
  }
  return upcoming.length ? upcoming.join(" ; ") : `aucun dans les ${windowYears} ans à venir`;
}

function getNextFortuneWheelYear(baseYear = state.settings.year) {
  const base = Math.max(0, Math.floor(Number(baseYear) || 0));
  const steps = (WHEEL_MAX_OFFSET - WHEEL_MIN_OFFSET) / WHEEL_STEP + 1;
  return base + WHEEL_MIN_OFFSET + Math.floor(Math.random() * steps) * WHEEL_STEP;
}

function clampFortuneWheelUnpredictability(value) {
  return Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
}

function getFortuneWheelUnpredictability(baseYear, nextYear) {
  const interval = Math.max(WHEEL_MIN_OFFSET, Math.min(WHEEL_MAX_OFFSET, Math.floor(Number(nextYear) || 0) - Math.floor(Number(baseYear) || 0)));
  const ratio = (interval - WHEEL_MIN_OFFSET) / (WHEEL_MAX_OFFSET - WHEEL_MIN_OFFSET);
  return clampFortuneWheelUnpredictability(ratio * 100);
}

function getCurrentFortuneWheelUnpredictability() {
  return clampFortuneWheelUnpredictability(state.fortuneWheel?.unpredictability ?? 0);
}

function getFortuneWheelReturnDelay(wheel = state.fortuneWheel) {
  if (!wheel) return WHEEL_MIN_OFFSET;
  const fromYear = Math.max(0, Math.floor(Number(wheel.scheduledFromYear) || 0));
  const toYear = Math.max(0, Math.floor(Number(wheel.active ? wheel.activeYear : wheel.nextYear) || 0));
  return Math.max(WHEEL_MIN_OFFSET, Math.min(WHEEL_MAX_OFFSET, toYear - fromYear));
}

function ensureFortuneWheelSchedule() {
  state.fortuneWheel = normalizeFortuneWheel(state.fortuneWheel, state.settings.year);
}

function activateFortuneWheelIfDue() {
  ensureFortuneWheelSchedule();
  const wheel = state.fortuneWheel;
  if (wheel.active || state.settings.year < wheel.nextYear) return false;
  wheel.active = true;
  wheel.activeYear = state.settings.year;
  wheel.pendingTurns = {};
  wheel.lastResolvedAiId = null;
  wheel.spinning = false;
  wheel.currentSpinOptions = [];
  wheel.currentSpinIndex = 0;
  wheel.lastResultText = "";
  wheel.results = [];
  recordMemory("Roue de la fortune", buildFortuneWheelArrivalPrompt(), { important: true });
  return true;
}

function getFortuneWheelAverageValue() {
  const total = WHEEL_EVENTS.reduce((sum, event) => sum + event.expectedValue, 0);
  return Math.round((total / WHEEL_EVENTS.length) * 10) / 10;
}

function getFortuneWheelMinimumTurns() {
  return Math.max(1, state.ais.length * 2 + 1);
}

function getWheelEvent(eventId) {
  return WHEEL_EVENTS.find((event) => event.id === eventId) ?? null;
}

function getFortuneWheelOrder() {
  return getAliveAis().sort((a, b) => b.population - a.population || a.name.localeCompare(b.name));
}

function getFortuneWheelTurnsForAi(aiId) {
  return Math.max(0, Math.floor(Number(state.fortuneWheel?.pendingTurns?.[aiId]) || 0));
}

function getTotalFortuneWheelPendingTurns() {
  return Object.values(state.fortuneWheel?.pendingTurns ?? {}).reduce((sum, value) => sum + Math.max(0, Math.floor(Number(value) || 0)), 0);
}

function getNextFortuneWheelAi() {
  const order = getFortuneWheelOrder();
  if (!order.length || !getTotalFortuneWheelPendingTurns()) return null;
  const lastIndex = order.findIndex((ai) => ai.id === state.fortuneWheel.lastResolvedAiId);
  for (let offset = 1; offset <= order.length; offset += 1) {
    const candidate = order[(lastIndex + offset + order.length) % order.length];
    if (getFortuneWheelTurnsForAi(candidate.id) > 0) return candidate;
  }
  return null;
}

function buyFortuneWheelTurn(aiId) {
  const ai = getAi(aiId);
  if (!ai || !state.fortuneWheel.active) return;
  if (ai.coins < WHEEL_SPIN_COST) {
    showToast(`${ai.name} n'a pas assez de pièces`);
    return;
  }
  pushUndo();
  state.fortuneWheel.purchaseLedger = state.fortuneWheel.purchaseLedger ?? {};
  const ledger = state.fortuneWheel.purchaseLedger[ai.id] ?? {
    aiName: ai.name,
    turns: 0,
    spent: 0,
    coinsBefore: ai.coins,
    coinsAfter: ai.coins,
  };
  ai.coins -= WHEEL_SPIN_COST;
  state.fortuneWheel.pendingTurns[ai.id] = getFortuneWheelTurnsForAi(ai.id) + 1;
  state.fortuneWheel.purchaseLedger[ai.id] = {
    ...ledger,
    aiName: ai.name,
    turns: ledger.turns + 1,
    spent: ledger.spent + WHEEL_SPIN_COST,
    coinsAfter: ai.coins,
  };
  recordMemory("Roue de la fortune", `${ai.name} achète 1 tour de Roue de la Fortune pour ${WHEEL_SPIN_COST} pièces.`, { important: true });
  saveAndRender();
}

function sampleWheelOptions() {
  const unpredictability = getCurrentFortuneWheelUnpredictability();
  const ceiling = getWheelVolatilityCeiling(unpredictability);
  const boundedPool = WHEEL_EVENTS.filter((event) => getWheelEventVolatility(event) <= ceiling);
  const pool = boundedPool.length >= WHEEL_VISIBLE_OPTIONS ? boundedPool : WHEEL_EVENTS;
  const positivePool = pool.filter((event) => Number(event.expectedValue) > 0);
  const negativePool = pool.filter((event) => Number(event.expectedValue) < 0);
  const neutralPool = pool.filter((event) => Number(event.expectedValue) === 0);
  const half = Math.floor(WHEEL_VISIBLE_OPTIONS / 2);
  const positives = drawWeightedWheelEvents(positivePool, half, unpredictability);
  const negatives = drawWeightedWheelEvents(negativePool, WHEEL_VISIBLE_OPTIONS - positives.length, unpredictability);
  const selectedIds = new Set([...positives, ...negatives].map((event) => event.id));
  const remainder = pool.filter((event) => !selectedIds.has(event.id));
  const filled = [...positives, ...negatives];

  if (filled.length < WHEEL_VISIBLE_OPTIONS) {
    filled.push(...drawWeightedWheelEvents([...remainder, ...neutralPool], WHEEL_VISIBLE_OPTIONS - filled.length, unpredictability));
  }

  return sample(filled, filled.length).slice(0, WHEEL_VISIBLE_OPTIONS);
}

function getWheelVolatilityCeiling(unpredictability) {
  const ratio = clampFortuneWheelUnpredictability(unpredictability) / 100;
  return Math.round(WHEEL_MIN_VOLATILITY_CEILING + (WHEEL_MAX_VOLATILITY_CEILING - WHEEL_MIN_VOLATILITY_CEILING) * ratio);
}

function getWheelEventVolatility(event) {
  return Math.min(WHEEL_MAX_VOLATILITY_CEILING, Math.abs(Number(event?.expectedValue) || 0));
}

function getWheelEventWeight(event, unpredictability) {
  const volatility = getWheelEventVolatility(event);
  const targetVolatility = 10 + clampFortuneWheelUnpredictability(unpredictability) * 0.85;
  const distance = Math.abs(volatility - targetVolatility);
  const dangerBalance = Number(event?.expectedValue) < 0 ? 1.12 : 1;
  return Math.max(1, WHEEL_MAX_VOLATILITY_CEILING - distance) * dangerBalance;
}

function drawWeightedWheelEvents(events, count, unpredictability) {
  const pool = [...events];
  const result = [];
  while (pool.length && result.length < count) {
    const total = pool.reduce((sum, event) => sum + getWheelEventWeight(event, unpredictability), 0);
    let roll = Math.random() * total;
    const selectedIndex = pool.findIndex((event) => {
      roll -= getWheelEventWeight(event, unpredictability);
      return roll <= 0;
    });
    const index = selectedIndex >= 0 ? selectedIndex : pool.length - 1;
    result.push(pool.splice(index, 1)[0]);
  }
  return result;
}

function drawWheelResultEvent(options, unpredictability) {
  return drawWeightedWheelEvents(options, 1, unpredictability)[0] ?? options[Math.floor(Math.random() * options.length)];
}

function launchFortuneWheelSpin() {
  const wheel = state.fortuneWheel;
  if (!wheel.active || wheel.spinning) return;
  const ai = getNextFortuneWheelAi();
  if (!ai) {
    showToast("Aucun tour en attente");
    return;
  }

  const options = sampleWheelOptions();
  const resultEvent = drawWheelResultEvent(options, getCurrentFortuneWheelUnpredictability());
  wheel.spinning = true;
  wheel.currentSpinOptions = options.map((event) => event.id);
  wheel.currentSpinIndex = 0;
  renderFortuneWheelPanel();
  wbRenderWheelModal();
  wbStartWheelVisualSpin(options, resultEvent);

  let ticks = 0;
  const startedAt = window.performance.now();
  const spinner = () => document.querySelector("#fortuneWheelSpinner");
  const tick = () => {
    if (!wheel.spinning) return;
    const elapsed = window.performance.now() - startedAt;
    if (elapsed >= WB_WHEEL_SPIN_DURATION_MS - 450) return;
    ticks += 1;
    wheel.currentSpinIndex = ticks % wheel.currentSpinOptions.length;
    const event = getWheelEvent(wheel.currentSpinOptions[wheel.currentSpinIndex]);
    const node = spinner();
    if (node && event) node.textContent = event.title;
    wbUpdateWheelModalOption(event);
    wbPlaySound("tick");
    wbPulseWheelPointer();
    const progress = Math.min(1, elapsed / WB_WHEEL_SPIN_DURATION_MS);
    window.setTimeout(tick, 70 + Math.round(360 * progress * progress));
  };
  window.setTimeout(tick, 140);
  window.setTimeout(() => {
    if (!wheel.spinning) return;
    const resultIndex = wheel.currentSpinOptions.findIndex((id) => id === resultEvent.id);
    wheel.currentSpinIndex = Math.max(0, resultIndex);
    wbUpdateWheelModalOption(resultEvent);
    resolveFortuneWheelSpin(ai.id, resultEvent.id);
  }, WB_WHEEL_SPIN_DURATION_MS);
}

function resolveFortuneWheelSpin(aiId, eventId) {
  const ai = getAi(aiId);
  const event = getWheelEvent(eventId);
  if (!ai || !event || !state.fortuneWheel.active) return;

  pushUndo();
  const turnNumber = (state.fortuneWheel.results ?? []).filter((result) => result.aiId === ai.id).length + 1;
  state.fortuneWheel.pendingTurns[ai.id] = Math.max(0, getFortuneWheelTurnsForAi(ai.id) - 1);
  state.fortuneWheel.lastResolvedAiId = ai.id;
  const applied = applyFortuneWheelEvent(ai, event);
  const suffix = [applied.autoText, applied.manualText].filter(Boolean).join(" ");
  const resultText = `${ai.name} effectue son ${formatTurnOrdinal(turnNumber)} tour : ${event.title} : ${event.effect}${suffix ? ` ${suffix}` : ""}`;
  state.fortuneWheel.spinning = false;
  state.fortuneWheel.currentSpinIndex = state.fortuneWheel.currentSpinOptions.findIndex((id) => id === event.id);
  state.fortuneWheel.lastResultText = resultText;
  state.fortuneWheel.results.push({
    aiId: ai.id,
    aiName: ai.name,
    eventId: event.id,
    text: resultText,
    createdAt: new Date().toISOString(),
  });
  recordMemory("Roue de la fortune", resultText, { important: true });
  wbPlaySound("ding");
  saveAndRender();
  wbRenderWheelModal();
  if (wbWheelAutoMode) {
    if (getTotalFortuneWheelPendingTurns() > 0) {
      wbScheduleAutoWheelSpin();
    } else {
      wbStopWheelAutoMode();
      wbRenderWheelModal();
    }
  }
}

function applyFortuneWheelEvent(ai, event) {
  const action = event.action ?? { type: "none" };
  const before = ai.coins;
  const otherAis = getAliveAis().filter((item) => item.id !== ai.id);
  const richestOther = () => otherAis.slice().sort((a, b) => b.coins - a.coins || b.population - a.population)[0] ?? null;
  const poorestOther = () => otherAis.slice().sort((a, b) => a.coins - b.coins || a.population - b.population)[0] ?? null;

  if (action.type === "coins") {
    ai.coins = Math.max(0, ai.coins + action.amount);
    return { autoText: `Automatique : ${ai.name} passe de ${before} à ${ai.coins} pièces.` };
  }
  if (action.type === "multiplyCoins") {
    ai.coins = Math.max(0, Math.floor(ai.coins * action.factor));
    return { autoText: `Automatique : ${ai.name} passe de ${before} à ${ai.coins} pièces.` };
  }
  if (action.type === "divideCoins") {
    ai.coins = Math.max(0, Math.floor(ai.coins / action.divisor));
    return { autoText: `Automatique : ${ai.name} passe de ${before} à ${ai.coins} pièces.` };
  }
  if (action.type === "percentLoss") {
    ai.coins = Math.max(0, Math.floor(ai.coins * (100 - action.percent) / 100));
    return { autoText: `Automatique : ${ai.name} passe de ${before} à ${ai.coins} pièces.` };
  }
  if (action.type === "passBonus") {
    const previous = getAiPassBonusLevel(ai);
    ai.passBonusLevel = action.mode === "max" ? getPassCeiling() : getPassFloor();
    return { autoText: `Automatique : bonus de passe ${previous} → ${ai.passBonusLevel}.` };
  }
  if (action.type === "stealRichest") {
    const target = richestOther();
    if (!target) return { autoText: "Automatique : aucun rival vivant à voler." };
    const transfer = Math.min(action.amount, target.coins);
    target.coins -= transfer;
    ai.coins += transfer;
    return { autoText: `Automatique : ${ai.name} vole ${transfer} pièces à ${target.name}.` };
  }
  if (action.type === "stealRichestPercent") {
    const target = richestOther();
    if (!target) return { autoText: "Automatique : aucun rival vivant à voler." };
    const transfer = Math.floor(target.coins * action.percent / 100);
    target.coins -= transfer;
    ai.coins += transfer;
    return { autoText: `Automatique : ${ai.name} vole ${transfer} pièces à ${target.name}.` };
  }
  if (action.type === "tribute") {
    let total = 0;
    otherAis.forEach((target) => {
      const transfer = Math.min(action.amount, target.coins);
      target.coins -= transfer;
      total += transfer;
    });
    ai.coins += total;
    return { autoText: `Automatique : ${ai.name} reçoit ${total} pièces de tribut.` };
  }
  if (action.type === "swapPoorest") {
    const target = poorestOther();
    if (!target) return { autoText: "Automatique : aucun rival vivant pour l'échange." };
    const targetBefore = target.coins;
    target.coins = ai.coins;
    ai.coins = targetBefore;
    return { autoText: `Automatique : ${ai.name} échange ses pièces avec ${target.name} (${before} ↔ ${targetBefore}).` };
  }
  if (action.type === "sabotageRichest") {
    const target = richestOther();
    if (!target) return { autoText: "Automatique : aucun rival vivant à saboter." };
    const lost = Math.min(action.amount, target.coins);
    target.coins -= lost;
    return { autoText: `Automatique : ${target.name} perd ${lost} pièces.` };
  }
  if (action.type === "manual") {
    return { manualText: `MJ manuel : ${action.instruction}` };
  }
  return { autoText: "Automatique : aucun changement à appliquer." };
}

function closeFortuneWheelEvent() {
  const wheel = state.fortuneWheel;
  if (!wheel.active || wheel.spinning) return;
  if (getTotalFortuneWheelPendingTurns() > 0) {
    showToast("Tours encore en attente");
    return;
  }
  pushUndo();
  const previousYear = wheel.activeYear ?? state.settings.year;
  state.fortuneWheel = createDefaultFortuneWheel(previousYear);
  recordMemory("Roue de la fortune", `La Roue de la Fortune de l'an ${previousYear} est close. Prochaine apparition prévue : An ${state.fortuneWheel.nextYear}. Imprévisibilité prévue : ${state.fortuneWheel.unpredictability}%.`, { important: true });
  saveAndRender();
  wbCloseWheel();
}

function formatTurnOrdinal(turnNumber) {
  return turnNumber === 1 ? "1er" : `${turnNumber}e`;
}

function handleAgeMilestones() {
  state.profileDrawYears = state.profileDrawYears ?? [];
  ensureFoundingCivilizationDraws();
}

function ensureFoundingCivilizationDraws() {
  if (state.settings?.year !== 0) return;
  state.foundingCivilizationDraws = normalizeFoundingCivilizationDraws(state.foundingCivilizationDraws);
  state.ais.forEach((ai) => {
    const existing = state.foundingCivilizationDraws[ai.id];
    if (existing?.length === 2) return;
    state.foundingCivilizationDraws[ai.id] = sample(FOUNDING_CIVILIZATIONS, 2).map((civilization) => civilization.id);
  });
}

function getFoundingCivilization(id) {
  return FOUNDING_CIVILIZATIONS.find((civilization) => civilization.id === id) ?? null;
}

function getFoundingCivilizationDrawForAi(ai) {
  ensureFoundingCivilizationDraws();
  return (state.foundingCivilizationDraws?.[ai.id] ?? []).map(getFoundingCivilization).filter(Boolean);
}

function chooseFoundingCivilization(ai, civilizationId) {
  const options = getFoundingCivilizationDrawForAi(ai);
  const civilization = options.find((item) => item.id === civilizationId);
  if (!civilization) return;
  ai.foundingCivilization = civilization.id;
  recordLog(`${ai.name} choisit ${civilization.name} comme civilisation de départ.`, "Civilisation");
  recordMemory("Civilisation", `${ai.name} choisit ${civilization.name} comme civilisation de départ.`, { important: true });
}

function isProfileMilestone(year) {
  return year >= 0 && year % 400 === 0;
}

function markProfileYear(year) {
  state.profileDrawYears = state.profileDrawYears ?? [];
  if (!state.profileDrawYears.includes(year)) state.profileDrawYears.push(year);
}

function getEraInfo(year) {
  const clampedYear = Math.max(0, Number(year) || 0);
  const targetDanger = Math.min(19, 3 + Math.sqrt(clampedYear / 2000) * 16);
  let label = "fondation douce";
  if (targetDanger >= 7) label = "tension montante";
  if (targetDanger >= 11) label = "âge dangereux";
  if (targetDanger >= 15) label = "ère apocalyptique";
  return { label, targetDanger: Math.round(targetDanger * 10) / 10 };
}

function drawWeightedPower(year, randomFn = Math.random) {
  const target = getEraInfo(year).targetDanger;
  const sigma = 4.8;
  const floorChance = 0.025;
  const weighted = POWERS.map((power) => {
    const drawDanger = power.drawDanger ?? power.danger;
    const distance = drawDanger - target;
    const curve = Math.exp(-(distance * distance) / (2 * sigma * sigma));
    const lateBoost = power.danger >= 16 ? Math.min(1.8, 0.35 + year / 1000) : 1;
    const weight = floorChance + curve * lateBoost;
    return { power, weight };
  });
  const total = weighted.reduce((sum, item) => sum + item.weight, 0);
  let roll = randomFn() * total;
  for (const item of weighted) {
    roll -= item.weight;
    if (roll <= 0) return prepareDrawnCard({ ...item.power, level: drawCardLevel(randomFn) }, randomFn);
  }
  return prepareDrawnCard({ ...weighted[weighted.length - 1].power, level: drawCardLevel(randomFn) }, randomFn);
}

function getPreviewCardCount() {
  return [0, 5].includes(Number(state.settings?.cardPreviewCount)) ? Number(state.settings.cardPreviewCount) : 0;
}

function getNextForecastYear() {
  const currentYear = Math.max(0, Math.floor(Number(state.settings.year) || 0));
  return hasAuctionCards() ? currentYear + 50 : currentYear;
}

function clonePendingCounters(counters = []) {
  return counters.map((counter) => ({
    source: counter.source,
    dueIn: Math.max(0, Math.floor(Number(counter.dueIn) || 0)),
  }));
}

function getCardForecastKey() {
  return JSON.stringify({
    year: getNextForecastYear(),
    pendingCounters: clonePendingCounters(state.pendingCounters ?? []),
    forcedPowerName: state.settings.forcedPowerName || "",
    forcedPowerLevel: state.settings.forcedPowerLevel || 0,
  });
}

function refreshCardForecast({ force = false } = {}) {
  const count = getPreviewCardCount();
  if (!count) {
    state.cardForecast = [];
    state.cardForecastKey = "";
    return [];
  }

  const key = getCardForecastKey();
  if (force || state.cardForecastKey !== key || !Array.isArray(state.cardForecast)) {
    state.cardForecast = buildCardForecast(count);
    state.cardForecastKey = key;
  }
  extendCardForecastToCount(count);
  return state.cardForecast;
}

function ensureCardForecast() {
  return refreshCardForecast();
}

function buildCardForecast(count) {
  const entries = [];
  const firstYear = getNextForecastYear();
  let pendingCounters = clonePendingCounters(state.pendingCounters ?? []);

  for (let index = 0; index < count; index += 1) {
    const forcedName = index === 0 ? state.settings.forcedPowerName : "";
    const forcedLevel = index === 0 ? state.settings.forcedPowerLevel : 0;
    const year = firstYear + Math.floor(index / 2) * 50;
    const entry = simulateForecastEntry(year, pendingCounters, forcedName, index % 2 === 0, forcedLevel);
    entries.push(entry);
    pendingCounters = clonePendingCounters(entry.pendingCountersAfterSchedule);
  }

  return entries;
}

function extendCardForecastToCount(count) {
  state.cardForecast = Array.isArray(state.cardForecast) ? state.cardForecast : [];
  while (state.cardForecast.length < count) {
    const last = state.cardForecast[state.cardForecast.length - 1];
    const tailSameYearCount = last
      ? state.cardForecast.slice().reverse().findIndex((entry) => entry.year !== last.year)
      : 0;
    const normalizedTailCount = last ? (tailSameYearCount === -1 ? state.cardForecast.length : tailSameYearCount) : 0;
    const completeCurrentPair = normalizedTailCount >= 2;
    const year = last ? last.year + (completeCurrentPair ? 50 : 0) : getNextForecastYear();
    const advanceCounters = !last || completeCurrentPair;
    const pendingCounters = last ? clonePendingCounters(last.pendingCountersAfterSchedule) : clonePendingCounters(state.pendingCounters ?? []);
    state.cardForecast.push(simulateForecastEntry(year, pendingCounters, "", advanceCounters));
  }
  if (state.cardForecast.length > count) state.cardForecast = state.cardForecast.slice(0, count);
}

function simulateForecastEntry(year, pendingCounters, forcedName = "", advanceCounters = true, forcedLevel = 0) {
  let card;
  let counterSource = null;
  let forced = false;
  let levelForced = false;
  let pendingCountersAfterDraw = clonePendingCounters(pendingCounters);
  if (advanceCounters) {
    pendingCountersAfterDraw = pendingCountersAfterDraw
      .map((counter) => ({ ...counter, dueIn: Math.max(0, counter.dueIn - 1) }));
  }

  const forcedPower = getPowerByName(forcedName);
  if (forcedPower) {
    card = prepareDrawnCard({
      ...forcedPower,
      level: forcedLevel ? normalizeCardLevel(forcedLevel) : drawCardLevel(),
    });
    counterSource = forcedPower.counterSource ?? null;
    forced = true;
  } else {
    const dueIndex = pendingCountersAfterDraw.findIndex((counter) => counter.dueIn <= 0);
    if (dueIndex !== -1) {
      const [counter] = pendingCountersAfterDraw.splice(dueIndex, 1);
      card = chooseCounterCard(counter.source);
      counterSource = counter.source;
    } else {
      card = { ...drawWeightedPower(year) };
    }
  }
  if (forcedLevel && !forcedPower) {
    card = prepareDrawnCard({ ...card, level: normalizeCardLevel(forcedLevel), traitRoll: null });
    levelForced = true;
  }
  if (forcedLevel && forcedPower) levelForced = true;
  card = prepareDrawnCard(card);

  const scheduledCounterDueIn = getScheduledCounterDueIn(card);
  const pendingCountersAfterSchedule = clonePendingCounters(pendingCountersAfterDraw);
  if (scheduledCounterDueIn !== null) {
    pendingCountersAfterSchedule.push({ source: card.name, dueIn: scheduledCounterDueIn });
  }

  return {
    year,
    cardName: card.name,
    level: card.level,
    traitRoll: card.traitRoll ?? null,
    counterSource,
    forced,
    levelForced,
    scheduledCounterDueIn,
    pendingCountersAfterDraw,
    pendingCountersAfterSchedule,
  };
}

function getScheduledCounterDueIn(card) {
  if (!card || card.counterOnly || card.noCounter || !["Danger", "Destruction"].includes(card.scale) || card.rating < 16) return null;
  return 1 + Math.floor(Math.random() * 3);
}

function consumeCardForecastEntry() {
  if (!getPreviewCardCount()) return null;
  refreshCardForecast();
  const entry = state.cardForecast.shift() ?? null;
  state.cardForecastKey = getCardForecastKey();
  extendCardForecastToCount(getPreviewCardCount());
  return entry;
}

function consumeAuctionForecastEntries() {
  if (!getPreviewCardCount()) return [];
  refreshCardForecast();
  return state.cardForecast.splice(0, 2);
}

function consumeMatchingForcedForecastEntry(forcedPowerName) {
  if (!getPreviewCardCount()) return null;
  refreshCardForecast();
  const entry = state.cardForecast[0];
  if (!entry || entry.cardName !== forcedPowerName || !entry.forced) return null;
  state.cardForecast.shift();
  state.cardForecastKey = getCardForecastKey();
  extendCardForecastToCount(getPreviewCardCount());
  return entry;
}

function alignCardForecastWithCurrentState() {
  const count = getPreviewCardCount();
  if (!count) return;
  state.cardForecastKey = getCardForecastKey();
  extendCardForecastToCount(count);
}

function drawFromForecastEntry(entry) {
  const power = getPowerByName(entry?.cardName);
  if (!power) return { ...drawNextCard(state.settings.year), forced: false };
  const forecastCard = prepareDrawnCard({
    ...power,
    level: normalizeCardLevel(entry.level),
    traitRoll: entry.traitRoll ?? null,
  });
  return {
    card: entry.counterSource
      ? { ...forecastCard, counterOnly: power.counterOnly ?? false, counterSource: entry.counterSource }
      : forecastCard,
    counterSource: entry.counterSource ?? null,
    scheduledCounterDueIn: entry.scheduledCounterDueIn ?? null,
    forced: Boolean(entry.forced),
    levelForced: Boolean(entry.levelForced),
  };
}

function drawNextCard(year, options = {}) {
  const forecastEntry = options.forecastEntry ?? null;
  if (forecastEntry) {
    const forecastPower = getPowerByName(forecastEntry.cardName);
    if (forecastPower) {
      state.pendingCounters = clonePendingCounters(forecastEntry.pendingCountersAfterDraw ?? state.pendingCounters ?? []);
      const preparedForecastCard = prepareDrawnCard({
        ...forecastPower,
        level: normalizeCardLevel(forecastEntry.level),
        traitRoll: forecastEntry.traitRoll ?? null,
      });
      const card = forecastEntry.counterSource
        ? { ...preparedForecastCard, counterOnly: forecastPower.counterOnly ?? false, counterSource: forecastEntry.counterSource }
        : preparedForecastCard;
      return {
        card,
        counterSource: forecastEntry.counterSource ?? null,
        scheduledCounterDueIn: forecastEntry.scheduledCounterDueIn ?? null,
      };
    }
  }

  if (options.advanceCounters !== false) {
    state.pendingCounters = (state.pendingCounters ?? [])
      .map((counter) => ({ ...counter, dueIn: Math.max(0, counter.dueIn - 1) }));
  }

  const dueIndex = state.pendingCounters.findIndex((counter) => counter.dueIn <= 0);
  if (dueIndex !== -1) {
    const [counter] = state.pendingCounters.splice(dueIndex, 1);
    state.pendingCounters = state.pendingCounters.map((item) => item.dueIn <= 0 ? { ...item, dueIn: 0 } : item);
    return {
      card: chooseCounterCard(counter.source),
      counterSource: counter.source,
      scheduledCounterDueIn: null,
    };
  }

  return { card: drawWeightedPower(year), counterSource: null, scheduledCounterDueIn: null };
}

function getSelectablePowers() {
  return [...POWERS, ...COUNTER_CARDS].sort((a, b) => a.name.localeCompare(b.name));
}

function getSelectablePowerGroups() {
  const groups = new Map();
  getSelectablePowers().forEach((power) => {
    const label = getCardCategoryLabel(power);
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label).push(power);
  });

  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, powers]) => ({
      label,
      powers: powers.sort((a, b) => formatCardName(a).localeCompare(formatCardName(b))),
    }));
}

function getPowerByName(name) {
  return getSelectablePowers().find((power) => power.name === name);
}

function scheduleCounterFor(card, plannedDueIn = null) {
  if (!card || card.counterOnly || card.noCounter || !["Danger", "Destruction"].includes(card.scale) || card.rating < 16) return null;
  const dueIn = plannedDueIn ?? (1 + Math.floor(Math.random() * 3));
  const counter = { source: card.name, dueIn };
  state.pendingCounters = state.pendingCounters ?? [];
  state.pendingCounters.push(counter);
  return counter;
}

function chooseCounterCard(sourceName, randomFn = Math.random) {
  const byName = (name) => POWERS.find((power) => power.name === name) ?? COUNTER_CARDS.find((power) => power.name === name);
  const namedPools = {
    Dragon: ["Rain", "Rain Cloud", "Snow Cloud", "Shield", "Blood Rain", "Restauration de biome", "Life Eraser ciblé"],
    Volcano: ["Rain", "Rain Cloud", "Snow Cloud", "Restauration de biome", "Cloud of Life", "Life Eraser ciblé"],
    Earthquake: ["Restauration de biome", "Reconstruction contrôlée", "Stone", "Ore Deposit", "Cloud of Life"],
    "Atomic Bomb": ["Reconstruction contrôlée", "Restauration de biome", "Humans", "Fruit Bush", "Plants Fertilizer", "Cloud of Life"],
    "Antimatter Bomb": ["Reconstruction contrôlée", "Restauration de biome", "Humans", "Stone", "Ore Deposit", "Cloud of Life"],
    "Zombie Infection": ["Divine Light", "Quarantaine MJ", "Life Eraser ciblé", "Réinitialisation de traits"],
    "MUSH Spores": ["Divine Light", "Quarantaine MJ", "Life Eraser ciblé", "Réinitialisation de traits"],
    "The Plague": ["Divine Light", "Quarantaine MJ", "Réinitialisation de traits", "White Mage"],
    Madness: ["Divine Light", "Dispel", "Shield", "Blessing", "Réinitialisation de traits"],
    Curse: ["Blessing", "Divine Light", "Dispel", "Shield", "Réinitialisation de traits"],
    Tumor: ["Fire", "Bomb", "Grenade", "Life Eraser ciblé", "Quarantaine MJ"],
    Cybercore: ["Bomb", "Grenade", "Fire", "Life Eraser ciblé", "Quarantaine MJ"],
    "Black Dust": ["Réinitialisation de traits", "Divine Light", "Dispel", "Blessing"],
    "Blue Dust": ["Réinitialisation de traits", "Divine Light", "Dispel", "Blessing"],
  };
  const fallback = ["Divine Light", "Shield", "Blessing", "Dispel", "Reconstruction contrôlée", "Restauration de biome"];
  const pool = (namedPools[sourceName] ?? fallback).map(byName).filter(Boolean);
  const chosen = pool[Math.floor(randomFn() * pool.length)];
  return prepareDrawnCard({
    ...chosen,
    level: drawCardLevel(randomFn),
    counterOnly: chosen.counterOnly ?? false,
    counterSource: sourceName,
  }, randomFn);
}

function canFinishAuctionCycle() {
  return hasAuctionCards() && !state.auction.endProcessed;
}

function handleAuctionCycleButton() {
  if (canFinishAuctionCycle()) {
    finishAuctionCycle();
  } else {
    newAuction();
  }
}

function newAuction() {
  pushUndo();
  state.settings = readSettings();
  const shouldAdvanceTime = Boolean(hasAuctionCards() && state.auction.endProcessed);
  if (shouldAdvanceTime) {
    state.settings.year = Math.max(0, Math.floor(Number(state.settings.year) || 0)) + 50;
    handleAgeMilestones();
    state.auction = emptyAuction();
  }
  state.postIncomePromptYear = null;
  const era = getEraInfo(state.settings.year);
  const forcedPowerName = state.settings.forcedPowerName;
  const forcedPowerLevel = state.settings.forcedPowerLevel;
  const forcedPower = getPowerByName(forcedPowerName);
  const forecastEntries = consumeAuctionForecastEntries();
  const useForecastPair = forecastEntries.length === 2;
  const firstDraw = useForecastPair
    ? drawFromForecastEntry(forecastEntries[0])
    : forcedPower
      ? {
        card: prepareDrawnCard({
          ...forcedPower,
          level: forcedPowerLevel ? normalizeCardLevel(forcedPowerLevel) : drawCardLevel(),
        }),
        counterSource: forcedPower.counterSource ?? null,
        scheduledCounterDueIn: null,
        forced: true,
        levelForced: Boolean(forcedPowerLevel),
      }
      : { ...drawNextCard(state.settings.year, { advanceCounters: true }), forced: false };
  const secondDraw = useForecastPair
    ? drawFromForecastEntry(forecastEntries[1])
    : { ...drawNextCard(state.settings.year, { advanceCounters: Boolean(forcedPower) }), forced: false };
  if (!useForecastPair && !forcedPower && forcedPowerLevel) {
    firstDraw.card = prepareDrawnCard({
      ...firstDraw.card,
      level: normalizeCardLevel(forcedPowerLevel),
      traitRoll: null,
    });
    firstDraw.levelForced = true;
  }
  if (!useForecastPair && secondDraw.card?.name === firstDraw.card?.name && !secondDraw.counterSource) {
    secondDraw.card = { ...drawWeightedPower(state.settings.year) };
    secondDraw.scheduledCounterDueIn = getScheduledCounterDueIn(secondDraw.card);
  }
  const draws = [firstDraw, secondDraw];
  getAliveAis().forEach((ai) => {
    ai.coinsAtAuctionStart = ai.coins;
    ai.auctionPassDelta = 0;
    ai.auctionPurchaseDelta = 0;
    ai.auctionEffectDelta = 0;
    ai.auctionDoctrineLines = [];
  });
  const revealLines = draws.flatMap(({ card }) => applyRevealProfileEffects(card));
  revealLines.push(...applyAuctionPairProfileEffects(draws.map(({ card }) => card)));
  const scheduledCounters = useForecastPair
    ? draws.map(({ scheduledCounterDueIn }) => scheduledCounterDueIn === null ? null : { dueIn: scheduledCounterDueIn })
    : draws.map(({ card, scheduledCounterDueIn }) => scheduleCounterFor(card, scheduledCounterDueIn));
  if (useForecastPair) {
    state.pendingCounters = clonePendingCounters(forecastEntries[1].pendingCountersAfterSchedule ?? state.pendingCounters);
  }
  const order = getAuctionAis()
    .sort((a, b) => b.population - a.population || a.name.localeCompare(b.name))
    .map((ai) => ai.id);

  state.auction = {
    slots: draws.map((draw, index) => createAuctionSlot(index === 0 ? "A" : "B", { card: draw.card })),
    selectedSlotId: "A",
    blockedSlotByAi: {},
    order,
    turnIndex: 0,
    passed: [],
    active: order.length > 0,
    closed: false,
    turnsTaken: 0,
    ghostParticipants: getAuctionAis().filter((ai) => ai.ghostActive).map((ai) => ai.id),
    endProcessed: false,
  };
  state.log = [
    `An ${state.settings.year} - Nouvelle enchère.`,
    shouldAdvanceTime ? "50 ans passent depuis la fin de l'enchère précédente. Aucun revenu n'est appliqué ici : les revenus privés ont déjà été donnés à la fin de l'enchère." : null,
    state.worldMap?.neutralZones?.length
      ? `Note MJ carte : réapprovisionner les zones centrales neutres en matériaux rares et minerais avant de résoudre cette enchère (${state.worldMap.neutralZones.join(", ")}).`
      : null,
    ...revealLines,
    `Courbe : ${era.label}, intensité de tirage visée ${era.targetDanger}/20. Les petites cartes restent possibles.`,
    `Incrément automatique : ouverture minimum ${getBidIncrement(state.settings.year)}, puis surenchère minimum de ${getBidIncrement(state.settings.year)} pièces.`,
    firstDraw.forced ? `Carte A forcée par le MJ : ${formatCardName(firstDraw.card)}.` : null,
    ...draws.map(({ card, counterSource }, index) => [
      counterSource ? `Carte ${index === 0 ? "A" : "B"} anti-${formatCardName(counterSource)} tirée depuis la file de contre-pouvoirs.` : null,
      `Carte ${index === 0 ? "A" : "B"} : ${formatCardName(card)} (${getCardCategoryLabel(card)}, ${formatCardRating(card)}, Level ${normalizeCardLevel(card.level)}), prix de départ 0.`,
      `Effet Level ${normalizeCardLevel(card.level)} : ${getResolvedCardLevelEffect(card)}.`,
      scheduledCounters[index] ? `Règle de contre-pouvoir : une carte anti-${formatCardName(card)} est programmée dans ${scheduledCounters[index].dueIn} enchère(s).` : null,
    ]).flat().filter(Boolean),
    `Participants encore en course : ${formatActiveAuctionNames(order)}.`,
  ].filter(Boolean);
  recordHistorySnapshot(shouldAdvanceTime ? "Nouvelle enchère" : "Départ");
  resolveAutomaticPasses();
  recordMemoryLines("Nouvelle enchère", state.log);
  activateFortuneWheelIfDue();
  state.settings.forcedPowerName = "";
  state.settings.forcedPowerLevel = 0;
  alignCardForecastWithCurrentState();
  saveAndRender();
}

function finishAuctionCycle() {
  if (!hasAuctionCards() || state.auction.endProcessed) {
    showToast("Aucune enchère à terminer");
    return;
  }

  pushUndo();
  state.settings = readSettings();
  if (state.auction.active) {
    closeAuctionAutomatically();
  } else {
    state.auction.closed = true;
  }

  state.auction.active = false;
  state.auction.closed = true;
  state.auction.endProcessed = true;
  const incomeLine = distributeIncome();
  recordHistorySnapshot("Revenus");
  state.postIncomePromptYear = state.settings.year;
  state.lastIncomeSummary = incomeLine;
  expandedPromptGroups.add("États IA après revenus");
  recordLog(`An ${state.settings.year} - Fin du duopole : les populations saisies par le MJ servent aux revenus privés. Les 50 ans passeront au lancement de la nouvelle enchère.`, "Fin d'enchère");
  recordLog(incomeLine, "Revenus");
  recordMemory("État après revenus", buildPostIncomeMemorySnapshot(), { important: true });
  saveAndRender();
}

function distributeIncome() {
  const total = getWorldPopulation();
  const threshold = getUnderdogThreshold();
  const lines = [];
  getAliveAis().forEach((ai) => {
    const share = total ? ai.population / total : 0;
    const bonus = calculateUnderdogBonus(share, threshold);
    let doctrineEffect = 0;
    let delta = state.settings.baseIncome + bonus;
    const details = [];
    const doctrineLines = [];
    if (bonus) details.push("bonus retardataire");

    if (ai.activeProfile === "warlord") {
      if ((state.settings.warCivs ?? 0) > 0) {
        const warBonus = 6 * state.settings.warCivs;
        delta += warBonus;
        doctrineEffect += warBonus;
        details.push(`doctrine +${warBonus}`);
        doctrineLines.push(`${state.settings.warCivs} guerre(s) déclarée(s) × 6 = +${warBonus}`);
      } else {
        delta -= 4;
        doctrineEffect -= 4;
        details.push("doctrine -4");
        doctrineLines.push("Aucune guerre déclarée : -4");
      }
    }

    if (ai.activeProfile === "merchant") {
      const armyCost = Math.floor((ai.soldiers ?? 0) / 1000) * 3;
      if (armyCost) {
        delta -= armyCost;
        doctrineEffect -= armyCost;
        details.push(`doctrine -${armyCost}`);
        doctrineLines.push(`${Math.floor((ai.soldiers ?? 0) / 1000)} tranche(s) de 1000 soldats × -3 = -${armyCost}`);
      }
    }

    if (ai.activeProfile === "martyr") {
      delta -= 4;
      doctrineEffect -= 4;
      details.push("doctrine -4");
      doctrineLines.push("Coût politique permanent : -4");
    }

    if (ai.activeProfile === "vagabond") {
      const countedColonies = Math.min(ai.colonies ?? 0, 3);
      const colonyBonus = countedColonies * 5;
      if (colonyBonus) {
        delta += colonyBonus;
        doctrineEffect += colonyBonus;
        details.push(`doctrine +${colonyBonus}${(ai.colonies ?? 0) > 3 ? " plafonne" : ""}`);
        doctrineLines.push(`${countedColonies} colonie(s) extérieure(s) comptée(s) × 5 = +${colonyBonus}`);
      }
      if ((ai.population ?? 0) > 0 && (ai.homePopulation ?? 0) / ai.population > 0.75) {
        delta -= 5;
        doctrineEffect -= 5;
        details.push("doctrine -5");
        doctrineLines.push("Population du territoire natal > 75% du total : -5");
      }
    }

    if (ai.activeProfile === "underdog") {
      if (share < threshold) {
        delta += 6;
        doctrineEffect += 6;
        details.push("doctrine +6");
        doctrineLines.push(`Part démographique ${formatPercent(share * 100)}% sous le seuil faible ${formatPercent(threshold * 100)}% : +6`);
      }
      const highestPopulation = Math.max(...getAliveAis().map((item) => Number(item.population) || 0));
      if ((Number(ai.population) || 0) === highestPopulation) {
        delta -= 4;
        doctrineEffect -= 4;
        details.push("doctrine -4");
        doctrineLines.push("Plus grande population mondiale : -4");
      }
    }

    if (ai.activeProfile === "treasurer") {
      if (ai.coins >= 100) {
        delta += 5;
        doctrineEffect += 5;
        details.push("doctrine +5");
        doctrineLines.push(`Réserve avant revenus de ${ai.coins} pièces, au moins 100 : +5`);
      } else if (ai.coins < 20) {
        delta -= 5;
        doctrineEffect -= 5;
        details.push("doctrine -5");
        doctrineLines.push(`Réserve avant revenus de ${ai.coins} pièces, sous 20 : -5`);
      }
    }

    const coinsBeforeIncome = ai.coins;
    ai.coins = Math.max(0, ai.coins + delta);

    if (ai.activeProfile === "paranoid" && ai.coins < 20) {
      ai.coins = Math.max(0, ai.coins - 5);
      doctrineEffect -= 5;
      details.push("doctrine -5");
      doctrineLines.push("Réserve sous 20 pièces après revenu : -5");
    }

    const incomeApplied = ai.coins - coinsBeforeIncome;
    const coinsAtStart = ai.coinsAtAuctionStart ?? coinsBeforeIncome;
    const passDelta = Number(ai.auctionPassDelta) || 0;
    const purchaseDelta = Number(ai.auctionPurchaseDelta) || 0;
    const effectDelta = Number(ai.auctionEffectDelta) || 0;
    const auctionDelta = coinsBeforeIncome - coinsAtStart;
    ai.lastIncomeBreakdown = {
      coinsAtAuctionStart: coinsAtStart,
      auctionDelta,
      passDelta,
      purchaseDelta,
      effectDelta,
      otherAuctionDelta: auctionDelta - passDelta - purchaseDelta - effectDelta,
      coinsBeforeIncome,
      baseIncome: state.settings.baseIncome,
      underdogBonus: bonus,
      doctrineEffect,
      doctrineLines,
      auctionDoctrineLines: [...(ai.auctionDoctrineLines ?? [])],
      incomeApplied,
      finalCoins: ai.coins,
    };

    lines.push(`${ai.name} ${formatSigned(incomeApplied)}${details.length ? ` (${details.join(", ")})` : ""}`);
  });
  return `Revenus : ${lines.join(", ")}.`;
}

function noteAuctionDoctrineEffect(ai, text) {
  ai.auctionDoctrineLines = ai.auctionDoctrineLines ?? [];
  ai.auctionDoctrineLines.push(text);
}

function applyRevealProfileEffects(card) {
  const lines = [];
  const wasSeen = (state.cardHistory ?? []).includes(card.name);
  getAliveAis().forEach((ai) => {
    if (ai.activeProfile === "sage" && (card.category === "Contre-pouvoir" || (card.scale === "Bénéfice" && card.rating <= 5))) {
      const reward = 2 * normalizeCardLevel(card.level);
      ai.coins += reward;
      ai.auctionEffectDelta = (Number(ai.auctionEffectDelta) || 0) + reward;
      noteAuctionDoctrineEffect(ai, `Humaniste : +${reward}, carte douce ou réparatrice Level ${normalizeCardLevel(card.level)}`);
      lines.push(`${ai.name} +${reward} : doctrine humaniste, carte douce ou réparatrice Level ${normalizeCardLevel(card.level)}.`);
    }
    if (ai.activeProfile === "scholar") {
      if (wasSeen) {
        ai.coins += 4;
        ai.auctionEffectDelta = (Number(ai.auctionEffectDelta) || 0) + 4;
        noteAuctionDoctrineEffect(ai, "Traditionaliste : +4, carte déjà connue");
        lines.push(`${ai.name} +4 : doctrine traditionaliste, carte déjà connue.`);
      } else if (card.rating >= 16) {
        const cost = 2 * normalizeCardLevel(card.level);
        ai.coins = Math.max(0, ai.coins - cost);
        ai.auctionEffectDelta = (Number(ai.auctionEffectDelta) || 0) - cost;
        noteAuctionDoctrineEffect(ai, `Traditionaliste : -${cost}, carte inédite de puissance 16/20 ou plus`);
        lines.push(`${ai.name} -${cost} : doctrine traditionaliste, rupture dangereuse inédite Level ${normalizeCardLevel(card.level)}.`);
      }
    }
    if (ai.activeProfile === "naturalist" && String(card.category).startsWith("Nature")) {
      ai.coins += 4;
      ai.auctionEffectDelta = (Number(ai.auctionEffectDelta) || 0) + 4;
      noteAuctionDoctrineEffect(ai, "Écologiste : +4, carte naturelle révélée");
      lines.push(`${ai.name} +4 : doctrine écologiste, carte naturelle révélée.`);
    }
    if (ai.activeProfile === "occultist" && card.category === "Contre-pouvoir") {
      ai.coins = Math.max(0, ai.coins - 4);
      ai.auctionEffectDelta = (Number(ai.auctionEffectDelta) || 0) - 4;
      noteAuctionDoctrineEffect(ai, "Théocrate : -4, Contre-pouvoir révélé");
      lines.push(`${ai.name} -4 : doctrine théocratique, contre-pouvoir révélant les limites du sacré.`);
    }
  });
  state.cardHistory = state.cardHistory ?? [];
  state.cardHistory.push(card.name);
  return lines;
}

function applyAuctionPairProfileEffects(cards) {
  const lines = [];
  const validCards = cards.filter(Boolean);
  if (validCards.length < 2) return lines;
  const hasHostile = validCards.some(isHostileCard);
  const hasConstructive = validCards.some(isConstructiveCard);
  const bothHostile = validCards.every(isHostileCard);
  getAliveAis().filter((ai) => ai.activeProfile === "balancer").forEach((ai) => {
    if (hasHostile && hasConstructive) {
      ai.coins += 8;
      ai.auctionEffectDelta = (Number(ai.auctionEffectDelta) || 0) + 8;
      noteAuctionDoctrineEffect(ai, "Équilibriste : +8, duopole menace/construction");
      lines.push(`${ai.name} +8 : doctrine équilibriste, le duopole oppose menace et construction.`);
    } else if (bothHostile) {
      ai.coins = Math.max(0, ai.coins - 6);
      ai.auctionEffectDelta = (Number(ai.auctionEffectDelta) || 0) - 6;
      noteAuctionDoctrineEffect(ai, "Équilibriste : -6, deux cartes hostiles");
      lines.push(`${ai.name} -6 : doctrine équilibriste, les deux cartes du duopole sont hostiles.`);
    }
  });
  return lines;
}

function placeBid() {
  const ai = getCurrentBidder();
  if (!ai || !state.auction.active) return;

  if (ai.activeProfile === "patient" && !canPatientBidNow()) {
    pushUndo();
    showToast("Institutionnaliste : ouverture interdite");
    recordLog(`${ai.name} ne peut pas poser la première mise : sa doctrine institutionnaliste impose d'attendre qu'une autre civilisation ouvre officiellement l'enjeu.`, "Enchère");
    state.auction.turnsTaken = (state.auction.turnsTaken ?? 0) + 1;
    advanceTurn();
    resolveAutomaticPasses();
    saveAndRender();
    return;
  }

  const slot = getAuctionSlot(els.bidTargetSelect?.value || state.auction.selectedSlotId);
  const eligibleSlots = getEligibleAuctionSlots(ai);
  if (!slot || !eligibleSlots.some((item) => item.id === slot.id)) {
    showToast(`${ai.name} ne peut pas miser sur cette carte maintenant`);
    return;
  }

  const amount = Math.floor(Number(els.bidInput.value) || 0);
  const minimum = getSlotMinimumBid(slot);

  if (amount < minimum) {
    showToast(`Mise minimum : ${minimum}`);
    return;
  }
  if (amount > ai.coins) {
    showToast(`${ai.name} n'a pas assez de pièces`);
    return;
  }
  pushUndo();
  const previousWinner = slot.winner;
  const previous = previousWinner ? `${getAiName(previousWinner)} à ${slot.currentBid}` : "personne";
  slot.currentBid = amount;
  slot.winner = ai.id;
  state.auction.selectedSlotId = slot.id;
  if (previousWinner && previousWinner !== ai.id) {
    state.auction.blockedSlotByAi[previousWinner] = slot.id;
  }
  ai.passBonusLevel = Math.min(getPassCeiling(), getAiPassBonusLevel(ai) + 1);
  recordLog(`${ai.name} enchérit à ${amount} sur la carte ${slot.id}, ${formatCardName(slot.card)}, et dépasse ${previous}.${previousWinner ? ` ${getAiName(previousWinner)} ne peut pas revenir immédiatement sur la carte ${slot.id}.` : ""}`, "Enchère");
  state.auction.turnsTaken = (state.auction.turnsTaken ?? 0) + 1;
  if (shouldCloseDuopoly()) {
    closeAuctionAutomatically();
  } else {
    advanceTurn();
    resolveAutomaticPasses();
  }
  saveAndRender();
}

function canPatientBidNow() {
  return getAuctionLeaderIds().length > 0;
}

function passTurn() {
  const ai = getCurrentBidder();
  if (!ai || !state.auction.active) return;
  pushUndo();
  applyAuctionPass(ai);

  if (shouldCloseDuopoly()) {
    closeAuctionAutomatically();
  } else {
    advanceTurn();
    resolveAutomaticPasses();
  }
  saveAndRender();
}

function getCurrentMinimumBid() {
  const ai = getCurrentBidder();
  const minimums = ai ? getEligibleAuctionSlots(ai).map(getSlotMinimumBid) : [];
  return minimums.length ? Math.min(...minimums) : Number.POSITIVE_INFINITY;
}

function getSlotMinimumBid(slot) {
  const increment = getBidIncrement(state.settings.year);
  return slot?.winner ? slot.currentBid + increment : increment;
}

function getEligibleAuctionSlots(ai) {
  if (!ai) return [];
  const blockedSlotId = state.auction.blockedSlotByAi?.[ai.id] ?? null;
  return getAuctionSlots().filter((slot) => slot.card && slot.id !== blockedSlotId && slot.winner !== ai.id);
}

function canAiAffordAnyEligibleSlot(ai) {
  return getEligibleAuctionSlots(ai).some((slot) => ai.coins >= getSlotMinimumBid(slot));
}

function shouldCloseDuopoly() {
  return getStillBiddingIds().length === 0;
}

function applyAuctionPass(ai, options = {}) {
  if (!ai || state.auction.passed.includes(ai.id)) return false;
  const currentPassLevel = getAiPassBonusLevel(ai);
  let reward = ai.activeProfile === "patient" ? currentPassLevel + 3 : currentPassLevel;
  const details = [];
  if (ai.activeProfile === "patient") details.push("doctrine institutionnaliste");
  if (ai.activeProfile === "tyrant") {
    reward -= 4;
    details.push("doctrine -4");
  }

  state.auction.passed.push(ai.id);
  ai.coins = Math.max(0, ai.coins + reward);
  ai.auctionPassDelta = (Number(ai.auctionPassDelta) || 0) + reward;
  ai.passBonusLevel = Math.max(getPassFloor(), currentPassLevel - 1);

  const rewardText = `${reward >= 0 ? "gagne" : "perd"} ${Math.abs(reward)} pièces`;
  if (options.automatic) {
    const minimum = options.minimum ?? getCurrentMinimumBid();
    const blockedSlotId = options.blockedSlotId ?? state.auction.blockedSlotByAi?.[ai.id] ?? null;
    const eligibleSlots = options.eligibleSlots ?? getEligibleAuctionSlots(ai);
    const requiredText = eligibleSlots
      .map((slot) => `carte ${slot.id} : minimum ${getSlotMinimumBid(slot)}`)
      .join(", ");
    const reason = eligibleSlots.length
      ? `${blockedSlotId ? `après avoir été délogé de la carte ${blockedSlotId}, cette carte lui est interdite ; ` : ""}il n'a pas assez de pièces pour atteindre ${requiredText}`
      : `aucune carte autorisée${blockedSlotId ? ` après son délogement de la carte ${blockedSlotId}` : ""}`;
    recordLog(`${ai.name} passe automatiquement : ${reason}. Il ${rewardText} (bonus passe : ${currentPassLevel} → ${ai.passBonusLevel})${details.length ? ` (${details.join(", ")})` : ""}.`, "Enchère");
  } else {
    recordLog(`${ai.name} passe et ${rewardText} (bonus passe : ${currentPassLevel} → ${ai.passBonusLevel})${details.length ? ` (${details.join(", ")})` : ""}.`, "Enchère");
  }
  wbPlaySound("pass");
  state.auction.turnsTaken = (state.auction.turnsTaken ?? 0) + 1;
  return true;
}

function resolveAutomaticPasses() {
  if (!state.auction.active) return false;
  let changed = false;
  let guard = 0;
  while (state.auction.active && guard < state.auction.order.length + 2) {
    guard += 1;
    let ai = getCurrentBidder();
    if (!ai) {
      if (shouldCloseDuopoly()) {
        closeAuctionAutomatically();
        break;
      }
      advanceTurn();
      ai = getCurrentBidder();
      if (!ai) break;
    }
    const eligibleSlots = getEligibleAuctionSlots(ai);
    const minimum = eligibleSlots.length ? Math.min(...eligibleSlots.map(getSlotMinimumBid)) : Number.POSITIVE_INFINITY;
    if (eligibleSlots.length && canAiAffordAnyEligibleSlot(ai)) break;
    applyAuctionPass(ai, {
      automatic: true,
      minimum,
      eligibleSlots,
      blockedSlotId: state.auction.blockedSlotByAi?.[ai.id] ?? null,
    });
    changed = true;

    if (shouldCloseDuopoly()) {
      closeAuctionAutomatically();
      break;
    }
    advanceTurn();
  }
  return changed;
}

function closeAuctionAutomatically() {
  state.auction.active = false;
  state.auction.closed = true;
  getAuctionSlots().forEach((slot) => {
    if (!slot.card) return;
    if (slot.winner) {
      const winner = getAi(slot.winner);
      winner.coins = Math.max(0, winner.coins - slot.currentBid);
      winner.auctionPurchaseDelta = (Number(winner.auctionPurchaseDelta) || 0) - slot.currentBid;
      recordLog(`Fin carte ${slot.id} : ${winner.name} remporte ${formatCardName(slot.card)} pour ${slot.currentBid} pièces.`, "Enchère");
      applyAuctionCloseProfileEffects(winner, slot.card, slot.id);
    } else {
      recordLog(`Fin carte ${slot.id} : personne ne remporte ${formatCardName(slot.card)}.`, "Enchère");
    }
  });
  applyDuopolyCloseProfileEffects();
  finalizeGhostParticipants();
}

function finalizeGhostParticipants() {
  (state.auction.ghostParticipants ?? []).forEach((id) => {
    const ai = getAi(id);
    if (!ai?.ghostActive) return;
    ai.ghostActive = false;
    ai.ghostReady = false;
    ai.ghostUsed = true;
    ai.alive = false;
    recordLog(`${ai.name} referme son unique retour de gouvernement en exil.`, "Doctrine");
  });
}

function applyAuctionCloseProfileEffects(winner, card, slotId) {
  const level = normalizeCardLevel(card.level);
  if (isResourceCard(card)) {
    const resourceReward = 3 * level;
    getAliveAis()
      .filter((ai) => ai.activeProfile === "merchant")
      .forEach((ai) => {
        ai.coins += resourceReward;
        ai.auctionEffectDelta = (Number(ai.auctionEffectDelta) || 0) + resourceReward;
        noteAuctionDoctrineEffect(ai, `Bloc Industriel : +${resourceReward}, ressource Level ${level} adjugée`);
        recordLog(`${ai.name} +${resourceReward} : doctrine Bloc Industriel, ressource Level ${level} adjugée.`, "Doctrine");
      });
  }

  if (winner.activeProfile === "sage" && (card.scale === "Destruction" || (card.scale === "Danger" && card.category.includes("Créatures")))) {
    const cost = 3 * level;
    winner.coins = Math.max(0, winner.coins - cost);
    winner.auctionEffectDelta = (Number(winner.auctionEffectDelta) || 0) - cost;
    noteAuctionDoctrineEffect(winner, `Humaniste : -${cost}, escalade brutale Level ${level} remportée`);
    recordLog(`${winner.name} -${cost} : doctrine humaniste, escalade brutale Level ${level} remportée.`, "Doctrine");
  }

  if (winner.activeProfile === "tyrant" && card.scale === "Destruction") {
    const reward = 4 * level;
    winner.coins += reward;
    winner.auctionEffectDelta = (Number(winner.auctionEffectDelta) || 0) + reward;
    noteAuctionDoctrineEffect(winner, `Autoritaire : +${reward}, Destruction Level ${level} remportée`);
    recordLog(`${winner.name} +${reward} : doctrine autoritaire, Destruction Level ${level} remportée.`, "Doctrine");
  }

  if (winner.activeProfile === "diplomat" && card.name === "Proposer une alliance") {
    const reward = 6 * level;
    winner.coins += reward;
    winner.auctionEffectDelta = (Number(winner.auctionEffectDelta) || 0) + reward;
    noteAuctionDoctrineEffect(winner, `Fédéraliste : +${reward}, Alliance Level ${level} remportée`);
    recordLog(`${winner.name} +${reward} : doctrine fédéraliste, Alliance Level ${level} obtenue.`, "Doctrine");
  }

  if (card.name === "Déclarer la guerre") {
    getAliveAis()
      .filter((ai) => ai.activeProfile === "diplomat")
      .forEach((ai) => {
        ai.coins = Math.max(0, ai.coins - 6);
        ai.auctionEffectDelta = (Number(ai.auctionEffectDelta) || 0) - 6;
        noteAuctionDoctrineEffect(ai, "Fédéraliste : -6, guerre déclarée");
        recordLog(`${ai.name} -6 : doctrine fédéraliste, guerre déclarée.`, "Doctrine");
      });
  }

  if (winner.activeProfile === "maximalist") {
    const effect = level === 3 ? 15 : level === 2 ? 6 : -4;
    winner.coins = Math.max(0, winner.coins + effect);
    winner.auctionEffectDelta = (Number(winner.auctionEffectDelta) || 0) + effect;
    noteAuctionDoctrineEffect(winner, `Maximaliste : ${formatSigned(effect)}, carte Level ${level} remportée`);
    recordLog(`${winner.name} ${formatSigned(effect)} : doctrine maximaliste, carte Level ${level} remportée.`, "Doctrine");
  }

  if (winner.activeProfile === "minimalist" && [1, 3].includes(level)) {
    const effect = level === 1 ? 6 : -10;
    winner.coins = Math.max(0, winner.coins + effect);
    winner.auctionEffectDelta = (Number(winner.auctionEffectDelta) || 0) + effect;
    noteAuctionDoctrineEffect(winner, `Minimaliste : ${formatSigned(effect)}, carte Level ${level} remportée`);
    recordLog(`${winner.name} ${formatSigned(effect)} : doctrine minimaliste, carte Level ${level} remportée.`, "Doctrine");
  }

  if (winner.activeProfile === "naturalist" && card.scale === "Destruction") {
    winner.coins = Math.max(0, winner.coins - 6);
    winner.auctionEffectDelta = (Number(winner.auctionEffectDelta) || 0) - 6;
    noteAuctionDoctrineEffect(winner, "Écologiste : -6, carte de Destruction remportée");
    recordLog(`${winner.name} -6 : doctrine écologiste, carte de Destruction remportée.`, "Doctrine");
  }

  if (winner.activeProfile === "occultist" && getTraitRainSpec(card)) {
    winner.coins += 8;
    winner.auctionEffectDelta = (Number(winner.auctionEffectDelta) || 0) + 8;
    noteAuctionDoctrineEffect(winner, "Théocrate : +8, pluie de traits remportée");
    recordLog(`${winner.name} +8 : doctrine théocratique, pluie de traits remportée.`, "Doctrine");
  }

  if (winner.activeProfile === "rebuilder") {
    if (card.category === "Contre-pouvoir") {
      winner.coins += 10;
      winner.auctionEffectDelta = (Number(winner.auctionEffectDelta) || 0) + 10;
      noteAuctionDoctrineEffect(winner, "Reconstructionniste : +10, Contre-pouvoir remporté");
      recordLog(`${winner.name} +10 : doctrine reconstructionniste, contre-pouvoir remporté.`, "Doctrine");
    } else if (card.scale === "Destruction") {
      winner.coins = Math.max(0, winner.coins - 6);
      winner.auctionEffectDelta = (Number(winner.auctionEffectDelta) || 0) - 6;
      noteAuctionDoctrineEffect(winner, "Reconstructionniste : -6, carte de Destruction remportée");
      recordLog(`${winner.name} -6 : doctrine reconstructionniste, carte de Destruction remportée.`, "Doctrine");
    }
  }

  if (winner.activeProfile === "duelist") {
    const blockedSlotId = state.auction.blockedSlotByAi?.[winner.id] ?? null;
    const effect = blockedSlotId && blockedSlotId !== slotId ? 8 : -4;
    winner.coins = Math.max(0, winner.coins + effect);
    winner.auctionEffectDelta = (Number(winner.auctionEffectDelta) || 0) + effect;
    noteAuctionDoctrineEffect(winner, `Duelliste : ${formatSigned(effect)}, ${effect > 0 ? `victoire après délogement de ${blockedSlotId}` : "aucun délogement préalable"}`);
    recordLog(`${winner.name} ${formatSigned(effect)} : doctrine duelliste, ${effect > 0 ? `victoire sur ${slotId} après délogement de ${blockedSlotId}` : "victoire sans délogement préalable"}.`, "Doctrine");
  }
}

function applyDuopolyCloseProfileEffects() {
  const cardSlots = getAuctionSlots().filter((slot) => slot.card);
  const unclaimedCount = cardSlots.filter((slot) => !slot.winner).length;
  getAliveAis().filter((ai) => ai.activeProfile === "scavenger").forEach((ai) => {
    const effect = unclaimedCount ? unclaimedCount * 6 : -4;
    ai.coins = Math.max(0, ai.coins + effect);
    ai.auctionEffectDelta = (Number(ai.auctionEffectDelta) || 0) + effect;
    noteAuctionDoctrineEffect(ai, `Récupérateur : ${formatSigned(effect)}, ${unclaimedCount ? `${unclaimedCount} carte(s) non attribuée(s)` : "deux cartes attribuées"}`);
    recordLog(`${ai.name} ${formatSigned(effect)} : doctrine récupératrice, ${unclaimedCount ? `${unclaimedCount} carte(s) non attribuée(s)` : "les deux cartes sont attribuées"}.`, "Doctrine");
  });
}

function applyManualHostileAgainst(ai) {
  if (ai.activeProfile === "paranoid") {
    ai.coins += 8;
    ai.auctionEffectDelta = (Number(ai.auctionEffectDelta) || 0) + 8;
    noteAuctionDoctrineEffect(ai, "Sécuritaire : +8, carte hostile subie");
    recordLog(`${ai.name} +8 : doctrine sécuritaire après carte hostile subie.`, "Doctrine");
    showToast(`${ai.name} +8 doctrine`);
  } else {
    recordLog(`Hostile subi noté contre ${ai.name} (aucun bonus automatique : doctrine non sécuritaire).`, "Doctrine");
    showToast("Hostile noté");
  }
}

function payRevealHide(ai, type) {
  if (!isRevealYear(state.settings.year)) return;
  const costs = getRevealCosts(state.settings.year);
  const cost = costs[type];
  if (!cost || ai.coins < cost) {
    showToast(`${ai.name} n'a pas assez de pièces`);
    return;
  }
  ai.coins -= cost;
  if (type === "economy") {
    ai.auctionEffectDelta = (Number(ai.auctionEffectDelta) || 0) - cost;
    ai.hideEconomyRevealYear = state.settings.year;
    recordLog(`${ai.name} paie ${cost} pièces pour cacher son économie à la révélation.`, "Révélation");
    showToast(`${ai.name} économie cachée`);
  }
  if (type === "population") {
    ai.auctionEffectDelta = (Number(ai.auctionEffectDelta) || 0) - cost;
    ai.hidePopulationRevealYear = state.settings.year;
    recordLog(`${ai.name} paie ${cost} pièces pour cacher sa population à la révélation.`, "Révélation");
    showToast(`${ai.name} population cachée`);
  }
}

function triggerMartyrGhost(ai) {
  ai.population = 0;
  ai.soldiers = 0;
  ai.homePopulation = 0;
  ai.coins = 120;
  ai.ghostReady = true;
  ai.ghostActive = false;
  ai.ghostUsed = false;
  recordLog(`${ai.name} : gouvernement en exil enregistré secrètement par le MJ.`, "Doctrine");
}

function activateMartyrReturn(ai) {
  if (!ai.ghostReady || ai.ghostUsed) return;
  ai.ghostReady = false;
  ai.ghostActive = true;
  ai.alive = false;
  ai.population = 0;
  ai.soldiers = 0;
  ai.homePopulation = 0;
  if (ai.coins < 120) ai.coins = 120;
  recordLog(`${ai.name} active son unique retour de gouvernement en exil pour cette enchère.`, "Doctrine");

  if (state.auction.active && !state.auction.order.includes(ai.id)) {
    state.auction.order.push(ai.id);
    state.auction.ghostParticipants = state.auction.ghostParticipants ?? [];
    state.auction.ghostParticipants.push(ai.id);
    recordLog(`${ai.name} est ajouté en dernière position de l'enchère actuelle.`, "Enchère");
  }
}

function isResourceCard(card) {
  return card?.scale === "Ressource"
    || Boolean(card?.resource)
    || ["Stone", "Ore Deposit", "Silver", "Mythril", "Adamantine", "Gold", "Coffee"].includes(card?.name);
}

function getCardCategoryLabel(card) {
  if (!card) return "Aucune";
  return isResourceCard(card) ? "Ressource" : card.category;
}

function getOreRankKey(name) {
  return Object.entries(ORE_RANKS).find(([, data]) => data.aliases.includes(name))?.[0] ?? null;
}

function getOreRankLabel(name) {
  const key = getOreRankKey(name) ?? name;
  const rank = ORE_RANKS[key]?.rank;
  return rank ? `Top ${rank} ore WorldBox` : null;
}

function formatOreName(name) {
  const label = getOreRankLabel(name);
  return label ? `${name} (${label})` : name;
}

function formatCardName(cardOrName) {
  const name = typeof cardOrName === "string" ? cardOrName : cardOrName?.name;
  return name ? formatOreName(name) : "aucune";
}

function formatCardRating(card) {
  if (!card) return "niveau inconnu";
  return `${card.scale ?? inferCardScale(card)} ${card.rating ?? card.danger}/20`;
}

function annotateOreMentions(text) {
  if (!text) return text;
  const patterns = [
    ["Ore Deposit", /\bOre Deposit\b(?!\s*\(Top\s+\d+\s+ore\s+WorldBox\))/g],
    ["Common Metals", /\bCommon Metals\b(?!\s*\(Top\s+\d+\s+ore\s+WorldBox\))/g],
    ["Common Metal", /\bCommon Metal\b(?!s)(?!\s*\(Top\s+\d+\s+ore\s+WorldBox\))/g],
    ["Adamantine", /\bAdamantine\b(?!\s*\(Top\s+\d+\s+ore\s+WorldBox\))/g],
    ["adamantine", /\badamantine\b(?!\s*\(Top\s+\d+\s+ore\s+WorldBox\))/g],
    ["Mythril", /\bMythril\b(?!\s*\(Top\s+\d+\s+ore\s+WorldBox\))/g],
    ["mythril", /\bmythril\b(?!\s*\(Top\s+\d+\s+ore\s+WorldBox\))/g],
    ["Gems", /\bGems\b(?!\s*\(Top\s+\d+\s+ore\s+WorldBox\))/g],
    ["gems", /\bgems\b(?!\s*\(Top\s+\d+\s+ore\s+WorldBox\))/g],
    ["Gem", /\bGem\b(?!s)(?!\s*\(Top\s+\d+\s+ore\s+WorldBox\))/g],
    ["gem", /\bgem\b(?!s)(?!\s*\(Top\s+\d+\s+ore\s+WorldBox\))/g],
    ["Gold", /\bGold\b(?!\s+Dust)(?!\s*\(Top\s+\d+\s+ore\s+WorldBox\))/g],
    ["Silver", /\bSilver\b(?!\s*\(Top\s+\d+\s+ore\s+WorldBox\))/g],
    ["Stone", /\bStone\b(?!\s*\(Top\s+\d+\s+ore\s+WorldBox\))/g],
    ["Bones", /\bBones\b(?!\s*\(Top\s+\d+\s+ore\s+WorldBox\))/g],
    ["Bone", /\bBone\b(?!s)(?!\s*\(Top\s+\d+\s+ore\s+WorldBox\))/g],
    ["Ore", /\bOre\b(?!\s+Deposit)(?!\s*\(Top\s+\d+\s+ore\s+WorldBox\))/g],
  ];
  return patterns.reduce((value, [rankName, pattern]) => {
    const label = getOreRankLabel(rankName);
    return label ? value.replace(pattern, (match) => `${match} (${label})`) : value;
  }, text);
}

function formatCardEffect(card) {
  if (!card) return "Fin du duopole distribue les revenus privés. La nouvelle enchère ajoute 50 ans puis tire deux nouvelles cartes.";
  const stats = card.stats ?? "Pas de statut chiffré direct connu : effet surtout par dégâts, spawn, ressource, terrain ou économie.";
  const territoryRule = card.name === "Territoire" ? ` ${getTerritorySizingText(card)}` : "";
  return `${annotateOreMentions(card.effect)} Effet Level ${normalizeCardLevel(card.level)} : ${getResolvedCardLevelEffect(card)} Stats appliquées : ${annotateOreMentions(stats)}${territoryRule}`;
}

function getTerritorySizingText(card = null) {
  const increment = getBidIncrement(state.settings.year);
  const included = card ? getResolvedCardLevelEffect(card) : "Le Level tiré fixe la taille incluse.";
  return `Taille Territoire incluse : ${included} Le gagnant peut encore payer avant l'application : +${increment} pièce${increment > 1 ? "s" : ""} pour augmenter d'un palier, +${increment * 2} pièces pour deux paliers, dans la limite d'une très grande extension. Ce supplément est soustrait manuellement en plus du prix d'enchère.`;
}

function advanceTurn() {
  const order = state.auction.order;
  if (!order.length) return;
  const leaders = new Set(getAuctionLeaderIds());
  for (let i = 1; i <= order.length; i += 1) {
    const next = (state.auction.turnIndex + i) % order.length;
    const id = order[next];
    const ai = getAi(id);
    if (!state.auction.passed.includes(id) && !leaders.has(id) && ai && canParticipateInAuction(ai)) {
      state.auction.turnIndex = next;
      return;
    }
  }
}

function getStillBiddingIds() {
  const leaders = new Set(getAuctionLeaderIds());
  return state.auction.order.filter((id) => {
    const ai = getAi(id);
    return ai && canParticipateInAuction(ai) && !state.auction.passed.includes(id) && !leaders.has(id);
  });
}

function getCurrentBidder() {
  if (!state.auction.active || !state.auction.order.length) return null;
  const leaders = new Set(getAuctionLeaderIds());
  for (let offset = 0; offset < state.auction.order.length; offset += 1) {
    const index = (state.auction.turnIndex + offset) % state.auction.order.length;
    const id = state.auction.order[index];
    const ai = getAi(id);
    if (ai && canParticipateInAuction(ai) && !state.auction.passed.includes(id) && !leaders.has(id)) {
      state.auction.turnIndex = index;
      return ai;
    }
  }
  return null;
}

function removeFromAuction(aiId) {
  state.auction.order = state.auction.order.filter((id) => id !== aiId);
  state.auction.passed = state.auction.passed.filter((id) => id !== aiId);
  getAuctionSlots().forEach((slot) => {
    if (slot.winner === aiId) slot.winner = null;
  });
  delete state.auction.blockedSlotByAi?.[aiId];
}

function getAi(id) {
  return state.ais.find((ai) => ai.id === id);
}

function getAiName(id) {
  return getAi(id)?.name ?? id;
}

function getAliveAis() {
  return state.ais.filter((ai) => ai.alive);
}

function getUnderdogThreshold() {
  const aliveCount = Math.max(1, getAliveAis().length);
  return 1 / aliveCount;
}

function getAuctionAis() {
  return state.ais.filter((ai) => canParticipateInAuction(ai));
}

function canParticipateInAuction(ai) {
  return ai.alive || ai.ghostActive;
}

function getWorldPopulation() {
  return getAliveAis().reduce((total, ai) => total + ai.population, 0);
}

function getParticipantNamesText() {
  return state.ais.map((ai) => ai.name).join(", ");
}

function normalizeWorldMapChoice(choice) {
  return choice === "random" || WORLD_MAPS.some((map) => map.id === choice) ? choice : "random";
}

function getWorldMapChoice() {
  return normalizeWorldMapChoice(state.settings?.worldMapChoice);
}

function getWorldMapDefinition(mapId = state.worldMap?.mapId) {
  return WORLD_MAPS.find((map) => map.id === mapId) ?? null;
}

function shuffleWithRandom(items, randomFn = Math.random) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(randomFn() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function createZoneSectorLayout(count, options = {}, randomFn = Math.random) {
  if (count <= 1) return [{ label: "territoire entier", x: 0, y: 0, order: 0 }];
  if (options.linear) {
    return Array.from({ length: count }, (_, index) => {
      const edge = index === 0 ? "extrême nord" : index === count - 1 ? "extrême sud" : `bande ${index + 1} du nord vers le sud`;
      return { label: `${index + 1}/${count} — ${edge}`, x: 0, y: index, order: index };
    });
  }
  if (options.grid && count > 4) {
    const columns = Math.ceil(Math.sqrt(count));
    return Array.from({ length: count }, (_, index) => {
      const row = Math.floor(index / columns);
      const column = index % columns;
      return {
        label: `secteur ${row + 1}-${column + 1}`,
        x: column,
        y: row,
        order: index,
      };
    });
  }
  if (count === 2) {
    return randomFn() < 0.5
      ? [
        { label: "moitié nord", x: 0, y: 0, order: 0 },
        { label: "moitié sud", x: 0, y: 1, order: 1 },
      ]
      : [
        { label: "moitié ouest", x: 0, y: 0, order: 0 },
        { label: "moitié est", x: 1, y: 0, order: 1 },
      ];
  }
  if (count === 3) {
    const layouts = [
      [
        { label: "tiers nord", x: 1, y: 0 },
        { label: "tiers sud-ouest", x: 0, y: 1 },
        { label: "tiers sud-est", x: 2, y: 1 },
      ],
      [
        { label: "tiers sud", x: 1, y: 1 },
        { label: "tiers nord-ouest", x: 0, y: 0 },
        { label: "tiers nord-est", x: 2, y: 0 },
      ],
      [
        { label: "tiers ouest", x: 0, y: 1 },
        { label: "tiers nord-est", x: 1, y: 0 },
        { label: "tiers sud-est", x: 1, y: 2 },
      ],
      [
        { label: "tiers est", x: 1, y: 1 },
        { label: "tiers nord-ouest", x: 0, y: 0 },
        { label: "tiers sud-ouest", x: 0, y: 2 },
      ],
    ];
    return layouts[Math.floor(randomFn() * layouts.length)].map((sector, index) => ({ ...sector, order: index }));
  }
  return [
    { label: "quart nord-ouest", x: 0, y: 0, order: 0 },
    { label: "quart nord-est", x: 1, y: 0, order: 1 },
    { label: "quart sud-ouest", x: 0, y: 1, order: 2 },
    { label: "quart sud-est", x: 1, y: 1, order: 3 },
  ].slice(0, count);
}

function attachDirectPlacementNeighbors(placements) {
  placements.forEach((placement) => { placement.neighborIds = []; });
  const zones = new Map();
  placements.forEach((placement) => {
    if (!zones.has(placement.zone)) zones.set(placement.zone, []);
    zones.get(placement.zone).push(placement);
  });
  zones.forEach((zonePlacements) => {
    if (zonePlacements.length <= 1) return;
    zonePlacements.forEach((placement) => {
      if (zonePlacements.length === 3 && !placement.linearLayout) {
        placement.neighborIds = zonePlacements
          .filter((other) => other.aiId !== placement.aiId)
          .map((other) => other.aiId);
        return;
      }
      const candidates = zonePlacements
        .filter((other) => other.aiId !== placement.aiId)
        .map((other) => ({
          other,
          distance: ((placement.localX - other.localX) ** 2) + ((placement.localY - other.localY) ** 2),
        }));
      const nearestDistance = Math.min(...candidates.map((candidate) => candidate.distance));
      placement.neighborIds = candidates
        .filter((candidate) => candidate.distance === nearestDistance)
        .map((candidate) => candidate.other.aiId);
    });
  });
  return placements;
}

function distributeParticipantsAcrossZones(aiIds, zones, options = {}, randomFn = Math.random) {
  const shuffledAis = shuffleWithRandom(aiIds, randomFn);
  let activeZoneIndexes;
  if (shuffledAis.length === 2 && zones.length === 4 && options.oppositePairs) {
    activeZoneIndexes = options.oppositePairs[Math.floor(randomFn() * options.oppositePairs.length)];
  } else if (shuffledAis.length < zones.length) {
    activeZoneIndexes = shuffleWithRandom(zones.map((_, index) => index), randomFn).slice(0, shuffledAis.length);
  } else {
    activeZoneIndexes = zones.map((_, index) => index);
  }

  const counts = Array(zones.length).fill(0);
  if (shuffledAis.length >= activeZoneIndexes.length) {
    activeZoneIndexes.forEach((zoneIndex) => { counts[zoneIndex] = Math.floor(shuffledAis.length / activeZoneIndexes.length); });
    const remainderZones = shuffleWithRandom(activeZoneIndexes, randomFn);
    for (let index = 0; index < shuffledAis.length % activeZoneIndexes.length; index += 1) {
      counts[remainderZones[index]] += 1;
    }
  } else {
    activeZoneIndexes.forEach((zoneIndex) => { counts[zoneIndex] = 1; });
  }

  const placements = [];
  let aiIndex = 0;
  shuffleWithRandom(activeZoneIndexes, randomFn).forEach((zoneIndex) => {
    const count = counts[zoneIndex];
    const sectors = createZoneSectorLayout(count, options, randomFn);
    shuffleWithRandom(sectors, randomFn).forEach((sector) => {
      placements.push({
        aiId: shuffledAis[aiIndex],
        zone: zones[zoneIndex],
        sector: sector.label,
        position: count === 1 ? zones[zoneIndex] : `${zones[zoneIndex]} — ${sector.label}`,
        localX: sector.x,
        localY: sector.y,
        linearLayout: Boolean(options.linear),
      });
      aiIndex += 1;
    });
  });

  return {
    placements: attachDirectPlacementNeighbors(placements),
    neutralZones: zones.filter((_, index) => counts[index] === 0),
  };
}

function selectRingZones(count, randomFn = Math.random) {
  const zones = ["Nord", "Nord-Est", "Est", "Sud-Est", "Sud", "Sud-Ouest", "Ouest", "Nord-Ouest"];
  if (count >= zones.length) return zones;
  const offset = Math.floor(randomFn() * zones.length);
  if (count === 2) return [zones[offset], zones[(offset + 4) % 8]];
  if (count === 4) {
    const diagonalOffset = Math.floor(randomFn() * 2);
    return [0, 2, 4, 6].map((index) => zones[(index + diagonalOffset) % 8]);
  }
  const selected = [offset];
  while (selected.length < count) {
    const candidates = zones.map((_, index) => index).filter((index) => !selected.includes(index));
    const distances = candidates.map((index) => ({
      index,
      distance: Math.min(...selected.map((selectedIndex) => {
        const direct = Math.abs(index - selectedIndex);
        return Math.min(direct, 8 - direct);
      })),
    }));
    const maxDistance = Math.max(...distances.map((entry) => entry.distance));
    const best = shuffleWithRandom(distances.filter((entry) => entry.distance === maxDistance), randomFn)[0];
    selected.push(best.index);
  }
  return selected.map((index) => zones[index]);
}

function selectGridZones(count, randomFn = Math.random) {
  const cells = Array.from({ length: 16 }, (_, index) => ({
    row: Math.floor(index / 4),
    column: index % 4,
    label: `Île ${Math.floor(index / 4) + 1}-${(index % 4) + 1}`,
  }));
  if (count >= 16) return cells;
  if (count === 2) {
    return randomFn() < 0.5 ? [cells[0], cells[15]] : [cells[3], cells[12]];
  }
  if (count === 4) return shuffleWithRandom([cells[0], cells[3], cells[12], cells[15]], randomFn);

  const selected = [cells[Math.floor(randomFn() * cells.length)]];
  while (selected.length < count) {
    const candidates = cells.filter((cell) => !selected.includes(cell));
    const scored = candidates.map((cell) => ({
      cell,
      distance: Math.min(...selected.map((selectedCell) => (
        ((cell.row - selectedCell.row) ** 2) + ((cell.column - selectedCell.column) ** 2)
      ))),
    }));
    const maxDistance = Math.max(...scored.map((entry) => entry.distance));
    selected.push(shuffleWithRandom(scored.filter((entry) => entry.distance === maxDistance), randomFn)[0].cell);
  }
  return selected;
}

function generateWorldMapPlacements(aiIds, mapId, randomFn = Math.random) {
  if (mapId === "pangea") {
    return distributeParticipantsAcrossZones(aiIds, ["Pangée"], { grid: true }, randomFn);
  }
  if (mapId === "fracture") {
    return distributeParticipantsAcrossZones(aiIds, ["Continent Ouest", "Continent Est"], { linear: true }, randomFn);
  }
  if (mapId === "cross-four" || mapId === "quinconce" || mapId === "crossroads") {
    const prefix = mapId === "crossroads" ? "Quartier" : "Continent";
    const result = distributeParticipantsAcrossZones(
      aiIds,
      [`${prefix} Nord-Ouest`, `${prefix} Nord-Est`, `${prefix} Sud-Ouest`, `${prefix} Sud-Est`],
      { oppositePairs: [[0, 3], [1, 2]] },
      randomFn,
    );
    if (mapId === "quinconce") result.neutralZones.push("Île centrale");
    if (mapId === "crossroads") result.neutralZones.push("Croix centrale");
    return result;
  }
  if (mapId === "crown-nine") {
    const ringZones = ["Nord", "Nord-Est", "Est", "Sud-Est", "Sud", "Sud-Ouest", "Ouest", "Nord-Ouest"];
    const activeZones = selectRingZones(Math.min(aiIds.length, 8), randomFn);
    const result = distributeParticipantsAcrossZones(aiIds, activeZones, {}, randomFn);
    result.neutralZones.push("Île centrale", ...ringZones.filter((zone) => !activeZones.includes(zone)).map((zone) => `Île ${zone}`));
    result.placements.forEach((placement) => {
      placement.zone = `Île ${placement.zone}`;
      placement.position = placement.position.replace(/^(.*?)( —|$)/, "Île $1$2");
    });
    return result;
  }
  if (mapId === "archipelago-sixteen") {
    const selectedCells = selectGridZones(aiIds.length, randomFn);
    const shuffledAis = shuffleWithRandom(aiIds, randomFn);
    const selectedLabels = new Set(selectedCells.map((cell) => cell.label));
    return {
      placements: selectedCells.map((cell, index) => ({
        aiId: shuffledAis[index],
        zone: cell.label,
        sector: "île entière",
        position: cell.label,
        localX: 0,
        localY: 0,
        neighborIds: [],
      })),
      neutralZones: Array.from({ length: 16 }, (_, index) => `Île ${Math.floor(index / 4) + 1}-${(index % 4) + 1}`)
        .filter((label) => !selectedLabels.has(label)),
    };
  }
  return { placements: [], neutralZones: [] };
}

function assignCurrentWorldMapPlacements(randomFn = Math.random) {
  if (!state.worldMap) return;
  const assignment = generateWorldMapPlacements(state.ais.map((ai) => ai.id), state.worldMap.mapId, randomFn);
  state.worldMap.placements = assignment.placements;
  state.worldMap.neutralZones = [...new Set(assignment.neutralZones)];
  state.worldMap.participantCount = state.ais.length;
}

function runWorldMapDraw(randomFn = Math.random) {
  if (state.settings.year !== 0 || hasAuctionCards()) {
    showToast("Carte disponible avant la première enchère");
    return;
  }
  pushUndo();
  const choice = getWorldMapChoice();
  const map = choice === "random"
    ? WORLD_MAPS[Math.floor(randomFn() * WORLD_MAPS.length)]
    : getWorldMapDefinition(choice);
  state.worldMap = {
    mapId: map.id,
    selectionMode: choice === "random" ? "random" : "manual",
    placements: [],
    neutralZones: [],
    participantCount: state.ais.length,
    drawnAt: new Date().toISOString(),
  };
  if (state.participantDraw) assignCurrentWorldMapPlacements(randomFn);
  clearParticipantDrawPromptChecks();
  expandedPromptGroups.add("Carte du monde");
  saveAndRender();
  showToast(`${map.name} sélectionnée`);
}

function runFullyRandomInitialSetup(randomFn = Math.random) {
  if (state.settings.year !== 0 || hasAuctionCards()) {
    showToast("Configuration disponible avant la première enchère");
    return;
  }
  pushUndo();
  const participantCount = MIN_PARTICIPANTS + Math.floor(randomFn() * (MAX_PARTICIPANTS - MIN_PARTICIPANTS + 1));
  const map = WORLD_MAPS[Math.floor(randomFn() * WORLD_MAPS.length)];
  resizeParticipants(participantCount);
  state.participantCountMode = "random";
  state.settings.worldMapChoice = "random";
  state.participantDraw = null;
  state.worldMap = {
    mapId: map.id,
    selectionMode: "random",
    placements: [],
    neutralZones: [],
    participantCount,
    drawnAt: new Date().toISOString(),
  };
  clearParticipantDrawPromptChecks();
  expandedPromptGroups.add("Carte du monde");
  saveAndRender();
  showToast(`${participantCount} IA — ${map.name}`);
}

function getStartingPositionsText() {
  if (!state.worldMap?.placements?.length) return "placements en attente du Double Tirage";
  return state.worldMap.placements.map((placement) => (
    `${getAiName(placement.aiId)} : ${placement.position}`
  )).join(" ; ");
}

function buildWorldBriefingReference(ai) {
  return `La carte, l'effectif, les participants, les placements, les voisins directs et les zones centrales ont été fixés dans le MESSAGE MONDIAL — PRÉ-SIMULATION reçu avant ce briefing. Ce message public reste la référence géographique et n'est pas répété ici.`;
}

function buildWorldRulesText() {
  const map = getWorldMapDefinition();
  const neutralZones = state.worldMap?.neutralZones ?? [];
  return [
    `- Civilisations participantes (${state.ais.length}) : ${getParticipantNamesText()}.`,
    "- Chaque civilisation commence avec 10 pièces et 10 population.",
    map
      ? `- Carte ${state.worldMap.selectionMode === "random" ? "tirée aléatoirement à chances égales" : "choisie par le MJ"} : ${map.name}. ${map.description} ${map.rules}`
      : "- Carte du monde : tirage en attente parmi sept cartes équiprobables.",
    `- Positions publiques de départ, attribuées aléatoirement indépendamment de l'ordre des participants : ${getStartingPositionsText()}.`,
    "- Si plusieurs civilisations partagent une même masse continentale ou un même quartier, celui-ci est divisé en secteurs natals équilibrés. Chaque secteur reçoit uniquement le biome de sa civilisation.",
    neutralZones.length
      ? `- Zones entièrement inoccupées au départ : ${neutralZones.join(", ")}. Elles deviennent des zones centrales neutres.`
      : "- Aucune île ou masse continentale entière n'est inoccupée au départ.",
    "- Toute zone centrale neutre commence en biome Grass, reste en Grass pendant toute la simulation et reçoit des ressources rares : Adamantium, Mythril, Gems et abondance minière selon placement MJ.",
    "- À chaque nouvelle enchère, le MJ réapprovisionne toutes les zones centrales neutres en matériaux rares et minerais.",
    "- Coloniser une zone centrale ne lui transmet jamais le biome natal du colonisateur. Un changement de biome ultérieur ne modifie que le territoire natal attribué à la civilisation.",
    "- La carte Territoire ajoute seulement de la terre attachée à une île existante. Elle ne crée jamais une île isolée et la terre ajoutée reprend le biome du terrain auquel elle est reliée.",
    "- Territoire donne une petite extension de base. Supplément manuel : +1 incrément = moyenne, +2 = grande, +3 = très grande.",
    "- Dès l'an 0, chaque IA reçoit 2 choix de biome et doit sélectionner son biome de départ.",
    `- Biomes autorisés : ${BIOMES.map(formatBiomeNameWithDanger).join(", ")}.`,
    "- Diplomatie, guerres, alliances, paix, complots et rébellions naturels sont désactivés. Les bascules forcées passent par les cartes ou une décision MJ explicite.",
    "- Les colons naturels restent activés : l'expansion naturelle dépend du terrain et de WorldBox.",
    "- Le MJ peut stopper ou nettoyer une catastrophe incontrôlable si elle menace de détruire la simulation entière, sans garantie de sauvetage.",
  ].join("\n");
}

function buildAutonomousWorldboxRulesText() {
  return `Principe général :
- Ces événements peuvent arriver directement dans WorldBox si les lois mondiales correspondantes sont activées. Ils ne sont pas des cartes d'enchère et aucune IA ne les contrôle directement.
- Quand WorldBox affiche un message automatique en jeu, par exemple l'arrivée d'un mage, d'un nécromancien, d'un dragon, d'une invasion, d'une catastrophe ou d'une crise locale, ce message devient un événement officiel de simulation.
- Le MJ les observe, les note dans la mémoire, puis les annonce comme événement WorldBox, résultat naturel, catastrophe, âge ou décision de simulation.
- Une IA peut réagir politiquement ou militairement à un événement naturel, mais elle ne peut pas prétendre l'avoir déclenché sans carte, roue, tribunal ou décision MJ explicite.
- Les cartes d'enchère restent les seuls moyens garantis de forcer une catastrophe, un pouvoir, une guerre ou une alliance à un moment précis.
- Si un événement autonome menace de détruire toute la simulation, le MJ peut l'arrêter, le nettoyer ou l'encadrer, mais ce n'est pas une protection garantie.

Configuration des lois mondiales pour cette simulation :
- ACTIVÉ - Natural Disasters : catastrophes naturelles aléatoires.
- ACTIVÉ - Other Disasters : invasions, mages, monstres et crises spéciales aléatoires.
- ACTIVÉ - Ages / Age Clock : les âges changent le climat, les cultures, les nuages, les chances de catastrophes et parfois les statuts.
- DÉSACTIVÉ - Diplomacy : pas de guerres, alliances, paix ou complots naturels. Ces actions passent par les cartes d'enchère ou une décision MJ explicite.
- DÉSACTIVÉ - Rebellions : pas de révoltes naturelles de villes ni fractures politiques automatiques. Si une rébellion arrive, elle doit venir d'une carte, d'un arbitrage MJ ou d'une règle spéciale annoncée.
- DÉSACTIVÉ - Magic Rites : pas de rites magiques autonomes lancés par les rois, leaders ou religions.
- ACTIVÉ - Kingdom Expansion : les royaumes peuvent envoyer des colons et fonder des villages naturellement.
- ACTIVÉ - Civ Babies : les enfants naissent naturellement dans les villages.
- ACTIVÉ - Hunger : la nourriture compte ; famine et manque de vivres peuvent tuer ou affaiblir une civilisation.
- ACTIVÉ - Old Age : les créatures peuvent mourir de vieillesse.
- ACTIVÉ - Armies : les civilisations forment et maintiennent des armées.
- ACTIVÉ - Animal Babies et Animal Spawn : la faune peut apparaître et se reproduire naturellement.
- ACTIVÉ - Handsome Migrants : des migrants peuvent apparaître près du feu de camp des villages de 100 habitants ou moins.
- ACTIVÉ - Rat King : un groupe de plus de 20 rats proches peut déclencher une peste avec une chance annoncée par le wiki de 14%.
- ACTIVÉ - Evolution Events : les monolithes peuvent provoquer évolutions ou mutations proches.
- Les autres lois non diplomatiques restent actives ou au réglage par défaut du MJ, sauf annonce contraire. Si une loi non listée devient importante, le MJ annonce son état avant d'en tirer une conséquence stratégique.

Catastrophes naturelles possibles avec Natural Disasters :
- Earthquake : tremblement de terre naturel. Conditions indicatives : 400 population mondiale, 5 villes, tous les âges sauf Hope et Sun. Moins destructeur que l'Earthquake lancé manuellement par pouvoir.
- Heatwave : vague de chaleur. Age requis : Sun. Peut aggraver sécheresse, incendies et pression alimentaire.
- Meteorite : météorite. Conditions indicatives : 400 population mondiale, 3 villes, tous les âges sauf Hope et Sun, sauf cas spécial lié au trait Unlucky.
- Tornado : tornade. Conditions indicatives : 100 population mondiale, 3 villes, âges Tears, Ash, Chaos, Wonders ou Moon.
- Unlucky Meteorite : très faible chance de météorite ciblant une unité avec le trait Unlucky, âgée d'au moins 30 ans, si le monde a au moins 5 villes.
- Doomed Glyphs Meteorite : risque de météorite quand une unité sans trait Lucky lit un livre lié au trait de langue Doomed Glyphs.
- Spawn Cloud : permet l'apparition naturelle de certains nuages spéciaux selon les âges.

Autres catastrophes possibles avec Other Disasters :
- Ash bandits : 15 à 30 bandits en Age of Ash ; conditions indicatives : 700 population mondiale, 10 villes, moins de 11 bandits déjà présents.
- Biomass monstrosity : une structure Biomass et 20 à 30 bioblobs en Age of Ash ; conditions indicatives : 700 population, 10 villes.
- Dragon from far lands : un dragon attiré par la civilisation en Chaos, Dark ou Despair ; conditions indicatives : 3000 population, 10 villes, moins de 2 dragons.
- Wild mage : un Evil Mage apparaît ; conditions indicatives : 400 population, 5 villes, tous les âges sauf Hope, moins de 2 Evil Mages.
- Garden surprise : Super Pumpkin et 50 à 100 Lil Pumpkins autour d'un moulin ; conditions indicatives : Sun ou Wonders, 800 population, 5 villes, moulin requis.
- Greg : 30 à 55 Gregs en Age of Despair si debug/condition spéciale, mine disponible, 1000 population et 3 villes.
- Ice ones from dreams : 10 à 20 Cold Ones en Ice ou Despair ; conditions indicatives : 300 population, 5 villes.
- Mad thoughts : une ville d'au moins 50 habitants peut voir environ 20% de ses citoyens tomber en Madness ; conditions indicatives : 150 population, 5 villes, tous les âges sauf Hope et Wonders.
- Underground necromancer : un nécromancien et 16 squelettes sortent d'une mine en Dark ou Despair ; conditions indicatives : 200 population, 4 villes.
- Sudden snowman : 20 à 40 Snowmen en Age of Ice ; conditions indicatives : 100 population, 5 villes.
- Alien invasion : 5 à 10 UFOs en Age of Moon ; conditions indicatives : 1500 population, 10 villes.
- Hellspawn : 2 à 5 démons en Age of Chaos ; conditions indicatives : 300 population, 5 villes.
- Moon horrors : Tumor + 20 à 30 monstres tumoraux en Age of Moon ; conditions indicatives : 700 population, 10 villes.

Effets autonomes sans message direct :
- Fire Elementals : en Age of Sun, un feu qui s'éteint sur une tuile peut faire apparaître un Fire Elemental avec une faible chance si le monde n'en contient pas trop.
- Inner Demons : en Age of Chaos, les unités sous Rage peuvent devenir des démons ; un soldat tuant un ennemi peut aussi déclencher ce risque selon les conditions.
- Ice Babies : en Age of Despair, les enfants touchés par des particules de neige peuvent devenir des Cold Ones.

Nuages naturels importants :
- Cloud of Life : peut soutenir végétation/faune et parfois créatures selon les lois actives ; apparaît dans plusieurs âges favorables ou après certains traits Gaia.
- Snow Cloud : Ice et Despair ; neige, gel, et risque Ice Babies en Despair.
- Rain Cloud : surtout Tears ; éteint les feux, retire Burning, refroidit la lave et peut soutenir cultures/biomes.
- Lightning Cloud : Tears ; produit de la foudre.
- Ash Cloud : Ash ; peut appliquer Cough et Ash Fever.
- Magic Cloud : Wonders ; peut donner shield, powerup, spell boost, caffeinated et restaurer du mana.
- Rage Cloud : Chaos ; peut donner Rage, donc risque politique et militaire majeur.
- Hell Cloud, Lava Cloud, Acid Cloud : nuages destructeurs possibles selon catastrophe ou pouvoir ; feu, lave ou acide.

Âges WorldBox et effets stratégiques :
- Age of Hope : âge stable et favorable. Dégele le monde, bonus de loyauté/opinion, faible pression climatique. C'est l'âge de croissance et de reconstruction.
- Age of Sun : chaleur extrême. Dégel mondial et montagnes dégelées, croissance végétale désactivée, sécheresse qui tue des arbres, feu plus dangereux, Snowmen endommagés, possibilité de Fire Elementals. Très risqué pour forêts, agriculture et villes inflammables.
- Age of Dark : obscurité. Portée des armes réduite de 50%, loyauté/opinion négatives, chance de destruction des cultures lors de leur croissance. Favorise les crises internes et les menaces nocturnes.
- Age of Tears : pluie mondiale. Éteint les feux, retire souvent Burning, fait apparaître pluie/foudre, endommage certains êtres hydrophobes et tue les Fire Elementals. Peut sauver un monde brûlé mais perturber les armées.
- Age of Moon : âge nocturne/magique. Favorise certains nuages et catastrophes lunaires comme UFOs ou Moon horrors ; effets de traits moonchild actifs.
- Age of Chaos : âge de guerre et de rage. Loyauté et opinion s'effondrent fortement, Rage peut créer des démons, Hellspawn possible. Très dangereux si des armées se battent déjà.
- Age of Wonders : âge magique. Nuages magiques, biomes Candy/Enchanted favorisés, catastrophes comme Garden surprise ou tornades possibles. Bon pour croissance magique mais imprévisible.
- Age of Ice : gel mondial. Croissance très freinée, cultures menacées, hydrophobic units et Fire Elementals prennent des dégâts, Cold Ones/Snowmen possibles. Famine et ralentissement militaire probables.
- Age of Ash : maladie et cendres. Loyauté/opinion négatives, croissance de biomes affaiblie, Ash Clouds, Ash Fever/Cough, bandits et Biomass possibles. Très dangereux pour villes denses.
- Age of Despair : hiver noir. Gel, obscurité, portée réduite de 50%, cultures menacées, Snow Clouds transformant des enfants en Cold Ones, nécromanciens/Greg/dragons possibles selon conditions. L'âge suivant est forcé vers Hope.

Fréquence indicative des âges :
- Les âges durent au minimum environ 30 ans ; les durées usuelles listées par le wiki sont souvent 35-55 ans ou 30-40 ans selon l'âge.
- En moyenne sur l'Age Clock, Hope occupe environ 53.1% du temps ; Dark, Tears, Moon et Wonders environ 8.8% chacun ; Sun, Chaos et Ash environ 2.5% chacun ; Ice et Despair environ 2.0% chacun.
- Le MJ note l'âge actif quand il influence une enchère, un revenu, une guerre, une famine, une catastrophe ou une chute de population.`;
}

function getThresholdExamplesText() {
  return Array.from({ length: MAX_PARTICIPANTS - MIN_PARTICIPANTS + 1 }, (_, index) => {
    const count = MIN_PARTICIPANTS + index;
    return `${count} IA = ${formatPercent(100 / count)} %`;
  }).join(", ");
}

function formatPercent(value) {
  return Number.isInteger(value) ? String(value) : String(Math.round(value * 10) / 10);
}

function formatSigned(value) {
  return `${value >= 0 ? "+" : ""}${value}`;
}

function getPopulationPercentForAi(ai) {
  const worldPop = getWorldPopulation();
  return worldPop ? formatPercent((ai.population / worldPop) * 100) : "0";
}

function sample(items, count) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

function isBiomeUsed(biome) {
  return (state.usedBiomes ?? []).includes(biome);
}

function setBiomeUsed(biome, used) {
  state.usedBiomes = state.usedBiomes ?? [];
  if (used && !state.usedBiomes.includes(biome)) {
    state.usedBiomes.push(biome);
  }
  if (!used) {
    state.usedBiomes = state.usedBiomes.filter((item) => item !== biome);
  }
}

function drawBiomesForCurrentYear() {
  pushUndo();
  createBiomeDrawsForCurrentYear();
  expandedPromptGroups.add("Biomes");
  recordLog(`An ${state.settings.year} : tirage de 2 biomes disponibles par IA vivante.`, "Biome");
  showToast("Biomes tirés");
  saveAndRender();
}

function ensureBiomeDrawsForCurrentYearWithUndo() {
  if (hasCompleteBiomeDrawsForCurrentYear()) return;
  pushUndo();
  fillMissingBiomeDrawsForCurrentYear();
  persistState();
}

function createBiomeDrawsForCurrentYear() {
  const year = state.settings.year;
  clearBiomeChoicesForYear(year);
  const draw = {};
  const poolSource = getBiomeDrawSourcePool();
  const pool = sample(poolSource, poolSource.length);
  getAliveAis().forEach((ai) => {
    draw[ai.id] = takeBiomeOptions(pool, poolSource, 2);
  });
  state.biomeDraws = state.biomeDraws ?? {};
  state.biomeDraws[year] = draw;
  state.biomeChoices = state.biomeChoices ?? {};
  state.biomeChoices[year] = {};
}

function hasCompleteBiomeDrawsForCurrentYear() {
  const draw = state.biomeDraws?.[state.settings.year] ?? {};
  return getAliveAis().every((ai) => (draw[ai.id] ?? []).length >= 2);
}

function fillMissingBiomeDrawsForCurrentYear() {
  const year = state.settings.year;
  state.biomeDraws = state.biomeDraws ?? {};
  state.biomeDraws[year] = state.biomeDraws[year] ?? {};
  const draw = state.biomeDraws[year];
  const poolSource = getBiomeDrawSourcePool();
  const pool = sample(poolSource, poolSource.length);

  getAliveAis().forEach((ai) => {
    const existing = Array.isArray(draw[ai.id])
      ? draw[ai.id].filter((biome) => BIOMES.includes(biome)).slice(0, 2)
      : [];
    draw[ai.id] = existing.concat(takeBiomeOptions(pool, poolSource, 2 - existing.length));
  });
}

function getBiomeDrawSourcePool() {
  const available = BIOMES.filter((biome) => !isBiomeUsed(biome));
  return available.length ? available : [...BIOMES];
}

function takeBiomeOptions(pool, source, count) {
  const options = [];
  const targetCount = Math.max(0, count);
  let guard = 0;
  while (options.length < targetCount && source.length && guard < source.length * 4 + targetCount) {
    guard += 1;
    if (!pool.length) pool.push(...sample(source, source.length));
    const biome = pool.shift();
    if (!biome) break;
    if (options.includes(biome) && source.length > options.length) {
      pool.push(biome);
      continue;
    }
    options.push(biome);
  }
  return options;
}

function clearBiomeChoicesForYear(year) {
  const previousChoices = Object.values(state.biomeChoices?.[year] ?? {});
  if (state.biomeChoices?.[year]) delete state.biomeChoices[year];
  previousChoices.forEach(removeUnusedBiome);
}

function getBiomeDrawForAi(ai) {
  return state.biomeDraws?.[state.settings.year]?.[ai.id] ?? [];
}

function getBiomeChoiceForAi(ai, year = state.settings.year) {
  return state.biomeChoices?.[year]?.[ai.id] ?? "";
}

function chooseBiomeForAi(ai, biome, options = {}) {
  const year = state.settings.year;
  if (!getBiomeDrawForAi(ai).includes(biome)) return;
  state.biomeChoices = state.biomeChoices ?? {};
  state.biomeChoices[year] = state.biomeChoices[year] ?? {};
  const previous = state.biomeChoices[year][ai.id];
  state.biomeChoices[year][ai.id] = biome;
  if (previous && previous !== biome) removeUnusedBiome(previous);
  setBiomeUsed(biome, true);
  recordLog(`${ai.name} choisit le biome ${formatBiomeNameWithDanger(biome)} à l'an ${year}.`, "Biome");
  if (!options.silent) showToast(`${ai.name} : biome choisi`);
}

function removeUnusedBiome(biome) {
  const stillChosen = Object.values(state.biomeChoices ?? {})
    .some((choices) => Object.values(choices ?? {}).includes(biome));
  if (!stillChosen) setBiomeUsed(biome, false);
}

function getBiomeDetails(biome) {
  return BIOME_DETAILS[biome] ?? {
    danger: 5,
    materials: "Matériaux non renseignés.",
    effect: "Biome disponible, effet précis à arbitrer par le MJ selon WorldBox.",
    strategy: "Choix neutre par défaut.",
  };
}

function formatBiomeNameWithDanger(biome) {
  const details = getBiomeDetails(biome);
  return `${biome} (${details.danger}/20)`;
}

function formatBiomeOption(biome, index = null) {
  const details = getBiomeDetails(biome);
  const prefix = index === null ? `- ${biome}` : `${index + 1}. ${biome}`;
  return `${prefix} - danger ${details.danger}/20
Effet : ${annotateOreMentions(details.effect)}
Matériaux générés : ${annotateOreMentions(details.materials)}
Lecture stratégique : ${annotateOreMentions(details.strategy)}`;
}

function getUsedBiomesText() {
  const used = state.usedBiomes ?? [];
  return used.length ? used.map(formatBiomeNameWithDanger).join(", ") : "aucun";
}

function buildStateText() {
  const current = getCurrentBidder();
  const increment = getBidIncrement(state.settings.year);
  const passBonus = current ? getAiPassBonusLevel(current) : 0;
  const blockedSlotId = current ? state.auction.blockedSlotByAi?.[current.id] ?? null : null;
  const lines = [
    `PROMPT PRIVÉ — TOUR D'ENCHÈRE — An ${state.settings.year} — Enchère ${getAuctionPromptNumber()}`,
    `Destinataire : ${current?.name ?? "IA à qui c'est le tour"}`,
    "À envoyer uniquement à cette IA.",
    "",
    "Deux cartes sont proposées simultanément. Tu ne peux diriger qu'une carte.",
    "Si tu as été délogé d'une carte, tu ne peux pas revenir immédiatement dessus : tu dois miser sur l'autre carte ou passer.",
    "Une mise n'est pas une dépense immédiate : seule une IA encore leader à la clôture paie son enchère finale. Une IA dépassée conserve toutes les pièces de sa mise abandonnée.",
    `Après la clôture, chaque IA vivante reçoit son revenu privé : revenu de base actuel +${state.settings.baseIncome}, éventuel bonus retardataire, effets doctrinaux et bonus de passe déjà encaissé. Les anciennes révélations économiques publiques ne permettent donc pas de connaître les trésors actuels des autres IA.`,
    "Tu contrôles uniquement tes décisions d'enchère. Tu ne peux pas déplacer directement ta population, disperser des habitants, modifier un roi, choisir des statistiques ou appliquer un pouvoir dans WorldBox sans carte remportée ou autorisation explicite du MJ.",
    "",
    ...getAuctionSlots().flatMap((slot) => {
      const card = slot.card;
      if (!card) return [`CARTE ${slot.id} : aucune`];
      return [
        `CARTE ${slot.id} : ${formatCardName(card)} (${getCardCategoryLabel(card)}, ${formatCardRating(card)}, Level ${normalizeCardLevel(card.level)})`,
        card.counterSource ? `↳ Contre-pouvoir anti-${formatCardName(card.counterSource)}.` : null,
        `Effet : ${annotateOreMentions(card.effect)}`,
        `Effet du Level ${normalizeCardLevel(card.level)} : ${getResolvedCardLevelEffect(card)}`,
        `Stats : ${annotateOreMentions(card.stats ?? "Pas de statut chiffré direct connu : effet surtout par dégâts, spawn, ressource, terrain ou économie.")}`,
        card.name === "Territoire" ? getTerritorySizingText(card) : null,
        `Enchère carte ${slot.id} : ${slot.currentBid} — Leader : ${slot.winner ? getAiName(slot.winner) : "personne"} — prochaine mise minimum : ${getSlotMinimumBid(slot)}`,
        "",
      ].filter(Boolean);
    }),
    buildPendingCountersText(),
    "",
    `Incrément actuel : ${increment} pièce(s) minimum.`,
    current ? `Pièces actuelles de ${current.name} : ${current.coins}` : "Pièces actuelles : inconnues",
    blockedSlotId
      ? `Restriction actuelle : ${current.name} a été délogé de la carte ${blockedSlotId} et ne peut pas miser dessus ce tour.`
      : "Restriction actuelle : aucune carte bloquée.",
    "Si aucune carte autorisée ne peut être surenchérie avec tes pièces disponibles, le système te fera passer automatiquement faute d'argent et le compte rendu public l'indiquera.",
    "",
    buildAuctionPositionText(),
  ].filter(Boolean);
  lines.push("");
  lines.push("Tu peux enchérir sur une carte autorisée ou passer. Passer te retire entièrement du duopole.");
  lines.push(`Bonus de passe si tu passes maintenant : +${passBonus} pièce(s).`);
  lines.push("");
  lines.push("Décision : Enchérir / Passer");
  lines.push("Carte ciblée : A / B");
  lines.push("Mise : [si tu enchéris]");
  lines.push("Pourquoi :");
  lines.push("Action prévue si je gagne cette carte :");
  return lines.join("\n");
}

function buildAuctionReportPrompt() {
  const auction = state.auction;
  const slots = getAuctionSlots();
  const cardSlots = slots.filter((slot) => slot.card);
  const lines = [
    `MESSAGE MONDIAL — COMPTE RENDU D'ENCHÈRE — An ${state.settings.year} — Enchère ${getAuctionPromptNumber()}`,
    "Ne contient ni doctrine, ni population privée, ni pièces privées, ni détail de revenu.",
    "",
  ];

  if (!cardSlots.length) {
    lines.push("Aucune carte n'est en cours. Lance un duopole avant de produire un compte rendu.");
    return lines.join("\n");
  }

  lines.push(cardSlots.length > 1
    ? "Deux cartes ont été proposées simultanément selon la règle du duopole."
    : "Cette enchère historique provient de l'ancien système à carte unique.");
  lines.push("Rappel économique obligatoire : une mise dépassée n'est jamais payée. Seuls les vainqueurs finaux paient les montants indiqués ci-dessous ; tous les autres conservent les pièces qu'ils avaient seulement proposées.");
  lines.push(`Après cette enchère, chaque IA vivante reçoit séparément son revenu privé : revenu de base +${state.settings.baseIncome}, éventuel bonus retardataire dont le calcul inclut l'incrément actuel, effets doctrinaux et bonus de passe déjà encaissé.`);
  lines.push("Les montants révélés lors d'une ancienne révélation géopolitique sont historiques et ne doivent jamais être traités comme les trésors actuels. Ce compte rendu ne révèle pas les pièces privées présentes.");
  cardSlots.forEach((slot) => {
    const card = slot.card;
    if (!card) return;
    lines.push("");
    lines.push(`CARTE ${slot.id} : ${formatCardName(card)} (${getCardCategoryLabel(card)}, ${formatCardRating(card)}, Level ${normalizeCardLevel(card.level)})`);
    lines.push(`Effet : ${annotateOreMentions(card.effect)}`);
    lines.push(`Effet du Level ${normalizeCardLevel(card.level)} : ${getResolvedCardLevelEffect(card)}`);
    lines.push(`Stats / arbitrage MJ : ${annotateOreMentions(card.stats ?? "Pas de statut chiffré direct connu : effet surtout par dégâts, spawn, ressource, terrain ou économie.")}`);
    if (card.name === "Territoire") lines.push(getTerritorySizingText(card));
    if (card.counterSource) lines.push(`Note : cette carte est une réponse anti-${formatCardName(card.counterSource)}.`);
  });
  lines.push(`Le seuil de revenu faible à ${getAliveAis().length} IA restantes est à ${formatPercent(getUnderdogThreshold() * 100)}%.`);
  lines.push("");

  if (auction.closed) {
    lines.push(cardSlots.length > 1 ? "Résultats du duopole :" : "Résultat de l'enchère :");
    cardSlots.forEach((slot) => {
      const winner = slot.winner ? getAi(slot.winner) : null;
      lines.push(winner
        ? `- Carte ${slot.id} : ${winner.name} remporte ${formatCardName(slot.card)} pour ${slot.currentBid} pièce${slot.currentBid > 1 ? "s" : ""}.`
        : `- Carte ${slot.id} : personne ne remporte ${formatCardName(slot.card)}.`);
    });
  } else if (auction.active) {
    lines.push("Statut : duopole en cours.");
    cardSlots.forEach((slot) => {
      lines.push(`- Carte ${slot.id} : leader ${slot.winner ? getAiName(slot.winner) : "personne"} à ${slot.currentBid}.`);
    });
  } else {
    lines.push("Statut : duopole préparé, pas encore résolu.");
  }

  lines.push("");
  lines.push("Déroulé :");
  const timeline = getPublicAuctionReportTimeline();
  if (timeline.length) {
    timeline.forEach((entry) => lines.push(`- ${entry}`));
  } else {
    lines.push("- Aucune mise ou passe enregistrée pour l'instant.");
  }

  lines.push("");
  lines.push("Actions des gagnants avec leurs pouvoirs :");
  cardSlots.forEach((slot) => {
    const winner = slot.winner ? getAi(slot.winner) : null;
    const action = (slot.winnerAction ?? "").trim();
    lines.push(`Carte ${slot.id} — ${formatCardName(slot.card)} :`);
    lines.push(winner
      ? action || `[À compléter par le MJ : que fait ${winner.name} avec ${formatCardName(slot.card)} ?]`
      : "Aucune action : la carte n'a pas été attribuée.");
  });

  lines.push("");
  lines.push("Limite d'action : tu contrôles tes décisions dans le système d'enchère, pas directement les unités de WorldBox. Tu ne peux pas disperser une population, déplacer librement des habitants, modifier un roi, choisir des statistiques ou appliquer un pouvoir sans carte remportée ou autorisation explicite du MJ.");
  lines.push("Consigne : Mets à jour ta lecture stratégique sans inventer les trésors actuels des autres IA. Réponds avec tes conséquences politiques, diplomatiques ou militaires, et tes priorités pour la suite. Si ton territoire, tes alliances ou ta sécurité sont concernés, précise ta réaction.");

  return lines.join("\n");
}

function getPublicAuctionReportTimeline() {
  return state.log.map(sanitizePublicAuctionTimelineEntry).filter(Boolean);
}

function sanitizePublicAuctionTimelineEntry(line) {
  if (line.includes(" enchérit à ")) return line;
  if (line.startsWith("Fin :") || line.startsWith("Fin carte ")) return line;

  const autoPassMatch = line.match(/^(.+? passe automatiquement : .*?)(?:\. Il |$)/);
  if (autoPassMatch) return `${autoPassMatch[1]}.`;

  const passMatch = line.match(/^(.+?) passe et /);
  if (passMatch) return `${passMatch[1]} passe.`;

  const blockedOpenMatch = line.match(/^(.+?) ne peut pas poser la première mise/);
  if (blockedOpenMatch) return `${blockedOpenMatch[1]} ne mise pas ce tour.`;

  const blockedBidMatch = line.match(/^(.+?) ne peut pas miser maintenant/);
  if (blockedBidMatch) return `${blockedBidMatch[1]} ne mise pas ce tour.`;

  return null;
}

function buildSimulationMemoryText() {
  const memory = state.simulationMemory ?? [];
  const lines = [
    `USAGE MJ — MÉMOIRE DE SIMULATION — An ${state.settings.year} — Enchère ${getAuctionPromptNumber()}`,
    "Ne pas envoyer ce bloc aux IA : il peut contenir doctrines, pièces, populations, revenus privés et notes d'arbitrage.",
    "",
    "Objectif de cette mémoire : reconstituer toute la simulation comme une chronique épique et narrative, sans inventer de faits.",
    "Respecte les années, les vainqueurs d'enchère, les cartes, les actions du gagnant, les catastrophes, les décisions écrites et les conséquences politiques.",
    "",
    "État actuel vérifiable :",
    buildMemorySnapshot(),
    "",
    "Chronologie archivée :",
  ];

  if (memory.length) {
    memory.forEach((entry, index) => lines.push(formatMemoryEntryForPrompt(entry, index)));
  } else {
    lines.push("Aucune entrée archivée pour l'instant.");
  }

  lines.push("");
  lines.push("Consigne de restitution narrative :");
  lines.push("- Transforme cette mémoire en histoire épique claire, avec continuité politique et conséquences logiques.");
  lines.push("- Ne change aucun résultat mécanique : les montants, cartes, années, gagnants et actions appliquées restent factuels.");
  lines.push("- Si un événement est incomplet, marque-le comme incertain ou en attente de décision MJ.");

  return lines.join("\n");
}

function buildCleanSimulationMemoryText() {
  const memory = getDedupedMemoryEntries();
  const lines = [
    `USAGE MJ — MÉMOIRE NETTOYÉE — An ${state.settings.year} — Enchère ${getAuctionPromptNumber()}`,
    "Version filtrée pour reconstitution : doublons exacts retirés, moments clés mis en avant.",
    "Ne pas envoyer directement aux IA si elle contient des doctrines, pièces, populations ou notes privées.",
    "",
    "État actuel vérifiable :",
    buildMemorySnapshot(),
    "",
    "Moments clés :",
  ];

  const highlights = getMemoryHighlights(memory);
  if (highlights.length) {
    highlights.forEach((entry, index) => lines.push(`${index + 1}. An ${entry.year} - ${formatMemoryType(entry.type)} : ${shorten(entry.text, 260)}`));
  } else {
    lines.push("Aucun moment clé marqué ou détecté.");
  }

  lines.push("");
  lines.push("Chronologie nettoyée :");
  appendGroupedMemoryLines(lines, memory);
  lines.push("");
  lines.push("Consigne : reconstitue l'histoire complète en gardant les faits mécaniques exacts. Signale explicitement les zones incertaines au lieu d'inventer.");

  return lines.join("\n");
}

function buildEpicChroniclePrompt() {
  const cleanMemory = buildCleanSimulationMemoryText();
  return `USAGE MJ — CHRONIQUE ÉPIQUE — An ${state.settings.year} — Enchère ${getAuctionPromptNumber()}

Objectif :
Écris une chronique épique, claire et lisible de la simulation. Le style doit être dramatique et historique, mais les faits mécaniques doivent rester exacts.

Style cible :
Chronique médiévale sobre — les faits mécaniques portent le poids des événements sans embellissement inventé. Décris ce qui s'est passé avec la gravité qu'il mérite, sans ajouter de causes, d'intentions ou de conséquences non attestées.

Contraintes :
- Ne change aucun vainqueur d'enchère, montant, année, carte, biome, doctrine active connue, action appliquée ou résultat WorldBox.
- Tu peux omettre les cartes sans effet et les répétitions si elles n'apportent rien au récit.
- Tu dois garder les bascules majeures : biomes, doctrines, révélations, grands achats, guerres, catastrophes, chutes de capitales, morts de dirigeants, fin de partie.
- Ne révèle pas les données privées comme si elles étaient publiques dans le récit destiné aux IA. Pour une chronique MJ complète, tu peux les utiliser.
- Si un fait est incertain, écris "incertain" ou "selon arbitrage MJ".

Mémoire source :
${cleanMemory}`;
}

function getMemoryHighlights(memory = state.simulationMemory ?? []) {
  return memory.filter((entry) => entry.important || isImportantMemoryText(entry.type, entry.text));
}

function appendGroupedMemoryLines(lines, memory) {
  if (!memory.length) {
    lines.push("Aucune entrée archivée pour l'instant.");
    return;
  }

  let currentYear = null;
  memory.forEach((entry, index) => {
    if (entry.year !== currentYear) {
      currentYear = entry.year;
      lines.push("");
      lines.push(`An ${currentYear}`);
    }
    const marker = entry.important || isImportantMemoryText(entry.type, entry.text) ? " [CLÉ]" : "";
    lines.push(`${index + 1}. ${formatMemoryType(entry.type)}${marker}`);
    lines.push(entry.text);
  });
}

function buildMemorySnapshot() {
  const total = getWorldPopulation();
  const lines = [
    `- Année actuelle : ${state.settings.year}.`,
    `- Carte du monde : ${getWorldMapDefinition()?.name ?? "non tirée"}.`,
    `- Population mondiale visible : ${total}.`,
    hasAuctionCards()
      ? `- Duopole en cours : ${getAuctionSlots().filter((slot) => slot.card).map((slot) => `carte ${slot.id} ${formatCardName(slot.card)} (${getCardCategoryLabel(slot.card)}, ${formatCardRating(slot.card)}, Level ${normalizeCardLevel(slot.card.level)} : ${getResolvedCardLevelEffect(slot.card)}), enchère ${slot.currentBid}, leader ${slot.winner ? getAiName(slot.winner) : "personne"}`).join(" ; ")}.`
      : "- Duopole en cours : aucune carte.",
    state.fortuneWheel?.active
      ? `- Roue de la Fortune : active depuis l'an ${state.fortuneWheel.activeYear}, imprévisibilité ${getCurrentFortuneWheelUnpredictability()}%, ${getTotalFortuneWheelPendingTurns()} tour(s) en attente.`
      : `- Roue de la Fortune : prochaine apparition prévue An ${state.fortuneWheel?.nextYear ?? "inconnue"}, imprévisibilité ${getCurrentFortuneWheelUnpredictability()}%.`,
    `- Biomes déjà utilisés : ${getUsedBiomesText()}.`,
    `- Cartes déjà tirées : ${(state.cardHistory ?? []).length ? state.cardHistory.map(formatCardName).join(", ") : "aucune"}.`,
    "- Civilisations :",
  ];

  state.ais.forEach((ai) => {
    const profile = getProfile(ai.activeProfile);
    const civilization = getFoundingCivilization(ai.foundingCivilization);
    const status = ai.alive ? "vivante" : ai.ghostActive ? "exil actif" : ai.ghostReady ? "exil prêt" : "morte/retirée";
    lines.push(`  - ${ai.name} : ${status}, civilisation ${civilization ? civilization.name : "non choisie"}, ${ai.population} population, ${ai.coins} pièces, doctrine ${profile ? profile.name : "aucune doctrine active"}.`);
  });

  return lines.join("\n");
}

function formatMemoryEntryForPrompt(entry, index) {
  return `${index + 1}. An ${entry.year} - ${formatMemoryType(entry.type)}
${entry.text}`;
}

function buildAuctionPositionText() {
  const current = getCurrentBidder();
  const activeOthers = getActiveAuctionIdsForPrompt()
    .filter((id) => id !== current?.id)
    .map(getAiName);
  const passed = getPassedAuctionIdsForPrompt().map(getAiName);
  return [
    `À parler : ${current?.name ?? "personne"}`,
    `Encore en course (pas encore joué, ou ont déjà misé) : ${activeOthers.length ? activeOthers.join(", ") : "aucun"}`,
    `Passés : ${passed.length ? passed.join(", ") : "aucun"}`,
  ].join("\n");
}

function getActiveAuctionIdsForPrompt() {
  const activeIds = state.auction.order.filter((id) => {
    const ai = getAi(id);
    return ai && canParticipateInAuction(ai) && !state.auction.passed.includes(id);
  });
  const canonicalIds = state.ais.map((ai) => ai.id);
  return activeIds.sort((a, b) => canonicalIds.indexOf(a) - canonicalIds.indexOf(b));
}

function formatActiveAuctionNames(ids = getActiveAuctionIdsForPrompt()) {
  const canonicalIds = state.ais.map((ai) => ai.id);
  return [...ids]
    .sort((a, b) => canonicalIds.indexOf(a) - canonicalIds.indexOf(b))
    .map(getAiName)
    .join(", ");
}

function getPassedAuctionIdsForPrompt() {
  const canonicalIds = state.ais.map((ai) => ai.id);
  return [...state.auction.passed]
    .filter((id) => state.auction.order.includes(id))
    .sort((a, b) => canonicalIds.indexOf(a) - canonicalIds.indexOf(b));
}

function buildCurrentProfileReminder() {
  const ai = getCurrentBidder();
  const profile = getProfile(ai?.activeProfile);
  if (!ai) return null;
  const passLine = `Bonus de passe actuel de ${ai.name} : +${getAiPassBonusLevel(ai)} pièce${getAiPassBonusLevel(ai) > 1 ? "s" : ""} si ${ai.name} passe maintenant.`;
  if (!profile) return passLine;
  return `${passLine}
Doctrine politique secrète de ${ai.name} : ${profile.name}. Ligne : ${profile.mental} Bonus : ${profile.bonus} Malus : ${profile.malus}`;
}

function buildPendingCountersText() {
  const pending = state.pendingCounters ?? [];
  if (!pending.length) return "Contre-pouvoirs programmés : aucun.";
  return `Contre-pouvoirs programmés : ${pending
    .map((counter) => `anti-${formatCardName(counter.source)} ${counter.dueIn <= 0 ? "prêt dans la file" : `dans ${counter.dueIn} enchère(s)`}`)
    .join(", ")}.`;
}

function buildAllAisText() {
  const publicAis = getAliveAis();
  const total = getWorldPopulation();
  const anyPopulationHidden = publicAis.some((ai) => ai.hidePopulationRevealYear === state.settings.year);
  const anyEconomyHidden = publicAis.some((ai) => ai.hideEconomyRevealYear === state.settings.year);
  const lines = [
    `MESSAGE MONDIAL — RÉVÉLATION GÉOPOLITIQUE — An ${state.settings.year} — Enchère ${getAuctionPromptNumber()}`,
    "Données publiées après choix de dissimulation. Seul prompt autorisé à révéler populations et pièces.",
    "",
    `Population mondiale : ${anyPopulationHidden ? "partiellement masquée" : total}`,
    anyEconomyHidden || anyPopulationHidden ? "Certaines IA ont payé pour cacher des données. Les champs masqués sont indiqués." : "Aucune donnée masquée.",
    "",
    "Données publiques :",
  ];

  publicAis.forEach((ai) => {
    const share = total ? Math.round((ai.population / total) * 1000) / 10 : 0;
    const populationText = ai.hidePopulationRevealYear === state.settings.year
      ? "population cachée"
      : `${ai.population} humains (${share}%)`;
    const economyText = ai.hideEconomyRevealYear === state.settings.year
      ? "économie cachée"
      : `${ai.coins} pièces`;
    lines.push(
      `- ${ai.name} : ${populationText} | ${economyText}`,
    );
  });

  lines.push("");
  lines.push("Archive ces données dans ta mémoire. Aucune réponse n'est attendue de ta part à ce message.");

  return lines.join("\n");
}

function buildFortuneWheelArrivalPrompt() {
  const unpredictability = getCurrentFortuneWheelUnpredictability();
  const delay = getFortuneWheelReturnDelay();
  return `MESSAGE MONDIAL — ROUE DE LA FORTUNE — An ${state.settings.year} — Enchère ${getAuctionPromptNumber()}

⚠ Ceci n'est PAS une enchère de carte. Les règles sont différentes. Lis attentivement.

La Roue de la Fortune apparaît. Elle n'offre pas de carte de pouvoir : elle distribue des gains, des pertes, des vols de pièces ou des effets WorldBox tirés au hasard.

─── COMMENT ÇA MARCHE ───────────────────────────────────────────
Chaque civilisation peut acheter des tours : ${WHEEL_SPIN_COST} pièces par tour, autant de tours que tu peux payer. Tu peux aussi choisir de ne pas participer (0 tour). Indique ta décision au MJ.

La roue tire ${WHEEL_VISIBLE_OPTIONS} options visibles parmi ${WHEEL_EVENTS.length} effets possibles, filtrées par l'imprévisibilité du cycle, puis s'arrête sur un seul résultat. La moyenne théorique : ${formatSigned(getFortuneWheelAverageValue())} pièces brutes par tour, soit ${formatSigned(getFortuneWheelAverageValue() - WHEEL_SPIN_COST)} pièces nettes après coût.

La roue a mis ${delay} ans à revenir. Imprévisibilité actuelle : ${unpredictability}%. Plus ce pourcentage est élevé, plus les extrêmes sont probables : très gros gains, pertes lourdes, vols violents ou effets WorldBox dangereux.

─── SEUIL MINIMUM ───────────────────────────────────────────────
La Roue est capricieuse. Un seuil minimum de participation existe : ${getFortuneWheelMinimumTurns()} tours au total (2 × ${state.ais.length} civilisations initiales + 1 = ${getFortuneWheelMinimumTurns()}). Si ce seuil n'est pas atteint, la civilisation ayant acheté le moins de tours perd l'intégralité de ses pièces. En cas d'égalité, toutes les ex-aequo perdent tout.

─── RÉSOLUTION ──────────────────────────────────────────────────
Les tours se résolvent un par un en ordre démographique décroissant, avec rotation. Une civilisation ne rejoue pas immédiatement si une autre possède encore un tour en attente. Les effets économiques sont appliqués automatiquement par le MJ. Les effets WorldBox (pouvoirs, monstres, catastrophes) sont placés manuellement par le MJ : ce n'est pas toi qui les joues. Le résultat peut t'être favorable ou défavorable selon ce que la roue tire.

Réponds au MJ :
Nombre de tours achetés : [N ou 0]
Pourquoi : [justification courte]`;
}

function buildFortuneWheelParticipationPrompt() {
  const wheel = state.fortuneWheel ?? {};
  const ledger = wheel.purchaseLedger ?? {};
  const threshold = getFortuneWheelMinimumTurns();
  const totalTurns = Object.values(ledger).reduce((sum, entry) => sum + Math.max(0, Math.floor(Number(entry.turns) || 0)), 0);
  const thresholdStatus = totalTurns >= threshold ? "seuil atteint" : "seuil non atteint";
  const rows = getFortuneWheelOrder().map((ai) => {
    const entry = ledger[ai.id] ?? {
      turns: 0,
      spent: 0,
      coinsBefore: ai.coins,
      coinsAfter: ai.coins,
    };
    const turns = Math.max(0, Math.floor(Number(entry.turns) || 0));
    const spent = Math.max(0, Math.floor(Number(entry.spent) || 0));
    const coinsAfter = Number.isFinite(Number(entry.coinsAfter)) ? Number(entry.coinsAfter) : ai.coins;
    const coinsBefore = Number.isFinite(Number(entry.coinsBefore)) ? Number(entry.coinsBefore) : coinsAfter + spent;
    return `- ${ai.name} : ${turns} tour(s), ${spent} pièce(s) dépensée(s), pièces avant achat ${coinsBefore}, après achat ${coinsAfter}.`;
  });

  return [
    `MESSAGE MONDIAL — PARTICIPATION ROUE DE LA FORTUNE — An ${state.settings.year} — Enchère ${getAuctionPromptNumber()}`,
    "",
    `Seuil minimum : ${threshold} tours au total (2 × ${state.ais.length} civilisations initiales + 1 = ${threshold}).`,
    `Participation actuelle : ${totalTurns} tour(s) acheté(s) — ${thresholdStatus}.`,
    "",
    "Détail des achats :",
    ...rows,
    "",
    totalTurns >= threshold
      ? "Le seuil est passé : aucune pénalité de non-participation ne s'applique."
      : "Le seuil n'est pas passé : si la roue est résolue ainsi, la civilisation ayant acheté le moins de tours perd l'intégralité de ses pièces. En cas d'égalité, toutes les ex-aequo perdent tout.",
    "",
    "Archive ce bilan. Aucune réponse n'est attendue avant le lancement des tours.",
  ].join("\n");
}

function buildFortuneWheelResultsPrompt() {
  const results = state.fortuneWheel?.results ?? [];
  if (!results.length) return "Aucun résultat de Roue de la Fortune à annoncer.";
  return [
    `MESSAGE MONDIAL — RÉSULTATS DE LA ROUE — An ${state.settings.year} — Enchère ${getAuctionPromptNumber()} — Imprévisibilité ${getCurrentFortuneWheelUnpredictability()}%`,
    "",
    "La Roue a tourné. Voici les résultats des tours résolus jusqu'ici. Les effets économiques ont été appliqués automatiquement. Les pouvoirs WorldBox ont été ou seront placés par le MJ dans la simulation.",
    "",
    "Note : les effets négatifs (Madness, Bandit, Fire, etc.) sont une punition du destin. Le MJ les place dans la simulation — ce n'est pas le lanceur qui les déclenche volontairement.",
    "",
    ...results.map((result) => result.text),
    "",
    "Si le résultat indique explicitement que tu peux choisir une cible adverse ou l'usage d'un pouvoir WorldBox, communique cette décision immédiatement au MJ. Sans décision dans ce tour, ce droit est abandonné. Les autres effets sont appliqués directement par le MJ.",
    "",
    "Mets à jour ta mémoire avec ces résultats. Si tu as subi ou bénéficié d'un effet significatif, réponds avec ta réaction diplomatique ou stratégique.",
  ].join("\n");
}

function buildIncrementPrompt(ai = null) {
  const year = state.settings.year;
  const previous = getPreviousBidIncrement(year);
  const next = getBidIncrement(year);
  const costs = getRevealCosts(year);
  const verb = previous === next ? "reste à" : `passe de ${previous} à`;
  const recipient = ai ? `\nDestinataire : ${ai.name}` : "";
  const coinLine = ai ? `Rappel : tu as actuellement ${ai.coins} pièces.` : "Rappel : vérifie ton solde actuel avant de choisir une dissimulation.";
  return `PROMPT PRIVÉ — PALIER D'ENCHÈRE ET DISSIMULATION — An ${year} — Enchère ${getAuctionPromptNumber()}${recipient}
${ai ? `À envoyer uniquement à ${ai.name}.` : ""}

${coinLine}

L'incrément minimum ${verb} ${next} pièce(s).
La première mise doit être ≥ ${next} pièce(s). Chaque surenchère doit dépasser le leader d'au moins ${next} pièce(s).
Ce n'est pas un multiple : tu peux ouvrir à 37 ; la mise suivante sera alors au minimum ${37 + next}.

Avant la révélation publique, tu peux payer pour cacher des données :
- Cacher ton économie (pièces)  : ${costs.economy} pièces
- Cacher ta population           : ${costs.population} pièce(s)
- Cacher les deux                : ${costs.both} pièces

Tu ne peux choisir qu'une dissimulation que ton solde actuel permet de payer. Sinon, la donnée concernée doit être révélée.

Réponds en secret au MJ :
Économie : cacher / révéler
Population : cacher / révéler
Pourquoi : [justification courte]`;
}

function buildTribunalPrompt() {
  const order = getTribunalOrder();
  const first = order[0];
  const orderText = order.length ? order.map((ai) => ai.name).join(" → ") : "aucune IA vivante";
  return `MESSAGE MONDIAL — TRIBUNAL DES NATIONS — An ${state.settings.year} — Enchère ${getAuctionPromptNumber()}

Un tribunal s'ouvre. Chaque civilisation vivante accuse à son tour une autre d'une action jugée injuste, dangereuse ou déloyale.

Règles :
- Ordre de passage (population décroissante) : ${orderText}
- L'accusateur choisit librement l'IA accusée.
- L'accusateur décrit le crime commis.
- L'accusateur propose une punition réalisable : sanction économique (pièces) OU intervention WorldBox (pouvoir, monstre, ressource, terrain, statut).
- Les IA non directement impliquées votent pour ou contre.
- Le MJ applique ou rejette selon le vote et l'équilibre de la partie.

Le MJ envoie maintenant à ${first?.name ?? "[IA]"} son prompt d'accusation.`;
}

function buildTribunalAccusationPrompt(ai) {
  return buildTribunalAccusationTemplate(ai.name);
}

function buildTribunalAccusationTemplate(accuserName) {
  return `PROMPT PRIVÉ — TRIBUNAL : TON ACCUSATION — An ${state.settings.year} — Enchère ${getAuctionPromptNumber()}
Accusateur : ${accuserName}
À envoyer uniquement à ${accuserName}.

C'est à toi de présenter ton accusation. Envoie ta réponse en privé au MJ.

Accusé : [autre IA vivante au choix ; tu ne peux pas t'accuser toi-même]
Crime : [description de l'acte]
Punition proposée : [sanction économique OU intervention WorldBox — doit être réalisable]`;
}

function getTribunalOrder() {
  return getAliveAis().sort((a, b) => b.population - a.population || a.name.localeCompare(b.name));
}

function buildBiomeGlobalPrompt() {
  const isInitial = state.settings.year === 0;
  const lines = [
    `MESSAGE MONDIAL — ${isInitial ? "CIVILISATIONS ET BIOMES INITIAUX" : "BIOMES"} — An ${state.settings.year} — Enchère ${getAuctionPromptNumber()}`,
    "Les biomes choisis sont annoncés ci-dessous.",
    isInitial
      ? "Les civilisations fondatrices définitives, jusque-là privées, sont révélées publiquement en même temps."
      : "Les civilisations fondatrices restent rappelées avec les nouveaux biomes.",
    "REMPLACEMENT TOTAL : chaque nouveau biome efface et remplace entièrement le biome précédent du territoire natal. Les propriétés, matériaux et effets de l'ancien biome disparaissent ; il n'y a jamais de superposition.",
    "Le biome choisi n'affecte que le territoire natal attribué au départ : île entière ou secteur partagé selon la carte. Les colonies conservent toujours le biome du terrain sur lequel elles ont été fondées.",
    "Toute île ou masse continentale entièrement inoccupée au départ devient une zone centrale définitivement en biome Grass. La coloniser ne lui transmet pas le biome natal.",
    "Un futur changement de biome du territoire natal ne modifiera jamais les zones centrales ni les colonies extérieures.",
    "Les biomes choisis sont retirés du pool. Les options non choisies y retournent et restent disponibles.",
    "",
  ];

  getAliveAis().forEach((ai) => {
    const choice = getBiomeChoiceForAi(ai);
    const civilization = getFoundingCivilization(ai.foundingCivilization);
    lines.push("");
    lines.push(`${ai.name} :`);
    lines.push(`  Civilisation fondatrice : ${civilization ? civilization.name : "choix non annoncé / en attente MJ"}.`);
    lines.push("  Biome choisi :");
    if (choice) {
      const details = getBiomeDetails(choice);
      lines.push(`  ${choice} — danger ${details.danger}/20`);
      lines.push(`  Effet : ${annotateOreMentions(details.effect)}`);
      lines.push(`  Matériaux générés : ${annotateOreMentions(details.materials)}`);
      lines.push(`  Lecture stratégique : ${annotateOreMentions(details.strategy)}`);
    } else {
      lines.push("  Choix non annoncé / en attente MJ.");
    }
  });

  lines.push("");
  lines.push("Archive ces données dans ta mémoire. Aucune réponse n'est attendue à ce message.");

  return lines.join("\n");
}

function buildBiomeChoicePrompt(ai) {
  const options = getBiomeDrawForAi(ai);
  const isInitial = state.settings.year === 0;
  const optionText = options.length
    ? options.map((biome, index) => formatBiomeOption(biome, index)).join("\n\n")
    : "Aucun biome disponible : demande au MJ un arbitrage manuel.";

  return `PROMPT PRIVÉ — ${isInitial ? "CHOIX INITIAL DE BIOME" : "ÉVÉNEMENT BIOME"} — An ${state.settings.year} — Enchère ${getAuctionPromptNumber()}
Destinataire : ${ai.name}
À envoyer uniquement à ${ai.name}.
Les options non choisies restent invisibles pour les autres IA.

Choisis un seul biome parmi les deux options. ${isInitial ? "Ce sera le biome de ton territoire natal." : "Le biome choisi efface et remplace entièrement le biome actuel de ton territoire natal."}

REMPLACEMENT TOTAL : ${isInitial ? "un futur choix de biome remplacera celui-ci" : "tu perds toutes les propriétés, matériaux et effets de ton ancien biome ; ils ne se cumulent pas avec le nouveau"}.
Important : le biome s'applique uniquement au territoire natal qui t'a été attribué dans le message pré-simulation : île entière ou secteur partagé. Il ne s'étend jamais au reste d'une masse continentale partagée ni à tes colonies.
Toute zone entièrement inoccupée au départ devient une zone centrale en biome Grass pendant toute la partie. Y fonder une colonie ne transforme pas Grass en ton biome natal, et changer plus tard ton biome natal ne modifie jamais cette zone.
Le biome choisi est retiré du pool pour les prochains tirages. L'option non choisie y retourne.
${isInitial ? "Lors de l'annonce mondiale suivante, ton biome choisi et ta civilisation fondatrice définitive seront révélés publiquement. Tes options non choisies resteront secrètes." : ""}

Options :
${optionText}

La note de danger mesure le risque systémique du biome : instabilité, hostilité environnementale, capacité à amplifier une crise, ou avantage militaire/économique susceptible d'attirer une attaque. Elle ne signifie pas forcément que le biome est mauvais.

Réponds seulement :
Biome choisi :
Pourquoi :
Plan stratégique :`;
}

function getAuctionEffectDetailsForAi(ai, breakdown) {
  const details = [];
  const costs = getRevealCosts(state.settings.year);
  if (ai.hideEconomyRevealYear === state.settings.year) {
    details.push(`Révélation géopolitique : dissimulation de l'économie (-${costs.economy} pièces)`);
  }
  if (ai.hidePopulationRevealYear === state.settings.year) {
    details.push(`Révélation géopolitique : dissimulation de la population (-${costs.population} pièces)`);
  }
  (breakdown?.auctionDoctrineLines ?? ai.auctionDoctrineLines ?? []).forEach((line) => {
    details.push(`Doctrine : ${line}`);
  });
  if (!details.length && breakdown?.effectDelta) {
    details.push("événement MJ ou effet de carte/doctrine appliqué pendant l'enchère");
  }
  return details;
}

function buildPostIncomeStatePrompt(ai) {
  const profile = getProfile(ai.activeProfile);
  const popPercent = getPopulationPercentForAi(ai);
  const bd = ai.lastIncomeBreakdown;
  const passDelta = bd?.passDelta ?? 0;
  const purchaseDelta = bd?.purchaseDelta ?? 0;
  const effectDelta = bd?.effectDelta ?? 0;
  const effectDetails = getAuctionEffectDetailsForAi(ai, bd);
  const otherAuctionDelta = bd?.otherAuctionDelta ?? 0;
  const doctrineLines = bd?.doctrineLines ?? [];

  const lines = [
    `PROMPT PRIVÉ — ÉTAT APRÈS REVENUS — An ${state.settings.year} — Enchère ${getAuctionPromptNumber()}`,
    `Destinataire : ${ai.name}`,
    `À envoyer uniquement à ${ai.name}.`,
    "",
    "─── TES CHIFFRES ────────────────────────────────────────────────",
    `Population : ${ai.population} (${popPercent}% du monde)`,
    `Pièces : ${ai.coins}`,
    "",
    "Détail de l'enchère :",
    `  - Passes reçues  : ${formatSigned(passDelta)}`,
    `  - Achats de cartes : ${formatSigned(purchaseDelta)}`,
    ...(effectDelta ? [`  - Effet MJ / carte : ${formatSigned(effectDelta)}${effectDetails.length ? ` — ${effectDetails.join(" ; ")}` : ""}`] : []),
    ...(otherAuctionDelta ? [`  - Autres variations : ${formatSigned(otherAuctionDelta)}`] : []),
    `  = Solde avant revenus : ${bd ? bd.coinsBeforeIncome : ai.coins}`,
    "",
    "Revenus appliqués :",
    `  + Revenu de base : +${bd ? bd.baseIncome : state.settings.baseIncome}`,
    ...(bd?.underdogBonus ? [`  + Bonus retardataire : +${bd.underdogBonus}`] : []),
    ...(bd && (bd.doctrineEffect !== 0 || doctrineLines.length) ? [
      `  + Effet doctrine — ${profile ? profile.name : "Doctrine"} :`,
      ...(
        doctrineLines.length
          ? doctrineLines.map((line) => `      ${line}`)
          : [`      Effet net : ${formatSigned(bd.doctrineEffect)}`]
      ),
      `      = Effet doctrine net : ${formatSigned(bd.doctrineEffect)}`,
    ] : []),
    `  = Revenu net appliqué : ${bd ? formatSigned(bd.incomeApplied) : "+0"}`,
    "",
    `Nouveau solde : ${bd ? bd.finalCoins : ai.coins} pièces`,
    "",
    "─── TA DOCTRINE ─────────────────────────────────────────────────",
    `Doctrine active : ${profile ? profile.name : "aucune"}`,
    `Ligne politique : ${profile ? profile.mental : "—"}`,
    `Bonus : ${profile ? profile.bonus : "—"}`,
    `Malus : ${profile ? profile.malus : "—"}`,
    "",
    `Bonus de passe actuel : +${getAiPassBonusLevel(ai)} (plancher ${getPassFloor()}, plafond ${getPassCeiling()})`,
    "",
    "─── ÉTAT MONDIAL ────────────────────────────────────────────────",
    "Prochaine enchère dans 50 ans.",
    `Incrément actuel : ${getBidIncrement(state.settings.year)} pièce(s).`,
    `Événements dans les 250 prochaines années : ${getUpcomingEventsText(250)}`,
    "",
    "─── CONSIGNE ────────────────────────────────────────────────────",
    "Archive ces chiffres dans ta mémoire. Réponds avec :",
    "1. Ta position démographique et économique réelle (pas d'approximation).",
    "2. Ta menace principale identifiée et ta réponse prévue.",
    "3. La carte ou catégorie prioritaire pour le prochain duopole, avec le montant maximum que tu acceptes de payer.",
  ];

  return lines.join("\n");
}

function buildPostIncomeMemorySnapshot() {
  const total = getWorldPopulation();
  const slots = getAuctionSlots();
  const lines = [
    `USAGE MJ — SNAPSHOT APRÈS REVENUS — An ${state.settings.year} — Enchère ${getAuctionPromptNumber()}`,
    "Entrée automatique créée quand le MJ clique sur Fin d'enchère. Elle contient les données privées nécessaires à la mémoire complète.",
    "",
    "Duopole clôturé :",
    ...slots.flatMap((slot) => {
      const winner = slot.winner ? getAi(slot.winner) : null;
      return [
        slot.card
          ? `- Carte ${slot.id} : ${formatCardName(slot.card)} (${getCardCategoryLabel(slot.card)}, ${formatCardRating(slot.card)}, Level ${normalizeCardLevel(slot.card.level)}). Effet du niveau : ${getResolvedCardLevelEffect(slot.card)}`
          : `- Carte ${slot.id} : aucune.`,
        winner
          ? `  Vainqueur : ${winner.name} pour ${slot.currentBid} pièce${slot.currentBid > 1 ? "s" : ""}.`
          : "  Vainqueur : aucun.",
      ];
    }),
    `- Résumé revenus : ${state.lastIncomeSummary || "non calculé"}`,
    `- Population mondiale visible : ${total}.`,
    "",
    "Civilisations après revenus :",
  ];

  state.ais.forEach((ai) => {
    const profile = getProfile(ai.activeProfile);
    const civilization = getFoundingCivilization(ai.foundingCivilization);
    const status = ai.alive ? "vivante" : ai.ghostActive ? "exil actif" : ai.ghostReady ? "exil prêt" : "morte/retirée";
    const share = getPopulationPercentForAi(ai);
    const passBonus = getAiPassBonusLevel(ai);
    lines.push("");
    lines.push(`${ai.name} :`);
    lines.push(`- Statut : ${status}.`);
    lines.push(`- Population : ${ai.population} (${share}% du monde).`);
    lines.push(`- Pièces : ${ai.coins}.`);
    lines.push(`- Bonus de passe : +${passBonus}.`);
    lines.push(`- Civilisation fondatrice : ${civilization ? civilization.name : "non choisie"}.`);
    lines.push(`- Doctrine active : ${profile ? profile.name : "aucune"}.`);
    lines.push(`- Soldats : ${ai.soldiers ?? 0}. Colonies ext. : ${ai.colonies ?? 0}. Population du territoire natal : ${ai.homePopulation ?? 0}.`);
    if (ai.lastIncomeBreakdown) {
      const bd = ai.lastIncomeBreakdown;
      const effectDetails = getAuctionEffectDetailsForAi(ai, bd);
      lines.push("- Détail économique :");
      lines.push(`  • Solde début enchère : ${bd.coinsAtAuctionStart}`);
      lines.push(`  • Variation enchère : ${formatSigned(bd.auctionDelta)}`);
      if (bd.effectDelta) {
        lines.push(`    - Effet MJ / carte : ${formatSigned(bd.effectDelta)}${effectDetails.length ? ` — ${effectDetails.join(" ; ")}` : ""}`);
      }
      lines.push(`  • Solde avant revenus : ${bd.coinsBeforeIncome}`);
      lines.push(`  • Revenu base : +${bd.baseIncome}`);
      if (bd.underdogBonus) lines.push(`  • Bonus retardataire : +${bd.underdogBonus}`);
      if (bd.doctrineEffect) lines.push(`  • Effet doctrine : ${formatSigned(bd.doctrineEffect)}`);
      lines.push(`  • Revenu appliqué : ${formatSigned(bd.incomeApplied)}`);
      lines.push(`  • Solde final : ${bd.finalCoins}`);
    }
  });

  lines.push("");
  lines.push("Lecture mémoire : cet état fait foi pour les revenus privés et les chiffres post-enchère de l'année.");
  return lines.join("\n");
}

function buildFoundingCivilizationOptionsText(ai) {
  const options = getFoundingCivilizationDrawForAi(ai);
  return options.map((civilization, index) => `${index + 1}. ${civilization.name}
   Description : ${civilization.description}
   Avantages : ${civilization.advantages}
   Inconvénients : ${civilization.disadvantages}`).join("\n\n");
}

function buildPrompt(ai) {
  return `PROMPT PRIVÉ — BRIEFING INITIAL — An 0 — Enchère 0
Destinataire : ${ai.name}
À envoyer uniquement à ${ai.name}. Ce message est ta référence pour toute la partie.

Tu es ${ai.name}, représentant d'une civilisation dont le peuple fondateur doit encore être choisi dans la simulation stratégique WorldBox Beta.

─── RÔLE ET COMMUNICATION ───────────────────────────────────────
- Tu contrôles uniquement ta civilisation.
- Le MJ est l'arbitre : il applique les effets dans WorldBox, valide les actions et peut en refuser une si elle est impossible.
- Tu proposes des décisions stratégiques. Tu n'inventes pas de pouvoir, de carte ou de guerre hors des règles reçues.
- MESSAGE MONDIAL : information publique connue de toutes les IA.
- PROMPT PRIVÉ / MJ PERSONNEL : information envoyée à toi seul. Les autres IA ne la connaissent pas.
- En cas de contradiction entre deux messages, le plus récent fait autorité.
- Des événements spéciaux (biomes, doctrines, événements imprévus) apparaîtront au fil de la partie. Leurs règles te seront expliquées au moment où ils surviendront.

─── CHOIX DE CIVILISATION DE DÉPART ─────────────────────────────
Deux des quatre civilisations fondatrices de WorldBox t'ont été attribuées aléatoirement. Choisis-en une seule. L'autre option est définitivement abandonnée pour ta civilisation.

Les avantages et inconvénients ci-dessous sont des tendances stratégiques : l'évolution réelle dépendra aussi du biome, des ressources, des cultures, des dirigeants et des événements WorldBox.
Tes deux options et ta décision restent privées pendant le choix. Ta civilisation définitive sera révélée publiquement à toutes les IA en même temps que les biomes initiaux. L'option abandonnée ne sera jamais révélée.

${buildFoundingCivilizationOptionsText(ai)}

Réponds d'abord au MJ :
Civilisation choisie : [numéro et nom]
Pourquoi : [justification stratégique courte]

─── CARTE ET MONDE ──────────────────────────────────────────────
${buildWorldBriefingReference(ai)}

Événements WorldBox sans intervention du créateur :
${buildAutonomousWorldboxRulesText()}

─── SYSTÈME D'ENCHÈRES ──────────────────────────────────────────
- Deux cartes de pouvoir sont proposées simultanément. Chaque carte commence à 0 pièce et possède son propre leader.
- Chaque carte est tirée avec un Level 1, 2 ou 3. Distribution normale : Level 1 = 70%, Level 2 = 25%, Level 3 = 5%.
- Le Level quantifie exactement la puissance utilisable. L'effet précis du Level tiré est écrit dans chaque prompt ; tu ne peux pas demander l'effet d'un autre Level.
- Les Level 3 sont volontairement rares et peuvent produire des effets stratégiques ou catastrophiques majeurs.
- Portée standard des effets de zone : Level 1 = une province (une ville et son territoire immédiat), Level 2 = une région (plusieurs provinces voisines), Level 3 = une île entière.
- Les ressources utilisent cette portée territoriale : le MJ répartit raisonnablement la ressource dans la zone sans compter chaque minerai généré.
- Les créatures faibles sont nombreuses dès le Level 1 ; les créatures majeures apparaissent en nombres plus faibles. Le prompt indique toujours le nombre exact à faire apparaître.
- Les pluies de traits utilisent trois catalogues distincts : 116 traits de population, 40 traits de religion et 152 traits nommés de sous-espèce. Un même tirage ne contient jamais deux fois le même trait.
- Lorsqu'une pluie de traits apparaît, les noms exacts tirés sont inscrits dans la carte, les prévisions MJ et les prompts. Le MJ applique uniquement cette liste.
- Tu débutes avec 10 pièces.
- L'ordre de parole suit la population décroissante : les civilisations les plus peuplées parlent en premier.
- À ton tour : tu choisis une carte autorisée, tu enchéris au-dessus de son leader actuel, ou tu passes.
- Une civilisation ne peut être leader que d'une seule carte à la fois.
- Si tu es délogé d'une carte, tu ne peux pas surenchérir immédiatement sur cette même carte. Tu dois miser sur l'autre carte ou passer.
- Si tu prends la tête de l'autre carte puis que tu en es délogé, tu peux de nouveau revenir sur la première.
- Passer : tu quittes entièrement le duopole et tu reçois immédiatement ton bonus de passe personnel.
- À la clôture, chaque leader remporte sa carte et paie son enchère finale. Deux civilisations différentes peuvent donc payer et gagner pendant la même enchère.
- Enchérir ne dépense pas immédiatement les pièces : une mise est seulement une proposition. Si tu es dépassé, tu ne paies rien et ton trésor reste intact. Seuls les leaders finaux paient.
- Enchérir ne donne pas de pièces : cela tente de gagner la carte ciblée et restaure ton bonus de passe de +1.
- Passer verse immédiatement ton bonus de passe. À la fin de l'enchère, toutes les IA vivantes reçoivent en privé le revenu de base, puis les éventuels bonus retardataires et effets doctrinaux.
- Une révélation géopolitique ne montre qu'un état historique à une année précise. Entre deux révélations, n'utilise jamais un ancien montant public comme trésor actuel d'un rival.
- Si une carte hostile ou destructive de puissance 16/20 ou plus apparaît, le MJ peut programmer dans les 1 à 3 enchères suivantes un contre-pouvoir capable de la limiter, nettoyer ou compenser.

Incrément minimum (surenchère minimale, pas un multiple obligatoire) :
  An 0–249 = 1 pièce | 250–499 = 5 | 500–749 = 10 | 750–999 = 15 | 1000+ = 20
  Exemple à l'an 500 : incrément = 10. Tu peux ouvrir à 37 ; la mise suivante doit être au moins 47.

Bonus de passe personnel :
  Commence à ${getPassCeiling()} pièces. Descend de 1 à chaque passe (plancher : ${getPassFloor()}). Remonte de +1 quand tu enchéris (plafond : ${getPassCeiling()}). Le montant encaissé est celui du moment exact où tu passes.

─── REVENUS ─────────────────────────────────────────────────────
- Chaque IA vivante reçoit un revenu de base à la fin de chaque enchère.
- Les IA sous le seuil démographique faible reçoivent un bonus retardataire progressif.
  Seuil faible = 100 / nombre d'IA vivantes.
  Formule : déficit = (seuil - ta part) / seuil. Bonus = arrondi((revenu base + bonus MJ + incrément actuel) × déficit).
- Détail de tes revenus après chaque enchère : tu recevras un prompt privé dédié.

─── RÈGLES D'ACTION ─────────────────────────────────────────────
- Ton seul contrôle direct porte sur le système d'enchère : enchérir, passer, choisir une cible et proposer l'usage d'une carte que tu remportes.
- Tu ne contrôles pas directement les habitants, armées, rois, villes ou statistiques dans WorldBox. Tu ne peux pas ordonner librement de disperser une population, déplacer des habitants, tuer ou remplacer un roi, modifier son autorité, choisir des traits ou changer des statistiques.
- Toute modification de WorldBox doit provenir d'une carte remportée, de la Roue, du Tribunal, d'un événement naturel ou d'une autorisation explicite du MJ.
- Propose uniquement des actions réalisables dans WorldBox et strictement couvertes par l'effet reçu.
- Tu ne peux utiliser une carte que si tu la remportes aux enchères, ou si le MJ te l'autorise explicitement.
- Tu peux promettre une action si tu gagnes, mais elle ne s'applique que si tu remportes réellement la carte.
- La carte Territoire doit préciser : île ciblée, bord d'attache, intention stratégique, et supplément payé si tu veux agrandir la terre ajoutée.
- Les armes biologiques, mentales ou apocalyptiques sont des risques systémiques : elles peuvent tuer la cible, mais aussi déstabiliser la partie.
- Tu dois viser la victoire finale, mais les catastrophes incontrôlables peuvent être stoppées par le MJ si elles menacent de détruire la simulation.

─── FORMAT DE RÉPONSE À CHAQUE TOUR ────────────────────────────
Décision : Enchérir / Passer
Carte ciblée : A / B
Mise : [nombre de pièces si tu enchéris]
Pourquoi : [justification stratégique courte]
Action prévue si je gagne cette carte : [cible et usage exact dans WorldBox]

Pour ce briefing initial, réponds uniquement avec ton choix de civilisation fondatrice et sa justification. N'envoie aucune décision d'enchère avant de recevoir un PROMPT PRIVÉ — TOUR D'ENCHÈRE.

Tu recevras après ce briefing les Mémoires des simulations antérieures.
Ces archives ne sont pas des règles : elles sont la mémoire du monde dans lequel tu entres.
Lis-les. Ce que les civilisations précédentes ont appris au prix de leur existence t'appartient désormais.`;
}

function buildProfilesRulebook() {
  return PROFILE_DECK.map((profile, index) => {
    return `${index + 1}. ${profile.name} - Ligne politique : ${profile.mental} Bonus : ${profile.bonus} Malus : ${profile.malus}`;
  }).join("\n");
}

function copyLog() {
  const report = buildAuctionReportPrompt();
  archiveMemoryIfNew("Compte rendu d'enchère", report, { important: state.auction.closed });
  state.lastAuctionReport = report;
  persistState();
  copyText(report, "Compte rendu copié");
  markPromptCopied(getReportPromptKey());
}

function copyState() {
  copyText(buildStateText(), "État copié");
}

function copySimulationMemory() {
  copyText(buildSimulationMemoryText(), "Mémoire complète copiée");
}

function copyCleanSimulationMemory() {
  copyText(buildCleanSimulationMemoryText(), "Mémoire nettoyée copiée");
}

function copyEpicChroniclePrompt() {
  copyText(buildEpicChroniclePrompt(), "Prompt épique copié");
}

function copyFortuneWheelArrivalPrompt() {
  const text = buildFortuneWheelArrivalPrompt();
  archiveMemoryIfNew("Roue de la fortune", text, { important: true });
  copyText(text, "Annonce roue copiée");
}

function copyFortuneWheelResultsPrompt() {
  copyText(buildFortuneWheelResultsPrompt(), "Résultats roue copiés");
}

function copyChartsTextSupport() {
  copyText(buildChartsTextSupport(), "Support écrit des graphiques copié");
}

function copyAllAis() {
  const text = buildAllAisText();
  archiveMemoryIfNew("Révélation géopolitique", text, { important: true });
  copyText(text, "Toutes les IA copiées");
}

function copyIncrementPrompt(ai = null) {
  const text = buildIncrementPrompt(ai);
  archiveMemoryIfNew("Palier d'enchère", text, { important: true });
  copyText(text, `Prompt palier${ai ? ` ${ai.name}` : ""} copié`);
}

function copyTribunalPrompt() {
  const text = buildTribunalPrompt();
  archiveMemoryIfNew("Message mondial", text, { important: true });
  copyText(text, "Prompt tribunal copié");
}

function copyBiomePrompt() {
  const text = buildBiomeGlobalPrompt();
  archiveMemoryIfNew("Message mondial", text, { important: true });
  copyText(text, "Annonce biomes copiée");
}

function copyText(text, message) {
  navigator.clipboard?.writeText(text).then(
    () => showToast(message),
    () => window.prompt("Copie :", text),
  );
}

function resetAll() {
  if (!confirm("Réinitialiser cette appli d'enchère temps réel ?")) return;
  pushUndo();
  localStorage.removeItem(STORAGE_KEY);
  deleteStateFromServer();
  state = loadState();
  handleAgeMilestones();
  saveAndRender();
}

function pushUndo() {
  undoStack.push(JSON.stringify(state));
  if (undoStack.length > 40) undoStack.shift();
}

function undo() {
  const previous = undoStack.pop();
  if (!previous) {
    showToast("Rien à annuler");
    return;
  }
  state = JSON.parse(previous);
  persistState();
  showToast("Action annulée");
  render();
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => els.toast.classList.remove("show"), 1500);
}
