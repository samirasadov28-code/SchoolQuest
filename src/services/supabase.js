import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  || 'https://xyzcompany.supabase.co'
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MDAwMDAwMDAsImV4cCI6MTkwMDAwMDAwMH0.placeholder'

export const supabase = createClient(supabaseUrl, supabaseKey)

// ── Auth helpers ──────────────────────────────────────────────

export async function signUp(email, password, name, pin = '1234') {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  })
  if (error) throw error

  // Create profile row
  await supabase.from('profiles').insert({
    id: data.user.id,
    name,
    email,
    xp: 0,
    level: 1,
    streak: 0,
    last_session_date: null,
    parent_pin: pin,
  })
  return data.user
}

export async function signIn(email, password, rememberMe = true) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  if (rememberMe) {
    localStorage.removeItem('sq-no-persist')
    sessionStorage.setItem('sq-logged-in', '1')
  } else {
    localStorage.setItem('sq-no-persist', '1')
    sessionStorage.setItem('sq-logged-in', '1')
  }
  return data.user
}

export async function signOut() {
  await supabase.auth.signOut()
}

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data
}

export async function updateProfile(userId, updates) {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
  if (error) throw error
}

// ── Progress helpers ──────────────────────────────────────────

export async function getProgress(userId) {
  const { data, error } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', userId)
  if (error) throw error
  return data
}

export async function upsertProgress(userId, subject, topic, masteryDelta) {
  // Get existing row
  const { data: existing } = await supabase
    .from('progress')
    .select('mastery_score, questions_seen')
    .eq('user_id', userId)
    .eq('subject', subject)
    .eq('topic', topic)
    .single()

  const currentScore    = existing?.mastery_score  ?? 0
  const currentSeen     = existing?.questions_seen ?? 0
  const newScore        = Math.max(0, Math.min(100, currentScore + masteryDelta))

  const { error } = await supabase.from('progress').upsert({
    user_id:        userId,
    subject,
    topic,
    mastery_score:  newScore,
    questions_seen: currentSeen + 1,
    last_practiced: new Date().toISOString(),
  }, { onConflict: 'user_id,subject,topic' })

  if (error) throw error
  return newScore
}

// ── Session logging ───────────────────────────────────────────

export async function logSession(userId, durationSeconds, xpEarned, subjectsCovered) {
  const { error } = await supabase.from('sessions').insert({
    user_id:          userId,
    date:             new Date().toISOString().split('T')[0],
    duration_seconds: durationSeconds,
    xp_earned:        xpEarned,
    subjects_covered: subjectsCovered,
  })
  if (error) throw error
}

// ── Achievements ──────────────────────────────────────────────

export async function getAchievements(userId) {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('user_id', userId)
  if (error) throw error
  return data
}

export async function grantAchievement(userId, badgeId) {
  // Idempotent — won't duplicate
  const { error } = await supabase.from('achievements').upsert(
    { user_id: userId, badge_id: badgeId, earned_at: new Date().toISOString() },
    { onConflict: 'user_id,badge_id' }
  )
  if (error) throw error
}

// ── Prizes ────────────────────────────────────────────────────

export async function getPrizes(userId) {
  const { data, error } = await supabase
    .from('prizes')
    .select('*')
    .eq('child_id', userId)
    .order('xp_threshold', { ascending: true })
  if (error) throw error
  return data
}

export async function addPrize(childId, title, xpThreshold) {
  const { error } = await supabase.from('prizes').insert({
    child_id:      childId,
    title,
    xp_threshold:  xpThreshold,
    status:        'active',
  })
  if (error) throw error
}

export async function claimPrize(prizeId) {
  const { error } = await supabase
    .from('prizes')
    .update({ status: 'claimed' })
    .eq('id', prizeId)
  if (error) throw error
}

export async function confirmPrize(prizeId) {
  const { error } = await supabase
    .from('prizes')
    .update({ status: 'confirmed' })
    .eq('id', prizeId)
  if (error) throw error
}
