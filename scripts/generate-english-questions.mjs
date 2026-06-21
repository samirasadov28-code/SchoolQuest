/**
 * generate-english-questions.mjs
 * Generates Irish primary school 3rd class English questions.
 * No API — all questions hardcoded from curriculum content.
 * Run: node scripts/generate-english-questions.mjs
 */
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const FILE = join(__dirname, '../src/data/questions/english.json')
const existing = JSON.parse(readFileSync(FILE, 'utf8'))
const seenQ = new Set(existing.map(q => q.question.trim().toLowerCase()))
const newQs = []

const maxIds = {}
existing.forEach(q => {
  const parts = q.id.split('-'), num = parseInt(parts[parts.length-1])
  const prefix = parts.slice(0,-1).join('-')
  if (!maxIds[prefix] || num > maxIds[prefix]) maxIds[prefix] = num
})
function nextId(prefix) {
  if (!maxIds[prefix]) maxIds[prefix] = 0
  maxIds[prefix]++
  return `${prefix}-${String(maxIds[prefix]).padStart(3,'0')}`
}
function rot4(arr, ans) {
  const idx = arr.indexOf(ans)
  if (idx < 0) { const a = [...arr.slice(0,3)]; a.unshift(ans); return a }
  const pos = ans.charCodeAt(0) % 4
  return [...arr.slice(pos), ...arr.slice(0,pos)].slice(0,4)
}
function addQ(id, subject, topic, difficulty, question, options, answer, explanation) {
  const key = question.trim().toLowerCase()
  if (seenQ.has(key)) return
  seenQ.add(key)
  newQs.push({ id, subject, topic, difficulty, type: 'multiple-choice', question, options, answer, explanation })
}
function q(prefix, topic, diff, question, options, answer, explanation) {
  addQ(nextId(prefix), 'english', topic, diff, question, rot4(options, answer), answer, explanation)
}

// ─── SPELLING ────────────────────────────────────────────────────────────────
const P_SP = 'eng-spell'
const spellingWords = [
  // [word, wrong1, wrong2, wrong3, difficulty, hint]
  ['beautiful','beatiful','buetiful','beautifull',2,'Think: beau-ti-ful — three syllables!'],
  ['friend','freind','frend','friand',2,'Remember: fri-end. A friend is there to the end!'],
  ['because','becuse','becaus','becauz',2,'Sound it out: be-cause.'],
  ['different','diferent','diffrent','diferant',2,'Two fs and two es: dif-fer-ent.'],
  ['people','poeple','peopel','peple',2,'Think: peo-ple.'],
  ['would','woud','cuold','wolud',1,'Would, could, should — these all have a silent L.'],
  ['could','cuold','coud','coold',1,'Could, would, should — silent L family!'],
  ['should','shoud','shuld','shoold',1,'Should rhymes with could and would — all silent L.'],
  ['which','wich','whitch','whicch',1,'Which has a silent H after the W.'],
  ['where','whear','wher','whare',1,'Where asks about a place.'],
  ['there','thear','ther','thare',1,'There, their, they\'re — three different words!'],
  ['their','thier','thear','ther',2,'Their means belonging to them.'],
  ['they\'re','their','there','theyre',2,'They\'re = they are — the apostrophe shows a missing letter.'],
  ['through','threw','throo','thrugh',3,'Through is tricky — thr-ough!'],
  ['thought','thort','thougt','thowt',3,'Thought has -ough in the middle — like bought and sought.'],
  ['caught','cort','caght','cawt',3,'Caught rhymes with bought and taught.'],
  ['enough','enuf','enuph','enouf',3,'Enough — the gh makes an f sound!'],
  ['knight','nite','knigt','kniht',3,'Knight has a silent k and silent gh.'],
  ['Wednesday','Wendsday','Wensday','Wednseday',3,'Wed-nes-day — say all three syllables slowly.'],
  ['February','Febuary','Febuary','Feburary',3,'Feb-ru-ary — don\'t forget the first r!'],
  ['necessary','necissary','necesary','neccesary',4,'One collar, two socks: one c, two s\'s!'],
  ['separate','seperate','separete','separrate',4,'Sep-a-rate — there\'s a rat in separate!'],
  ['surprise','suprise','surpise','surprize',3,'Sur-prise — two r\'s!'],
  ['receive','recieve','receve','receeve',4,'I before E except after C — receive.'],
  ['believe','beleive','beleve','believ',3,'I before E: be-lieve.'],
  ['achieve','acheive','acheve','achiave',3,'Achieve — i before e again!'],
  ['address','adress','addres','adddress',3,'Address has a double d and double s.'],
  ['disappear','disapear','dissapear','disappeer',4,'Dis-ap-pear — one s, two p\'s.'],
  ['beginning','begining','beggining','begining',3,'Double the n: be-gin-ning.'],
  ['running','runing','runningg','runnig',2,'Double the n when adding -ing to a short vowel word.'],
  ['swimming','swiming','swimmingg','swimmng',2,'Double the m: swim-ming.'],
  ['sitting','siting','sitingg','sittng',2,'Double the t: sit-ting.'],
  ['hopping','hoping','hoppinng','hoppping',2,'Hop has a short vowel, so double the p before -ing.'],
  ['hoping','hopping','hopeing','hopng',3,'Hope has a long vowel (silent e), so just add -ing.'],
  ['writing','writeing','writting','writng',3,'Write drops the e before adding -ing.'],
  ['making','makeing','makking','makng',2,'Make drops the e: mak-ing.'],
  ['having','haveing','havving','havng',2,'Have drops the e: hav-ing.'],
  ['coming','comeing','comming','comng',2,'Come drops the e: com-ing.'],
  ['taking','takeing','takking','takng',2,'Take drops the e: tak-ing.'],
  ['until','untill','untile','untl',2,'Until has one l at the end.'],
  ['always','allways','alwayz','alwas',1,'Al-ways — one l at the start.'],
  ['also','allso','alsoo','alzo',1,'Al-so — one l.'],
  ['already','allready','alreddy','alredy',2,'Al-ready — one l. Already means before now.'],
  ['almost','allmost','almoost','almst',2,'Al-most — one l.'],
  ['although','allthough','althogh','althugh',3,'Al-though — one l, and tricky -ough ending.'],
  ['together','togeather','togther','togheter',2,'To-geth-er — sound each syllable.'],
  ['another','anoter','anothar','anther',2,'An-oth-er — three syllables.'],
  ['whether','wether','wheather','wheter',3,'Whether — two h\'s, not to be confused with weather.'],
  ['weather','wether','wheather','wheether',2,'Weather is about rain and sun.'],
  ['library','libary','liberry','librery',3,'Li-brar-y — don\'t drop the second r.'],
  ['february','febuary','feburary','februay',3,'Feb-ru-ary — the first r is often skipped by mistake.'],
  ['government','goverment','govenment','govornment',4,'Gov-ern-ment — all three syllables.'],
  ['parliament','parliment','parliment','parlmnt',4,'Par-lia-ment — the i is often missed.'],
  ['environment','enviroment','enviornment','environmnt',4,'En-vi-ron-ment — five syllables!'],
  ['experiment','experment','expiriment','experament',4,'Ex-per-i-ment — sound each part.'],
  ['television','televison','televisoin','televison',3,'Tel-e-vi-sion — four syllables.'],
  ['information','informaton','infomation','informtion',3,'In-for-ma-tion — four syllables.'],
  ['definitely','definately','definitly','defintely',4,'Def-i-nite-ly — there is a "finite" inside it!'],
  ['immediately','imediately','immedietly','immediatly',4,'Im-me-di-ate-ly — five syllables.'],
  ['particularly','particulary','particulrly','particulaly',5,'Par-tic-u-lar-ly — six syllables!'],
  ['comfortable','comftable','comfotable','comfertable',4,'Com-fort-a-ble — four syllables.'],
  ['interesting','intresting','intrestring','ineresting',3,'In-ter-est-ing — don\'t skip the middle syllables.'],
  ['probably','probaly','probbably','probabaly',3,'Prob-ab-ly — three syllables.'],
  ['Wednesday','Wensday','Wendesday','Wendsday',3,'Remember: Wed-nes-day.'],
  ['chocolate','choclate','chocolat','chockolate',3,'Choc-o-late — three syllables.'],
  ['favourite','favorit','favourit','favrite',2,'Fa-vour-ite — three syllables, and we spell it -our- in Irish English.'],
  ['adventure','adventur','advencher','adventre',3,'Ad-ven-ture — three syllables.'],
  ['ordinary','ordenary','ordanary','ordinery',3,'Or-di-na-ry — four syllables.'],
  ['particular','particlar','perticular','particuler',4,'Par-tic-u-lar — four syllables.'],
  ['enormous','enormus','enormoous','enourmous',3,'E-nor-mous — three syllables.'],
  ['excellent','excelent','excellant','exellent',3,'Ex-cel-lent — double l, ends in -ent.'],
  ['accident','acident','accidant','acccident',3,'Ac-ci-dent — double c, ends in -ent.'],
  ['ancient','anciant','anceint','ancint',3,'An-cient — c-i-e-n-t ending.'],
  ['science','sciance','sceince','scienec',3,'Sci-ence — remember: s-c-i-e-n-c-e.'],
  ['patience','patiance','pateince','paitence',4,'Pa-tience — ends in -ience.'],
  ['conscience','consciance','consceince','conshence',5,'Con-science — has a silent c after s!'],
  ['rhythm','rythm','rhythem','rithym',4,'Rhythm — no vowels! R-H-Y-T-H-M.'],
  ['mysterious','mystirious','mysterius','mystereous',4,'Mys-te-ri-ous — four syllables.'],
  ['courageous','couragious','coraugeous','curageous',4,'Cou-ra-geous — ends in -geous.'],
]
spellingWords.forEach(([word, w1, w2, w3, diff, hint]) => {
  q(P_SP, 'spelling', diff,
    `Which is the correct spelling?`,
    [word, w1, w2, w3], word, hint)
  q(P_SP, 'spelling', diff,
    `Choose the correctly spelled word.`,
    [w1, w2, word, w3], word, hint)
})
// Spelling patterns
const ingWords = [['run','running'],['swim','swimming'],['sit','sitting'],['hop','hopping'],['cut','cutting'],['get','getting'],['put','putting'],['hit','hitting'],['dig','digging'],['jog','jogging']]
ingWords.forEach(([base, correct]) => {
  const wrong1 = base+'ing', wrong2 = base+base[base.length-1]+'ing'+'g', wrong3 = base.slice(0,-1)+'ing'
  q(P_SP,'spelling',2,`What is the -ing form of "${base}"?`,[correct,wrong1,wrong2,wrong3],correct,`${base} ends in a consonant-vowel-consonant pattern, so double the final letter before adding -ing: ${correct}.`)
})

