import { useState } from 'react'
import NavBar from '../components/shared/NavBar'
import { useNavigate } from 'react-router-dom'
import AvatarCorner from '../components/shared/AvatarCorner'
import useStore from '../stores/useStore'
import { MYTHOLOGY_REGIONS } from '../services/gamification'
import { getSubjectAverages } from '../services/gamification'

// Province groupings — each province on the Irish map holds certain subjects
const PROVINCES = [
  {
    id: 'ulster',
    name: 'Ulster',
    color: '#4a90d9',
    emoji: '🏔️',
    position: { gridRow: '1', gridColumn: '2' },
    subjects: ['history', 'irish'],
  },
  {
    id: 'connacht',
    name: 'Connacht',
    color: '#27ae60',
    emoji: '🌿',
    position: { gridRow: '2', gridColumn: '1' },
    subjects: ['maths', 'genknow'],
  },
  {
    id: 'leinster',
    name: 'Leinster',
    color: '#c9a227',
    emoji: '⚔️',
    position: { gridRow: '2', gridColumn: '2' },
    subjects: ['english', 'geography'],
  },
  {
    id: 'munster',
    name: 'Munster',
    color: '#8e44ad',
    emoji: '🌊',
    position: { gridRow: '3', gridColumn: '1 / span 2' },
    subjects: ['science', 'sphe', 'ethics'],
  },
]

