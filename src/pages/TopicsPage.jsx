import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SUBJECTS } from '../services/adaptive'
import { INTROS } from '../data/topicIntros'

export default function TopicsPage() {
  const navigate = useNavigate()
  const [openSubject, setOpenSubject] = useState(null)

  function toggle(id) {
    setOpenSubject(prev => prev === id ? null : id)
  }

  return (
    <div className="bg-mythic" style={{ minHeight: '100vh', padding: '16px 16px 80px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button
          onClick={() => navigate('/home')}
          style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 10, padding: '8px 14px', color: 'var(--color-gold)', cursor: 'pointer', fontSize: '0.9rem' }}
        >
          ← Back
        </button>
        <div>
          <h1 style={{ margin: 0, color: 'var(--color-gold)', fontSize: '1.4rem', fontWeight: 800 }}>📖 Explore All Topics</h1>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>Tap a subject to see every topic</p>
        </div>
      </div>

      {/* Subject list */}
      {SUBJECTS.map(subj => {
        const topics = INTROS[subj.id] ? Object.entries(INTROS[subj.id]) : []
        const isOpen = openSubject === subj.id
        return (
          <div key={subj.id} style={{ marginBottom: 12 }}>
            {/* Subject header */}
            <button
              onClick={() => toggle(subj.id)}
              style={{
                width: '100%', background: 'rgba(255,255,255,0.07)', border: `1.5px solid ${subj.color ?? 'rgba(201,162,39,0.3)'}`,
                borderRadius: 14, padding: '14px 16px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                {subj.emoji} {subj.label}
              </span>
              <span style={{ color: 'var(--color-gold)', fontSize: '0.85rem' }}>
                {topics.length} topics {isOpen ? '▲' : '▼'}
              </span>
            </button>

            {/* Topics dropdown */}
            {isOpen && (
              <div style={{ marginTop: 4, borderRadius: '0 0 14px 14px', overflow: 'hidden' }}>
                {topics.map(([topicKey, intro]) => (
                  <div
                    key={topicKey}
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      borderLeft: `3px solid ${subj.color ?? 'rgba(201,162,39,0.5)'}`,
                      padding: '12px 16px',
                      marginBottom: 2,
                    }}
                  >
                    <p style={{ margin: '0 0 4px', color: 'var(--color-gold)', fontWeight: 700, fontSize: '0.9rem', textTransform: 'capitalize' }}>
                      {topicKey.replace(/-/g, ' ')}
                    </p>
                    <p style={{ margin: 0, color: 'rgba(255,255,255,0.75)', fontSize: '0.82rem', lineHeight: 1.5 }}>
                      {intro}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
