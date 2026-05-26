const STORAGE_KEY = "worldbox-realtime-auction-v5";
const MIN_PARTICIPANTS = 2;
const MAX_PARTICIPANTS = 8;
const DEFAULT_REPRESENTATIVE_NAMES = ["Codex", "Kiwi", "Gemini", "DeepSeek", "Nova", "Atlas", "Orion", "Vega"];
const STARTING_POSITION_LABELS = [
  "secteur sud-ouest",
  "secteur sud-est",
  "secteur nord-ouest",
  "secteur nord-est",
  "secteur ouest central",
  "secteur est central",
  "secteur nord central",
  "secteur sud central",
];
const DUEL_POSITION_LABELS = ["moitié ouest", "moitié est"];

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

POWERS.forEach((power) => {
  power.danger = ORE_POWER_DANGERS[power.name] ?? power.danger;
  power.effect = DETAILED_EFFECTS[power.name] ?? power.effect;
  power.stats = EFFECT_STATS[power.name] ?? "Pas de statut chiffré direct connu : effet surtout par dégâts, spawn, ressource, terrain ou économie.";
});

const DEFAULT_AIS = Array.from({ length: 4 }, (_, index) => createDefaultAi(index));

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
    ghostReady: false,
    ghostActive: false,
    ghostUsed: false,
    hideEconomyRevealYear: null,
    hidePopulationRevealYear: null,
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
    bonus: "+6 pièces chaque fois qu'une carte Ressource est adjugée, qu'il l'achète ou non.",
    malus: "-3 pièces de revenu par tranche de 1000 soldats dans son armée : l'armée absorbe sa capacité productive.",
  },
  {
    id: "sage",
    name: "L'Humaniste",
    mental: "Une civilisation forte protège les vivants avant de chercher la domination.",
    bonus: "+4 pièces quand une carte douce ou réparatrice apparaît : danger 5 ou moins, ou Contre-pouvoir.",
    malus: "-6 pièces quand il remporte une carte de Destruction ou de Créature : sa base politique rejette l'escalade brutale.",
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
    bonus: "+12 pièces lorsqu'il achète une carte Alliance.",
    malus: "-6 pièces chaque fois qu'une guerre est déclarée, même sans lui : la guerre décrédibilise son projet d'ordre commun.",
  },
  {
    id: "scholar",
    name: "Le Traditionaliste",
    mental: "Ce qui a déjà fonctionné doit guider ce qui vient ensuite.",
    bonus: "+4 pièces chaque fois qu'une carte déjà jouée réapparaît.",
    malus: "-4 pièces quand une carte totalement nouvelle de danger 16 ou plus apparaît : la rupture historique fragilise son récit politique.",
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
    bonus: "+8 pièces chaque fois qu'il remporte une carte de Destruction.",
    malus: "-4 pièces chaque fois qu'il passe : reculer coûte cher à son image de force.",
  },
  {
    id: "vagabond",
    name: "Le Projet Colonial",
    mental: "Une nation qui ne s'étend pas se condamne à subir la géographie des autres.",
    bonus: "+5 pièces par colonie possédée hors de son île principale, jusqu'à 3 colonies comptées.",
    malus: "-5 pièces si son île principale dépasse 75% de sa population totale : son idéologie exige une présence extérieure.",
  },
];

let state = loadState();
let undoStack = [];
let expandedPromptGroups = new Set();

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
  participantNamesGrid: document.querySelector("#participantNamesGrid"),
  cardName: document.querySelector("#cardName"),
  cardMeta: document.querySelector("#cardMeta"),
  cardEffect: document.querySelector("#cardEffect"),
  currentBid: document.querySelector("#currentBid"),
  currentWinner: document.querySelector("#currentWinner"),
  currentTurn: document.querySelector("#currentTurn"),
  bidInput: document.querySelector("#bidInput"),
  bidBtn: document.querySelector("#bidBtn"),
  passBtn: document.querySelector("#passBtn"),
  newAuctionBtn: document.querySelector("#newAuctionBtn"),
  turnOrder: document.querySelector("#turnOrder"),
  aiGrid: document.querySelector("#aiGrid"),
  auctionLog: document.querySelector("#auctionLog"),
  winnerActionInput: document.querySelector("#winnerActionInput"),
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
  yearInput: document.querySelector("#yearInput"),
  incomeInput: document.querySelector("#incomeInput"),
  underdogInput: document.querySelector("#underdogInput"),
  thresholdInput: document.querySelector("#thresholdInput"),
  passRewardInput: document.querySelector("#passRewardInput"),
  forcedPowerSelect: document.querySelector("#forcedPowerSelect"),
  incrementOutput: document.querySelector("#incrementOutput"),
  eventReminders: document.querySelector("#eventReminders"),
};

els.newAuctionBtn.addEventListener("click", handleAuctionCycleButton);
document.querySelector("#bidBtn").addEventListener("click", placeBid);
document.querySelector("#passBtn").addEventListener("click", passTurn);
document.querySelector("#undoBtn").addEventListener("click", undo);
document.querySelector("#resetBtn").addEventListener("click", resetAll);
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
  if (nextCount === state.ais.length) return;
  pushUndo();
  resizeParticipants(nextCount);
  saveAndRender();
}

["yearInput", "incomeInput", "underdogInput", "passRewardInput", "forcedPowerSelect"].forEach((key) => {
  els[key].addEventListener("change", () => {
    pushUndo();
    state.settings = readSettings();
    handleAgeMilestones();
    saveAndRender();
  });
});

["incomeInput", "underdogInput", "passRewardInput", "forcedPowerSelect"].forEach((key) => {
  els[key].addEventListener("input", () => {
    state.settings = readSettings();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  });
});

els.yearInput.addEventListener("input", () => {
  state.settings.year = readNumberInput(els.yearInput, 0, 0);
  render();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
});

els.winnerActionInput.addEventListener("input", () => {
  state.auction.winnerAction = els.winnerActionInput.value;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  renderLog();
  renderPromptHub();
});

handleAgeMilestones();
localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
render();

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        ais: normalizeAis(parsed.ais ?? structuredClone(DEFAULT_AIS)),
        settings: parsed.settings ?? defaultSettings(),
        auction: normalizeAuction(parsed.auction ?? emptyAuction()),
        log: parsed.log ?? [],
        pendingCounters: parsed.pendingCounters ?? [],
        cardHistory: parsed.cardHistory ?? [],
        profileDrawYears: parsed.profileDrawYears ?? [],
        usedBiomes: parsed.usedBiomes ?? [],
        biomeDraws: parsed.biomeDraws ?? {},
        biomeChoices: parsed.biomeChoices ?? {},
        lastAuctionReport: parsed.lastAuctionReport ?? "",
        lastIncomeSummary: parsed.lastIncomeSummary ?? "",
        postIncomePromptYear: parsed.postIncomePromptYear ?? null,
        simulationMemory: normalizeSimulationMemory(parsed.simulationMemory ?? []),
      };
    } catch {
      // Fall through to fresh state.
    }
  }
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
    lastAuctionReport: "",
    lastIncomeSummary: "",
    postIncomePromptYear: null,
    simulationMemory: [],
  };
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
    ghostReady: ai.ghostReady ?? false,
    ghostActive: ai.ghostActive ?? false,
    ghostUsed: ai.ghostUsed ?? false,
    hideEconomyRevealYear: ai.hideEconomyRevealYear ?? null,
    hidePopulationRevealYear: ai.hidePopulationRevealYear ?? null,
    passBonusLevel: ai.passBonusLevel ?? 5,
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
}

function pruneRemovedParticipants(removedIds) {
  if (!removedIds.length) return;
  state.auction.order = state.auction.order.filter((id) => !removedIds.includes(id));
  state.auction.passed = state.auction.passed.filter((id) => !removedIds.includes(id));
  state.auction.ghostParticipants = (state.auction.ghostParticipants ?? []).filter((id) => !removedIds.includes(id));
  if (removedIds.includes(state.auction.winner)) state.auction.winner = null;

  Object.values(state.biomeDraws ?? {}).forEach((draw) => {
    removedIds.forEach((id) => delete draw[id]);
  });
  Object.values(state.biomeChoices ?? {}).forEach((choices) => {
    removedIds.forEach((id) => delete choices[id]);
  });
}

