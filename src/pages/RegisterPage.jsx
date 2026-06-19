import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useStore from '../stores/useStore'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const register = useStore(s => s.register)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(email, password, name)
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
        <div style={{ fontSize: '3rem' }}>✨</div>
        <h1 className="title-celtic">SchoolQuest</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Begin your legendary journey!</p>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1.5rem' }}>Create your hero!</h2>
        {error && <div style={{ color: 'var(--rose)', marginBottom: '1rem', padding: '0.75rem', background: 'rgba(244,63,94,0.1)', borderRadius: '8px' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Your name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Emilia" required />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Choose a password" required minLength={6} />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Creating your hero...' : '🌟 Start My Quest!'}
          </button>
        </form>
        <div className="celtic-divider">or</div>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Already a hero? <Link to="/login" style={{ color: 'var(--purple-light)' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
