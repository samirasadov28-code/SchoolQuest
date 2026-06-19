import { useNavigate, useLocation } from 'react-router-dom'

const items = [
  { path: '/home', label: 'Home', icon: '🏠' },
  { path: '/session', label: 'Learn', icon: '⚔️' },
  { path: '/map', label: 'Map', icon: '🗺️' },
  { path: '/rewards', label: 'Rewards', icon: '🏆' },
  { path: '/pets', label: 'Pets', icon: '🐾' },
  { path: '/parent', label: 'Parent', icon: '👨‍👩‍👧' },
]

export default function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="nav-bar">
      {items.map(item => (
        <button
          key={item.path}
          className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          onClick={() => navigate(item.path)}
        >
          <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
