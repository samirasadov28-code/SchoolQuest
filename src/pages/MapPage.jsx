import { useNavigate } from 'react-router-dom'
import useStore from '../stores/useStore'
import { MYTHOLOGY_REGIONS } from '../services/gamification'
import { getSubjectAverages } from '../services/gamification'
import EmiliaCharacter from '../components/shared/EmiliaCharacter'

export default function MapPage() {
  const navigate   = useNavigate()
  const masteryMap = useStore(s => s.masteryMap)
  const subjectAvgs = getSubjectAverages(masteryMap)

  return (
    <div className="bg-mythic" style={{ minHeight: '100vh', padding: '16px 16px 60px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => navigate('/home')} style={{ background: 'transparent', border: 'none', color: 'var(--color-stone-light)', cursor: 'pointer', fontSize: '1.2rem' }}>←</button>
        <h1 style={{ fontFamily: 'var(--font-title)', color: 'var(--color-gold)', fontSize: '1.3rem' }}>🗺️ Map of Ireland</h1>
      </div>

      <p style={{ color: 'var(--color-stone-light)', fontSize: '0.85rem', marginBottom: 20, textAlign: 'center' }}>
        Unlock regions of ancient Ireland by mastering each subject!
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <EmiliaCharacter mood="idle" size="sm" showBubble={false} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {MYTHOLOGY_REGIONS.map(region => {
          const score    = Math.round(subjectAvgs[region.subject] ?? 0)
          const unlocked = score >= region.unlockAt
          return (
            <div key={region.id} style={{
              background: unlocked ? 'rgba(45,90,39,0.25)' : 'rgba(0,0,0,0.25)',
              border: `2px solid ${unlocked ? 'var(--color-forest-light)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '16px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              opacity: unlocked ? 1 : 0.6,
            }}>
              <span style={{ fontSize: '2.2rem' }}>{unlocked ? region.emoji : '🔒'}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 800, color: unlocked ? 'var(--color-gold)' : 'var(--color-parchment)', marginBottom: 4 }}>
                  {unlocked ? region.name : `??? (${region.unlockAt}% mastery needed)`}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: 20, height: 6 }}>
                    <div style={{ width: `${score}%`, height: '100%', background: unlocked ? 'var(--color-forest-light)' : 'var(--color-stone)', borderRadius: 20, transition: 'width 0.6s ease' }} />
                  </div>
                  <span style={{ color: 'var(--color-stone-light)', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{score}%</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: 28, padding: '16px', background: 'rgba(201,162,39,0.1)', border: '1px solid rgba(201,162,39,0.3)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-gold)', fontWeight: 700, marginBottom: 4 }}>🏔️ The Quest of the Sí Stones</p>
        <p style={{ color: 'var(--color-stone-light)', fontSize: '0.82rem', lineHeight: 1.6 }}>
          Long ago, the druids of Ireland hid magical Sí Stones across the land. Only a true Celtic scholar can unlock each region and recover all nine stones!
        </p>
      </div>
    </div>
  )
}
