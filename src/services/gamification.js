/**
 * Badge definitions and unlock logic.
 * Badges use Take 3 (Chibi) style — mapped to Irish mythology names.
 */

/**
 * Badge definitions and unlock logic.
 * Badge images are in src/assets/badges/.
 */

export const BADGES = [
  // ── First steps ───────────────────────────────────────────────
  {
    id:          'first-quest',
    name:        'First Quest',
    description: 'Answered your very first question!',
    icon:        '🌊',
    img:         'first-swim-lesson',
    rarity:      'common',
    type:        'journey',
    condition:   ({ totalAnswered }) => totalAnswered >= 1,
  },
  {
    id:          'best-bud',
    name:        'Best Bud',
    description: 'Finished a full learning session!',
    icon:        '🐾',
    img:         'best-bud-adventures',
    rarity:      'common',
    type:        'journey',
    condition:   ({ sessions }) => sessions >= 1,
  },

  // ── Level milestones ──────────────────────────────────────────
  {
    id:          'level-5',
    name:        'Island Explorer',
    description: 'Reached Level 5 — the adventure begins!',
    icon:        '🗺️',
    img:         'map-explorer',
    rarity:      'common',
    type:        'level',
    condition:   ({ level }) => level >= 5,
  },
  {
    id:          'level-10',
    name:        'Rising Star',
    description: 'Reached Level 10 — you\'re levelling up!',
    icon:        '⭐',
    img:         'level-up',
    rarity:      'rare',
    type:        'level',
    condition:   ({ level }) => level >= 10,
  },
  {
    id:          'level-15',
    name:        'Water Explorer',
    description: 'Reached Level 15 — making waves!',
    icon:        '🐠',
    img:         'water-explorer',
    rarity:      'rare',
    type:        'level',
    condition:   ({ level }) => level >= 15,
  },
  {
    id:          'level-20',
    name:        'Quest Champion',
    description: 'Reached Level 20 — a true champion!',
    icon:        '🏆',
    img:         'blue-trophy',
    rarity:      'rare',
    type:        'level',
    condition:   ({ level }) => level >= 20,
  },
  {
    id:          'level-25',
    name:        'Ocean Sailor',
    description: 'Reached Level 25 — sailing the seas of knowledge!',
    icon:        '⛵',
    img:         'ocean-sailor',
    rarity:      'epic',
    type:        'level',
    condition:   ({ level }) => level >= 25,
  },
  {
    id:          'level-30',
    name:        'Gold Crown',
    description: 'Reached Level 30 — royally brilliant!',
    icon:        '👑',
    img:         'gold-crown',
    rarity:      'epic',
    type:        'level',
    condition:   ({ level }) => level >= 30,
  },
  {
    id:          'level-45',
    name:        'Skate Star',
    description: 'Reached Level 45 — legendary status!',
    icon:        '🛼',
    img:         'pink-rainbow',
    rarity:      'legendary',
    type:        'level',
    condition:   ({ level }) => level >= 45,
  },

  // ── Questions answered milestones ──────────────────────────────
  {
    id:          'fifty-questions',
    name:        'Treasure Seeker',
    description: 'Answered 50 questions total!',
    icon:        '💎',
    img:         'treasure-gems',
    rarity:      'common',
    type:        'questions',
    condition:   ({ totalAnswered }) => totalAnswered >= 50,
  },
  {
    id:          'century',
    name:        'Century Scholar',
    description: 'Answered 100 questions — impressive!',
    icon:        '💰',
    img:         'gold-coins',
    rarity:      'rare',
    type:        'questions',
    condition:   ({ totalAnswered }) => totalAnswered >= 100,
  },
  {
    id:          'five-hundred',
    name:        'Treasure Chest',
    description: 'Answered 500 questions — incredible!',
    icon:        '📦',
    img:         'treasure-chest-game',
    rarity:      'epic',
    type:        'questions',
    condition:   ({ totalAnswered }) => totalAnswered >= 500,
  },

  // ── Streaks ────────────────────────────────────────────────────
  {
    id:          'streak-3',
    name:        'Growing Strong',
    description: 'Kept a 3-day streak!',
    icon:        '🌱',
    img:         'island-planter',
    rarity:      'common',
    type:        'streak',
    condition:   ({ streak }) => streak >= 3,
  },
  {
    id:          'streak-7',
    name:        'Week Warrior',
    description: 'Kept a 7-day streak — amazing dedication!',
    icon:        '🔥',
    img:         'dino-heart',
    rarity:      'rare',
    type:        'streak',
    condition:   ({ streak }) => streak >= 7,
  },
  {
    id:          'streak-30',
    name:        'Legendary Streak',
    description: '30-day streak — you\'re unstoppable!',
    icon:        '🌅',
    img:         'sunset-queen',
    rarity:      'legendary',
    type:        'streak',
    condition:   ({ streak }) => streak >= 30,
  },

  // ── Perfect play ───────────────────────────────────────────────
  {
    id:          'perfect-quest',
    name:        'Perfect Run',
    description: 'Got 10 correct answers in a row!',
    icon:        '⚡',
    img:         'perfect-score-3',
    rarity:      'epic',
    type:        'session',
    condition:   ({ correctStreak }) => correctStreak >= 10,
  },
  {
    id:          'daily-goal',
    name:        'Daily Champion',
    description: 'Met your daily study goal!',
    icon:        '✅',
    img:         'daily-checklist',
    rarity:      'common',
    type:        'time',
    condition:   ({ dailyGoalMet }) => dailyGoalMet,
  },

  // ── Mastery ────────────────────────────────────────────────────
  {
    id:          'first-mastery',
    name:        'Subject Master',
    description: 'Mastered your first subject!',
    icon:        '📜',
    img:         'torch-cave',
    rarity:      'rare',
    type:        'mastery',
    condition:   ({ masteredSubjects }) => masteredSubjects >= 1,
  },
  {
    id:          'all-rounder',
    name:        'All-Rounder',
    description: 'Tried all 10 subjects!',
    icon:        '🌍',
    img:         'tree-children',
    rarity:      'epic',
    type:        'mastery',
    condition:   ({ sessionSubjectsCount }) => sessionSubjectsCount >= 9,
  },
  {
    id:          'high-queen',
    name:        'High Queen of Tara',
    description: 'Overall mastery over 80% — legendary!',
    icon:        '👸',
    img:         'crown-check',
    rarity:      'legendary',
    type:        'mastery',
    condition:   ({ overallMastery }) => overallMastery >= 80,
  },

  // ── Safety & adventure ─────────────────────────────────────────
  {
    id:          'safety-pro',
    name:        'Safety Pro',
    description: 'Completed a session without quitting!',
    icon:        '🛡️',
    img:         'safety-pro',
    rarity:      'common',
    type:        'journey',
    condition:   ({ sessions }) => sessions >= 3,
  },
  {
    id:          'adventurer',
    name:        'Adventurer',
    description: 'Explored 5 different topics!',
    icon:        '🎒',
    img:         'lantern-treasure',
    rarity:      'rare',
    type:        'journey',
    condition:   ({ topicsExplored }) => topicsExplored >= 5,
  },
  {
    id:          'nature-lover',
    name:        'Nature Lover',
    description: 'Completed 10 science questions!',
    icon:        '🌿',
    img:         'watering-plants',
    rarity:      'common',
    type:        'subject',
    subject:     'science',
    condition:   ({ subjectAnswered }) => (subjectAnswered?.science ?? 0) >= 10,
  },
  {
    id:          'sandcastle',
    name:        'Geography Builder',
    description: 'Mastered 5 geography topics!',
    icon:        '🏖️',
    img:         'sandcastle',
    rarity:      'rare',
    type:        'subject',
    subject:     'geography',
    condition:   ({ subjectMastery }) => (subjectMastery?.geography ?? 0) >= 60,
  },
  {
    id:          'sunset-writer',
    name:        'Bard of the Boyne',
    description: 'English mastery unlocked!',
    icon:        '📚',
    img:         'sunset-writer',
    rarity:      'rare',
    type:        'subject',
    subject:     'english',
    condition:   ({ subjectMastery }) => (subjectMastery?.english ?? 0) >= 70,
  },
  {
    id:          'pig-hugger',
    name:        'Kind Heart',
    description: 'Completed 5 SPHE or Ethics questions!',
    icon:        '💚',
    img:         'pig-hugger',
    rarity:      'common',
    type:        'subject',
    condition:   ({ subjectAnswered }) => ((subjectAnswered?.sphe ?? 0) + (subjectAnswered?.ethics ?? 0)) >= 5,
  },
  {
    id:          'celebration-hero',
    name:        'Celebration Hero',
    description: 'Answered 20 history questions!',
    icon:        '⚔️',
    img:         'celebration-hero',
    rarity:      'rare',
    type:        'subject',
    subject:     'history',
    condition:   ({ subjectAnswered }) => (subjectAnswered?.history ?? 0) >= 20,
  },
  {
    id:          'oval-dino',
    name:        'Pet Pal',
    description: 'Unlocked your first pet!',
    icon:        '🦖',
    img:         'oval-dino',
    rarity:      'common',
    type:        'pet',
    condition:   ({ petsOwned }) => petsOwned >= 1,
  },
  {
    id:          'leaf-necklace',
    name:        'Irish Scholar',
    description: 'Answered 10 Irish / Gaeilge questions!',
    icon:        '☘️',
    img:         'leaf-necklace',
    rarity:      'rare',
    type:        'subject',
    subject:     'irish',
    condition:   ({ subjectAnswered }) => (subjectAnswered?.irish ?? 0) >= 10,
  },
]

