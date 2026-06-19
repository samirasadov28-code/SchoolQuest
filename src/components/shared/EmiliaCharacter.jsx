import { useState, useEffect } from 'react'

const MOODS = {
  idle: { emoji: '😊', message: "Let's learn something amazing today!" },
  happy: { emoji: '😄', message: "Brilliant! You're doing great!" },
  thinking: { emoji: '🤔', message: "Hmm, take your time..." },
  wrong: { emoji: '😕', message: "Don't worry, let's learn from this!" },
  celebrate: { emoji: '🎉', message: "Amazing! You're a star!" },
  sad: { emoji: '😢', message: "It's okay, keep trying!" },
  nervous: { emoji: '😰', message: "You've got this, I believe in you!" },
  frustrated: { emoji: '😤', message: "Shake it off! Every mistake is learning!" }
}

export default function EmiliaCharacter({ mood = 'idle', customMessage }) {
  const [visible, setVisible] = useState(true)
  const moodData = MOODS[mood] || MOODS.idle

  useEffect(() => {
    setVisible(false)
    const t = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(t)
  }, [mood])

  return (
    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
      <div className="speech-bubble animate-bounce-in">
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          {customMessage || moodData.message}
        </p>
      </div>
      <div className="animate-float" style={{ fontSize: '4rem', lineHeight: 1 }}>
        {moodData.emoji}
      </div>
    </div>
  )
}
