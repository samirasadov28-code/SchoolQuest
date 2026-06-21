/**
 * Pet species definitions, art map, and speech lines.
 * Stage 1 art is real. Stages 2–3 fall back to stage 1 until generated.
 */

// ── Stage 1 art imports ───────────────────────────────────────────────────────
import catHappy       from '../assets/pets/cat/1/happy.png'
import catHungry      from '../assets/pets/cat/1/hungry.png'
import catSad         from '../assets/pets/cat/1/sad.png'
import catEating      from '../assets/pets/cat/1/eating.png'
import catCelebrating from '../assets/pets/cat/1/celebrating.png'
import catSleeping    from '../assets/pets/cat/1/sleeping.png'
import catIdle        from '../assets/pets/cat/1/idle.png'
import catPortrait    from '../assets/pets/cat/1/portrait.png'

import dogHappy       from '../assets/pets/dog/1/happy.png'
import dogHungry      from '../assets/pets/dog/1/hungry.png'
import dogSad         from '../assets/pets/dog/1/sad.png'
import dogEating      from '../assets/pets/dog/1/eating.png'
import dogCelebrating from '../assets/pets/dog/1/celebrating.png'
import dogSleeping    from '../assets/pets/dog/1/sleeping.png'
import dogIdle        from '../assets/pets/dog/1/idle.png'
import dogPortrait    from '../assets/pets/dog/1/portrait.png'

import dragonHappy       from '../assets/pets/dragon/1/happy.png'
import dragonHungry      from '../assets/pets/dragon/1/hungry.png'
import dragonSad         from '../assets/pets/dragon/1/sad.png'
import dragonEating      from '../assets/pets/dragon/1/eating.png'
import dragonCelebrating from '../assets/pets/dragon/1/celebrating.png'
import dragonSleeping    from '../assets/pets/dragon/1/sleeping.png'
import dragonIdle        from '../assets/pets/dragon/1/idle.png'
import dragonPortrait    from '../assets/pets/dragon/1/portrait.png'

import unicornHappy       from '../assets/pets/unicorn/1/happy.png'
import unicornHungry      from '../assets/pets/unicorn/1/hungry.png'
import unicornSad         from '../assets/pets/unicorn/1/sad.png'
import unicornEating      from '../assets/pets/unicorn/1/eating.png'
import unicornCelebrating from '../assets/pets/unicorn/1/celebrating.png'
import unicornSleeping    from '../assets/pets/unicorn/1/sleeping.png'
import unicornIdle        from '../assets/pets/unicorn/1/idle.png'
import unicornPortrait    from '../assets/pets/unicorn/1/portrait.png'

const ART = {
  cat:     { happy: catHappy, hungry: catHungry, sad: catSad, eating: catEating, celebrating: catCelebrating, sleeping: catSleeping, idle: catIdle, portrait: catPortrait },
  dog:     { happy: dogHappy, hungry: dogHungry, sad: dogSad, eating: dogEating, celebrating: dogCelebrating, sleeping: dogSleeping, idle: dogIdle, portrait: dogPortrait },
  dragon:  { happy: dragonHappy, hungry: dragonHungry, sad: dragonSad, eating: dragonEating, celebrating: dragonCelebrating, sleeping: dragonSleeping, idle: dragonIdle, portrait: dragonPortrait },
  unicorn: { happy: unicornHappy, hungry: unicornHungry, sad: unicornSad, eating: unicornEating, celebrating: unicornCelebrating, sleeping: unicornSleeping, idle: unicornIdle, portrait: unicornPortrait },
}

/** Get art for a species/stage/mood. Falls back stage 2-3 → stage 1, unknown mood → happy. */
export function getArt(speciesId, stage, mood) {
  const moodMap = ART[speciesId] ?? ART.unicorn
  return moodMap[mood] ?? moodMap.happy
}

