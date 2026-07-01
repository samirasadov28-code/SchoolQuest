/**
 * Digital prize photo collectibles — unlocked at XP milestones.
 * Collection 1: "Unicorn Adventures" — 24 cards, every ~4,167 XP up to 100k
 * Collection 2: "Skate Adventures"  — 17 cards, every ~5,882 XP up to 100k
 */

// ── Unicorn Adventures ──────────────────────────────────────────
// Explorer Tales (4)
import newFriends   from '../assets/prizes/unicorn/new-friends.png'
import ridingHigh   from '../assets/prizes/unicorn/riding-high.png'
import sharingSnack from '../assets/prizes/unicorn/sharing-snack.png'
import overRainbow  from '../assets/prizes/unicorn/over-rainbow.png'

// Zoe & Starry (8)
import zoeStarry1   from '../assets/prizes/unicorn/zoe-starry-1.png'
import zoeStarry2   from '../assets/prizes/unicorn/zoe-starry-2.png'
import zoeStarry3   from '../assets/prizes/unicorn/zoe-starry-3.png'
import zoeStarry4   from '../assets/prizes/unicorn/zoe-starry-4.png'
import zoeStarry5   from '../assets/prizes/unicorn/zoe-starry-5.png'
import zoeStarry6   from '../assets/prizes/unicorn/zoe-starry-6.png'
import zoeStarry7   from '../assets/prizes/unicorn/zoe-starry-7.png'
import zoeStarry8   from '../assets/prizes/unicorn/zoe-starry-8.png'

// Lily & Aurora (8)
import lilyAurora1  from '../assets/prizes/unicorn/lily-aurora-1.png'
import lilyAurora2  from '../assets/prizes/unicorn/lily-aurora-2.png'
import lilyAurora3  from '../assets/prizes/unicorn/lily-aurora-3.png'
import lilyAurora4  from '../assets/prizes/unicorn/lily-aurora-4.png'
import lilyAurora5  from '../assets/prizes/unicorn/lily-aurora-5.png'
import lilyAurora6  from '../assets/prizes/unicorn/lily-aurora-6.png'
import lilyAurora7  from '../assets/prizes/unicorn/lily-aurora-7.png'
import lilyAurora8  from '../assets/prizes/unicorn/lily-aurora-8.png'

// Celestial Adventures (4) — moved from skate tab
import celestialFriends from '../assets/prizes/unicorn/celestial-new-friends.png'
import skatingStars     from '../assets/prizes/unicorn/skating-past-stars.png'
import sharingBird      from '../assets/prizes/unicorn/sharing-snack-bird.png'
import skywardSkates    from '../assets/prizes/unicorn/skyward-skates.png'

// ── Skate Adventures ─────────────────────────────────────────────
// Portrait
import readyToRoll      from '../assets/prizes/skate-new/ready-to-roll.jpg'
// Emotions
import pureJoy          from '../assets/prizes/skate-new/pure-joy.jpg'
import pensiveSkater    from '../assets/prizes/skate-new/pensive-skater.jpg'
import focusedDetermined from '../assets/prizes/skate-new/focused-determined.jpg'
import mischievousPlay  from '../assets/prizes/skate-new/mischievous-play.jpg'
// Location cards group 1
import skateparkChallenge from '../assets/prizes/skate-new/skatepark-challenge.jpg'
import coastalGlide     from '../assets/prizes/skate-new/coastal-glide.jpg'
import forestTrail      from '../assets/prizes/skate-new/forest-trail-skate.jpg'
import neonCity         from '../assets/prizes/skate-new/neon-city-slide.jpg'
// Action poses
import dynamicSkate     from '../assets/prizes/skate-new/dynamic-skate.jpg'
import curbsideAdjust   from '../assets/prizes/skate-new/curbside-adjust.jpg'
import triumphantSpin   from '../assets/prizes/skate-new/triumphant-spin.jpg'
import playfulWobble    from '../assets/prizes/skate-new/playful-wobble.jpg'
// Location cards group 2
import boardwalkCruiser from '../assets/prizes/skate-new/boardwalk-cruiser.jpg'
import alleyway         from '../assets/prizes/skate-new/alleyway-art.jpg'
import concreteBowl     from '../assets/prizes/skate-new/concrete-bowl.jpg'
import forestExp        from '../assets/prizes/skate-new/forest-trail-exp.jpg'

