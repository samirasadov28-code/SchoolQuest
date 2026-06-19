import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import useStore from './stores/useStore'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import SessionPage from './pages/SessionPage'
import RewardsPage from './pages/RewardsPage'
import ParentPage from './pages/ParentPage'
import MapPage from './pages/MapPage'

function PrivateRoute({ children }) {
  const user = useStore(s => s.user)
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  const { user, initAuth } = useStore()

  useEffect(() => { initAuth() }, [])

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="/session" element={<PrivateRoute><SessionPage /></PrivateRoute>} />
      <Route path="/rewards" element={<PrivateRoute><RewardsPage /></PrivateRoute>} />
      <Route path="/parent" element={<PrivateRoute><ParentPage /></PrivateRoute>} />
      <Route path="/map" element={<PrivateRoute><MapPage /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