// ─── PLURALS ─────────────────────────────────────────────────────────────────
const P_PL = 'eng-plural'
const pluralRules = [
  // [singular, plural, wrong1, wrong2, wrong3, diff, rule]
  ['cat','cats','cates','caties','caties',1,'Most nouns just add -s.'],
  ['dog','dogs','doges','dogies','dogges',1,'Most nouns just add -s.'],
  ['bus','buses','buss','bus\'s','busies',2,'Words ending in -s add -es.'],
  ['box','boxes','boxs','boxies','boxi',2,'Words ending in -x add -es.'],
  ['church','churches','churchs','churchies','churchs',2,'Words ending in -ch add -es.'],
  ['wish','wishes','wishs','wishies','wishs',2,'Words ending in -sh add -es.'],
  ['potato','potatoes','potatos','potatoe','potatoies',2,'Some words ending in -o add -es.'],
  ['tomato','tomatoes','tomatos','tomatoe','tomatoies',2,'Tomato → tomatoes. Some -o words add -es.'],
  ['leaf','leaves','leafs','leafes','leafies',3,'Words ending in -f change to -ves: leaf → leaves.'],
  ['wolf','wolves','wolfs','wolfes','wolfies',3,'Words ending in -f change to -ves: wolf → wolves.'],
  ['knife','knives','knifes','knifes','knifeies',3,'Words ending in -fe change to -ves: knife → knives.'],
  ['life','lives','lifes','lifees','lifeies',3,'Words ending in -fe change to -ves: life → lives.'],
  ['child','children','childs','childes','childies',3,'Child is irregular: child → children.'],
  ['mouse','mice','mouses','mooses','mousse',3,'Mouse is irregular: mouse → mice.'],
  ['tooth','teeth','tooths','teeths','tootheths',3,'Tooth is irregular: tooth → teeth.'],
  ['foot','feet','foots','feets','fots',3,'Foot is irregular: foot → feet.'],
  ['man','men','mans','manes','mons',2,'Man is irregular: man → men.'],
  ['woman','women','womans','womens','womons',3,'Woman is irregular: woman → women.'],
  ['goose','geese','gooses','gooses','goosies',3,'Goose is irregular: goose → geese.'],
  ['ox','oxen','oxes','oxs','oxies',4,'Ox has an unusual plural: ox → oxen.'],
  ['story','stories','storys','storees','storyes',2,'Words ending in consonant + -y change to -ies: story → stories.'],
  ['baby','babies','babys','babees','babyies',2,'Baby ends in consonant + -y, so: baby → babies.'],
  ['city','cities','citys','citees','cityies',2,'City ends in -ty: city → cities.'],
  ['country','countries','countrys','countrees','countryies',2,'Country → countries.'],
  ['family','families','familys','familees','familyies',2,'Family → families.'],
  ['donkey','donkeys','donkies','donkeies','donkeyes',3,'Donkey ends in vowel + -y, so just add -s: donkeys.'],
  ['monkey','monkeys','monkies','monkeies','monkeyes',3,'Monkey → monkeys. Vowel + -y: just add -s.'],
  ['key','keys','kies','keies','keyes',2,'Key ends in vowel + -y, so just add -s: keys.'],
  ['toy','toys','toies','toyies','toyes',1,'Toy ends in vowel + -y: just add -s.'],
  ['day','days','daies','dayies','dayes',1,'Day ends in vowel + -y: just add -s.'],
  ['fish','fish','fishs','fishes','fishies',3,'Fish is the same in singular and plural: one fish, two fish.'],
  ['sheep','sheep','sheeps','sheepes','sheepies',3,'Sheep doesn\'t change: one sheep, two sheep.'],
  ['deer','deer','deers','deeres','deerses',3,'Deer doesn\'t change: one deer, many deer.'],
  ['crisis','crises','crisiss','crisies','crisises',5,'Crisis comes from Greek: crisis → crises.'],
]
pluralRules.forEach(([sing, plural, w1, w2, w3, diff, rule]) => {
  q(P_PL,'plurals',diff,`What is the plural of "${sing}"?`,[plural,w1,w2,w3],plural,rule)
})

