import { useState, useEffect } from 'react'
import { getArt, getSpeechLine } from '../../data/pets'

const SIZE_PX = { sm: 80, md: 120, lg: 180 }

export default function PetCompanion({ speciesId, stage = 1, mood = 'idle', name, size = 'md', showBubble = true, animate = true, onTap }) {
  const [bubble, setBubble] = useState('')
  const [animClass, setAnimClass] = useState('')

  const px  = SIZE_PX[size] ?? 120
  const src = getArt(speciesId, stage, mood)

  useEffect(() => {
    setBubble(getSpeechLine(speciesId, mood, name))
    if (!animate) return
    const cls = mood === 'eating' ? 'pet-eating' : mood === 'celebrating' ? 'pet-celebrating' : ''
    if (cls) {
      setAnimClass(cls)
      const t = setTimeout(() => setAnimClass(''), 1200)
      return () => clearTimeout(t)
    }
  }, [speciesId, mood, name, animate])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      {showBubble && bubble && (
        <div style={{
          background: 'rgba(255,255,255,0.95)', color: '#1a3a15',
          borderRadius: 14, padding: '6px 12px', fontSize: '0.78rem',
          fontWeight: 700, maxWidth: 180, textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)', lineHeight: 1.4,
          position: 'relative',
        }}>
          {bubble}
          <div style={{ position: 'absolute', bottom: -7, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderTop: '7px solid rgba(255,255,255,0.95)' }} />
        </div>
      )}
      <div style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%)', borderRadius: '50%', padding: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src={src}
          alt={`${name ?? speciesId} ${mood}`}
          width={px}
          height={px}
          className={`pet-idle pet-float ${animClass}`}
          style={{ objectFit: 'contain', cursor: onTap ? 'pointer' : 'default' }}
          onClick={onTap}
        />
      </div>
      {name && <span style={{ fontSize: '0.7rem', color: 'var(--color-gold)', fontWeight: 800 }}>{name}</span>}
    </div>
  )
}
