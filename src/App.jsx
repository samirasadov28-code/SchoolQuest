import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './services/supabase'
import useStore from './stores/useStore'

// Pages
import LoginPage      from './pages/LoginPage'
import RegisterPage   from './pages/RegisterPage'
import DashboardPage  from './pages/DashboardPage'
import SessionPage    from './pages/SessionPage'
import RewardsPage    from './pages/RewardsPage'
import ParentPage     from './pages/ParentPage'
import MapPage        from './pages/MapPage'

function ProtectedRoute({ children }) {
  const user = useStore(s => s.user)
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const setUser    = useStore(s => s.setUser)
  const setProfile = useStore(s => s.setProfile)

  useEffect(() => {
    // Restore session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        supabase.from('profiles').select('*').eq('id', session.user.id).single()
          .then(({ data }) => data && setProfile(data))
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
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/session"  element={<ProtectedRoute><SessionPage /></ProtectedRoute>} />
        <Route path="/rewards"  element={<ProtectedRoute><RewardsPage /></ProtectedRoute>} />
        <Route path="/map"      element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
        <Route path="/parent"   element={<ProtectedRoute><ParentPage /></ProtectedRoute>} />
        <Route path="*"         element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
