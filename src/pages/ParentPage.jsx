import { useState } from 'react'
import useStore from '../stores/useStore'
import { getPrizes, addPrize, updatePrizeStatus, getSessions } from '../services/supabase'
import NavBar from '../components/shared/NavBar'

const DEFAULT_PIN = import.meta.env.VITE_PARENT_PIN || '1234'

export default function ParentPage() {
  const { profile, masteryMap, user } = useStore()
  const [unlocked, setUnlocked] = useState(false)
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState('')
  const [prizes, setPrizes] = useState([])
  const [sessions, setSessions] = useState([])
  const [newPrizeTitle, setNewPrizeTitle] = useState('')
  const [newPrizeXP, setNewPrizeXP] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePinSubmit = async (e) => {
    e.preventDefault()
    if (pin === DEFAULT_PIN || pin === (profile?.parent_pin ?? DEFAULT_PIN)) {
      setUnlocked(true)
      setLoading(true)
      const [p, s] = await Promise.all([getPrizes(user.id), getSessions(user.id)])
      setPrizes(p)
      setSessions(s)
      setLoading(false)
    } else {
      setPinError('Wrong PIN. Try again!')
    }
  }

  const handleAddPrize = async (e) => {
    e.preventDefault()
    if (!newPrizeTitle || !newPrizeXP) return
    const prize = { child_id: user.id, title: newPrizeTitle, xp_threshold: parseInt(newPrizeXP), status: 'active' }
    await addPrize(prize)
    setPrizes(prev => [...prev, prize])
    setNewPrizeTitle('')
    setNewPrizeXP('')
  }

  const handleConfirmPrize = async (prize) => {
    await updatePrizeStatus(prize.id, 'claimed')
    setPrizes(prev => prev.map(p => p.id === prize.id ? { ...p, status: 'claimed' } : p))
  }

  const getSubjectAvg = (subject) => {
    const entries = Object.entries(masteryMap).filter(([k]) => k.startsWith(subject + ':'))
    if (!entries.length) return 0
    return Math.round(entries.reduce((s, [, v]) => s + v, 0) / entries.length)
  }

  const totalSessions = sessions.length
  const totalXP = profile?.xp ?? 0

  if (!unlocked) {
    return (
      <div className="page" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem' }}>👨‍👩‍👧</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.5rem' }}>Parent Panel</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Enter your PIN to view progress</p>
        </div>
        <div className="card">
          {pinError && <div style={{ color: 'var(--rose)', marginBottom: '1rem', padding: '0.75rem', background: 'rgba(244,63,94,0.1)', borderRadius: '8px' }}>{pinError}</div>}
          <form onSubmit={handlePinSubmit}>
            <input type="password" value={pin} onChange={e => setPin(e.target.value)} placeholder="Enter 4-digit PIN" maxLength={4} style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem', marginBottom: '1rem' }} />
            <button type="submit" className="btn btn-primary btn-full">🔓 Unlock Panel</button>
          </form>
        </div>
        <NavBar />
      </div>
    )
  }

  return (
    <div className="page" style={{ paddingBottom: '5rem' }}>
      <div style={{ paddingTop: '1rem', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>👨‍👩‍👧 Parent Panel</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{profile?.name}'s learning progress</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total XP', value: totalXP, icon: '⭐' },
          { label: 'Sessions', value: totalSessions, icon: '📚' },
          { label: 'Level', value: profile?.level ?? 1, icon: '🏆' }
        ].map(stat => (
          <div key={stat.label} className="card" style={{ textAlign: 'center', padding: '0.75rem' }}>
            <div style={{ fontSize: '1.5rem' }}>{stat.icon}</div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--gold)' }}>{stat.value}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <h3 style={{ marginBottom: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subject Progress</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {['maths', 'english', 'irish', 'history', 'geography', 'science', 'genknow'].map(subj => {
          const avg = getSubjectAvg(subj)
          return (
            <div key={subj} className="card" style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ textTransform: 'capitalize', fontSize: '0.9rem', minWidth: '90px', color: 'var(--text-secondary)' }}>{subj === 'genknow' ? 'Gen. Know.' : subj}</span>
              <div className="xp-bar" style={{ flex: 1 }}>
                <div className="xp-bar-fill" style={{ width: `${avg}%` }} />
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, minWidth: '36px', textAlign: 'right', color: avg >= 70 ? 'var(--teal)' : avg >= 40 ? 'var(--gold)' : 'var(--rose)' }}>{avg}%</span>
            </div>
          )
        })}
      </div>

      <h3 style={{ marginBottom: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Prizes</h3>
      <form onSubmit={handleAddPrize} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input value={newPrizeTitle} onChange={e => setNewPrizeTitle(e.target.value)} placeholder="Prize name" style={{ flex: 2 }} />
        <input type="number" value={newPrizeXP} onChange={e => setNewPrizeXP(e.target.value)} placeholder="XP" style={{ flex: 1 }} />
        <button type="submit" className="btn btn-gold" style={{ whiteSpace: 'nowrap' }}>+ Add</button>
      </form>
      {prizes.map(prize => {
        const isUnlocked = (profile?.xp ?? 0) >= prize.xp_threshold
        return (
          <div key={prize.id || prize.title} className="card" style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: prize.status === 'claimed' ? 0.5 : 1 }}>
            <div>
              <div style={{ fontWeight: 600 }}>{prize.title}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{prize.xp_threshold} XP • {prize.status}</div>
            </div>
            {isUnlocked && prize.status === 'active' && (
              <button onClick={() => handleConfirmPrize(prize)} className="btn btn-gold" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Confirm ✓</button>
            )}
          </div>
        )
      })}
      {prizes.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No prizes added yet. Add one above!</p>}

      <NavBar />
    </div>
  )
}
