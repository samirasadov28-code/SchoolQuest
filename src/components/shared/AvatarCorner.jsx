import { useNavigate } from 'react-router-dom'
import useStore from '../../stores/useStore'
import { ART } from '../../data/avatars'

export default function AvatarCorner() {
  const navigate       = useNavigate()
  const selectedAvatar = useStore(s => s.selectedAvatar)
  const portrait       = ART[selectedAvatar]?.portrait ?? ART.swimmer.portrait

  return (
    <button
      onClick={() => navigate('/avatar')}
      title="Change avatar"
      style={{
        background: 'none', border: 'none', padding: 0,
        cursor: 'pointer', flexShrink: 0,
      }}
    >
      <img
        src={portrait}
        alt="Avatar"
        width={40}
        height={40}
        style={{
          borderRadius: '50%',
          objectFit: 'cover',
          border: '2px solid #ffd700',
          display: 'block',
        }}
      />
    </button>
  )
}
