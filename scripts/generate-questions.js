/**
 * SchoolQuest — Groq Question Generator
 * 
 * Generates additional questions for each subject/topic using the Groq API,
 * then appends them to the existing JSON question bank files.
 * 
 * Usage:
 *   node scripts/generate-questions.js [subject] [count]
 * 
 * Examples:
 *   node scripts/generate-questions.js              # Generate for ALL subjects
 *   node scripts/generate-questions.js maths 100    # 100 new maths questions
 *   node scripts/generate-questions.js coding 50    # 50 new coding questions
 * 
 * Requirements:
 *   VITE_GROQ_API_KEY must be in .env.local (or set as env var GROQ_API_KEY)
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const QUESTIONS_DIR = path.join(ROOT, 'src/data/questions')

// ── Load API key from .env.local ───────────────────────────────────────────
function loadEnv() {
  const envPath = path.join(ROOT, '.env.local')
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
      const [key, ...rest] = line.split('=')
      if (key && rest.length) process.env[key.trim()] = rest.join('=').trim()
    }
  }
}
loadEnv()

const GROQ_API_KEY = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY
if (!GROQ_API_KEY) {
  console.error('❌  GROQ_API_KEY not found. Add it to .env.local as VITE_GROQ_API_KEY=...')
  process.exit(1)
}

// ── Subject configuration ──────────────────────────────────────────────────
const SUBJECT_CONFIG = {
  maths: {
    file: 'maths.json',
    subject: 'maths',
    topics: [
      { topic: 'multiplication', target: 40, age: '8-9' },
      { topic: 'division', target: 40, age: '8-9' },
      { topic: 'fractions', target: 35, age: '8-9' },
      { topic: 'addition', target: 30, age: '8-9' },
      { topic: 'subtraction', target: 30, age: '8-9' },
      { topic: 'mental-maths', target: 35, age: '8-9' },
      { topic: 'place-value', target: 30, age: '8-9' },
      { topic: 'shapes', target: 30, age: '8-9' },
      { topic: 'measurement', target: 30, age: '8-9' },
      { topic: 'time', target: 30, age: '8-9' },
      { topic: 'money', target: 25, age: '8-9' },
      { topic: 'word-problems', target: 35, age: '8-9' },
      { topic: 'data', target: 20, age: '8-9' },
    ],
  },
  english: {
    file: 'english.json',
    subject: 'english',
    topics: [
      { topic: 'spelling', target: 50, age: '8-9' },
      { topic: 'grammar', target: 50, age: '8-9' },
      { topic: 'reading', target: 50, age: '8-9' },
      { topic: 'writing', target: 40, age: '8-9' },
      { topic: 'punctuation', target: 50, age: '8-9' },
      { topic: 'plurals', target: 30, age: '8-9' },
      { topic: 'compound-words', target: 30, age: '8-9' },
      { topic: 'vocabulary', target: 40, age: '8-9' },
    ],
  },
  irish: {
    file: 'irish.json',
    subject: 'irish',
    topics: [
      { topic: 'vocabulary', target: 80, age: '8-9' },
      { topic: 'numbers', target: 40, age: '8-9' },
      { topic: 'colours', target: 30, age: '8-9' },
      { topic: 'phrases', target: 50, age: '8-9' },
      { topic: 'animals', target: 40, age: '8-9' },
      { topic: 'family', target: 30, age: '8-9' },
      { topic: 'weather', target: 30, age: '8-9' },
      { topic: 'days-months', target: 30, age: '8-9' },
      { topic: 'school', target: 30, age: '8-9' },
      { topic: 'food', target: 30, age: '8-9' },
    ],
  },
  history: {
    file: 'history.json',
    subject: 'history',
    topics: [
      { topic: 'irish-history', target: 80, age: '8-9' },
      { topic: 'world-history', target: 50, age: '8-9' },
      { topic: 'ancient-ireland', target: 60, age: '8-9' },
      { topic: 'vikings', target: 50, age: '8-9' },
      { topic: 'normans', target: 40, age: '8-9' },
      { topic: 'early-christian-ireland', target: 40, age: '8-9' },
      { topic: 'famous-irish-people', target: 40, age: '8-9' },
      { topic: 'changes-over-time', target: 30, age: '8-9' },
    ],
  },
  geography: {
    file: 'geography.json',
    subject: 'geography',
    topics: [
      { topic: 'ireland', target: 80, age: '8-9' },
      { topic: 'world-geography', target: 80, age: '8-9' },
      { topic: 'weather', target: 40, age: '8-9' },
      { topic: 'maps', target: 40, age: '8-9' },
      { topic: 'continents-oceans', target: 50, age: '8-9' },
      { topic: 'environment', target: 30, age: '8-9' },
      { topic: 'rivers-mountains', target: 40, age: '8-9' },
    ],
  },
  science: {
    file: 'science.json',
    subject: 'science',
    topics: [
      { topic: 'living-things', target: 80, age: '8-9' },
      { topic: 'plants', target: 50, age: '8-9' },
      { topic: 'animals', target: 50, age: '8-9' },
      { topic: 'human-body', target: 50, age: '8-9' },
      { topic: 'materials', target: 40, age: '8-9' },
      { topic: 'energy', target: 40, age: '8-9' },
      { topic: 'forces', target: 40, age: '8-9' },
      { topic: 'space', target: 40, age: '8-9' },
      { topic: 'light-sound', target: 30, age: '8-9' },
    ],
  },
  genknow: {
    file: 'general-knowledge.json',
    subject: 'genknow',
    topics: [
      { topic: 'animals', target: 80, age: '8-9' },
      { topic: 'world-facts', target: 60, age: '8-9' },
      { topic: 'human-body', target: 50, age: '8-9' },
      { topic: 'food', target: 40, age: '8-9' },
      { topic: 'technology', target: 40, age: '8-9' },
      { topic: 'space', target: 40, age: '8-9' },
      { topic: 'famous-people', target: 40, age: '8-9' },
      { topic: 'irish-culture', target: 40, age: '8-9' },
      { topic: 'nature', target: 40, age: '8-9' },
      { topic: 'world-records', target: 30, age: '8-9' },
    ],
  },
  sphe: {
    file: 'sphe.json',
    subject: 'sphe',
    topics: [
      { topic: 'feelings', target: 70, age: '8-9' },
      { topic: 'health', target: 70, age: '8-9' },
      { topic: 'safety', target: 60, age: '8-9' },
      { topic: 'friendships', target: 60, age: '8-9' },
      { topic: 'choices', target: 50, age: '8-9' },
      { topic: 'communication', target: 40, age: '8-9' },
      { topic: 'wellbeing', target: 50, age: '8-9' },
      { topic: 'bullying', target: 50, age: '8-9' },
    ],
  },
  ethics: {
    file: 'ethical.json',
    subject: 'ethics',
    topics: [
      { topic: 'values', target: 80, age: '8-9' },
      { topic: 'rights-responsibilities', target: 70, age: '8-9' },
      { topic: 'environment', target: 60, age: '8-9' },
      { topic: 'justice-fairness', target: 60, age: '8-9' },
      { topic: 'diversity', target: 50, age: '8-9' },
      { topic: 'empathy', target: 50, age: '8-9' },
      { topic: 'community', target: 30, age: '8-9' },
    ],
  },
  coding: {
    file: 'coding.json',
    subject: 'coding',
    topics: [
      { topic: 'computing-basics', target: 40, age: '8-9' },
      { topic: 'algorithms', target: 50, age: '8-9' },
      { topic: 'loops', target: 40, age: '8-9' },
      { topic: 'debugging', target: 40, age: '8-9' },
      { topic: 'internet-safety', target: 50, age: '8-9' },
      { topic: 'scratch', target: 40, age: '8-9' },
      { topic: 'data', target: 40, age: '8-9' },
      { topic: 'sequences', target: 40, age: '8-9' },
      { topic: 'input-output', target: 30, age: '8-9' },
      { topic: 'digital-citizenship', target: 30, age: '8-9' },
    ],
  },
}

// ── Groq API call ──────────────────────────────────────────────────────────
async function callGroq(prompt, maxTokens = 3000) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      max_tokens: maxTokens,
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: `You are an expert Irish primary school curriculum question writer for 3rd class (ages 8-9). 
You write engaging, accurate multiple-choice questions that follow the Irish Primary School Curriculum.
You always respond with VALID JSON only — no markdown, no explanation, just a JSON array.
Each question must have exactly these fields: id, subject, topic, difficulty (1-5), type ("multiple-choice"), question, options (array of 4 strings), answer (must exactly match one option), explanation.
The explanation should be warm, encouraging, and educational — written for an 8-9 year old.
Vary the difficulty: roughly 30% difficulty 1-2 (easy), 40% difficulty 3 (medium), 30% difficulty 4-5 (harder).
Make questions specific, interesting, and curriculum-accurate. Avoid trivial or trick questions.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Groq API error ${res.status}: ${err}`)
  }

  const data = await res.json()
  return data.choices[0].message.content
}

// ── Generate questions for one topic ──────────────────────────────────────
async function generateForTopic(subjectId, topicConfig, existingIds, batchSize = 15) {
  const { topic, age } = topicConfig
  const prompt = `Generate ${batchSize} multiple-choice questions about "${topic}" for Irish 3rd class students (age ${age}).

Subject: ${subjectId}
Topic: ${topic}
Irish curriculum context: These are for a school preparation app following the Irish Primary School Curriculum.

Use these ID prefixes for the questions:
- Subject: ${subjectId}, Topic: ${topic}
- IDs should follow pattern like: ${subjectId.slice(0,3)}-${topic.slice(0,4)}-XXX where XXX is a 3-digit number starting from ${Math.floor(Math.random() * 900) + 100}

For the topic "${topic}" in subject "${subjectId}", make sure questions are:
- Age-appropriate for 8-9 year olds
- Curriculum accurate for Irish 3rd class
- Varied in difficulty (mix of easy, medium, hard)
- Engaging and sometimes relating to Irish context, nature, or everyday life
- Clear and unambiguous (one definitely correct answer)

Return ONLY a JSON array of ${batchSize} question objects. No other text.`

  try {
    const raw = await callGroq(prompt)
    // Extract JSON from response (handle any surrounding text)
    const jsonMatch = raw.match(/\[[\s\S]*\]/)
    if (!jsonMatch) throw new Error('No JSON array found in response')
    
    const questions = JSON.parse(jsonMatch[0])
    
    // Validate and deduplicate
    return questions.filter(q => {
      if (!q.id || !q.question || !q.options || !q.answer || !q.explanation) return false
      if (existingIds.has(q.id)) return false
      if (!q.options.includes(q.answer)) return false
      if (q.options.length !== 4) return false
      // Ensure correct subject/topic
      q.subject = subjectId
      q.topic = topic
      q.type = 'multiple-choice'
      existingIds.add(q.id)
      return true
    })
  } catch (err) {
    console.warn(`  ⚠️  Failed to parse Groq response for ${subjectId}/${topic}: ${err.message}`)
    return []
  }
}

// ── Main generation function ───────────────────────────────────────────────
async function generateSubject(subjectId, requestedCount = null) {
  const config = SUBJECT_CONFIG[subjectId]
  if (!config) {
    console.error(`Unknown subject: ${subjectId}. Available: ${Object.keys(SUBJECT_CONFIG).join(', ')}`)
    return
  }

  const filePath = path.join(QUESTIONS_DIR, config.file)
  let existing = []
  if (fs.existsSync(filePath)) {
    existing = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  }
  
  const existingIds = new Set(existing.map(q => q.id))
  console.log(`\n📚 Subject: ${subjectId} (${existing.length} existing questions)`)

  let allNew = []

  for (const topicConfig of config.topics) {
    const { topic, target } = topicConfig
    const currentCount = existing.filter(q => q.topic === topic).length
    const needed = requestedCount 
      ? Math.ceil(requestedCount / config.topics.length)
      : Math.max(0, target - currentCount)
    
    if (needed <= 0) {
      console.log(`  ✓ ${topic}: ${currentCount} questions (target met)`)
      continue
    }

    console.log(`  → ${topic}: ${currentCount} existing, generating ~${needed} more...`)

    // Generate in batches of 15
    const batches = Math.ceil(needed / 15)
    let topicNew = []
    
    for (let b = 0; b < batches; b++) {
      const batchSize = Math.min(15, needed - topicNew.length)
      if (batchSize <= 0) break
      
      process.stdout.write(`     Batch ${b + 1}/${batches}... `)
      const newQs = await generateForTopic(subjectId, topicConfig, existingIds, batchSize)
      topicNew = topicNew.concat(newQs)
      console.log(`${newQs.length} questions added`)
      
      // Rate limiting: wait 500ms between calls
      if (b < batches - 1) await new Promise(r => setTimeout(r, 500))
    }

    allNew = allNew.concat(topicNew)
    console.log(`  ✓ ${topic}: +${topicNew.length} new (total: ${currentCount + topicNew.length})`)
  }

  // Save combined questions
  const combined = [...existing, ...allNew]
  fs.writeFileSync(filePath, JSON.stringify(combined, null, 2), 'utf8')
  console.log(`\n✅ ${subjectId}: ${existing.length} → ${combined.length} questions (+${allNew.length} new)`)
  return allNew.length
}

// ── Run ────────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2)
  const targetSubject = args[0]
  const count = args[1] ? parseInt(args[1]) : null

  console.log('🎓 SchoolQuest Question Generator')
  console.log('══════════════════════════════════')

  if (targetSubject && targetSubject !== 'all') {
    await generateSubject(targetSubject, count)
  } else {
    // Generate for all subjects
    let totalNew = 0
    for (const subjectId of Object.keys(SUBJECT_CONFIG)) {
      totalNew += await generateSubject(subjectId) || 0
    }
    console.log(`\n🎉 Total new questions generated: ${totalNew}`)
    
    // Print final counts
    console.log('\n📊 Final question counts:')
    for (const [sid, cfg] of Object.entries(SUBJECT_CONFIG)) {
      const filePath = path.join(QUESTIONS_DIR, cfg.file)
      if (fs.existsSync(filePath)) {
        const qs = JSON.parse(fs.readFileSync(filePath, 'utf8'))
        console.log(`   ${sid}: ${qs.length}`)
      }
    }
  }
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
