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
  const parts = q.id.split('-'), num = parseInt(parts[parts.length - 1])
  const prefix = parts.slice(0, -1).join('-')
  if (!maxIds[prefix] || num > maxIds[prefix]) maxIds[prefix] = num
})
function nextId(prefix) {
  if (!maxIds[prefix]) maxIds[prefix] = 0
  maxIds[prefix]++
  return `${prefix}-${String(maxIds[prefix]).padStart(3, '0')}`
}
function rot4(arr, ans) {
  const idx = arr.indexOf(ans)
  if (idx < 0) { const a = [...arr]; if (a.length > 3) a.splice(3); a.unshift(ans); return a.slice(0,4) }
  const pos = (ans.charCodeAt ? ans.charCodeAt(0) : 0) % 4
  const rotated = [...arr.slice(pos), ...arr.slice(0, pos)]
  return rotated.slice(0, 4)
}
function addQ(id, subject, topic, difficulty, question, options, answer, explanation) {
  const key = question.trim().toLowerCase()
  if (seenQ.has(key)) return
  seenQ.add(key)
  if (new Set(options).size !== 4) { console.warn('Skipping (not 4 unique opts):', question); return }
  if (!options.includes(answer)) { console.warn('Skipping (answer not in options):', question); return }
  newQs.push({ id, subject, topic, difficulty, type: 'multiple-choice', question, options, answer, explanation })
}
function q(prefix, topic, diff, question, options, answer, explanation) {
  addQ(nextId(prefix), 'english', topic, diff, question, rot4(options, answer), answer, explanation)
}

// ============================================================
// SPELLING (~200 questions)
// ============================================================

// Homophones
q('eng-spell','spelling',2,"Which spelling means 'to put words on paper'?",['write','right','rite','wright'],'write','Write means to put words on paper. Right means correct.')
q('eng-spell','spelling',2,"Which spelling means 'the correct answer'?",['right','write','rite','wright'],'right','Right means correct. Write means to put words on paper.')
q('eng-spell','spelling',2,"Which spelling means 'the large body of salt water'?",['sea','see','si','cee'],'sea','The sea is the large body of salt water. See means to look with your eyes.')
q('eng-spell','spelling',2,"Which spelling means 'to look with your eyes'?",['see','sea','si','cee'],'see','See means to look with your eyes. Sea is the large body of salt water.')
q('eng-spell','spelling',2,"Which spelling means 'in this place'?",['here','hear','heir','hare'],'here','Here means in this place. Hear means to listen.')
q('eng-spell','spelling',2,"Which spelling means 'to listen'?",['hear','here','heir','hare'],'hear','Hear means to listen. Here means in this place.')
q('eng-spell','spelling',2,"Which spelling means 'the number 2'?",['two','to','too','tow'],'two','Two is the number 2. To means moving toward. Too means also.')
q('eng-spell','spelling',2,"Which spelling means 'also'?",['too','to','two','tow'],'too','Too means also. To means moving toward. Two is the number.')
q('eng-spell','spelling',2,"Which spelling means 'moving toward'?",['to','two','too','tow'],'to','To means moving toward something. Two is the number. Too means also.')
q('eng-spell','spelling',2,"Which spelling means 'to have knowledge of'?",['know','no','now','nor'],'know','Know means to have knowledge of something. No means not yes.')
q('eng-spell','spelling',2,"Which spelling means 'not yes'?",['no','know','now','nor'],'no','No means not yes. Know means to have knowledge of something.')
q('eng-spell','spelling',2,"Which spelling means 'recently made'?",['new','knew','gnu','nu'],'new','New means recently made. Knew is the past tense of know.')
q('eng-spell','spelling',2,"Which spelling means 'was aware of in the past'?",['knew','new','gnu','nu'],'knew','Knew is the past tense of know. New means recently made.')
q('eng-spell','spelling',2,"Which spelling means 'food from animals'?",['meat','meet','mete','mead'],'meat','Meat is food from animals. Meet means to come together.')
q('eng-spell','spelling',2,"Which spelling means 'to come together'?",['meet','meat','mete','mead'],'meet','Meet means to come together. Meat is food from animals.')
q('eng-spell','spelling',2,"Which spelling means 'seven days'?",['week','weak','wick','weke'],'week','A week is seven days. Weak means not strong.')
q('eng-spell','spelling',2,"Which spelling means 'not strong'?",['weak','week','wick','weke'],'weak','Weak means not strong. A week is seven days.')
q('eng-spell','spelling',2,"Which spelling means 'a wild animal with antlers'?",['deer','dear','dare','dere'],'deer','A deer is a wild animal with antlers. Dear means much loved.')
q('eng-spell','spelling',2,"Which spelling means 'much loved'?",['dear','deer','dare','dere'],'dear','Dear means much loved. A deer is a wild animal with antlers.')
q('eng-spell','spelling',2,"Which spelling means 'a large wild animal'?",['bear','bare','beer','bore'],'bear','A bear is a large wild animal. Bare means with nothing covering it.')
q('eng-spell','spelling',2,"Which spelling means 'with nothing covering it'?",['bare','bear','beer','bore'],'bare','Bare means with nothing covering it. A bear is a large wild animal.')
q('eng-spell','spelling',2,"Which spelling means 'two matching things'?",['pair','pear','pare','pier'],'pair','A pair is two matching things. A pear is a green fruit.')
q('eng-spell','spelling',2,"Which spelling means 'a green fruit'?",['pear','pair','pare','pier'],'pear','A pear is a green fruit. A pair is two matching things.')
q('eng-spell','spelling',2,"Which spelling means 'a part of something'?",['piece','peace','peas','peice'],'piece','A piece is a part of something. Peace means quiet and calm.')
q('eng-spell','spelling',2,"Which spelling means 'quiet and calm'?",['peace','piece','peas','peice'],'peace','Peace means quiet and calm. A piece is a part of something.')
q('eng-spell','spelling',2,"Which spelling means 'the star that gives us light'?",['sun','son','sin','sen'],'sun','The sun is the star that gives us light. Son means a male child.')
q('eng-spell','spelling',2,"Which spelling means 'a male child'?",['son','sun','sin','sen'],'son','A son is a male child. The sun is the star that gives us light.')
q('eng-spell','spelling',2,"Which spelling means 'a plant with petals'?",['flower','flour','floor','flore'],'flower','A flower is a plant with petals. Flour is powder used for baking.')
q('eng-spell','spelling',2,"Which spelling means 'powder used for baking'?",['flour','flower','floor','flore'],'flour','Flour is powder used for baking. A flower is a plant with petals.')
q('eng-spell','spelling',2,"Which spelling means 'to take something that is not yours'?",['steal','steel','stile','stele'],'steal','Steal means to take something that is not yours. Steel is a strong metal.')
q('eng-spell','spelling',2,"Which spelling means 'a strong metal'?",['steel','steal','stile','stele'],'steel','Steel is a strong metal. Steal means to take something that is not yours.')
q('eng-spell','spelling',2,"Which spelling means 'an aircraft'?",['plane','plain','plein','plaine'],'plane','A plane is an aircraft. Plain means simple and not fancy.')
q('eng-spell','spelling',2,"Which spelling means 'simple and not fancy'?",['plain','plane','plein','plaine'],'plain','Plain means simple and not fancy. A plane is an aircraft.')
q('eng-spell','spelling',2,"Which spelling means 'a story'?",['tale','tail','tael','tale'],'tale','A tale is a story. A tail is the back part of an animal.')
// tale appears twice in array above - fix:
q('eng-spell','spelling',2,"Which spelling means 'the back part of an animal'?",['tail','tale','tael','taile'],'tail','A tail is the back part of an animal. A tale is a story.')
q('eng-spell','spelling',2,"Which spelling means 'the dark time after sunset'?",['night','knight','nite','nigt'],'night','Night is the dark time after sunset. A knight is a medieval warrior on a horse.')
q('eng-spell','spelling',2,"Which spelling means 'a medieval warrior on a horse'?",['knight','night','nite','nigt'],'knight','A knight is a medieval warrior on a horse. Night is the dark time after sunset.')
q('eng-spell','spelling',2,"Which spelling means 'an animal like a large rabbit'?",['hare','hair','here','haire'],'hare','A hare is an animal like a large rabbit. Hair is what grows on your head.')
q('eng-spell','spelling',2,"Which spelling means 'what grows on your head'?",['hair','hare','here','haire'],'hair','Hair is what grows on your head. A hare is an animal like a large rabbit.')

