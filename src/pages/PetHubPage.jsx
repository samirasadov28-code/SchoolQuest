import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../stores/useStore'
import { PET_SPECIES, getArt, getPetMoodFromState, filterPetName, getPetStage } from '../data/pets'
import PetCompanion from '../components/shared/PetCompanion'
import NavBar from '../components/shared/NavBar'

export default function PetHubPage() {
  const navigate       = useNavigate()
  const xp             = useStore(s => s.xp)
  const level          = useStore(s => s.level)
  const masteryMap     = useStore(s => s.masteryMap)
  const achievements   = useStore(s => s.achievements)
  const pets           = useStore(s => s.pets)
  const activePetId    = useStore(s => s.activePetId)
  const chooseStarterPet = useStore(s => s.chooseStarterPet)
  const setActivePet   = useStore(s => s.setActivePet)
  const renamePet      = useStore(s => s.renamePet)
  const playWithPet    = useStore(s => s.playWithPet)

  const [choosing,    setChoosing]    = useState(false)
  const [chosenId,    setChosenId]    = useState(null)
  const [nameInput,   setNameInput]   = useState('')
  const [nameError,   setNameError]   = useState('')
  const [renaming,    setRenaming]    = useState(null)
  const [renameInput, setRenameInput] = useState('')
  const [playMsg,     setPlayMsg]     = useState('')

  const activePet = pets.find(p => p.id === activePetId)

  // Overall mastery for unlock checks
  const allScores = Object.values(masteryMap).flatMap(t => Object.values(t))
  const overallMastery = allScores.length ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0

  function isUnlocked(species) {
    const c = species.unlockCondition
    if (c.type === 'starter') return true
    if (c.type === 'level') return level >= c.value
    if (c.type === 'mastery') return overallMastery >= c.value
    if (c.type === 'xp') return xp >= c.value
    if (c.type === 'badge') return achievements.includes(c.value)
    return false
  }

  function unlockHint(species) {
    const c = species.unlockCondition
    if (c.type === 'level') return `Reach Level ${c.value}`
    if (c.type === 'mastery') return `Reach ${c.value}% overall mastery`
    if (c.type === 'xp') return `Earn ${c.value} XP`
    if (c.type === 'badge') return `Earn the ${c.value} badge`
    return ''
  }

  function handleAdopt() {
    const result = filterPetName(nameInput)
    if (!result.ok) { setNameError("Let's pick a nicer name!"); return }
    if (!result.cleaned) { setNameError('Please enter a name!'); return }
    chooseStarterPet(chosenId, result.cleaned)
    setChoosing(false); setChosenId(null); setNameInput('')
  }

  function handleRename() {
    const result = filterPetName(renameInput)
    if (!result.ok || !result.cleaned) { setNameError("Let's pick a nicer name!"); return }
    renamePet(renaming, result.cleaned)
    setRenaming(null); setRenameInput(''); setNameError('')
  }

  function handlePlay() {
    const ok = playWithPet()
    setPlayMsg(ok ? '🎉 Playtime! Your pet is so happy!' : '⏳ Your pet needs a rest — come back in a bit!')
    setTimeout(() => setPlayMsg(''), 3000)
  }

  return (
    <div className="bg-mythic" style={{ minHeight: '100vh', padding: '16px 16px 80px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => navigate('/home')} style={{ background: 'transparent', border: 'none', color: 'var(--color-stone-light)', cursor: 'pointer', fontSize: '1.2rem' }}>←</button>
        <h1 style={{ fontFamily: 'var(--font-title)', color: 'var(--color-gold)', fontSize: '1.3rem' }}>🐾 Pet Companions</h1>
      </div>

      {/* No pets yet → choose starter */}
      {pets.length === 0 && !choosing && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <p style={{ fontSize: '2.5rem', marginBottom: 12 }}>🐾</p>
          <h2 style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-title)', marginBottom: 8 }}>Choose your companion!</h2>
          <p style={{ color: 'var(--color-stone-light)', fontSize: '0.9rem', marginBottom: 24 }}>Pick a pet to join you on your learning quest!</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {PET_SPECIES.map(sp => {
              const unlocked = isUnlocked(sp)
              if (!unlocked) return (
                <div key={sp.id} style={{ background: 'rgba(0,0,0,0.2)', border: '2px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '16px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: 0.5 }}>
                  <img src={getArt(sp.id, 1, 'portrait')} alt={sp.name} style={{ width: 80, height: 80, objectFit: 'contain', filter: 'grayscale(1) brightness(0.5)' }} />
                  <span style={{ color: 'var(--color-stone-light)', fontWeight: 800, fontSize: '0.9rem' }}>{sp.emoji} {sp.name}</span>
                  <span style={{ color: 'var(--color-stone-light)', fontSize: '0.7rem' }}>🔒 {unlockHint(sp)}</span>
                </div>
              )
              return (
                <button key={sp.id} onClick={() => { setChoosing(true); setChosenId(sp.id); setNameInput(sp.defaultName) }}
                  style={{ background: 'rgba(255,255,255,0.07)', border: '2px solid var(--color-gold)', borderRadius: 16, padding: '16px 10px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <img src={getArt(sp.id, 1, 'portrait')} alt={sp.name} style={{ width: 80, height: 80, objectFit: 'contain' }} />
                  <span style={{ color: 'var(--color-gold)', fontWeight: 800, fontSize: '0.9rem' }}>{sp.emoji} {sp.name}</span>
                  <span style={{ color: 'var(--color-stone-light)', fontSize: '0.72rem' }}>{sp.description}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Name input modal */}
      {choosing && chosenId && (
        <div style={{ background: 'rgba(0,0,0,0.6)', position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}>
          <div style={{ background: 'var(--color-forest-dark)', border: '2px solid var(--color-gold)', borderRadius: 20, padding: 28, maxWidth: 320, width: '100%', textAlign: 'center' }}>
            <img src={getArt(chosenId, 1, 'happy')} alt={chosenId} style={{ width: 100, height: 100, objectFit: 'contain', marginBottom: 12 }} />
            <h3 style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-title)', marginBottom: 8 }}>Name your {PET_SPECIES.find(s=>s.id===chosenId)?.name}!</h3>
            <input
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              maxLength={16}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '2px solid var(--color-gold)', background: 'rgba(255,255,255,0.08)', color: 'var(--color-parchment)', fontSize: '1rem', textAlign: 'center', marginBottom: 8 }}
            />
            {nameError && <p style={{ color: 'var(--color-crimson)', fontSize: '0.8rem', marginBottom: 8 }}>{nameError}</p>}
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { setChoosing(false); setNameError('') }} style={{ flex: 1, padding: '10px', borderRadius: 10, border: '1px solid var(--color-stone)', background: 'rgba(255,255,255,0.07)', color: 'var(--color-stone-light)', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleAdopt} style={{ flex: 2, padding: '10px', borderRadius: 10, border: 'none', background: 'var(--color-gold)', color: '#1a1a00', fontWeight: 800, cursor: 'pointer', fontSize: '0.95rem' }}>
                Adopt {nameInput || '...'}! 🐾
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename modal */}
      {renaming && (
        <div style={{ background: 'rgba(0,0,0,0.6)', position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}>
          <div style={{ background: 'var(--color-forest-dark)', border: '2px solid var(--color-gold)', borderRadius: 20, padding: 28, maxWidth: 300, width: '100%', textAlign: 'center' }}>
            <h3 style={{ color: 'var(--color-gold)', marginBottom: 12 }}>Rename your pet 💛</h3>
            <input value={renameInput} onChange={e => setRenameInput(e.target.value)} maxLength={16}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '2px solid var(--color-gold)', background: 'rgba(255,255,255,0.08)', color: 'var(--color-parchment)', fontSize: '1rem', textAlign: 'center', marginBottom: 8 }} />
            {nameError && <p style={{ color: 'var(--color-crimson)', fontSize: '0.8rem', marginBottom: 8 }}>{nameError}</p>}
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { setRenaming(null); setNameError('') }} style={{ flex: 1, padding: '10px', borderRadius: 10, border: '1px solid var(--color-stone)', background: 'rgba(255,255,255,0.07)', color: 'var(--color-stone-light)', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleRename} style={{ flex: 2, padding: '10px', borderRadius: 10, border: 'none', background: 'var(--color-gold)', color: '#1a1a00', fontWeight: 800, cursor: 'pointer' }}>Save 💛</button>
            </div>
          </div>
        </div>
      )}

      {/* Active pet display */}
      {activePet && (
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          {playMsg && <p style={{ color: 'var(--color-gold)', fontWeight: 800, marginBottom: 8, fontSize: '0.9rem' }}>{playMsg}</p>}
          <PetCompanion
            speciesId={activePet.id}
            stage={getPetStage(activePet.petXp, activePet.id)}
            mood={getPetMoodFromState(activePet.happiness)}
            name={activePet.name}
            size="lg"
            onTap={handlePlay}
          />
          <p style={{ color: 'var(--color-stone-light)', fontSize: '0.75rem', marginTop: 6 }}>Tap to play! 🎮</p>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16, maxWidth: 300, margin: '16px auto 0' }}>
            {[
              { label: 'Happiness', value: activePet.happiness, color: '#22c55e' },
              { label: 'Hunger',    value: activePet.hunger,    color: '#f59e0b' },
            ].map(stat => (
              <div key={stat.label} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 12, padding: '10px 12px' }}>
                <p style={{ color: 'var(--color-stone-light)', fontSize: '0.7rem', marginBottom: 4 }}>{stat.label}</p>
                <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 20, height: 8, overflow: 'hidden' }}>
                  <div style={{ width: `${stat.value}%`, background: stat.color, height: '100%', borderRadius: 20, transition: 'width 0.4s' }} />
                </div>
                <p style={{ color: stat.color, fontSize: '0.7rem', marginTop: 3, fontWeight: 800 }}>{stat.value}%</p>
              </div>
            ))}
          </div>

          {/* Pet XP */}
          <div style={{ marginTop: 12, maxWidth: 300, margin: '12px auto 0' }}>
            <p style={{ color: 'var(--color-stone-light)', fontSize: '0.72rem', marginBottom: 4 }}>
              Stage {getPetStage(activePet.petXp, activePet.id)} · {activePet.petXp} pet XP
            </p>
            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 20, height: 8, overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(100, (activePet.petXp % 200) / 2)}%`, background: 'var(--color-gold)', height: '100%', borderRadius: 20, transition: 'width 0.4s' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 14 }}>
            <button onClick={() => { setRenaming(activePet.id); setRenameInput(activePet.name); setNameError('') }}
              style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid var(--color-stone)', background: 'rgba(255,255,255,0.07)', color: 'var(--color-stone-light)', cursor: 'pointer', fontSize: '0.8rem' }}>
              ✏️ Rename
            </button>
          </div>
        </div>
      )}

      {/* Collection */}
      {pets.length > 0 && (
        <>
          <h3 style={{ color: 'var(--color-stone-light)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Your Collection</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 20 }}>
            {PET_SPECIES.map(sp => {
              const owned   = pets.find(p => p.id === sp.id)
              const unlocked = isUnlocked(sp)
              const isActive = activePetId === sp.id
              return (
                <div key={sp.id} onClick={() => owned && setActivePet(sp.id)}
                  style={{ background: isActive ? 'rgba(201,162,39,0.15)' : 'rgba(255,255,255,0.06)', border: `2px solid ${isActive ? 'var(--color-gold)' : owned ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 14, padding: '14px 10px', textAlign: 'center', cursor: owned ? 'pointer' : 'default', opacity: !unlocked && !owned ? 0.45 : 1 }}>
                  <img src={getArt(sp.id, 1, 'portrait')} alt={sp.name}
                    style={{ width: 64, height: 64, objectFit: 'contain', filter: !owned ? 'grayscale(0.7) brightness(0.6)' : 'none' }} />
                  <p style={{ color: owned ? 'var(--color-gold)' : 'var(--color-stone-light)', fontWeight: 800, fontSize: '0.8rem', marginTop: 6 }}>
                    {sp.emoji} {owned ? owned.name : sp.name}
                  </p>
                  {owned
                    ? <p style={{ color: 'var(--color-stone-light)', fontSize: '0.65rem' }}>Stage {getPetStage(owned.petXp, sp.id)} · {owned.petXp} XP</p>
                    : <p style={{ color: 'var(--color-stone-light)', fontSize: '0.65rem' }}>{unlocked ? '🔓 Tap to unlock!' : `🔒 ${unlockHint(sp)}`}</p>
                  }
                  {isActive && <p style={{ color: 'var(--color-gold)', fontSize: '0.65rem', fontWeight: 800, marginTop: 3 }}>★ Active</p>}
                </div>
              )
            })}
          </div>

          {/* Unlock new pets */}
          {PET_SPECIES.filter(sp => isUnlocked(sp) && !pets.find(p => p.id === sp.id)).map(sp => (
            <button key={sp.id} onClick={() => { setChoosing(true); setChosenId(sp.id); setNameInput(sp.defaultName) }}
              style={{ width: '100%', marginBottom: 10, padding: '12px', borderRadius: 12, border: '2px dashed var(--color-gold)', background: 'rgba(201,162,39,0.08)', color: 'var(--color-gold)', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem' }}>
              🐾 Adopt your {sp.emoji} {sp.name}!
            </button>
          ))}
        </>
      )}

      <NavBar />
    </div>
  )
}
