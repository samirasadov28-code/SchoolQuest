import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase, getProgress, getAchievements } from './services/supabase'
import useStore from './stores/useStore'

// Pages
import LandingPage    from './pages/LandingPage'
import LoginPage      from './pages/LoginPage'
import RegisterPage   from './pages/RegisterPage'
import DashboardPage  from './pages/DashboardPage'
import SessionPage    from './pages/SessionPage'
import RewardsPage    from './pages/RewardsPage'
import ParentPage     from './pages/ParentPage'
import MapPage        from './pages/MapPage'
import PetHubPage     from './pages/PetHubPage'
import TopicsPage     from './pages/TopicsPage'
import AvatarPage     from './pages/AvatarPage'

function ProtectedRoute({ children }) {
  const user = useStore(s => s.user)
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const setUser           = useStore(s => s.setUser)
  const setProfile        = useStore(s => s.setProfile)
  const setXP             = useStore(s => s.setXP)
  const addAchievement    = useStore(s => s.addAchievement)
  const loadMasteryFromDB = useStore(s => s.loadMasteryFromDB)

  async function syncFromDB(userId) {
    // Fetch profile — DB is source of truth for XP/level/streak
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (profile) {
      setProfile(profile)
      // Always sync XP from DB (DB is updated at end of every session)
      const localXP = useStore.getState().xp
      setXP(Math.max(localXP, profile.xp ?? 0))
    }
    // Sync mastery progress
    getProgress(userId).then(rows => rows?.length && loadMasteryFromDB(rows)).catch(() => {})
    // Sync achievements
    getAchievements(userId).then(rows => rows?.forEach(r => addAchievement(r.badge_id))).catch(() => {})
  }

  useEffect(() => {
    // Restore session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        syncFromDB(session.user.id)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) setProfile(null)
    })

    return () => subscription.unsubscribe()
  }, [setUser, setProfile])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"         element={<LandingPage />} />
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home"     element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/session"  element={<ProtectedRoute><SessionPage /></ProtectedRoute>} />
        <Route path="/rewards"  element={<ProtectedRoute><RewardsPage /></ProtectedRoute>} />
        <Route path="/map"      element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
        <Route path="/pets"     element={<ProtectedRoute><PetHubPage /></ProtectedRoute>} />
        <Route path="/parent"   element={<ProtectedRoute><ParentPage /></ProtectedRoute>} />
        <Route path="/topics"   element={<ProtectedRoute><TopicsPage /></ProtectedRoute>} />
        <Route path="/avatar"   element={<ProtectedRoute><AvatarPage /></ProtectedRoute>} />
        <Route path="*"         element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