// Correct spelling questions
q('eng-spell','spelling',1,"Which is the correct spelling of the first day of the working week?",['Monday','Munday','Mondey','Mondai'],'Monday','Monday is spelled M-o-n-d-a-y. It starts with a capital letter as it is a day of the week.')
q('eng-spell','spelling',1,"Which is the correct spelling of the day after Monday?",['Tuesday','Tuseday','Twosday','Tuesady'],'Tuesday','Tuesday is spelled T-u-e-s-d-a-y. Remember: Tues-day!')
q('eng-spell','spelling',1,"Which is the correct spelling of the day between Wednesday and Friday?",['Thursday','Thurdsay','Thrusday','Thurzday'],'Thursday','Thursday is spelled T-h-u-r-s-d-a-y. Remember: Thurs-day!')
q('eng-spell','spelling',1,"Which is the correct spelling of the last day before Sunday?",['Saturday','Saterday','Saturady','Satturday'],'Saturday','Saturday is spelled S-a-t-u-r-d-a-y. Remember: Satur-day!')
q('eng-spell','spelling',1,"Which is the correct spelling of the first month of the year?",['January','Janury','Januery','Januray'],'January','January is spelled J-a-n-u-a-r-y. It starts with a capital letter.')
q('eng-spell','spelling',1,"Which is the correct spelling of the third month of the year?",['March','Marche','Murch','Martch'],'March','March is spelled M-a-r-c-h. It is the third month of the year.')
q('eng-spell','spelling',1,"Which is the correct spelling of the fourth month of the year?",['April','Aprel','Appril','Aprile'],'April','April is spelled A-p-r-i-l. It is the fourth month of the year.')
q('eng-spell','spelling',1,"Which is the correct spelling of the eighth month of the year?",['August','Augost','Agust','Augast'],'August','August is spelled A-u-g-u-s-t. It is the eighth month of the year.')
q('eng-spell','spelling',1,"Which is the correct spelling of the tenth month of the year?",['October','Octobur','Ocktober','Octobor'],'October','October is spelled O-c-t-o-b-e-r. Remember: Oct-o-ber!')
q('eng-spell','spelling',1,"Which is the correct spelling of the eleventh month of the year?",['November','Novimber','Novembar','Novembur'],'November','November is spelled N-o-v-e-m-b-e-r. Remember: Novem-ber!')
q('eng-spell','spelling',1,"Which is the correct spelling of the last month of the year?",['December','Decembur','Desember','Decembar'],'December','December is spelled D-e-c-e-m-b-e-r. Remember: Decem-ber!')
q('eng-spell','spelling',2,"Which is the correct spelling of your mother's mother?",['grandmother','grandmather','grandmothar','grandmoter'],'grandmother','Grandmother is spelled g-r-a-n-d-m-o-t-h-e-r.')
q('eng-spell','spelling',2,"Which is the correct spelling of your father's father?",['grandfather','grandfathar','grandfother','grandfahter'],'grandfather','Grandfather is spelled g-r-a-n-d-f-a-t-h-e-r.')
q('eng-spell','spelling',2,"Which is the correct spelling of a female child?",['daughter','daugter','doughter','dauther'],'daughter','Daughter is spelled d-a-u-g-h-t-e-r. Remember the silent gh!')
q('eng-spell','spelling',2,"Which is the correct spelling meaning your brother's son?",['nephew','nevew','nephue','nephu'],'nephew','Nephew is spelled n-e-p-h-e-w. Remember the silent ph!')
q('eng-spell','spelling',2,"Which is the correct spelling meaning your brother's daughter?",['niece','neice','niese','nease'],'niece','Niece is spelled n-i-e-c-e. Remember: i before e except after c!')
q('eng-spell','spelling',1,"Which is the correct spelling of the past tense of jump?",['jumped','jumpped','jumed','jumpd'],'jumped','Jumped is spelled j-u-m-p-e-d. Just add -ed to jump.')
q('eng-spell','spelling',2,"Which is the correct spelling of the past tense of laugh?",['laughed','laffed','laugfed','lawfed'],'laughed','Laughed is spelled l-a-u-g-h-e-d. Remember the silent gh in laugh!')
q('eng-spell','spelling',2,"Which is the correct spelling meaning in fact or in truth?",['actually','actualy','actuelly','actally'],'actually','Actually is spelled a-c-t-u-a-l-l-y. Remember the double l!')
q('eng-spell','spelling',2,"Which is the correct spelling meaning very likely?",['probably','probaly','probbably','proberbly'],'probably','Probably is spelled p-r-o-b-a-b-l-y. Remember: prob-ab-ly!')
q('eng-spell','spelling',3,"Which is the correct spelling meaning more than usual or particularly?",['especially','especialy','espesially','esspecially'],'especially','Especially is spelled e-s-p-e-c-i-a-l-l-y. Remember the double l!')
q('eng-spell','spelling',3,"Which is the correct spelling meaning certainly or without doubt?",['definitely','definately','definetly','definitly'],'definitely','Definitely is spelled d-e-f-i-n-i-t-e-l-y. Remember: defin-ite-ly!')
q('eng-spell','spelling',3,"Which is the correct spelling meaning easy to sit or relax in?",['comfortable','confortable','comfortible','comfurtable'],'comfortable','Comfortable is spelled c-o-m-f-o-r-t-a-b-l-e.')
q('eng-spell','spelling',2,"Which is the correct spelling meaning holding your attention?",['interesting','intresting','interesing','interresting'],'interesting','Interesting is spelled i-n-t-e-r-e-s-t-i-n-g.')
q('eng-spell','spelling',3,"Which is the correct spelling meaning talking together?",['conversation','converation','converstation','conversasion'],'conversation','Conversation is spelled c-o-n-v-e-r-s-a-t-i-o-n.')
q('eng-spell','spelling',2,"Which is the correct spelling meaning facts or knowledge?",['information','infomation','informasion','informaton'],'information','Information is spelled i-n-f-o-r-m-a-t-i-o-n.')
q('eng-spell','spelling',3,"Which is the correct spelling meaning the natural world around us?",['environment','enviroment','enviorment','envirnment'],'environment','Environment is spelled e-n-v-i-r-o-n-m-e-n-t. Remember: environ-ment!')
q('eng-spell','spelling',2,"Which is the correct spelling meaning something you like best?",['favourite','favorit','favorrite','favrite'],'favourite','Favourite is spelled f-a-v-o-u-r-i-t-e in Irish/British English.')
q('eng-spell','spelling',2,"Which is the correct spelling meaning an exciting journey?",['adventure','adventur','adventture','advenure'],'adventure','Adventure is spelled a-d-v-e-n-t-u-r-e.')
q('eng-spell','spelling',2,"Which is the correct spelling meaning a person in a story?",['character','charater','charactor','charcter'],'character','Character is spelled c-h-a-r-a-c-t-e-r.')
q('eng-spell','spelling',2,"Which is the correct spelling meaning very good?",['excellent','excelent','excellant','exellent'],'excellent','Excellent is spelled e-x-c-e-l-l-e-n-t. Remember the double l!')
q('eng-spell','spelling',2,"Which is the correct spelling meaning of great significance?",['important','importent','importint','impotant'],'important','Important is spelled i-m-p-o-r-t-a-n-t.')
q('eng-spell','spelling',2,"Which is the correct spelling meaning a system of communication?",['language','languaje','languge','lannguage'],'language','Language is spelled l-a-n-g-u-a-g-e.')
q('eng-spell','spelling',2,"Which is the correct spelling meaning found in nature?",['natural','naturel','natrual','naturall'],'natural','Natural is spelled n-a-t-u-r-a-l.')
q('eng-spell','spelling',2,"Which is the correct spelling meaning having great strength or force?",['powerful','powerfull','powerfil','powerfel'],'powerful','Powerful is spelled p-o-w-e-r-f-u-l. Just one l at the end!')
q('eng-spell','spelling',1,"Which is the correct spelling meaning a sentence that asks something?",['question','qestion','queston','questoin'],'question','Question is spelled q-u-e-s-t-i-o-n.')
q('eng-spell','spelling',2,"Which is the correct spelling meaning happening often or as a usual pattern?",['regular','reguler','reglar','regualar'],'regular','Regular is spelled r-e-g-u-l-a-r.')
q('eng-spell','spelling',2,"Which is the correct spelling meaning almost the same?",['similar','simlar','simmlar','simillar'],'similar','Similar is spelled s-i-m-i-l-a-r.')
q('eng-spell','spelling',2,"Which is the correct spelling meaning different from the ordinary?",['special','speceal','spesial','specil'],'special','Special is spelled s-p-e-c-i-a-l.')
q('eng-spell','spelling',2,"Which is the correct spelling meaning as a group or at the same time?",['together','togather','togeather','togither'],'together','Together is spelled t-o-g-e-t-h-e-r.')
q('eng-spell','spelling',2,"Which is the correct spelling meaning most of the time?",['usually','usully','usualy','ussually'],'usually','Usually is spelled u-s-u-a-l-l-y. Remember the double l!')
q('eng-spell','spelling',2,"Which is the correct spelling meaning very good or causing wonder?",['wonderful','wonderfull','wonderfel','wondirful'],'wonderful','Wonderful is spelled w-o-n-d-e-r-f-u-l. Just one l at the end!')
q('eng-spell','spelling',2,"Which is the correct spelling meaning the day before today?",['yesterday','yesturday','yestarday','yesterdy'],'yesterday','Yesterday is spelled y-e-s-t-e-r-d-a-y.')
q('eng-spell','spelling',2,"Which is the correct past tense of 'stop' (doubling the last letter)?",['stopped','stoped','stoppped','stopted'],'stopped','Stopped doubles the p before adding -ed: stop → stopped.')
q('eng-spell','spelling',2,"Which is the correct past tense of 'drop' (doubling the last letter)?",['dropped','droped','droppped','dropt'],'dropped','Dropped doubles the p before adding -ed: drop → dropped.')
q('eng-spell','spelling',2,"Which is the correct past tense of 'plan' (doubling the last letter)?",['planned','planed','plannd','plannned'],'planned','Planned doubles the n before adding -ed: plan → planned.')
q('eng-spell','spelling',2,"Which is the correct past tense of 'clap' (doubling the last letter)?",['clapped','claped','clappped','clapet'],'clapped','Clapped doubles the p before adding -ed: clap → clapped.')
q('eng-spell','spelling',2,"Which is the correct past tense of 'hug' (doubling the last letter)?",['hugged','huged','huggged','hugd'],'hugged','Hugged doubles the g before adding -ed: hug → hugged.')
q('eng-spell','spelling',2,"Which is the correct past tense of 'dance' (drop the e then add -ed)?",['danced','dancced','dansd','dansed'],'danced','Danced drops the e then adds -ed: danc-ed.')
q('eng-spell','spelling',2,"Which is the correct past tense of 'smile' (drop the e then add -ed)?",['smiled','smilled','smiiled','smieled'],'smiled','Smiled drops the e then adds -ed: smil-ed.')
q('eng-spell','spelling',2,"Which is the correct past tense of 'close' (drop the e then add -ed)?",['closed','clossed','cloosed','closd'],'closed','Closed drops the e then adds -ed: clos-ed.')
q('eng-spell','spelling',2,"Which is the correct past tense of 'change' (drop the e then add -ed)?",['changed','changd','changeed','chaned'],'changed','Changed drops the e then adds -ed: chang-ed.')
q('eng-spell','spelling',3,"Which is the correct spelling meaning right away or without delay?",['immediately','immedietly','immediatly','immediatley'],'immediately','Immediately is spelled i-m-m-e-d-i-a-t-e-l-y.')
q('eng-spell','spelling',3,"Which is the correct spelling meaning in a specific or special way?",['particularly','particulary','particularely','particulerly'],'particularly','Particularly is spelled p-a-r-t-i-c-u-l-a-r-l-y.')
q('eng-spell','spelling',3,"Which is the correct spelling meaning roughly or nearly?",['approximately','aproximately','approximatley','approximetly'],'approximately','Approximately is spelled a-p-p-r-o-x-i-m-a-t-e-l-y.')
q('eng-spell','spelling',3,"Which is the correct spelling meaning sadly or unluckily?",['unfortunately','unfortunatley','unfortunatly','unfortuanately'],'unfortunately','Unfortunately is spelled u-n-f-o-r-t-u-n-a-t-e-l-y.')
q('eng-spell','spelling',3,"Which is the correct spelling meaning not controlled by others?",['independent','independant','independint','indeppendent'],'independent','Independent is spelled i-n-d-e-p-e-n-d-e-n-t.')
q('eng-spell','spelling',2,"Which is the correct spelling meaning to watch carefully?",['observe','obsurve','obzerve','obsserve'],'observe','Observe is spelled o-b-s-e-r-v-e.')
q('eng-spell','spelling',2,"Which is the correct spelling meaning to find something for the first time?",['discover','discovar','discuver','disccover'],'discover','Discover is spelled d-i-s-c-o-v-e-r.')
q('eng-spell','spelling',1,"Which is the correct spelling meaning a time of rest away from school?",['holiday','holliday','holyday','holidey'],'holiday','Holiday is spelled h-o-l-i-d-a-y.')
q('eng-spell','spelling',2,"Which is the correct spelling meaning the substance something is made of?",['material','matterial','materiel','matrial'],'material','Material is spelled m-a-t-e-r-i-a-l.')
q('eng-spell','spelling',2,"Which is the correct spelling of the subject that studies the natural world?",['science','sciance','scince','sience'],'science','Science is spelled s-c-i-e-n-c-e.')

