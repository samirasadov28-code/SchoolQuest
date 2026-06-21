/**
 * Adaptive Learning Engine
 * Weights question selection inversely to mastery score.
 * Ensures curriculum coverage — every subject appears at least once per 3 sessions.
 */

export const SUBJECTS = [
  { id: 'english',   label: 'English',           emoji: '📚', color: 'var(--subject-english)'  },
  { id: 'irish',     label: 'Irish / Gaeilge',   emoji: '☘️', color: 'var(--subject-irish)'    },
  { id: 'maths',     label: 'Mathematics',       emoji: '🔢', color: 'var(--subject-maths)'    },
  { id: 'history',   label: 'History',           emoji: '🏰', color: 'var(--subject-history)'  },
  { id: 'geography', label: 'Geography',         emoji: '🗺️', color: 'var(--subject-geography)'},
  { id: 'science',   label: 'Science',           emoji: '🔬', color: 'var(--subject-science)'  },
  { id: 'genknow',   label: 'World Explorer',    emoji: '🌍', color: 'var(--subject-genknow)'  },
  { id: 'sphe',      label: 'SPHE',              emoji: '💚', color: 'var(--subject-sphe)'     },
  { id: 'ethics',    label: 'Ethical Education', emoji: '⭐', color: 'var(--subject-ethics)'   },
  { id: 'coding',    label: 'Coding & Digital',  emoji: '💻', color: 'var(--subject-coding)'   },
]

// XP awarded per correct answer (scales with difficulty)
export const XP_PER_CORRECT = { 1: 5, 2: 10, 3: 15, 4: 20, 5: 25 }

// Session phase constants
export const DRILL_QUESTIONS_PER_TOPIC = 3  // questions per new topic in drill mode
export const TOPICS_BEFORE_REVIEW      = 5  // new topics before a review session kicks in
export const REVIEW_QUESTIONS          = 10 // questions in each adaptive review session
export const MASTERY_DELTA   = { correct: +10, incorrect: -5 }
export const MASTERY_FLOOR   = 0
export const MASTERY_CAP     = 100
export const LEARN_MODE_THRESHOLD = 40   // trigger Learn Mode if mastery < 40 AND 2 wrong in row
export const MASTERED_THRESHOLD   = 85   // badge eligible

// Neutral starting point for any child — adaptive engine learns from answers
export const INITIAL_MASTERY = {
  english:   50,
  irish:     50,
  maths:     50,
  history:   50,
  geography: 50,
  science:   50,
  genknow:   50,
  sphe:      50,
  ethics:    50,
  coding:    50,
}

/**
 * Pick the next question from the bank.
 * @param {Object[]} questionBank - full array of questions
 * @param {Object}   masteryMap   - { subject: { topic: score } }
 * @param {string[]} seenIds      - IDs shown in this session already
 * @param {string[]} sessionSubjects - subjects covered this session
 * @returns Question object
 */
/**
 * Pick the next question based on the current session phase.
 *
 * ctx shape:
 *   phase: 'drill' | 'review'
 *   drillTopic: { subject, topic } | null   — current topic being drilled
 *
 * Drill mode  — 3 Qs per new topic, then review after every 5 new topics.
 * Review mode — pure adaptive weighted pick (weakest topics get more questions).
 */
export function pickNextQuestion(questionBank, masteryMap, seenIds, sessionSubjects, ctx = {}) {
  const { phase = 'drill', drillTopic = null } = ctx
  const unseenBank = questionBank.filter(q => !seenIds.includes(q.id))
  if (unseenBank.length === 0) return questionBank[Math.floor(Math.random() * questionBank.length)]

  // REVIEW phase — topic-fair adaptive (pick topic first, then question)
  if (phase === 'review') return _topicFairWeightedPick(unseenBank, masteryMap)

  // DRILL phase — continue current topic if set
  if (drillTopic) {
    const qs = unseenBank.filter(q => q.subject === drillTopic.subject && q.topic === drillTopic.topic)
    if (qs.length > 0) return qs[Math.floor(Math.random() * qs.length)]
  }

  // DRILL phase — pick a brand-new topic, topic-fair (not biased by question count)
  const seenTopicKeys = new Set(
    questionBank.filter(q => seenIds.includes(q.id)).map(q => `${q.subject}::${q.topic}`)
  )
  // Collect unique fresh topic keys
  const freshTopicMap = {}
  for (const q of unseenBank) {
    const key = `${q.subject}::${q.topic}`
    if (!seenTopicKeys.has(key)) {
      if (!freshTopicMap[key]) freshTopicMap[key] = []
      freshTopicMap[key].push(q)
    }
  }
  const freshTopicKeys = Object.keys(freshTopicMap)
  if (freshTopicKeys.length > 0) {
    // Pick a random topic (each topic equally likely regardless of question count)
    const chosenKey = freshTopicKeys[Math.floor(Math.random() * freshTopicKeys.length)]
    const qs = freshTopicMap[chosenKey]
    return qs[Math.floor(Math.random() * qs.length)]
  }

  // All topics seen — fall back to topic-fair adaptive
  return _topicFairWeightedPick(unseenBank, masteryMap)
}

// Pick topic first weighted by (100 - mastery), then random question within that topic.
// Prevents high-volume subjects dominating just because they have more questions.
function _topicFairWeightedPick(unseenBank, masteryMap) {
  // Build a map of topic → questions
  const topicMap = {}
  for (const q of unseenBank) {
    const key = `${q.subject}::${q.topic}`
    if (!topicMap[key]) topicMap[key] = { subject: q.subject, topic: q.topic, qs: [] }
    topicMap[key].qs.push(q)
  }
  const topics = Object.values(topicMap)
  // Weight each topic by (100 - mastery score)
  const weighted = topics.map(t => ({
    t,
    weight: Math.max(1, 100 - (masteryMap[t.subject]?.[t.topic] ?? INITIAL_MASTERY[t.subject] ?? 50)),
  }))
  const total = weighted.reduce((s, w) => s + w.weight, 0)
  let rand = Math.random() * total
  for (const { t, weight } of weighted) {
    rand -= weight
    if (rand <= 0) {
      return t.qs[Math.floor(Math.random() * t.qs.length)]
    }
  }
  const last = topics[topics.length - 1]
  return last.qs[Math.floor(Math.random() * last.qs.length)]
}

/**
 * Calculate new mastery after an answer.
 */
export function updateMastery(currentScore, isCorrect) {
  const delta = isCorrect ? MASTERY_DELTA.correct : MASTERY_DELTA.incorrect
  return Math.max(MASTERY_FLOOR, Math.min(MASTERY_CAP, currentScore + delta))
}

/**
 * Should Learn Mode be triggered?
 */
export function shouldTriggerLearnMode(masteryScore, consecutiveWrong) {
  return masteryScore < LEARN_MODE_THRESHOLD && consecutiveWrong >= 2
}

/**
 * Format session time mm:ss
 */
export function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

/**
 * Daily session goal: 45 minutes = 2700 seconds
 */
export const DAILY_GOAL_SECONDS = 2700

/**
 * Compute overall mastery percentage across all subjects
 */
export function overallMastery(masteryMap) {
  const allScores = Object.values(masteryMap).flatMap(topics => Object.values(topics))
  if (allScores.length === 0) return 0
  return Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
}
