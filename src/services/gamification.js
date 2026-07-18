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
  { id: 'hill-of-tara',   subject: 'english',   name: 'Hill of Tara',     unlockAt: 50, emoji: '🏔️',
    legend: 'The ancient seat of Ireland\'s High Kings! Legend says the Lia Fáil — the Stone of Destiny — screams aloud when the true king stands upon it. You have mastered the English language, worthy scholar!' },
  { id: 'river-boyne',    subject: 'history',   name: 'River Boyne',      unlockAt: 50, emoji: '🌊',
    legend: 'Along these sacred banks, the great warrior Fionn Mac Cumhaill caught the Salmon of Knowledge and gained all the wisdom in the world with a single taste. Your history knowledge flows as deep as this mighty river!' },
  { id: 'burren',         subject: 'science',   name: 'The Burren',       unlockAt: 50, emoji: '🪨',
    legend: 'This magical limestone landscape was shaped over 350 million years! Arctic flowers grow beside Mediterranean plants here — a living science experiment. You have unlocked the secrets of the natural world!' },
  { id: 'wicklow-mtns',   subject: 'geography', name: 'Wicklow Mountains', unlockAt: 50, emoji: '⛰️',
    legend: 'The Garden of Ireland! These ancient mountains hide the Vale of Avoca and Glendalough — a valley of two lakes where Saint Kevin lived as a hermit for seven years. Your knowledge spans the whole island!' },
  { id: 'cliffs-moher',   subject: 'maths',     name: 'Cliffs of Moher',  unlockAt: 50, emoji: '🌅',
    legend: 'Standing 214 metres above the wild Atlantic Ocean — as tall as 70 double-decker buses! The druids used the stars and numbers to track the seasons from cliffs like these. Your maths skills are rock solid!' },
  { id: 'connemara',      subject: 'irish',     name: 'Connemara',        unlockAt: 50, emoji: '🌿',
    legend: 'Caite i gConamara, tír na Gaeilge! This wild and beautiful land is a stronghold of the Irish language. The mountains, bogs, and lakes here whisper in Irish. Tá Gaeilge mhaith agat — you speak the tongue of our ancestors!' },
  { id: 'newgrange',      subject: 'genknow',   name: 'Newgrange',        unlockAt: 50, emoji: '🌀',
    legend: 'Older than Stonehenge and the Pyramids of Egypt, Newgrange was built 5,200 years ago! Every winter solstice, a single beam of sunlight enters the chamber and lights it up at dawn. Your general knowledge rivals the ancient druids!' },
  { id: 'ring-of-kerry',  subject: 'sphe',      name: 'Ring of Kerry',    unlockAt: 50, emoji: '💚',
    legend: 'A circle of kindness and community! The people of Kerry are famous for their warm welcome — the Irish tradition of "meitheal" means neighbours helping neighbours. Your understanding of people and wellbeing shines like the Kerry sunset!' },
  { id: 'skellig-michael',subject: 'ethics',    name: 'Skellig Michael',  unlockAt: 50, emoji: '🦅',
    legend: 'A tiny island rising from the stormy Atlantic, home to brave monks who copied manuscripts by hand and kept learning alive during the Dark Ages. Their courage to do what is right still echoes here. Your ethical thinking is as strong as these ancient stone walls!' },
]