// ─── COMPOUND WORDS ──────────────────────────────────────────────────────────
const P_CW = 'eng-compound'
const compoundPairs = [
  ['sun','flower','sunflower','A sunflower grows toward the sun — sun + flower!'],
  ['rain','bow','rainbow','Rain + bow = rainbow. You see one after rain in sunshine!'],
  ['foot','ball','football','Foot + ball = football — Ireland\'s favourite sport!'],
  ['book','shelf','bookshelf','Book + shelf = bookshelf — where you keep books.'],
  ['butter','fly','butterfly','Butter + fly = butterfly — a beautiful compound word!'],
  ['fire','place','fireplace','Fire + place = fireplace — where you light a fire indoors.'],
  ['class','room','classroom','Class + room = classroom — where you learn!'],
  ['play','ground','playground','Play + ground = playground — where you play at school.'],
  ['some','thing','something','Some + thing = something.'],
  ['every','one','everyone','Every + one = everyone.'],
  ['any','where','anywhere','Any + where = anywhere.'],
  ['some','where','somewhere','Some + where = somewhere.'],
  ['out','side','outside','Out + side = outside.'],
  ['in','side','inside','In + side = inside.'],
  ['up','stairs','upstairs','Up + stairs = upstairs.'],
  ['down','stairs','downstairs','Down + stairs = downstairs.'],
  ['bed','room','bedroom','Bed + room = bedroom — where you sleep!'],
  ['bath','room','bathroom','Bath + room = bathroom.'],
  ['hand','bag','handbag','Hand + bag = handbag.'],
  ['tooth','brush','toothbrush','Tooth + brush = toothbrush — use yours twice a day!'],
  ['eye','brow','eyebrow','Eye + brow = eyebrow.'],
  ['ear','ring','earring','Ear + ring = earring.'],
  ['finger','nail','fingernail','Finger + nail = fingernail.'],
  ['hair','cut','haircut','Hair + cut = haircut.'],
  ['news','paper','newspaper','News + paper = newspaper.'],
  ['shop','keeper','shopkeeper','Shop + keeper = shopkeeper.'],
  ['door','step','doorstep','Door + step = doorstep.'],
  ['wind','mill','windmill','Wind + mill = windmill — wind turns the sails!'],
  ['water','fall','waterfall','Water + fall = waterfall — water falling from a great height.'],
  ['sea','shell','seashell','Sea + shell = seashell — found on the beach!'],
  ['star','fish','starfish','Star + fish = starfish — a sea creature shaped like a star.'],
  ['back','pack','backpack','Back + pack = backpack — carried on your back.'],
  ['cup','cake','cupcake','Cup + cake = cupcake — a small individual cake.'],
  ['pop','corn','popcorn','Pop + corn = popcorn — corn that pops!'],
  ['home','work','homework','Home + work = homework — work you do at home.'],
  ['snow','flake','snowflake','Snow + flake = snowflake — each one is unique!'],
  ['sun','shine','sunshine','Sun + shine = sunshine — bright light from the sun.'],
  ['rain','coat','raincoat','Rain + coat = raincoat — very useful in Ireland!'],
  ['over','coat','overcoat','Over + coat = overcoat — a long warm coat.'],
  ['hand','shake','handshake','Hand + shake = handshake — a greeting.'],
  ['day','dream','daydream','Day + dream = daydream — imagining while awake.'],
  ['moon','light','moonlight','Moon + light = moonlight — light from the moon.'],
  ['candle','stick','candlestick','Candle + stick = candlestick.'],
  ['door','bell','doorbell','Door + bell = doorbell — ring it to say you\'re there!'],
  ['table','cloth','tablecloth','Table + cloth = tablecloth.'],
  ['arm','chair','armchair','Arm + chair = armchair — a comfy chair with arms.'],
  ['neck','lace','necklace','Neck + lace = necklace — jewellery worn around the neck.'],
]
compoundPairs.forEach(([w1, w2, compound, exp]) => {
  q(P_CW,'compound-words',2,
    `Which word is made from "${w1}" + "${w2}"?`,
    [compound, w1+w2+'s', w2+w1, w1.slice(0,-1)+w2], compound, exp)
  q(P_CW,'compound-words',2,
    `"${compound}" is a compound word. Which two words make it up?`,
    ['"'+w1+'" and "'+w2+'"', '"'+w2+'" and "'+w1+'"', '"'+w1+w2+'" and "the"', '"'+w1.slice(0,2)+'" and "'+w2+'"'],
    '"'+w1+'" and "'+w2+'"', exp)
})

// ─── GRAMMAR ─────────────────────────────────────────────────────────────────
const P_GR = 'eng-gram'

// Nouns
const nounQs = [
  ['Cork','proper noun','common noun','verb','adjective',1,'Cork is the name of a specific place, so it is a proper noun — always capitalised!'],
  ['dog','common noun','proper noun','verb','adverb',1,'Dog is a common noun — a general word for a type of animal.'],
  ['happiness','abstract noun','common noun','proper noun','verb',3,'Happiness is an abstract noun — you can\'t see or touch it, but you can feel it!'],
  ['friendship','abstract noun','common noun','proper noun','adjective',3,'Friendship is an abstract noun — a feeling, not a physical object.'],
  ['bravery','abstract noun','common noun','verb','adverb',3,'Bravery is an abstract noun — a quality we admire.'],
  ['Ireland','proper noun','common noun','adjective','verb',1,'Ireland is a specific place name — proper nouns always start with a capital letter.'],
  ['Shannon','proper noun','common noun','adjective','verb',2,'Shannon (the river) is a proper noun — it names a specific river.'],
  ['book','common noun','proper noun','verb','adverb',1,'Book is a common noun — a general word for a type of thing.'],
  ['teacher','common noun','proper noun','abstract noun','adjective',1,'Teacher is a common noun — a general word for a type of person.'],
  ['love','abstract noun','common noun','proper noun','verb',3,'Love is an abstract noun — a feeling you can\'t hold in your hands.'],
  ['excitement','abstract noun','common noun','verb','adjective',3,'Excitement is an abstract noun — a feeling, not a thing.'],
  ['Dublin','proper noun','common noun','adjective','adverb',1,'Dublin is a specific place — always capitalised as a proper noun.'],
]
nounQs.forEach(([word, type, w1, w2, w3, diff, exp]) => {
  q(P_GR,'grammar',diff,`What type of noun is "${word}"?`,[type,w1,w2,w3],type,exp)
})

// Verbs - tenses
const tenseQs = [
  // [base, past, present, future, diff, hint]
  ['run','ran','running','will run',2,'Run is irregular — past tense is ran, not runned!'],
  ['jump','jumped','jumping','will jump',1,'Jump is regular — just add -ed for past tense.'],
  ['eat','ate','eating','will eat',2,'Eat is irregular — past tense is ate.'],
  ['sing','sang','singing','will sing',2,'Sing is irregular — past tense is sang.'],
  ['write','wrote','writing','will write',2,'Write is irregular — past tense is wrote.'],
  ['swim','swam','swimming','will swim',2,'Swim is irregular — past tense is swam.'],
  ['fly','flew','flying','will fly',3,'Fly is irregular — past tense is flew!'],
  ['grow','grew','growing','will grow',3,'Grow is irregular — past tense is grew.'],
  ['know','knew','knowing','will know',3,'Know is irregular — past tense is knew.'],
  ['throw','threw','throwing','will throw',3,'Throw is irregular — past tense is threw.'],
  ['bring','brought','bringing','will bring',3,'Bring is irregular — past tense is brought.'],
  ['buy','bought','buying','will buy',3,'Buy is irregular — past tense is bought.'],
  ['catch','caught','catching','will catch',3,'Catch is irregular — past tense is caught.'],
  ['teach','taught','teaching','will teach',3,'Teach is irregular — past tense is taught.'],
  ['think','thought','thinking','will think',3,'Think is irregular — past tense is thought.'],
  ['feel','felt','feeling','will feel',2,'Feel is irregular — past tense is felt.'],
  ['meet','met','meeting','will meet',2,'Meet is irregular — past tense is met.'],
  ['sit','sat','sitting','will sit',2,'Sit is irregular — past tense is sat.'],
  ['stand','stood','standing','will stand',2,'Stand is irregular — past tense is stood.'],
  ['sleep','slept','sleeping','will sleep',2,'Sleep is irregular — past tense is slept.'],
]
tenseQs.forEach(([base, past, present, future, diff, hint]) => {
  q(P_GR,'grammar',diff,`What is the past tense of "${base}"?`,
    [past, base+'ed', base+'d', base[0].toUpperCase()+base.slice(1)+'ed'], past, hint)
  q(P_GR,'grammar',diff-1>0?diff-1:1,`"${base}" is the base form of a verb. What is the present participle (-ing form)?`,
    [present, base+'ing', base.slice(0,-1)+'ing', base+base[base.length-1]+'ing'], present, `The present participle of ${base} is ${present}.`)
})

// Adjectives
const adjQs = [
  ['The ____ fox ran past the farm.','quick','ran','farm','The',1,'Quick describes the noun fox — it is an adjective.'],
  ['She wore a ____ dress to the party.','sparkly','wore','party','She',1,'Sparkly describes the dress — it is an adjective.'],
  ['The ____ giant stomped through the village.','enormous','stomped','through','The',2,'Enormous tells us what kind of giant — adjective.'],
  ['It was a ____ day for a walk in the park.','beautiful','walk','park','was',1,'Beautiful describes the day — adjective.'],
  ['The ____ kitten curled up by the fire.','tiny','curled','fire','The',1,'Tiny describes the kitten — adjective.'],
  ['He told a ____ story about dragons.','mysterious','told','dragons','He',2,'Mysterious describes the story — adjective.'],
  ['The ____ athlete won three gold medals.','talented','won','medals','The',2,'Talented describes the athlete — adjective.'],
  ['We had a ____ time at the festival.','wonderful','had','festival','We',1,'Wonderful describes the time — adjective.'],
  ['The ____ old castle stood on the hill.','ancient','stood','hill','The',3,'Ancient describes the castle — adjective.'],
  ['She gave a ____ answer to the question.','clever','gave','question','She',2,'Clever describes the answer — adjective.'],
]
adjQs.forEach(([sent, adj, w1, w2, w3, diff, exp]) => {
  q(P_GR,'grammar',diff,`Choose the adjective that best fits the gap: "${sent}"`,
    [adj,w1,w2,w3],adj,exp)
})

