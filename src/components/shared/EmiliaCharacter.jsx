import { useState, useEffect } from 'react'

import idleImg from '../../assets/emilia/idle.png'
import happyImg from '../../assets/emilia/happy.png'
import thinkingImg from '../../assets/emilia/thinking.png'
import wrongImg from '../../assets/emilia/wrong.png'
import celebrateImg from '../../assets/emilia/celebrate.png'
import sadImg from '../../assets/emilia/sad.png'
import nervousImg from '../../assets/emilia/nervous.png'
import frustratedImg from '../../assets/emilia/frustrated.png'

const MOODS = {
  idle:       { img: idleImg,       message: "Let's learn something amazing today!" },
  happy:      { img: happyImg,      message: "Brilliant! You're doing great!" },
  thinking:   { img: thinkingImg,   message: "Hmm, take your time..." },
  wrong:      { img: wrongImg,      message: "Don't worry, let's learn from this!" },
  celebrate:  { img: celebrateImg,  message: "Amazing! You're a star!" },
  sad:        { img: sadImg,        message: "It's okay, keep trying!" },
  nervous:    { img: nervousImg,    message: "You've got this, I believe in you!" },
  frustrated: { img: frustratedImg, message: "Shake it off! Every mistake is learning!" }
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
      <div
        className="animate-float"
        style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.1s' }}
      >
        <img
          src={moodData.img}
          alt={`Emilia ${mood}`}
          style={{ height: '120px', width: 'auto', objectFit: 'contain' }}
        />
      </div>
    </div>
  )
}