// 24 unicorn prizes: 1,000 → 24,000 XP in steps of 1,000
export const DIGITAL_PRIZES = [
  // — Explorer Tales —
  { id: 'new-friends',   name: 'A Magical Discovery!',      description: 'I found a magical friend! An explorer girl meets a beautiful white unicorn in an enchanted forest.',    image: newFriends,   xpRequired: 1000,  rarity: 'common',    chapter: 'Explorer Tales' },
  { id: 'riding-high',   name: 'Riding High!',              description: 'A magical ride over the hills! Galloping through a meadow of bluebells on a rainbow unicorn!',         image: ridingHigh,   xpRequired: 2000,  rarity: 'common',    chapter: 'Explorer Tales' },
  { id: 'sharing-snack', name: 'Sharing a Snack!',          description: 'Sharing is caring, even with a unicorn! Best friends share an apple in the magical forest.',           image: sharingSnack, xpRequired: 3000,  rarity: 'common',    chapter: 'Explorer Tales' },
  { id: 'over-rainbow',  name: 'Over the Rainbow!',         description: 'We can fly to new heights! Soaring above the clouds to a magical castle in the sky!',                  image: overRainbow,  xpRequired: 4000,  rarity: 'common',    chapter: 'Explorer Tales' },
  // — Zoe & Starry —
  { id: 'zoe-starry-1',  name: 'Zoe Meets Starry',         description: 'One day, Zoe was skating in the park when she found a magical unicorn!',                                image: zoeStarry1,   xpRequired: 5000,  rarity: 'rare',      chapter: 'Zoe & Starry' },
  { id: 'zoe-starry-2',  name: 'Starry Needs Help',        description: 'Her name was Starry. Starry had lost her sparkle and needed Zoe\'s help.',                             image: zoeStarry2,   xpRequired: 6000,  rarity: 'rare',      chapter: 'Zoe & Starry' },
  { id: 'zoe-starry-3',  name: 'The Crystal Quest',        description: 'Together, they searched for five magic crystals hidden around the park.',                               image: zoeStarry3,   xpRequired: 7000,  rarity: 'rare',      chapter: 'Zoe & Starry' },
  { id: 'zoe-starry-4',  name: 'Kindness Along the Way',   description: 'They solved puzzles, helped animals, and shared kindness every step of the way.',                      image: zoeStarry4,   xpRequired: 8000,  rarity: 'rare',      chapter: 'Zoe & Starry' },
  { id: 'zoe-starry-5',  name: 'The Last Crystal',         description: 'When they found the last crystal, Starry\'s sparkle returned brighter than ever!',                     image: zoeStarry5,   xpRequired: 9000,  rarity: 'epic',      chapter: 'Zoe & Starry' },
  { id: 'zoe-starry-6',  name: 'Words from the Heart',     description: 'Starry thanked Zoe: "You believed in magic, friendship, and yourself!"',                               image: zoeStarry6,   xpRequired: 10000, rarity: 'epic',      chapter: 'Zoe & Starry' },
  { id: 'zoe-starry-7',  name: 'Above the Clouds',         description: 'Starry took Zoe on a magical ride above the clouds to celebrate their adventure!',                     image: zoeStarry7,   xpRequired: 11000, rarity: 'epic',      chapter: 'Zoe & Starry' },
  { id: 'zoe-starry-8',  name: 'Friends Forever',          description: 'Zoe waved goodbye to Starry, knowing that true friends shine in your heart forever.',                  image: zoeStarry8,   xpRequired: 12000, rarity: 'epic',      chapter: 'Zoe & Starry' },
  // — Lily & Aurora —
  { id: 'lily-aurora-1', name: 'The Shimmering Path',      description: 'Lily loved exploring. One day she stumbled upon a shimmering path in the forest.',                     image: lilyAurora1,  xpRequired: 13000, rarity: 'epic',      chapter: 'Lily & Aurora' },
  { id: 'lily-aurora-2', name: 'Meeting Aurora',           description: 'At the end of the path she met a beautiful unicorn named Aurora. Aurora seemed shy and sad.',          image: lilyAurora2,  xpRequired: 14000, rarity: 'epic',      chapter: 'Lily & Aurora' },
  { id: 'lily-aurora-3', name: 'Healing Touch',            description: 'Lily noticed Aurora was hurt. She cleaned the cut and wrapped it with a soft leaf.',                   image: lilyAurora3,  xpRequired: 15000, rarity: 'legendary', chapter: 'Lily & Aurora' },
  { id: 'lily-aurora-4', name: 'A Secret Place',           description: 'Aurora\'s eyes sparkled with thanks. She showed Lily a secret place above the clouds.',               image: lilyAurora4,  xpRequired: 16000, rarity: 'legendary', chapter: 'Lily & Aurora' },
  { id: 'lily-aurora-5', name: 'Soaring Together',         description: 'They soared through the sky, past twinkling stars and fluffy clouds!',                                 image: lilyAurora5,  xpRequired: 17000, rarity: 'legendary', chapter: 'Lily & Aurora' },
  { id: 'lily-aurora-6', name: 'The Floating Island',      description: 'They found a floating island filled with glowing crystals and beautiful colourful flowers.',           image: lilyAurora6,  xpRequired: 18000, rarity: 'legendary', chapter: 'Lily & Aurora' },
  { id: 'lily-aurora-7', name: 'A Wish for Everyone',      description: 'Lily wished for courage, kindness, and happiness for everyone. Aurora added her magic.',              image: lilyAurora7,  xpRequired: 19000, rarity: 'legendary', chapter: 'Lily & Aurora' },
  { id: 'lily-aurora-8', name: 'Best Friends Always',      description: 'From that day on, Lily and Aurora were the best of friends, sharing magical moments.',                 image: lilyAurora8,  xpRequired: 20000, rarity: 'legendary', chapter: 'Lily & Aurora' },
  // — Celestial Adventures —
  { id: 'celestial-new-friends', name: 'A Tiny Celestial Friend!', description: 'I found a tiny celestial friend! A magical bird hatches from a glowing egg at the skatepark.', image: celestialFriends, xpRequired: 21000, rarity: 'legendary', chapter: 'Celestial Adventures' },
  { id: 'skating-past-stars',    name: 'Skating Past Stars!',      description: 'Skating together, faster and faster! Racing through a swirling galaxy of stars!',              image: skatingStars,     xpRequired: 22000, rarity: 'legendary', chapter: 'Celestial Adventures' },
  { id: 'sharing-snack-bird',    name: 'Treats with a Friend!',    description: 'Treats are better with a friend! Sharing a strawberry with a magical celestial bird on the moon.', image: sharingBird,  xpRequired: 23000, rarity: 'legendary', chapter: 'Celestial Adventures' },
  { id: 'skyward-skates',        name: 'Skyward Skates!',          description: 'We\'re skating past the stars! Soaring through the night sky carried by a magical phoenix bird!', image: skywardSkates, xpRequired: 24000, rarity: 'legendary', chapter: 'Celestial Adventures' },
]

