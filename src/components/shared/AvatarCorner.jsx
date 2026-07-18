import { useNavigate } from 'react-router-dom'
import useStore from '../../stores/useStore'
import { ART } from '../../data/avatars'

export default function AvatarCorner() {
  const navigate       = useNavigate()
  const selectedAvatar = useStore(s => s.selectedAvatar)
  const portrait       = ART[selectedAvatar]?.portrait ?? ART.explorer.portrait

  return (
    <button
      onClick={() => navigate('/avatar')}
      title="Change avatar"
      style={{
        background: 'none', border: 'none', padding: 0,
        cursor: 'pointer', flexShrink: 0,
      }}
    >
      <div style={{
        width: 48, height: 48,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.07)',
        overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <img
          src={portrait}
          alt="Avatar"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center',
            display: 'block',
          }}
        />
      </div>
    </button>
  )
}
