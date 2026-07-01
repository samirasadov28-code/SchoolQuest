import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../stores/useStore'
import { SUBJECTS, formatTime } from '../services/adaptive'
import { getSubjectAverages } from '../services/gamification'
import { addPrize, confirmPrize, getPrizes } from '../services/supabase'
import { QUESTION_BANK } from '../data/questions/index'

const PRIORITY_LABELS = { 0.5: 'Low', 1: 'Normal', 2: 'High', 3: 'Max' }
const PRIORITY_VALUES = [0.5, 1, 2, 3]

export default function ParentPage() {
  const navigate      = useNavigate()
  const user          = useStore(s => s.user)
  const profile       = useStore(s => s.profile)
  const xp            = useStore(s => s.xp)
  const level         = useStore(s => s.level)
  const streak        = useStore(s => s.streak)
  const masteryMap          = useStore(s => s.masteryMap)
  const questionsSeenMap    = useStore(s => s.questionsSeenMap)
  const questionsCorrectMap = useStore(s => s.questionsCorrectMap)
  const todaySeconds  = useStore(s => s.todaySeconds)
  const achievements  = useStore(s => s.achievements)
  const prizes        = useStore(s => s.prizes)
  const setPrizes     = useStore(s => s.setPrizes)
  const setParentMode         = useStore(s => s.setParentMode)
  const dailyGoalMinutes      = useStore(s => s.dailyGoalMinutes)
  const setDailyGoalMinutes   = useStore(s => s.setDailyGoalMinutes)

  const subjectPriorities  = useStore(s => s.subjectPriorities)
  const setSubjectPriority = useStore(s => s.setSubjectPriority)

  const [newPrizeTitle,  setNewPrizeTitle]  = useState('')
  const [newPrizeXP,     setNewPrizeXP]     = useState(500)
  const [addingPrize,    setAddingPrize]    = useState(false)
  const [savingPrize,    setSavingPrize]    = useState(false)
  const [expandedSubject, setExpandedSubject] = useState(null)
  const [statsView,       setStatsView]      = useState('answered')

  const [suggestions,    setSuggestions]    = useState([])
  const [loadingSugg,    setLoadingSugg]    = useState(false)

  const subjectAvgs = getSubjectAverages(masteryMap)
  const claimedPrizes = prizes.filter(p => p.status === 'claimed')

  useEffect(() => {
    if (user) getPrizes(user.id).then(p => p && setPrizes(p))
  }, [user])

  async function handleAddPrize() {
    if (!newPrizeTitle.trim()) return
    setSavingPrize(true)
    try {
      await addPrize(user.id, newPrizeTitle, newPrizeXP)
      const refreshed = await getPrizes(user.id)
      setPrizes(refreshed)
      setNewPrizeTitle('')
      setNewPrizeXP(500)
      setAddingPrize(false)
    } catch (e) {
      alert('Error saving prize: ' + e.message)
    } finally {
      setSavingPrize(false)
    }
  }

  async function handleConfirm(prizeId) {
    await confirmPrize(prizeId)
    const refreshed = await getPrizes(user.id)
    setPrizes(refreshed)
  }

  function handleExit() {
    setParentMode(false)
    navigate('/home')
  }

  async function handleGetSuggestions() {
    setLoadingSugg(true)
    try {
      const res = await fetch('/.netlify/functions/groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Generate 5 creative, fun prize ideas suitable for an 8-year-old girl who loves learning. These are real-world rewards a parent gives for educational achievement. Format: JSON array of short strings under 6 words each. Examples: "Movie night pick", "Ice cream adventure". Return ONLY the JSON array.`
          }],
          max_tokens: 150,
          temperature: 0.9
        })
      })
      const data = await res.json()
      const m = data.content?.match(/\[[\s\S]*\]/)
      setSuggestions(m ? JSON.parse(m[0]) : ['Movie night pick', 'Ice cream trip', 'New book choice', 'Swimming pool day', 'Stay up late night'])
    } catch {
      setSuggestions(['Movie night pick', 'Ice cream trip', 'New book choice', 'Swimming pool day', 'Stay up late night'])
    } finally {
      setLoadingSugg(false)
    }
  }

  const name = profile?.name ?? 'Your child'
  const weakest = SUBJECTS.filter(s => (subjectAvgs[s.id] ?? 0) < 50)

  return (
    <div className="bg-mythic" style={{ minHeight: '100vh', padding: '16px 16px 60px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-title)', color: 'var(--color-gold)', fontSize: '1.3rem' }}>👨‍👩‍👧 Parent Panel</h1>
          <p style={{ color: 'var(--color-stone-light)', fontSize: '0.8rem' }}>{name}'s learning dashboard</p>
        </div>
        <button className="btn-secondary" style={{ fontSize: '0.85rem', padding: '8px 16px' }} onClick={handleExit}>Exit</button>
      </div>

      {/* Key stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'Level', value: level, icon: '⚔️' },
          { label: 'Total XP', value: xp, icon: '⭐' },
          { label: 'Day Streak', value: `${streak} 🔥`, icon: '📅' },
          { label: 'Today', value: formatTime(todaySeconds), icon: '⏰' },
          { label: 'Goal', value: todaySeconds >= dailyGoalMinutes * 60 ? '✅ Met!' : `${Math.round(todaySeconds / (dailyGoalMinutes * 60) * 100)}%`, icon: '🎯' },
          { label: 'Badges', value: achievements.length, icon: '🏅' },
        ].map(stat => (
          <div key={stat.label} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 'var(--radius-md)', padding: '12px 10px', textAlign: 'center' }}>
            <p style={{ fontSize: '1.3rem', marginBottom: 2 }}>{stat.icon}</p>
            <p style={{ color: 'var(--color-gold)', fontWeight: 800, fontSize: '0.95rem' }}>{stat.value}</p>
            <p style={{ color: 'var(--color-stone-light)', fontSize: '0.7rem' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Subject breakdown — tab-based */}
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ color: 'var(--color-gold-light)', fontSize: '0.95rem', fontWeight: 800, marginBottom: 12 }}>📊 Subject Progress</h2>

        {/* Stats tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
          {[
            { key: 'answered', label: '📝 Answered' },
            { key: 'correct',  label: '✅ Correct %' },
            { key: 'mastery',  label: '⭐ Mastery' },
          ].map(tab => (
            <button key={tab.key} onClick={() => setStatsView(tab.key)} style={{
              flex: 1, padding: '8px 4px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 800,
              background: statsView === tab.key ? 'var(--color-gold)' : 'rgba(255,255,255,0.08)',
              color: statsView === tab.key ? '#1a1a00' : 'var(--color-parchment)',
            }}>{tab.label}</button>
          ))}
        </div>

        {/* Overall summary */}
        {(() => {
          const grandTotal    = QUESTION_BANK.length
          const grandAnswered = Object.values(questionsSeenMap).reduce((sum, topics) => sum + Object.values(topics).reduce((s, n) => s + n, 0), 0)
          const grandCorrect  = Object.values(questionsCorrectMap ?? {}).reduce((sum, topics) => sum + Object.values(topics).reduce((s, n) => s + n, 0), 0)
          const grandPct      = grandTotal ? Math.round(grandAnswered / grandTotal * 100) : 0
          const grandCorPct   = grandAnswered ? Math.round(grandCorrect / grandAnswered * 100) : 0
          const overallMastery = Math.round(Object.values(subjectAvgs).reduce((a, b) => a + b, 0) / (Object.values(subjectAvgs).length || 1))
          const summaryVal = statsView === 'answered' ? `${grandAnswered.toLocaleString()} / ${grandTotal.toLocaleString()} (${grandPct}%)` : statsView === 'correct' ? `${grandCorPct}% correct overall` : `${overallMastery}% average mastery`
          return (
            <div style={{ background: 'rgba(201,162,39,0.1)', border: '1px solid rgba(201,162,39,0.3)', borderRadius: 10, padding: '10px 14px', marginBottom: 12 }}>
              <p style={{ color: 'var(--color-gold)', fontWeight: 800, fontSize: '0.85rem' }}>📚 {summaryVal}</p>
            </div>
          )
        })()}

        {/* Per-subject rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {SUBJECTS.map(subj => {
            const subjQuestions = QUESTION_BANK.filter(q => q.subject === subj.id)
            const totalQ     = subjQuestions.length
            const seenMap    = questionsSeenMap[subj.id] ?? {}
            const correctMap = questionsCorrectMap?.[subj.id] ?? {}
            const answered   = Object.values(seenMap).reduce((s, n) => s + n, 0)
            const correct    = Object.values(correctMap).reduce((s, n) => s + n, 0)
            const correctPct = answered ? Math.round(correct / answered * 100) : 0
            const mastery    = Math.round(subjectAvgs[subj.id] ?? 0)

            let barPct, barColor, valueLabel
            if (statsView === 'answered') {
              barPct = totalQ ? Math.min(100, Math.round(answered / totalQ * 100)) : 0
              barColor = barPct >= 50 ? 'var(--color-emerald)' : barPct >= 15 ? 'var(--color-gold)' : 'rgba(255,255,255,0.25)'
              valueLabel = `${answered}/${totalQ}`
            } else if (statsView === 'correct') {
              barPct = correctPct
              barColor = correctPct >= 80 ? 'var(--color-emerald)' : correctPct >= 50 ? 'var(--color-gold)' : answered ? '#ff8a8a' : 'rgba(255,255,255,0.25)'
              valueLabel = answered ? `${correctPct}%` : '—'
            } else {
              barPct = mastery
              barColor = mastery >= 80 ? 'var(--color-emerald)' : mastery >= 50 ? 'var(--color-gold)' : 'rgba(255,255,255,0.35)'
              valueLabel = `${mastery}%`
            }

            const isExpanded = expandedSubject === subj.id
            const allTopics  = [...new Set(subjQuestions.map(q => q.topic))].sort()

            return (
              <div key={subj.id}>
                <div onClick={() => setExpandedSubject(isExpanded ? null : subj.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ width: 22, textAlign: 'center', fontSize: '0.9rem' }}>{subj.emoji}</span>
                  <span style={{ flex: 1, color: 'var(--color-parchment)', fontSize: '0.82rem', fontWeight: 600 }}>{subj.label}</span>
                  <div style={{ width: 80, background: 'rgba(0,0,0,0.3)', borderRadius: 20, height: 6 }}>
                    <div style={{ width: `${barPct}%`, height: '100%', background: barColor, borderRadius: 20, transition: 'width 0.4s' }} />
                  </div>
                  <span style={{ width: 44, color: barColor, fontSize: '0.72rem', textAlign: 'right', fontWeight: 800 }}>{valueLabel}</span>
                  <span style={{ color: 'var(--color-stone-light)', fontSize: '0.65rem' }}>{isExpanded ? '▲' : '▼'}</span>
                </div>

                {isExpanded && (
                  <div style={{ marginLeft: 32, marginBottom: 8, background: 'rgba(0,0,0,0.2)', borderRadius: 10, padding: '10px 12px' }}>
                    {/* Per-topic breakdown */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {allTopics.map(topic => {
                        const topicTotal    = subjQuestions.filter(q => q.topic === topic).length
                        const topicAnswered = seenMap[topic] ?? 0
                        const topicCorrect  = correctMap[topic] ?? 0
                        const tPct    = topicTotal ? Math.min(100, Math.round(topicAnswered / topicTotal * 100)) : 0
                        const tCorPct = topicAnswered ? Math.round(topicCorrect / topicAnswered * 100) : null
                        const majorityAnswered = topicTotal > 0 && topicAnswered >= Math.ceil(topicTotal / 2)
                        const topicMastered   = majorityAnswered && tCorPct !== null && tCorPct >= 60
                        const tColor  = topicAnswered === 0 ? 'rgba(255,255,255,0.2)' : topicMastered ? 'var(--color-emerald)' : tPct >= 25 ? 'var(--color-gold)' : 'rgba(255,255,255,0.35)'

                        let topicDisplay
                        if (statsView === 'answered') topicDisplay = `${topicAnswered}/${topicTotal}`
                        else if (statsView === 'correct') topicDisplay = tCorPct !== null ? `${tCorPct}%` : '—'
                        else topicDisplay = `${Math.round((masteryMap[subj.id]?.[topic] ?? 50))}%`

                        return (
                          <div key={topic} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: '0.6rem', color: topicMastered ? 'var(--color-emerald)' : topicAnswered > 0 ? 'var(--color-gold)' : 'rgba(255,255,255,0.2)' }}>{topicMastered ? '✓' : topicAnswered > 0 ? '●' : '○'}</span>
                            <span style={{ flex: 1, color: topicAnswered > 0 ? 'var(--color-stone-light)' : 'rgba(255,255,255,0.3)', fontSize: '0.73rem', textTransform: 'capitalize' }}>{topic.replace(/-/g, ' ')}</span>
                            <div style={{ width: 50, background: 'rgba(0,0,0,0.3)', borderRadius: 20, height: 4 }}>
                              <div style={{ width: `${tPct}%`, height: '100%', background: tColor, borderRadius: 20 }} />
                            </div>
                            <span style={{ width: 40, color: tColor, fontSize: '0.7rem', fontWeight: 800, textAlign: 'right' }}>{topicDisplay}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        {weakest.length > 0 && (
          <div style={{ marginTop: 12, background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.3)', borderRadius: 'var(--radius-sm)', padding: '10px 14px' }}>
            <p style={{ color: '#ff8a8a', fontSize: '0.85rem', fontWeight: 700 }}>💡 Needs more practice:</p>
            <p style={{ color: 'var(--color-parchment)', fontSize: '0.82rem' }}>{weakest.map(s => s.label).join(', ')}</p>
          </div>
        )}
      </section>

      {/* Subject Priorities */}
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ color: 'var(--color-gold-light)', fontSize: '0.95rem', fontWeight: 800, marginBottom: 6 }}>🎯 Focus Priorities</h2>
        <p style={{ color: 'var(--color-stone-light)', fontSize: '0.72rem', marginBottom: 12, opacity: 0.8 }}>
          Boost subjects you want Emilia to practise more. The adaptive engine will pick these topics more often.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {SUBJECTS.map(subj => {
            const priority = subjectPriorities[subj.id] ?? 1
            const priorityLabel = PRIORITY_LABELS[priority] ?? 'Normal'
            const priorityColor = priority >= 3 ? '#ff6b6b' : priority >= 2 ? 'var(--color-gold)' : priority <= 0.5 ? 'rgba(255,255,255,0.25)' : '#4a90d9'
            return (
              <div key={subj.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ width: 22, textAlign: 'center', fontSize: '0.9rem' }}>{subj.emoji}</span>
                <span style={{ flex: 1, color: 'var(--color-parchment)', fontSize: '0.82rem', fontWeight: 600 }}>{subj.label}</span>
                <div style={{ display: 'flex', gap: 4 }}>
                  {PRIORITY_VALUES.map(v => (
                    <button key={v} onClick={() => setSubjectPriority(subj.id, v)} style={{
                      padding: '4px 8px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: '0.68rem', fontWeight: 800,
                      background: priority === v ? priorityColor : 'rgba(255,255,255,0.08)',
                      color: priority === v ? (priority >= 2 && priority < 3 ? '#1a1a00' : '#fff') : 'var(--color-stone-light)',
                    }}>{PRIORITY_LABELS[v]}</button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Daily goal setting */}
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ color: 'var(--color-gold-light)', fontSize: '0.95rem', fontWeight: 800, marginBottom: 12 }}>⏰ Daily Study Goal</h2>
        <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--radius-md)', padding: '16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <p style={{ color: 'var(--color-parchment)', fontSize: '0.9rem' }}>Minutes per day</p>
            <span style={{ color: 'var(--color-gold)', fontWeight: 800, fontSize: '1.1rem' }}>{dailyGoalMinutes} min</span>
          </div>
          <input
            type="range" min={5} max={120} step={5}
            value={dailyGoalMinutes}
            onChange={e => setDailyGoalMinutes(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--color-gold)', marginBottom: 8 }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--color-stone-light)', fontSize: '0.72rem' }}>5 min</span>
            <span style={{ color: 'var(--color-stone-light)', fontSize: '0.72rem' }}>120 min</span>
          </div>
          <p style={{ color: 'var(--color-stone-light)', fontSize: '0.78rem', marginTop: 8 }}>
            Today: {formatTime(todaySeconds)} studied {todaySeconds >= dailyGoalMinutes * 60 ? '✅' : `(${Math.max(0, dailyGoalMinutes * 60 - todaySeconds)}s left)`}
          </p>
        </div>
      </section>

      {/* Prize board */}
      <section style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ color: 'var(--color-gold-light)', fontSize: '0.95rem', fontWeight: 800 }}>🎁 Prize Board</h2>
          <button onClick={() => setAddingPrize(!addingPrize)} className="btn-primary" style={{ fontSize: '0.8rem', padding: '8px 14px' }}>
            + Add Prize
          </button>
        </div>

        {/* Add prize form */}
        {addingPrize && (
          <div style={{ background: 'rgba(201,162,39,0.1)', border: '2px solid rgba(201,162,39,0.3)', borderRadius: 'var(--radius-md)', padding: 16, marginBottom: 12 }}>
            <p style={{ color: 'var(--color-gold)', fontWeight: 700, marginBottom: 10 }}>New Prize</p>
            <input
              type="text"
              placeholder="e.g. Ice cream trip, New book..."
              value={newPrizeTitle}
              onChange={e => setNewPrizeTitle(e.target.value)}
              style={{ ...inputStyle, marginBottom: 8 }}
            />
            <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <button type="button" onClick={handleGetSuggestions} disabled={loadingSugg}
                style={{ fontSize: '0.75rem', padding: '6px 12px', borderRadius: 20, border: '1px solid var(--color-gold)', background: 'transparent', color: 'var(--color-gold)', cursor: 'pointer', fontWeight: 700 }}>
                {loadingSugg ? '...' : '💡 Get ideas'}
              </button>
              {suggestions.map((s, i) => (
                <button key={i} type="button" onClick={() => setNewPrizeTitle(s)}
                  style={{ fontSize: '0.72rem', padding: '5px 10px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.07)', color: 'var(--color-parchment)', cursor: 'pointer' }}>
                  {s}
                </button>
              ))}
            </div>
            <label style={{ color: 'var(--color-parchment)', fontSize: '0.85rem', display: 'block', marginBottom: 6 }}>
              XP required: <strong style={{ color: 'var(--color-gold)' }}>{newPrizeXP} XP</strong>
            </label>
            <input type="range" min={100} max={5000} step={100} value={newPrizeXP} onChange={e => setNewPrizeXP(Number(e.target.value))} style={{ width: '100%', marginBottom: 12 }} />
            <p style={{ color: 'var(--color-stone-light)', fontSize: '0.78rem', marginBottom: 12 }}>
              Current XP: {xp} — {newPrizeXP > xp ? `${newPrizeXP - xp} XP away` : '🎉 Already unlocked!'}
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setAddingPrize(false)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 1 }} disabled={savingPrize} onClick={handleAddPrize}>
                {savingPrize ? 'Saving...' : 'Add Prize'}
              </button>
            </div>
          </div>
        )}

        {/* Prizes that need confirming */}
        {claimedPrizes.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <p style={{ color: '#ffaa44', fontWeight: 700, fontSize: '0.85rem', marginBottom: 8 }}>⚠️ Waiting for your confirmation:</p>
            {claimedPrizes.map(prize => (
              <div key={prize.id} style={{ background: 'rgba(255,170,68,0.1)', border: '2px solid #ffaa44', borderRadius: 'var(--radius-md)', padding: '12px 14px', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ color: 'var(--color-parchment)', fontWeight: 700 }}>🎁 {prize.title}</p>
                <button onClick={() => handleConfirm(prize.id)} className="btn-primary" style={{ fontSize: '0.8rem', padding: '8px 14px' }}>
                  ✅ Given!
                </button>
              </div>
            ))}
          </div>
        )}

        {prizes.filter(p => p.status === 'active').map(prize => (
          <div key={prize.id} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', padding: '12px 14px', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: 'var(--color-parchment)', fontWeight: 700 }}>🔒 {prize.title}</p>
              <p style={{ color: 'var(--color-stone-light)', fontSize: '0.78rem' }}>{prize.xp_threshold} XP required — {prize.xp_threshold > xp ? `${prize.xp_threshold - xp} to go` : '🎉 Unlocked!'}</p>
            </div>
          </div>
        ))}

        {prizes.length === 0 && !addingPrize && (
          <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--color-stone-light)' }}>
            <p style={{ fontSize: '2rem', marginBottom: 8 }}>🎁</p>
            <p>No prizes yet — add one to motivate {name}!</p>
          </div>
        )}
      </section>
    </div>
  )
}

const inputStyle = {
  background: 'rgba(255,255,255,0.08)',
  border: '2px solid rgba(255,255,255,0.15)',
  borderRadius: 'var(--radius-md)',
  padding: '11px 14px',
  color: 'var(--color-parchment)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.95rem',
  outline: 'none',
  width: '100%',
}
