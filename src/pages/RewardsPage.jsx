import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../stores/useStore'
import { BADGES, RARITY_COLORS } from '../services/gamification'
import { DIGITAL_PRIZES, SKATE_PRIZES, RARITY_GLOW, RARITY_LABEL } from '../data/prizes'
import EmiliaCharacter from '../components/shared/EmiliaCharacter'

const TABS = ['🦄 Unicorn', '🛼 Skate', '🏅 Badges', '🎁 Prizes']

export default function RewardsPage() {
  const navigate     = useNavigate()
  const xp           = useStore(s => s.xp)
  const achievements = useStore(s => s.achievements)
  const prizes       = useStore(s => s.prizes)
  const [activeTab,  setActiveTab] = useState(0)

  const activePrizes   = prizes.filter(p => p.status === 'active')
  const unlockedParent = prizes.filter(p => ['unlocked','claimed','confirmed'].includes(p.status))

  return (
    <div className="bg-mythic" style={{ minHeight: '100vh', padding: '16px 16px 80px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <button onClick={() => navigate('/home')} style={{ background: 'transparent', border: 'none', color: 'var(--color-stone-light)', cursor: 'pointer', fontSize: '1.2rem' }}>←</button>
        <h1 style={{ fontFamily: 'var(--font-title)', color: 'var(--color-gold)', fontSize: '1.3rem' }}>🏆 My Rewards</h1>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
        {TABS.map((tab, i) => (
          <button key={i} onClick={() => setActiveTab(i)} style={{
            background: activeTab === i ? 'var(--color-gold)' : 'rgba(255,255,255,0.08)',
            color: activeTab === i ? '#1a1a00' : 'var(--color-parchment)',
            border: 'none', borderRadius: 20, padding: '8px 14px',
            fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap',
          }}>
            {tab}
          </button>
        ))}
      </div>

      {/* Unicorn Adventures */}
      {activeTab === 0 && (
        <section>
          <p style={{ color: 'var(--color-stone-light)', fontSize: '0.8rem', marginBottom: 14 }}>
            🦄 Collect all 6 magical unicorn scenes — {DIGITAL_PRIZES.filter(p => xp >= p.xpRequired).length}/{DIGITAL_PRIZES.length} unlocked!
          </p>
          <PrizeGrid prizes={DIGITAL_PRIZES} xp={xp} />
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
            <EmiliaCharacter mood="celebrate" size="sm" showBubble={false} />
          </div>
        </section>
      )}

      {/* Skate Adventures */}
      {activeTab === 1 && (
        <section>
          <p style={{ color: 'var(--color-stone-light)', fontSize: '0.8rem', marginBottom: 14 }}>
            🛼 Emilia on wheels — {SKATE_PRIZES.filter(p => xp >= p.xpRequired).length}/{SKATE_PRIZES.length} skate scenes unlocked!
          </p>
          <PrizeGrid prizes={SKATE_PRIZES} xp={xp} />
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
            <EmiliaCharacter mood="skating" size="sm" showBubble={false} skateMode />
          </div>
        </section>
      )}

      {/* Badges */}
      {activeTab === 2 && (
        <section>
          <p style={{ color: 'var(--color-stone-light)', fontSize: '0.8rem', marginBottom: 14 }}>
            🏅 {achievements.length}/{BADGES.length} badges earned
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {BADGES.map(badge => {
              const earned = achievements.includes(badge.id)
              return (
                <div key={badge.id} style={{ background: earned ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', padding: '14px 10px', textAlign: 'center', border: `2px solid ${earned ? RARITY_COLORS[badge.rarity] : 'rgba(255,255,255,0.06)'}`, opacity: earned ? 1 : 0.45 }}>
                  <div style={{ fontSize: '2rem', marginBottom: 6 }}>{earned ? badge.icon : '🔒'}</div>
                  <p style={{ color: earned ? RARITY_COLORS[badge.rarity] : 'var(--color-stone-light)', fontWeight: 800, fontSize: '0.7rem', lineHeight: 1.3 }}>
                    {badge.name}
                  </p>
                  {earned && <p style={{ color: 'var(--color-stone-light)', fontSize: '0.65rem', marginTop: 3 }}>{badge.description}</p>}
                </div>
              )
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
            <EmiliaCharacter mood={achievements.length >= 3 ? 'mischievous' : 'focused'} size="sm" showBubble skateMode />
          </div>
        </section>
      )}

      {/* Parent Prizes */}
      {activeTab === 3 && (
        <section>
          {(activePrizes.length === 0 && unlockedParent.length === 0) ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--color-stone-light)' }}>
              <p style={{ fontSize: '2.5rem', marginBottom: 12 }}>🎁</p>
              <p>No parent prizes yet!</p>
              <p style={{ fontSize: '0.8rem', marginTop: 6 }}>Ask Mum or Dad to add prizes in the Parent Panel.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[...unlockedParent, ...activePrizes].map(prize => {
                const isUnlocked = xp >= prize.xp_threshold
                const isClaimed  = prize.status === 'claimed' || prize.status === 'confirmed'
                return (
                  <div key={prize.id} style={{ background: isUnlocked ? 'rgba(201,162,39,0.12)' : 'rgba(255,255,255,0.05)', border: `2px solid ${isUnlocked ? 'var(--color-gold)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 'var(--radius-md)', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontWeight: 800, color: isUnlocked ? 'var(--color-gold)' : 'var(--color-parchment)' }}>
                        {isUnlocked ? '🎁' : '🔒'} {prize.title}
                      </p>
                      <p style={{ color: 'var(--color-stone-light)', fontSize: '0.8rem' }}>
                        {isClaimed ? '✅ Confirmed by parent!' : isUnlocked ? '⭐ Show this to Mum or Dad!' : `${prize.xp_threshold - xp} XP to unlock`}
                      </p>
                    </div>
                    {isUnlocked && !isClaimed && (
                      <div style={{ background: 'var(--color-gold)', borderRadius: 8, padding: '6px 12px', color: '#1a1a00', fontWeight: 800, fontSize: '0.8rem' }}>
                        SHOW!
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </section>
      )}
    </div>
  )
}

function PrizeGrid({ prizes, xp }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {prizes.map(prize => {
        const unlocked = xp >= prize.xpRequired
        return (
          <div key={prize.id} style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: unlocked ? '2px solid var(--color-gold)' : '2px solid rgba(255,255,255,0.1)', boxShadow: unlocked ? RARITY_GLOW[prize.rarity] : 'none', position: 'relative' }}>
            <img
              src={prize.image}
              alt={prize.name}
              style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', filter: unlocked ? 'none' : 'brightness(0.2) blur(4px)' }}
            />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.88))', padding: '20px 10px 10px' }}>
              <p style={{ color: unlocked ? 'var(--color-gold)' : 'var(--color-stone-light)', fontWeight: 800, fontSize: '0.78rem' }}>
                {unlocked ? prize.name : `🔒 ${prize.xpRequired} XP`}
              </p>
              {unlocked && <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.68rem' }}>{RARITY_LABEL[prize.rarity]}</p>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