// ============================================================
// VOCABULARY (~150 questions)
// ============================================================

// Synonyms
q('eng-vocab','vocabulary',2,"What is a synonym for 'happy'?",['joyful','angry','tired','cold'],'joyful','Joyful means the same as happy — both mean feeling great pleasure.')
q('eng-vocab','vocabulary',2,"What is a synonym for 'sad'?",['miserable','happy','excited','brave'],'miserable','Miserable means very sad or unhappy.')
q('eng-vocab','vocabulary',2,"What is a synonym for 'big'?",['enormous','tiny','quiet','soft'],'enormous','Enormous means the same as very big or huge.')
q('eng-vocab','vocabulary',2,"What is a synonym for 'fast'?",['swift','slow','heavy','dark'],'swift','Swift means moving very quickly — it is a synonym for fast.')
q('eng-vocab','vocabulary',2,"What is a synonym for 'brave'?",['courageous','cowardly','lazy','noisy'],'courageous','Courageous means very brave and not afraid.')
q('eng-vocab','vocabulary',2,"What is a synonym for 'smart'?",['clever','foolish','clumsy','weak'],'clever','Clever means the same as smart — both mean quick to understand.')
q('eng-vocab','vocabulary',2,"What is a synonym for 'tired'?",['exhausted','energetic','happy','loud'],'exhausted','Exhausted means extremely tired — it is a stronger synonym.')
q('eng-vocab','vocabulary',2,"What is a synonym for 'angry'?",['furious','calm','joyful','peaceful'],'furious','Furious means very angry — it is a stronger synonym for angry.')
q('eng-vocab','vocabulary',2,"What is a synonym for 'cold'?",['freezing','warm','hot','bright'],'freezing','Freezing means extremely cold — it is a stronger synonym.')
q('eng-vocab','vocabulary',2,"What is a synonym for 'hot'?",['boiling','cold','wet','loud'],'boiling','Boiling means extremely hot — it is a stronger synonym.')
q('eng-vocab','vocabulary',2,"What is a synonym for 'little'?",['tiny','massive','heavy','rough'],'tiny','Tiny means very little or very small.')
q('eng-vocab','vocabulary',2,"What is a synonym for 'funny'?",['hilarious','serious','sad','boring'],'hilarious','Hilarious means very funny — it is a stronger synonym.')
q('eng-vocab','vocabulary',2,"What is a synonym for 'pretty'?",['beautiful','ugly','boring','plain'],'beautiful','Beautiful means the same as pretty — pleasing to look at.')
q('eng-vocab','vocabulary',2,"What is a synonym for 'dirty'?",['filthy','clean','tidy','fresh'],'filthy','Filthy means very dirty — it is a stronger synonym.')
q('eng-vocab','vocabulary',2,"What is a synonym for 'quiet'?",['silent','noisy','loud','busy'],'silent','Silent means completely quiet — it is a stronger synonym.')
q('eng-vocab','vocabulary',2,"What is a synonym for 'scared'?",['terrified','brave','calm','happy'],'terrified','Terrified means extremely scared — it is a stronger synonym.')
q('eng-vocab','vocabulary',2,"What is a synonym for 'strange'?",['peculiar','normal','ordinary','usual'],'peculiar','Peculiar means strange or unusual.')
q('eng-vocab','vocabulary',2,"What is a synonym for 'begin'?",['commence','finish','end','stop'],'commence','Commence means to begin or start.')
q('eng-vocab','vocabulary',2,"What is a synonym for 'end'?",['conclude','start','begin','open'],'conclude','Conclude means to bring something to an end.')
q('eng-vocab','vocabulary',2,"What is a synonym for 'fix'?",['repair','break','destroy','ruin'],'repair','Repair means to fix something that is broken.')

// Antonyms
q('eng-vocab','vocabulary',2,"What is the OPPOSITE of 'brave'?",['cowardly','courageous','bold','daring'],'cowardly','The opposite of brave is cowardly — showing fear instead of courage.')
q('eng-vocab','vocabulary',2,"What is the OPPOSITE of 'hot'?",['cold','warm','cool','chilly'],'cold','Cold is the opposite of hot.')
q('eng-vocab','vocabulary',2,"What is the OPPOSITE of 'light'?",['dark','bright','sunny','clear'],'dark','Dark is the opposite of light.')
q('eng-vocab','vocabulary',2,"What is the OPPOSITE of 'ancient'?",['modern','old','historical','past'],'modern','Modern means new or up to date — the opposite of ancient.')
q('eng-vocab','vocabulary',2,"What is the OPPOSITE of 'gigantic'?",['tiny','large','huge','enormous'],'tiny','Tiny is the opposite of gigantic.')
q('eng-vocab','vocabulary',2,"What is the OPPOSITE of 'graceful'?",['clumsy','elegant','nimble','agile'],'clumsy','Clumsy means awkward — the opposite of graceful.')
q('eng-vocab','vocabulary',2,"What is the OPPOSITE of 'gentle'?",['rough','soft','kind','tender'],'rough','Rough is the opposite of gentle.')
q('eng-vocab','vocabulary',2,"What is the OPPOSITE of 'shallow'?",['deep','flat','wide','narrow'],'deep','Deep is the opposite of shallow.')
q('eng-vocab','vocabulary',2,"What is the OPPOSITE of 'victory'?",['defeat','win','triumph','success'],'defeat','Defeat is the opposite of victory.')
q('eng-vocab','vocabulary',2,"What is the OPPOSITE of 'generous'?",['selfish','kind','giving','charitable'],'selfish','Selfish is the opposite of generous.')
q('eng-vocab','vocabulary',2,"What is the OPPOSITE of 'dangerous'?",['safe','risky','harmful','perilous'],'safe','Safe is the opposite of dangerous.')
q('eng-vocab','vocabulary',2,"What is the OPPOSITE of 'wild'?",['tame','fierce','free','natural'],'tame','Tame is the opposite of wild — describing animals that are not fierce.')
q('eng-vocab','vocabulary',2,"What is the OPPOSITE of 'absent'?",['present','missing','away','gone'],'present','Present means here — the opposite of absent.')
q('eng-vocab','vocabulary',2,"What is the OPPOSITE of 'expand'?",['shrink','grow','increase','enlarge'],'shrink','Shrink means to get smaller — the opposite of expand.')
q('eng-vocab','vocabulary',2,"What is the OPPOSITE of 'include'?",['exclude','add','contain','hold'],'exclude','Exclude means to leave out — the opposite of include.')

