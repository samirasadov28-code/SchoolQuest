/**
 * Digital prize photo collectibles — unlocked at XP milestones.
 * Collection 1: "Unicorn Adventures" — fantasy Emilia scenes
 * Collection 2: "Skate Adventures"  — roller-skate Emilia scenes
 */

// Unicorn Adventures
import meadow    from '../assets/prizes/meadow-portrait.png'
import flying    from '../assets/prizes/flying-high.png'
import stable    from '../assets/prizes/stable-friends.png'
import galaxy    from '../assets/prizes/galaxy-ride.png'
import cave      from '../assets/prizes/cave-discovery.png'
import carousel  from '../assets/prizes/whimsical-carousel.png'

// Skate Adventures
import skatepark   from '../assets/prizes/skate/skatepark-challenge.jpg'
import coastal     from '../assets/prizes/skate/coastal-glide.jpg'
import forestSkate from '../assets/prizes/skate/forest-trail-skate.jpg'
import neonCity    from '../assets/prizes/skate/neon-city-slide.jpg'
import boardwalk   from '../assets/prizes/skate/boardwalk-cruiser.jpg'
import alleyway    from '../assets/prizes/skate/alleyway-art.jpg'
import concreteBowl from '../assets/prizes/skate/concrete-bowl.jpg'
import forestExp   from '../assets/prizes/skate/forest-trail-exp.jpg'

export const DIGITAL_PRIZES = [
  {
    id:          'meadow-portrait',
    name:        'Magical Meadow',
    description: 'Emilia meets her first unicorn in a sunlit meadow!',
    image:       meadow,
    xpRequired:  100,
    rarity:      'common',
  },
  {
    id:          'stable-friends',
    name:        'Cozy Stable',
    description: 'Emilia cares for a baby unicorn in a crystal stable.',
    image:       stable,
    xpRequired:  300,
    rarity:      'common',
  },
  {
    id:          'flying-high',
    name:        'Sky Soar',
    description: 'Emilia soars through rainbow clouds on a unicorn!',
    image:       flying,
    xpRequired:  600,
    rarity:      'rare',
  },
  {
    id:          'cave-discovery',
    name:        'Cave Secret',
    description: 'Deep in a crystal cave, Emilia discovers a sleeping unicorn.',
    image:       cave,
    xpRequired:  1000,
    rarity:      'rare',
  },
  {
    id:          'whimsical-carousel',
    name:        'Carousel Magic',
    description: 'A magical unicorn carousel at the fairy festival!',
    image:       carousel,
    xpRequired:  1500,
    rarity:      'epic',
  },
  {
    id:          'galaxy-ride',
    name:        'Cosmic Journey',
    description: 'Emilia rides a galaxy unicorn through the stars — legendary!',
    image:       galaxy,
    xpRequired:  2500,
    rarity:      'legendary',
  },
]

export const SKATE_PRIZES = [
  {
    id:          'skatepark-challenge',
    name:        'Skatepark Challenge',
    description: 'Emilia conquers the concrete bowl at the skatepark!',
    image:       skatepark,
    xpRequired:  150,
    rarity:      'common',
    collection:  'skate',
  },
  {
    id:          'boardwalk-cruiser',
    name:        'Boardwalk Cruiser',
    description: 'Emilia glides along the beach boardwalk at sunset!',
    image:       boardwalk,
    xpRequired:  350,
    rarity:      'common',
    collection:  'skate',
  },
  {
    id:          'coastal-glide',
    name:        'Coastal Glide',
    description: 'Catching the golden hour on roller skates by the sea!',
    image:       coastal,
    xpRequired:  700,
    rarity:      'rare',
    collection:  'skate',
  },
  {
    id:          'forest-trail-skate',
    name:        'Forest Trail',
    description: 'Emilia explores mossy trails deep in the enchanted forest!',
    image:       forestSkate,
    xpRequired:  1100,
    rarity:      'rare',
    collection:  'skate',
  },
  {
    id:          'alleyway-art',
    name:        'Alleyway Art Discovery',
    description: 'Emilia skates past stunning street art — even a friendly alien!',
    image:       alleyway,
    xpRequired:  1200,
    rarity:      'rare',
    collection:  'skate',
  },
  {
    id:          'concrete-bowl',
    name:        'Concrete Bowl Challenge',
    description: 'Leaning into the curve — Emilia nails the concrete bowl!',
    image:       concreteBowl,
    xpRequired:  1600,
    rarity:      'epic',
    collection:  'skate',
  },
  {
    id:          'neon-city-slide',
    name:        'Neon City Slide',
    description: 'Emilia slides through a neon-lit arcade alley at night!',
    image:       neonCity,
    xpRequired:  2000,
    rarity:      'epic',
    collection:  'skate',
  },
  {
    id:          'forest-trail-exp',
    name:        'Forest Expedition',
    description: 'Deep in the ancient Irish forest — legendary skater Emilia!',
    image:       forestExp,
    xpRequired:  3000,
    rarity:      'legendary',
    collection:  'skate',
  },
]

export const RARITY_GLOW = {
  common:    '0 0 12px rgba(176,164,143,0.6)',
  rare:      '0 0 16px rgba(74,144,217,0.7)',
  epic:      '0 0 20px rgba(142,68,173,0.8)',
  legendary: '0 0 24px rgba(201,162,39,1)',
}

export const RARITY_LABEL = {
  common:    '🌿 Common',
  rare:      '💎 Rare',
  epic:      '⭐ Epic',
  legendary: '👑 Legendary',
}

/** All collectibles across both collections, sorted by XP */
export const ALL_PRIZES = [...DIGITAL_PRIZES, ...SKATE_PRIZES]
  .sort((a, b) => a.xpRequired - b.xpRequired)

/** Which digital prizes has this XP total unlocked? */
export function getUnlockedPrizes(xp) {
  return DIGITAL_PRIZES.filter(p => xp >= p.xpRequired)
}

/** Which skate prizes has this XP total unlocked? */
export function getUnlockedSkatePrizes(xp) {
  return SKATE_PRIZES.filter(p => xp >= p.xpRequired)
}

/** Next prize to unlock across ALL collections */
export function getNextPrize(xp) {
  return ALL_PRIZES.find(p => xp < p.xpRequired) ?? null
}
