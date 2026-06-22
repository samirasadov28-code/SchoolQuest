/**
 * Badge definitions and unlock logic.
 * Badges use Take 3 (Chibi) style — mapped to Irish mythology names.
 */

export const BADGES = [
  // ── Journey badges (progression) ──────────────────────────────
  {
    id:          'celtic-explorer',
    name:        'Celtic Explorer',
    description: 'Started your first quest!',
    icon:        '🧭',
    rarity:      'common',
    type:        'journey',
    condition:   ({ sessions }) => sessions >= 1,
  },
  {
    id:          'fionns-friend',
    name:        "Fionn's Friend",
    description: 'Kept your streak for 7 days in a row!',
    icon:        '🔥',
    rarity:      'rare',
    type:        'streak',
    condition:   ({ streak }) => streak >= 7,
  },
  {
    id:          'druid-scholar',
    name:        'Druid Scholar',
    description: 'Mastered your first subject!',
    icon:        '📜',
    rarity:      'rare',
    type:        'mastery',
    condition:   ({ masteredSubjects }) => masteredSubjects >= 1,
  },
  {
    id:          'si-stone-seeker',
    name:        'Sí Stone Seeker',
    description: 'Covered all subjects in one session!',
    icon:        '💎',
    rarity:      'epic',
    type:        'session',
    condition:   ({ sessionSubjectsCount }) => sessionSubjectsCount >= 9,
  },
  {
    id:          'bard-of-boyne',
    name:        'Bard of the Boyne',
    description: '30-day streak — legendary dedication!',
    icon:        '🎵',
    rarity:      'legendary',
    type:        'streak',
    condition:   ({ streak }) => streak >= 30,
  },
  {
    id:          'high-queen-tara',
    name:        'High Queen of Tara',
    description: 'Overall mastery over 80%!',
    icon:        '👑',
    rarity:      'legendary',
    type:        'mastery',
    condition:   ({ overallMastery }) => overallMastery >= 80,
  },

  // ── Subject badges ─────────────────────────────────────────────
  {
    id:          'english-bard',
    name:        'The Bard',
    description: 'English mastery unlocked!',
    icon:        '📚',
    rarity:      'rare',
    type:        'subject',
    subject:     'english',
    condition:   ({ subjectMastery }) => (subjectMastery?.english ?? 0) >= 85,
  },
  {
    id:          'gaeilge-wizard',
    name:        'Wizard of Words',
    description: 'Irish / Gaeilge mastery unlocked!',
    icon:        '☘️',
    rarity:      'rare',
    type:        'subject',
    subject:     'irish',
    condition:   ({ subjectMastery }) => (subjectMastery?.irish ?? 0) >= 85,
  },
  {
    id:          'maths-druid',
    name:        'Maths Druid',
    description: 'Mathematics mastery unlocked!',
    icon:        '🔢',
    rarity:      'rare',
    type:        'subject',
    subject:     'maths',
    condition:   ({ subjectMastery }) => (subjectMastery?.maths ?? 0) >= 85,
  },
  {
    id:          'time-guardian',
    name:        'Time Guardian',
    description: 'Completed 45 minutes in a single day!',
    icon:        '⏰',
    rarity:      'common',
    type:        'time',
    condition:   ({ dailyGoalMet }) => dailyGoalMet,
  },
  {
    id:          'perfect-quest',
    name:        'Perfect Quest',
    description: 'Got 10 correct answers in a row!',
    icon:        '⚡',
    rarity:      'epic',
    type:        'session',
    condition:   ({ correctStreak }) => correctStreak >= 10,
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
