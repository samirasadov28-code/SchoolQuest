import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { INITIAL_MASTERY, DAILY_GOAL_SECONDS } from '../services/adaptive'

/**
 * Global app state — persisted to localStorage for offline support.
 * Synced to Supabase when online.
 */
const useStore = create(
  persist(
    (set, get) => ({
      // ── Auth ──────────────────────────────────────
      user:        null,
      profile:     null,
      isParentMode:false,

      setUser:       (user)    => set({ user }),
      setProfile:    (profile) => set({ profile }),
      setParentMode: (val)     => set({ isParentMode: val }),

      // ── Mastery map: { subject: { topic: score } } ──
      masteryMap: Object.fromEntries(
        Object.entries(INITIAL_MASTERY).map(([s, score]) => [s, { _overall: score }])
      ),

      updateMasteryMap: (subject, topic, newScore) =>
        set(state => ({
          masteryMap: {
            ...state.masteryMap,
            [subject]: {
              ...state.masteryMap[subject],
              [topic]: newScore,
            },
          },
        })),

      loadMasteryFromDB: (progressRows) => {
        const map = { ...get().masteryMap }
        for (const row of progressRows) {
          if (!map[row.subject]) map[row.subject] = {}
          map[row.subject][row.topic] = row.mastery_score
        }
        set({ masteryMap: map })
      },

      // ── XP & Level ───────────────────────────────
      xp:    0,
      level: 1,

      addXP: (amount) => {
        const currentLevel = get().level
        const newXP    = get().xp + amount
        const newLevel = Math.floor(Math.sqrt(newXP / 50)) + 1
        set({ xp: newXP, level: newLevel })
        return { newXP, newLevel, leveledUp: newLevel > currentLevel }
      },

      setXP:    (xp)    => set({ xp, level: Math.floor(Math.sqrt(xp / 50)) + 1 }),
      setLevel: (level) => set({ level }),

      // ── Streak ───────────────────────────────────
      streak:          0,
      lastSessionDate: null,

      checkAndUpdateStreak: () => {
        const today     = new Date().toISOString().split('T')[0]
        const lastDate  = get().lastSessionDate
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

        if (lastDate === today) return get().streak        // already counted today
        if (lastDate === yesterday) {
          const newStreak = get().streak + 1
          set({ streak: newStreak, lastSessionDate: today })
          return newStreak
        }
        // Streak broken
        set({ streak: 1, lastSessionDate: today })
        return 1
      },

      // ── Daily timer ───────────────────────────────
      todaySeconds:    0,
      dailyGoalMet:    false,
      sessionSeconds:  0,

      addSessionSeconds: (s) => {
        const today = get().todaySeconds + s
        set({
          todaySeconds:   today,
          sessionSeconds: get().sessionSeconds + s,
          dailyGoalMet:   today >= DAILY_GOAL_SECONDS,
        })
      },

      resetSession: () => set({ sessionSeconds: 0 }),

      // ── Achievements (badges) ─────────────────────
      achievements: [],
      addAchievement: (badgeId) => {
        if (get().achievements.includes(badgeId)) return false
        set(state => ({ achievements: [...state.achievements, badgeId] }))
        return true
      },

      // ── Prizes ────────────────────────────────────
      prizes: [],
      setPrizes: (prizes) => set({ prizes }),

      // ── Current session question tracking ─────────
      sessionSeenIds:      [],
      sessionSubjects:     [],
      consecutiveWrong:    0,
      sessionXP:           0,

      addSeenQuestion: (id, subject) =>
        set(state => ({
          sessionSeenIds:  [...state.sessionSeenIds, id],
          sessionSubjects: state.sessionSubjects.includes(subject)
            ? state.sessionSubjects
            : [...state.sessionSubjects, subject],
        })),

      incrementWrong:  ()  => set(state => ({ consecutiveWrong: state.consecutiveWrong + 1 })),
      resetWrong:      ()  => set({ consecutiveWrong: 0 }),
      addSessionXP:    (n) => set(state => ({ sessionXP: state.sessionXP + n })),

      clearSession: () => set({
        sessionSeenIds:   [],
        sessionSubjects:  [],
        consecutiveWrong: 0,
        sessionXP:        0,
      }),

      // ── Supplemental (Groq-generated) questions ───
      generatedQuestions: [],
      addGeneratedQuestions: (qs) =>
        set(state => ({ generatedQuestions: [...state.generatedQuestions, ...qs] })),
    }),
    {
      name: 'emilia-quest-store',
      // Don't persist session-level transient state
      partialize: (state) => ({
        user:              state.user,
        profile:           state.profile,
        masteryMap:        state.masteryMap,
        xp:                state.xp,
        level:             state.level,
        streak:            state.streak,
        lastSessionDate:   state.lastSessionDate,
        todaySeconds:      state.todaySeconds,
        dailyGoalMet:      state.dailyGoalMet,
        achievements:      state.achievements,
        prizes:            state.prizes,
        generatedQuestions:state.generatedQuestions,
      }),
    }
  )
)

export default useStore

// XP needed for a given level
export function xpForLevel(level) { return (level - 1) ** 2 * 50 }
export function xpForNextLevel(level) { return level ** 2 * 50 }
export function xpProgressInLevel(xp, level) {
  const start = xpForLevel(level)
  const end   = xpForNextLevel(level)
  return Math.min(1, (xp - start) / (end - start))
}
