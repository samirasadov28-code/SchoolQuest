import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../stores/useStore'
import NavBar from '../components/shared/NavBar'
import AvatarCorner from '../components/shared/AvatarCorner'
import { getLeaderboard, getUserQuestionStats } from '../services/supabase'
import { getSubjectAverages } from '../services/gamification'
import { xpForLevel, xpForNextLevel } from '../stores/useStore'

const RANK_MEDALS = ['🥇', '🥈', '🥉']
const TABS = ['⚡ XP', '✅ Correct', '📈 Progress']

function XPBar({ xp, level }) {
  const start = xpForLevel(level)
  const end   = xpForNextLevel(level)
  const pct   = Math.min(100, Math.round(((xp - start) / Math.max(1, end - start)) * 100))
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ flex: 1, background: 'rgba(0,0,0,0.4)', borderRadius: 20, height: 5, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: 'var(--color-gold)', borderRadius: 20, transition: 'width 0.6s' }} />
      </div>
      <span style={{ fontSize: '0.6rem', color: 'var(--color-stone-light)', minWidth: 28 }}>{pct}%</span>
    </div>
  )
}

export default function LeaderboardPage() {
  const navigate           = useNavigate()
  const storeUser          = useStore(s => s.user)
  const storeXP            = useStore(s => s.xp)
  const storeLevel         = useStore(s => s.level)
  const storeStreak        = useStore(s => s.streak)
  const questionsCorrectMap = useStore(s => s.questionsCorrectMap)
  const masteryMap         = useStore(s => s.masteryMap)
  const profile            = useStore(s => s.profile)

  const [rows,    setRows]    = useState([])
  const [stats,   setStats]   = useState({})   // { [userId]: { totalSeen, avgMastery } }
  const [tab,     setTab]     = useState(0)
  const [loading, setLoading] = useState(true)
  const [solo,    setSolo]    = useState(false) // true when RLS only returned own row

  // Local correct answers total for current user
  const localCorrect = Object.values(questionsCorrectMap)
    .flatMap(topicMap => Object.values(topicMap))
    .reduce((a, b) => a + b, 0)

  // Local average mastery for current user
  const subjectAvgs = getSubjectAverages(masteryMap)
  const avgValues   = Object.values(subjectAvgs)
  const localMastery = avgValues.length
    ? Math.round(avgValues.reduce((a, b) => a + b, 0) / avgValues.length)
    : 0

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const leaderboard = await getLeaderboard()

        // Merge local state for current user (always most up-to-date)
        const merged = leaderboard.map(r => {
          if (r.id === storeUser?.id) {
            return { ...r, xp: storeXP, level: storeLevel, streak: storeStreak }
          }
          return r
        })

        // If no current user row came back, inject it
        if (storeUser && !merged.find(r => r.id === storeUser.id)) {
          merged.push({
            id:     storeUser.id,
            name:   profile?.name ?? storeUser.email?.split('@')[0] ?? 'You',
            xp:     storeXP,
            level:  storeLevel,
            streak: storeStreak,
          })
        }

        setSolo(merged.length <= 1)
        setRows(merged)

        // Load per-user DB stats (questions_seen, avg mastery)
        const statMap = {}
        await Promise.all(
          merged.map(async r => {
            if (r.id === storeUser?.id) {
              statMap[r.id] = { totalSeen: localCorrect, avgMastery: localMastery }
            } else {
              statMap[r.id] = await getUserQuestionStats(r.id).catch(() => ({ totalSeen: 0, avgMastery: 0 }))
            }
          })
        )
        setStats(statMap)
      } catch {
        // Fallback: show just the current user
        setSolo(true)
        setRows([{
          id:     storeUser?.id,
          name:   profile?.name ?? 'You',
          xp:     storeXP,
          level:  storeLevel,
          streak: storeStreak,
        }])
        setStats({ [storeUser?.id]: { totalSeen: localCorrect, avgMastery: localMastery } })
      }
      setLoading(false)
    }
    load()
  }, []) // eslint-disable-line

  // Sort by active tab metric
  const sorted = [...rows].sort((a, b) => {
    if (tab === 0) return b.xp - a.xp
    if (tab === 1) return (stats[b.id]?.totalSeen ?? 0) - (stats[a.id]?.totalSeen ?? 0)
    return (stats[b.id]?.avgMastery ?? 0) - (stats[a.id]?.avgMastery ?? 0)
  })

  return (
    <div className="bg-mythic" style={{ minHeight: '100vh', padding: '16px 16px 80px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <button onClick={() => navigate('/home')} style={{ background: 'transparent', border: 'none', color: 'var(--color-stone-light)', cursor: 'pointer', fontSize: '1.2rem' }}>←</button>
        <h1 style={{ fontFamily: 'var(--font-title)', color: 'var(--color-gold)', fontSize: '1.3rem', flex: 1 }}>🏅 Leaderboard</h1>
        <AvatarCorner />
      </div>

      {/* Current user hero card */}
      <div style={{ background: 'rgba(201,162,39,0.12)', border: '2px solid rgba(201,162,39,0.4)', borderRadius: 16, padding: '14px 18px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(201,162,39,0.2)', border: '2px solid var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>⭐</div>
          <div style={{ flex: 1 }}>
            <p style={{ color: 'var(--color-gold)', fontWeight: 800, fontSize: '0.95rem' }}>{profile?.name ?? 'You'}</p>
            <p style={{ color: 'var(--color-stone-light)', fontSize: '0.72rem' }}>Level {storeLevel} · {storeStreak} day streak 🔥</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: 'var(--color-gold)', fontWeight: 800, fontSize: '1.1rem' }}>{storeXP.toLocaleString()} XP</p>
            <p style={{ color: '#5dde8b', fontSize: '0.72rem', fontWeight: 700 }}>{localCorrect} correct ✅</p>
          </div>
        </div>
        <div style={{ marginTop: 10 }}>
          <XPBar xp={storeXP} level={storeLevel} />
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          {[
            { label: 'XP', value: storeXP.toLocaleString() },
            { label: 'Correct', value: localCorrect },
            { label: 'Mastery', value: `${localMastery}%` },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: '8px 4px', textAlign: 'center' }}>
              <p style={{ color: 'var(--color-gold)', fontWeight: 800, fontSize: '0.95rem' }}>{s.value}</p>
              <p style={{ color: 'var(--color-stone-light)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sort tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} style={{
            flex: 1, padding: '8px 0', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700,
            background: tab === i ? 'var(--color-gold)' : 'rgba(255,255,255,0.08)',
            color: tab === i ? '#1a1200' : 'var(--color-stone-light)',
          }}>{t}</button>
        ))}
      </div>

      {/* Rankings */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--color-stone-light)' }}>Loading rankings…</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sorted.map((row, idx) => {
            const isMe    = row.id === storeUser?.id
            const medal   = RANK_MEDALS[idx] ?? `#${idx + 1}`
            const rowStats = stats[row.id] ?? { totalSeen: 0, avgMastery: 0 }
            const metric  = tab === 0
              ? `${row.xp?.toLocaleString() ?? 0} XP`
              : tab === 1
              ? `${rowStats.totalSeen} correct`
              : `${rowStats.avgMastery}% mastery`
            return (
              <div key={row.id} style={{
                background: isMe ? 'rgba(201,162,39,0.12)' : 'rgba(255,255,255,0.04)',
                border: `1.5px solid ${isMe ? 'rgba(201,162,39,0.5)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 12, padding: '12px 14px',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <span style={{ fontSize: idx < 3 ? '1.3rem' : '0.85rem', minWidth: 28, textAlign: 'center', color: idx >= 3 ? 'var(--color-stone-light)' : undefined, fontWeight: 800 }}>{medal}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <p style={{ color: isMe ? 'var(--color-gold)' : 'var(--color-parchment)', fontWeight: 700, fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {row.name ?? 'Explorer'}{isMe ? ' (you)' : ''}
                    </p>
                    {row.streak > 0 && <span style={{ fontSize: '0.65rem', color: '#ff9500' }}>🔥{row.streak}</span>}
                  </div>
                  <p style={{ color: 'var(--color-stone-light)', fontSize: '0.68rem' }}>Level {row.level ?? 1}</p>
                  {tab === 0 && <XPBar xp={row.xp ?? 0} level={row.level ?? 1} />}
                  {tab === 2 && (
                    <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 20, height: 4, overflow: 'hidden', marginTop: 4 }}>
                      <div style={{ width: `${rowStats.avgMastery}%`, height: '100%', background: '#5dde8b', borderRadius: 20 }} />
                    </div>
                  )}
                </div>
                <span style={{ color: isMe ? 'var(--color-gold)' : 'var(--color-stone-light)', fontWeight: 800, fontSize: '0.82rem', whiteSpace: 'nowrap' }}>{metric}</span>
              </div>
            )
          })}
        </div>
      )}

      {solo && !loading && (
        <div style={{ textAlign: 'center', marginTop: 20, color: 'var(--color-stone-light)', fontSize: '0.8rem', lineHeight: 1.6 }}>
          <p>🌟 Just you so far!</p>
          <p style={{ marginTop: 4, fontSize: '0.72rem', opacity: 0.7 }}>More players will appear here as others join.</p>
        </div>
      )}

      <NavBar />
    </div>
  )
}
