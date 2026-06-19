import { QUESTION_BANK } from '../data/questions/index.js'

export const SUBJECT_WEIGHTS = {
  english: 30,
  irish: 30,
  maths: 60,
  history: 50,
  geography: 50,
  science: 50,
  genknow: 50,
  sphe: 50,
  ethics: 50,
  coding: 50
}

export function pickNextQuestion(masteryMap, usedIds = []) {
  const available = QUESTION_BANK.filter(q => !usedIds.includes(q.id))
  const pool = available.length ? available : QUESTION_BANK

  const weighted = pool.map(q => {
    const mastery = masteryMap[`${q.subject}:${q.topic}`] ?? SUBJECT_WEIGHTS[q.subject] ?? 50
    const weight = Math.max(1, 100 - mastery)
    return { q, weight }
  })

  const total = weighted.reduce((s, w) => s + w.weight, 0)
  let rand = Math.random() * total
  for (const { q, weight } of weighted) {
    rand -= weight
    if (rand <= 0) return q
  }
  return weighted[0].q
}

export function updateMastery(currentMastery, isCorrect, difficulty) {
  const delta = isCorrect ? difficulty * 3 : -(difficulty * 2)
  return Math.max(0, Math.min(100, (currentMastery ?? 50) + delta))
}

export function shouldTriggerLearnMode(mastery, consecutiveWrong) {
  return mastery < 40 && consecutiveWrong >= 2
}

export function calcXP(difficulty) {
  return difficulty * 5
}

export function calcLevel(xp) {
  return Math.floor(Math.sqrt(xp / 50)) + 1
}
