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
    legend: 'Long ago, Ireland\'s High Kings were crowned atop this sacred hill. At its heart stands the Lia Fáil — the magical Stone of Destiny. Legend says it roared like thunder when the true king touched it, so loud it could be heard across all of Ireland! The druids believed that words held the greatest power of all, and only those who mastered language could speak the ancient spells. You have proven your command of words — the Lia Fáil would roar for you! 🦁',
  },
  {
    id: 'river-boyne', subject: 'history', name: 'River Boyne', unlockAt: 50, emoji: '🌊',
    storyTitle: 'Fionn and the Salmon of Knowledge',
    legend: 'A young boy named Fionn Mac Cumhaill was cooking a magical salmon for his druid teacher when a drop of its fat landed on his thumb. He sucked his thumb — and in an instant, knew everything that had ever happened in all of history! The salmon had eaten nine hazelnuts that fell from the Tree of Knowledge. From that day on, whenever Fionn needed wisdom, he only had to suck his thumb. Your history knowledge now flows as deep and wide as this mighty, magical river! 🐟',
  },
  {
    id: 'burren', subject: 'science', name: 'The Burren', unlockAt: 50, emoji: '🪨',
    storyTitle: 'Where Arctic Meets Mediterranean',
    legend: 'The Burren is Ireland\'s most magical science experiment! This vast limestone plateau was carved by glaciers 10,000 years ago, and here something extraordinary happens — Arctic plants like mountain avens grow right beside Mediterranean orchids, side by side! Scientists came from all over the world to discover why. The answer lies underground: warm water flows through hidden caves keeping the soil just right. Nature found a way. Just like a great scientist, you have learned to look closely and ask WHY! 🌸',
  },
  {
    id: 'wicklow-mtns', subject: 'geography', name: 'Wicklow Mountains', unlockAt: 50, emoji: '⛰️',
    storyTitle: 'Saint Kevin and the Blackbird',
    legend: 'Long ago, a monk named Kevin climbed into these mountains to pray in solitude. One spring morning as he stretched out his arms, a blackbird landed in his open palm and began to build a nest! Kevin was so gentle and kind that he held his hand perfectly still for weeks, until the eggs hatched and the chicks flew away. The valley he found — Glendalough, the Valley of Two Lakes — became one of Ireland\'s most beautiful places. You have mapped this land as surely as Kevin mapped his own heart! 🐦',
  },
  {
    id: 'cliffs-moher', subject: 'maths', name: 'Cliffs of Moher', unlockAt: 50, emoji: '🌅',
    storyTitle: 'The Druid Who Counted the Stars',
    legend: 'Standing 214 metres tall — as high as 70 double-decker buses stacked up! The ancient druids stood on cliffs just like these and used maths to count the stars, predict eclipses, and calculate the exact moment of midsummer sunrise. Without calculators or phones, they were so precise that Newgrange was built to catch a single beam of sunlight on the winter solstice — and it still works perfectly, 5,200 years later! Maths was the original magic. And you have mastered it! 🌠',
  },
  {
    id: 'connemara', subject: 'irish', name: 'Connemara', unlockAt: 50, emoji: '🌿',
    storyTitle: 'Tír na nÓg — Land of the Young',
    legend: 'Deep in the wild bogs and mountains of Connemara, the old stories say there is a secret path to Tír na nÓg — the magical Land of the Young where nobody ever grows old. The warrior Oisín rode there on a white horse across the sea with Niamh of the Golden Hair. The language of Connemara is Irish — Gaeilge — the same ancient tongue the fairy people spoke. Tá an Ghaeilge beo i gConamara fós — Irish is still alive in Connemara! Maith thú — well done! ☘️',
  },
  {
    id: 'newgrange', subject: 'genknow', name: 'Newgrange', unlockAt: 50, emoji: '🌀',
    storyTitle: 'Older Than the Pyramids',
    legend: 'Imagine building a house 5,200 years ago with no machines, no trucks, no computers! That\'s exactly what the people of ancient Ireland did when they constructed Newgrange — 200,000 tonnes of stone, perfectly built so that on the shortest day of the year, a single beam of winter sunlight travels 19 metres down the passage and lights up the chamber like a lamp. Archaeologists, historians, and astronomers are STILL discovering its secrets. Curiosity and knowledge are the greatest treasures of all — and you are full of both! 🌞',
  },
  {
    id: 'ring-of-kerry', subject: 'sphe', name: 'Ring of Kerry', unlockAt: 50, emoji: '💚',
    storyTitle: 'The Tradition of Meitheal',
    legend: 'In the old days along the Ring of Kerry, when a farmer needed to build a new home or harvest crops, all the neighbours would come together — nobody asked to be paid, nobody waited to be invited. This tradition was called "meitheal" (pronounced meh-hal), the spirit of working together. The sea, the mountains, the puffin colonies — everything in Kerry thrives because it works in harmony. Wellbeing isn\'t just about yourself; it\'s about the whole community around you. You understand this in your heart! 🤝',
  },
  {
    id: 'skellig-michael', subject: 'ethics', name: 'Skellig Michael', unlockAt: 50, emoji: '🦅',
    storyTitle: 'The Monks Who Saved Knowledge',
    legend: 'Picture 12 brave monks climbing to the very top of a rocky spike in the wild Atlantic, 600 steps carved by hand, to build a tiny monastery. For 600 years, while wars swept through Europe, these monks copied manuscripts by candlelight — every book of knowledge they could find — so that the wisdom of the world would never be lost. They did what was right, not what was easy. Because of their courage and sense of justice, libraries exist today. Your ethical thinking is as brave and as lasting as those ancient stone walls! ✨',
  },
]
