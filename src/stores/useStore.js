import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import supabase, {
  getProfile, upsertProfile,
  getProgress, upsertProgress,
  getAchievements, addAchievement,
  saveSession
} from '../services/supabase'
import { calcLevel, calcXP } from '../services/adaptive'
import { checkNewBadges, subjectAverage } from '../services/gamification'

const useStore = create(persist(
  (set, get) => ({
    user: null,
    profile: null,
    masteryMap: {},
    achievements: [],
    session: null,

    initAuth: () => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) get().loadUser(session.user)
      })
      supabase.auth.onAuthStateChange((_, session) => {
        if (session?.user) get().loadUser(session.user)
        else set({ user: null, profile: null })
      })
    },

    loadUser: async (user) => {
      set({ user })
      const [profile, progress, achievements] = await Promise.all([
        getProfile(user.id),
        getProgress(user.id),
        getAchievements(user.id)
      ])
      const masteryMap = {}
      progress.forEach(p => { masteryMap[`${p.subject}:${p.topic}`] = p.mastery_score })
      set({ profile, masteryMap, achievements: achievements.map(a => a.badge_id) })
    },

    login: async (email, password) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
    },

    register: async (email, password, name) => {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      if (data.user) {
        await upsertProfile({ id: data.user.id, name, email, xp: 0, level: 1, streak: 0 })
      }
    },

    logout: async () => {
      await supabase.auth.signOut()
      set({ user: null, profile: null, masteryMap: {}, achievements: [], session: null })
    },

    startSession: () => {
      set({ session: { startTime: Date.now(), questions: [], xpEarned: 0, usedIds: [] } })
    },

    answerQuestion: async (question, isCorrect) => {
      const { session, masteryMap, user, profile, achievements } = get()
      if (!session) return

      const key = `${question.subject}:${question.topic}`
      const currentMastery = masteryMap[key] ?? 50
      const delta = isCorrect ? question.difficulty * 3 : -(question.difficulty * 2)
      const newMastery = Math.max(0, Math.min(100, currentMastery + delta))
      const xp = isCorrect ? calcXP(question.difficulty) : 0

      const newMasteryMap = { ...masteryMap, [key]: newMastery }
      const newXP = (profile?.xp ?? 0) + xp
      const newLevel = calcLevel(newXP)
      const updatedProfile = { ...profile, xp: newXP, level: newLevel }

      set({
        masteryMap: newMasteryMap,
        session: {
          ...session,
          questions: [...session.questions, { ...question, isCorrect }],
          xpEarned: session.xpEarned + xp,
          usedIds: [...session.usedIds, question.id]
        },
        profile: updatedProfile
      })

      if (user) {
        await upsertProgress({
          user_id: user.id,
          subject: question.subject,
          topic: question.topic,
          mastery_score: newMastery,
          last_practiced: new Date().toISOString()
        })
        await upsertProfile({ ...updatedProfile, id: user.id })

        const answeredCorrectly = session.questions.filter(q => q.isCorrect).length + (isCorrect ? 1 : 0)
        const stats = {
          totalSessions: 1,
          totalCorrect: answeredCorrectly,
          maxMastery: Math.max(0, ...Object.values(newMasteryMap)),
          streak: profile?.streak ?? 0,
          level: newLevel,
          subjectAverages: {
            maths: subjectAverage(newMasteryMap, 'maths'),
            english: subjectAverage(newMasteryMap, 'english'),
            irish: subjectAverage(newMasteryMap, 'irish')
          }
        }
        const newBadges = checkNewBadges(stats, achievements)
        for (const b of newBadges) await addAchievement(user.id, b)
        if (newBadges.length) set({ achievements: [...achievements, ...newBadges] })
      }
    },

    endSession: async () => {
      const { session, user } = get()
      if (!session || !user) return
      const duration = Math.round((Date.now() - session.startTime) / 1000)
      const subjects = [...new Set(session.questions.map(q => q.subject))]
      await saveSession({
        user_id: user.id,
        date: new Date().toISOString().split('T')[0],
        duration_seconds: duration,
        xp_earned: session.xpEarned,
        subjects_covered: subjects,
        created_at: new Date().toISOString()
      })
      set({ session: null })
    }
  }),
  {
    name: 'schoolquest-store',
    partialize: (s) => ({ masteryMap: s.masteryMap, profile: s.profile })
  }
))

export default useStore
