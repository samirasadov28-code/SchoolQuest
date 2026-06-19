export const BADGES = [
  {
    id: 'celtic-explorer',
    name: 'Celtic Explorer',
    icon: '🗺️',
    description: 'Complete your first session',
    condition: (stats) => stats.totalSessions >= 1
  },
  {
    id: 'fionns-friend',
    name: "Fionn's Friend",
    icon: '🐟',
    description: 'Answer 50 questions correctly',
    condition: (stats) => stats.totalCorrect >= 50
  },
  {
    id: 'druid-scholar',
    name: 'Druid Scholar',
    icon: '🌿',
    description: 'Reach mastery 80+ in any topic',
    condition: (stats) => stats.maxMastery >= 80
  },
  {
    id: 'si-stone-seeker',
    name: 'Sí Stone Seeker',
    icon: '🪨',
    description: 'Maintain a 7-day streak',
    condition: (stats) => stats.streak >= 7
  },
  {
    id: 'bard-of-boyne',
    name: 'Bard of the Boyne',
    icon: '🎵',
    description: 'Complete 10 sessions',
    condition: (stats) => stats.totalSessions >= 10
  },
  {
    id: 'high-queen-tara',
    name: 'High Queen of Tara',
    icon: '👑',
    description: 'Reach Level 10',
    condition: (stats) => stats.level >= 10
  },
  {
    id: 'maths-master',
    name: 'Maths Master',
    icon: '🔢',
    description: 'Reach 80% mastery in Maths',
    condition: (stats) => (stats.subjectAverages?.maths ?? 0) >= 80
  },
  {
    id: 'english-enchanter',
    name: 'English Enchanter',
    icon: '📚',
    description: 'Reach 80% mastery in English',
    condition: (stats) => (stats.subjectAverages?.english ?? 0) >= 80
  },
  {
    id: 'irish-hero',
    name: 'Irish Hero',
    icon: '☘️',
    description: 'Reach 80% mastery in Irish',
    condition: (stats) => (stats.subjectAverages?.irish ?? 0) >= 80
  }
]

export function checkNewBadges(stats, earned) {
  return BADGES.filter(b => !earned.includes(b.id) && b.condition(stats)).map(b => b.id)
}

export function subjectAverage(masteryMap, subject) {
  const entries = Object.entries(masteryMap).filter(([k]) => k.startsWith(subject + ':'))
  if (!entries.length) return 0
  return Math.round(entries.reduce((s, [, v]) => s + v, 0) / entries.length)
}

export const MYTHOLOGY_REGIONS = [
  { name: 'The Emerald Plains', subject: 'maths', color: '#14b8a6', icon: '🌿' },
  { name: 'Tír na nÓg', subject: 'english', color: '#a855f7', icon: '🌟' },
  { name: "Fionn's Forest", subject: 'irish', color: '#22c55e', icon: '🌲' },
  { name: 'The Hill of Tara', subject: 'history', color: '#f59e0b', icon: '🏰' },
  { name: 'The Wild Atlantic', subject: 'geography', color: '#3b82f6', icon: '🌊' },
  { name: "The Druid's Grove", subject: 'science', color: '#8b5cf6', icon: '🧪' },
  { name: 'The Storyteller Circle', subject: 'genknow', color: '#ec4899', icon: '📖' },
  { name: "The Healer's Hearth", subject: 'sphe', color: '#f97316', icon: '🔥' },
  { name: 'The Sacred Grove', subject: 'ethics', color: '#84cc16', icon: '🌱' },
  { name: "Lugh's Workshop", subject: 'coding', color: '#06b6d4', icon: '⚡' }
]
