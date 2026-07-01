import { useNavigate } from 'react-router-dom'
import useStore from '../stores/useStore'
import { AVATAR_STYLES, ART } from '../data/avatars'

export default function AvatarPage() {
  const navigate          = useNavigate()
  const level             = useStore(s => s.level)
  const selectedAvatar    = useStore(s => s.selectedAvatar)
  const setSelectedAvatar = useStore(s => s.setSelectedAvatar)

  const nextLocked = AVATAR_STYLES.find(a => a.unlockLevel > level)
  const prevUnlockLevel = nextLocked
    ? (AVATAR_STYLES[AVATAR_STYLES.indexOf(nextLocked) - 1]?.unlockLevel ?? 1)
    : null

  const activeStyle = AVATAR_STYLES.find(a => a.id === selectedAvatar) ?? AVATAR_STYLES[0]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a0a2e 0%, #16213e 50%, #0f3460 100%)',
      color: '#fff',
      padding: '0 0 80px',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 16px 0' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', borderRadius: 12, padding: '8px 14px', cursor: 'pointer', fontSize: '1rem' }}
        >
          ← Back
        </button>
        <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>⚡ Your Avatar</h1>
      </div>

      {/* Current avatar large preview */}
      <div style={{ textAlign: 'center', padding: '20px 16px 8px' }}>
        <img
          src={ART[selectedAvatar]?.portrait ?? ART.explorer.portrait}
          alt={activeStyle.name}
          style={{ height: 160, objectFit: 'contain', display: 'block', margin: '0 auto' }}
        />
        <div style={{ fontWeight: 800, fontSize: '1.1rem', marginTop: 8 }}>{activeStyle.name}</div>
        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{activeStyle.description}</div>
      </div>

      {/* XP progress to next unlock */}
      {nextLocked && (
        <div style={{ margin: '12px 16px 20px' }}>
          <div style={{ fontSize: '0.78rem', opacity: 0.7, marginBottom: 6, textAlign: 'center' }}>
            Reach Level {nextLocked.unlockLevel} to unlock {nextLocked.emoji} {nextLocked.name}
          </div>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 20, height: 8, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 20,
              background: 'linear-gradient(90deg, #ffd700, #ffaa00)',
              width: `${Math.min(100, ((level - (prevUnlockLevel ?? 1)) / (nextLocked.unlockLevel - (prevUnlockLevel ?? 1))) * 100)}%`,
              transition: 'width 0.4s',
            }} />
          </div>
          <div style={{ fontSize: '0.7rem', opacity: 0.55, textAlign: 'right', marginTop: 3 }}>
            Level {level} / {nextLocked.unlockLevel}
          </div>
        </div>
      )}

      {/* Avatar grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, margin: '0 16px' }}>
        {AVATAR_STYLES.map(style => {
          const unlocked = level >= style.unlockLevel
          const isActive = selectedAvatar === style.id
          const portrait = ART[style.id]?.portrait ?? ART.explorer.portrait

          return (
            <div key={style.id}
              onClick={() => unlocked && !isActive && setSelectedAvatar(style.id)}
              style={{
                background: isActive
                  ? 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,170,0,0.1))'
                  : 'rgba(255,255,255,0.07)',
                borderRadius: 18,
                padding: '20px 12px 16px',
                textAlign: 'center',
                border: isActive ? '2px solid #ffd700' : '2px solid rgba(255,255,255,0.1)',
                position: 'relative',
                cursor: unlocked && !isActive ? 'pointer' : 'default',
                filter: unlocked ? 'none' : 'grayscale(0.8)',
                opacity: unlocked ? 1 : 0.6,
              }}
            >
              {isActive && (
                <div style={{
                  position: 'absolute', top: 8, right: 8,
                  background: '#ffd700', color: '#1a0a2e',
                  borderRadius: 20, padding: '2px 8px',
                  fontSize: '0.65rem', fontWeight: 800,
                }}>✓ Active</div>
              )}
              {!unlocked && (
                <div style={{ position: 'absolute', top: 8, left: 8, fontSize: '1rem' }}>🔒</div>
              )}

              {/* Avatar image — no circle, no border, consistent height */}
              <div style={{ height: 130, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: 10 }}>
                <img
                  src={portrait}
                  alt={style.name}
                  style={{ maxHeight: 130, maxWidth: '100%', objectFit: 'contain', display: 'block' }}
                />
              </div>

              <div style={{ fontSize: '1.2rem' }}>{style.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginTop: 4 }}>{style.name}</div>
              <div style={{ fontSize: '0.72rem', opacity: 0.65, marginTop: 2 }}>{style.description}</div>
              {!unlocked && (
                <div style={{ marginTop: 8, fontSize: '0.72rem', fontWeight: 700, color: '#ffd700' }}>
                  Level {style.unlockLevel} to unlock
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
