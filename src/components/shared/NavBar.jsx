import { useNavigate, useLocation } from 'react-router-dom'

const items = [
  { path: '/home',    label: 'Home',    icon: '🏠' },
  { path: '/session', label: 'Learn',   icon: '⚔️' },
  { path: '/map',     label: 'Map',     icon: '🗺️' },
  { path: '/rewards', label: 'Rewards', icon: '🏆' },
  { path: '/pets',    label: 'Pets',    icon: '🐾' },
]

export default function NavBar() {
  const navigate  = useNavigate()
  const location  = useLocation()

  return (
    <nav className="nav-bar">
      {items.map(item => {
        const active = location.pathname === item.path
        return (
          <button
            key={item.path}
            className={`nav-item ${active ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
