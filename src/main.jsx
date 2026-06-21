import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './theme/celtic.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: '100vh', background: '#0f1a0f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'sans-serif', color: '#ccc' }}>
          <h1 style={{ color: '#c9a227', marginBottom: 12 }}>☘️ SchoolQuest</h1>
          <p style={{ marginBottom: 8 }}>Something went wrong loading the app.</p>
          <pre style={{ background: '#111', padding: 12, borderRadius: 8, fontSize: '0.75rem', color: '#f87171', maxWidth: 400, overflowX: 'auto', whiteSpace: 'pre-wrap', marginBottom: 16 }}>
            {this.state.error.message}
          </pre>
          <button onClick={() => window.location.reload()} style={{ padding: '10px 24px', background: '#c9a227', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
