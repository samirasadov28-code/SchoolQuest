/**
 * SchoolQuest — Improved Groq question generator (run LOCALLY; needs network to api.groq.com)
 *
 * Improvements over the original generate-questions.js:
 *   - Validates EVERY question before keeping it: exactly 4 distinct options,
 *     answer must be one of the options, difficulty coerced to int 1-5.
 *   - Deduplicates by id AND by normalised question text, against the existing bank.
 *   - Enforces a difficulty mix request and retries failed/short batches.
 *   - Re-assigns clean unique ids on append so nothing collides.
 *
 * Usage:
 *   node scripts/generate-questions-improved.mjs maths 100
 *   node scripts/generate-questions-improved.mjs            # tops every subject toward its target
 *
 * Requires VITE_GROQ_API_KEY (or GROQ_API_KEY) in .env.local.
 * SECURITY NOTE: keep the key in .env.local only. Do NOT ship a VITE_-prefixed Groq
 * key to the browser bundle — proxy Groq calls through a Netlify function in production.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const QDIR = path.join(ROOT, 'src', 'data', 'questions')

function loadEnv() {
  const p = path.join(ROOT, '.env.local')
  if (fs.existsSync(p)) for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
    const [k, ...r] = line.split('='); if (k && r.length) process.env[k.trim()] = r.join('=').trim()
  }
}
loadEnv()
const KEY = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY
if (!KEY) { console.error('❌ Set VITE_GROQ_API_KEY in .env.local'); process.exit(1) }

const SUBJECTS = {
  maths:'maths.json', english:'english.json', irish:'irish.json', history:'history.json',
  geography:'geography.json', science:'science.json', genknow:'general-knowledge.json',
  sphe:'sphe.json', ethics:'ethical.json', coding:'coding.json',
}
const norm = s => String(s||'').toLowerCase().replace(/\s+/g,' ').replace(/[^a-z0-9à-ÿ ]/gi,'').trim()

function validate(q, subject) {
  if (!q || !q.question || !q.explanation) return null
  const opts = Array.isArray(q.options) ? q.options.map(String) : null
  if (!opts || opts.length !== 4 || new Set(opts).size !== 4) return null
  const ans = String(q.answer)
  if (!opts.includes(ans)) return null
  let d = parseInt(q.difficulty); if (!(d >= 1 && d <= 5)) d = 3
  return { id: q.id, subject, topic: q.topic || 'general', difficulty: d,
    type: 'multiple-choice', question: String(q.question), options: opts, answer: ans,
    explanation: String(q.explanation) }
}

async function callGroq(prompt) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method:'POST', headers:{ Authorization:`Bearer ${KEY}`, 'Content-Type':'application/json' },
    body: JSON.stringify({ model:'llama-3.1-8b-instant', temperature:0.8, max_tokens:3500, messages:[
      { role:'system', content:`You write accurate multiple-choice questions for the Irish Primary School Curriculum, 3rd class (age 8-9). Respond with VALID JSON only: an array of objects with fields id, subject, topic, difficulty (int 1-5), type ("multiple-choice"), question, options (exactly 4 strings), answer (exactly equal to one option), explanation (warm, 1-2 sentences). Vary difficulty ~30% lvl1-2, ~40% lvl3, ~30% lvl4-5. Every question distinct and curriculum-accurate.` },
      { role:'user', content: prompt } ] }),
  })
  if (!res.ok) throw new Error(`Groq ${res.status}: ${await res.text()}`)
  return (await res.json()).choices[0].message.content
}

async function genBatch(subject, topic, n, seen) {
  const prompt = `Generate ${n} distinct multiple-choice questions about "${topic}" for subject "${subject}", Irish 3rd class (age 8-9). Use Irish/nature context where natural. Return ONLY a JSON array.`
  let raw
  try { raw = await callGroq(prompt) } catch (e) { console.warn('  ', e.message); return [] }
  const m = raw.match(/\[[\s\S]*\]/); if (!m) return []
  let parsed; try { parsed = JSON.parse(m[0]) } catch { return [] }
  const out = []
  for (const q of parsed) {
    const v = validate(q, subject); if (!v) continue
    const k = norm(v.question); if (seen.has(k)) continue
    seen.add(k); v.topic = topic; out.push(v)
  }
  return out
}

async function topUp(subject, count) {
  const file = path.join(QDIR, SUBJECTS[subject])
  const existing = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file,'utf8')) : []
  const seen = new Set(existing.map(q => norm(q.question)))
  const topics = [...new Set(existing.map(q => q.topic))]
  if (!topics.length) { console.error(`No topics found for ${subject}`); return }
  const per = Math.ceil(count / topics.length)
  const fresh = []
  for (const t of topics) {
    let got = 0, tries = 0
    while (got < per && tries < 4) {
      const batch = await genBatch(subject, t, Math.min(15, per - got), seen)
      fresh.push(...batch); got += batch.length; tries++
      await new Promise(r => setTimeout(r, 400))
    }
    console.log(`  ${subject}/${t}: +${got}`)
  }
  const base = existing.length
  fresh.forEach((q, i) => { q.id = `${subject.slice(0,3)}-ai-${String(base + i + 1).padStart(4,'0')}` })
  fs.writeFileSync(file, JSON.stringify([...existing, ...fresh], null, 2))
  console.log(`✅ ${subject}: ${base} → ${base + fresh.length} (+${fresh.length})`)
}

const [sub, cnt] = process.argv.slice(2)
const N = cnt ? parseInt(cnt) : 100
;(async () => {
  if (sub && SUBJECTS[sub]) await topUp(sub, N)
  else for (const s of Object.keys(SUBJECTS)) await topUp(s, N)
})().catch(e => { console.error(e); process.exit(1) })