// Words in context
q('eng-vocab','vocabulary',2,"In 'The ancient castle stood on a hill', what does 'ancient' mean?",['very old','very tall','very new','very dark'],'very old','Ancient means very old — the castle has been there for a very long time.')
q('eng-vocab','vocabulary',2,"In 'After the race, she was exhausted', what does 'exhausted' mean?",['very tired','very happy','very fast','very strong'],'very tired','Exhausted means very tired, especially after great effort.')
q('eng-vocab','vocabulary',3,"In 'They had a magnificent view from the top', what does 'magnificent' mean?",['wonderful and impressive','small and dull','foggy and grey','distant and blurry'],'wonderful and impressive','Magnificent means wonderful and impressive — extremely beautiful or grand.')
q('eng-vocab','vocabulary',3,"In 'The timid mouse hid behind the box', what does 'timid' mean?",['shy and easily frightened','large and brave','loud and playful','fast and clever'],'shy and easily frightened','Timid means shy and easily frightened.')
q('eng-vocab','vocabulary',3,"In 'The gleaming trophy sat on the shelf', what does 'gleaming' mean?",['shining brightly','very heavy','dusty and old','cracked and broken'],'shining brightly','Gleaming means shining brightly with reflected light.')
q('eng-vocab','vocabulary',3,"In 'There was a peculiar smell in the kitchen', what does 'peculiar' mean?",['strange or unusual','very pleasant','very familiar','very faint'],'strange or unusual','Peculiar means strange or unusual.')
q('eng-vocab','vocabulary',3,"In 'The frail old lady walked slowly', what does 'frail' mean?",['weak and delicate','strong and tall','loud and cheerful','young and energetic'],'weak and delicate','Frail means weak and delicate in body.')
q('eng-vocab','vocabulary',3,"In 'The cautious driver checked both ways', what does 'cautious' mean?",['very careful','very fast','very tired','very late'],'very careful','Cautious means very careful and avoiding danger.')
q('eng-vocab','vocabulary',3,"In 'We sat beside the tranquil lake', what does 'tranquil' mean?",['peaceful and calm','loud and rough','deep and cold','large and busy'],'peaceful and calm','Tranquil means peaceful and calm, free from disturbance.')

// Prefixes
q('eng-vocab','vocabulary',2,"What does 'sub-' mean in 'submarine'?",['under','over','before','after'],'under','Sub- means under. A submarine travels under the water.')
q('eng-vocab','vocabulary',2,"What does 'trans-' mean in 'transport'?",['across','under','against','without'],'across','Trans- means across. Transport carries things from one place across to another.')
q('eng-vocab','vocabulary',2,"What does 'uni-' mean in 'unicycle'?",['one','two','three','many'],'one','Uni- means one. A unicycle has only one wheel.')
q('eng-vocab','vocabulary',2,"What does 'bi-' mean in 'bicycle'?",['two','one','three','four'],'two','Bi- means two. A bicycle has two wheels.')
q('eng-vocab','vocabulary',2,"What does 'tri-' mean in 'triangle'?",['three','four','two','five'],'three','Tri- means three. A triangle has three sides.')
q('eng-vocab','vocabulary',2,"What does 'pre-' mean in 'preview'?",['before','after','again','not'],'before','Pre- means before. A preview lets you see something before others do.')
q('eng-vocab','vocabulary',2,"What does 'anti-' mean in 'antiseptic'?",['against','with','before','under'],'against','Anti- means against. Antiseptic works against germs.')
q('eng-vocab','vocabulary',2,"What does 'auto-' mean in 'automatic'?",['self','other','big','fast'],'self','Auto- means self. Automatic means it works by itself.')
q('eng-vocab','vocabulary',2,"What does 'micro-' mean in 'microscope'?",['very small','very large','very fast','very bright'],'very small','Micro- means very small. A microscope lets you see very small things.')
q('eng-vocab','vocabulary',2,"What does 'tele-' mean in 'telephone'?",['far away','nearby','underground','underwater'],'far away','Tele- means far away. A telephone lets you talk to someone far away.')
q('eng-vocab','vocabulary',2,"Which word means 'a boat that travels under water'?",['submarine','subtrack','subbird','subflight'],'submarine','Submarine uses sub- (under) + marine (sea) = vessel that goes under the sea.')
q('eng-vocab','vocabulary',2,"Which word means 'to carry things from one place to another'?",['transport','transtree','transhome','transleap'],'transport','Transport uses trans- (across) + port (carry) = carry across.')
q('eng-vocab','vocabulary',2,"Which word means 'a vehicle with only one wheel'?",['unicycle','unitruck','uniboat','uniplane'],'unicycle','Unicycle uses uni- (one) + cycle (wheel) = one wheel.')

// Suffixes
q('eng-vocab','vocabulary',2,"What does 'hopeful' mean?",['full of hope','without hope','hopeless','hoping never'],'full of hope','The suffix -ful means full of. Hopeful means full of hope.')
q('eng-vocab','vocabulary',2,"What does 'thankful' mean?",['full of thanks','without thanks','unthankful','never thanked'],'full of thanks','The suffix -ful means full of. Thankful means full of thanks.')
q('eng-vocab','vocabulary',2,"What does 'harmful' mean?",['causing harm','without harm','helping others','being safe'],'causing harm','Harmful means causing harm or danger.')
q('eng-vocab','vocabulary',2,"What does 'fearful' mean?",['full of fear','without fear','very brave','perfectly calm'],'full of fear','Fearful means full of fear.')
q('eng-vocab','vocabulary',2,"What does 'cheerful' mean?",['full of cheer and happiness','very sad','without any feeling','extremely angry'],'full of cheer and happiness','Cheerful means full of cheer and happiness.')
q('eng-vocab','vocabulary',2,"Which suffix turns 'enjoy' into a noun?",['--ment','--ful','--less','--ly'],'-ment','The suffix -ment turns a verb into a noun: enjoy → enjoyment.')
q('eng-vocab','vocabulary',2,"What is the noun form of 'govern'?",['government','governless','governly','governful'],'government','Govern + -ment = government. The -ment suffix makes it a noun.')
q('eng-vocab','vocabulary',2,"What is the noun form of 'move'?",['movement','moveful','moveless','movely'],'movement','Move + -ment = movement. The -ment suffix makes it a noun.')
q('eng-vocab','vocabulary',2,"What is the noun form of 'pay'?",['payment','payful','payless','payly'],'payment','Pay + -ment = payment. The -ment suffix makes it a noun.')
q('eng-vocab','vocabulary',2,"What is the noun form of 'agree'?",['agreement','agreeful','agreeless','agreely'],'agreement','Agree + -ment = agreement. The -ment suffix makes it a noun.')