// Adverbs
const advQs = [
  ['She sang ____.','beautifully','beautiful','beauty','beautify',2,'Beautifully tells us HOW she sang — it is an adverb.'],
  ['He ran ____ to catch the bus.','quickly','quick','quickness','quicker',2,'Quickly tells us HOW he ran — adverb.'],
  ['The baby slept ____ through the night.','soundly','sound','sounder','soundness',2,'Soundly tells us HOW the baby slept — adverb.'],
  ['She spoke ____ to the elderly woman.','kindly','kind','kinder','kindness',2,'Kindly tells us HOW she spoke — adverb.'],
  ['He answered every question ____.','correctly','correct','correction','corrector',2,'Correctly tells us HOW he answered — adverb.'],
  ['The dog barked ____ at the postman.','loudly','loud','louder','loudness',1,'Loudly tells us HOW the dog barked — adverb.'],
  ['She ____ finished her homework before dinner.','carefully','careful','carefulness','more careful',2,'Carefully tells us HOW she finished — adverb.'],
  ['He ____ climbed the tall tree.','bravely','brave','braver','braveness',2,'Bravely tells us HOW he climbed — adverb.'],
]
advQs.forEach(([sent, adv, w1, w2, w3, diff, exp]) => {
  q(P_GR,'grammar',diff,`Which word is an adverb? "${sent}"`,
    [adv,w1,w2,w3],adv,exp)
})

// Pronouns
const pronounQs = [
  ['Aoife went to the shop. ____ bought some bread.','She','Her','Hers','They',1,'We replace "Aoife" (a girl\'s name) with the pronoun "She".'],
  ['The boys played football. ____ won the match.','They','Them','Their','Those',1,'We replace "the boys" with the pronoun "They".'],
  ['Seán and I went to the park. ____ had great fun.','We','Us','Our','They',2,'"Seán and I" = We — use "we" as the subject of a sentence.'],
  ['The book is on the table. Can you pass ____ to me?','it','its','itself','them',1,'We replace "the book" with the pronoun "it".'],
  ['That cat is always scratching. ____ claws are sharp.','Its','It\'s','Their','It',2,'"Its" (no apostrophe) shows belonging — its claws.'],
  ['I gave the flowers to Mam. I gave them to ____.','her','she','hers','herself',2,'After a verb or preposition, use "her" not "she".'],
  ['Is this bag ____?','yours','you','your','yourself',2,'"Yours" is a possessive pronoun — it replaces "your bag".'],
  ['The children cleaned up after ____.',  'themselves','theirselves','them','they',3,'"Themselves" is a reflexive pronoun — the children did it to themselves.'],
]
pronounQs.forEach(([sent, ans, w1, w2, w3, diff, exp]) => {
  q(P_GR,'grammar',diff,`Choose the correct pronoun: "${sent}"`,
    [ans,w1,w2,w3],ans,exp)
})

// Prepositions
const prepQs = [
  ['The cat sat ____ the mat.','on','in','at','by',1,'"On" shows where the cat is — on the mat. Prepositions tell us where or when.'],
  ['The bird flew ____ the tree.','over','under','beside','through',1,'"Over" tells us where the bird went.'],
  ['She hid ____ the door.','behind','between','above','over',1,'"Behind" tells us where she hid.'],
  ['We walked ____ the bridge.','across','around','beside','above',2,'"Across" means from one side to the other.'],
  ['He sat ____ his two friends.','between','among','beside','over',2,'"Between" is used for two people or things.'],
  ['She shared her sweets ____ all her classmates.','among','between','beside','over',3,'"Among" is used for more than two.'],
  ['The poster is ____ the whiteboard.','beside','behind','under','over',1,'"Beside" means next to.'],
  ['The cat is hiding ____ the sofa.','under','over','beside','between',1,'"Under" means below.'],
  ['Put your bag ____ the hook.','on','in','beside','among',1,'"On" — the bag hangs on the hook.'],
  ['He arrived ____ five o\'clock.','at','in','on','by',2,'"At" is used with specific times.'],
  ['She was born ____ Monday.','on','at','in','by',2,'"On" is used with days of the week.'],
  ['We go on holidays ____ summer.','in','on','at','by',2,'"In" is used with seasons and months.'],
]
prepQs.forEach(([sent, prep, w1, w2, w3, diff, exp]) => {
  q(P_GR,'grammar',diff,`Choose the correct preposition: "${sent}"`,
    [prep,w1,w2,w3],prep,exp)
})

// Conjunctions
const conjQs = [
  ['I wanted to go out, ____ it was raining.','but','and','so','or',1,'"But" joins two contrasting ideas.'],
  ['You can have cake ____ biscuits.','or','and','but','so',1,'"Or" offers a choice between two things.'],
  ['She was tired ____ she went to bed early.','so','but','and','or',2,'"So" shows a result.'],
  ['I like swimming ____ I don\'t like cold water.','but','and','so','or',1,'"But" shows contrast.'],
  ['He practised every day ____ he improved quickly.','and','but','or','so',1,'"And" joins two related ideas.'],
  ['We can go to the beach ____ it rains.','unless','if','because','although',3,'"Unless" means "except if".'],
  ['She stayed in ____ the weather was bad.','because','unless','although','so',2,'"Because" explains the reason.'],
  ['____ he was tired, he still finished his homework.','Although','Because','So','Unless',3,'"Although" shows contrast — he did it despite being tired.'],
  ['I will come ____ you need me.','if','unless','although','so',2,'"If" introduces a condition.'],
  ['She can read ____ she can write.','and','or','but','although',1,'"And" adds information — she can do both.'],
]
conjQs.forEach(([sent, conj, w1, w2, w3, diff, exp]) => {
  q(P_GR,'grammar',diff,`Choose the correct conjunction: "${sent}"`,
    [conj,w1,w2,w3],conj,exp)
})

// Subject-verb agreement
const svQs = [
  ['The dog ______ in the garden.','plays','play','playing','played',1,'"The dog" is singular, so use "plays" (with an s).'],
  ['The children ______ football every day.','play','plays','playing','played',1,'"The children" is plural, so use "play" (no s).'],
  ['She ______ her homework before dinner.','does','do','doing','done',2,'"She" is singular, so use "does".'],
  ['They ______ to school by bus.','go','goes','going','went',1,'"They" is plural, so use "go".'],
  ['He ______ the fastest in his class.','runs','run','running','ran',1,'"He" is singular — "runs".'],
  ['The birds ______ south in winter.','fly','flies','flying','flew',1,'"The birds" is plural — "fly".'],
  ['Each of the students ______ a pen.','has','have','having','had',3,'"Each" is singular, even though students is plural — so "has".'],
  ['Neither the cat nor the dog ______ happy.','is','are','were','been',4,'When using "neither...nor", the verb agrees with the noun closest to it — "dog" is singular, so "is".'],
]
svQs.forEach(([sent, verb, w1, w2, w3, diff, exp]) => {
  q(P_GR,'grammar',diff,`Choose the correct verb: "${sent}"`,
    [verb,w1,w2,w3],verb,exp)
})

// Sentence types
const sentTypeQs = [
  ['What time does the film start?','question','statement','command','exclamation',1,'This sentence asks something — it ends with a question mark, so it is a question (interrogative).'],
  ['Close the door, please.','command','question','statement','exclamation',2,'This sentence gives an instruction — it is a command (imperative).'],
  ['What a brilliant goal that was!','exclamation','statement','question','command',2,'This sentence expresses strong feeling with an exclamation mark — it is an exclamation.'],
  ['The cat sat on the mat.','statement','question','command','exclamation',1,'This sentence tells us a fact — it is a statement (declarative).'],
  ['Please sit down.','command','question','statement','exclamation',1,'A command gives an instruction or request.'],
  ['How wonderful the sunset is!','exclamation','statement','question','command',2,'An exclamation expresses strong emotion — wonderful surprise or joy.'],
  ['Where did you put my keys?','question','statement','command','exclamation',1,'A question asks for information and ends with a ?.'],
  ['Ireland won the match.','statement','question','command','exclamation',1,'A statement gives information.'],
]
sentTypeQs.forEach(([sent, type, w1, w2, w3, diff, exp]) => {
  q(P_GR,'grammar',diff,`What type of sentence is this? "${sent}"`,
    [type,w1,w2,w3],type,exp)
})

