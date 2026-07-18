import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../stores/useStore'
import { BADGES, RARITY_COLORS } from '../services/gamification'
import { DIGITAL_PRIZES, SKATE_PRIZES, RARITY_GLOW, RARITY_LABEL } from '../data/prizes'
import EmiliaCharacter from '../components/shared/EmiliaCharacter'
import AvatarCorner from '../components/shared/AvatarCorner'

// Badge PNG images
const BADGE_IMAGES = import.meta.glob('../assets/badges/*.png', { eager: true, import: 'default' })

const TABS = ['🦄 Unicorn', '🛼 Skate', '🏅 Badges', '🎁 Prizes']

export default function RewardsPage() {
  const navigate     = useNavigate()
  const xp           = useStore(s => s.xp)
  const achievements = useStore(s => s.achievements)
  const prizes       = useStore(s => s.prizes)
  const [activeTab,      setActiveTab]      = useState(0)
  const [expandedBadge,  setExpandedBadge]  = useState(null)
  const [expandedPrize,  setExpandedPrize]  = useState(null)

  const activePrizes   = prizes.filter(p => p.status === 'active')
  const unlockedParent = prizes.filter(p => ['unlocked','claimed','confirmed'].includes(p.status))

  return (
    <div className="bg-mythic" style={{ minHeight: '100vh', padding: '16px 16px 80px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <button onClick={() => navigate('/home')} style={{ background: 'transparent', border: 'none', color: 'var(--color-stone-light)', cursor: 'pointer', fontSize: '1.2rem' }}>←</button>
        <h1 style={{ fontFamily: 'var(--font-title)', color: 'var(--color-gold)', fontSize: '1.3rem', flex: 1 }}>🏆 My Rewards</h1>
        <AvatarCorner />
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
            🦄 Collect all {DIGITAL_PRIZES.length} magical story cards — {DIGITAL_PRIZES.filter(p => xp >= p.xpRequired).length}/{DIGITAL_PRIZES.length} unlocked!
          </p>
          <PrizeGrid prizes={DIGITAL_PRIZES} xp={xp} onExpand={setExpandedPrize} />
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
            <EmiliaCharacter mood="celebrate" size="sm" showBubble={false} />
          </div>
        </section>
      )}

      {/* Skate Adventures */}
      {activeTab === 1 && (
        <section>
          <p style={{ color: 'var(--color-stone-light)', fontSize: '0.8rem', marginBottom: 14 }}>
            🛼 Emilia on wheels — {SKATE_PRIZES.filter(p => xp >= p.xpRequired).length}/{SKATE_PRIZES.length} skate adventures unlocked!
          </p>
          <PrizeGrid prizes={SKATE_PRIZES} xp={xp} onExpand={setExpandedPrize} />
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
            <EmiliaCharacter mood="skating" size="sm" showBubble={false} skateMode />
          </div>
        </section>
      )}

      {/* Badges */}
      {activeTab === 2 && (
        <section>
          <p style={{ color: 'var(--color-stone-light)', fontSize: '0.8rem', marginBottom: 14 }}>
            🏅 {achievements.length}/{BADGES.length} badges earned — tap to see details!
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, paddingBottom: 8 }}>
            {BADGES.map(badge => {
              const earned  = achievements.includes(badge.id)
              const imgSrc  = badge.img ? BADGE_IMAGES[`../assets/badges/${badge.img}.png`] : null
              return (
                <div key={badge.id} onClick={() => setExpandedBadge(earned ? badge : null)}
                  style={{ background: earned ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.15)', borderRadius: 12, padding: '10px 6px', textAlign: 'center', border: `2px solid ${earned ? RARITY_COLORS[badge.rarity] : 'rgba(255,255,255,0.08)'}`, opacity: earned ? 1 : 0.5, cursor: earned ? 'pointer' : 'default' }}>
                  <div style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
                    {earned && imgSrc
                      ? <img src={imgSrc} alt={badge.name} style={{ height: 42, width: 42, objectFit: 'contain' }} />
                      : <span style={{ fontSize: earned ? '1.5rem' : '1.2rem' }}>{earned ? badge.icon : '🔒'}</span>
                    }
                  </div>
                  <p style={{ color: earned ? RARITY_COLORS[badge.rarity] : 'var(--color-stone-light)', fontWeight: 800, fontSize: '0.6rem', lineHeight: 1.3 }}>
                    {badge.name}
                  </p>
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

      {/* Badge expanded modal */}
      {expandedBadge && (
        <div onClick={() => setExpandedBadge(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, padding: 24 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--color-forest-dark)', border: `2px solid ${RARITY_COLORS[expandedBadge.rarity]}`, borderRadius: 24, padding: 32, maxWidth: 320, width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {expandedBadge.img && BADGE_IMAGES[`../assets/badges/${expandedBadge.img}.png`]
                ? <img src={BADGE_IMAGES[`../assets/badges/${expandedBadge.img}.png`]} alt={expandedBadge.name} style={{ height: 96, width: 96, objectFit: 'contain' }} />
                : expandedBadge.icon}
            </div>
            <h2 style={{ color: RARITY_COLORS[expandedBadge.rarity], fontFamily: 'var(--font-title)', marginBottom: 8 }}>{expandedBadge.name}</h2>
            <p style={{ color: 'var(--color-parchment)', lineHeight: 1.6, marginBottom: 16 }}>{expandedBadge.description}</p>
            <p style={{ color: 'var(--color-stone-light)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{RARITY_LABEL[expandedBadge.rarity]}</p>
            <button onClick={() => setExpandedBadge(null)} style={{ marginTop: 20, padding: '10px 24px', borderRadius: 12, border: 'none', background: 'var(--color-gold)', color: '#1a1a00', fontWeight: 800, cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      )}

      {/* Prize expanded modal */}
      {expandedPrize && (
        <div onClick={() => setExpandedPrize(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 300, padding: 24 }}>
          <img src={expandedPrize.image} alt={expandedPrize.name} style={{ maxWidth: '90vw', maxHeight: '70vh', objectFit: 'contain', borderRadius: 16, marginBottom: 20 }} />
          <h2 style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-title)', marginBottom: 8, textAlign: 'center' }}>{expandedPrize.name}</h2>
          <p style={{ color: 'var(--color-stone-light)', fontSize: '0.85rem', marginBottom: 20 }}>{RARITY_LABEL[expandedPrize.rarity]}</p>
          <button onClick={() => setExpandedPrize(null)} style={{ padding: '12px 28px', borderRadius: 12, border: 'none', background: 'var(--color-gold)', color: '#1a1a00', fontWeight: 800, cursor: 'pointer', fontSize: '0.95rem' }}>Close ✕</button>
        </div>
      )}
    </div>
  )
}

function PrizeGrid({ prizes, xp, onExpand }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
      {prizes.map(prize => {
        const unlocked = xp >= prize.xpRequired
        return (
          <div key={prize.id}
            onClick={() => unlocked && onExpand && onExpand(prize)}
            style={{ borderRadius: 12, overflow: 'hidden', border: `2px solid ${unlocked ? 'var(--color-gold)' : 'rgba(255,255,255,0.1)'}`, boxShadow: unlocked ? RARITY_GLOW[prize.rarity] : 'none', cursor: unlocked ? 'pointer' : 'default', background: 'rgba(0,0,0,0.3)' }}>
            <div style={{ position: 'relative', height: 120, background: 'rgba(0,0,0,0.4)' }}>
              <img
                src={prize.image}
                alt={prize.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain', filter: unlocked ? 'none' : 'brightness(0.1) blur(4px)' }}
              />
              {!unlocked && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>🔒</div>
              )}
            </div>
            <div style={{ padding: '6px 8px' }}>
              <p style={{ color: unlocked ? 'var(--color-gold)' : 'var(--color-stone-light)', fontWeight: 800, fontSize: '0.65rem', lineHeight: 1.3 }}>
                {unlocked ? prize.name : `${prize.xpRequired} XP`}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