// Compound words
q('eng-vocab','vocabulary',2,"What does 'lighthouse' mean?",['a tower with a bright light to guide ships','a house made of light materials','a very small house','a house near a lake'],'a tower with a bright light to guide ships','A lighthouse is a tall tower with a flashing light to guide ships at sea.')
q('eng-vocab','vocabulary',2,"What does 'raincoat' mean?",['a coat that keeps you dry in the rain','a coat made of rain','a coat for sunny days','a very thin coat'],'a coat that keeps you dry in the rain','A raincoat is a waterproof coat that protects you from the rain.')
q('eng-vocab','vocabulary',2,"What does 'football' mean?",['a sport where players kick a ball with their feet','a ball made of feet','a type of dancing','a game played on water'],'a sport where players kick a ball with their feet','Football is a sport where players kick a ball into a goal using their feet.')
q('eng-vocab','vocabulary',2,"What does 'sunflower' mean?",['a flower that turns to face the sun','a flower that only blooms at night','a flower that grows underwater','a very tiny flower'],'a flower that turns to face the sun','A sunflower is a tall yellow flower that follows the sun across the sky.')
q('eng-vocab','vocabulary',2,"What does 'bookworm' mean?",['a person who loves reading books','a worm that eats books','a type of caterpillar','a book with pictures of worms'],'a person who loves reading books','A bookworm is someone who reads a lot and loves books.')
q('eng-vocab','vocabulary',2,"What does 'daydream' mean?",['to imagine pleasant things while awake','a dream you have during the night','a nightmare','a very short sleep'],'to imagine pleasant things while awake','To daydream means to let your mind wander and imagine pleasant things while you are awake.')
q('eng-vocab','vocabulary',2,"What does 'earthquake' mean?",['a sudden shaking of the ground','a type of cake with earth in it','an earth-coloured painting','a very heavy stone'],'a sudden shaking of the ground','An earthquake is a sudden, violent shaking of the ground caused by movements underground.')
q('eng-vocab','vocabulary',2,"What does 'snowflake' mean?",['a single crystal of snow','a type of cereal','a white flower','a cloud in the sky'],'a single crystal of snow','A snowflake is a single, delicate crystal of snow with a unique pattern.')
q('eng-vocab','vocabulary',2,"What does 'starfish' mean?",['a sea creature shaped like a star','a fish that lives among stars','a type of shooting star','a very bright deep sea light'],'a sea creature shaped like a star','A starfish is a sea creature with five arms arranged like a star.')
q('eng-vocab','vocabulary',2,"What does 'butterfly' mean?",['an insect with colourful wings','a type of butter made from flies','a flying piece of butter','a yellow flower'],'an insect with colourful wings','A butterfly is a beautiful insect with large, colourful wings.')

// ============================================================
// GRAMMAR (~200 questions)
// ============================================================

// Collective nouns
q('eng-gram','grammar',2,"What is the collective noun for a group of lions?",['pride','herd','flock','pack'],'pride','A group of lions is called a pride.')
q('eng-gram','grammar',2,"What is the collective noun for a group of fish?",['shoal','pride','swarm','gaggle'],'shoal','A group of fish is called a shoal.')
q('eng-gram','grammar',2,"What is the collective noun for a group of bees?",['swarm','flock','herd','pod'],'swarm','A group of bees is called a swarm.')
q('eng-gram','grammar',2,"What is the collective noun for a group of wolves?",['pack','pride','swarm','shoal'],'pack','A group of wolves is called a pack.')
q('eng-gram','grammar',2,"What is the collective noun for a group of birds?",['flock','herd','swarm','pack'],'flock','A group of birds is called a flock.')
q('eng-gram','grammar',2,"What is the collective noun for a group of cattle?",['herd','flock','pack','pride'],'herd','A group of cattle is called a herd.')
q('eng-gram','grammar',2,"What is the collective noun for a group of ants?",['colony','swarm','flock','herd'],'colony','A group of ants is called a colony.')
q('eng-gram','grammar',2,"What is the collective noun for a group of dolphins?",['pod','pride','shoal','pack'],'pod','A group of dolphins is called a pod.')
q('eng-gram','grammar',2,"What is the collective noun for a group of crows?",['murder','flock','gaggle','herd'],'murder','A group of crows is called a murder — a surprising name!')
q('eng-gram','grammar',2,"What is the collective noun for a group of geese?",['gaggle','flock','pod','swarm'],'gaggle','A group of geese is called a gaggle.')
q('eng-gram','grammar',2,"What is the collective noun for a group of elephants?",['herd','pride','pack','colony'],'herd','A group of elephants is called a herd.')
q('eng-gram','grammar',2,"What is the collective noun for a group of butterflies?",['flutter','flock','swarm','colony'],'flutter','A group of butterflies is called a flutter.')
q('eng-gram','grammar',2,"What is the collective noun for a group of monkeys?",['troop','pack','herd','flock'],'troop','A group of monkeys is called a troop.')
q('eng-gram','grammar',2,"What is the collective noun for a group of owls?",['parliament','colony','flock','murder'],'parliament','A group of owls is called a parliament.')
q('eng-gram','grammar',2,"What is the collective noun for a group of frogs?",['army','colony','swarm','pack'],'army','A group of frogs is called an army.')

// Irregular past tenses
q('eng-gram','grammar',2,"What is the past tense of 'fly'?",['flew','flied','flyed','flewn'],'flew','The past tense of fly is flew. (I fly → Yesterday I flew.)')
q('eng-gram','grammar',2,"What is the past tense of 'grow'?",['grew','growed','grewed','grewn'],'grew','The past tense of grow is grew. (I grow → Yesterday I grew.)')
q('eng-gram','grammar',2,"What is the past tense of 'know'?",['knew','knowed','knewed','knowen'],'knew','The past tense of know is knew. (I know → Yesterday I knew.)')
q('eng-gram','grammar',2,"What is the past tense of 'throw'?",['threw','throwed','threwed','thrun'],'threw','The past tense of throw is threw. (I throw → Yesterday I threw.)')
q('eng-gram','grammar',2,"What is the past tense of 'draw'?",['drew','drawed','drewed','drawwed'],'drew','The past tense of draw is drew. (I draw → Yesterday I drew.)')
q('eng-gram','grammar',2,"What is the past tense of 'buy'?",['bought','buyed','boughten','buied'],'bought','The past tense of buy is bought. (I buy → Yesterday I bought.)')
q('eng-gram','grammar',2,"What is the past tense of 'bring'?",['brought','bringed','brung','brang'],'brought','The past tense of bring is brought. (I bring → Yesterday I brought.)')
q('eng-gram','grammar',2,"What is the past tense of 'think'?",['thought','thinked','thunk','thoughted'],'thought','The past tense of think is thought. (I think → Yesterday I thought.)')
q('eng-gram','grammar',2,"What is the past tense of 'catch'?",['caught','catched','cought','catchted'],'caught','The past tense of catch is caught. (I catch → Yesterday I caught.)')
q('eng-gram','grammar',2,"What is the past tense of 'teach'?",['taught','teached','taughted','teacht'],'taught','The past tense of teach is taught. (I teach → Yesterday I taught.)')
q('eng-gram','grammar',2,"What is the past tense of 'fight'?",['fought','fighted','foughten','fightd'],'fought','The past tense of fight is fought. (I fight → Yesterday I fought.)')
q('eng-gram','grammar',2,"What is the past tense of 'stand'?",['stood','standed','stod','standd'],'stood','The past tense of stand is stood. (I stand → Yesterday I stood.)')
q('eng-gram','grammar',2,"What is the past tense of 'lose'?",['lost','losed','losted','lossed'],'lost','The past tense of lose is lost. (I lose → Yesterday I lost.)')
q('eng-gram','grammar',2,"What is the past tense of 'find'?",['found','finded','foud','finnd'],'found','The past tense of find is found. (I find → Yesterday I found.)')
q('eng-gram','grammar',2,"What is the past tense of 'hold'?",['held','holded','holdeed','heled'],'held','The past tense of hold is held. (I hold → Yesterday I held.)')
q('eng-gram','grammar',2,"What is the past tense of 'tell'?",['told','telled','tolled','teld'],'told','The past tense of tell is told. (I tell → Yesterday I told.)')
q('eng-gram','grammar',2,"What is the past tense of 'sell'?",['sold','selled','solled','seld'],'sold','The past tense of sell is sold. (I sell → Yesterday I sold.)')
q('eng-gram','grammar',2,"What is the past tense of 'keep'?",['kept','keeped','kep','kepted'],'kept','The past tense of keep is kept. (I keep → Yesterday I kept.)')
q('eng-gram','grammar',2,"What is the past tense of 'sleep'?",['slept','sleeped','slep','sleptt'],'slept','The past tense of sleep is slept. (I sleep → Yesterday I slept.)')
q('eng-gram','grammar',2,"What is the past tense of 'feel'?",['felt','feeled','feled','feelted'],'felt','The past tense of feel is felt. (I feel → Yesterday I felt.)')
q('eng-gram','grammar',2,"What is the past tense of 'leave'?",['left','leaved','lefted','laved'],'left','The past tense of leave is left. (I leave → Yesterday I left.)')
q('eng-gram','grammar',2,"What is the past tense of 'sit'?",['sat','sitted','sated','sited'],'sat','The past tense of sit is sat. (I sit → Yesterday I sat.)')
q('eng-gram','grammar',2,"What is the past tense of 'dig'?",['dug','digged','dugged','digd'],'dug','The past tense of dig is dug. (I dig → Yesterday I dug.)')
q('eng-gram','grammar',2,"What is the past tense of 'win'?",['won','winned','wun','wond'],'won','The past tense of win is won. (I win → Yesterday I won.)')
q('eng-gram','grammar',2,"What is the past tense of 'spin'?",['spun','spinned','spunned','spind'],'spun','The past tense of spin is spun. (I spin → Yesterday I spun.)')
q('eng-gram','grammar',3,"What is the past tense of 'seek'?",['sought','seeked','soughted','seekt'],'sought','The past tense of seek is sought. (I seek → Yesterday I sought.)')
q('eng-gram','grammar',3,"What is the past tense of 'mean'?",['meant','meaned','ment','meanted'],'meant','The past tense of mean is meant. (I mean → Yesterday I meant.)')
q('eng-gram','grammar',3,"What is the past tense of 'deal'?",['dealt','dealed','deelt','deald'],'dealt','The past tense of deal is dealt. (I deal → Yesterday I dealt.)')
q('eng-gram','grammar',3,"What is the past tense of 'understand'?",['understood','understanded','understandd','understod'],'understood','The past tense of understand is understood.')
q('eng-gram','grammar',3,"What is the past tense of 'strike'?",['struck','striked','strucked','strikd'],'struck','The past tense of strike is struck.')
q('eng-gram','grammar',3,"What is the past tense of 'swing'?",['swung','swinged','swunged','swingd'],'swung','The past tense of swing is swung.')

