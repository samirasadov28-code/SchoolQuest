import useStore from '../stores/useStore'
import { BADGES } from '../services/gamification'
import NavBar from '../components/shared/NavBar'

const XP_PRIZES = [
  { xp: 100, name: 'Unicorn Adventure I', icon: '🦄' },
  { xp: 300, name: 'Unicorn Adventure II', icon: '🌈' },
  { xp: 600, name: 'Unicorn Adventure III', icon: '✨' },
  { xp: 1000, name: 'Unicorn Adventure IV', icon: '💎' },
  { xp: 1500, name: 'Unicorn Adventure V', icon: '🌟' },
  { xp: 2500, name: 'Unicorn Adventure VI', icon: '👑' },
]

export default function RewardsPage() {
  const { profile, achievements } = useStore()
  const xp = profile?.xp ?? 0

  return (
    <div className="page" style={{ paddingBottom: '5rem' }}>
      <div style={{ paddingTop: '1rem', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>🏆 Rewards</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Your achievements and prizes</p>
      </div>

      <h3 style={{ marginBottom: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Unicorn Adventures</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {XP_PRIZES.map(prize => {
          const unlocked = xp >= prize.xp
          return (
            <div key={prize.xp} className="card" style={{ textAlign: 'center', padding: '1rem', opacity: unlocked ? 1 : 0.5, border: unlocked ? '1px solid var(--gold)' : undefined }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{unlocked ? prize.icon : '🔒'}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: unlocked ? 'var(--gold)' : 'var(--text-muted)' }}>{prize.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{prize.xp} XP</div>
              {unlocked && <div style={{ fontSize: '0.7rem', color: 'var(--teal)', marginTop: '0.25rem' }}>✓ Unlocked!</div>}
            </div>
          )
        })}
      </div>

      <h3 style={{ marginBottom: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Celtic Badges</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {BADGES.map(badge => {
          const earned = achievements.includes(badge.id)
          return (
            <div key={badge.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: earned ? 1 : 0.5, border: earned ? '1px solid var(--gold)' : undefined }}>
              <div style={{ fontSize: '2rem' }}>{earned ? badge.icon : '🔒'}</div>
              <div>
                <div style={{ fontWeight: 600, color: earned ? 'var(--gold)' : 'var(--text-muted)' }}>{badge.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{badge.description}</div>
              </div>
              {earned && <div style={{ marginLeft: 'auto', color: 'var(--teal)', fontSize: '1.2rem' }}>✓</div>}
            </div>
          )
        })}
      </div>

      <NavBar />
    </div>
  )
}
