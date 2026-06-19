import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../stores/useStore'
import { pickNextQuestion, shouldTriggerLearnMode } from '../services/adaptive'
import { getExplanation } from '../services/groq'
import EmiliaCharacter from '../components/shared/EmiliaCharacter'
import NavBar from '../components/shared/NavBar'

const SESSION_LENGTH = 10

export default function SessionPage() {
  const { masteryMap, session, startSession, answerQuestion, endSession } = useStore()
  const navigate = useNavigate()
  const [currentQ, setCurrentQ] = useState(null)
  const [selected, setSelected] = useState(null)
  const [mood, setMood] = useState('idle')
  const [learnMode, setLearnMode] = useState(null)
  const [loadingExplanation, setLoadingExplanation] = useState(false)
  const [consecutiveWrong, setConsecutiveWrong] = useState(0)
  const [done, setDone] = useState(false)
  const [xpPopup, setXpPopup] = useState(null)

  const loadNextQuestion = useCallback(() => {
    if (!session) return
    if (session.questions.length >= SESSION_LENGTH) {
      setDone(true)
      return
    }
    const q = pickNextQuestion(masteryMap, session.usedIds || [])
    setCurrentQ(q)
    setSelected(null)
    setLearnMode(null)
    setMood('thinking')
  }, [session, masteryMap])

  useEffect(() => {
    if (!session) startSession()
  }, [])

  useEffect(() => {
    if (session && !currentQ && !done) loadNextQuestion()
  }, [session])

  const handleAnswer = async (option) => {
    if (selected || !currentQ) return
    setSelected(option)
    const isCorrect = option === currentQ.answer
    const key = `${currentQ.subject}:${currentQ.topic}`
    const currentMastery = masteryMap[key] ?? 50

    if (isCorrect) {
      setMood('happy')
      setConsecutiveWrong(0)
      const xp = currentQ.difficulty * 5
      setXpPopup(`+${xp} XP!`)
      setTimeout(() => setXpPopup(null), 1500)
    } else {
      setMood('wrong')
      const newWrong = consecutiveWrong + 1
      setConsecutiveWrong(newWrong)
      if (shouldTriggerLearnMode(currentMastery, newWrong)) {
        setLoadingExplanation(true)
        const explanation = await getExplanation(currentQ.question, option, currentQ.answer, currentQ.subject)
        setLearnMode(explanation)
        setLoadingExplanation(false)
      }
    }

    await answerQuestion(currentQ, isCorrect)
  }

  const handleNext = () => {
    if (session && session.questions.length >= SESSION_LENGTH) {
      setDone(true)
    } else {
      loadNextQuestion()
    }
  }

  const handleFinish = async () => {
    await endSession()
    navigate('/')
  }

  if (done) {
    const correct = session?.questions.filter(q => q.isCorrect).length ?? 0
    const total = session?.questions.length ?? 0
    const xpEarned = session?.xpEarned ?? 0
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0

    return (
      <div className="page" style={{ paddingBottom: '5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '4rem' }}>{pct >= 70 ? '🎉' : pct >= 50 ? '😊' : '💪'}</div>
          <h2 className="title-celtic" style={{ marginTop: '0.5rem' }}>Quest Complete!</h2>
        </div>
        <div className="card" style={{ marginBottom: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--gold)' }}>{pct}%</div>
          <div style={{ color: 'var(--text-secondary)' }}>{correct} of {total} correct</div>
          <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(245,158,11,0.1)', borderRadius: '8px', color: 'var(--gold)', fontWeight: 700 }}>
            +{xpEarned} XP earned!
          </div>
        </div>
        <button onClick={handleFinish} className="btn btn-gold btn-full" style={{ marginBottom: '0.75rem' }}>
          🏠 Back to Home
        </button>
        <button onClick={() => { startSession(); setDone(false); setCurrentQ(null); setConsecutiveWrong(0) }} className="btn btn-outline btn-full">
          ⚔️ Play Again
        </button>
        <NavBar />
      </div>
    )
  }

  if (!currentQ) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚔️</div>
          <p>Preparing your quest...</p>
        </div>
      </div>
    )
  }

  const questionNum = (session?.questions.length ?? 0) + 1

  return (
    <div className="page" style={{ paddingBottom: '5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingTop: '1rem' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Question {questionNum}/{SESSION_LENGTH}</span>
        <span className="subject-pill">{currentQ.subject}</span>
      </div>
      <div className="xp-bar" style={{ marginBottom: '1.5rem' }}>
        <div className="xp-bar-fill" style={{ width: `${((questionNum - 1) / SESSION_LENGTH) * 100}%` }} />
      </div>

      <EmiliaCharacter mood={mood} />

      {xpPopup && (
        <div style={{ position: 'fixed', top: '30%', left: '50%', transform: 'translateX(-50%)', background: 'var(--gold)', color: '#1a1035', padding: '0.5rem 1.5rem', borderRadius: '99px', fontWeight: 800, fontSize: '1.2rem', zIndex: 300, animation: 'bounce-in 0.3s ease' }}>
          {xpPopup}
        </div>
      )}

      <div className="card" style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          {'⭐'.repeat(currentQ.difficulty)}
        </div>
        <p style={{ fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.4 }}>{currentQ.question}</p>
      </div>

      <div>
        {currentQ.options.map(opt => {
          let cls = 'answer-btn'
          if (selected) {
            if (opt === currentQ.answer) cls += ' correct'
            else if (opt === selected && selected !== currentQ.answer) cls += ' wrong'
          }
          return (
            <button key={opt} className={cls} onClick={() => handleAnswer(opt)} disabled={!!selected}>
              {opt}
            </button>
          )
        })}
      </div>

      {loadingExplanation && (
        <div className="card" style={{ marginTop: '1rem', borderColor: 'var(--teal)', textAlign: 'center', color: 'var(--text-secondary)' }}>
          🧙 Druid Emilia is preparing an explanation...
        </div>
      )}
      {learnMode && (
        <div className="card" style={{ marginTop: '1rem', borderColor: 'var(--teal)', background: 'rgba(20,184,166,0.05)' }}>
          <div style={{ color: 'var(--teal)', fontWeight: 700, marginBottom: '0.5rem' }}>📖 Learn Mode</div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{learnMode}</p>
        </div>
      )}

      {selected && (
        <button onClick={handleNext} className="btn btn-primary btn-full" style={{ marginTop: '1rem' }}>
          {questionNum >= SESSION_LENGTH ? '🎉 See Results' : 'Next Question →'}
        </button>
      )}

      <NavBar />
    </div>
  )
}
