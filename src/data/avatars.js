// Avatar style definitions
export const AVATAR_STYLES = [
  { id: 'swimmer',     name: 'Ocean Explorer',  emoji: '🏊',  unlockLevel: 1,  description: 'Ready to dive in!' },
  { id: 'explorer',    name: 'Adventure Scout', emoji: '🎩',  unlockLevel: 15, description: 'Hat on, quest on!' },
  { id: 'traditional', name: 'Island Princess', emoji: '🌺',  unlockLevel: 30, description: 'Ancient wisdom!' },
  { id: 'skater',      name: 'Skate Star',      emoji: '🛼',  unlockLevel: 45, description: 'Rolling to victory!' },
]

// Swimmer
import swimmerIdle        from '../assets/emilia/swimmer/idle.png'
import swimmerHappy       from '../assets/emilia/swimmer/happy.png'
import swimmerThinking    from '../assets/emilia/swimmer/thinking.png'
import swimmerWrong       from '../assets/emilia/swimmer/wrong.png'
import swimmerCelebrate   from '../assets/emilia/swimmer/celebrate.png'
import swimmerSad         from '../assets/emilia/swimmer/sad.png'
import swimmerNervous     from '../assets/emilia/swimmer/nervous.png'
import swimmerFrustrated  from '../assets/emilia/swimmer/frustrated.png'
import swimmerPortrait    from '../assets/emilia/swimmer/portrait.png'

// Explorer
import explorerIdle        from '../assets/emilia/explorer/idle.png'
import explorerHappy       from '../assets/emilia/explorer/happy.png'
import explorerThinking    from '../assets/emilia/explorer/thinking.png'
import explorerWrong       from '../assets/emilia/explorer/wrong.png'
import explorerCelebrate   from '../assets/emilia/explorer/celebrate.png'
import explorerSad         from '../assets/emilia/explorer/sad.png'
import explorerNervous     from '../assets/emilia/explorer/nervous.png'
import explorerFrustrated  from '../assets/emilia/explorer/frustrated.png'
import explorerPortrait    from '../assets/emilia/explorer/portrait.png'

// Traditional
import traditionalIdle        from '../assets/emilia/traditional/idle.png'
import traditionalHappy       from '../assets/emilia/traditional/happy.png'
import traditionalThinking    from '../assets/emilia/traditional/thinking.png'
import traditionalWrong       from '../assets/emilia/traditional/wrong.png'
import traditionalCelebrate   from '../assets/emilia/traditional/celebrate.png'
import traditionalSad         from '../assets/emilia/traditional/sad.png'
import traditionalNervous     from '../assets/emilia/traditional/nervous.png'
import traditionalFrustrated  from '../assets/emilia/traditional/frustrated.png'
import traditionalPortrait    from '../assets/emilia/traditional/portrait.png'

// Skater
import skaterIdle        from '../assets/emilia/skater/idle.png'
import skaterHappy       from '../assets/emilia/skater/happy.png'
import skaterThinking    from '../assets/emilia/skater/thinking.png'
import skaterWrong       from '../assets/emilia/skater/wrong.png'
import skaterCelebrate   from '../assets/emilia/skater/celebrate.png'
import skaterSad         from '../assets/emilia/skater/sad.png'
import skaterNervous     from '../assets/emilia/skater/nervous.png'
import skaterFrustrated  from '../assets/emilia/skater/frustrated.png'
import skaterPortrait    from '../assets/emilia/skater/portrait.png'

export const ART = {
  swimmer: {
    idle: swimmerIdle, happy: swimmerHappy, thinking: swimmerThinking,
    wrong: swimmerWrong, celebrate: swimmerCelebrate, sad: swimmerSad,
    nervous: swimmerNervous, frustrated: swimmerFrustrated, portrait: swimmerPortrait,
  },
  explorer: {
    idle: explorerIdle, happy: explorerHappy, thinking: explorerThinking,
    wrong: explorerWrong, celebrate: explorerCelebrate, sad: explorerSad,
    nervous: explorerNervous, frustrated: explorerFrustrated, portrait: explorerPortrait,
  },
  traditional: {
    idle: traditionalIdle, happy: traditionalHappy, thinking: traditionalThinking,
    wrong: traditionalWrong, celebrate: traditionalCelebrate, sad: traditionalSad,
    nervous: traditionalNervous, frustrated: traditionalFrustrated, portrait: traditionalPortrait,
  },
  skater: {
    idle: skaterIdle, happy: skaterHappy, thinking: skaterThinking,
    wrong: skaterWrong, celebrate: skaterCelebrate, sad: skaterSad,
    nervous: skaterNervous, frustrated: skaterFrustrated, portrait: skaterPortrait,
  },
}