export const RARITY_COLORS = {
  common:    '#b0a48f',
  rare:      '#4a90d9',
  epic:      '#8e44ad',
  legendary: '#c9a227',
}

/**
 * Check which new badges should be unlocked given current state.
 * Returns array of newly earned badge IDs.
 */
export function checkBadges(state, alreadyEarned) {
  return BADGES
    .filter(b => !alreadyEarned.includes(b.id) && b.condition(state))
    .map(b => b.id)
}

/**
 * Get average mastery per subject (from masteryMap)
 */
export function getSubjectAverages(masteryMap) {
  const avgs = {}
  for (const [subject, topics] of Object.entries(masteryMap)) {
    const scores = Object.entries(topics)
      .filter(([k, v]) => !k.startsWith('_') && typeof v === 'number')
      .map(([, v]) => v)
    avgs[subject] = scores.length ? Math.round(scores.reduce((a,b)=>a+b,0) / scores.length) : 0
  }
  return avgs
}

/**
 * Count subjects with average mastery >= threshold
 */
export function countMasteredSubjects(masteryMap, threshold = 85) {
  return Object.values(getSubjectAverages(masteryMap)).filter(s => s >= threshold).length
}

/**
 * Irish mythology region unlocked per subject mastery level
 */
export const MYTHOLOGY_REGIONS = [
  {
    id: 'hill-of-tara', subject: 'english', name: 'Hill of Tara', unlockAt: 50, emoji: '🏔️',
    storyTitle: 'The Stone of Destiny Roars!',
    legend: 'Long ago — more than 2,000 years ago — Ireland\'s High Kings were crowned atop this sacred hill in County Meath. At the very heart of Tara stands the Lia Fáil, the magical "Stone of Destiny." Legend says it roared like thunder when the rightful king placed their hands upon it, so loud the sound echoed across all four provinces of Ireland! Only the true chosen ruler could make it speak.\n\nThe druids — Ireland\'s wisest scholars and storytellers — believed that words held the greatest power in the universe. They memorised thousands of poems, laws, and histories without ever writing them down, passing knowledge from mouth to ear across generations. Only those who truly mastered language could recite the ancient spells, settle disputes between kingdoms, and speak to the gods.\n\nToday, the Hill of Tara is still a magical place. On a clear day you can see sixteen counties from its summit. Every time you read a book, tell a story, or find exactly the right word — you are keeping that ancient druid tradition alive. The Lia Fáil would roar for YOU! 🦁✨',
  },
  {
    id: 'river-boyne', subject: 'history', name: 'River Boyne', unlockAt: 50, emoji: '🌊',
    storyTitle: 'Fionn and the Salmon of Knowledge',
    legend: 'Long before he became Ireland\'s greatest warrior-hero, young Fionn Mac Cumhaill was just a boy working as a servant for his druid teacher, the wise Finnegas. Finnegas had spent seven long years waiting beside the River Boyne hoping to catch one very special fish — the Salmon of Knowledge, Bradán Feasa. According to legend, the salmon had eaten nine magical hazelnuts that fell from the Tree of Knowledge into the Well of Wisdom. Whoever ate the first bite of this salmon would know all the secrets of the world.\n\nAt last the day came — Finnegas caught the salmon! He told Fionn to cook it but warned him sternly: "Do not eat even one tiny bite!" Fionn cooked carefully, but as he turned the fish, a fat droplet splashed and burned his thumb. He sucked his thumb to cool the sting — and in a single heartbeat, all the knowledge of the universe flooded into his mind. From that day, whenever Fionn needed wisdom in battle or in judgement, he only had to bite his thumb and the answer came.\n\nThe River Boyne has witnessed 5,000 years of Irish history — from the prehistoric builders of Newgrange to the famous Battle of the Boyne in 1690. Just like Fionn, your love of history gives you the power to understand the world! 🐟🌿',
  },
  {
    id: 'burren', subject: 'science', name: 'The Burren', unlockAt: 50, emoji: '🪨',
    storyTitle: 'Where Arctic Meets Mediterranean',
    legend: 'The Burren in County Clare is one of the most extraordinary natural science experiments on the planet — and it has been running for 10,000 years without a single scientist helping! This vast silver-grey limestone plateau was carved smooth by glaciers during the last Ice Age. When the ice melted, something astonishing happened: the bare rock began to bloom.\n\nScientists who came to study the Burren were completely baffled. How can Arctic plants like mountain avens and purple saxifrage grow right beside Mediterranean orchids and ferns — species that normally live thousands of kilometres apart and can\'t tolerate the same climate? The answer lay hidden underground. A network of warm underground rivers and caves keeps the rock\'s temperature mild, even in winter. The limestone stores the sun\'s heat during the day and releases it at night like a warm blanket, creating a micro-climate unlike anywhere else on Earth.\n\nThe Burren is also home to pine martens, otters, rare butterflies, and over 700 species of flowering plants. It teaches us that nature always finds a way to survive and thrive — and that the most important scientific discoveries happen when you ask "But WHY does that happen?" Just like you have learned to do! 🌸🦋🌿',
  },
  {
    id: 'wicklow-mtns', subject: 'geography', name: 'Wicklow Mountains', unlockAt: 50, emoji: '⛰️',
    storyTitle: 'Saint Kevin and the Blackbird',
    legend: 'Saint Kevin was a monk who lived in the sixth century — that\'s almost 1,500 years ago! He climbed deep into the Wicklow Mountains searching for a quiet place to pray, away from the busy world. He found a perfect spot: a narrow valley between two glittering blue lakes, surrounded by ancient oak forests and high heathery peaks. He called it Gleann Dá Loch — the Valley of Two Lakes, which we now call Glendalough.\n\nOne peaceful spring morning, Kevin knelt to pray with his arms stretched wide open. A blackbird glided silently down and landed right in his open palm. Kevin was so still, so gentle, so completely at peace that the bird wasn\'t afraid at all. The blackbird gathered moss and twigs and began to build a nest. Then she laid her eggs. Kevin felt such love and wonder that he kept his hand perfectly, painfully still for weeks — through rain and cold — until the eggs hatched and the little chicks grew strong enough to fly away.\n\nGlendalough grew into one of Ireland\'s greatest monastic cities, with a famous Round Tower that still stands today, over 100 metres tall. Thousands of pilgrims walked for days across these very mountains to visit it. The Wicklow Mountains cover 500 square kilometres and are the largest upland area in Ireland. Geography teaches us that every place on Earth has a story — and Kevin\'s story of patience and kindness lives in these mountains forever! 🐦⛰️💚',
  },
  {
    id: 'cliffs-moher', subject: 'maths', name: 'Cliffs of Moher', unlockAt: 50, emoji: '🌅',
    storyTitle: 'The Druid Mathematicians',
    legend: 'The Cliffs of Moher stretch for 14 kilometres along the wild Atlantic coast of County Clare, standing 214 metres high at their tallest point — that\'s as tall as 70 double-decker buses balanced on top of each other! Every year, more than 1.5 million visitors come to stand at their edge and stare out at the endless ocean, feeling the raw power of the Atlantic wind and waves.\n\nBut long before tourists arrived, the ancient druid mathematicians of Ireland would observe the skies from high clifftops just like these. Without calculators, computers, or even written numbers, they calculated the movements of the sun, moon, and stars with incredible precision. They knew exactly when solstices and equinoxes would occur. They could predict eclipses. They designed Newgrange so that on the shortest day of the year — and only on that one day — a single narrow beam of winter sunrise travels 19 metres through a stone passage and illuminates the inner chamber like a golden lamp. This calculation was so perfect that it still works flawlessly 5,200 years later!\n\nMathematics was the original magic — the language of the universe itself. The druids understood what scientists still say today: numbers describe everything from the spiral of a seashell to the orbit of a distant star. You have unlocked that ancient magic! 🌠🔢✨',
  },
  {
    id: 'connemara', subject: 'irish', name: 'Connemara', unlockAt: 50, emoji: '🌿',
    storyTitle: 'Tír na nÓg — The Land of the Young',
    legend: 'Deep in the wild bogs and purple mountains of Connemara, where the Atlantic crashes against a jagged coastline of islands and silver lakes, the ancient people whispered of a hidden gateway to Tír na nÓg — the magical Land of the Young, where nobody ever grows old, nobody ever falls sick, and nobody ever feels sad.\n\nThe warrior Oisín, son of Fionn Mac Cumhaill, fell in love with the beautiful Niamh of the Golden Hair when she appeared from the western sea on a shining white horse. "Come with me to Tír na nÓg," she said in the Irish language — Gaeilge — the tongue of the fairy people and the poets. Oisín leapt onto the horse and they galloped across the waves, disappearing into the golden horizon. Three hundred years passed in what felt like three days. When Oisín finally returned, he was warned never to touch Irish soil — but he slipped from his horse, and instantly became a very old man.\n\nConnemara is one of the last great Gaeltacht areas — places where Irish is the everyday spoken language. Children there grow up counting, dreaming, laughing, and arguing in Gaeilge. The language has survived invasion, famine, and centuries of hardship. Tá an Ghaeilge beo — Irish is alive! Maith thú as í a fhoghlaim — well done for learning it! ☘️🌊🐎',
  },
  {
    id: 'newgrange', subject: 'genknow', name: 'Newgrange', unlockAt: 50, emoji: '🌀',
    storyTitle: 'Older Than the Pyramids of Egypt',
    legend: 'Try to imagine building a giant house using nothing but stone tools, wooden sledges, and the strength of your own hands — no cranes, no trucks, no cement mixers. Now imagine doing this so perfectly that it lasts for over 5,000 years. That is exactly what the prehistoric people of Ireland achieved when they built Newgrange in County Meath around 3,200 BCE.\n\nNewgrange is older than Stonehenge in England AND older than the Great Pyramids of Egypt! It was built from 200,000 tonnes of stone, some carried from mountains 80 kilometres away. The builders created a long passage leading to a central chamber, and — most amazingly of all — they built a small rectangular opening above the entrance called a "roof box." Once every year, on the winter solstice (the shortest day of the year), a pencil-thin beam of sunlight enters that roof box at exactly 9:09 in the morning and slowly illuminates the entire inner chamber in gold for exactly 17 minutes, before the earth tilts away and darkness returns.\n\nNo one knows how the builders calculated this so precisely. For 4,000 years, Newgrange was buried and forgotten. It was rediscovered by accident in 1699 when a farmer moved a large stone. Today archaeologists, astronomers, and scientists from around the world are still uncovering its secrets. The greatest treasure of all is curiosity — and you are overflowing with it! 🌞🏛️🔍',
  },
  {
    id: 'ring-of-kerry', subject: 'sphe', name: 'Ring of Kerry', unlockAt: 50, emoji: '💚',
    storyTitle: 'Meitheal — The Power of Working Together',
    legend: 'The Ring of Kerry is one of the most breathtaking drives in the world — 179 kilometres of winding road around the Iveragh Peninsula in County Kerry, passing golden beaches, mirror-still lakes, ancient stone forts, and mountains that turn purple at sunset. Puffins nest on the Skellig Islands just offshore. Seals nap on the rocks. In spring, the hedgerows burst with fuchsia blooms of deep red and purple.\n\nFor thousands of years, the people who lived in these valleys had a beautiful tradition called "meitheal" (pronounced MEH-hal). When a neighbour needed to build a new home, harvest their oats before the rain came, or dig their turf from the bog before winter, everyone in the townland would simply show up without being asked. No payment, no contract — just community spirit. Children came too, carrying water and food. Old people told stories to keep spirits high. Nobody competed. Everyone contributed what they could.\n\nModern scientists who study happiness and wellbeing have discovered what Kerry families knew all along: people who feel connected to a community, who help others, and who feel genuinely cared for live longer, healthier, and happier lives than people who live in isolation. Every time you show kindness, include someone who feels left out, or do something generous without expecting a reward — you are practising the ancient wisdom of meitheal. Wellbeing is something we build together! 🤝💚🏔️',
  },
  {
    id: 'skellig-michael', subject: 'ethics', name: 'Skellig Michael', unlockAt: 50, emoji: '🦅',
    storyTitle: 'The Monks Who Saved the World\'s Knowledge',
    legend: 'Eight kilometres off the wildest tip of the Kerry coast, two jagged pyramids of dark rock jut from the stormy Atlantic Ocean. These are the Skellig Islands — skellig meaning "splinter of rock" in Old Irish. The larger, Skellig Michael, rises 230 metres straight from the crashing waves. If you look up from a boat, you can see a staircase of 618 hand-cut stone steps spiralling up its sheer face.\n\nIn the sixth century, around 588 CE, a small group of Christian monks climbed to the summit of this impossible place and built a monastery — six beehive-shaped stone huts, two oratories, and a graveyard — all without mortar, using only the interlocking weight of stones fitted perfectly together. For nearly 600 years they lived on this rock, surviving on fish, seabirds\' eggs, and rainwater, enduring Atlantic storms that battered their tiny shelters with walls of freezing spray.\n\nBut here is what makes these monks true heroes: while Viking raids swept Ireland and wars destroyed libraries across Europe, these monks kept quietly, carefully copying every manuscript and book they could find — ancient Greek philosophy, Roman history, Irish poetry, the Gospels, scientific texts. They did not copy these books to become famous. They did it because they believed knowledge was sacred, that preserving the truth was worth any sacrifice. Many historians believe that without the Irish monks of places like Skellig Michael, the accumulated learning of the ancient world would have been lost forever.\n\nThey did what was right, not what was comfortable. They were brave, principled, and just. Your sense of ethics is built on foundations as ancient and as solid as those stone beehive huts — still standing after 1,400 years! ✨🦅📜',
  },
]
