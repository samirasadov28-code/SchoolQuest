import { useEffect, useState } from 'react'
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

function ProtectedRoute({ children, authReady, user }) {
  if (!authReady) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f1117' }}>
      <div style={{ color: '#c9a227', fontSize: '2rem' }}>⏳</div>
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const setUser           = useStore(s => s.setUser)
  const setProfile        = useStore(s => s.setProfile)
  const setXP             = useStore(s => s.setXP)
  const addAchievement    = useStore(s => s.addAchievement)
  const loadMasteryFromDB = useStore(s => s.loadMasteryFromDB)
  const resetProgress     = useStore(s => s.resetProgress)
  const storeUser         = useStore(s => s.user)
  const [authReady, setAuthReady] = useState(false)

  async function syncFromDB(userId) {
    // If a different user is logging in, wipe local progress first so
    // the new account always starts clean rather than inheriting cached data.
    const currentStoredId = useStore.getState().user?.id
    if (currentStoredId && currentStoredId !== userId) {
      resetProgress()
    }

    // Fetch profile — DB is source of truth for XP/level/streak
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (profile) {
      setProfile(profile)
      // For a returning user sync XP from DB; for a brand-new account DB has 0
      setXP(profile.xp ?? 0)
    }
    // Sync mastery progress
    getProgress(userId).then(rows => rows?.length && loadMasteryFromDB(rows)).catch(() => {})
    // Sync achievements
    getAchievements(userId).then(rows => rows?.forEach(r => addAchievement(r.badge_id))).catch(() => {})
  }

  useEffect(() => {
    // Restore session on mount — wait for Supabase before routing
    supabase.auth.getSession().then(({ data: { session } }) => {
      // Sign out on fresh browser open if user unchecked "Stay signed in"
      if (session?.user && localStorage.getItem('sq-no-persist') === '1' && !sessionStorage.getItem('sq-logged-in')) {
        supabase.auth.signOut().then(() => {
          localStorage.removeItem('sq-no-persist')
          setUser(null)
          setAuthReady(true)
        })
        return
      }
      if (session?.user) {
        setUser(session.user)
        syncFromDB(session.user.id)
      } else {
        setUser(null)
      }
      setAuthReady(true)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null)
        setProfile(null)
      } else if (session?.user) {
        setUser(session.user)
      }
    })

    return () => subscription.unsubscribe()
  }, [setUser, setProfile])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"         element={<LandingPage />} />
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home"     element={<ProtectedRoute authReady={authReady} user={storeUser}><DashboardPage /></ProtectedRoute>} />
        <Route path="/session"  element={<ProtectedRoute authReady={authReady} user={storeUser}><SessionPage /></ProtectedRoute>} />
        <Route path="/rewards"  element={<ProtectedRoute authReady={authReady} user={storeUser}><RewardsPage /></ProtectedRoute>} />
        <Route path="/map"      element={<ProtectedRoute authReady={authReady} user={storeUser}><MapPage /></ProtectedRoute>} />
        <Route path="/pets"     element={<ProtectedRoute authReady={authReady} user={storeUser}><PetHubPage /></ProtectedRoute>} />
        <Route path="/parent"   element={<ProtectedRoute authReady={authReady} user={storeUser}><ParentPage /></ProtectedRoute>} />
        <Route path="/topics"   element={<ProtectedRoute authReady={authReady} user={storeUser}><TopicsPage /></ProtectedRoute>} />
        <Route path="/avatar"   element={<ProtectedRoute authReady={authReady} user={storeUser}><AvatarPage /></ProtectedRoute>} />
        <Route path="*"         element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
