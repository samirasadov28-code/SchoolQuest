import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../stores/useStore'
import { SUBJECTS, DAILY_GOAL_SECONDS, formatTime, INITIAL_MASTERY } from '../services/adaptive'
import { getSubjectAverages } from '../services/gamification'
import { addPrize, confirmPrize, getPrizes } from '../services/supabase'

export default function ParentPage() {
  const navigate      = useNavigate()
  const user          = useStore(s => s.user)
  const profile       = useStore(s => s.profile)
  const xp            = useStore(s => s.xp)
  const level         = useStore(s => s.level)
  const streak        = useStore(s => s.streak)
  const masteryMap    = useStore(s => s.masteryMap)
  const todaySeconds  = useStore(s => s.todaySeconds)
  const achievements  = useStore(s => s.achievements)
  const prizes        = useStore(s => s.prizes)
  const setPrizes     = useStore(s => s.setPrizes)
  const setParentMode = useStore(s => s.setParentMode)

  const [newPrizeTitle,  setNewPrizeTitle]  = useState('')
  const [newPrizeXP,     setNewPrizeXP]     = useState(500)
  const [addingPrize,    setAddingPrize]    = useState(false)
  const [savingPrize,    setSavingPrize]    = useState(false)
  const [expandedSubject, setExpandedSubject] = useState(null)
  const [progressView,   setProgressView]   = useState('absolute') // 'absolute' | 'delta'

  const subjectAvgs = getSubjectAverages(masteryMap)
  const claimedPrizes = prizes.filter(p => p.status === 'claimed')

  useEffect(() => {
    if (user) getPrizes(user.id).then(p => p && setPrizes(p))
  }, [user])

  async function handleAddPrize() {
    if (!newPrizeTitle.trim()) return
    setSavingPrize(true)
    try {
      await addPrize(user.id, newPrizeTitle, newPrizeXP)
      const refreshed = await getPrizes(user.id)
      setPrizes(refreshed)
      setNewPrizeTitle('')
      setNewPrizeXP(500)
      setAddingPrize(false)
    } catch (e) {
      alert('Error saving prize: ' + e.message)
    } finally {
      setSavingPrize(false)
    }
  }

  async function handleConfirm(prizeId) {
    await confirmPrize(prizeId)
    const refreshed = await getPrizes(user.id)
    setPrizes(refreshed)
  }

  function handleExit() {
    setParentMode(false)
    navigate('/home')
  }

  const name = profile?.name ?? 'Your child'
  const weakest = SUBJECTS.filter(s => (subjectAvgs[s.id] ?? 0) < 50)
  const strongest = SUBJECTS.filter(s => (subjectAvgs[s.id] ?? 0) >= 70)

  return (
    <div className="bg-mythic" style={{ minHeight: '100vh', padding: '16px 16px 60px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-title)', color: 'var(--color-gold)', fontSize: '1.3rem' }}>👨‍👩‍👧 Parent Panel</h1>
          <p style={{ color: 'var(--color-stone-light)', fontSize: '0.8rem' }}>{name}'s learning dashboard</p>
        </div>
        <button className="btn-secondary" style={{ fontSize: '0.85rem', padding: '8px 16px' }} onClick={handleExit}>Exit</button>
      </div>

      {/* Key stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'Level', value: level, icon: '⚔️' },
          { label: 'Total XP', value: xp, icon: '⭐' },
          { label: 'Day Streak', value: `${streak} 🔥`, icon: '📅' },
          { label: 'Today', value: formatTime(todaySeconds), icon: '⏰' },
          { label: 'Goal', value: todaySeconds >= DAILY_GOAL_SECONDS ? '✅ Met!' : `${Math.round(todaySeconds / DAILY_GOAL_SECONDS * 100)}%`, icon: '🎯' },
          { label: 'Badges', value: achievements.length, icon: '🏅' },
        ].map(stat => (
          <div key={stat.label} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 'var(--radius-md)', padding: '12px 10px', textAlign: 'center' }}>
            <p style={{ fontSize: '1.3rem', marginBottom: 2 }}>{stat.icon}</p>
            <p style={{ color: 'var(--color-gold)', fontWeight: 800, fontSize: '0.95rem' }}>{stat.value}</p>
            <p style={{ color: 'var(--color-stone-light)', fontSize: '0.7rem' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Subject breakdown */}
      <section style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ color: 'var(--color-gold-light)', fontSize: '0.95rem', fontWeight: 800 }}>📊 Subject Progress</h2>
          <div style={{ display: 'flex', gap: 6 }}>
            {[{ key: 'absolute', label: '0–100%' }, { key: 'delta', label: 'Progress' }].map(v => (
              <button key={v.key} onClick={() => setProgressView(v.key)}
                style={{ fontSize: '0.7rem', padding: '4px 10px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.2)', background: progressView === v.key ? 'var(--color-gold)' : 'transparent', color: progressView === v.key ? '#1a1a00' : 'var(--color-stone-light)', cursor: 'pointer', fontWeight: 700 }}>
                {v.label}
              </button>
            ))}
          </div>
        </div>
        {progressView === 'delta' && (
          <p style={{ color: 'var(--color-stone-light)', fontSize: '0.72rem', marginBottom: 10, opacity: 0.8 }}>
            Shows improvement from 50% starting point. Green = growing, red = needs work.
          </p>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {SUBJECTS.map(subj => {
            const score  = Math.round(subjectAvgs[subj.id] ?? INITIAL_MASTERY[subj.id] ?? 50)
            const delta  = score - 50
            const isDelta = progressView === 'delta'
            const display = isDelta ? Math.abs(delta) : score
            const barPct  = isDelta ? Math.min(100, Math.abs(delta) * 2) : score
            const barColor = isDelta
              ? (delta >= 0 ? 'var(--color-emerald)' : 'var(--color-crimson)')
              : (score >= 70 ? 'var(--color-emerald)' : score >= 40 ? 'var(--color-gold)' : 'var(--color-crimson)')
            const topicsInSubject = masteryMap[subj.id] ? Object.entries(masteryMap[subj.id]).filter(([k]) => k !== '_overall') : []
            const isExpanded = expandedSubject === subj.id
            return (
              <div key={subj.id}>
                <div onClick={() => setExpandedSubject(isExpanded ? null : subj.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '8px 0' }}>
                  <span style={{ width: 22, textAlign: 'center', fontSize: '0.9rem' }}>{subj.emoji}</span>
                  <span style={{ flex: 1, color: 'var(--color-parchment)', fontSize: '0.83rem', fontWeight: 600 }}>{subj.label}</span>
                  <div style={{ width: 90, background: 'rgba(0,0,0,0.3)', borderRadius: 20, height: 7 }}>
                    <div style={{ width: `${barPct}%`, height: '100%', background: barColor, borderRadius: 20, transition: 'width 0.4s' }} />
                  </div>
                  <span style={{ width: 42, color: barColor, fontSize: '0.78rem', textAlign: 'right', fontWeight: 800 }}>
                    {isDelta ? (delta >= 0 ? `+${delta}` : delta) : `${score}%`}
                  </span>
                  <span style={{ color: 'var(--color-stone-light)', fontSize: '0.7rem' }}>{isExpanded ? '▲' : '▼'}</span>
                </div>
                {isExpanded && topicsInSubject.length > 0 && (
                  <div style={{ marginLeft: 32, marginBottom: 8, background: 'rgba(0,0,0,0.2)', borderRadius: 10, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {topicsInSubject.sort((a, b) => a[1] - b[1]).map(([topic, topicScore]) => {
                      const ts = Math.round(topicScore)
                      const td = ts - 50
                      const tDisplay = isDelta ? (td >= 0 ? `+${td}` : `${td}`) : `${ts}%`
                      const tColor   = isDelta ? (td >= 0 ? 'var(--color-emerald)' : 'var(--color-crimson)') : (ts >= 70 ? 'var(--color-emerald)' : ts >= 40 ? 'var(--color-gold)' : 'var(--color-crimson)')
                      const tBar     = isDelta ? Math.min(100, Math.abs(td) * 2) : ts
                      return (
                        <div key={topic} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ flex: 1, color: 'var(--color-stone-light)', fontSize: '0.75rem', textTransform: 'capitalize' }}>{topic.replace(/-/g, ' ')}</span>
                          <div style={{ width: 70, background: 'rgba(0,0,0,0.3)', borderRadius: 20, height: 5 }}>
                            <div style={{ width: `${tBar}%`, height: '100%', background: tColor, borderRadius: 20 }} />
                          </div>
                          <span style={{ width: 34, color: tColor, fontSize: '0.72rem', fontWeight: 800, textAlign: 'right' }}>{tDisplay}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
                {isExpanded && topicsInSubject.length === 0 && (
                  <p style={{ marginLeft: 32, color: 'var(--color-stone-light)', fontSize: '0.75rem', marginBottom: 8 }}>No topic data yet — keep practising!</p>
                )}
              </div>
            )
          })}
        </div>
        {weakest.length > 0 && (
          <div style={{ marginTop: 12, background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.3)', borderRadius: 'var(--radius-sm)', padding: '10px 14px' }}>
            <p style={{ color: '#ff8a8a', fontSize: '0.85rem', fontWeight: 700 }}>💡 Needs more practice:</p>
            <p style={{ color: 'var(--color-parchment)', fontSize: '0.82rem' }}>{weakest.map(s => s.label).join(', ')}</p>
          </div>
        )}
      </section>

      {/* Prize board */}
      <section style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ color: 'var(--color-gold-light)', fontSize: '0.95rem', fontWeight: 800 }}>🎁 Prize Board</h2>
          <button onClick={() => setAddingPrize(!addingPrize)} className="btn-primary" style={{ fontSize: '0.8rem', padding: '8px 14px' }}>
            + Add Prize
          </button>
        </div>

        {/* Add prize form */}
        {addingPrize && (
          <div style={{ background: 'rgba(201,162,39,0.1)', border: '2px solid rgba(201,162,39,0.3)', borderRadius: 'var(--radius-md)', padding: 16, marginBottom: 12 }}>
            <p style={{ color: 'var(--color-gold)', fontWeight: 700, marginBottom: 10 }}>New Prize</p>
            <input
              type="text"
              placeholder="e.g. Ice cream trip, New book..."
              value={newPrizeTitle}
              onChange={e => setNewPrizeTitle(e.target.value)}
              style={{ ...inputStyle, marginBottom: 10 }}
            />
            <label style={{ color: 'var(--color-parchment)', fontSize: '0.85rem', display: 'block', marginBottom: 6 }}>
              XP required: <strong style={{ color: 'var(--color-gold)' }}>{newPrizeXP} XP</strong>
            </label>
            <input type="range" min={100} max={5000} step={100} value={newPrizeXP} onChange={e => setNewPrizeXP(Number(e.target.value))} style={{ width: '100%', marginBottom: 12 }} />
            <p style={{ color: 'var(--color-stone-light)', fontSize: '0.78rem', marginBottom: 12 }}>
              Current XP: {xp} — {newPrizeXP > xp ? `${newPrizeXP - xp} XP away` : '🎉 Already unlocked!'}
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setAddingPrize(false)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 1 }} disabled={savingPrize} onClick={handleAddPrize}>
                {savingPrize ? 'Saving...' : 'Add Prize'}
              </button>
            </div>
          </div>
        )}

        {/* Prizes that need confirming */}
        {claimedPrizes.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <p style={{ color: '#ffaa44', fontWeight: 700, fontSize: '0.85rem', marginBottom: 8 }}>⚠️ Waiting for your confirmation:</p>
            {claimedPrizes.map(prize => (
              <div key={prize.id} style={{ background: 'rgba(255,170,68,0.1)', border: '2px solid #ffaa44', borderRadius: 'var(--radius-md)', padding: '12px 14px', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ color: 'var(--color-parchment)', fontWeight: 700 }}>🎁 {prize.title}</p>
                <button onClick={() => handleConfirm(prize.id)} className="btn-primary" style={{ fontSize: '0.8rem', padding: '8px 14px' }}>
                  ✅ Given!
                </button>
              </div>
            ))}
          </div>
        )}

        {prizes.filter(p => p.status === 'active').map(prize => (
          <div key={prize.id} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', padding: '12px 14px', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: 'var(--color-parchment)', fontWeight: 700 }}>🔒 {prize.title}</p>
              <p style={{ color: 'var(--color-stone-light)', fontSize: '0.78rem' }}>{prize.xp_threshold} XP required — {prize.xp_threshold > xp ? `${prize.xp_threshold - xp} to go` : '🎉 Unlocked!'}</p>
            </div>
          </div>
        ))}

        {prizes.length === 0 && !addingPrize && (
          <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--color-stone-light)' }}>
            <p style={{ fontSize: '2rem', marginBottom: 8 }}>🎁</p>
            <p>No prizes yet — add one to motivate {name}!</p>
          </div>
        )}
      </section>
    </div>
  )
}

const inputStyle = {
  background: 'rgba(255,255,255,0.08)',
  border: '2px solid rgba(255,255,255,0.15)',
  borderRadius: 'var(--radius-md)',
  padding: '11px 14px',
  color: 'var(--color-parchment)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.95rem',
  outline: 'none',
  width: '100%',
}
