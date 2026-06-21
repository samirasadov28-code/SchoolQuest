/**
 * Fix question bank issues:
 * 1. Remove questions with != 4 distinct options (bad4opt)
 * 2. Remove duplicate questions (keep first occurrence, case/whitespace insensitive)
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const QDIR = path.join(__dirname, '..', 'src', 'data', 'questions')

const FILE = {
  english: 'english.json',
  irish: 'irish.json',
  maths: 'maths.json',
  history: 'history.json',
  geography: 'geography.json',
  science: 'science.json',
  genknow: 'general-knowledge.json',
  sphe: 'sphe.json',
  ethics: 'ethical.json',
  coding: 'coding.json',
}

const norm = s => String(s || '').toLowerCase().replace(/\s+/g, ' ').trim()

for (const [subj, file] of Object.entries(FILE)) {
  const p = path.join(QDIR, file)
  const arr = JSON.parse(fs.readFileSync(p, 'utf8'))
  const before = arr.length
  let bad4Removed = 0, dupQRemoved = 0

  const qset = new Set()
  const fixed = []

  for (const q of arr) {
    const o = (q.options || []).map(String)
    const distinctOpts = [...new Set(o)]

    // Check 4 distinct options
    if (distinctOpts.length !== 4 || o.length !== 4) {
      bad4Removed++
      continue
    }

    // Check duplicate question text
    const n = norm(q.question)
    if (qset.has(n)) {
      dupQRemoved++
      continue
    }
    qset.add(n)
    fixed.push(q)
  }

  if (bad4Removed > 0 || dupQRemoved > 0) {
    fs.writeFileSync(p, JSON.stringify(fixed, null, 2))
    console.log(`${file}: removed ${bad4Removed} bad4opt, ${dupQRemoved} dupQ (${before} → ${fixed.length})`)
  } else {
    console.log(`${file}: no changes needed`)
  }
}

console.log('\nDone.')
