import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useStore from '../stores/useStore'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const login = useStore(s => s.login)
  const navigate = useNavigate()

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
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '3rem' }}>🏰</div>
        <h1 className="title-celtic">SchoolQuest</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Your magical learning adventure!</p>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Welcome back, hero!</h2>
        {error && <div style={{ color: 'var(--rose)', marginBottom: '1rem', padding: '0.75rem', background: 'rgba(244,63,94,0.1)', borderRadius: '8px' }}>{error}</div>}
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
    </div>
  )
}