export default function MapPage() {
  const navigate    = useNavigate()
  const masteryMap  = useStore(s => s.masteryMap)
  const subjectAvgs = getSubjectAverages(masteryMap)
  const [selectedProvince, setSelectedProvince] = useState(null)

  function getProvinceScore(province) {
    const scores = province.subjects.map(s => subjectAvgs[s] ?? 0)
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  }

  const selected = selectedProvince ? PROVINCES.find(p => p.id === selectedProvince) : null
  const selectedScore = selected ? getProvinceScore(selected) : 0
  const selectedRegions = selected
    ? MYTHOLOGY_REGIONS.filter(r => selected.subjects.includes(r.subject))
    : []

  return (
    <div className="bg-mythic" style={{ minHeight: '100vh', padding: '16px 16px 80px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <button onClick={() => navigate('/home')} style={{ background: 'transparent', border: 'none', color: 'var(--color-stone-light)', cursor: 'pointer', fontSize: '1.2rem' }}>←</button>
        <h1 style={{ fontFamily: 'var(--font-title)', color: 'var(--color-gold)', fontSize: '1.3rem', flex: 1 }}>🗺️ Map of Ireland</h1>
        <AvatarCorner />
      </div>

      <p style={{ color: 'var(--color-stone-light)', fontSize: '0.82rem', marginBottom: 20, textAlign: 'center' }}>
        Master subjects to unlock ancient Irish landmarks! Tap a province to explore.
      </p>

      {/* Stylised Ireland province map */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto auto', gap: 8, marginBottom: 24, maxWidth: 340, margin: '0 auto 24px' }}>
        {/* Ulster — top centre */}
        <div style={{ gridRow: '1', gridColumn: '1 / span 2', display: 'flex', justifyContent: 'center' }}>
          <ProvinceCard province={PROVINCES[0]} score={getProvinceScore(PROVINCES[0])} selected={selectedProvince === PROVINCES[0].id} onSelect={setSelectedProvince} />
        </div>
        {/* Connacht — left */}
        <ProvinceCard province={PROVINCES[1]} score={getProvinceScore(PROVINCES[1])} selected={selectedProvince === PROVINCES[1].id} onSelect={setSelectedProvince} />
        {/* Leinster — right */}
        <ProvinceCard province={PROVINCES[2]} score={getProvinceScore(PROVINCES[2])} selected={selectedProvince === PROVINCES[2].id} onSelect={setSelectedProvince} />
        {/* Munster — bottom spanning full */}
        <div style={{ gridColumn: '1 / span 2' }}>
          <ProvinceCard province={PROVINCES[3]} score={getProvinceScore(PROVINCES[3])} selected={selectedProvince === PROVINCES[3].id} onSelect={setSelectedProvince} wide />
        </div>
      </div>

      {/* Selected province detail */}
      {selected && (
        <div style={{ background: `${selected.color}18`, border: `2px solid ${selected.color}55`, borderRadius: 16, padding: 20, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ color: selected.color, fontFamily: 'var(--font-title)', fontSize: '1.1rem' }}>
              {selected.emoji} {selected.name}
            </h2>
            <span style={{ color: selected.color, fontWeight: 800, fontSize: '1rem' }}>{selectedScore}%</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {selectedRegions.map(region => {
              const score = Math.round(subjectAvgs[region.subject] ?? 0)
              const unlocked = score >= region.unlockAt
              return (
                <div key={region.id} style={{ background: unlocked ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.2)', borderRadius: 10, padding: '10px 14px', border: `1px solid ${unlocked ? selected.color + '44' : 'rgba(255,255,255,0.06)'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontWeight: 800, color: unlocked ? 'var(--color-gold)' : 'var(--color-stone-light)', fontSize: '0.88rem' }}>
                      {unlocked ? region.emoji : '🔒'} {region.name}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: unlocked ? '#5dde8b' : 'var(--color-stone-light)', fontWeight: 700 }}>
                      {score}%
                    </span>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 20, height: 5, overflow: 'hidden' }}>
                    <div style={{ width: `${score}%`, height: '100%', background: unlocked ? selected.color : 'rgba(255,255,255,0.2)', borderRadius: 20, transition: 'width 0.6s' }} />
                  </div>
                  {unlocked && region.legend && (
                    <div style={{ background: `${selected.color}18`, borderRadius: 8, padding: '8px 10px', marginTop: 8, border: `1px solid ${selected.color}33` }}>
                      <p style={{ color: 'var(--color-gold)', fontWeight: 800, fontSize: '0.7rem', marginBottom: 4 }}>🏺 Ancient Legend Unlocked!</p>
                      <p style={{ color: 'var(--color-parchment)', fontSize: '0.72rem', lineHeight: 1.5 }}>{region.legend}</p>
                    </div>
                  )}
                  {!unlocked && (
                    <p style={{ color: 'var(--color-stone-light)', fontSize: '0.68rem', marginTop: 4 }}>
                      Reach {region.unlockAt}% in {region.subject} to reveal this landmark
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Legend */}
      <div style={{ background: 'rgba(201,162,39,0.08)', border: '1px solid rgba(201,162,39,0.25)', borderRadius: 12, padding: '14px 16px', textAlign: 'center', marginBottom: 20 }}>
        <p style={{ color: 'var(--color-gold)', fontWeight: 700, marginBottom: 6 }}>🏔️ The Quest of the Sí Stones</p>
        <p style={{ color: 'var(--color-stone-light)', fontSize: '0.8rem', lineHeight: 1.6 }}>
          Ancient druids hid magical stones across the four provinces of Ireland. Master each subject to reveal the hidden landmarks and unlock their ancient legends!
        </p>
      </div>
      <NavBar />
    </div>
  )
}

function ProvinceCard({ province, score, selected, onSelect, wide }) {
  const unlocked = score >= 50
  return (
    <div onClick={() => onSelect(selected ? null : province.id)}
      style={{
        background: selected ? `${province.color}30` : unlocked ? `${province.color}18` : 'rgba(0,0,0,0.25)',
        border: `2px solid ${selected ? province.color : unlocked ? province.color + '55' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: 14, padding: wide ? '14px 20px' : '14px 10px',
        cursor: 'pointer', textAlign: 'center',
        display: 'flex', flexDirection: wide ? 'row' : 'column',
        alignItems: 'center', gap: wide ? 16 : 6,
        transition: 'all 0.2s',
        width: wide ? '100%' : undefined,
      }}>
      <div style={{ fontSize: wide ? '2rem' : '1.6rem' }}>{province.emoji}</div>
      <div style={{ flex: wide ? 1 : undefined }}>
        <p style={{ color: unlocked ? province.color : 'var(--color-stone-light)', fontWeight: 800, fontSize: '0.82rem' }}>{province.name}</p>
        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 20, height: 4, overflow: 'hidden', marginTop: 4, width: wide ? 120 : '100%' }}>
          <div style={{ width: `${score}%`, height: '100%', background: province.color, borderRadius: 20, transition: 'width 0.6s' }} />
        </div>
        <p style={{ color: province.color, fontSize: '0.7rem', fontWeight: 800, marginTop: 2 }}>{score}%</p>
      </div>
    </div>
  )
}