// Subject-verb agreement
q('eng-gram','grammar',3,"Which sentence is correct?",['Each of the children has a book.','Each of the children have a book.','Each of the children is having a book.','Each of the children are having a book.'],'Each of the children has a book.','Each is a singular subject, so use has (not have).')
q('eng-gram','grammar',3,"Which sentence is correct?",['Neither he nor she is ready.','Neither he nor she are ready.','Neither he nor she were ready.','Neither he nor she be ready.'],'Neither he nor she is ready.','Neither…nor takes a singular verb when both subjects are singular.')
q('eng-gram','grammar',3,"Which sentence is correct?",['The team is playing well.','The team are playing well.','The team were playing well.','The team be playing well.'],'The team is playing well.','In Irish/British English the team can be singular or plural, but here the singular verb is is preferred in formal use.')
q('eng-gram','grammar',3,"Which sentence is correct?",['Everyone has done their homework.','Everyone have done their homework.','Everyone done their homework.','Everyone had been done their homework.'],'Everyone has done their homework.','Everyone is singular, so use has.')
q('eng-gram','grammar',3,"Which sentence uses the verb correctly?",['The dogs run in the park.','The dogs runs in the park.','The dogs running in the park.','The dogs runned in the park.'],'The dogs run in the park.','With a plural subject (dogs), use the base form run (not runs).')
q('eng-gram','grammar',3,"Which sentence is correct?",['She and I are friends.','She and I is friends.','She and I am friends.','She and I be friends.'],'She and I are friends.','She and I is a plural subject, so use are.')

// Types of sentences
q('eng-gram','grammar',2,"What type of sentence is 'The sun rises in the east.'?",['declarative','interrogative','imperative','exclamatory'],'declarative','A declarative sentence makes a statement. It ends with a full stop.')
q('eng-gram','grammar',2,"What type of sentence is 'Where are you going?'?",['interrogative','declarative','imperative','exclamatory'],'interrogative','An interrogative sentence asks a question. It ends with a question mark.')
q('eng-gram','grammar',2,"What type of sentence is 'Please close the door.'?",['imperative','declarative','interrogative','exclamatory'],'imperative','An imperative sentence gives a command or instruction.')
q('eng-gram','grammar',2,"What type of sentence is 'What a beautiful day!'?",['exclamatory','declarative','interrogative','imperative'],'exclamatory','An exclamatory sentence shows strong feeling. It ends with an exclamation mark.')
q('eng-gram','grammar',2,"What type of sentence makes a statement?",['declarative','interrogative','imperative','exclamatory'],'declarative','A declarative sentence makes a statement or gives information.')
q('eng-gram','grammar',2,"What type of sentence asks a question?",['interrogative','declarative','imperative','exclamatory'],'interrogative','An interrogative sentence asks a question.')
q('eng-gram','grammar',2,"What type of sentence gives a command or instruction?",['imperative','declarative','interrogative','exclamatory'],'imperative','An imperative sentence gives an order, command, or instruction.')
q('eng-gram','grammar',2,"What type of sentence shows strong feeling and ends with '!'?",['exclamatory','declarative','interrogative','imperative'],'exclamatory','An exclamatory sentence shows a strong emotion and ends with an exclamation mark.')

// Conjunctions
q('eng-gram','grammar',2,"Which conjunction best completes the sentence: '_____ it was raining, we went to the park.'?",['Although','Because','Until','While'],'Although','Although introduces a contrast — we went despite the rain.')
q('eng-gram','grammar',2,"Which conjunction best completes: 'I will not go _____ you come with me.'?",['unless','although','during','since'],'unless','Unless means except if — I will not go except if you come.')
q('eng-gram','grammar',2,"Which conjunction best completes: 'We waited _____ the rain stopped.'?",['until','although','since','unless'],'until','Until means up to the time when — we waited up to when the rain stopped.')
q('eng-gram','grammar',2,"Which conjunction best completes: 'She read her book _____ he cooked dinner.'?",['while','unless','until','although'],'while','While means at the same time as — she read as he cooked.')
q('eng-gram','grammar',2,"Which conjunction best completes: 'I have lived here _____ I was born.'?",['since','until','while','unless'],'since','Since means from the time when — I have lived here from when I was born.')
q('eng-gram','grammar',2,"Which conjunction best completes: 'She was late _____ the bus broke down.'?",['because','although','unless','until'],'because','Because explains the reason — the broken bus caused her to be late.')
q('eng-gram','grammar',3,"Which conjunction best completes: 'He practised every day _____ he could improve.'?",['so that','because of','in case','even though'],'so that','So that shows purpose — he practised with the aim of improving.')
q('eng-gram','grammar',2,"Which word is a conjunction in 'I like cats although I am allergic to them.'?",['although','cats','allergic','them'],'although','Although is the conjunction joining the two clauses.')
q('eng-gram','grammar',2,"Which word is a conjunction in 'We will start unless it gets too late.'?",['unless','start','late','too'],'unless','Unless is the conjunction introducing the condition.')
q('eng-gram','grammar',2,"Which word is a conjunction in 'She was happy because she won the prize.'?",['because','happy','prize','won'],'because','Because is the conjunction explaining the reason.')

// Adverbs
q('eng-gram','grammar',2,"Which word is an adverb in 'She ran quickly to catch the bus.'?",['quickly','ran','bus','catch'],'quickly','Quickly is an adverb of manner — it tells us how she ran.')
q('eng-gram','grammar',2,"Which word is an adverb in 'The dog barked loudly at the postman.'?",['loudly','barked','postman','dog'],'loudly','Loudly is an adverb of manner — it tells us how the dog barked.')
q('eng-gram','grammar',2,"Which word is an adverb in 'He answered the question correctly.'?",['correctly','answered','question','he'],'correctly','Correctly is an adverb of manner — it tells us how he answered.')
q('eng-gram','grammar',2,"Which word is an adverb in 'She sang beautifully at the concert.'?",['beautifully','sang','concert','she'],'beautifully','Beautifully is an adverb of manner — it tells us how she sang.')
q('eng-gram','grammar',2,"Which word is an adverb of manner?",['quickly','quick','quicker','quicken'],'quickly','Quickly is an adverb — it ends in -ly and describes how an action is done.')
q('eng-gram','grammar',2,"Which word is an adverb of manner?",['carefully','careful','more careful','careless'],'carefully','Carefully is an adverb — it ends in -ly and describes how an action is done.')
q('eng-gram','grammar',2,"Which word is an adverb of manner?",['happily','happy','happier','happiness'],'happily','Happily is an adverb — it ends in -ly and describes how an action is done.')
q('eng-gram','grammar',2,"Which word is an adverb of manner?",['silently','silent','silence','more silent'],'silently','Silently is an adverb — it ends in -ly and describes how an action is done.')
q('eng-gram','grammar',2,"Which word is an adverb of manner?",['brightly','bright','brighter','brightness'],'brightly','Brightly is an adverb — it ends in -ly and describes how an action is done.')

// Active vs Passive voice
q('eng-gram','grammar',3,"Change to active voice: 'The cake was eaten by the children.'",['The children ate the cake.','The cake ate the children.','Eaten was the cake by children.','The children were eating by the cake.'],'The children ate the cake.','Active voice: subject (children) + verb (ate) + object (cake).')
q('eng-gram','grammar',3,"Change to active voice: 'The ball was kicked by the boy.'",['The boy kicked the ball.','The ball kicked the boy.','Kicked was the ball by the boy.','The boy was kicked by the ball.'],'The boy kicked the ball.','Active voice: subject (boy) + verb (kicked) + object (ball).')
q('eng-gram','grammar',3,"Change to active voice: 'The letter was written by Maria.'",['Maria wrote the letter.','The letter wrote Maria.','Written was the letter by Maria.','Maria was writing by the letter.'],'Maria wrote the letter.','Active voice: subject (Maria) + verb (wrote) + object (letter).')
q('eng-gram','grammar',3,"Which sentence is in the passive voice?",['The dog was walked by Emma.','Emma walked the dog.','The dog walked with Emma.','Emma and the dog went walking.'],'The dog was walked by Emma.','Passive voice: object (dog) + was + past participle (walked) + by + subject (Emma).')
q('eng-gram','grammar',3,"Which sentence is in the passive voice?",['The window was broken by the wind.','The wind broke the window.','The window broke in the wind.','Wind and windows break together.'],'The window was broken by the wind.','Passive voice puts the object first: the window was broken by the wind.')

