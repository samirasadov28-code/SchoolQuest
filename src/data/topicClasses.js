// Topics at class 2 level (age 7-8) — available from the start
// Topics at class 3 level (age 8-9) — unlock at level 5
export const TOPIC_CLASS = {
  english: {
    spelling: 2, plurals: 2, grammar: 2, reading: 2,
    'compound-words': 3, punctuation: 3, vocabulary: 3, writing: 3,
  },
  maths: {
    addition: 2, subtraction: 2, multiplication: 2, division: 2,
    'place-value': 2, time: 2, money: 2,
    fractions: 3, measurement: 3, shapes: 3, data: 3, 'mental-maths': 3, 'word-problems': 3,
  },
  irish: { greetings: 2, numbers: 2, colours: 2, animals: 2, family: 2, school: 2, food: 2, weather: 2, seasons: 2, body: 2, vocabulary: 2, phrases: 2 },
  history: {
    'ancient-ireland': 2, celts: 2, 'irish-myths': 2, 'local-history': 2,
    vikings: 3, normans: 3, famine: 3, independence: 3, 'world-history': 3,
  },
  geography: {
    'ireland-physical': 2, 'ireland-counties': 2, continents: 2, weather: 2,
    europe: 3, 'world-physical': 3, mapping: 3, environment: 3,
  },
  science: {
    'living-things': 2, plants: 2, animals: 2, 'human-body': 2,
    materials: 3, forces: 3, 'light-sound': 3, electricity: 3, environment: 3,
  },
  genknow: {
    ireland: 2, world: 2, nature: 2, animals: 2, food: 2,
    'famous-people': 3, sports: 3, space: 3,
  },
  sphe: {
    feelings: 2, friendship: 2, safety: 2, 'healthy-living': 2, community: 2,
    bullying: 3, 'digital-safety': 3, relationships: 3,
  },
  ethics: {
    'right-wrong': 2, fairness: 2, respect: 2, honesty: 2,
    environment: 3, justice: 3, 'global-citizenship': 3, religion: 3,
  },
  coding: {
    sequences: 3, algorithms: 3, debugging: 3, patterns: 3,
    loops: 3, conditionals: 3, 'input-output': 3, data: 3,
  },
}

export function getTopicClass(subject, topic) {
  return TOPIC_CLASS[subject]?.[topic] ?? 3
}
