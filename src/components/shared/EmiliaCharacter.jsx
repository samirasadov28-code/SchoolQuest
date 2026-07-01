import { useState, useEffect } from 'react'
import useStore from '../../stores/useStore'
import { ART } from '../../data/avatars'

const SPEECH_BUBBLES = {
  idle:        ["Ready for your quest, brave explorer! 🗺️", "Let's learn something amazing today! ⭐", "Ancient Ireland is waiting for you! ☘️"],
  happy:       ["Hi! I'm Emilia — join the quest with me! 🌟", "Hello! Let's learn and have fun together! ☘️", "Hey there! Come on the quest with me! 🎉"],
  thinking:    ["Hmm, take your time... 🤔", "Think carefully, you know this! 💭", "Use what you know... you've got this! 🧠"],
  wrong:       ["Don't worry — even heroes make mistakes! 💪", "Good try! Let's learn from this one! 📚", "Almost! You're getting there! 🌱"],
  celebrate:   ["INCREDIBLE!!! You're a legend! 👑", "WOOHOO! You're on FIRE! 🔥", "THE CROWD GOES WILD! 🎊"],
  sad:         ["Oh no! But I believe in you! 💚", "Every hero faces challenges... 🌧️", "Take a breath — you can do this! 🤗"],
  nervous:     ["Ooh this is a tricky one! ⚡", "You've studied hard — trust yourself! 🌟", "Deep breath... you know more than you think! 😅"],
  frustrated:  ["ARGH! Don't give up! The quest continues! 💥", "Even Fionn Mac Cumhaill had hard days! ⚔️", "Shake it off — next one will be great! 🛡️"],
  focused:     ["Eyes on the prize! 🎯", "Let's GO — total focus! ⚡", "Nothing can stop me now! 💫"],
  mischievous: ["Hehe, I've got a secret trick! 😏", "Watch out — I'm on a roll! 🛼", "Oh this is going to be fun... 😈"],
  skating:     ["Wheee! Let's GO! 🛼", "I love flying on my skates! ✨", "Nothing beats skating through ancient Ireland! ☘️"],
  wobble:      ["Oops — staying balanced! 😄", "Wobbly but wonderful! 🌀", "That was close — haha! 🤣"],
}

/**
 * mood: 'idle'|'happy'|'thinking'|'wrong'|'celebrate'|'sad'|'nervous'|'frustrated'
 *       + extras: 'focused'|'mischievous'|'skating'|'wobble'
 * size: 'sm' | 'md' | 'lg'
 * showBubble: boolean
 * animate: boolean
 * skateMode: boolean — legacy prop, kept for API compatibility
 * customMessage: string
 */
export default function EmiliaCharacter({ mood = 'idle', size = 'md', showBubble = true, animate = true, skateMode = false, customMessage }) {
  const [bubble, setBubble] = useState('')
  const [bouncing, setBouncing] = useState(false)
  const selectedAvatar = useStore(s => s.selectedAvatar)

  // Resolve image: use selected avatar art, fallback to swimmer
  const avatarArt = ART[selectedAvatar] ?? ART.explorer
  const src = avatarArt[mood] ?? avatarArt.idle ?? ART.explorer.idle

  const sizes = { sm: 90, md: 155, lg: 215 }
  const px    = sizes[size]

  useEffect(() => {
    const lines = SPEECH_BUBBLES[mood] ?? SPEECH_BUBBLES.idle
    setBubble(customMessage || lines[Math.floor(Math.random() * lines.length)])
    if (animate) {
      setBouncing(true)
      const t = setTimeout(() => setBouncing(false), 700)
      return () => clearTimeout(t)
    }
  }, [mood, animate, customMessage])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      {showBubble && bubble && (
        <div className="speech-bubble animate-bounce-in" style={{
          background: 'rgba(255,255,255,0.95)',
          color: '#1a0a2e',
          borderRadius: 16,
          padding: '8px 14px',
          fontSize: '0.85rem',
          fontWeight: 700,
          maxWidth: 220,
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          position: 'relative',
          lineHeight: 1.4,
        }}>
          {bubble}
          <div style={{
            position: 'absolute', bottom: -8, left: '50%',
            transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: '8px solid rgba(255,255,255,0.95)',
          }} />
        </div>
      )}
      <img
        src={src}
        alt={`Emilia ${mood}`}
        width={px}
        className={`animate-float avatar-breathe ${bouncing ? 'animate-bounce-in' : ''}`}
        style={{ objectFit: 'contain', display: 'block' }}
      />
    </div>
  )
}