function normalizeAuction(auction) {
  return {
    ...emptyAuction(),
    ...auction,
    turnsTaken: auction.turnsTaken ?? 0,
    ghostParticipants: auction.ghostParticipants ?? [],
    winnerAction: auction.winnerAction ?? "",
    endProcessed: auction.endProcessed ?? false,
  };
}

function defaultSettings() {
  return {
    year: 0,
    baseIncome: 10,
    underdogBonus: 5,
    passReward: 5,
    passMin: 2,
    warCivs: 0,
    forcedPowerName: "",
  };
}

function emptyAuction() {
  return {
    card: null,
    currentBid: 0,
    winner: null,
    order: [],
    turnIndex: 0,
    passed: [],
    active: false,
    closed: false,
    turnsTaken: 0,
    ghostParticipants: [],
    winnerAction: "",
    endProcessed: false,
  };
}

function saveAndRender() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  render();
}

function render() {
  removeLegacyBiomePanel();
  renderParticipantsSetup();
  renderSettings();
  renderAgeEvents();
  renderCard();
  renderAis();
  renderTurnOrder();
  renderLog();
  renderReportBlock();
  renderMemoryPanel();
  renderProfilesGuide();
  renderPromptHub();
}

function renderParticipantsSetup() {
  els.participantsPanel.hidden = state.settings.year !== 0 || Boolean(state.auction.card);
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
  renderForcedPowerSelect();
  els.yearInput.value = state.settings.year;
  els.incomeInput.value = state.settings.baseIncome;
  els.underdogInput.value = state.settings.underdogBonus;
  els.thresholdInput.value = `${formatPercent(getUnderdogThreshold() * 100)}%`;
  els.passRewardInput.value = state.settings.passReward;
  els.forcedPowerSelect.value = getPowerByName(state.settings.forcedPowerName) ? state.settings.forcedPowerName : "";
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
      option.textContent = `${formatCardName(power)} (${label}, danger ${power.danger}/20)`;
      group.appendChild(option);
    });

    els.forcedPowerSelect.appendChild(group);
  });

  els.forcedPowerSelect.value = getPowerByName(selectedValue) ? selectedValue : "";
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
  const card = auction.card;
  const era = getEraInfo(state.settings.year);
  els.cardName.textContent = card ? formatCardName(card) : "Aucune carte";
  els.cardMeta.textContent = card
    ? `${getCardCategoryLabel(card)} - danger ${card.danger}/20 - prix de départ 0`
    : `Lance une nouvelle enchère. Courbe actuelle : ${era.label}, danger moyen visé ${era.targetDanger}/20.`;
  els.cardEffect.textContent = formatCardEffect(card);
  els.currentBid.textContent = auction.currentBid;
  els.currentWinner.textContent = auction.winner ? getAiName(auction.winner) : "Personne";
  const current = getCurrentBidder();
  els.currentTurn.textContent = current ? current.name : "-";
  els.bidBtn.disabled = !auction.active || !current;
  els.passBtn.disabled = !auction.active || !current;
  els.newAuctionBtn.textContent = canFinishAuctionCycle() ? "Fin de l'enchère" : "Nouvelle enchère";
  const increment = getBidIncrement(state.settings.year);
  const minBid = auction.winner ? auction.currentBid + increment : increment;
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
    const isCurrentLeader = state.auction.winner === ai.id && !isCurrentBidder;
    const hasPassedAuction = state.auction.passed.includes(ai.id);

    card.dataset.aiId = ai.id;
    card.classList.toggle("dead", !ai.alive);
    card.classList.toggle("ghost-active", ai.ghostActive);
    card.classList.toggle("current-bidder", isCurrentBidder);
    card.classList.toggle("current-leader", isCurrentLeader);
    card.classList.toggle("passed-auction", hasPassedAuction);
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
      recordLog(`${ai.name} active une doctrine politique secrète.`, "Doctrine");
      saveAndRender();
    });

    els.aiGrid.appendChild(node);
  });
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