export const PET_SPECIES = [
  {
    id: 'unicorn',
    name: 'Unicorn',
    emoji: '🦄',
    description: 'A magical friend who loves maths and sparkles!',
    unlockCondition: { type: 'level', value: 12 },
    defaultName: 'Sparkle',
    stageNames: ['Foal', 'Young Unicorn', 'Winged Unicorn'],
    stageThresholds: [0, 200, 800],
    speechLines: {
      happy:       ['{name} prances with joy! 🦄✨', 'Yay! {name} loves learning! 🌟', '{name} is so happy right now! 💛'],
      hungry:      ['{name} is a little peckish... 🌿', 'Could {name} have a treat? 🍎', '{name} is looking at you hopefully 🦄'],
      sad:         ['{name} misses you... 💚', 'Come back soon! {name} needs you! 🦄', '{name} is a bit lonely 🌙'],
      eating:      ['Nom nom! {name} loves it! 🦄', 'Yum yum! {name} is SO happy! 🌟', 'Delicious! {name} says thank you! ✨'],
      celebrating: ['WOOHOO! {name} believes in you! 🎊', '{name} is SO proud! ✨', 'Amazing! {name} is doing a happy dance! 🦄'],
      sleeping:    ['Shh... {name} is resting 💤', 'Sweet dreams, {name}! 🌙', '{name} is having unicorn dreams ✨'],
      idle:        ['Hi there! {name} is ready! 🦄', '{name} is here for you! 💛', '{name} is enjoying the sunshine ☀️'],
    },
  },
  {
    id: 'dragon',
    name: 'Dragon',
    emoji: '🐉',
    description: 'A brave fire-breather who loves science and history!',
    unlockCondition: { type: 'level', value: 7 },
    defaultName: 'Ember',
    stageNames: ['Hatchling', 'Wyrmling', 'Great Dragon'],
    stageThresholds: [0, 200, 800],
    speechLines: {
      happy:       ['{name} breathes happy sparks! 🐉🔥', '{name} roars with joy! ✨', 'RAWR! {name} loves this! 🐉'],
      hungry:      ['{name} is looking for snacks 🔥', 'Feed {name}! Dragons need fuel! 🐉', '{name} gives you the hungry eyes 👀'],
      sad:         ['{name} is a sad dragon 🐉💧', 'Even {name}\'s fire is dim... come back! 💙', '{name} droops their wings 🌧️'],
      eating:      ['CHOMP! {name} loves answers! 🐉', '{name} breathes happy fire! 🔥', 'NOM! {name} is fuelled up! ✨'],
      celebrating: ['ROAR! {name} is so proud! 🐉🔥', '{name} shoots victory sparks! 🎊', 'Amazing! {name} does a dragon dance! 🐉'],
      sleeping:    ['{name} is curled up snoozing 💤', 'Gentle snores from {name}... 🐉', 'Don\'t wake {name}! 🌙'],
      idle:        ['{name} is ready to explore! 🐉', '{name} flicks their tail! 🔥', 'Hi! {name} is feeling adventurous! 🐉'],
    },
  },
  {
    id: 'dog',
    name: 'Dog',
    emoji: '🐶',
    description: 'Your loyal buddy who cheers you on for every answer!',
    unlockCondition: { type: 'level', value: 3 },
    defaultName: 'Biscuit',
    stageNames: ['Puppy', 'Dog', 'Hero Hound'],
    stageThresholds: [0, 200, 800],
    speechLines: {
      happy:       ['{name} wags their tail SO fast! 🐶💛', 'WOOF! {name} thinks you\'re amazing! ✨', '{name} does a happy spin! 🐶'],
      hungry:      ['{name} is giving you puppy eyes 🐶', 'Woof... {name} would love a treat! 🦴', '{name} sits very nicely and waits 🐾'],
      sad:         ['{name} whimpers softly... 🐶💙', 'Come back! {name} misses you! 🐾', '{name} puts their head on their paws 🌧️'],
      eating:      ['WOOF WOOF! {name} loves this! 🐶', '*happy chomping sounds* 🦴', '{name} wags their tail while eating! ✨'],
      celebrating: ['BARK BARK! {name} is SO excited! 🎊', '{name} jumps up and down! 🐶', 'WOOF! {name} thinks you\'re a STAR! ⭐'],
      sleeping:    ['{name} is snoozing peacefully 💤', 'Gentle paw twitches from {name} 🐾', 'Dreaming of adventures with you! 🌙'],
      idle:        ['{name} wags at you! 🐶', '{name} is ready to play! 🐾', 'WOOF! Hi there! {name} is here! 💛'],
    },
  },
  {
    id: 'cat',
    name: 'Cat',
    emoji: '🐱',
    description: 'A mysterious feline with ancient Irish wisdom!',
    unlockCondition: { type: 'starter' },
    defaultName: 'Fionn',
    stageNames: ['Kitten', 'Cat', 'Mystic Feline'],
    stageThresholds: [0, 200, 800],
    speechLines: {
      happy:       ['{name} purrs loudly! 🐱💛', '*purrrr* {name} is content! ✨', '{name} slow-blinks at you 💚'],
      hungry:      ['{name} meows politely... 🐱', '*mew* {name} would like a snack! 🐟', '{name} winds around your ankles 🐾'],
      sad:         ['{name} is a bit sulky 🐱💙', '{name} sits with their back to you... 🌧️', '{name} flicks their tail sadly 💙'],
      eating:      ['*crunch crunch* {name} approves! 🐱', '{name} eats with great dignity ✨', 'Purr purr! {name} says thank you! 🐟'],
      celebrating: ['{name} does an elegant leap! 🐱✨', '*PURRRR* {name} is impressed! 🎊', '{name} chirps with joy! 🐱'],
      sleeping:    ['{name} is in a loaf position 💤', 'Perfect nap time for {name} 🌙', '{name} twitches their whiskers dreaming ✨'],
      idle:        ['{name} watches you wisely 🐱', '{name} flicks an ear at you 🐾', 'The ancient {name} observes... 💛'],
    },
  },
]

export function getSpecies(id) {
  return PET_SPECIES.find(s => s.id === id) ?? PET_SPECIES[0]
}

export function getPetStage(petXp, speciesId) {
  const species = getSpecies(speciesId)
  const thresholds = species.stageThresholds
  if (petXp >= thresholds[2]) return 3
  if (petXp >= thresholds[1]) return 2
  return 1
}

export function getPetMoodFromState(happiness) {
  if (happiness >= 70) return 'happy'
  if (happiness >= 40) return 'idle'
  return 'hungry'
}

/** Interpolate a speech line replacing {name} */
export function getSpeechLine(speciesId, mood, petName) {
  const species = getSpecies(speciesId)
  const lines = species.speechLines[mood] ?? species.speechLines.idle
  const line = lines[Math.floor(Math.random() * lines.length)]
  return line.replace(/{name}/g, petName ?? species.defaultName)
}

const BAD_WORDS = ['idiot', 'stupid', 'hate', 'kill', 'dead', 'damn', 'hell', 'crap', 'poop', 'butt']
export function filterPetName(name) {
  const trimmed = name.trim().slice(0, 16)
  const lower = trimmed.toLowerCase()
  if (BAD_WORDS.some(w => lower.includes(w))) return { ok: false, cleaned: trimmed }
  return { ok: true, cleaned: trimmed }
}
