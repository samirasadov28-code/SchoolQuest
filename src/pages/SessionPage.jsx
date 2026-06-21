import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../stores/useStore'
import { QUESTION_BANK } from '../data/questions/index'
import { pickNextQuestion, updateMastery, shouldTriggerLearnMode, formatTime, XP_PER_CORRECT, SUBJECTS } from '../services/adaptive'
import { upsertProgress, logSession, grantAchievement } from '../services/supabase'
import { getExplanation as generateExplanation } from '../services/groq'
import { checkBadges, getSubjectAverages, countMasteredSubjects } from '../services/gamification'
import EmiliaCharacter from '../components/shared/EmiliaCharacter'

const QUESTION_TIMER = 30 // seconds per question

export default function SessionPage() {
  const navigate    = useNavigate()
  const user        = useStore(s => s.user)
  const masteryMap  = useStore(s => s.masteryMap)
  const sessionSeenIds    = useStore(s => s.sessionSeenIds)
  const sessionSubjects   = useStore(s => s.sessionSubjects)
  const consecutiveWrong  = useStore(s => s.consecutiveWrong)
  const addSeenQuestion   = useStore(s => s.addSeenQuestion)
  const incrementWrong    = useStore(s => s.incrementWrong)
  const resetWrong        = useStore(s => s.resetWrong)
  const addSessionXP      = useStore(s => s.addSessionXP)
  const updateMasteryMap  = useStore(s => s.updateMasteryMap)
  const addSessionSeconds = useStore(s => s.addSessionSeconds)
  const addXP             = useStore(s => s.addXP)
  const achievements      = useStore(s => s.achievements)
  const addAchievement    = useStore(s => s.addAchievement)
  const clearSession      = useStore(s => s.clearSession)
  const sessionXP         = useStore(s => s.sessionXP)
  const generatedQuestions= useStore(s => s.generatedQuestions)
  const feedActivePet     = useStore(s => s.feedActivePet)

  const allQuestions = [...QUESTION_BANK, ...generatedQuestions]

  // Component state
  const [question,     setQuestion]    = useState(null)
  const [selected,     setSelected]    = useState(null)  // chosen option
  const [revealed,     setRevealed]    = useState(false) // answer shown
  const [emiliaMood,   setEmiliaMood]  = useState('thinking')
  const [learnMode,    setLearnMode]   = useState(false)
  const [learnText,    setLearnText]   = useState('')
  const [loadingLearn, setLoadingLearn]= useState(false)
  const [questionTimer,setQuestionTimer]= useState(QUESTION_TIMER)
  const [sessionSecs,  setSessionSecs] = useState(0)
  const [correctStreak,setCorrectStreak]= useState(0)
  const [newBadges,    setNewBadges]   = useState([])
  const [sessionDone,  setSessionDone] = useState(false)
  const [feedbackMsg,  setFeedbackMsg] = useState('')

  const timerRef    = useRef(null)
  const qTimerRef   = useRef(null)
  const sessionStartRef = useRef(Date.now())

  // Load first question
  useEffect(() => {
    clearSession()
    loadNextQuestion()
    // Session-level timer
    timerRef.current = setInterval(() => setSessionSecs(s => s + 1), 1000)
    return () => { clearInterval(timerRef.current); clearInterval(qTimerRef.current) }
  }, [])

  // Question countdown timer
  useEffect(() => {
    if (!question || revealed) return
    setQuestionTimer(QUESTION_TIMER)
    clearInterval(qTimerRef.current)
    qTimerRef.current = setInterval(() => {
      setQuestionTimer(t => {
        if (t <= 1) {
          clearInterval(qTimerRef.current)
          handleAnswer(null) // time's up = wrong
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(qTimerRef.current)
  }, [question])

  function loadNextQuestion() {
    const q = pickNextQuestion(allQuestions, masteryMap, sessionSeenIds, sessionSubjects)
    setQuestion(q)
    setSelected(null)
    setRevealed(false)
    setEmiliaMood('thinking')
    setLearnMode(false)
    setLearnText('')
    setFeedbackMsg('')
  }

  async function handleAnswer(choice) {
    if (revealed) return
    clearInterval(qTimerRef.current)

    const isCorrect = choice === question.answer
    setSelected(choice)
    setRevealed(true)

    // Update mastery
    const currentScore = masteryMap[question.subject]?.[question.topic] ?? 50
    const newScore     = updateMastery(currentScore, isCorrect)
    updateMasteryMap(question.subject, question.topic, newScore)

    if (user) {
      upsertProgress(user.id, question.subject, question.topic, isCorrect ? 10 : -5).catch(() => {})
    }

    // XP
    const xpGain = isCorrect ? (XP_PER_CORRECT[question.difficulty] ?? 10) : 0
    if (xpGain > 0) {
      addSessionXP(xpGain)
      const result = addXP(xpGain)
      if (result?.leveledUp) setFeedbackMsg(`🎉 LEVEL UP! You're now Level ${result.newLevel}!`)
      const petResult = feedActivePet(xpGain)
      if (petResult?.stageUp) setFeedbackMsg(`⭐ ${petResult.petName} evolved to Stage ${petResult.newStage}!`)
    }

    // Streaks
    if (isCorrect) {
      setEmiliaMood('happy')
      resetWrong()
      const newStreak = correctStreak + 1
      setCorrectStreak(newStreak)
      addSeenQuestion(question.id, question.subject)
    } else {
      incrementWrong()
      setCorrectStreak(0)
      setEmiliaMood(consecutiveWrong + 1 >= 2 ? 'frustrated' : 'wrong')
      addSeenQuestion(question.id, question.subject)

      // Learn mode?
      if (shouldTriggerLearnMode(newScore, consecutiveWrong + 1)) {
        setLearnMode(true)
        setLoadingLearn(true)
        try {
          const explanation = await generateExplanation(
            question.subject, question.topic,
            question.question, question.answer
          )
          setLearnText(explanation)
        } catch {
          setLearnText(question.explanation ?? 'Keep practising — you\'ll get it!')
        } finally {
          setLoadingLearn(false)
        }
      }
    }

    // Check badges
    const subjectAvgs     = getSubjectAverages({ ...masteryMap, [question.subject]: { ...masteryMap[question.subject], [question.topic]: newScore } })
    const masteredSubjects = countMasteredSubjects({ ...masteryMap, [question.subject]: { ...masteryMap[question.subject], [question.topic]: newScore } })
    const badgeState = {
      sessions: 1, streak: useStore.getState().streak,
      masteredSubjects,
      sessionSubjectsCount: sessionSubjects.length + (sessionSubjects.includes(question.subject) ? 0 : 1),
      correctStreak: isCorrect ? correctStreak + 1 : 0,
      overallMastery: Math.round(Object.values(subjectAvgs).reduce((a,b)=>a+b,0) / Object.values(subjectAvgs).length),
      subjectMastery: subjectAvgs,
      dailyGoalMet: useStore.getState().dailyGoalMet,
    }
    const earned = checkBadges(badgeState, achievements)
    for (const badgeId of earned) {
      if (addAchievement(badgeId)) {
        setNewBadges(prev => [...prev, badgeId])
        if (user) grantAchievement(user.id, badgeId).catch(() => {})
      }
    }
  }

  function handleNext() {
    if (learnMode && !learnText && loadingLearn) return // wait
    loadNextQuestion()
  }

  async function handleEndSession() {
    const elapsed = Math.floor((Date.now() - sessionStartRef.current) / 1000)
    addSessionSeconds(elapsed)
    if (user) {
      logSession(user.id, elapsed, sessionXP, [...new Set(sessionSubjects)]).catch(() => {})
    }
    navigate('/home')
  }

  if (!question) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gold)' }}>Loading quest...</div>

  const subj = SUBJECTS.find(s => s.id === question.subject)
  const timerPct = questionTimer / QUESTION_TIMER
  const timerColor = timerPct > 0.5 ? 'var(--color-emerald)' : timerPct > 0.25 ? 'var(--color-gold)' : 'var(--color-crimson)'

  return (
    <div className="bg-mythic" style={{ minHeight: '100vh', padding: '16px 16px 32px', maxWidth: 600, margin: '0 auto' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <button onClick={handleEndSession} style={{ background: 'transparent', border: 'none', color: 'var(--color-stone-light)', cursor: 'pointer', fontSize: '0.9rem' }}>← End session</button>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ color: 'var(--color-gold)', fontWeight: 800 }}>⚡ {sessionXP} XP</span>
          <span style={{ color: 'var(--color-parchment)', opacity: 0.7, fontSize: '0.85rem' }}>⏱ {formatTime(sessionSecs)}</span>
        </div>
      </div>

      {/* Question timer ring */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
        <svg width="56" height="56" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15" fill="rgba(0,0,0,0.3)" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
          <circle cx="18" cy="18" r="15" fill="none"
            stroke={timerColor}
            strokeWidth="2.5"
            strokeDasharray={`${timerPct * 94.2} 94.2`}
            strokeLinecap="round"
            transform="rotate(-90 18 18)"
            style={{ transition: 'stroke-dasharray 1s linear' }}
          />
          <text x="18" y="23" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">{questionTimer}</text>
        </svg>
      </div>

      {/* Subject badge */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        <span className="subject-pill" style={{ background: subj?.color + '30', color: subj?.color, border: `1px solid ${subj?.color}50` }}>
          {subj?.emoji} {subj?.label}
        </span>
      </div>

      {/* Emilia */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        <EmiliaCharacter mood={revealed ? (selected === question.answer ? 'happy' : emiliaMood) : 'thinking'} size="md" showBubble={!revealed} />
      </div>

      {/* Question card */}
      <div className="celtic-border" style={{ background: 'rgba(0,0,0,0.35)', borderRadius: 'var(--radius-lg)', padding: 24, marginBottom: 16 }}>
        <p style={{ color: 'var(--color-parchment)', fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.5, textAlign: 'center', marginBottom: 20 }}>
          {question.question}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {question.options?.map(opt => {
            let variant = ''
            if (revealed) {
              if (opt === question.answer) variant = 'correct'
              else if (opt === selected)   variant = 'incorrect'
            }
            return (
              <button
                key={opt}
                className={`answer-option ${variant}`}
                onClick={() => !revealed && handleAnswer(opt)}
                disabled={revealed}
              >
                {revealed && opt === question.answer && '✅ '}
                {revealed && opt === selected && opt !== question.answer && '❌ '}
                {opt}
              </button>
            )
          })}
        </div>
      </div>

      {/* Feedback / explanation after answer */}
      {revealed && (
        <div>
          {/* Correct/wrong feedback */}
          <div style={{ background: selected === question.answer ? 'rgba(39,174,96,0.15)' : 'rgba(192,57,43,0.15)', border: `1px solid ${selected === question.answer ? 'var(--color-emerald)' : 'var(--color-crimson)'}`, borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: 12 }}>
            <p style={{ fontWeight: 800, color: selected === question.answer ? '#5dde8b' : '#ff8a8a', marginBottom: 4 }}>
              {selected === question.answer ? `⭐ Brilliant! +${XP_PER_CORRECT[question.difficulty] ?? 10} XP` : '💪 Not quite — but you\'re learning!'}
            </p>
            <p style={{ color: 'var(--color-parchment)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              {question.explanation}
            </p>
          </div>

          {/* Level up message */}
          {feedbackMsg && (
            <div style={{ background: 'rgba(201,162,39,0.2)', border: '2px solid var(--color-gold)', borderRadius: 'var(--radius-md)', padding: '10px 16px', marginBottom: 12, textAlign: 'center', color: 'var(--color-gold)', fontWeight: 800 }}>
              {feedbackMsg}
            </div>
          )}

          {/* Learn mode */}
          {learnMode && (
            <div style={{ background: 'rgba(74,144,217,0.1)', border: '2px solid var(--color-sky)', borderRadius: 'var(--radius-md)', padding: '14px 16px', marginBottom: 12 }}>
              <p style={{ color: 'var(--color-sky-light)', fontWeight: 800, marginBottom: 8 }}>📚 Learn Mode — Let's understand this together!</p>
              {loadingLearn
                ? <p style={{ color: 'var(--color-stone-light)', fontStyle: 'italic' }}>Emilia is looking this up... ✨</p>
                : <p style={{ color: 'var(--color-parchment)', lineHeight: 1.6 }}>{learnText}</p>
              }
            </div>
          )}

          {/* New badges */}
          {newBadges.length > 0 && (
            <div style={{ background: 'rgba(201,162,39,0.15)', border: '2px solid var(--color-gold)', borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: 12, textAlign: 'center' }}>
              <p style={{ color: 'var(--color-gold)', fontWeight: 800 }}>🏆 New badge{newBadges.length > 1 ? 's' : ''} unlocked!</p>
              <p style={{ color: 'var(--color-parchment)', fontSize: '0.9rem' }}>{newBadges.join(', ')}</p>
            </div>
          )}

          <button className="btn-primary" style={{ width: '100%', fontSize: '1rem' }} onClick={handleNext}>
            Next Question ⚔️
          </button>
        </div>
      )}
    </div>
  )
}