// Possessive apostrophes
q('eng-gram','grammar',3,"Which sentence uses the apostrophe correctly?",["The dog's bone was buried.","The dogs bone was buried.","The dogs' bone was buried.","The dog bone's was buried."],"The dog's bone was buried.",'The dog\'s bone — apostrophe + s after the owner (dog) shows it belongs to one dog.')
q('eng-gram','grammar',3,"Which sentence uses the apostrophe correctly?",["The children's toys were left out.","The childrens toys were left out.","The childrens' toys were left out.","The children toy's were left out."],"The children's toys were left out.",'Children is already plural, so add apostrophe + s: children\'s.')
q('eng-gram','grammar',3,"Which sentence uses the apostrophe correctly?",["The teacher's desk is tidy.","The teachers desk is tidy.","The teachers' desk is tidy.","The teacher desk's is tidy."],"The teacher's desk is tidy.",'One teacher owns the desk, so: teacher\'s desk.')
q('eng-gram','grammar',3,"Which sentence uses the apostrophe correctly?",["The girls' team won the match.","The girl's team won the match.","The girls team won the match.","The girls team's won the match."],"The girls' team won the match.",'Multiple girls own the team, so the apostrophe goes after the s: girls\'.')

// Prepositions of time
q('eng-gram','grammar',2,"Which preposition correctly completes: 'We eat lunch ___ noon.'?",['at','in','on','by'],'at','We use at with specific times: at noon, at 3 o\'clock.')
q('eng-gram','grammar',2,"Which preposition correctly completes: 'I go to school ___ the morning.'?",['in','at','on','during'],'in','We use in with parts of the day: in the morning, in the afternoon.')
q('eng-gram','grammar',2,"Which preposition correctly completes: 'We have PE ___ Monday.'?",['on','in','at','by'],'on','We use on with days of the week: on Monday, on Friday.')
q('eng-gram','grammar',2,"Which preposition correctly completes: 'We go on holidays ___ the summer.'?",['during','at','in','by'],'during','We use during to mean throughout a period: during the summer.')
q('eng-gram','grammar',2,"Which preposition correctly completes: 'She finished her homework ___ Friday.'?",['by','at','on','in'],'by','We use by to mean no later than: she finished by Friday.')
q('eng-gram','grammar',2,"Which preposition correctly completes: 'He has been reading ___ last week.'?",['since','during','by','until'],'since','We use since to show a starting point: since last week.')
q('eng-gram','grammar',2,"Which preposition correctly completes: 'We go home ___ school.'?",['after','before','during','since'],'after','After school means when school has finished.')
q('eng-gram','grammar',2,"Which preposition correctly completes: 'She brushed her teeth ___ breakfast.'?",['before','after','during','since'],'before','Before breakfast means prior to eating breakfast.')

// ============================================================
// PUNCTUATION (~100 questions)
// ============================================================

// Commas in lists
q('eng-punc','punctuation',2,"Which sentence has the correct comma use for a list?",['We need milk, bread, eggs and butter.','We need milk bread eggs and butter.','We need, milk, bread, eggs, and, butter.','We need milk, bread, eggs, and, butter.'],'We need milk, bread, eggs and butter.','Separate list items with commas. No comma before and in Irish/British style.')
q('eng-punc','punctuation',2,"Which sentence has the correct comma use for a list?",['The colours are red, yellow, blue and green.','The colours are red yellow blue and green.','The colours, are red, yellow, blue and green.','The colours are red, yellow blue and green.'],'The colours are red, yellow, blue and green.','Use commas between each item in the list: red, yellow, blue and green.')
q('eng-punc','punctuation',2,"Which sentence has the correct comma use for a list?",['She loves singing, dancing, painting and drawing.','She loves singing dancing painting and drawing.','She loves, singing, dancing, painting, and drawing.','She loves singing, dancing painting and drawing.'],'She loves singing, dancing, painting and drawing.','Use commas between each activity in the list.')

// Capital letters
q('eng-punc','punctuation',2,"Which sentence uses capital letters correctly?",['The River Liffey flows through Dublin.','The river liffey flows through dublin.','The river Liffey flows through Dublin.','the River Liffey flows through Dublin.'],'The River Liffey flows through Dublin.','River Liffey is a proper noun and Dublin is a city name — both need capitals.')
q('eng-punc','punctuation',2,"Which sentence uses capital letters correctly?",['I have visited France and Spain.','I have visited france and spain.','I have visited France and spain.','i have visited France and Spain.'],'I have visited France and Spain.','France and Spain are proper nouns (country names) and must be capitalised.')
q('eng-punc','punctuation',2,"Which sentence uses capital letters correctly?",['We go swimming on Wednesday.','We go swimming on wednesday.','we go swimming on Wednesday.','We Go Swimming on Wednesday.'],'We go swimming on Wednesday.','Days of the week like Wednesday always start with a capital letter.')
q('eng-punc','punctuation',2,"Which sentence uses capital letters correctly?",['School starts again in September.','school starts again in September.','School starts again in september.','School Starts Again In September.'],'School starts again in September.','Months of the year like September always start with a capital letter.')
q('eng-punc','punctuation',2,"Which sentence uses capital letters correctly?",['My friend Sarah lives in Cork.','my friend sarah lives in cork.','My friend sarah lives in Cork.','My friend Sarah Lives in Cork.'],'My friend Sarah lives in Cork.','Names (Sarah) and place names (Cork) are proper nouns and need capitals.')
q('eng-punc','punctuation',2,"Which sentence uses capital letters correctly?",["We read 'Charlie and the Chocolate Factory'.",'We read \'charlie and the chocolate factory\'.',"We read 'charlie and The Chocolate Factory'.",'We Read \'charlie and the Chocolate Factory\'.'],"We read 'Charlie and the Chocolate Factory'.",'In book titles, main words are capitalised: Charlie and the Chocolate Factory.')

// Direct speech
q('eng-punc','punctuation',3,"Which sentence uses speech marks correctly?",['"Come here," said Mum.','Come here, "said Mum."','"Come here said Mum."','Come "here," said Mum.'],'"Come here," said Mum.','Speech marks go around the words spoken, and the comma goes inside the closing speech mark.')
q('eng-punc','punctuation',3,"Which sentence uses speech marks correctly?",['"What time is it?" asked Tom.','"What time is it? asked Tom."','What time is it?" asked Tom.','"What time is it" asked Tom?'],'"What time is it?" asked Tom.','The question mark goes inside the speech marks, and asked Tom comes after.')
q('eng-punc','punctuation',3,"Which sentence uses speech marks correctly?",['"I love pizza!" shouted Jack.','I love pizza!" shouted Jack.','"I love pizza! shouted Jack.','"I love pizza!" shouted jack.'],'"I love pizza!" shouted Jack.','Speech marks surround the spoken words. Jack needs a capital J as it is a name.')
q('eng-punc','punctuation',3,"Where do speech marks go in: She said ___ Hello ___ to everyone.",['She said "Hello" to everyone.','She "said Hello" to everyone.','"She said Hello" to everyone.','She said Hello "to everyone".'],'She said "Hello" to everyone.','Speech marks go around just the word or words being spoken: "Hello".')

// Question marks and exclamation marks
q('eng-punc','punctuation',1,"Which sentence uses the correct end punctuation for a question?",['Where are you going?','Where are you going.','Where are you going!','Where are you going,'],'Where are you going?','A question always ends with a question mark (?).')
q('eng-punc','punctuation',1,"Which sentence uses the correct end punctuation for a strong feeling?",['What an amazing goal!','What an amazing goal?','What an amazing goal.','What an amazing goal,'],'What an amazing goal!','An exclamation ends with an exclamation mark (!).')
q('eng-punc','punctuation',1,"Which sentence uses the correct end punctuation for a statement?",['The cat sat on the mat.','The cat sat on the mat?','The cat sat on the mat!','The cat sat on the mat,'],'The cat sat on the mat.','A statement (declarative sentence) ends with a full stop.')

// Apostrophes for contractions
q('eng-punc','punctuation',2,"What does the apostrophe replace in 'can't'?",["the letter 'o' in 'not'","the letters 'ca'","the letter 'n'","the whole word 'can'"],"the letter 'o' in 'not'",'Can\'t = can + not. The apostrophe replaces the letter o from not.')
q('eng-punc','punctuation',2,"What is the full form of 'they\\'re'?",['they are','they were','they will','they have'],'they are','They\'re = they + are. The apostrophe replaces the a from are.')
q('eng-punc','punctuation',2,"What is the full form of 'it\\'s'?",['it is','it has','its own','it was'],'it is','It\'s = it + is. Note: its (without apostrophe) shows possession.')
q('eng-punc','punctuation',2,"What is the full form of 'I\\'d'?",['I would','I did','I do','I should'],'I would','I\'d = I + would. The apostrophe replaces woul.')
q('eng-punc','punctuation',2,"What is the full form of 'we\\'ve'?",['we have','we were','we will','we do'],'we have','We\'ve = we + have. The apostrophe replaces ha.')
q('eng-punc','punctuation',2,"What does 'won\\'t' mean?",['will not','would not','do not','did not'],'will not','Won\'t = will + not. It is an irregular contraction.')
q('eng-punc','punctuation',3,"What does 'shan\\'t' mean?",['shall not','should not','will not','do not'],'shall not','Shan\'t = shall + not. The apostrophe replaces no.')
q('eng-punc','punctuation',2,"What is the full form of 'they\\'d'?",['they would','they did','they do','they should'],'they would','They\'d = they + would.')

