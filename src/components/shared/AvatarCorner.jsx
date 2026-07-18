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
        width: 44, height: 44,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(201,162,39,0.25) 0%, rgba(100,60,180,0.25) 100%)',
        border: '2px solid rgba(201,162,39,0.6)',
        boxShadow: '0 0 10px rgba(201,162,39,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <img
          src={portrait}
          alt="Avatar"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center bottom',
            display: 'block',
          }}
        />
      </div>
    </button>
  )
}
