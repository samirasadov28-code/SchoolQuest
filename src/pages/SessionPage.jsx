import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../stores/useStore'
import { QUESTION_BANK } from '../data/questions/index'
import { pickNextQuestion, updateMastery, shouldTriggerLearnMode, formatTime, XP_PER_CORRECT, SUBJECTS, DRILL_QUESTIONS_PER_TOPIC, TOPICS_BEFORE_REVIEW, REVIEW_QUESTIONS } from '../services/adaptive'
import { upsertProgress, logSession, grantAchievement, updateProfile } from '../services/supabase'
import { getExplanation as generateExplanation } from '../services/groq'
import { checkBadges, getSubjectAverages, countMasteredSubjects } from '../services/gamification'
import EmiliaCharacter from '../components/shared/EmiliaCharacter'
import { getTopicIntro } from '../data/topicIntros'

// Topic-specific emojis for visual variety during sessions
const TOPIC_EMOJIS = {
  // English
  spelling:'✏️', grammar:'📝', reading:'📚', writing:'🖊️', punctuation:'❓', vocabulary:'💬', plurals:'🔤', 'compound-words':'🔗',
  // Maths
  addition:'➕', subtraction:'➖', multiplication:'✖️', division:'➗', fractions:'🍕', 'place-value':'🔢', measurement:'📏', time:'⏰', shapes:'🔷', money:'💰', data:'📊', 'mental-maths':'🧠', 'word-problems':'📖',
  // Irish
  greetings:'👋', numbers:'🔢', colours:'🎨', animals:'🐾', family:'👨‍👩‍👧', school:'🏫', food:'🍎', weather:'🌦️', seasons:'🍂', body:'🦴',
  // History
  'ancient-ireland':'🪨', celts:'⚔️', vikings:'⛵', normans:'🏰', 'irish-myths':'🐉', famine:'🌾', independence:'🦅', 'local-history':'🗺️', 'world-history':'🌍',
  // Geography
  'ireland-physical':'🏝️', 'ireland-counties':'📍', continents:'🌏', europe:'🌍', 'world-physical':'🗺️', mapping:'🧭', environment:'🌿',
  // Science
  'living-things':'🌱', plants:'🌻', 'human-body':'🫀', materials:'🧲', forces:'⚡', 'light-sound':'💡', electricity:'🔋', ecosystems:'🌳',
  // GenKnow
  ireland:'☘️', world:'🌍', nature:'🦋', space:'🚀', sports:'⚽', 'famous-people':'🌟',
  // SPHE / Ethics
  feelings:'💚', friendship:'🤝', safety:'🛡️', 'healthy-living':'🥦', bullying:'🤜', 'digital-safety':'💻', 'right-wrong':'⚖️', fairness:'🫶', respect:'🙏', honesty:'💎',
  // Coding
  sequences:'🔄', algorithms:'🤖', debugging:'🐛', patterns:'🧩', loops:'♾️', conditionals:'❔', 'input-output':'⌨️',
  // default
  general:'⭐',
}

function getTopicEmoji(topic) {
  return TOPIC_EMOJIS[topic] ?? TOPIC_EMOJIS.general
}

function getTimerForQuestion(q) { return q?.type === 'reading-passage' ? 90 : 60 }

