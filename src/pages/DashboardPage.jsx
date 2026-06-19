import { useNavigate } from 'react-router-dom'
import useStore from '../stores/useStore'
import { calcLevel } from '../services/adaptive'
import { BADGES } from '../services/gamification'
import NavBar from '../components/shared/NavBar'

export default function DashboardPage() {
  const { profile, masteryMap, achievements, startSession, logout } = useStore()
  const navigate = useNavigate()

  const xp = profile?.xp ?? 0
  const level = calcLevel(xp)
  const streak = profile?.streak ?? 0

  const xpForLevel = (l) => (l - 1) ** 2 * 50
  const xpProgress = xp - xpForLevel(level)
  const xpNeeded = xpForLevel(level + 1) - xpForLevel(level)
  const xpPercent = Math.min(100, Math.round((xpProgress / xpNeeded) * 100))

  const subjects = ['maths', 'english', 'irish', 'history', 'geography', 'science', 'genknow']
  const subjectEmojis = { maths: '🔢', english: '📚', irish: '☘️', history: '🏰', geography: '🌍', science: '🧪', genknow: '💡' }

  const getSubjectAvg = (subject) => {
    const entries = Object.entries(masteryMap).filter(([k]) => k.startsWith(subject + ':'))
    if (!entries.length) return 0
    return Math.round(entries.reduce((s, [, v]) => s + v, 0) / entries.length)
  }

  const earnedBadges = BADGES.filter(b => achievements.includes(b.id))

  const handleStart = () => {
    startSession()
    navigate('/session')
  }

  return (
    <div className="page" style={{ paddingBottom: '5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', paddingTop: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Hi, {profile?.name || 'Hero'}! 👋</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Ready to learn?</p>
        </div>
        <button onClick={logout} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}>Sign out</button>
      </div>

      <div className="card" style={{ marginBottom: '1rem', background: 'linear-gradient(135deg, var(--purple-dark), var(--bg-card))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Level</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--gold)' }}>{level}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem' }}>🔥</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{streak} day streak</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>XP</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--purple-light)' }}>{xp}</div>
          </div>
        </div>
        <div className="xp-bar">
          <div className="xp-bar-fill" style={{ width: `${xpPercent}%` }} />
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', textAlign: 'right' }}>
          {xpProgress}/{xpNeeded} XP to Level {level + 1}
        </div>
      </div>

      <button onClick={handleStart} className="btn btn-gold btn-full" style={{ marginBottom: '1.5rem', padding: '1.1rem', fontSize: '1.1rem' }}>
        ⚔️ Start Learning Quest
      </button>

      <h3 style={{ marginBottom: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Subjects</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {subjects.map(subj => {
          const avg = getSubjectAvg(subj)
          return (
            <div key={subj} className="card" style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>{subjectEmojis[subj]}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: avg >= 70 ? 'var(--teal)' : avg >= 40 ? 'var(--gold)' : 'var(--rose)' }}>{avg}%</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'capitalize', marginBottom: '0.4rem' }}>{subj === 'genknow' ? 'Gen. Knowledge' : subj}</div>
              <div className="xp-bar">
                <div className="xp-bar-fill" style={{ width: `${avg}%`, background: avg >= 70 ? 'var(--teal)' : avg >= 40 ? 'var(--gold)' : 'var(--rose)' }} />
              </div>
            </div>
          )
        })}
      </div>

      {earnedBadges.length > 0 && (
        <>
          <h3 style={{ marginBottom: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Badges</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {earnedBadges.map(b => (
              <span key={b.id} className="badge-chip badge-earned">{b.icon} {b.name}</span>
            ))}
          </div>
        </>
      )}

      <NavBar />
    </div>
  )
}
