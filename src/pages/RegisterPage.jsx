import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signUp } from '../services/supabase'
import EmiliaCharacter from '../components/shared/EmiliaCharacter'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [pin,      setPin]      = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleRegister(e) {
    e.preventDefault()
    if (pin.length !== 4 || !/^\d+$/.test(pin)) {
      setError('Parent PIN must be exactly 4 digits!')
      return
    }
    setLoading(true)
    setError('')
    try {
      await signUp(email, password, name, pin)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-mythic" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '1.8rem', color: 'var(--color-gold)', textShadow: '0 0 20px rgba(201,162,39,0.5)' }}>
            ☘️ Join the Quest
          </h1>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <EmiliaCharacter mood="idle" size="sm" showBubble />
        </div>

        <div className="celtic-border" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)', padding: 28 }}>
          {error && (
            <div style={{ background: 'rgba(192,57,43,0.2)', border: '1px solid var(--color-crimson)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', marginBottom: 16, color: '#ff8a8a', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={labelStyle}>Your Name (e.g. Emilia) 🧙‍♀️</label>
              <input type="text" placeholder="Enter your name" value={name} onChange={e => setName(e.target.value)} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Email Address 📧</label>
              <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Password (keep it secret!) 🔒</label>
              <input type="password" placeholder="Choose a password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Parent PIN — 4 digits (parents only!) 👨‍👩‍👧</label>
              <input
                type="password"
                placeholder="e.g. 1234"
                value={pin}
                onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                required
                maxLength={4}
                inputMode="numeric"
                pattern="\d{4}"
                style={inputStyle}
              />
              <p style={{ color: 'var(--color-stone-light)', fontSize: '0.78rem', marginTop: 4 }}>
                This PIN lets parents access the Parent Panel. Write it down somewhere safe!
              </p>
            </div>
            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? '✨ Creating your quest...' : '🌟 Start My Adventure!'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--color-stone-light)', fontSize: '0.9rem' }}>
            Already a hero?{' '}
            <Link to="/login" style={{ color: 'var(--color-gold)', fontWeight: 700, textDecoration: 'none' }}>
              Log in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

const labelStyle = { color: 'var(--color-parchment)', fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: 6 }
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
