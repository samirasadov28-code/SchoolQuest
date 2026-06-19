export const QUESTION_BANK = [
  // MATHS — addition
  { id: 'maths-addition-001', subject: 'maths', topic: 'addition', difficulty: 1, type: 'multiple-choice', question: 'What is 7 + 8?', options: ['13', '14', '15', '16'], answer: '15', explanation: 'Count on from 7: 8 more makes 15!' },
  { id: 'maths-addition-002', subject: 'maths', topic: 'addition', difficulty: 2, type: 'multiple-choice', question: 'What is 24 + 37?', options: ['51', '61', '71', '81'], answer: '61', explanation: 'Add the units 4+7=11, carry 1, then 2+3+1=6. Answer: 61.' },
  { id: 'maths-addition-003', subject: 'maths', topic: 'addition', difficulty: 1, type: 'multiple-choice', question: 'What is 9 + 6?', options: ['13', '14', '15', '16'], answer: '15', explanation: '9 + 6 = 15. Think: 9 + 1 = 10, then 10 + 5 = 15!' },
  // MATHS — subtraction
  { id: 'maths-subtraction-001', subject: 'maths', topic: 'subtraction', difficulty: 1, type: 'multiple-choice', question: 'What is 15 - 6?', options: ['7', '8', '9', '10'], answer: '9', explanation: '15 take away 6 leaves 9. Count back 6 from 15!' },
  { id: 'maths-subtraction-002', subject: 'maths', topic: 'subtraction', difficulty: 2, type: 'multiple-choice', question: 'What is 52 - 28?', options: ['22', '24', '26', '28'], answer: '24', explanation: 'Think: 28 + 2 = 30, 30 + 22 = 52. So the answer is 2 + 22 = 24.' },
  // MATHS — multiplication
  { id: 'maths-multiplication-001', subject: 'maths', topic: 'multiplication', difficulty: 2, type: 'multiple-choice', question: 'What is 6 × 7?', options: ['36', '42', '48', '54'], answer: '42', explanation: 'Six sevens are 42. Count the 6 times table: 6, 12, 18, 24, 30, 36, 42!' },
  { id: 'maths-multiplication-002', subject: 'maths', topic: 'multiplication', difficulty: 1, type: 'multiple-choice', question: 'What is 3 × 4?', options: ['7', '10', '12', '14'], answer: '12', explanation: '3 groups of 4: 4, 8, 12. Three fours make twelve!' },
  { id: 'maths-multiplication-003', subject: 'maths', topic: 'multiplication', difficulty: 2, type: 'multiple-choice', question: 'What is 8 × 5?', options: ['35', '40', '45', '50'], answer: '40', explanation: '8 fives = 40. The 5 times table always ends in 0 or 5!' },
  // MATHS — division
  { id: 'maths-division-001', subject: 'maths', topic: 'division', difficulty: 2, type: 'multiple-choice', question: 'What is 20 ÷ 4?', options: ['3', '4', '5', '6'], answer: '5', explanation: 'If you share 20 sweets between 4 friends, each gets 5. Because 4 × 5 = 20!' },
  { id: 'maths-division-002', subject: 'maths', topic: 'division', difficulty: 2, type: 'multiple-choice', question: 'What is 36 ÷ 6?', options: ['4', '5', '6', '7'], answer: '6', explanation: '36 ÷ 6 = 6, because 6 × 6 = 36!' },
  // MATHS — shapes
  { id: 'maths-shapes-001', subject: 'maths', topic: 'shapes', difficulty: 1, type: 'multiple-choice', question: 'How many sides does a hexagon have?', options: ['4', '5', '6', '7'], answer: '6', explanation: 'A hexagon has 6 sides — like a honeycomb cell!' },
  { id: 'maths-shapes-002', subject: 'maths', topic: 'shapes', difficulty: 1, type: 'multiple-choice', question: 'What shape has 3 sides?', options: ['Square', 'Circle', 'Triangle', 'Rectangle'], answer: 'Triangle', explanation: 'A triangle has exactly 3 sides and 3 corners!' },
  // MATHS — time
  { id: 'maths-time-001', subject: 'maths', topic: 'time', difficulty: 1, type: 'multiple-choice', question: 'How many minutes are in one hour?', options: ['30', '45', '60', '100'], answer: '60', explanation: 'There are 60 minutes in an hour. The minute hand goes all the way around in 60 ticks!' },
  { id: 'maths-time-002', subject: 'maths', topic: 'time', difficulty: 2, type: 'multiple-choice', question: 'How many days are in a week?', options: ['5', '6', '7', '8'], answer: '7', explanation: 'A week has 7 days: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday!' },
  // MATHS — fractions
  { id: 'maths-fractions-001', subject: 'maths', topic: 'fractions', difficulty: 2, type: 'multiple-choice', question: 'What is half of 18?', options: ['7', '8', '9', '10'], answer: '9', explanation: 'Half means divide by 2. 18 ÷ 2 = 9!' },

  // ENGLISH — spelling
  { id: 'english-spelling-001', subject: 'english', topic: 'spelling', difficulty: 1, type: 'multiple-choice', question: 'Which spelling is correct?', options: ['frend', 'freind', 'friend', 'friand'], answer: 'friend', explanation: 'F-R-I-E-N-D. Remember: i before e in "friend"!' },
  { id: 'english-spelling-002', subject: 'english', topic: 'spelling', difficulty: 1, type: 'multiple-choice', question: 'How do you spell the animal that barks?', options: ['doge', 'dogg', 'dog', 'doe'], answer: 'dog', explanation: 'D-O-G. Dog is a short 3-letter word!' },
  { id: 'english-spelling-003', subject: 'english', topic: 'spelling', difficulty: 2, type: 'multiple-choice', question: 'Which spelling is correct?', options: ['becaus', 'because', 'becouse', 'becuase'], answer: 'because', explanation: 'B-E-C-A-U-S-E. Try this trick: Big Elephants Can Always Use Small Exits!' },
  // ENGLISH — grammar
  { id: 'english-grammar-001', subject: 'english', topic: 'grammar', difficulty: 2, type: 'multiple-choice', question: 'Which word is a noun?', options: ['quickly', 'run', 'happy', 'apple'], answer: 'apple', explanation: 'A noun is a person, place, or thing. An apple is a thing!' },
  { id: 'english-grammar-002', subject: 'english', topic: 'grammar', difficulty: 2, type: 'multiple-choice', question: 'Choose the correct sentence:', options: ['She runned fast.', 'She run fast.', 'She runs fast.', 'She running fast.'], answer: 'She runs fast.', explanation: '"She runs fast" is correct. We add -s to the verb when talking about he/she/it.' },
  // ENGLISH — phonics
  { id: 'english-phonics-001', subject: 'english', topic: 'phonics', difficulty: 1, type: 'multiple-choice', question: 'What sound does "ch" make in "chair"?', options: ['/k/', '/sh/', '/ch/', '/th/'], answer: '/ch/', explanation: 'Ch makes the /ch/ sound like in chair, cheese, and chocolate!' },
  // ENGLISH — vocabulary
  { id: 'english-vocabulary-001', subject: 'english', topic: 'vocabulary', difficulty: 2, type: 'multiple-choice', question: 'What is the opposite of "ancient"?', options: ['old', 'modern', 'large', 'slow'], answer: 'modern', explanation: 'Ancient means very old, so the opposite is modern — new and from today!' },

  // IRISH — greetings
  { id: 'irish-greetings-001', subject: 'irish', topic: 'greetings', difficulty: 1, type: 'multiple-choice', question: 'How do you say "Hello" in Irish?', options: ['Slán', 'Dia duit', 'Go raibh maith agat', 'Maidin mhaith'], answer: 'Dia duit', explanation: '"Dia duit" means Hello in Irish. It means "God be with you"!' },
  { id: 'irish-greetings-002', subject: 'irish', topic: 'greetings', difficulty: 1, type: 'multiple-choice', question: 'How do you say "Thank you" in Irish?', options: ['Dia duit', 'Slán', 'Go raibh maith agat', 'Tá'], answer: 'Go raibh maith agat', explanation: '"Go raibh maith agat" means thank you. It\'s a lovely phrase!' },
  { id: 'irish-greetings-003', subject: 'irish', topic: 'greetings', difficulty: 1, type: 'multiple-choice', question: 'How do you say "Goodbye" in Irish?', options: ['Dia duit', 'Slán', 'Go raibh maith agat', 'Tá'], answer: 'Slán', explanation: '"Slán" means goodbye or farewell in Irish!' },
  // IRISH — numbers
  { id: 'irish-numbers-001', subject: 'irish', topic: 'numbers', difficulty: 1, type: 'multiple-choice', question: 'What is "a trí" in Irish?', options: ['1', '2', '3', '4'], answer: '3', explanation: '"A trí" is 3. The numbers are: a haon (1), a dó (2), a trí (3)!' },
  { id: 'irish-numbers-002', subject: 'irish', topic: 'numbers', difficulty: 1, type: 'multiple-choice', question: 'How do you say "5" in Irish?', options: ['a ceathair', 'a cúig', 'a sé', 'a seacht'], answer: 'a cúig', explanation: '"A cúig" is 5 in Irish. Keep practising the numbers!' },
  // IRISH — colours
  { id: 'irish-colors-001', subject: 'irish', topic: 'colours', difficulty: 1, type: 'multiple-choice', question: 'What colour is "glas" in Irish?', options: ['red', 'blue', 'green', 'yellow'], answer: 'green', explanation: '"Glas" means green — just like the green shamrock of Ireland!' },
  { id: 'irish-colors-002', subject: 'irish', topic: 'colours', difficulty: 1, type: 'multiple-choice', question: 'What colour is "dearg" in Irish?', options: ['red', 'blue', 'green', 'yellow'], answer: 'red', explanation: '"Dearg" means red in Irish!' },

  // HISTORY
  { id: 'history-ireland-001', subject: 'history', topic: 'ireland', difficulty: 1, type: 'multiple-choice', question: 'What is the national symbol of Ireland?', options: ['Rose', 'Shamrock', 'Thistle', 'Daffodil'], answer: 'Shamrock', explanation: 'The shamrock is Ireland\'s symbol! St. Patrick used it to explain the Holy Trinity.' },
  { id: 'history-ireland-002', subject: 'history', topic: 'ireland', difficulty: 2, type: 'multiple-choice', question: 'Who is the patron saint of Ireland?', options: ['St. Andrew', 'St. George', 'St. Patrick', 'St. David'], answer: 'St. Patrick', explanation: 'St. Patrick is celebrated on March 17th every year!' },
  { id: 'history-ireland-003', subject: 'history', topic: 'ireland', difficulty: 2, type: 'multiple-choice', question: 'What ancient structure can you find at Newgrange in Ireland?', options: ['A castle', 'A passage tomb', 'A lighthouse', 'A round tower'], answer: 'A passage tomb', explanation: 'Newgrange is a famous passage tomb over 5,000 years old — older than the pyramids!' },

  // GEOGRAPHY
  { id: 'geography-ireland-001', subject: 'geography', topic: 'ireland', difficulty: 1, type: 'multiple-choice', question: 'What is the capital city of Ireland?', options: ['Cork', 'Galway', 'Dublin', 'Limerick'], answer: 'Dublin', explanation: 'Dublin is the capital of Ireland, on the east coast!' },
  { id: 'geography-ireland-002', subject: 'geography', topic: 'ireland', difficulty: 2, type: 'multiple-choice', question: 'Which ocean is to the west of Ireland?', options: ['Pacific Ocean', 'Indian Ocean', 'Atlantic Ocean', 'Arctic Ocean'], answer: 'Atlantic Ocean', explanation: 'The Atlantic Ocean is west of Ireland. The next land is America!' },
  { id: 'geography-world-001', subject: 'geography', topic: 'world', difficulty: 2, type: 'multiple-choice', question: 'How many continents are there on Earth?', options: ['5', '6', '7', '8'], answer: '7', explanation: 'There are 7 continents: Africa, Antarctica, Asia, Australia, Europe, North America, South America!' },
  { id: 'geography-world-002', subject: 'geography', topic: 'world', difficulty: 1, type: 'multiple-choice', question: 'What is the largest country in the world?', options: ['USA', 'China', 'Russia', 'Canada'], answer: 'Russia', explanation: 'Russia is the biggest country — it\'s so huge it spans 11 time zones!' },

  // SCIENCE
  { id: 'science-plants-001', subject: 'science', topic: 'plants', difficulty: 1, type: 'multiple-choice', question: 'What do plants need to make their food?', options: ['Rain and wind', 'Sunlight and water', 'Soil and darkness', 'Heat and fire'], answer: 'Sunlight and water', explanation: 'Plants need sunlight and water to make food. This is called photosynthesis!' },
  { id: 'science-weather-001', subject: 'science', topic: 'weather', difficulty: 1, type: 'multiple-choice', question: 'What causes rain?', options: ['Wind blowing leaves', 'Water evaporating and forming clouds', 'The sun getting too hot', 'Mountains making noise'], answer: 'Water evaporating and forming clouds', explanation: 'Water evaporates, rises up, forms clouds, and falls as rain. This is the water cycle!' },
  { id: 'science-materials-001', subject: 'science', topic: 'materials', difficulty: 2, type: 'multiple-choice', question: 'Which of these is a metal?', options: ['Wood', 'Plastic', 'Iron', 'Glass'], answer: 'Iron', explanation: 'Iron is a metal — hard, shiny, and conducts electricity!' },
  { id: 'science-animals-001', subject: 'science', topic: 'animals', difficulty: 1, type: 'multiple-choice', question: 'What do caterpillars turn into?', options: ['Bees', 'Butterflies', 'Beetles', 'Moths'], answer: 'Butterflies', explanation: 'Caterpillars go into a chrysalis and come out as beautiful butterflies! This is metamorphosis.' },

  // GENERAL KNOWLEDGE
  { id: 'genknow-ireland-001', subject: 'genknow', topic: 'ireland', difficulty: 1, type: 'multiple-choice', question: 'What colour is at the left of the Irish flag?', options: ['Orange', 'White', 'Green', 'Gold'], answer: 'Green', explanation: 'The Irish flag has Green on the left, White in the middle, and Orange on the right!' },
  { id: 'genknow-world-001', subject: 'genknow', topic: 'world', difficulty: 2, type: 'multiple-choice', question: 'Which is the largest planet in our solar system?', options: ['Saturn', 'Earth', 'Jupiter', 'Mars'], answer: 'Jupiter', explanation: 'Jupiter is the biggest planet — over 1,300 Earths could fit inside it!' },
  { id: 'genknow-ireland-002', subject: 'genknow', topic: 'ireland', difficulty: 1, type: 'multiple-choice', question: 'What animal is on a Irish 50 cent coin?', options: ['Harp', 'Wolf', 'Hare', 'Eagle'], answer: 'Hare', explanation: 'The Irish hare is on the 50 cent coin. Ireland has its own special hare!' }
]
