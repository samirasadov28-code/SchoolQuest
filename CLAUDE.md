# SchoolQuest — Claude Code Guide

## What This Is
SchoolQuest — adaptive school prep for Emilia Asadova (8, 2nd class Ireland, finishing → 3rd class).
Built with React + Vite, Supabase (auth + DB), Groq API (AI explanations), deployed on Netlify.

## Tech Stack
| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite |
| Routing | React Router v6 |
| State | Zustand (persisted to localStorage) |
| Auth + DB | Supabase |
| AI | Groq API — `llama-3.1-8b-instant`, proxied via Netlify function (key stays server-side) |
| Hosting | Netlify (GitHub CI/CD) |
| PWA | vite-plugin-pwa + Workbox |

## Project Structure
```
src/
├── assets/emilia/     # Character sprites (take1: portrait, take2: action)
│   ├── take1/         idle, happy, thinking, wrong
│   └── take2/         celebrate, sad, nervous, frustrated
├── assets/badges/     # Chibi badge PNGs (Take 3)
├── assets/prizes/     # Unicorn Adventure prize photo PNGs
├── assets/rewards/    # Reward screen layout
├── components/shared/ # EmiliaCharacter (mood-driven sprite + speech bubble)
├── data/
│   ├── questions/     # JSON question bank (10 subjects, ~5,580 questions)
│   │   └── index.js   # Re-exports QUESTION_BANK array
│   └── prizes.js      # Digital prize collectibles + unlock logic
├── pages/             # LoginPage, RegisterPage, DashboardPage, SessionPage,
│                      # RewardsPage, ParentPage, MapPage
├── services/
│   ├── adaptive.js    # Adaptive engine, mastery scoring, session planner
│   ├── gamification.js # Badges, mythology regions, subject averages
│   ├── groq.js        # Learn Mode explanations + dynamic question gen (via proxy)
│   └── supabase.js    # Auth, progress, sessions, achievements, prizes
├── stores/
│   └── useStore.js    # Zustand global store (XP, mastery, streak, session)
└── theme/
    └── celtic.css     # Full Celtic/mythology design system

netlify/functions/
└── groq.mjs           # Serverless proxy — keeps GROQ_API_KEY off the client
scripts/
├── validate-questions.mjs        # Integrity checker (run in build + pre-commit)
└── generate-questions-improved.mjs # Groq generator w/ validation + dedup (local)
.githooks/pre-commit   # Runs validate-questions before each commit
```

## Key Concepts

### Adaptive Engine (`src/services/adaptive.js`)
- Each topic has a `mastery_score` (0–100)
- `pickNextQuestion()` weights questions by `(100 - mastery)` — weakest topics get more questions
- Emilia's starting weights: English=30, Irish=30, Maths=60 (based on report card)
- Learn Mode triggers when `mastery < 40 AND consecutiveWrong >= 2`
- Groq generates a child-friendly explanation when Learn Mode fires

### Gamification
- XP earned per correct answer: difficulty 1=5, 2=10, 3=15, 4=20, 5=25 XP
- Level = `floor(sqrt(xp / 50)) + 1`
- Streak increments daily (reset if a day is missed)
- 9 Badges: Celtic Explorer, Fionn's Friend, Druid Scholar, Sí Stone Seeker,
  Bard of the Boyne, High Queen of Tara, plus 3 subject badges
- 6 Digital Prize Photos (Unicorn Adventures) unlock at 100/300/600/1000/1500/2500 XP
- Parent can set physical prizes at custom XP thresholds via Parent Panel

### Character System
- **Take 1** (primary, portrait): idle, happy, thinking, wrong — used during sessions
- **Take 2** (action): celebrate, sad, nervous, frustrated — used for big moments
- **Take 3** (Chibi badges): badge icons on the Rewards screen

### Parent Mode
- Accessed from Dashboard via PIN (default: `1234`, stored in Supabase profile)
- Shows subject progress, weakest areas, session stats
- Parent adds prizes with XP thresholds
- Child shows "Prize Unlocked" screen to parent → parent confirms in Parent Panel