// Articles
const articleQs = [
  ['Give me ____ apple, please.','an','a','the','some',2,'"An" is used before words starting with a vowel sound — apple starts with "a".'],
  ['I saw ____ elephant at the zoo.','an','a','the','some',2,'"An" before a vowel sound — elephant starts with "e".'],
  ['She is ____ honest person.','an','a','the','one',3,'"An" before a vowel SOUND — "honest" starts with a silent h, so the vowel sound "o" comes first.'],
  ['He bought ____ new book.','a','an','the','some',1,'"A" before a consonant sound — new starts with "n".'],
  ['____ River Shannon is the longest river in Ireland.','The','A','An','Some',2,'"The" is used with specific named things.'],
  ['Can I have ____ glass of water?','a','an','the','some',1,'"A" before a consonant sound — glass starts with "g".'],
  ['She plays ____ violin.','the','a','an','some',3,'We use "the" with musical instruments.'],
  ['He is ____ engineer.','an','a','the','some',2,'"An" before a vowel sound — engineer starts with "e".'],
]
articleQs.forEach(([sent, art, w1, w2, w3, diff, exp]) => {
  q(P_GR,'grammar',diff,`Choose the correct article: "${sent}"`,
    [art,w1,w2,w3],art,exp)
})

// Parts of speech identification
const posQs = [
  ['Identify the verb: "The happy children ran quickly to school."','ran','happy','quickly','children',1,'Ran is the verb — it tells us the action (what the children did).'],
  ['Identify the adjective: "The tiny kitten mewed softly."','tiny','mewed','softly','The',1,'Tiny is the adjective — it describes the kitten.'],
  ['Identify the adverb: "She spoke very quietly to the baby."','quietly','spoke','very','baby',2,'Quietly is the adverb — it tells us HOW she spoke. (Very is an adverb too, but quietly is the main one!)'],
  ['Identify the noun: "The brave knight crossed the dark forest."','forest','brave','crossed','dark',1,'Forest is a noun — a person, place or thing. Knight is also a noun!'],
  ['Identify the preposition: "The ball rolled under the table."','under','rolled','ball','table',2,'Under is the preposition — it tells us WHERE the ball went.'],
  ['Identify the conjunction: "I was tired but I kept going."','but','tired','kept','going',1,'But is the conjunction — it joins the two parts of the sentence.'],
  ['Identify the pronoun: "She gave it to them."','She','gave','them','to',2,'She is a pronoun — it replaces a person\'s name.'],
  ['Identify the proper noun: "Ciarán went to school in Limerick."','Limerick','school','went','Ciarán',2,'Limerick is a proper noun — a specific place name. Ciarán is also a proper noun!'],
]
posQs.forEach(([q_, ans, w1, w2, w3, diff, exp]) => {
  q(P_GR,'grammar',diff,q_,[ans,w1,w2,w3],ans,exp)
})

// Comparative and superlative
const compQs = [
  ['big','bigger','biggest',2,'Big → bigger (comparative) → biggest (superlative). Double the g before -er/-est!'],
  ['fast','faster','fastest',1,'Fast → faster → fastest. Regular adjective — just add -er/-est.'],
  ['tall','taller','tallest',1,'Tall → taller → tallest. Regular — add -er/-est.'],
  ['happy','happier','happiest',2,'Happy → happier → happiest. Change the y to i before -er/-est.'],
  ['funny','funnier','funniest',2,'Funny → funnier → funniest. Y changes to i.'],
  ['good','better','best',3,'Good is irregular — better (comparative) and best (superlative).'],
  ['bad','worse','worst',3,'Bad is irregular — worse and worst.'],
  ['far','farther','farthest',4,'Far → farther → farthest (or further/furthest).'],
  ['little','less','least',4,'Little → less → least. Irregular!'],
  ['many','more','most',3,'Many → more → most. Irregular!'],
]
compQs.forEach(([adj, comp, sup, diff, exp]) => {
  q(P_GR,'grammar',diff,`What is the comparative form of "${adj}"?`,
    [comp, adj+'er', adj+'r', sup], comp, exp)
  q(P_GR,'grammar',diff,`What is the superlative form of "${adj}"?`,
    [sup, adj+'est', adj+'st', comp], sup, exp)
})

// ─── PUNCTUATION ─────────────────────────────────────────────────────────────
const P_PU = 'eng-punct'

// Capital letters
const capQs = [
  ['Which sentence uses capital letters correctly?',
    'My friend Aoife lives in Cork.',
    'my friend aoife lives in cork.',
    'My Friend aoife lives in Cork.',
    'my friend Aoife lives in cork.',1,
    'Names of people and places always start with a capital letter.'],
  ['Which sentence uses capital letters correctly?',
    'We visit Grandma every Sunday.',
    'We visit grandma every sunday.',
    'we visit Grandma every Sunday.',
    'We visit grandma every Sunday.',2,
    'Days of the week and names always start with a capital letter.'],
  ['Which sentence uses capital letters correctly?',
    'The River Shannon flows through Limerick.',
    'the river shannon flows through limerick.',
    'The river Shannon flows through Limerick.',
    'The River Shannon flows through limerick.',2,
    'River Shannon is a proper noun — both words are capitalised.'],
  ['Which sentence uses capital letters correctly?',
    'She starts school in September.',
    'She starts school in september.',
    'she starts School in September.',
    'She starts school in September',2,
    'Names of months always start with a capital letter.'],
]
capQs.forEach(([q_,ans,w1,w2,w3,diff,exp]) => {
  q(P_PU,'punctuation',diff,q_,[ans,w1,w2,w3],ans,exp)
})

// Full stops, question marks, exclamation marks
const endPunctQs = [
  ['What punctuation mark goes at the end of a question?','A question mark (?)','A full stop (.)','An exclamation mark (!)','A comma (,)',1,'Questions always end with a question mark (?).'],
  ['What punctuation mark goes at the end of a statement?','A full stop (.)','A question mark (?)','An exclamation mark (!)','A comma (,)',1,'Statements (telling sentences) end with a full stop (.).'],
  ['What punctuation mark goes at the end of an exclamation?','An exclamation mark (!)','A full stop (.)','A question mark (?)','A comma (,)',1,'Exclamations — strong feelings or surprises — end with an exclamation mark (!).'],
  ['Add the correct punctuation: "What is your name __"','?','.',  '!',',',1,'This is a question, so it needs a question mark.'],
  ['Add the correct punctuation: "The dog ate my homework __"','.',  '?','!',',',1,'This is a statement, so it ends with a full stop.'],
  ['Add the correct punctuation: "What a lovely day it is __"','!','.',  '?',',',1,'What a... — this is an exclamation of pleasure!'],
]
endPunctQs.forEach(([q_,ans,w1,w2,w3,diff,exp]) => {
  q(P_PU,'punctuation',diff,q_,[ans,w1,w2,w3],ans,exp)
})

// Commas
const commaQs = [
  ['Which sentence uses a comma correctly?',
    'I bought apples, oranges, bananas and grapes.',
    'I bought apples oranges, bananas, and, grapes.',
    'I bought, apples oranges bananas and grapes.',
    'I, bought apples oranges bananas and grapes.',2,
    'Commas separate items in a list.'],
  ['Which sentence uses a comma correctly?',
    'After the match, we had pizza.',
    'After the match we, had pizza.',
    'After, the match we had pizza.',
    'After the match we had, pizza.',2,
    'A comma is used after an introductory phrase.'],
  ['Which sentence uses a comma correctly?',
    '"Come here, Finn," said the teacher.',
    '"Come here Finn," said the teacher.',
    '"Come here, Finn" said the teacher.',
    '"Come here Finn" said the teacher.',3,
    'When speaking directly to someone, put a comma before their name.'],
  ['Where does the comma go in this list sentence: "I like reading writing and maths"?',
    'I like reading, writing and maths.',
    'I like, reading writing and maths.',
    'I like reading writing, and maths.',
    'I like reading writing and, maths.',2,
    'Commas go between items in a list.'],
  ['Which sentence needs a comma?',
    'When I grow up, I want to be a doctor.',
    'When I grow up I want to be a doctor.',
    'When, I grow up I want to be a doctor.',
    'When I, grow up I want to be a doctor.',2,
    'After a subordinate clause at the start, add a comma.'],
]
commaQs.forEach(([q_,ans,w1,w2,w3,diff,exp]) => {
  q(P_PU,'punctuation',diff,q_,[ans,w1,w2,w3],ans,exp)
})

