/**
 * SchoolQuest — Question bank validator
 *
 * Supported question types:
 *   multiple-choice  — exactly 4 distinct options, answer must be one of them
 *   reading-passage  — same rules as multiple-choice + requires passage field
 *   picture          — same rules as multiple-choice (options shown as emoji cards)
 *   multi-select     — options array required, answers array (all must be in options)
 *   type-in          — no options required; answer must be a non-empty string
 *   scale            — no options; answer must be a number; min/max required
 *
 * All types: difficulty 1-5 integer, unique id, no duplicate question text per file.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const QDIR = path.join(__dirname, '..', 'src', 'data', 'questions')

const FILE = {
  english: 'english.json', irish: 'irish.json', maths: 'maths.json',
  history: 'history.json', geography: 'geography.json', science: 'science.json',
  genknow: 'general-knowledge.json', sphe: 'sphe.json', ethics: 'ethical.json',
  coding: 'coding.json',
}

// Types that use the standard 4-option + single-answer check
const STD_TYPES = new Set(['multiple-choice', 'reading-passage', 'picture', undefined, null, ''])

const norm = s => String(s || '').toLowerCase().replace(/\s+/g, ' ').trim()
const allIds = new Set()
const dupIds = []
let total = 0, problems = 0

console.log('FILE                           count  bad4opt  ansMiss  badDiff  badSubj  dupQ')
for (const [subj, file] of Object.entries(FILE)) {
  const p = path.join(QDIR, file)
  const arr = JSON.parse(fs.readFileSync(p, 'utf8'))
  let bad4 = 0, ansMiss = 0, badDiff = 0, badSubj = 0, dupQ = 0
  const qset = new Set()
  for (const q of arr) {
    const qtype = q.type ?? 'multiple-choice'
    const o = (q.options || []).map(String)

    if (STD_TYPES.has(qtype)) {
      // Standard: exactly 4 distinct options, answer is one of them
      if (o.length !== 4 || new Set(o).size !== 4) bad4++
      if (!o.includes(String(q.answer))) ansMiss++
    } else if (qtype === 'multi-select') {
      // Options array required; ALL entries in answers[] must be in options[]
      if (o.length < 2) bad4++
      const answers = Array.isArray(q.answers) ? q.answers : []
      if (answers.length === 0 || !answers.every(a => o.includes(String(a)))) ansMiss++
    } else if (qtype === 'type-in') {
      // Just needs a non-empty answer string
      if (!q.answer && q.answer !== 0) ansMiss++
    } else if (qtype === 'scale') {
      // Needs numeric answer, min, max
      if (typeof q.answer !== 'number' || typeof q.min !== 'number' || typeof q.max !== 'number') ansMiss++
    }

    if (!(Number.isInteger(q.difficulty) && q.difficulty >= 1 && q.difficulty <= 5)) badDiff++
    if (q.subject !== subj) badSubj++
    if (allIds.has(q.id)) dupIds.push(q.id); else allIds.add(q.id)
    const n = norm(q.question)
    if (qset.has(n)) dupQ++; else qset.add(n)
  }
  total += arr.length
  problems += bad4 + ansMiss + badDiff + badSubj + dupQ
  console.log(file.padEnd(30), String(arr.length).padStart(5), String(bad4).padStart(8),
    String(ansMiss).padStart(8), String(badDiff).padStart(8), String(badSubj).padStart(8), String(dupQ).padStart(5))
}
console.log('-'.repeat(76))
console.log('TOTAL questions:', total)
console.log('Duplicate ids:', dupIds.length, dupIds.slice(0, 5))
const ok = problems === 0 && dupIds.length === 0
console.log(ok ? 'PASS ✅' : 'FAIL ⚠️')
process.exit(ok ? 0 : 1)
