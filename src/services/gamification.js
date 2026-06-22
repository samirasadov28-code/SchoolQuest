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
  { id: 'hill-of-tara',   subject: 'english',   name: 'Hill of Tara',    unlockAt: 50, emoji: '🏔️' },
  { id: 'river-boyne',    subject: 'history',   name: 'River Boyne',     unlockAt: 50, emoji: '🌊' },
  { id: 'burren',         subject: 'science',   name: 'The Burren',      unlockAt: 50, emoji: '🪨' },
  { id: 'wicklow-mtns',   subject: 'geography', name: 'Wicklow Mountains',unlockAt: 50, emoji: '⛰️' },
  { id: 'cliffs-moher',   subject: 'maths',     name: 'Cliffs of Moher', unlockAt: 50, emoji: '🌅' },
  { id: 'connemara',      subject: 'irish',     name: 'Connemara',       unlockAt: 50, emoji: '🌿' },
  { id: 'newgrange',      subject: 'genknow',   name: 'Newgrange',       unlockAt: 50, emoji: '🌀' },
  { id: 'ring-of-kerry',  subject: 'sphe',      name: 'Ring of Kerry',   unlockAt: 50, emoji: '💚' },
  { id: 'skellig-michael',subject: 'ethics',    name: 'Skellig Michael', unlockAt: 50, emoji: '🦅' },
]