// Apostrophes
const apostQs = [
  ['What does the apostrophe show in "Aoife\'s book"?','Possession — the book belongs to Aoife','A missing letter','Plural — more than one book','The end of a sentence',2,'The apostrophe + s shows that the book belongs to Aoife — this is a possessive apostrophe.'],
  ['What does the apostrophe show in "don\'t"?','A missing letter (do not)','Possession','Plural','The start of a new word',2,'"Don\'t" = "do not" — the apostrophe shows the missing letter o.'],
  ['Which is correct: "The dogs bone" or "The dog\'s bone"?','The dog\'s bone','The dogs bone','The dogs\' bone','The dog\'es bone',2,'Add apostrophe + s to show the bone belongs to the dog.'],
  ['Which is correct: "I cant go" or "I can\'t go"?','I can\'t go','I cant go','I can\'t go.','I cant\' go',1,'"Can\'t" = "cannot" — apostrophe for the missing letters "no".'],
  ['What is the contraction of "I am"?','I\'m','Im','I\'am','Iam',1,'"I\'m" = "I am" — the apostrophe replaces the letter a.'],
  ['What is the contraction of "they are"?','they\'re','their','there','they\'are',2,'"They\'re" = "they are" — apostrophe replaces the letter a.'],
  ['What is the contraction of "it is"?','it\'s','its','it\'is','its\'',2,'"It\'s" = "it is" — the apostrophe replaces the letter i.'],
  ['What is the contraction of "would not"?','wouldn\'t','wouldnt','woudln\'t','would\'nt',2,'"Wouldn\'t" = "would not" — apostrophe replaces the o in "not".'],
  ['What is the contraction of "she will"?','she\'ll','shell','she\'will','shel\'l',2,'"She\'ll" = "she will" — apostrophe replaces "wi".'],
  ['Which is correct: "The girls coats" (belonging to several girls) or "The girls\' coats"?','The girls\' coats','The girls\'s coats','The girl\'s coats','The girls coats',4,'When plural nouns ending in s show possession, add the apostrophe AFTER the s: girls\'.'],
]
apostQs.forEach(([q_,ans,w1,w2,w3,diff,exp]) => {
  q(P_PU,'punctuation',diff,q_,[ans,w1,w2,w3],ans,exp)
})

// Speech marks
const speechQs = [
  ['Which sentence correctly uses speech marks?',
    '"I love football," said Seán.',
    'I love football, said Seán.',
    '"I love football, said Seán.',
    'I love "football," said Seán.',2,
    'Speech marks (inverted commas) go around the exact words spoken.'],
  ['Where do speech marks go?','Around the exact words spoken','Around the whole sentence','Around the speaker\'s name','After the full stop',1,'Speech marks surround only the words that are actually said out loud.'],
  ['Which is punctuated correctly?',
    '"Put on your coat," said Mam.',
    '"Put on your coat" said Mam.',
    'Put on your coat," said Mam.',
    '"Put on your coat", said Mam.',3,
    'The comma goes inside the closing speech mark.'],
  ['Which is correct?',
    '"Where are you going?" asked Dad.',
    '"Where are you going"? asked Dad.',
    '"Where are you going?" Asked Dad.',
    '"Where are you going" asked Dad?',3,
    'The question mark goes inside the closing speech mark, and asked starts with a lowercase letter.'],
]
speechQs.forEach(([q_,ans,w1,w2,w3,diff,exp]) => {
  q(P_PU,'punctuation',diff,q_,[ans,w1,w2,w3],ans,exp)
})

// ─── VOCABULARY ──────────────────────────────────────────────────────────────
const P_VO = 'eng-vocab'

// Synonyms
const synonymQs = [
  ['happy','joyful','sad','angry','bored',1,'"Joyful" means the same as happy — both describe a positive feeling.'],
  ['big','enormous','tiny','flat','fast',1,'"Enormous" is a synonym for big — it means very large.'],
  ['quick','fast','slow','heavy','quiet',1,'"Fast" means the same as quick.'],
  ['scared','frightened','brave','calm','happy',2,'"Frightened" means the same as scared.'],
  ['funny','hilarious','serious','boring','sad',2,'"Hilarious" means extremely funny — a synonym with extra intensity!'],
  ['sad','miserable','happy','cheerful','excited',1,'"Miserable" means very sad — a synonym for sad.'],
  ['tired','exhausted','energetic','awake','fresh',2,'"Exhausted" means extremely tired.'],
  ['smart','intelligent','foolish','lazy','clumsy',2,'"Intelligent" is a synonym for smart.'],
  ['angry','furious','calm','peaceful','happy',2,'"Furious" means extremely angry.'],
  ['beautiful','stunning','ugly','plain','dull',2,'"Stunning" is a synonym for beautiful.'],
  ['walk','stroll','run','jump','fly',2,'"Stroll" is a gentle synonym for walk.'],
  ['eat','devour','starve','drink','breathe',3,'"Devour" means to eat quickly and greedily.'],
  ['begin','commence','finish','end','stop',4,'"Commence" is a formal synonym for begin.'],
  ['help','assist','hinder','ignore','stop',3,'"Assist" is a synonym for help.'],
  ['use','utilise','ignore','discard','drop',4,'"Utilise" is a formal synonym for use.'],
  ['small','minuscule','huge','enormous','giant',3,'"Minuscule" means extremely small — a synonym with great precision!'],
  ['cold','freezing','boiling','warm','hot',1,'"Freezing" means extremely cold.'],
  ['shout','yell','whisper','murmur','sigh',1,'"Yell" means the same as shout.'],
  ['said','exclaimed','listened','heard','thought',2,'"Exclaimed" is a vivid synonym for said — it suggests speaking with surprise or emotion.'],
  ['went','journeyed','stayed','remained','waited',3,'"Journeyed" is a more descriptive synonym for went.'],
]
synonymQs.forEach(([word, syn, w1, w2, w3, diff, exp]) => {
  q(P_VO,'vocabulary',diff,`Which word is a synonym (similar meaning) for "${word}"?`,
    [syn,w1,w2,w3],syn,exp)
})

// Antonyms
const antonymQs = [
  ['hot','cold','warm','cool','tepid',1,'"Cold" is the opposite of hot.'],
  ['day','night','evening','dusk','dawn',1,'"Night" is the opposite of day.'],
  ['happy','sad','tired','bored','calm',1,'"Sad" is the opposite of happy.'],
  ['beginning','end','middle','centre','halfway',1,'"End" is the opposite of beginning.'],
  ['ancient','modern','old','historic','past',2,'"Modern" is the opposite of ancient.'],
  ['courage','cowardice','bravery','strength','boldness',3,'"Cowardice" is the opposite of courage.'],
  ['success','failure','win','achievement','triumph',2,'"Failure" is the opposite of success.'],
  ['generous','mean','kind','giving','charitable',2,'"Mean" (stingy) is the opposite of generous.'],
  ['expand','shrink','grow','enlarge','stretch',3,'"Shrink" is the opposite of expand.'],
  ['victory','defeat','win','triumph','achievement',2,'"Defeat" is the opposite of victory.'],
  ['presence','absence','attendance','arrival','appearance',4,'"Absence" is the opposite of presence.'],
  ['innocent','guilty','pure','honest','truthful',3,'"Guilty" is the opposite of innocent.'],
]
antonymQs.forEach(([word, ant, w1, w2, w3, diff, exp]) => {
  q(P_VO,'vocabulary',diff,`Which word is an antonym (opposite) of "${word}"?`,
    [ant,w1,w2,w3],ant,exp)
})

// Word meanings in context
const contextQs = [
  ['In the sentence "The ancient ruins stood for thousands of years," what does "ancient" mean?','Very old','Very new','Very tall','Very small',2,'"Ancient" means extremely old — from long ago in history.'],
  ['In the sentence "She was famished after the long walk," what does "famished" mean?','Very hungry','Very tired','Very cold','Very happy',2,'"Famished" means extremely hungry.'],
  ['In the sentence "The tranquil lake reflected the mountains," what does "tranquil" mean?','Calm and peaceful','Wild and stormy','Deep and dark','Wide and flat',3,'"Tranquil" means calm, quiet and peaceful.'],
  ['In the sentence "He was reluctant to eat his vegetables," what does "reluctant" mean?','Unwilling','Excited','Happy','Eager',3,'"Reluctant" means unwilling or hesitant to do something.'],
  ['In the sentence "The path was treacherous in the ice," what does "treacherous" mean?','Dangerous','Beautiful','Long','Narrow',3,'"Treacherous" means very dangerous, especially in a deceptive way.'],
  ['In the sentence "She gazed in astonishment at the magic trick," what does "astonishment" mean?','Great surprise','Great anger','Great sadness','Great boredom',2,'"Astonishment" means great surprise or amazement.'],
  ['In the sentence "The explorer was determined to reach the summit," what does "summit" mean?','The top','The bottom','The middle','The side',2,'"Summit" means the very top of a mountain or hill.'],
  ['In the sentence "His speech was so tedious that people fell asleep," what does "tedious" mean?','Extremely boring','Very exciting','Very funny','Very short',3,'"Tedious" means long, slow and very boring.'],
  ['In the sentence "She was elated when she won the prize," what does "elated" mean?','Extremely happy','Very nervous','Very surprised','Quite tired',3,'"Elated" means overjoyed — feeling on top of the world!'],
  ['In the sentence "The cunning fox tricked the crow," what does "cunning" mean?','Clever and crafty','Strong and powerful','Slow and clumsy','Kind and gentle',2,'"Cunning" means clever in a tricky or sly way.'],
]
contextQs.forEach(([sent, ans, w1, w2, w3, diff, exp]) => {
  q(P_VO,'vocabulary',diff,sent,[ans,w1,w2,w3],ans,exp)
})