## Environment Variables
Copy `.env.example` → `.env.local`:
```
VITE_SUPABASE_URL=            # public (anon key protected by RLS)
VITE_SUPABASE_ANON_KEY=
GROQ_API_KEY=                 # SECRET — server-side only; set in Netlify, used by netlify/functions/groq.mjs
# VITE_GROQ_API_KEY=          # OPTIONAL local `vite dev` only; never set in production
VITE_PARENT_PIN=1234
```
⚠️ Never prefix the Groq key with `VITE_` in production — `VITE_*` vars are bundled
into the public client. The browser calls `/.netlify/functions/groq`; the key lives only
on the server. For full local parity run `netlify dev` (instead of `npm run dev`) with `GROQ_API_KEY` set.

## Supabase Schema
Run this SQL in the Supabase SQL editor:
```sql
create table profiles (
  id uuid references auth.users primary key,
  name text, email text, xp int default 0,
  level int default 1, streak int default 0,
  last_session_date date, parent_pin text default '1234',
  created_at timestamptz default now()
);

create table progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  subject text, topic text,
  mastery_score int default 0,
  questions_seen int default 0,
  last_practiced timestamptz,
  unique(user_id, subject, topic)
);

create table sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  date date, duration_seconds int,
  xp_earned int, subjects_covered text[],
  created_at timestamptz default now()
);

create table achievements (
  user_id uuid references profiles(id) on delete cascade,
  badge_id text,
  earned_at timestamptz default now(),
  primary key(user_id, badge_id)
);

create table prizes (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references profiles(id) on delete cascade,
  title text, xp_threshold int,
  status text default 'active',
  created_at timestamptz default now()
);

-- Enable RLS
alter table profiles   enable row level security;
alter table progress   enable row level security;
alter table sessions   enable row level security;
alter table achievements enable row level security;
alter table prizes     enable row level security;

-- RLS policies (users can only see their own data)
create policy "own profile" on profiles for all using (auth.uid() = id);
create policy "own progress" on progress for all using (auth.uid() = user_id);
create policy "own sessions" on sessions for all using (auth.uid() = user_id);
create policy "own achievements" on achievements for all using (auth.uid() = user_id);
create policy "own prizes" on prizes for all using (auth.uid() = child_id);
```

## Common Commands
```bash
npm run dev      # Start dev server (localhost:5173)
npm run validate # Check question bank integrity (4 options, answer∈options, unique ids…)
npm run build    # Runs validate, then production build (Netlify uses this)
npm run preview  # Preview production build locally
```

## Question Bank
~5,580 questions across 10 subjects, in `src/data/questions/*.json`, re-exported by `index.js`.
`subject` values: `english` `irish` `maths` `history` `geography` `science` `genknow` `sphe` `ethics` `coding`.
Curriculum topics/subtopics per subject are defined in `../CURRICULUM_FRAMEWORK.md`.

### Adding questions
Add to the relevant JSON in `src/data/questions/`. Format:
```json
{
  "id": "subj-topic-nnn",
  "subject": "english",
  "topic": "spelling",
  "difficulty": 1,
  "type": "multiple-choice",
  "question": "...",
  "options": ["A", "B", "C", "D"],
  "answer": "A",
  "explanation": "..."
}
```
Rules enforced by `npm run validate`: exactly 4 distinct `options`, `answer` must be one
of them, `difficulty` is an integer 1–5, unique `id`, no duplicate question text in a file.
- Bulk AI top-up (run locally, needs Groq network): `node scripts/generate-questions-improved.mjs <subject> <count>`
- Always run `npm run validate` after editing the bank (the pre-commit hook does this automatically).

## Deployment
1. Push to GitHub
2. Connect repo to Netlify
3. Build command: `npm run build` (runs the question-bank validator first; a bad question fails the deploy)
4. Publish directory: `dist`
5. Add environment variables in Netlify → Site settings → Environment variables:
   `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `GROQ_API_KEY` (server-side, no VITE_ prefix), `VITE_PARENT_PIN`
6. Functions auto-deploy from `netlify/functions/` (the Groq proxy).

## Git hooks
After `git init`, enable the pre-commit question-bank check once:
```bash
git config core.hooksPath .githooks
```
