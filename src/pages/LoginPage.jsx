import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useStore from '../stores/useStore'
import { APP_VERSION } from '../version'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [updateReady, setUpdateReady] = useState(false)
  const login = useStore(s => s.login)
  const navigate = useNavigate()

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(reg => {
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing
          newWorker?.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setUpdateReady(true)
            }
          })
        })
        reg.update()
      })
    }
  }, [])

  const handleForceUpdate = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(reg => {
        reg.waiting?.postMessage({ type: 'SKIP_WAITING' })
      })
    }
    window.location.reload(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '3rem' }}>🏰</div>
        <h1 className="title-celtic">SchoolQuest</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Your magical learning adventure!</p>
      </div>

      {/* Update banner */}
      {updateReady && (
        <div style={{
          background: 'rgba(20,184,166,0.15)', border: '1px solid var(--teal)',
          borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem'
        }}>
          <span style={{ color: 'var(--teal-light)', fontSize: '0.9rem' }}>🔄 A new version is ready!</span>
          <button onClick={handleForceUpdate} className="btn btn-gold" style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}>
            Update now
          </button>
        </div>
      )}

      {/* Login card */}
      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Welcome back, hero!</h2>
        {error && (
          <div style={{ color: 'var(--rose)', marginBottom: '1rem', padding: '0.75rem', background: 'rgba(244,63,94,0.1)', borderRadius: '8px' }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Entering the Quest...' : '⚔️ Enter SchoolQuest'}
          </button>
        </form>
        <div className="celtic-divider">or</div>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          New hero? <Link to="/register" style={{ color: 'var(--purple-light)' }}>Create your account</Link>
        </p>
      </div>

      {/* Version + manual force update */}
      <div style={{ textAlign: 'center', marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>v{APP_VERSION}</span>
        <button
          onClick={handleForceUpdate}
          style={{
            background: 'none', border: 'none', color: 'var(--text-muted)',
            fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline'
          }}
        >
          Force update
        </button>
      </div>
    </div>
  )
}
