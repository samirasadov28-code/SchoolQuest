import { useNavigate } from 'react-router-dom'
import EmiliaCharacter from '../components/shared/EmiliaCharacter'
import { APP_VERSION } from '../version'
import { SUBJECTS } from '../services/adaptive'

export default function LandingPage() {
  const navigate = useNavigate()

  function handleForceUpdate() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(regs => {
        regs.forEach(r => r.unregister())
        window.location.reload(true)
      })
    } else {
      window.location.reload(true)
    }
  }

  return (
    <div className="bg-mythic" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 20px 40px', backgroundColor: '#0d1f0b' }}>

      {/* Logo + Title */}
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '2.4rem', color: 'var(--color-gold)', textShadow: '0 0 24px rgba(201,162,39,0.5)', marginBottom: 2, lineHeight: 1.1 }}>
          ☘️ SchoolQuest
        </h1>
        <span style={{ display: 'inline-block', background: 'rgba(201,162,39,0.15)', border: '1px solid var(--color-gold)', borderRadius: 20, padding: '2px 10px', fontSize: '0.7rem', color: 'var(--color-gold)', letterSpacing: '0.05em', fontWeight: 700 }}>
          v{APP_VERSION}
        </span>
      </div>

      {/* Emilia */}
      <div style={{ margin: '16px 0' }}>
        <EmiliaCharacter mood="happy" size="lg" showBubble animate />
      </div>

      {/* Description */}
      <div style={{ textAlign: 'center', maxWidth: 340, marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'var(--font-title)', color: 'var(--color-parchment)', fontSize: '1.1rem', marginBottom: 8 }}>
          Your personalised learning quest!
        </h2>
        <p style={{ color: 'var(--color-stone-light)', fontSize: '0.88rem', lineHeight: 1.6 }}>
          Adaptive quizzes across 10 school subjects, pet companions, Celtic mythology badges, and prizes — built for Irish 2nd → 3rd class.
        </p>
      </div>

      {/* Subjects grid */}
      <div style={{ width: '100%', maxWidth: 380, marginBottom: 28 }}>
        <p style={{ color: 'var(--color-stone-light)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, textAlign: 'center' }}>10 Subjects Covered</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
          {SUBJECTS.map(s => (
            <div key={s.id} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '8px 4px' }}>
              <div style={{ fontSize: '1.3rem' }}>{s.emoji}</div>
              <div style={{ color: 'var(--color-stone-light)', fontSize: '0.58rem', marginTop: 3, lineHeight: 1.2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA buttons */}
      <div style={{ width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
        <button className="btn-primary" style={{ fontSize: '1.1rem', padding: '16px' }} onClick={() => navigate('/register')}>
          🌟 Start Your Quest
        </button>
        <button className="btn-secondary" onClick={() => navigate('/login')}>
          Already on a quest? Sign in
        </button>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: 'auto', paddingTop: 16 }}>
        <button
          onClick={handleForceUpdate}
          style={{ background: 'none', border: 'none', color: 'var(--color-stone-light)', fontSize: '0.72rem', cursor: 'pointer', textDecoration: 'underline', marginBottom: 10, opacity: 0.6 }}>
          🔄 Force update app
        </button>
        <div style={{ color: 'var(--color-stone-light)', fontSize: '0.72rem', opacity: 0.5 }}>
          <a href="https://asadov-stack.netlify.app" target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--color-gold)', textDecoration: 'none', opacity: 0.7, fontWeight: 700 }}>
            🛠️ More apps by Asadov Stack
          </a>
        </div>
      </div>
    </div>
  )
}
