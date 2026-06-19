import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore, { xpForLevel, xpForNextLevel } from '../stores/useStore'
import { getProgress, getAchievements, getPrizes } from '../services/supabase'
import { SUBJECTS } from '../services/adaptive'
import { getSubjectAverages } from '../services/gamification'
import { getUnlockedPrizes, getNextPrize } from '../data/prizes'
import EmiliaCharacter from '../components/shared/EmiliaCharacter'
import { DAILY_GOAL_SECONDS, formatTime } from '../services/adaptive'

export default function DashboardPage() {
  const navigate   = useNavigate()
  const user       = useStore(s => s.user)
  const profile    = useStore(s => s.profile)
  const xp         = useStore(s => s.xp)
  const level      = useStore(s => s.level)
  const streak     = useStore(s => s.streak)
  const masteryMap = useStore(s => s.masteryMap)
  const todaySeconds = useStore(s => s.todaySeconds)
  const dailyGoalMet = useStore(s => s.dailyGoalMet)
  const loadMastery  = useStore(s => s.loadMasteryFromDB)
  const setPrizes    = useStore(s => s.setPrizes)
  const setXP        = useStore(s => s.setXP)
  const achievements = useStore(s => s.achievements)
  const setParentMode = useStore(s => s.setParentMode)

  const [showParentPIN, setShowParentPIN] = useState(false)
  const [pinInput,      setPinInput]      = useState('')
  const [pinError,      setPinError]      = useState('')

  useEffect(() => {
    if (!user) return
    // Sync DB state
    getProgress(user.id).then(rows => rows && loadMastery(rows))
    getPrizes(user.id).then(prizes => prizes && setPrizes(prizes))
    // Sync XP from profile if higher (DB is source of truth)
    if (profile?.xp > xp) setXP(profile.xp)
  }, [user])

  const subjectAvgs = getSubjectAverages(masteryMap)
  const todayPct    = Math.min(1, todaySeconds / DAILY_GOAL_SECONDS)
  const xpStart     = xpForLevel(level)
  const xpEnd       = xpForNextLevel(level)
  const xpPct       = Math.min(1, (xp - xpStart) / (xpEnd - xpStart))
  const nextPrize   = getNextPrize(xp)
  const unlockedPrizes = getUnlockedPrizes(xp)

  function handleParentUnlock() {
    const storedPin = profile?.parent_pin ?? '1234'
    if (pinInput === storedPin) {
      setParentMode(true)
      setShowParentPIN(false)
      navigate('/parent')
    } else {
      setPinError('Wrong PIN! Try again.')
      setPinInput('')
    }
  }

  const name = profile?.name ?? user?.user_metadata?.name ?? 'Explorer'

  return (
    <div className="bg-mythic" style={{ minHeight: '100vh', padding: '16px 16px 80px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-title)', color: 'var(--color-gold)', fontSize: '1.1rem' }}>
            ☘️ SchoolQuest
          </h2>
          <p style={{ color: 'var(--color-parchment)', opacity: 0.7, fontSize: '0.8rem' }}>
            Welcome back, {name}!
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* Streak */}
          <div className="streak-flame">🔥 {streak}</div>
          {/* Parent button */}
          <button onClick={() => setShowParentPIN(true)} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '6px 12px', color: 'var(--color-parchment)', fontSize: '0.8rem', cursor: 'pointer' }}>
            👨‍👩‍👧 Parent
          </button>
        </div>
      </div>

      {/* Level + XP bar */}
      <div className="celtic-border" style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-md)', padding: '14px 18px', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ color: 'var(--color-gold)', fontWeight: 800, fontSize: '1rem' }}>⚔️ Level {level}</span>
          <span style={{ color: 'var(--color-parchment)', fontSize: '0.85rem', opacity: 0.8 }}>{xp} / {xpEnd} XP</span>
        </div>
        <div className="xp-bar-track">
          <div className="xp-bar-fill" style={{ width: `${xpPct * 100}%` }} />
        </div>
        <p style={{ color: 'var(--color-stone-light)', fontSize: '0.75rem', marginTop: 6 }}>
          {xpEnd - xp} XP to Level {level + 1}
        </p>
      </div>

      {/* Daily goal */}
      <div style={{ background: dailyGoalMet ? 'rgba(39,174,96,0.15)' : 'rgba(0,0,0,0.2)', border: `2px solid ${dailyGoalMet ? 'var(--color-emerald)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 'var(--radius-md)', padding: '12px 18px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ color: 'var(--color-parchment)', fontWeight: 700, fontSize: '0.9rem' }}>
            {dailyGoalMet ? '✅ Daily quest complete!' : '⏰ Today\'s quest'}
          </p>
          <p style={{ color: 'var(--color-stone-light)', fontSize: '0.8rem' }}>
            {formatTime(todaySeconds)} / 45:00 studied
          </p>
        </div>
        <svg width="48" height="48" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3.5" />
          <circle cx="18" cy="18" r="15.9" fill="none"
            stroke={dailyGoalMet ? '#27ae60' : '#c9a227'}
            strokeWidth="3.5"
            strokeDasharray={`${todayPct * 100} 100`}
            strokeLinecap="round"
            transform="rotate(-90 18 18)"
          />
          <text x="18" y="22" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">
            {Math.round(todayPct * 100)}%
          </text>
        </svg>
      </div>

      {/* Next digital prize teaser */}
      {nextPrize && (
        <div style={{ background: 'rgba(201,162,39,0.1)', border: '2px solid rgba(201,162,39,0.3)', borderRadius: 'var(--radius-md)', padding: '12px 18px', marginBottom: 16, display: 'flex', gap: 14, alignItems: 'center' }}>
          <img src={nextPrize.image} alt={nextPrize.name} style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover', filter: 'brightness(0.4) blur(2px)' }} />
          <div>
            <p style={{ color: 'var(--color-gold)', fontWeight: 800, fontSize: '0.9rem' }}>🌟 Next reward</p>
            <p style={{ color: 'var(--color-parchment)', fontSize: '0.85rem' }}>{nextPrize.name}</p>
            <p style={{ color: 'var(--color-stone-light)', fontSize: '0.78rem' }}>{nextPrize.xpRequired - xp} XP away</p>
          </div>
        </div>
      )}

      {/* Subject mastery grid */}
      <h3 style={{ color: 'var(--color-gold-light)', fontFamily: 'var(--font-title)', fontSize: '0.95rem', marginBottom: 12 }}>
        Your Subjects
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
        {SUBJECTS.map(subj => {
          const score = Math.round(subjectAvgs[subj.id] ?? 0)
          return (
            <div key={subj.id} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--radius-md)', padding: '12px 14px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-parchment)' }}>
                  {subj.emoji} {subj.label.split(' ')[0]}
                </span>
                <span style={{ fontSize: '0.8rem', color: subj.color, fontWeight: 800 }}>{score}%</span>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 20, height: 6, overflow: 'hidden' }}>
                <div style={{ width: `${score}%`, height: '100%', background: subj.color, borderRadius: 20, transition: 'width 0.6s ease' }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Emilia + Start button */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <EmiliaCharacter mood="idle" size="md" showBubble />
        <button className="btn-primary" style={{ fontSize: '1.2rem', padding: '16px 48px', width: '100%' }} onClick={() => navigate('/session')}>
          ⚔️ Start Today's Quest!
        </button>
        <div style={{ display: 'flex', gap: 12, width: '100%' }}>
          <button className="btn-secondary" style={{ flex: 1 }} onClick={() => navigate('/rewards')}>🏆 Rewards</button>
          <button className="btn-secondary" style={{ flex: 1 }} onClick={() => navigate('/map')}>🗺️ Map</button>
        </div>
      </div>

      {/* Parent PIN modal */}
      {showParentPIN && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}>
          <div className="celtic-border" style={{ background: '#1a3a15', borderRadius: 'var(--radius-lg)', padding: 28, width: '100%', maxWidth: 340 }}>
            <h3 style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-title)', marginBottom: 8, textAlign: 'center' }}>Parent Access</h3>
            <p style={{ color: 'var(--color-stone-light)', fontSize: '0.85rem', textAlign: 'center', marginBottom: 20 }}>Enter your 4-digit parent PIN</p>
            {pinError && <p style={{ color: '#ff8a8a', fontSize: '0.85rem', marginBottom: 12, textAlign: 'center' }}>{pinError}</p>}
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="• • • •"
              value={pinInput}
              onChange={e => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
              style={{ ...inputStyle, textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5em', marginBottom: 16 }}
              autoFocus
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => { setShowParentPIN(false); setPinInput(''); setPinError('') }}>Cancel</button>
              <button className="btn-primary" style={{ flex: 1 }} onClick={handleParentUnlock}>Unlock</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const inputStyle = {
  background: 'rgba(255,255,255,0.08)',
  border: '2px solid rgba(255,255,255,0.2)',
  borderRadius: 'var(--radius-md)',
  padding: '13px 16px',
  color: 'var(--color-parchment)',
  fontFamily: 'var(--font-body)',
  fontSize: '1rem',
  outline: 'none',
  width: '100%',
}