// Prefixes
const prefixQs = [
  ['un-','unhappy','What does the prefix "un-" mean?','not or opposite of','again','before','too much',2,'"Un-" means not or opposite — unhappy means not happy.'],
  ['re-','redo','What does the prefix "re-" mean?','again','not','before','after',2,'"Re-" means again — redo means to do again.'],
  ['pre-','preview','What does the prefix "pre-" mean?','before','after','again','not',3,'"Pre-" means before — preview means to view before the main event.'],
  ['mis-','misunderstand','What does the prefix "mis-" mean?','wrongly','again','before','not',3,'"Mis-" means wrongly — misunderstand means to understand wrongly.'],
  ['dis-','disagree','What does the prefix "dis-" mean?','not or opposite of','again','before','too much',2,'"Dis-" means not or the opposite — disagree means not agree.'],
  ['over-','overeat','What does the prefix "over-" mean?','too much','not enough','again','before',3,'"Over-" means too much — overeat means to eat too much.'],
  ['under-','undercooked','What does the prefix "under-" mean?','not enough','too much','again','before',3,'"Under-" means not enough — undercooked means not cooked enough.'],
  ['im-','impossible','What does the prefix "im-" mean?','not (before m/p)','again','before','too much',3,'"Im-" = not, used before words starting with m or p. Impossible = not possible.'],
  ['ir-','irregular','What does the prefix "ir-" mean?','not (before r)','again','before','too much',3,'"Ir-" = not, used before words starting with r. Irregular = not regular.'],
  ['inter-','international','What does the prefix "inter-" mean?','between or among','inside','above','below',4,'"Inter-" means between — international means between nations.'],
]
prefixQs.forEach(([prefix, example, q_, ans, w1, w2, w3, diff, exp]) => {
  q(P_VO,'vocabulary',diff,`${q_} Example: "${example}"`,
    [ans,w1,w2,w3],ans,exp)
})

// Suffixes
const suffixQs = [
  ['Adding "-ful" to "care" makes "careful." What does "-ful" mean?','full of','without','one who','the act of',2,'"-ful" means full of — careful means full of care.'],
  ['Adding "-less" to "hope" makes "hopeless." What does "-less" mean?','without','full of','one who','related to',2,'"-less" means without — hopeless means without hope.'],
  ['Adding "-er" to "teach" makes "teacher." What does "-er" mean here?','one who does it','more','the state of','full of',2,'"-er" can mean "one who does something" — a teacher is one who teaches.'],
  ['Adding "-ness" to "kind" makes "kindness." What does "-ness" mean?','the state or quality of','without','full of','one who',2,'"-ness" turns an adjective into a noun — kindness is the state of being kind.'],
  ['Adding "-tion" to "act" makes "action." What does "-tion" mean?','the act or result of','one who','full of','without',3,'"-tion" creates a noun — action is the result of acting.'],
  ['Adding "-able" to "read" makes "readable." What does "-able" mean?','can be done','without','the state of','one who',3,'"-able" means can be done — readable means can be read.'],
  ['Adding "-ly" to "quick" makes "quickly." What does "-ly" do here?','turns an adjective into an adverb','turns a noun into a verb','turns a verb into a noun','turns an adverb into a noun',2,'"-ly" added to an adjective creates an adverb — quickly tells us HOW.'],
  ['Adding "-ment" to "amaze" makes "amazement." What does "-ment" mean?','the state or result of','one who','full of','without',3,'"-ment" creates a noun — amazement is the state of being amazed.'],
]
suffixQs.forEach(([q_,ans,w1,w2,w3,diff,exp]) => {
  q(P_VO,'vocabulary',diff,q_,[ans,w1,w2,w3],ans,exp)
})

// ─── WRITING ─────────────────────────────────────────────────────────────────
const P_WR = 'eng-write'

// Sentence structure
const sentStructQs = [
  ['What must every sentence have?','A subject and a verb','A noun and an adjective','A verb and an adverb','A comma and a full stop',1,'Every sentence needs a subject (who/what) and a verb (the action or state of being).'],
  ['Which of these is a complete sentence?','The horse galloped across the field.','Across the field.','The horse galloped.','Galloped across.',1,'"The horse galloped across the field" has a subject (the horse) and a verb (galloped).'],
  ['Which of these is NOT a complete sentence?','Running through the park.','She runs through the park.','The park is beautiful.','We run in the park.',1,'"Running through the park" has no subject — who is running?'],
  ['What is a simple sentence?','A sentence with one main clause','A sentence with two clauses joined by "and"','A very short sentence','A sentence with no verbs',2,'A simple sentence has one subject and one verb — just one main clause.'],
  ['What is a compound sentence?','Two main clauses joined by a conjunction','A sentence with a subject and verb','A very long sentence','A sentence with no conjunctions',3,'A compound sentence joins two main clauses with a conjunction like "and", "but" or "so".'],
  ['What makes a good opening sentence for a story?','It grabs the reader\'s attention immediately','It explains everything that happens','It lists all the characters','It tells the ending first',2,'A great opening sentence makes the reader want to know more!'],
  ['What is the purpose of a paragraph?','To group related ideas together','To end a story','To introduce a new character','To start a new sentence',2,'Paragraphs group sentences about the same idea together.'],
  ['What should the opening paragraph of a story do?','Introduce the setting and characters','Solve the problem','End the story','List the events',2,'The opening paragraph sets the scene — it introduces where, when and who.'],
  ['What goes in the middle (build-up) of a story?','The problem or conflict develops','The story ends happily','The characters are introduced','The setting is described',2,'The middle of a story develops the problem or conflict that needs to be solved.'],
  ['What should the closing paragraph of a story do?','Resolve the problem and round off the story','Introduce new characters','Create a new problem','Describe the weather',2,'The ending resolves the conflict and gives the reader a satisfying conclusion.'],
]
sentStructQs.forEach(([q_,ans,w1,w2,w3,diff,exp]) => {
  q(P_WR,'writing',diff,q_,[ans,w1,w2,w3],ans,exp)
})

// Literary techniques
const litTechQs = [
  ['"The wind whispered through the trees." This is an example of:','personification','simile','alliteration','rhyme',2,'"Whispered" is a human action — giving human qualities to the wind is personification.'],
  ['"She was as fast as a cheetah." This is an example of:','simile','metaphor','personification','alliteration',2,'A simile compares two things using "as" or "like" — as fast as a cheetah.'],
  ['"He is a lion on the football pitch." This is an example of:','metaphor','simile','personification','hyperbole',3,'A metaphor says something IS something else (without "like" or "as") — he is a lion.'],
  ['"Peter Piper picked a peck of pickled peppers." This is an example of:','alliteration','simile','metaphor','personification',2,'Alliteration is the repetition of the same starting sound — all the P sounds!'],
  ['"I\'ve told you a million times!" This is an example of:','hyperbole','simile','metaphor','personification',3,'Hyperbole is extreme exaggeration for effect — you haven\'t literally said it a million times!'],
  ['"The thunder grumbled overhead." This is an example of:','personification','simile','alliteration','hyperbole',3,'Thunder can\'t grumble — giving it a human quality is personification.'],
  ['"Her eyes were like two bright stars." This is an example of:','simile','metaphor','alliteration','personification',2,'A simile uses "like" or "as" to compare — eyes like stars.'],
  ['"She sells seashells by the seashore." This is an example of:','alliteration','rhyme','simile','personification',1,'Alliteration: the repeated "s" sound at the start of words.'],
  ['What is onomatopoeia?','A word that sounds like what it means','Comparing two things with "like"','Repeating the first sound of words','Extreme exaggeration',3,'Onomatopoeia: words like "buzz", "crash", "sizzle" that sound like the action.'],
  ['"Buzz," "crash," and "sizzle" are examples of:','onomatopoeia','simile','metaphor','alliteration',2,'These words sound like the actions they describe — that\'s onomatopoeia!'],
  ['What does "setting" mean in a story?','Where and when the story takes place','Who the story is about','What problem occurs','How the story ends',1,'The setting is the place and time of the story.'],
  ['What is the "plot" of a story?','The sequence of events','The characters','The setting','The style of writing',2,'The plot is everything that happens in the story — the sequence of events.'],
  ['What is the "theme" of a story?','The big idea or message','The main character','Where it takes place','How it is written',3,'The theme is the underlying message — for example: friendship, courage, or kindness.'],
  ['What is a "protagonist"?','The main character','The villain','The setting','The narrator',2,'The protagonist is the main character — the hero of the story.'],
  ['What is an "antagonist"?','The character who creates conflict','The main character','The setting','The narrator',3,'The antagonist creates the problem or opposes the protagonist.'],
]
litTechQs.forEach(([q_,ans,w1,w2,w3,diff,exp]) => {
  q(P_WR,'writing',diff,q_,[ans,w1,w2,w3],ans,exp)
})