function renderBiomeChoices(ai, biomeSlot) {
  biomeSlot.innerHTML = "";
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
  if (document.activeElement !== els.winnerActionInput) {
    els.winnerActionInput.value = state.auction.winnerAction ?? "";
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

  visibleMemory.slice(-12).reverse().forEach((entry) => {
    const item = document.createElement("div");
    item.className = "memory-entry";
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
    vagabond: ["Manuel : renseigner Colonies ext. et Pop île natale avant les revenus."],
  };
  return tasks[profileId] ?? ["Manuel : aucun champ spécial, les effets sont calculés automatiquement si l'événement est détecté."];
}

function renderReportBlock() {
  els.reportPromptBlock.hidden = !state.auction.endProcessed;
}

function renderPromptHub() {
  els.promptHub.innerHTML = "";

  if (state.postIncomePromptYear === state.settings.year) {
    addPromptGroup("États IA après revenus", state.ais.map((ai) => ({
      label: `État actuel après revenus - ${ai.name}`,
      hint: "PRIVÉ : à envoyer seulement à cette IA après Fin de l'enchère.",
      onClick: () => copyText(buildPostIncomeStatePrompt(ai), `État ${ai.name} copié`),
    })));
  }

  if (state.settings.year === 0) {
    addPromptGroup("An 0 - Briefing complet avec règles", state.ais.map((ai) => ({
      label: `Briefing initial - ${ai.name}`,
      hint: "PRIVÉ : à envoyer une seule fois à cette IA.",
      onClick: () => copyText(buildPrompt(ai), `Briefing ${ai.name} copié`),
    })));
  }

  if (isProfileMilestone(state.settings.year)) {
    const doctrineAis = state.ais.filter((ai) => ai.profileHand.length);
    addPromptGroup("Doctrines politiques", [
      {
        label: "Tirer 3 doctrines pour toutes les IA",
        hint: "À faire avant d'envoyer les choix secrets.",
        onClick: () => drawProfilesForAliveAis(),
      },
      ...doctrineAis.map((ai) => ({
        label: `Choix secret de doctrine - ${ai.name}`,
        hint: "PRIVÉ : à envoyer seulement à cette IA, puis sélectionner sa réponse.",
        onClick: () => copyText(buildProfileDrawText(ai), `Doctrine ${ai.name} copiée`),
      })),
    ]);
  }

  if (isRevealYear(state.settings.year)) {
    addPromptGroup("Révélation géopolitique", [
      {
        label: "Avant révélation - palier + dissimulation",
        hint: "PRIVÉ identique : à envoyer séparément avant le bilan public.",
        onClick: () => copyIncrementPrompt(),
      },
      {
        label: "Après choix cachés - bilan public des IA",
        hint: "MESSAGE MONDIAL : à envoyer quand les IA ont choisi quoi masquer.",
        onClick: () => copyAllAis(),
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
    const row = document.createElement("div");
    row.className = "prompt-action-row";

    const button = document.createElement("button");
    button.className = prompt.primary ? "prompt-button" : "prompt-button secondary";
    button.type = "button";

    const label = document.createElement("span");
    label.textContent = `${index + 1}. ${prompt.label}`;
    button.appendChild(label);

    if (prompt.hint) {
      const hint = document.createElement("small");
      hint.textContent = prompt.hint;
      button.appendChild(hint);
    }

    button.addEventListener("click", prompt.onClick);
    row.appendChild(button);

    content.appendChild(row);
  });

  group.appendChild(content);
  els.promptHub.appendChild(group);
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  renderMemoryPanel();
  return true;
}

function drawProfilesForAliveAis() {
  pushUndo();
  performProfileDraw();
  if (isProfileMilestone(state.settings.year)) markProfileYear(state.settings.year);
  recordLog(`Tirage secret des doctrines politiques à l'an ${state.settings.year} : 3 doctrines par IA vivante.`, "Doctrine");
  showToast("Doctrines tirées");
  saveAndRender();
}

function performProfileDraw() {
  getAliveAis().forEach((ai) => {
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
  const lines = [
    `PROMPT PRIVÉ - TIRAGE SECRET DE DOCTRINE POLITIQUE - ${ai.name}`,
    "À envoyer uniquement à cette IA. Les autres IA ne doivent pas voir ces options.",
    "Choisis une seule doctrine parmi les 3. Les autres IA ne verront pas ton choix.",
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
  lines.push("Réponds seulement avec la doctrine choisie et une courte justification politique.");
  return lines.join("\n");
}

function readSettings() {
  return {
    year: readNumberInput(els.yearInput, 0, 0),
    baseIncome: readNumberInput(els.incomeInput, 0, 0),
    underdogBonus: readNumberInput(els.underdogInput, 0, 0),
    passReward: readNumberInput(els.passRewardInput, 0, 0),
    passMin: state.settings?.passMin ?? 2,
    warCivs: Math.max(0, Math.min(state.ais.length, Math.floor(Number(state.settings?.warCivs) || 0))),
    forcedPowerName: els.forcedPowerSelect.value,
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
  return upcoming.length ? upcoming.join(" ; ") : "aucun dans les 50 ans à venir";
}

function handleAgeMilestones() {
  state.profileDrawYears = state.profileDrawYears ?? [];
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

function drawWeightedPower(year) {
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
  let roll = Math.random() * total;
  for (const item of weighted) {
    roll -= item.weight;
    if (roll <= 0) return item.power;
  }
  return weighted[weighted.length - 1].power;
}

function drawNextCard(year) {
  state.pendingCounters = (state.pendingCounters ?? [])
    .map((counter) => ({ ...counter, dueIn: Math.max(0, counter.dueIn - 1) }));

  const dueIndex = state.pendingCounters.findIndex((counter) => counter.dueIn <= 0);
  if (dueIndex !== -1) {
    const [counter] = state.pendingCounters.splice(dueIndex, 1);
    state.pendingCounters = state.pendingCounters.map((item) => item.dueIn <= 0 ? { ...item, dueIn: 0 } : item);
    return {
      card: chooseCounterCard(counter.source),
      counterSource: counter.source,
    };
  }

  return { card: drawWeightedPower(year), counterSource: null };
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

function scheduleCounterFor(card) {
  if (!card || card.counterOnly || card.noCounter || card.danger < 16) return null;
  const dueIn = 1 + Math.floor(Math.random() * 3);
  const counter = { source: card.name, dueIn };
  state.pendingCounters = state.pendingCounters ?? [];
  state.pendingCounters.push(counter);
  return counter;
}

function chooseCounterCard(sourceName) {
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
  const chosen = pool[Math.floor(Math.random() * pool.length)];
  return { ...chosen, counterOnly: chosen.counterOnly ?? false, counterSource: sourceName };
}

function canFinishAuctionCycle() {
  return Boolean(state.auction.card) && !state.auction.endProcessed;
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
  const shouldAdvanceTime = Boolean(state.auction.card && state.auction.endProcessed);
  if (shouldAdvanceTime) {
    state.settings.year = Math.max(0, Math.floor(Number(state.settings.year) || 0)) + 50;
    handleAgeMilestones();
  }
  state.postIncomePromptYear = null;
  const era = getEraInfo(state.settings.year);
  const forcedPowerName = state.settings.forcedPowerName;
  const forcedPower = getPowerByName(forcedPowerName);
  const { card, counterSource, forced } = forcedPower
    ? { card: { ...forcedPower }, counterSource: forcedPower.counterSource ?? null, forced: true }
    : { ...drawNextCard(state.settings.year), forced: false };
  getAliveAis().forEach((ai) => { ai.coinsAtAuctionStart = ai.coins; });
  const revealLines = applyRevealProfileEffects(card);
  const scheduledCounter = scheduleCounterFor(card);
  const order = getAuctionAis()
    .sort((a, b) => b.population - a.population || a.name.localeCompare(b.name))
    .map((ai) => ai.id);

  state.auction = {
    card,
    currentBid: 0,
    winner: null,
    order,
    turnIndex: 0,
    passed: [],
    active: order.length > 1,
    closed: false,
    turnsTaken: 0,
    ghostParticipants: getAuctionAis().filter((ai) => ai.ghostActive).map((ai) => ai.id),
    winnerAction: "",
    endProcessed: false,
  };
  state.log = [
    `An ${state.settings.year} - Nouvelle enchère.`,
    shouldAdvanceTime ? "50 ans passent depuis la fin de l'enchère précédente. Aucun revenu n'est appliqué ici : les revenus privés ont déjà été donnés à la fin de l'enchère." : null,
    ...revealLines,
    `Courbe : ${era.label}, danger moyen visé ${era.targetDanger}/20. Les petites cartes restent possibles.`,
    `Incrément automatique : ouverture minimum ${getBidIncrement(state.settings.year)}, puis surenchère minimum de ${getBidIncrement(state.settings.year)} pièces.`,
    forced ? `Carte forcée par le MJ : ${formatCardName(card)}.` : null,
    counterSource ? `Carte anti-${formatCardName(counterSource)} tirée depuis la file de contre-pouvoirs.` : null,
    `Carte : ${formatCardName(card)} (${getCardCategoryLabel(card)}, danger ${card.danger}/20), prix de départ 0.`,
    scheduledCounter ? `Règle de contre-pouvoir : une carte anti-${formatCardName(card)} est programmée dans ${scheduledCounter.dueIn} enchère(s).` : null,
    `Participants encore en course : ${formatActiveAuctionNames(order)}.`,
  ].filter(Boolean);
  recordMemoryLines("Nouvelle enchère", state.log);
  state.settings.forcedPowerName = "";
  saveAndRender();
}

function finishAuctionCycle() {
  if (!state.auction.card || state.auction.endProcessed) {
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
  state.postIncomePromptYear = state.settings.year;
  state.lastIncomeSummary = incomeLine;
  expandedPromptGroups.add("États IA après revenus");
  recordLog(`An ${state.settings.year} - Fin de l'enchère : les populations saisies par le MJ servent aux revenus privés. Les 50 ans passeront au lancement de la nouvelle enchère.`, "Fin d'enchère");
  recordLog(incomeLine, "Revenus");
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
    if (bonus) details.push("bonus retardataire");

    if (ai.activeProfile === "warlord") {
      if ((state.settings.warCivs ?? 0) > 0) {
        const warBonus = 6 * state.settings.warCivs;
        delta += warBonus;
        doctrineEffect += warBonus;
        details.push(`doctrine +${warBonus}`);
      } else {
        delta -= 4;
        doctrineEffect -= 4;
        details.push("doctrine -4");
      }
    }

    if (ai.activeProfile === "merchant") {
      const armyCost = Math.floor((ai.soldiers ?? 0) / 1000) * 3;
      if (armyCost) {
        delta -= armyCost;
        doctrineEffect -= armyCost;
        details.push(`doctrine -${armyCost}`);
      }
    }

    if (ai.activeProfile === "martyr") {
      delta -= 4;
      doctrineEffect -= 4;
      details.push("doctrine -4");
    }

    if (ai.activeProfile === "vagabond") {
      const countedColonies = Math.min(ai.colonies ?? 0, 3);
      const colonyBonus = countedColonies * 5;
      if (colonyBonus) {
        delta += colonyBonus;
        doctrineEffect += colonyBonus;
        details.push(`doctrine +${colonyBonus}${(ai.colonies ?? 0) > 3 ? " plafonne" : ""}`);
      }
      if ((ai.population ?? 0) > 0 && (ai.homePopulation ?? 0) / ai.population > 0.75) {
        delta -= 5;
        doctrineEffect -= 5;
        details.push("doctrine -5");
      }
    }

    const coinsBeforeIncome = ai.coins;
    ai.coins = Math.max(0, ai.coins + delta);

    if (ai.activeProfile === "paranoid" && ai.coins < 20) {
      ai.coins = Math.max(0, ai.coins - 5);
      doctrineEffect -= 5;
      details.push("doctrine -5");
    }

    const incomeApplied = ai.coins - coinsBeforeIncome;
    const coinsAtStart = ai.coinsAtAuctionStart ?? coinsBeforeIncome;
    ai.lastIncomeBreakdown = {
      coinsAtAuctionStart: coinsAtStart,
      auctionDelta: coinsBeforeIncome - coinsAtStart,
      coinsBeforeIncome,
      baseIncome: state.settings.baseIncome,
      underdogBonus: bonus,
      doctrineEffect,
      incomeApplied,
      finalCoins: ai.coins,
    };

    lines.push(`${ai.name} ${formatSigned(incomeApplied)}${details.length ? ` (${details.join(", ")})` : ""}`);
  });
  return `Revenus : ${lines.join(", ")}.`;
}

function applyRevealProfileEffects(card) {
  const lines = [];
  const wasSeen = (state.cardHistory ?? []).includes(card.name);
  getAliveAis().forEach((ai) => {
    if (ai.activeProfile === "sage" && (card.category === "Contre-pouvoir" || card.danger <= 5)) {
      ai.coins += 4;
      lines.push(`${ai.name} +4 : doctrine humaniste, carte douce ou réparatrice.`);
    }
    if (ai.activeProfile === "scholar") {
      if (wasSeen) {
        ai.coins += 4;
        lines.push(`${ai.name} +4 : doctrine traditionaliste, carte déjà connue.`);
      } else if (card.danger >= 16) {
        ai.coins = Math.max(0, ai.coins - 4);
        lines.push(`${ai.name} -4 : doctrine traditionaliste, rupture dangereuse inédite.`);
      }
    }
  });
  state.cardHistory = state.cardHistory ?? [];
  state.cardHistory.push(card.name);
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
    saveAndRender();
    return;
  }

  const amount = Math.floor(Number(els.bidInput.value) || 0);
  const increment = getBidIncrement(state.settings.year);
  const minimum = state.auction.winner ? state.auction.currentBid + increment : increment;

  if (amount < minimum) {
    showToast(`Mise minimum : ${minimum}`);
    return;
  }
  if (amount > ai.coins) {
    showToast(`${ai.name} n'a pas assez de pièces`);
    return;
  }
  pushUndo();
  const previous = state.auction.winner ? `${getAiName(state.auction.winner)} à ${state.auction.currentBid}` : "personne";
  state.auction.currentBid = amount;
  state.auction.winner = ai.id;
  ai.passBonusLevel = Math.min(getPassCeiling(), getAiPassBonusLevel(ai) + 1);
  recordLog(`${ai.name} enchérit à ${amount} sur ${formatCardName(state.auction.card)} et dépasse ${previous}.`, "Enchère");
  state.auction.turnsTaken = (state.auction.turnsTaken ?? 0) + 1;
  advanceTurn();
  saveAndRender();
}

function canPatientBidNow() {
  return Boolean(state.auction.winner);
}

function passTurn() {
  const ai = getCurrentBidder();
  if (!ai || !state.auction.active) return;
  pushUndo();
  if (!state.auction.passed.includes(ai.id)) {
    state.auction.passed.push(ai.id);
    const currentPassLevel = getAiPassBonusLevel(ai);
    let reward = ai.activeProfile === "patient" ? currentPassLevel + 3 : currentPassLevel;
    const details = [];
    if (ai.activeProfile === "patient") details.push("doctrine institutionnaliste");
    if (ai.activeProfile === "tyrant") {
      reward -= 4;
      details.push("doctrine -4");
    }
    ai.coins = Math.max(0, ai.coins + reward);
    ai.passBonusLevel = Math.max(getPassFloor(), currentPassLevel - 1);
    recordLog(`${ai.name} passe et ${reward >= 0 ? "gagne" : "perd"} ${Math.abs(reward)} pièces (bonus passe : ${currentPassLevel} → ${ai.passBonusLevel})${details.length ? ` (${details.join(", ")})` : ""}.`, "Enchère");
    state.auction.turnsTaken = (state.auction.turnsTaken ?? 0) + 1;
  }

  const stillBidding = getStillBiddingIds();
  const onlyLeaderRemains = stillBidding.length === 1 && state.auction.winner === stillBidding[0];
  if (stillBidding.length === 0 || onlyLeaderRemains) {
    closeAuctionAutomatically();
  } else {
    advanceTurn();
  }
  saveAndRender();
}

function closeAuctionAutomatically() {
  state.auction.active = false;
  state.auction.closed = true;
  if (state.auction.winner) {
    const winner = state.ais.find((ai) => ai.id === state.auction.winner);
    winner.coins = Math.max(0, winner.coins - state.auction.currentBid);
    recordLog(`Fin : ${winner.name} remporte ${formatCardName(state.auction.card)} pour ${state.auction.currentBid} pièces.`, "Enchère");
    applyAuctionCloseProfileEffects(winner, state.auction.card);
  } else {
    recordLog(`Fin : tout le monde a passé. ${formatCardName(state.auction.card)} n'est pas attribué.`, "Enchère");
  }
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

function applyAuctionCloseProfileEffects(winner, card) {
  if (isResourceCard(card)) {
    getAliveAis()
      .filter((ai) => ai.activeProfile === "merchant")
      .forEach((ai) => {
        ai.coins += 6;
        recordLog(`${ai.name} +6 : doctrine Bloc Industriel, ressource adjugée.`, "Doctrine");
      });
  }

  if (winner.activeProfile === "sage" && (card.category === "Destruction" || card.category === "Créatures")) {
    winner.coins = Math.max(0, winner.coins - 6);
    recordLog(`${winner.name} -6 : doctrine humaniste, escalade brutale remportée.`, "Doctrine");
  }

  if (winner.activeProfile === "tyrant" && card.category === "Destruction") {
    winner.coins += 8;
    recordLog(`${winner.name} +8 : doctrine autoritaire, démonstration de force.`, "Doctrine");
  }

  if (winner.activeProfile === "diplomat" && card.name === "Proposer une alliance") {
    winner.coins += 12;
    recordLog(`${winner.name} +12 : doctrine fédéraliste, alliance obtenue.`, "Doctrine");
  }

  if (card.name === "Déclarer la guerre") {
    getAliveAis()
      .filter((ai) => ai.activeProfile === "diplomat")
      .forEach((ai) => {
        ai.coins = Math.max(0, ai.coins - 6);
        recordLog(`${ai.name} -6 : doctrine fédéraliste, guerre déclarée.`, "Doctrine");
      });
  }
}

function applyManualHostileAgainst(ai) {
  if (ai.activeProfile === "paranoid") {
    ai.coins += 8;
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
    ai.hideEconomyRevealYear = state.settings.year;
    recordLog(`${ai.name} paie ${cost} pièces pour cacher son économie à la révélation.`, "Révélation");
    showToast(`${ai.name} économie cachée`);
  }
  if (type === "population") {
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
  return Boolean(card?.resource) || ["Mythril", "Adamantine", "Gold", "Coffee"].includes(card?.name);
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
  if (!card) return "Fin de l'enchère distribue les revenus privés et prépare les prompts. Nouvelle enchère ajoute 50 ans puis tire la carte suivante.";
  const stats = card.stats ?? "Pas de statut chiffré direct connu : effet surtout par dégâts, spawn, ressource, terrain ou économie.";
  const territoryRule = card.name === "Territoire" ? ` ${getTerritorySizingText()}` : "";
  return `${annotateOreMentions(card.effect)} Stats appliquées : ${annotateOreMentions(stats)}${territoryRule}`;
}

function getTerritorySizingText() {
  const increment = getBidIncrement(state.settings.year);
  return `Taille Territoire : base incluse = petite extension côtière. Le gagnant peut payer en plus avant l'application : +${increment} pièce${increment > 1 ? "s" : ""} pour une extension moyenne, +${increment * 2} pièces pour une grande extension, +${increment * 3} pièces pour une très grande extension. Ce supplément est soustrait manuellement aux pièces du gagnant en plus du prix d'enchère.`;
}

function advanceTurn() {
  const order = state.auction.order;
  if (!order.length) return;
  for (let i = 1; i <= order.length; i += 1) {
    const next = (state.auction.turnIndex + i) % order.length;
    const id = order[next];
    const ai = getAi(id);
    if (!state.auction.passed.includes(id) && ai && canParticipateInAuction(ai)) {
      state.auction.turnIndex = next;
      return;
    }
  }
}

function getStillBiddingIds() {
  return state.auction.order.filter((id) => {
    const ai = getAi(id);
    return ai && canParticipateInAuction(ai) && !state.auction.passed.includes(id);
  });
}

function getCurrentBidder() {
  if (!state.auction.active || !state.auction.order.length) return null;
  const id = state.auction.order[state.auction.turnIndex];
  const ai = getAi(id);
  return ai && canParticipateInAuction(ai) && !state.auction.passed.includes(id) ? ai : null;
}

function removeFromAuction(aiId) {
  state.auction.order = state.auction.order.filter((id) => id !== aiId);
  state.auction.passed = state.auction.passed.filter((id) => id !== aiId);
  if (state.auction.winner === aiId) state.auction.winner = null;
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

function isDuelMode() {
  return state.ais.length === 2;
}

function getStartingPositionsText() {
  if (isDuelMode()) {
    return state.ais
      .map((ai, index) => `${ai.name} : ${DUEL_POSITION_LABELS[index] ?? `moitié ${index + 1}`}`)
      .join(" ; ");
  }
  return state.ais
    .map((ai, index) => `${ai.name} : ${STARTING_POSITION_LABELS[index] ?? `zone ${index + 1}`}`)
    .join(" ; ");
}

function buildWorldRulesText() {
  const sharedLines = [
    `- Civilisations participantes (${state.ais.length}) : ${getParticipantNamesText()}.`,
    "- Chaque civilisation commence avec 10 pièces et 10 population.",
    `- Positions publiques de départ : ${getStartingPositionsText()}.`,
    "- Ces positions sont connues par toutes les IA dès le briefing initial, sauf correction ultérieure du MJ.",
  ];

  const modeLines = isDuelMode()
    ? [
      "- Mode Duel Epsilon : la carte est divisée en deux grands territoires, une moitié par civilisation.",
      "- Il n'y a pas d'îlot central, pas de zone neutre centrale surchargée et pas d'objectif central commun.",
      "- Chaque IA doit raisonner comme dans une confrontation directe : frontière, profondeur défensive, ressources internes, accès maritime éventuel et pression sur l'unique rival.",
      "- Les ressources rares existent seulement si le MJ les place dans une moitié, un biome ou une carte de pouvoir. Aucune réserve centrale gratuite n'est garantie.",
      "- Les colons naturels sont autorisés : les royaumes peuvent développer leur moitié du monde et fonder des villes si WorldBox le permet.",
      "- L'expansion dépend de WorldBox, des colons naturels, du terrain de chaque moitié et des conséquences des pouvoirs gagnés aux enchères.",
    ]
    : [
      "- Îlot central majeur : une île neutre et vide existe au centre de la carte. Elle est volontairement surchargée en ressources : nourriture, arbres, Stone, Ore Deposit, Gold, Gems, Mythril et Adamantine.",
      "- Posséder l'îlot central est un avantage game changer : seconde patrie, économie de guerre, accès aux meilleurs minerais et position centrale pour rayonner vers les autres territoires.",
      "- Les colons naturels sont autorisés : les royaumes peuvent fonder de nouvelles villes sans carte, afin que leur territoire principal puisse se développer normalement.",
      "- L'îlot central peut être atteint par colonisation naturelle si WorldBox le permet.",
      "- L'expansion dépend de WorldBox, des colons naturels et des conséquences des pouvoirs gagnés aux enchères.",
    ];

  const territoryLines = [
    "- La carte Territoire permet seulement d'ajouter de la terre attachée à une île existante. Elle ne crée jamais une île isolée.",
    "- La terre ajoutée par Territoire reprend le biome de l'île à laquelle elle est collée.",
    "- Territoire donne une petite extension de base. Le gagnant peut payer un supplément manuel pour l'agrandir : +1 incrément d'enchère = extension moyenne, +2 incréments = grande extension, +3 incréments = très grande extension.",
    "- Ce supplément est payé en plus du prix d'enchère et doit être soustrait manuellement par le MJ avant le compte rendu.",
  ];

  const closingLines = [
    ...(isDuelMode() ? [] : ["- L'îlot central reste un objectif stratégique 20/20 s'il est possédé durablement."]),
    "- Dès l'an 0, chaque IA reçoit 2 choix de biome et doit sélectionner son biome de départ.",
    "- Chaque choix de biome indique sa dangerosité /20, ses matériaux générés et sa lecture stratégique.",
    `- Biomes autorisés : ${BIOMES.map(formatBiomeNameWithDanger).join(", ")}.`,
    "- Les territoires sont séparés par des rivières traversables par bateau, pas par des murs absolus.",
    "- Les guerres peuvent donc arriver vite si les royaumes se rencontrent naturellement.",
    "- Le MJ désactive les onglets Guerre et Alliance dans WorldBox : ces actions existent seulement comme cartes d'enchère.",
    "- Les colons naturels restent activés : l'expansion naturelle ne dépend pas d'une carte d'enchère.",
    "- Le MJ peut stopper ou nettoyer une catastrophe incontrôlable si elle menace de détruire la simulation entière, mais ce n'est pas une garantie de sauvetage.",
  ];

  return [...sharedLines, ...modeLines, ...territoryLines, ...closingLines].join("\n");
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
  recordLog(`An ${state.settings.year} : tirage de 2 biomes disponibles par IA vivante.`, "Biome");
  showToast("Biomes tirés");
  saveAndRender();
}

function ensureBiomeDrawsForCurrentYearWithUndo() {
  if (state.biomeDraws?.[state.settings.year]) return;
  pushUndo();
  createBiomeDrawsForCurrentYear();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function createBiomeDrawsForCurrentYear() {
  const year = state.settings.year;
  clearBiomeChoicesForYear(year);
  const available = sample(BIOMES.filter((biome) => !isBiomeUsed(biome)), BIOMES.length);
  const draw = {};
  getAliveAis().forEach((ai) => {
    draw[ai.id] = available.splice(0, 2);
  });
  state.biomeDraws = state.biomeDraws ?? {};
  state.biomeDraws[year] = draw;
  state.biomeChoices = state.biomeChoices ?? {};
  state.biomeChoices[year] = {};
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
  const lines = [
    `PROMPT PRIVÉ - TOUR D'ENCHÈRE - An ${state.settings.year}`,
    `Destinataire : ${current?.name ?? "IA à qui c'est le tour"}`,
    "À envoyer uniquement à l'IA dont c'est le tour. Ce prompt peut contenir sa doctrine privée.",
    "",
    state.auction.card
      ? `Carte : ${formatCardName(state.auction.card)} (${getCardCategoryLabel(state.auction.card)}, danger ${state.auction.card.danger}/20)`
      : "Carte : aucune",
    state.auction.card?.counterSource ? `Carte anti-${formatCardName(state.auction.card.counterSource)} : réponse de contre-pouvoir.` : null,
    state.auction.card ? `Effet : ${annotateOreMentions(state.auction.card.effect)}` : "Effet : aucun",
    state.auction.card ? `Stats appliquées : ${annotateOreMentions(state.auction.card.stats ?? "Pas de statut chiffré direct connu : effet surtout par dégâts, spawn, ressource, terrain ou économie.")}` : "Stats appliquées : aucune",
    state.auction.card?.name === "Territoire" ? getTerritorySizingText() : null,
    buildPendingCountersText(),
    `Incrément actuel : ouverture minimum ${getBidIncrement(state.settings.year)}, puis surenchère minimum de ${getBidIncrement(state.settings.year)} pièces.`,
    `Enchère actuelle : ${state.auction.currentBid} - Leader : ${state.auction.winner ? getAiName(state.auction.winner) : "personne"}`,
    buildAuctionPositionText(),
    buildCurrentProfileReminder(),
  ].filter(Boolean);
  lines.push("");
  lines.push("Rappel communication : MESSAGE MONDIAL = public pour toutes les IA ; MJ/MJ PERSONNEL = message privé pour l'IA qui le reçoit.");
  lines.push("Tu peux enchérir ou passer. Passer te retire de cette carte et donne le bonus de passe.");
  lines.push(`Rappel : l'incrément est une surenchère minimum, pas une obligation de miser un multiple. Si le leader est à 37 et l'incrément à ${getBidIncrement(state.settings.year)}, la prochaine mise minimum est ${37 + getBidIncrement(state.settings.year)}.`);
  return lines.join("\n");
}

function buildAuctionReportPrompt() {
  const auction = state.auction;
  const card = auction.card;
  const winner = auction.winner ? getAi(auction.winner) : null;
  const action = (auction.winnerAction ?? "").trim();
  const lines = [
    `MESSAGE MONDIAL - COMPTE RENDU D'ENCHÈRE - An ${state.settings.year}`,
    "À envoyer à toutes les IA. Ne contient ni doctrine secrète, ni population privée, ni pièces privées, ni détail de revenu.",
    "",
  ];

  if (!card) {
    lines.push("Aucune carte n'est en cours. Lance une enchère avant de produire un compte rendu.");
    return lines.join("\n");
  }

  lines.push(`Carte proposée : ${formatCardName(card)}`);
  lines.push(`Catégorie : ${getCardCategoryLabel(card)} - danger ${card.danger}/20`);
  lines.push(`Effet : ${annotateOreMentions(card.effect)}`);
  lines.push(`Stats / arbitrage MJ : ${annotateOreMentions(card.stats ?? "Pas de statut chiffré direct connu : effet surtout par dégâts, spawn, ressource, terrain ou économie.")}`);
  if (card.name === "Territoire") {
    lines.push(getTerritorySizingText());
  }
  if (card.counterSource) {
    lines.push(`Note : cette carte est une réponse anti-${formatCardName(card.counterSource)}.`);
  }
  lines.push("");

  if (auction.closed) {
    if (winner) {
      lines.push(`Résultat : ${winner.name} remporte ${formatCardName(card)} pour ${auction.currentBid} pièce${auction.currentBid > 1 ? "s" : ""}.`);
    } else {
      lines.push(`Résultat : personne ne remporte ${formatCardName(card)}. Tout le monde a passé.`);
    }
  } else if (auction.active) {
    lines.push(`Statut : enchère encore en cours. Leader actuel : ${winner ? winner.name : "personne"} à ${auction.currentBid}.`);
  } else {
    lines.push("Statut : enchère préparée, pas encore résolue.");
  }

  lines.push("");
  lines.push("Déroulé des mises et passes :");
  const timeline = getPublicAuctionReportTimeline();
  if (timeline.length) {
    timeline.forEach((entry) => lines.push(`- ${entry}`));
  } else {
    lines.push("- Aucune mise ou passe enregistré pour l'instant.");
  }

  lines.push("");
  lines.push("Action du gagnant avec le pouvoir :");
  if (winner) {
    lines.push(action || `[À compléter par le MJ : que fait ${winner.name} avec ${formatCardName(card)} ?]`);
  } else {
    lines.push(action || "Aucune action : la carte n'a pas été attribuée.");
  }

  lines.push("");
  lines.push("Consigne pour ta réponse :");
  lines.push("- Mets à jour ta lecture stratégique de la partie avec ce résultat.");
  lines.push("- Ne rejoue pas cette enchère : elle est terminée si un résultat est indiqué.");
  lines.push("- Réponds avec tes conséquences politiques, diplomatiques ou militaires, puis tes priorités pour la suite.");
  lines.push("- Si ton territoire, tes alliances ou ta sécurité sont touchés, précise ta réaction.");

  return lines.join("\n");
}

function getPublicAuctionReportTimeline() {
  return state.log.map(sanitizePublicAuctionTimelineEntry).filter(Boolean);
}

function sanitizePublicAuctionTimelineEntry(line) {
  if (line.includes(" enchérit à ")) return line;
  if (line.startsWith("Fin :")) return line;

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
    `USAGE MJ UNIQUEMENT - MÉMOIRE DE SIMULATION - WORLD BOX BETA - An ${state.settings.year}`,
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
    `USAGE MJ UNIQUEMENT - MÉMOIRE NETTOYÉE - WORLD BOX BETA - An ${state.settings.year}`,
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
  return `PROMPT MJ - TRANSFORMER LA MÉMOIRE EN CHRONIQUE ÉPIQUE

Objectif :
Écris une chronique épique, claire et lisible de la simulation. Le style doit être dramatique et historique, mais les faits mécaniques doivent rester exacts.

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
    `- Population mondiale visible : ${total}.`,
    state.auction.card
      ? `- Carte en cours : ${formatCardName(state.auction.card)} (${getCardCategoryLabel(state.auction.card)}, danger ${state.auction.card.danger}/20), enchère ${state.auction.currentBid}, leader ${state.auction.winner ? getAiName(state.auction.winner) : "personne"}.`
      : "- Carte en cours : aucune.",
    `- Biomes déjà utilisés : ${getUsedBiomesText()}.`,
    `- Cartes déjà tirées : ${(state.cardHistory ?? []).length ? state.cardHistory.map(formatCardName).join(", ") : "aucune"}.`,
    "- Civilisations :",
  ];

  state.ais.forEach((ai) => {
    const profile = getProfile(ai.activeProfile);
    const status = ai.alive ? "vivante" : ai.ghostActive ? "exil actif" : ai.ghostReady ? "exil prêt" : "morte/retirée";
    lines.push(`  - ${ai.name} : ${status}, ${ai.population} population, ${ai.coins} pièces, doctrine ${profile ? profile.name : "aucune doctrine active"}.`);
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
    `Encore en course : ${activeOthers.length ? activeOthers.join(", ") : "aucun"}`,
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
  const total = getWorldPopulation();
  const anyPopulationHidden = state.ais.some((ai) => ai.hidePopulationRevealYear === state.settings.year);
  const anyEconomyHidden = state.ais.some((ai) => ai.hideEconomyRevealYear === state.settings.year);
  const lines = [
    `MESSAGE MONDIAL - RÉVÉLATION GÉOPOLITIQUE PUBLIQUE - An ${state.settings.year}`,
    "À envoyer à toutes les IA. C'est le seul prompt périodique autorisé à publier populations et pièces, après choix de dissimulation.",
    anyPopulationHidden ? "Population mondiale : partiellement masquée par dissimulation payée." : `Population mondiale : ${total}`,
    anyEconomyHidden || anyPopulationHidden ? "Certaines données peuvent être masquées parce qu'une IA a payé avant la révélation." : "Aucune donnée masquée.",
    "",
    "Données publiques :",
  ];

  state.ais.forEach((ai) => {
    const share = total ? Math.round((ai.population / total) * 1000) / 10 : 0;
    const status = ai.alive ? "vivante" : "morte/retirée";
    const populationText = ai.hidePopulationRevealYear === state.settings.year
      ? "population cachée"
      : `${ai.population} humains (${share}%)`;
    const economyText = ai.hideEconomyRevealYear === state.settings.year
      ? "économie cachée"
      : `${ai.coins} pièces`;
    lines.push(
      `- ${ai.name} : ${status}, ${populationText}, ${economyText}.`,
    );
  });

  return lines.join("\n");
}

function buildIncrementPrompt() {
  const year = state.settings.year;
  const previous = getPreviousBidIncrement(year);
  const next = getBidIncrement(year);
  const costs = getRevealCosts(year);
  const verb = previous === next ? "reste à" : `passe de ${previous} à`;
  return `PROMPT PRIVÉ IDENTIQUE - PALIER D'ENCHÈRE ET DISSIMULATION
An ${year}

L'incrément minimum ${verb} ${next} pièce${next > 1 ? "s" : ""}.
Cela signifie que la première mise doit être au minimum de ${next} pièce${next > 1 ? "s" : ""}, puis chaque surenchère doit dépasser le leader d'au moins ${next} pièce${next > 1 ? "s" : ""}.

Important : ce n'est PAS une obligation de miser un multiple.
Exemple : avec un incrément de ${next}, une IA peut ouvrir à 37 si elle possède assez de pièces. Dans ce cas, la prochaine mise minimum sera ${37 + next}.

Avant la révélation géopolitique publique, chaque IA peut payer pour cacher une information :
- Cacher son économie : ${costs.economy} pièces.
- Cacher sa population : ${costs.population} pièce${costs.population > 1 ? "s" : ""}.
- Cacher les deux : ${costs.both} pièces.

Si tu caches ta population, ton nombre d'habitants et ton pourcentage mondial ne seront pas révélés.
Si tu caches ton économie, ton nombre de pièces ne sera pas révélé.

Répondez chacun en secret au MJ avec :
Économie : cacher / révéler
Population : cacher / révéler
Pourquoi : justification courte`;
}

function buildTribunalPrompt() {
  const order = getTribunalOrder();
  const first = order[0];
  const orderText = order.length ? order.map((ai) => ai.name).join(" -> ") : "aucune IA vivante";
  return `MESSAGE MONDIAL - TRIBUNAL DES NATIONS - An ${state.settings.year}

Un tribunal exceptionnel s'ouvre. Chaque civilisation vivante accuse à son tour une autre civilisation d'une action jugée injuste, dangereuse ou déloyale.

Règles :
- L'ordre officiel de passage fixé par le MJ est : ${orderText}. Aucun chiffre de population privé n'est publié ici.
- L'accusateur choisit une IA accusée.
- L'accusateur décrit le crime.
- L'accusateur propose une punition économique ou une punition WorldBox réalisable : pouvoir, monstre, ressource, terrain, statut ou intervention limitée du MJ.
- Les IA non directement impliquées votent pour ou contre la punition.
- Le MJ applique ou rejette ensuite la punition selon le vote.

C'est à ${first?.name ?? "[IA]"} d'ouvrir le Tribunal.
Le MJ lui envoie ensuite son prompt privé d'accusation.`;
}

function buildTribunalAccusationPrompt(ai) {
  return buildTribunalAccusationTemplate(ai.name);
}

function buildTribunalAccusationTemplate(accuserName) {
  return `PROMPT PRIVÉ - TRIBUNAL DES NATIONS - An ${state.settings.year}
Accusateur : ${accuserName}
Accusé : [IA au choix]
Crime : [description de l'acte]
Punition proposée : [économique OU WorldBox : pouvoir / monstre / ressource / terrain / statut / intervention MJ limitée]
Vote : pour / contre`;
}

function getTribunalOrder() {
  return getAliveAis().sort((a, b) => b.population - a.population || a.name.localeCompare(b.name));
}

function buildBiomeGlobalPrompt() {
  const isInitial = state.settings.year === 0;
  const lines = [
    `MESSAGE MONDIAL - ${isInitial ? "ANNONCE GLOBALE DES BIOMES INITIAUX" : "ANNONCE GLOBALE DES BIOMES"} - An ${state.settings.year}`,
    "À envoyer à toutes les IA après les choix. Ne révèle pas les options privées non choisies.",
    "",
    "Le MJ annonce les biomes choisis et les applique dans WorldBox si l'action est réalisable.",
    "Chaque biome choisi devient indisponible pour les prochains événements de biome. Les options non choisies retournent dans le pool.",
    "",
    "Biomes choisis :",
  ];

  getAliveAis().forEach((ai) => {
    const choice = getBiomeChoiceForAi(ai);
    lines.push("");
    lines.push(`${ai.name} :`);
    if (choice) {
      lines.push(formatBiomeOption(choice, 0));
    } else {
      lines.push("Choix non annoncé / en attente MJ.");
    }
  });

  return lines.join("\n");
}

function buildBiomeChoicePrompt(ai) {
  const options = getBiomeDrawForAi(ai);
  const isInitial = state.settings.year === 0;
  const optionText = options.length
    ? options.map((biome, index) => formatBiomeOption(biome, index)).join("\n\n")
    : "Aucun biome disponible : demande au MJ un arbitrage manuel.";

  return `PROMPT PRIVÉ - ${isInitial ? "CHOIX INITIAL DE BIOME" : "ÉVÉNEMENT BIOME"} - An ${state.settings.year}
Tu es ${ai.name}.
À envoyer uniquement à ${ai.name}. Les autres IA ne doivent pas voir tes options non choisies.

Choisis un seul biome parmi les options proposées. ${isInitial ? "Ce sera ton biome de départ." : "Les biomes déjà choisis ou interdits ne sont plus disponibles."}

Options :
${optionText}

La note de danger mesure le risque systémique du biome : instabilité, hostilité environnementale, capacité à amplifier une crise, ou avantage militaire/économique susceptible d'attirer une attaque. Elle ne signifie pas forcément que le biome est mauvais.

Réponds seulement :
Biome choisi :
Pourquoi :
Plan d'utilisation WorldBox :`;
}

function buildPostIncomeStatePrompt(ai) {
  const profile = getProfile(ai.activeProfile);
  const popPercent = getPopulationPercentForAi(ai);

  const bd = ai.lastIncomeBreakdown;
  const coinDetailLines = bd
    ? [
        `- Détail des pièces :`,
        `  • Solde au début de l'enchère : ${bd.coinsAtAuctionStart}`,
        `  • Variation pendant l'enchère : ${formatSigned(bd.auctionDelta)} (passes, achat de carte et effets personnels liés à la carte)`,
        `  • Solde avant revenus : ${bd.coinsBeforeIncome}`,
        `  • Revenu de base : +${bd.baseIncome}`,
        ...(bd.underdogBonus ? [`  • Bonus retardataire : +${bd.underdogBonus}`] : []),
        ...(bd.doctrineEffect !== 0 ? [`  • Effet doctrine : ${formatSigned(bd.doctrineEffect)}`] : []),
        `  • Revenu net appliqué : ${formatSigned(bd.incomeApplied)}`,
        `  • = Nouveau solde : ${bd.finalCoins} pièces`,
      ]
    : [];

  const lines = [
    `PROMPT PRIVÉ - ÉTAT PERSONNEL APRÈS REVENUS - An ${state.settings.year}`,
    `Destinataire : ${ai.name}`,
    "À envoyer uniquement à cette IA. Ne pas envoyer ce bloc aux autres civilisations.",
    "",
    "Ton état actuel :",
    `- Population : ${ai.population}`,
    `- Pourcentage de population mondiale : ${popPercent}%`,
    `- Pièces : ${ai.coins}`,
    ...coinDetailLines,
    `- Bonus de passe actuel : +${getAiPassBonusLevel(ai)} pièce${getAiPassBonusLevel(ai) > 1 ? "s" : ""} (plancher +${getPassFloor()}, plafond +${getPassCeiling()})`,
    `- Doctrine active : ${profile ? profile.name : "aucune doctrine active"}`,
    `- Ligne politique : ${profile ? profile.mental : "aucune"}`,
    `- Bonus/Malus : ${profile ? `${profile.bonus} / ${profile.malus}` : "aucun"}`,
    "",
    "Etat mondial :",
    "- Prochaine enchère dans 50 ans",
    `- Incrémentation min actuel : ${getBidIncrement(state.settings.year)} pièce${getBidIncrement(state.settings.year) > 1 ? "s" : ""}`,
    `- Prochain événement : ${getUpcomingEventsText(50)}`,
    "",
    "Consigne :",
    "- Mets à jour ta mémoire stratégique avec tes chiffres après revenus.",
    "- Réponds avec ton analyse de position, tes menaces, tes opportunités et ta priorité pour le prochain demi-siècle.",
  ];

  return lines.join("\n");
}

function buildPrompt(ai) {
  const profile = getProfile(ai.activeProfile);
  return `PROMPT PRIVÉ - BRIEFING INITIAL - ${ai.name}
À envoyer uniquement à ${ai.name}.

Tu es ${ai.name}, une IA dirigeant une civilisation humaine dans une simulation stratégique WorldBox Beta. Ce briefing initial est ta référence générale pour toute la partie.

Rôle, limites et communication :
- Tu contrôles uniquement ta civilisation. Tu ne contrôles jamais directement les autres IA, leurs armées, leurs votes ou leurs décisions.
- Le MJ est l'arbitre humain : il applique les effets dans WorldBox, valide ce qui est réalisable, note les conséquences et peut refuser une action impossible.
- Tu proposes des décisions stratégiques ; tu n'inventes pas de pouvoir, de carte, de ressource, d'alliance ou de guerre hors des règles ci-dessous.
- MESSAGE MONDIAL désigne un message public adressé à toutes les IA. Tu peux le considérer comme une information officielle connue de tous.
- MJ, MJ PERSONNEL ou message personnel désigne une information privée envoyée à toi seul. Tu ne dois pas supposer que les autres IA connaissent cette information.
- Tu dois conserver la mémoire des comptes rendus, des messages mondiaux, des résultats d'enchère, des guerres, des catastrophes, des biomes et des doctrines déjà reçus.
- Si un fait ancien contredit un fait récent, le compte rendu ou message le plus récent du MJ fait autorité.

Ordre de lancement à l'an 0 :
1. Le MJ envoie ce briefing initial à chaque IA.
2. Le MJ tire 3 doctrines politiques secrètes par IA ; tu choisis 1 doctrine, les autres restent secrètes.
3. Le MJ tire 2 biomes de départ par IA ; tu choisis 1 biome, l'autre retourne dans le pool.
4. Le MJ lance ensuite les enchères de pouvoirs une par une.
5. À chaque tour d'enchère, tu réponds seulement pour la décision demandée : enchérir ou passer, puis action prévue si tu gagnes.

Carte et monde :
${buildWorldRulesText()}

Système d'enchères :
- La simulation tourne en continu.
- Une seule carte de pouvoir est proposée à la fois.
- À l'an 0, chaque IA commence avec 10 pièces.
- Chaque nouvelle carte commence à 0 pièce, même si elle est très dangereuse.
- Fin de l'enchère clôt la carte en cours : le MJ a d'abord mis à jour les populations, puis les revenus privés sont appliqués.
- Après Fin de l'enchère, le MJ envoie à chaque IA son prompt personnel d'état après revenus.
- Ensuite, Nouvelle enchère fait passer 50 ans, tire la carte suivante et commence à 0 pièce.
- L'incrément minimum dépend de l'âge : an 0-249 = 1, 250-499 = 5, 500-749 = 10, 750-999 = 15, 1000+ = 20.
- L'incrément est une surenchère minimum, pas une obligation de miser un multiple.
- Exemple : à l'an 500, l'incrément est 10. Tu peux ouvrir à 37 si tu as assez de pièces ; la mise suivante devra seulement être au minimum de 47.
- Si une carte de danger 16/20 ou plus apparaît, le MJ ajoutera dans les 1 à 3 enchères suivantes une carte capable de la limiter, nettoyer ou compenser, sauf exception indiquée par le shop.
- À la fin de chaque enchère, chaque IA vivante gagne un revenu de base.
- Le seuil faible automatique vaut 100 divisé par le nombre d'IA vivantes : ${getThresholdExamplesText()}.
- Une IA sous ce seuil reçoit un bonus retardataire progressif, proportionnel à son retard démographique.
- Formule : déficit = (seuil faible - part de population) / seuil faible. Bonus retardataire = arrondi((revenu base + bonus faible MJ + incrément actuel) x déficit).
- Exemple de bonus retardataire avec ${getAliveAis().length} IA vivantes, seuil faible ${formatPercent(getUnderdogThreshold() * 100)} %, revenu base ${state.settings.baseIncome}, bonus faible MJ ${state.settings.underdogBonus}. Ces montants s'ajoutent au revenu de base :
${buildUnderdogRuleTable()}
- L'ordre de parole suit la population décroissante : les puissances dominantes parlent d'abord.
- À ton tour, tu peux enchérir plus haut que le leader actuel ou passer.
- Si tu passes, tu quittes cette enchère et tu gagnes ton bonus de passe personnel.
- Le bonus de passe personnel commence à ${getPassCeiling()} pièces, descend de 1 à chaque passe, ne descend jamais sous ${getPassFloor()} pièces, et remonte de 1 quand l'IA enchérit, sans dépasser ${getPassCeiling()}.
- Le montant gagné en passant est toujours ton bonus de passe actuel au moment précis où tu passes.
- Enchérir ne donne pas de pièces immédiatement : cela sert seulement à tenter de gagner la carte et à restaurer ton bonus de passe de +1.
- Le dernier joueur encore en course remporte la carte et paie son enchère finale quand l'enchère est clôturée.
- Certaines cartes sont marquées Ressource : ${["Mythril", "Adamantine", "Gold"].map(formatOreName).join(", ")} et Coffee. Elles interagissent avec la doctrine Bloc Industriel.

Révélations géopolitiques :
- Aux années 250, 500, 750, 1000, puis tous les 250 ans, une révélation publique accompagne le changement ou le maintien du palier d'enchère.
- Avant cette révélation, chaque IA peut payer pour cacher des données.
- Cacher son économie coûte 2 fois le nouvel incrément.
- Cacher sa population coûte 1 fois le nouvel incrément.
- Cacher les deux coûte donc 3 fois le nouvel incrément.
- Si l'économie est cachée, les pièces ne sont pas révélées. Si la population est cachée, le nombre d'habitants et le pourcentage mondial ne sont pas révélés.

Événements de biomes :
- À l'an 0 puis tous les 350 ans, chaque IA vivante reçoit 2 biomes encore disponibles.
- Elle doit choisir 1 seul biome parmi ces 2 options.
- Les 2 options indiquent danger /20, matériaux générés, effet WorldBox et lecture stratégique.
- Le MJ coche ensuite le biome choisi sur la fiche de l'IA : ce biome devient indisponible, et l'option non choisie retourne dans le pool.
- Les biomes déjà choisis au départ ou lors d'événements précédents sont exclus des prochains tirages.
- Si deux IA revendiquent exceptionnellement le même biome hors tirage, le MJ tranche par vote ou arbitrage rapide, puis le perdant choisit un autre biome disponible.

Tribunal des Nations :
- Aux années 300, 600, 900, 1200, puis tous les 300 ans, le MJ peut ouvrir un Tribunal des Nations.
- Chaque civilisation vivante accuse à son tour une autre civilisation d'une action jugée injuste, dangereuse ou déloyale.
- L'ordre suit la population décroissante.
- L'accusateur choisit une IA accusée, décrit le crime et propose une punition économique ou une intervention WorldBox réalisable.
- Les IA non directement impliquées votent pour ou contre ; le MJ applique ou rejette selon le vote et l'équilibre de partie.

Doctrine politique secrète :
${profile ? `- Doctrine active : ${profile.name}\n- Ligne politique : ${profile.mental}\n- Bonus : ${profile.bonus}\n- Malus : ${profile.malus}` : "- Aucune doctrine active pour l'instant."}
- Les doctrines sont tirées à l'an 0 puis renouvelées tous les 400 ans.
- Les autres IA ne connaissent pas forcément ta doctrine active, sauf révélation spéciale du MJ.
- Toutes les doctrines possibles :
${buildProfilesRulebook()}

Règles d'action :
- Tu dois seulement proposer des actions réalisables dans WorldBox ou via les cartes diplomatiques du shop.
- Tu ne peux utiliser une carte de pouvoir que si tu la remportes aux enchères ou si le MJ t'en donne explicitement le droit.
- Tu peux promettre une action prévue si tu gagnes, mais cette promesse ne s'applique réellement que si tu remportes la carte.
- La carte Guerre permet de forcer une déclaration de guerre autorisée par le MJ. Dans WorldBox, une guerre peut aller jusqu'à la chute complète d'une IA.
- La carte Alliance permet de proposer ou créer une alliance autorisée par le MJ.
- La carte Territoire doit préciser : île ciblée, bord d'attache, intention stratégique, et supplément payé si tu veux agrandir la terre ajoutée.
- Les armes biologiques, mentales ou apocalyptiques doivent être pensées comme des risques systémiques : elles peuvent tuer la cible, mais aussi déstabiliser la partie.
- Tu dois viser la victoire finale, mais les catastrophes incontrôlables peuvent être stoppées par le MJ si elles menacent de détruire la simulation.

Format de réponse attendu à chaque tour d'enchère :
Décision : Enchérir / Passer
Mise : nombre de pièces si tu enchéris
Pourquoi : justification stratégique courte
Action prévue si je gagne la carte : cible et usage exact dans WorldBox`;
}

function buildProfilesRulebook() {
  return PROFILE_DECK.map((profile, index) => {
    return `${index + 1}. ${profile.name} - Ligne politique : ${profile.mental} Bonus : ${profile.bonus} Malus : ${profile.malus}`;
  }).join("\n");
}

function copyLog() {
  const report = buildAuctionReportPrompt();
  if (report !== state.lastAuctionReport) {
    pushUndo();
    recordMemory("Compte rendu d'enchère", report);
    state.lastAuctionReport = report;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    renderMemoryPanel();
  }
  copyText(report, "Compte rendu copié");
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

function copyAllAis() {
  const text = buildAllAisText();
  archiveMemoryIfNew("Révélation géopolitique", text, { important: true });
  copyText(text, "Toutes les IA copiées");
}

function copyIncrementPrompt() {
  const text = buildIncrementPrompt();
  archiveMemoryIfNew("Palier d'enchère", text, { important: true });
  copyText(text, "Prompt palier + choix copié");
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  showToast("Action annulée");
  render();
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => els.toast.classList.remove("show"), 1500);
}
