import useStore from '../stores/useStore'
import { MYTHOLOGY_REGIONS } from '../services/gamification'
import NavBar from '../components/shared/NavBar'

export default function MapPage() {
  const { masteryMap } = useStore()

  const getSubjectAvg = (subject) => {
    const entries = Object.entries(masteryMap).filter(([k]) => k.startsWith(subject + ':'))
    if (!entries.length) return 0
    return Math.round(entries.reduce((s, [, v]) => s + v, 0) / entries.length)
  }

  return (
    <div className="page" style={{ paddingBottom: '5rem' }}>
      <div style={{ paddingTop: '1rem', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>🗺️ Mythological Map</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Explore the lands of knowledge</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {MYTHOLOGY_REGIONS.map(region => {
          const avg = getSubjectAvg(region.subject)
          return (
            <div key={region.subject} className="card" style={{ border: `1px solid ${region.color}33` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.8rem' }}>{region.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, color: region.color }}>{region.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{region.subject}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.2rem', color: region.color }}>{avg}%</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>mastery</div>
                </div>
              </div>
              <div className="xp-bar" style={{ marginTop: '0.75rem' }}>
                <div className="xp-bar-fill" style={{ width: `${avg}%`, background: region.color }} />
              </div>
            </div>
          )
        })}
      </div>

      <NavBar />
    </div>
  )
}