export default function SessionPage() {
  const navigate    = useNavigate()
  const user        = useStore(s => s.user)
  const masteryMap  = useStore(s => s.masteryMap)
  const level       = useStore(s => s.level)
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
  const prizes            = useStore(s => s.prizes)

  const allQuestions = [...QUESTION_BANK, ...generatedQuestions]

  // Mode selection — shown before session starts
  const [sessionMode, setSessionMode] = useState(null) // null | 'quest' | 'explore'
  const sessionModeRef = useRef(null)

  // Component state
  const [question,        setQuestion]       = useState(null)
  const [shuffledOptions, setShuffledOptions] = useState([])
  const [selected,     setSelected]    = useState(null)
  const [revealed,     setRevealed]    = useState(false)
  const [emiliaMood,   setEmiliaMood]  = useState('thinking')
  const [learnMode,    setLearnMode]   = useState(false)
  const [learnText,    setLearnText]   = useState('')
  const [loadingLearn, setLoadingLearn]= useState(false)
  const [questionTimer,setQuestionTimer]= useState(60)
  const [sessionSecs,  setSessionSecs] = useState(0)
  const [correctStreak,setCorrectStreak]= useState(0)
  const [newBadges,    setNewBadges]   = useState([])
  const [feedbackMsg,  setFeedbackMsg] = useState('')
  const [lastXpGain,   setLastXpGain]  = useState(0)

  // End session screen
  const [showEndScreen,         setShowEndScreen]         = useState(false)
  const [sessionPrizesUnlocked, setSessionPrizesUnlocked] = useState([])
  const sessionStartXP = useRef(0)

  // Review phase banner
  const [showReviewBanner, setShowReviewBanner] = useState(false)

  // Topic intro (explore mode)
  const [showTopicIntro, setShowTopicIntro] = useState(false)
  const [introTopic,     setIntroTopic]     = useState(null)

  // Session phase state
  const [phase,         setPhase]         = useState('drill')
  const [drillTopic,    setDrillTopic]    = useState(null)
  const [topicQCount,   setTopicQCount]   = useState(0)
  const [newTopicCount, setNewTopicCount] = useState(0)
  const [reviewQLeft,   setReviewQLeft]   = useState(0)
  const phaseRef = useRef({ phase: 'drill', drillTopic: null, topicQCount: 0, newTopicCount: 0, reviewQLeft: 0 })

  const timerRef          = useRef(null)
  const qTimerRef         = useRef(null)
  const sessionStartRef   = useRef(Date.now())
  const questionStartRef  = useRef(Date.now())
  const [lastAnswerMs, setLastAnswerMs] = useState(null)

  // Load first question once mode is chosen
  useEffect(() => {
    if (!sessionMode) return
    sessionModeRef.current = sessionMode
    clearSession()
    sessionStartXP.current = useStore.getState().xp
    loadNextQuestion()
    timerRef.current = setInterval(() => setSessionSecs(s => s + 1), 1000)
    return () => { clearInterval(timerRef.current); clearInterval(qTimerRef.current) }
  }, [sessionMode])

  // Question countdown timer
  useEffect(() => {
    if (!question || revealed) return
    const t = getTimerForQuestion(question)
    setQuestionTimer(t)
    clearInterval(qTimerRef.current)
    qTimerRef.current = setInterval(() => {
      setQuestionTimer(prev => {
        if (prev <= 1) { clearInterval(qTimerRef.current); handleAnswer(null); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(qTimerRef.current)
  }, [question])

  function loadNextQuestion(ctx) {
    const p = ctx ?? phaseRef.current
    const q = pickNextQuestion(allQuestions, masteryMap, sessionSeenIds, sessionSubjects, p, level)

    if (p.phase === 'drill') {
      const isNewTopic = !p.drillTopic || q.subject !== p.drillTopic.subject || q.topic !== p.drillTopic.topic
      if (isNewTopic) {
        const newDrillTopic = { subject: q.subject, topic: q.topic }
        const newTopicQCount = 1
        phaseRef.current = { ...phaseRef.current, drillTopic: newDrillTopic, topicQCount: newTopicQCount }
        setDrillTopic(newDrillTopic)
        setTopicQCount(newTopicQCount)

        // Show fullscreen intro in explore mode
        if (sessionModeRef.current === 'explore') {
          setShowTopicIntro(true)
          setIntroTopic({ subject: q.subject, topic: q.topic })
        }
      } else {
        const newTopicQCount = p.topicQCount + 1
        phaseRef.current = { ...phaseRef.current, topicQCount: newTopicQCount }
        setTopicQCount(newTopicQCount)
      }
    }

    setQuestion(q)
    setShuffledOptions(q.options ? [...q.options].sort(() => Math.random() - 0.5) : [])
    setSelected(null)
    setRevealed(false)
    setEmiliaMood('thinking')
    setLearnMode(false)
    setLearnText('')
    setFeedbackMsg('')
    questionStartRef.current = Date.now()
  }

  async function handleAnswer(choice) {
    if (revealed) return
    clearInterval(qTimerRef.current)
    const msElapsed = Date.now() - questionStartRef.current
    setLastAnswerMs(msElapsed)

    const isCorrect = choice === question.answer
    setSelected(choice)
    setRevealed(true)

    // Timing multiplier
    const secs = msElapsed / 1000
    const timeLimit = getTimerForQuestion(question)
    let timeMult = 1
    if (secs < timeLimit * 0.25) timeMult = 1.5
    else if (secs < timeLimit * 0.5) timeMult = 1.2
    else if (secs > timeLimit * 0.75) timeMult = 0.75

    // Wrong streak multiplier
    const wrongStreakMult = consecutiveWrong >= 4 ? 0.4 : consecutiveWrong >= 2 ? 0.7 : 1

    // XP
    const xpGain = isCorrect ? Math.round((XP_PER_CORRECT[question.difficulty] ?? 10) * timeMult * wrongStreakMult) : 0
    setLastXpGain(xpGain)

    // Mastery delta based on timing
    const currentScore = masteryMap[question.subject]?.[question.topic] ?? 50
    const masteryDelta = isCorrect ? (secs < timeLimit * 0.5 ? 12 : 8) : -5
    const newScore = Math.max(0, Math.min(100, currentScore + masteryDelta))
    updateMasteryMap(question.subject, question.topic, newScore)

    if (user) {
      upsertProgress(user.id, question.subject, question.topic, masteryDelta).catch(() => {})
    }

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
    if (learnMode && !learnText && loadingLearn) return

    const p = phaseRef.current
    let nextCtx

    if (p.phase === 'drill') {
      if (p.topicQCount >= DRILL_QUESTIONS_PER_TOPIC) {
        const newCount = p.newTopicCount + 1
        if (newCount >= TOPICS_BEFORE_REVIEW) {
          nextCtx = { phase: 'review', drillTopic: null, topicQCount: 0, newTopicCount: 0, reviewQLeft: REVIEW_QUESTIONS }
          setPhase('review'); setDrillTopic(null); setTopicQCount(0); setNewTopicCount(0); setReviewQLeft(REVIEW_QUESTIONS)
          setShowReviewBanner(true)
          setTimeout(() => setShowReviewBanner(false), 3000)
        } else {
          nextCtx = { phase: 'drill', drillTopic: null, topicQCount: 0, newTopicCount: newCount, reviewQLeft: 0 }
          setDrillTopic(null); setTopicQCount(0); setNewTopicCount(newCount)
        }
      } else {
        nextCtx = p
      }
    } else {
      const left = p.reviewQLeft - 1
      if (left <= 0) {
        nextCtx = { phase: 'drill', drillTopic: null, topicQCount: 0, newTopicCount: 0, reviewQLeft: 0 }
        setPhase('drill'); setDrillTopic(null); setTopicQCount(0); setNewTopicCount(0); setReviewQLeft(0)
      } else {
        nextCtx = { ...p, reviewQLeft: left }
        setReviewQLeft(left)
      }
    }

    phaseRef.current = nextCtx
    loadNextQuestion(nextCtx)
  }

  async function handleEndSession() {
    const elapsed = Math.floor((Date.now() - sessionStartRef.current) / 1000)
    addSessionSeconds(elapsed)
    if (user) {
      const s = useStore.getState()
      logSession(user.id, elapsed, sessionXP, [...new Set(sessionSubjects)]).catch(() => {})
      // Persist XP/level/streak so other devices stay in sync
      updateProfile(user.id, { xp: s.xp, level: s.level, streak: s.streak }).catch(() => {})
    }
    const currentXP = useStore.getState().xp
    const unlocked = prizes.filter(p =>
      p.status === 'active' &&
      p.xp_threshold > sessionStartXP.current &&
      p.xp_threshold <= currentXP
    )
    setSessionPrizesUnlocked(unlocked)
    setShowEndScreen(true)
  }

  // Mode picker screen
  if (!sessionMode) return (
    <div className="bg-mythic" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 20px', gap: 24 }}>
      <button onClick={() => navigate('/home')} style={{ position: 'absolute', top: 20, left: 20, background: 'transparent', border: 'none', color: 'var(--color-stone-light)', cursor: 'pointer', fontSize: '1rem' }}>← Back</button>
      <EmiliaCharacter mood="happy" size="md" showBubble={false} />
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-title)', color: 'var(--color-gold)', fontSize: '1.4rem', marginBottom: 6 }}>Choose your quest!</h1>
        <p style={{ color: 'var(--color-stone-light)', fontSize: '0.85rem' }}>What do you want to do today?</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', maxWidth: 320 }}>
        <button onClick={() => setSessionMode('quest')} className="btn-primary"
          style={{ padding: '20px 24px', borderRadius: 'var(--radius-lg)', textAlign: 'left', display: 'flex', gap: 16, alignItems: 'center' }}>
          <span style={{ fontSize: '2rem' }}>⚔️</span>
          <div>
            <p style={{ fontWeight: 800, fontSize: '1rem', marginBottom: 2 }}>Quest Mode</p>
            <p style={{ fontSize: '0.78rem', opacity: 0.8, fontWeight: 400 }}>Answer questions, earn XP, beat your score!</p>
          </div>
        </button>
        <button onClick={() => setSessionMode('explore')} style={{ padding: '20px 24px', borderRadius: 'var(--radius-lg)', textAlign: 'left', display: 'flex', gap: 16, alignItems: 'center', background: 'rgba(201,162,39,0.12)', border: '2px solid rgba(201,162,39,0.4)', color: 'var(--color-parchment)', cursor: 'pointer' }}>
          <span style={{ fontSize: '2rem' }}>📖</span>
          <div>
            <p style={{ fontWeight: 800, fontSize: '1rem', marginBottom: 2, color: 'var(--color-gold)' }}>Explore Mode</p>
            <p style={{ fontSize: '0.78rem', opacity: 0.8, fontWeight: 400 }}>Discover something new from 3rd class!</p>
          </div>
        </button>
      </div>
    </div>
  )

  // End session screen
  if (showEndScreen) return (
    <div className="bg-mythic" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', gap: 20, textAlign: 'center' }}>
      <EmiliaCharacter mood="celebrate" size="lg" showBubble={false} />
      <div>
        <h1 style={{ fontFamily: 'var(--font-title)', color: 'var(--color-gold)', fontSize: '1.6rem', marginBottom: 8 }}>Quest Complete! 🎉</h1>
        <p style={{ color: 'var(--color-parchment)', fontSize: '1rem' }}>You earned <strong style={{ color: 'var(--color-gold)' }}>⚡ {sessionXP} XP</strong> this session!</p>
      </div>
      {newBadges.length > 0 && (
        <div style={{ background: 'rgba(201,162,39,0.15)', border: '2px solid var(--color-gold)', borderRadius: 16, padding: '14px 20px', width: '100%' }}>
          <p style={{ color: 'var(--color-gold)', fontWeight: 800, marginBottom: 6 }}>🏅 New Badges!</p>
          <p style={{ color: 'var(--color-parchment)' }}>{newBadges.join(', ')}</p>
        </div>
      )}
      {sessionPrizesUnlocked.length > 0 && (
        <div style={{ background: 'rgba(39,174,96,0.15)', border: '2px solid var(--color-emerald)', borderRadius: 16, padding: '14px 20px', width: '100%' }}>
          <p style={{ color: '#5dde8b', fontWeight: 800, marginBottom: 6 }}>🎁 Prize{sessionPrizesUnlocked.length > 1 ? 's' : ''} Unlocked!</p>
          {sessionPrizesUnlocked.map(p => (
            <p key={p.id} style={{ color: 'var(--color-parchment)', fontSize: '0.9rem' }}>✅ {p.title}</p>
          ))}
          <p style={{ color: 'var(--color-stone-light)', fontSize: '0.78rem', marginTop: 6 }}>Show this to Mum or Dad! 🌟</p>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 300 }}>
        <button className="btn-primary" style={{ padding: '14px' }} onClick={() => navigate('/rewards')}>
          🏆 See All Rewards
        </button>
        <button className="btn-secondary" style={{ padding: '14px' }} onClick={() => navigate('/home')}>
          🏠 Home
        </button>
      </div>
    </div>
  )

  // Topic intro screen (explore mode)
  if (showTopicIntro && introTopic) return (
    <div className="bg-mythic" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '40px 24px', gap: 20 }}>
      <div style={{ textAlign: 'center' }}>
        <EmiliaCharacter mood="happy" size="md" showBubble={false} />
      </div>
      <div style={{ background: 'rgba(201,162,39,0.1)', border: '2px solid var(--color-gold)', borderRadius: 20, padding: 24 }}>
        <p style={{ color: 'var(--color-gold)', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem', marginBottom: 8 }}>
          📖 New Topic in {SUBJECTS.find(s=>s.id===introTopic.subject)?.label}
        </p>
        <h2 style={{ color: 'var(--color-parchment)', fontFamily: 'var(--font-title)', fontSize: '1.4rem', marginBottom: 16, textTransform: 'capitalize' }}>
          {introTopic.topic.replace(/-/g, ' ')}
        </h2>
        <p style={{ color: 'var(--color-parchment)', lineHeight: 1.7, fontSize: '1rem' }}>
          {getTopicIntro(introTopic.subject, introTopic.topic)}
        </p>
      </div>
      <button className="btn-primary" style={{ fontSize: '1.1rem', padding: '16px' }} onClick={() => setShowTopicIntro(false)}>
        Let's Begin! ⚔️
      </button>
    </div>
  )

  if (!question) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gold)' }}>Loading quest...</div>

  const subj = SUBJECTS.find(s => s.id === question.subject)
  const maxTimer = question ? getTimerForQuestion(question) : 60
  const timerPct = questionTimer / maxTimer
  const timerColor = timerPct > 0.5 ? 'var(--color-emerald)' : timerPct > 0.25 ? 'var(--color-gold)' : 'var(--color-crimson)'

  return (
    <div className="bg-mythic" style={{ minHeight: '100vh', padding: '16px 16px 32px', maxWidth: 600, margin: '0 auto' }}>
      {/* Review banner */}
      {showReviewBanner && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, background: 'var(--color-gold)', color: '#1a1a00', padding: '14px 20px', textAlign: 'center', fontWeight: 800, fontSize: '1.1rem', animation: 'slideDown 0.3s ease' }}>
          ⚡ Review Time! Let's test what you've learned!
        </div>
      )}

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

      {/* Subject badge + phase indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <span className="subject-pill" style={{ background: subj?.color + '30', color: subj?.color, border: `1px solid ${subj?.color}50` }}>
          {subj?.emoji} {subj?.label}
        </span>
        {phase === 'review'
          ? <span className="subject-pill" style={{ background: 'rgba(201,162,39,0.2)', color: 'var(--color-gold)', border: '1px solid var(--color-gold)' }}>
              ⚡ Review — {reviewQLeft} left
            </span>
          : drillTopic && <span className="subject-pill" style={{ background: 'rgba(74,144,217,0.15)', color: '#7ec8e3', border: '1px solid #7ec8e360' }}>
              📖 Topic drill {topicQCount}/{DRILL_QUESTIONS_PER_TOPIC}
            </span>
        }
      </div>

      {/* Emilia */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        <EmiliaCharacter mood={revealed ? (selected === question.answer ? 'happy' : emiliaMood) : 'thinking'} size="md" showBubble={!revealed} />
      </div>

      {/* Reading passage */}
      {question.type === 'reading-passage' && question.passage && (
        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 'var(--radius-md)', padding: '16px 18px', marginBottom: 12 }}>
          <p style={{ color: 'var(--color-gold)', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>📖 Read this passage</p>
          <p style={{ color: 'var(--color-parchment)', fontSize: '0.95rem', lineHeight: 1.7 }}>{question.passage}</p>
        </div>
      )}

      {/* Question card */}
      <div className="celtic-border" style={{ background: `linear-gradient(135deg, rgba(0,0,0,0.45) 0%, ${(subj?.color ?? '#c9a227') + '18'} 100%)`, borderRadius: 'var(--radius-lg)', padding: 24, marginBottom: 16, border: `2px solid ${(subj?.color ?? '#c9a227') + '40'}`, position: 'relative' }}>
        {/* Topic emoji badge */}
        <div style={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)', background: subj?.color ?? 'var(--color-gold)', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.15)' }}>
          {getTopicEmoji(question.topic)}
        </div>
        <p style={{ color: 'var(--color-parchment)', fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.5, textAlign: 'center', marginBottom: 20, marginTop: 10 }}>
          {question.question}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {shuffledOptions.map((opt, i) => {
            const letters = ['A', 'B', 'C', 'D']
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
                style={{ display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}
              >
                <span style={{ minWidth: 28, height: 28, borderRadius: '50%', background: revealed && opt === question.answer ? 'rgba(39,174,96,0.4)' : revealed && opt === selected ? 'rgba(192,57,43,0.4)' : 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', flexShrink: 0 }}>
                  {revealed && opt === question.answer ? '✅' : revealed && opt === selected && opt !== question.answer ? '❌' : letters[i]}
                </span>
                {opt}
              </button>
            )
          })}
        </div>
      </div>

      {/* Feedback / explanation after answer */}
      {revealed && (
        <div>
          {/* Star burst on correct */}
          {selected === question.answer && (
            <div style={{ textAlign: 'center', fontSize: '2rem', marginBottom: 8, animation: 'bounceIn 0.4s ease' }}>
              {'⭐'.repeat(Math.min(3, Math.ceil(lastXpGain / 10)))}
            </div>
          )}
          <div style={{ background: selected === question.answer ? 'rgba(39,174,96,0.15)' : 'rgba(192,57,43,0.15)', border: `2px solid ${selected === question.answer ? 'var(--color-emerald)' : 'var(--color-crimson)'}`, borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <p style={{ fontWeight: 800, color: selected === question.answer ? '#5dde8b' : '#ff8a8a', fontSize: '1rem' }}>
                {selected === question.answer ? `🎉 Brilliant! +${lastXpGain} XP` : '💪 Not quite — keep going!'}
              </p>
              {lastAnswerMs != null && (
                <span style={{ color: 'var(--color-stone-light)', fontSize: '0.7rem', opacity: 0.6 }}>
                  ⏱ {(lastAnswerMs / 1000).toFixed(1)}s
                </span>
              )}
            </div>
            <p style={{ color: 'var(--color-parchment)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              {getTopicEmoji(question.topic)} {question.explanation}
            </p>
          </div>

          {feedbackMsg && (
            <div style={{ background: 'rgba(201,162,39,0.2)', border: '2px solid var(--color-gold)', borderRadius: 'var(--radius-md)', padding: '10px 16px', marginBottom: 12, textAlign: 'center', color: 'var(--color-gold)', fontWeight: 800 }}>
              {feedbackMsg}
            </div>
          )}

          {learnMode && (
            <div style={{ background: 'rgba(74,144,217,0.1)', border: '2px solid var(--color-sky)', borderRadius: 'var(--radius-md)', padding: '14px 16px', marginBottom: 12 }}>
              <p style={{ color: 'var(--color-sky-light)', fontWeight: 800, marginBottom: 8 }}>📚 Learn Mode — Let's understand this together!</p>
              {loadingLearn
                ? <p style={{ color: 'var(--color-stone-light)', fontStyle: 'italic' }}>Emilia is looking this up... ✨</p>
                : <p style={{ color: 'var(--color-parchment)', lineHeight: 1.6 }}>{learnText}</p>
              }
            </div>
          )}

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
