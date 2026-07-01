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
        const newLevel = Math.floor(Math.sqrt(newXP / 20)) + 1
        set({ xp: newXP, level: newLevel })
        return { newXP, newLevel, leveledUp: newLevel > currentLevel }
      },

      setXP:    (xp)    => set({ xp, level: Math.floor(Math.sqrt(xp / 20)) + 1 }),
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

      // ── Daily goal (minutes, set by parent) ──────
      dailyGoalMinutes: 30,
      setDailyGoalMinutes: (m) => set({ dailyGoalMinutes: Math.max(5, Math.min(120, m)) }),

      // ── Daily timer ───────────────────────────────
      todaySeconds:    0,
      dailyGoalMet:    false,
      sessionSeconds:  0,
      studyHistory:    {}, // { 'YYYY-MM-DD': seconds }

      addSessionSeconds: (s) => {
        const dateKey = new Date().toISOString().split('T')[0]
        const goal    = get().dailyGoalMinutes * 60
        const today   = get().todaySeconds + s
        const history = { ...get().studyHistory, [dateKey]: (get().studyHistory[dateKey] ?? 0) + s }
        set({
          todaySeconds:   today,
          sessionSeconds: get().sessionSeconds + s,
          dailyGoalMet:   today >= goal,
          studyHistory:   history,
        })
      },

      // ── Last session summary (for dashboard banner) ──
      lastSessionSummary: null,
      setLastSessionSummary: (summary) => set({ lastSessionSummary: summary }),
      clearLastSessionSummary: () => set({ lastSessionSummary: null }),

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

      // ── Avatar ───────────────────────────────────────────────────
      selectedAvatar: 'explorer',
      setSelectedAvatar: (id) => set({ selectedAvatar: id }),

      // ── Pets ─────────────────────────────────────────────────────
      activePetId: null,
      pets: [], // [{ id, name, stage, petXp, happiness, hunger, lastFed, acquiredAt }]

      chooseStarterPet: (speciesId, name) => {
        const now = new Date().toISOString()
        const pet = { id: speciesId, name, stage: 1, petXp: 0, happiness: 80, hunger: 30, lastFed: now, acquiredAt: now }
        set(state => ({ pets: [...state.pets.filter(p => p.id !== speciesId), pet], activePetId: speciesId }))
      },

      unlockPet: (speciesId, name) => {
        if (get().pets.find(p => p.id === speciesId)) return
        const now = new Date().toISOString()
        const pet = { id: speciesId, name, stage: 1, petXp: 0, happiness: 80, hunger: 30, lastFed: now, acquiredAt: now }
        set(state => ({ pets: [...state.pets, pet] }))
      },

      setActivePet: (speciesId) => set({ activePetId: speciesId }),

      feedActivePet: (xpAmount) => {
        const { activePetId, pets } = get()
        if (!activePetId) return null
        const pet = pets.find(p => p.id === activePetId)
        if (!pet) return null
        const now = new Date().toISOString()
        const newPetXp = pet.petXp + xpAmount
        // Determine stage (thresholds: 200, 800)
        const newStage = newPetXp >= 800 ? 3 : newPetXp >= 200 ? 2 : 1
        const stageUp  = newStage > pet.stage
        const updated  = { ...pet, petXp: newPetXp, stage: newStage, hunger: Math.max(0, pet.hunger - 15), happiness: Math.min(100, pet.happiness + 8), lastFed: now }
        set(state => ({ pets: state.pets.map(p => p.id === activePetId ? updated : p) }))
        return { stageUp, newStage, petName: pet.name }
      },

      playWithPet: () => {
        const { activePetId, pets } = get()
        if (!activePetId) return false
        const pet = pets.find(p => p.id === activePetId)
        if (!pet) return false
        // Rate-limit: once per 5 minutes
        const lastFed = pet.lastFed ? new Date(pet.lastFed).getTime() : 0
        if (Date.now() - lastFed < 5 * 60 * 1000) return false
        const now = new Date().toISOString()
        const updated = { ...pet, happiness: Math.min(100, pet.happiness + 15), lastFed: now }
        set(state => ({ pets: state.pets.map(p => p.id === activePetId ? updated : p) }))
        return true
      },

      renamePet: (speciesId, name) => {
        set(state => ({ pets: state.pets.map(p => p.id === speciesId ? { ...p, name } : p) }))
      },

      _applyPetDecay: () => {
        const now = Date.now()
        set(state => ({
          pets: state.pets.map(pet => {
            if (!pet.lastFed) return pet
            const hoursSince = (now - new Date(pet.lastFed).getTime()) / 3600000
            const decayAmt = Math.floor(hoursSince * 2)
            if (decayAmt === 0) return pet
            return {
              ...pet,
              happiness: Math.max(40, pet.happiness - decayAmt),
              hunger:    Math.min(80, pet.hunger    + decayAmt),
            }
          }),
        }))
      },
    }),
    {
      name: 'emilia-quest-store',
      version: 2,
      migrate: (persisted, version) => {
        // v1→v2: explorer is now the starter avatar
        if (version < 2 && persisted.selectedAvatar === 'swimmer') {
          persisted.selectedAvatar = 'explorer'
        }
        return persisted
      },
      // Don't persist session-level transient state
      partialize: (state) => ({
        user:              state.user,
        profile:           state.profile,
        masteryMap:        state.masteryMap,
        xp:                state.xp,
        level:             state.level,
        streak:            state.streak,
        lastSessionDate:   state.lastSessionDate,
        dailyGoalMinutes:  state.dailyGoalMinutes,
        todaySeconds:      state.todaySeconds,
        dailyGoalMet:      state.dailyGoalMet,
        studyHistory:      state.studyHistory,
        achievements:      state.achievements,
        prizes:            state.prizes,
        generatedQuestions:state.generatedQuestions,
        activePetId:       state.activePetId,
        pets:              state.pets,
        selectedAvatar:    state.selectedAvatar,
      }),
    }
  )
)

export default useStore

// XP needed for a given level
export function xpForLevel(level) { return (level - 1) ** 2 * 20 }
export function xpForNextLevel(level) { return level ** 2 * 20 }
export function xpProgressInLevel(xp, level) {
  const start = xpForLevel(level)
  const end   = xpForNextLevel(level)
  return Math.min(1, (xp - start) / (end - start))
}