// Writing types
const writeTypeQs = [
  ['Which type of writing tells a story with characters and events?','Narrative writing','Report writing','Persuasive writing','Procedural writing',1,'Narrative writing tells a story — it has characters, a setting, a problem and a resolution.'],
  ['Which type of writing gives facts and information about a topic?','Report writing','Narrative writing','Persuasive writing','Recount writing',2,'Report writing presents facts and information in an organised way.'],
  ['Which type of writing tries to change the reader\'s opinion?','Persuasive writing','Report writing','Narrative writing','Procedural writing',2,'Persuasive writing aims to convince — it uses arguments and evidence.'],
  ['Which type of writing explains how to do something step by step?','Procedural writing','Narrative writing','Report writing','Persuasive writing',2,'Procedural writing gives instructions — recipes and how-to guides are examples.'],
  ['Which type of writing retells events that actually happened?','Recount writing','Narrative writing','Report writing','Persuasive writing',2,'A recount retells real events in the order they happened — like a diary or news report.'],
  ['What does a persuasive text often use to convince the reader?','Facts, opinions and emotive language','Made-up characters and settings','Step-by-step instructions','A list of events in order',3,'Persuasive texts use evidence, statistics and emotive language to change minds.'],
  ['What is a "diary entry"?','A personal recount written from the writer\'s point of view','A fictional story','A set of instructions','A fact file',2,'A diary entry is a personal account of events — written in first person (I, we).'],
  ['What is a "fact file"?','A short piece of informational writing about one topic','A fictional narrative','A persuasive letter','A story with a moral',2,'A fact file presents key facts about a topic, usually using headings and bullet points.'],
]
writeTypeQs.forEach(([q_,ans,w1,w2,w3,diff,exp]) => {
  q(P_WR,'writing',diff,q_,[ans,w1,w2,w3],ans,exp)
})

// Connectives / sentence starters
const connectiveQs = [
  ['Which connective would you use to add more information?','Furthermore','However','Therefore','Although',3,'"Furthermore" adds more information — it means "in addition to that."'],
  ['Which connective shows contrast?','However','Furthermore','Therefore','As a result',2,'"However" introduces a contrasting point — "but" said in a more formal way.'],
  ['Which connective shows a result or consequence?','Therefore','However','Furthermore','Although',3,'"Therefore" shows a logical result — because of this, that happened.'],
  ['Which connective introduces a time sequence?','Firstly, then, finally','However, although, but','Therefore, as a result','Furthermore, in addition',2,'Time connectives show sequence: firstly, then, next, after that, finally.'],
  ['Which phrase is a good way to open a persuasive argument?','Many people believe that...','Once upon a time...','First, you will need...','On Monday, I woke up and...','Many people believe that..." is a strong opening for a persuasive text.',3,'Persuasive openings often acknowledge different viewpoints before making your argument.'],
]
connectiveQs.forEach(([q_,ans,w1,w2,w3,diff,exp]) => {
  q(P_WR,'writing',diff,q_,[ans,w1,w2,w3],ans,exp)
})

// ─── READING (comprehension skills) ──────────────────────────────────────────
const P_RD = 'eng-read-skill'
const readingSkillQs = [
  ['What does it mean to "infer" something from a text?','Work out something not directly stated using clues','Read every word carefully','Find the main character','Copy words from the text',3,'Inference means using clues in the text to work out something the author didn\'t say directly.'],
  ['What is the "main idea" of a text?','The most important point the author is making','The first sentence','The last paragraph','The title',2,'The main idea is the central message or most important point the whole text is about.'],
  ['What does "summarise" mean?','Retell the key points briefly in your own words','Copy out the whole text','Find all the adjectives','Guess what happens next',2,'To summarise is to pick out the most important points and restate them briefly.'],
  ['What does "predict" mean when reading?','Guess what might happen next, using clues','Find the meaning of a word','Summarise the text','Identify the author\'s technique',2,'Predicting means using clues from the text to make an educated guess about what comes next.'],
  ['What does it mean to "visualise" while reading?','Picture the events in your mind as you read','Sound out every word','Find the main idea','Look up unknown words',2,'Good readers create mental images — they "see" the story playing in their head.'],
  ['What is a "text feature" in non-fiction writing?','Headings, diagrams, bold text, captions','Made-up characters','A plot twist','Rhyme and rhythm',3,'Text features in non-fiction help the reader — headings, captions, bullet points and diagrams.'],
  ['What does "author\'s purpose" mean?','The reason the author wrote the text','The author\'s name','The title of the book','The number of pages',3,'Authors write to entertain, inform or persuade — that\'s their purpose.'],
  ['What is "point of view" in a story?','Who is telling the story','What the story is about','Where the story is set','When the story happens',3,'Point of view (or perspective) is about who narrates the story — first person (I) or third person (he/she/they).'],
  ['In first-person narration, which pronouns does the narrator use?','I, me, my, we','He, she, it, they','You, your','One, someone',2,'First-person narration uses "I" — the narrator is a character inside the story.'],
  ['In third-person narration, which pronouns are used?','He, she, they, it','I, me, my','You, your','We, us',2,'Third-person narration uses "he", "she" or "they" — the narrator is outside the story.'],
  ['What is a "genre" of writing?','A category or type of text','A character in a story','A type of punctuation','A writing technique',3,'Genre is the category of writing — e.g., fantasy, mystery, biography, science fiction.'],
  ['Which of these is a "fiction" text?','A story about a dragon who learns to read','A fact file about dragons','A news report about a festival','A set of instructions',1,'Fiction is made-up — stories, novels and poems are fiction.'],
  ['Which of these is a "non-fiction" text?','A fact file about whales','A story about a talking whale','A poem about the sea','A legend about sea monsters',1,'Non-fiction is based on facts — encyclopaedias, biographies and fact files are non-fiction.'],
  ['What is a "caption"?','A short description under a picture','The title of a book','The first sentence of a paragraph','A type of punctuation',2,'Captions explain or describe pictures or diagrams in a non-fiction text.'],
  ['What does "blurb" mean?','The short description on the back cover of a book','The title of the book','The first chapter','The author\'s name',2,'The blurb is on the back of a book — it tells you what the book is about to help you decide whether to read it.'],
  ['What is the purpose of a "contents page" in a book?','To show what chapters are in the book and where they start','To summarise the whole book','To list all the characters','To explain the author\'s purpose',2,'A contents page lists chapters and their page numbers so you can find sections quickly.'],
  ['What is an "index" at the back of a non-fiction book?','An alphabetical list of topics and their page numbers','A list of chapters','A summary of the book','A list of pictures',3,'An index helps you find specific information — it\'s in alphabetical order at the back.'],
  ['What does "glossary" mean in a non-fiction book?','A list of key words and their meanings','A list of chapters','A summary of the book','A list of pictures',3,'A glossary defines important words used in the book — usually at the back.'],
]
readingSkillQs.forEach(([q_,ans,w1,w2,w3,diff,exp]) => {
  q(P_RD,'reading',diff,q_,[ans,w1,w2,w3],ans,exp)
})

// ─── SAVE ────────────────────────────────────────────────────────────────────
const all = [...existing, ...newQs]
writeFileSync(FILE, JSON.stringify(all, null, 2))

const finalTopics = {}
all.forEach(q => { finalTopics[q.topic] = (finalTopics[q.topic]||0)+1 })
console.log('\n✅ English questions updated:')
Object.entries(finalTopics).sort((a,b)=>a[0].localeCompare(b[0])).forEach(([t,n])=>console.log(`  ${t}: ${n}`))
console.log(`\nTotal: ${all.length} (was ${existing.length}, added ${newQs.length})`)
