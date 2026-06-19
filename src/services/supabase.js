import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co',
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder'
)

export default supabase

export async function getProfile(userId) {
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
  return data
}

export async function upsertProfile(profile) {
  const { data } = await supabase.from('profiles').upsert(profile).select().single()
  return data
}

export async function getProgress(userId) {
  const { data } = await supabase.from('progress').select('*').eq('user_id', userId)
  return data || []
}

export async function upsertProgress(row) {
  await supabase.from('progress').upsert(row, { onConflict: 'user_id,subject,topic' })
}

export async function saveSession(session) {
  await supabase.from('sessions').insert(session)
}

export async function getAchievements(userId) {
  const { data } = await supabase.from('achievements').select('*').eq('user_id', userId)
  return data || []
}

export async function addAchievement(userId, badgeId) {
  await supabase.from('achievements').upsert({
    user_id: userId,
    badge_id: badgeId,
    earned_at: new Date().toISOString()
  })
}

export async function getPrizes(userId) {
  const { data } = await supabase
    .from('prizes')
    .select('*')
    .eq('child_id', userId)
    .order('xp_threshold')
  return data || []
}

export async function addPrize(prize) {
  await supabase.from('prizes').insert(prize)
}

export async function updatePrizeStatus(prizeId, status) {
  await supabase.from('prizes').update({ status }).eq('id', prizeId)
}

export async function getSessions(userId) {
  const { data } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(30)
  return data || []
}