// 17 skate prizes: 2,500 → 42,500 XP in steps of 2,500
export const SKATE_PRIZES = [
  { id: 'ready-to-roll',       name: 'Ready to Roll!',            description: 'Emilia geared up in her purple skates, backpack on — ready for any adventure!',              image: readyToRoll,       xpRequired: 2500,  rarity: 'common',    collection: 'skate' },
  { id: 'pure-joy',            name: 'Pure Joy!',                  description: 'Arms up, eyes wide, the biggest smile — this is the feeling of skating free!',               image: pureJoy,           xpRequired: 5000,  rarity: 'common',    collection: 'skate' },
  { id: 'pensive-skater',      name: 'Thoughtful Skater',          description: 'Sometimes the best ideas come when you\'re gliding along, thinking quietly...',               image: pensiveSkater,     xpRequired: 7500,  rarity: 'common',    collection: 'skate' },
  { id: 'focused-determined',  name: 'Focused & Determined!',      description: 'Eyes on the goal, knees bent — nothing is going to stop Emilia from mastering this move!',   image: focusedDetermined, xpRequired: 10000, rarity: 'common',    collection: 'skate' },
  { id: 'mischievous-play',    name: 'Mischievous Play!',          description: 'That sly smile means Emilia has a fun surprise up her sleeve...',                             image: mischievousPlay,   xpRequired: 12500, rarity: 'rare',      collection: 'skate' },
  { id: 'skatepark-challenge', name: 'Skatepark Challenge!',       description: 'Emilia takes on the skatepark bowl — navigating the curves like a pro!',                     image: skateparkChallenge, xpRequired: 15000, rarity: 'rare',     collection: 'skate' },
  { id: 'coastal-glide',       name: 'Coastal Glide',              description: 'Catching the golden hour on roller skates by the sea — the warm breeze in her hair!',        image: coastalGlide,      xpRequired: 17500, rarity: 'rare',      collection: 'skate' },
  { id: 'forest-trail',        name: 'Forest Trail',               description: 'Emilia explores mossy trails deep in the enchanted forest on her skates!',                   image: forestTrail,       xpRequired: 20000, rarity: 'rare',      collection: 'skate' },
  { id: 'neon-city-slide',     name: 'Neon City Slide!',           description: 'Emilia slides through a neon-lit arcade alley at night — lights flashing all around!',      image: neonCity,          xpRequired: 22500, rarity: 'epic',      collection: 'skate' },
  { id: 'dynamic-skate',       name: 'Dynamic Skate!',             description: 'Speed! Energy! Emilia dashes forward, hair flying, skating at full power!',                  image: dynamicSkate,      xpRequired: 25000, rarity: 'epic',      collection: 'skate' },
  { id: 'curbside-adjust',     name: 'Curbside Adjust',            description: 'Even the best skaters stop to tighten their skates. Preparation is part of the adventure!',  image: curbsideAdjust,    xpRequired: 27500, rarity: 'epic',      collection: 'skate' },
  { id: 'triumphant-spin',     name: 'Triumphant Spin!',           description: 'Fist in the air — Emilia lands her spin perfectly! She did it!',                             image: triumphantSpin,    xpRequired: 30000, rarity: 'epic',      collection: 'skate' },
  { id: 'playful-wobble',      name: 'Playful Wobble!',            description: 'Arms out, trying to balance with a giggle — wobbling is just part of learning!',             image: playfulWobble,     xpRequired: 32500, rarity: 'epic',      collection: 'skate' },
  { id: 'boardwalk-cruiser',   name: 'Boardwalk Cruiser',          description: 'Emilia glides along the beach boardwalk at a beautiful golden sunset!',                      image: boardwalkCruiser,  xpRequired: 35000, rarity: 'legendary', collection: 'skate' },
  { id: 'alleyway-art',        name: 'Alleyway Art Discovery',     description: 'Emilia discovers stunning street art — even a friendly alien says hello!',                   image: alleyway,          xpRequired: 37500, rarity: 'legendary', collection: 'skate' },
  { id: 'concrete-bowl',       name: 'Concrete Bowl Challenge',    description: 'Leaning into the curve — Emilia nails the concrete bowl! The crowd goes wild!',              image: concreteBowl,      xpRequired: 40000, rarity: 'legendary', collection: 'skate' },
  { id: 'forest-trail-exp',    name: 'Forest Trail Expedition',    description: 'Deep in the ancient Irish forest — legendary skater Emilia explores uncharted paths!',       image: forestExp,         xpRequired: 42500, rarity: 'legendary', collection: 'skate' },
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
