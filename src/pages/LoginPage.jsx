import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signIn } from '../services/supabase'
import EmiliaCharacter from '../components/shared/EmiliaCharacter'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await signIn(email, password)
      navigate('/home')
    } catch (err) {
      setError('Wrong email or password. Try again!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-mythic" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '2rem', color: 'var(--color-gold)', textShadow: '0 0 20px rgba(201,162,39,0.5)', marginBottom: 4 }}>
            ☘️ SchoolQuest
          </h1>
          <p style={{ color: 'var(--color-parchment)', opacity: 0.7, fontSize: '0.9rem' }}>
            Your personalised learning quest through ancient Ireland
          </p>
        </div>

        {/* Emilia */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <EmiliaCharacter mood="happy" size="md" showBubble />
        </div>

        {/* Card */}
        <div className="celtic-border" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)', padding: 28 }}>
          <h2 style={{ fontFamily: 'var(--font-title)', color: 'var(--color-gold-light)', marginBottom: 20, textAlign: 'center', fontSize: '1.2rem' }}>
            Begin Your Quest
          </h2>

          {error && (
            <div style={{ background: 'rgba(192,57,43,0.2)', border: '1px solid var(--color-crimson)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', marginBottom: 16, color: '#ff8a8a', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={inputStyle}
            />
            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? '✨ Opening the gates...' : '⚔️ Enter the Quest'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--color-stone-light)', fontSize: '0.9rem' }}>
            New hero?{' '}
            <Link to="/register" style={{ color: 'var(--color-gold)', fontWeight: 700, textDecoration: 'none' }}>
              Create your account →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

const inputStyle = {
  background: 'rgba(255,255,255,0.08)',
  border: '2px solid rgba(255,255,255,0.15)',
  borderRadius: 'var(--radius-md)',
  padding: '13px 16px',
  color: 'var(--color-parchment)',
  fontFamily: 'var(--font-body)',
  fontSize: '1rem',
  outline: 'none',
  width: '100%',
}