// Punctuation identification
q('eng-punc','punctuation',1,"What punctuation mark is used to separate items in a list?",['comma','full stop','colon','semicolon'],'comma','A comma (,) is used to separate items in a list.')
q('eng-punc','punctuation',1,"What punctuation mark is used at the end of a question?",['question mark','exclamation mark','full stop','comma'],'question mark','A question mark (?) goes at the end of every question.')
q('eng-punc','punctuation',1,"What punctuation mark shows strong emotion?",['exclamation mark','question mark','full stop','comma'],'exclamation mark','An exclamation mark (!) shows strong feeling like surprise, excitement, or anger.')
q('eng-punc','punctuation',1,"What punctuation mark shows that someone is speaking?",['speech marks','commas','brackets','apostrophes'],'speech marks','Speech marks (" ") are placed around the words that someone says aloud.')
q('eng-punc','punctuation',2,"What punctuation mark is used to show possession?",['apostrophe','comma','colon','hyphen'],'apostrophe','An apostrophe (\'s) shows that something belongs to someone: the cat\'s hat.')
q('eng-punc','punctuation',2,"What is the punctuation mark '...' called?",['ellipsis','colon','semicolon','hyphen'],'ellipsis','The three dots (...) are called an ellipsis. They show a pause or that something has been left out.')
q('eng-punc','punctuation',2,"What is a hyphen used for?",['joining words together','ending a sentence','showing someone is speaking','making a list'],'joining words together','A hyphen (-) joins words together, like well-known or ice-cream.')

// ============================================================
// WRITING (~50 questions)
// ============================================================

// Story planning and elements
q('eng-writ','writing',2,"What should come FIRST when planning a story?",['thinking about the characters and setting','writing the last sentence','choosing a title','writing as fast as possible'],'thinking about the characters and setting','Good writers plan first: think about who is in the story and where it takes place.')
q('eng-writ','writing',2,"What is the 'setting' of a story?",['the place and time where the story happens','the main character','the problem in the story','the ending of the story'],'the place and time where the story happens','The setting tells us where and when the story takes place.')
q('eng-writ','writing',3,"What is a 'protagonist'?",['the main character in a story','the villain in a story','the setting of a story','the ending of a story'],'the main character in a story','The protagonist is the main character — the hero of the story.')
q('eng-writ','writing',3,"What is an 'antagonist'?",['the character who causes problems for the hero','the main hero of the story','the narrator of the story','the setting of the story'],'the character who causes problems for the hero','The antagonist is the villain or the force that creates problems for the hero.')
q('eng-writ','writing',2,"What is the 'plot' of a story?",['the sequence of events that happen in the story','the place where the story is set','the main character','the moral or lesson'],'the sequence of events that happen in the story','The plot is the series of events that make up the story from beginning to end.')
q('eng-writ','writing',2,"What is the 'resolution' of a story?",['how the problem in the story is solved','the exciting middle part','the very beginning','the main character\'s name'],'how the problem in the story is solved','The resolution is the ending where the main problem or conflict is sorted out.')
q('eng-writ','writing',2,"What is the 'conflict' in a story?",['the main problem that the character must face','the happy ending','the beginning of the story','the place where it happens'],'the main problem that the character must face','The conflict is the central problem or challenge the character must overcome.')
q('eng-writ','writing',3,"What is the 'theme' of a story?",['the main message or lesson','the list of characters','where the story is set','how the story begins'],'the main message or lesson','The theme is the deeper meaning or lesson the author wants the reader to understand.')
q('eng-writ','writing',3,"What type of writing would you use to share your opinions and try to change someone's mind?",['persuasive writing','report writing','story writing','diary writing'],'persuasive writing','Persuasive writing is used to convince the reader to agree with your point of view.')
q('eng-writ','writing',3,"What is a 'rhetorical question'?",['a question asked for effect not expecting an answer','a question at the end of a letter','a question with only one answer','a question about science'],'a question asked for effect not expecting an answer','A rhetorical question is asked to make a point, not to get an answer.')

// Letter writing
q('eng-writ','writing',2,"What goes at the TOP RIGHT of a formal letter?",['your address and the date','a greeting','your signature','a heading'],'your address and the date','In a formal letter, your address and the date go in the top right corner.')
q('eng-writ','writing',2,"How do you begin a formal letter to someone whose name you know?",['Dear [Name],','To whom it may concern,','Hello there,','Hi,'],'Dear [Name],','Start a formal letter with Dear followed by the person\'s name and a comma.')
q('eng-writ','writing',2,"How do you end a formal letter?",['Yours sincerely,','Bye for now,','See you later,','Love from,'],'Yours sincerely,','End a formal letter with Yours sincerely, followed by your signature.')
q('eng-writ','writing',2,"What is the main difference between a formal and informal letter?",['a formal letter is to someone you do not know well; an informal letter is to a friend','they are exactly the same','a formal letter is always longer','an informal letter must have a stamp'],'a formal letter is to someone you do not know well; an informal letter is to a friend','Formal letters use polite language for official purposes; informal letters are friendly messages.')
q('eng-writ','writing',2,"What goes at the end of a letter just before your name?",['your sign-off such as Yours sincerely','another paragraph','the date','the address'],'your sign-off such as Yours sincerely','The sign-off (e.g. Yours sincerely or Love from) goes before you write your name.')

// Report writing
q('eng-writ','writing',3,"What is a key feature of a report?",['it contains facts not opinions','it tells a made-up story','it is always very short','it must rhyme'],'it contains facts not opinions','A report presents true, factual information about a real topic.')
q('eng-writ','writing',3,"What do headings and subheadings do in a report?",['help the reader find information quickly','make the report look pretty','replace the need for any writing','always go at the very end'],'help the reader find information quickly','Headings and subheadings organise the report so readers can find information easily.')
q('eng-writ','writing',3,"What is the purpose of a report?",['to give information about a real topic','to make the reader feel sad','to entertain with a story','to share personal feelings'],'to give information about a real topic','Reports are non-fiction texts that inform the reader about a real subject.')

// Persuasive writing
q('eng-writ','writing',3,"What is the 'rule of three' in persuasive writing?",['using three examples or adjectives in a row for effect','writing exactly three sentences','having three characters','starting each paragraph three times'],'using three examples or adjectives in a row for effect','The rule of three creates a powerful rhythm: e.g. "It is fast, fun, and fantastic!"')
q('eng-writ','writing',3,"What is 'emotional language' in persuasive writing?",['words that make the reader feel strong emotions','words that explain facts and figures','scientific language','very long words'],'words that make the reader feel strong emotions','Emotional language stirs feelings in the reader to make them agree with your argument.')
q('eng-writ','writing',3,"Which is an example of a rhetorical question in persuasive writing?",["Surely we can all agree that our planet deserves to be saved?","The Earth is 4.5 billion years old.","Scientists have found that temperatures are rising.","Please sign this petition to help the environment."],"Surely we can all agree that our planet deserves to be saved?",'A rhetorical question engages the reader — here it implies everyone should care about the planet.')

// Connectives
q('eng-writ','writing',2,"Which connective shows TIME ORDER?",['finally','however','furthermore','although'],'finally','Finally is a time connective — it shows the last thing in a sequence.')
q('eng-writ','writing',2,"Which connective shows CONTRAST?",['however','finally','furthermore','afterwards'],'however','However introduces a contrast or opposite idea.')
q('eng-writ','writing',2,"Which connective shows ADDING INFORMATION?",['furthermore','however','finally','although'],'furthermore','Furthermore means in addition — it adds more information.')
q('eng-writ','writing',2,"Which word is a time connective?",['meanwhile','however','therefore','although'],'meanwhile','Meanwhile is a time connective — it means at the same time.')
q('eng-writ','writing',2,"Which word is a contrast connective?",['although','meanwhile','furthermore','additionally'],'although','Although introduces a contrasting idea.')
q('eng-writ','writing',2,"Which connective would you use to add more information to your writing?",['in addition','on the other hand','first of all','as a result'],'in addition','In addition is used to add another point or piece of information.')
q('eng-writ','writing',2,"Which connective would you use to show a result?",['therefore','although','meanwhile','in addition'],'therefore','Therefore shows that something is a result or conclusion.')
q('eng-writ','writing',3,"Which group contains only TIME connectives?",['first, then, finally, afterwards','however, although, but, yet','furthermore, moreover, in addition, also','therefore, as a result, consequently, so'],'first, then, finally, afterwards','First, then, finally, and afterwards all show the order in which things happen.')

// Save
const merged = [...existing, ...newQs]
writeFileSync(FILE, JSON.stringify(merged, null, 2))
console.log(`\n✅ Done! Added ${newQs.length} new questions.`)
console.log(`Total questions in english.json: ${merged.length}`)
