/**
 * SchoolQuest — Question bank validator
 *
 * Checks every question JSON file for structural integrity:
 *   - valid JSON
 *   - exactly 4 distinct options
 *   - answer is one of the options (character-for-character)
 *   - difficulty is an integer 1-5
 *   - subject field matches the file
 *   - globally unique ids
 *   - no duplicate question text within a file
 *
 * Usage:  node scripts/validate-questions.mjs
 * Exit code 1 if any problem is found (handy for CI / pre-commit).
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

const norm = s => String(s || '').toLowerCase().replace(/\s+/g, ' ').trim()
const allIds = new Set()
const dupIds = []
let total = 0, problems = 0

console.log('FILE                       count  bad4opt  ansMiss  badDiff  badSubj  dupQ')
for (const [subj, file] of Object.entries(FILE)) {
  const p = path.join(QDIR, file)
  const arr = JSON.parse(fs.readFileSync(p, 'utf8'))
  let bad4 = 0, ansMiss = 0, badDiff = 0, badSubj = 0, dupQ = 0
  const qset = new Set()
  for (const q of arr) {
    const o = (q.options || []).map(String)
    if (o.length !== 4 || new Set(o).size !== 4) bad4++
    if (!o.includes(String(q.answer))) ansMiss++
    if (!(Number.isInteger(q.difficulty) && q.difficulty >= 1 && q.difficulty <= 5)) badDiff++
    if (q.subject !== subj) badSubj++
    if (allIds.has(q.id)) dupIds.push(q.id); else allIds.add(q.id)
    const n = norm(q.question)
    if (qset.has(n)) dupQ++; else qset.add(n)
  }
  total += arr.length
  problems += bad4 + ansMiss + badDiff + badSubj + dupQ
  console.log(file.padEnd(26), String(arr.length).padStart(5), String(bad4).padStart(8),
    String(ansMiss).padStart(8), String(badDiff).padStart(8), String(badSubj).padStart(8), String(dupQ).padStart(5))
}
console.log('-'.repeat(72))
console.log('TOTAL questions:', total)
console.log('Duplicate ids:', dupIds.length, dupIds.slice(0, 5))
const ok = problems === 0 && dupIds.length === 0
console.log(ok ? 'PASS ✅' : 'FAIL ⚠️')
process.exit(ok ? 0 : 1)
