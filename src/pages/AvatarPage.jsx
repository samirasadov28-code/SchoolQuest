import { useNavigate } from 'react-router-dom'
import useStore, { xpForNextLevel } from '../stores/useStore'
import { AVATAR_STYLES, ART } from '../data/avatars'

export default function AvatarPage() {
  const navigate         = useNavigate()
  const level            = useStore(s => s.level)
  const xp               = useStore(s => s.xp)
  const selectedAvatar   = useStore(s => s.selectedAvatar)
  const setSelectedAvatar = useStore(s => s.setSelectedAvatar)

  // Find next locked avatar for progress bar
  const nextLocked = AVATAR_STYLES.find(a => a.unlockLevel > level)
  const prevUnlockLevel = nextLocked
    ? (AVATAR_STYLES[AVATAR_STYLES.indexOf(nextLocked) - 1]?.unlockLevel ?? 1)
    : null

  const activeStyle = AVATAR_STYLES.find(a => a.id === selectedAvatar) ?? AVATAR_STYLES[0]

  const encouragements = [
    `You're rocking it as ${activeStyle.name}! Keep going! ⭐`,
    `${activeStyle.emoji} ${activeStyle.description} You've got this!`,
    `Level ${level} and climbing — new avatars await! 🚀`,
  ]
  const bubble = encouragements[Math.floor(Date.now() / 1000) % encouragements.length]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a0a2e 0%, #16213e 50%, #0f3460 100%)',
      color: '#fff',
      padding: '0 0 80px',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '16px 16px 0',
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', borderRadius: 12, padding: '8px 14px', cursor: 'pointer', fontSize: '1rem' }}
        >
          ← Back
        </button>
        <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>⚡ Your Avatar</h1>
      </div>

      {/* Current avatar preview + speech bubble */}
      <div style={{ textAlign: 'center', padding: '24px 16px 16px' }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img
            src={ART[selectedAvatar]?.portrait ?? ART.swimmer.portrait}
            alt={activeStyle.name}
            width={140}
            style={{ borderRadius: '50%', border: '4px solid #ffd700', objectFit: 'cover', display: 'block' }}
          />
        </div>
        <div style={{
          margin: '12px auto 0', maxWidth: 260,
          background: 'rgba(255,255,255,0.12)', borderRadius: 14,
          padding: '10px 16px', fontSize: '0.9rem', fontWeight: 600,
        }}>
          {bubble}
        </div>
      </div>

      {/* XP progress to next unlock */}
      {nextLocked && (
        <div style={{ margin: '0 16px 20px' }}>
          <div style={{ fontSize: '0.8rem', opacity: 0.75, marginBottom: 6, textAlign: 'center' }}>
            Reach Level {nextLocked.unlockLevel} to unlock {nextLocked.emoji} {nextLocked.name}
          </div>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 20, height: 10, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 20,
              background: 'linear-gradient(90deg, #ffd700, #ffaa00)',
              width: `${Math.min(100, ((level - (prevUnlockLevel ?? 1)) / (nextLocked.unlockLevel - (prevUnlockLevel ?? 1))) * 100)}%`,
              transition: 'width 0.4s',
            }} />
          </div>
          <div style={{ fontSize: '0.75rem', opacity: 0.6, textAlign: 'right', marginTop: 4 }}>
            Level {level} / {nextLocked.unlockLevel}
          </div>
        </div>
      )}

      {/* Avatar grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 14, margin: '0 16px',
      }}>
        {AVATAR_STYLES.map(style => {
          const unlocked  = level >= style.unlockLevel
          const isActive  = selectedAvatar === style.id
          const portrait  = ART[style.id]?.portrait ?? ART.swimmer.portrait

          return (
            <div key={style.id} style={{
              background: isActive
                ? 'linear-gradient(135deg, rgba(255,215,0,0.25), rgba(255,170,0,0.15))'
                : 'rgba(255,255,255,0.07)',
              borderRadius: 18,
              padding: '16px 12px',
              textAlign: 'center',
              border: isActive ? '2px solid #ffd700' : '2px solid rgba(255,255,255,0.1)',
              position: 'relative',
              transition: 'all 0.2s',
              filter: unlocked ? 'none' : 'grayscale(0.85)',
              opacity: unlocked ? 1 : 0.65,
            }}>
              {isActive && (
                <div style={{
                  position: 'absolute', top: 8, right: 8,
                  background: '#ffd700', color: '#1a0a2e',
                  borderRadius: 20, padding: '2px 8px',
                  fontSize: '0.7rem', fontWeight: 800,
                }}>
                  ✓ Active
                </div>
              )}
              {!unlocked && (
                <div style={{
                  position: 'absolute', top: 8, left: 8,
                  fontSize: '1.1rem',
                }}>
                  🔒
                </div>
              )}
              <img
                src={portrait}
                alt={style.name}
                width={80}
                style={{ borderRadius: '50%', objectFit: 'cover', border: isActive ? '3px solid #ffd700' : '3px solid rgba(255,255,255,0.2)' }}
              />
              <div style={{ marginTop: 8, fontSize: '1.3rem' }}>{style.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginTop: 2 }}>{style.name}</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: 2 }}>{style.description}</div>
              {!unlocked ? (
                <div style={{
                  marginTop: 10, fontSize: '0.75rem', fontWeight: 700,
                  color: '#ffd700', opacity: 0.9,
                }}>
                  Level {style.unlockLevel} to unlock
                </div>
              ) : isActive ? null : (
                <button
                  onClick={() => setSelectedAvatar(style.id)}
                  style={{
                    marginTop: 10, padding: '6px 18px',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: '#fff', border: 'none', borderRadius: 20,
                    fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
                  }}
                >
                  Select
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
