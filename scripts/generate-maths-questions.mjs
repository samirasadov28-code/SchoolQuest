/**
 * Generates high-quality 3rd class Irish curriculum maths questions.
 * Pure arithmetic templates — no API needed.
 * Run: node scripts/generate-maths-questions.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FILE = path.join(__dirname, '../src/data/questions/maths.json')

const existing = JSON.parse(fs.readFileSync(FILE, 'utf8'))
const seenQ = new Set(existing.map(q => q.question.toLowerCase().trim()))
const newQs = []

function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }
function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

function makeOptions(correct, wrongs) {
  const opts = [String(correct), ...wrongs.filter(w => String(w) !== String(correct)).slice(0,3)]
  while (opts.length < 4) opts.push(String(correct + opts.length * 7 + 3))
  return shuffle(opts.slice(0,4))
}

function add(q) {
  const text = q.question.toLowerCase().trim()
  if (seenQ.has(text)) return
  seenQ.add(text)
  newQs.push(q)
}

// ─── ADDITION ────────────────────────────────────────────────────────────────
const IRISH_NAMES = ['Aoife','Ciarán','Siobhán','Finn','Niamh','Seán','Róisín','Caoilfhinn','Tadhg','Eimear']
const PLACES = ['Cork','Galway','Limerick','Kilkenny','Sligo','Waterford','Tralee']

function rndName() { return IRISH_NAMES[rnd(0, IRISH_NAMES.length-1)] }

// 2-digit addition no carrying
for (let i = 0; i < 30; i++) {
  const a = rnd(10,49), b = rnd(10,49), ans = a+b
  add({ subject:'maths',topic:'addition',difficulty:1,type:'multiple-choice',
    question:`What is ${a} + ${b}?`,
    options: makeOptions(ans,[ans+1,ans-1,ans+10]),
    answer: String(ans),
    explanation:`${a} + ${b} = ${ans}. Add the units first, then the tens.` })
}
// 3-digit addition
for (let i = 0; i < 30; i++) {
  const a = rnd(100,499), b = rnd(100,499), ans = a+b
  add({ subject:'maths',topic:'addition',difficulty:2,type:'multiple-choice',
    question:`What is ${a} + ${b}?`,
    options: makeOptions(ans,[ans+1,ans-1,ans+10]),
    answer: String(ans),
    explanation:`${a} + ${b} = ${ans}. Line up hundreds, tens and units carefully.` })
}
// Addition with carrying word problems
for (let i = 0; i < 20; i++) {
  const a = rnd(25,99), b = rnd(25,99), ans = a+b
  const name = rndName()
  add({ subject:'maths',topic:'addition',difficulty:2,type:'multiple-choice',
    question:`${name} has ${a} stickers and gets ${b} more. How many does ${name} have now?`,
    options: makeOptions(ans,[ans+2,ans-2,ans+10]),
    answer: String(ans),
    explanation:`${a} + ${b} = ${ans}. Adding what ${name} started with and what they got gives the total.` })
}
// 4-digit addition
for (let i = 0; i < 20; i++) {
  const a = rnd(1000,4999), b = rnd(1000,3999), ans = a+b
  add({ subject:'maths',topic:'addition',difficulty:4,type:'multiple-choice',
    question:`What is ${a} + ${b}?`,
    options: makeOptions(ans,[ans+1,ans-1,ans+100]),
    answer: String(ans),
    explanation:`${a} + ${b} = ${ans}. Work from units through to thousands, carrying where needed.` })
}

// ─── SUBTRACTION ─────────────────────────────────────────────────────────────
for (let i = 0; i < 30; i++) {
  const b = rnd(10,49), a = b + rnd(10,49), ans = a-b
  add({ subject:'maths',topic:'subtraction',difficulty:1,type:'multiple-choice',
    question:`What is ${a} − ${b}?`,
    options: makeOptions(ans,[ans+1,ans-1,ans+10]),
    answer: String(ans),
    explanation:`${a} − ${b} = ${ans}. Start with the units, then subtract the tens.` })
}
for (let i = 0; i < 25; i++) {
  const b = rnd(100,399), a = b + rnd(50,300), ans = a-b
  add({ subject:'maths',topic:'subtraction',difficulty:2,type:'multiple-choice',
    question:`What is ${a} − ${b}?`,
    options: makeOptions(ans,[ans+1,ans-1,ans+10]),
    answer: String(ans),
    explanation:`${a} − ${b} = ${ans}. Don't forget to borrow from the next column if needed.` })
}
for (let i = 0; i < 20; i++) {
  const name = rndName(), b = rnd(15,80), a = b + rnd(20,100), ans = a-b
  add({ subject:'maths',topic:'subtraction',difficulty:2,type:'multiple-choice',
    question:`${name} had ${a} pages to read and has read ${b} pages. How many pages are left?`,
    options: makeOptions(ans,[ans+5,ans-5,ans+1]),
    answer: String(ans),
    explanation:`${a} − ${b} = ${ans} pages left. Subtraction tells us how many remain.` })
}
for (let i = 0; i < 15; i++) {
  const b = rnd(1000,3999), a = b + rnd(500,2000), ans = a-b
  add({ subject:'maths',topic:'subtraction',difficulty:4,type:'multiple-choice',
    question:`What is ${a} − ${b}?`,
    options: makeOptions(ans,[ans+1,ans-1,ans+100]),
    answer: String(ans),
    explanation:`${a} − ${b} = ${ans}. Work column by column from right to left, borrowing where needed.` })
}

// ─── MULTIPLICATION ──────────────────────────────────────────────────────────
const tables = [[2,1,12],[3,1,12],[4,1,12],[5,1,12],[6,1,10],[7,1,10],[8,1,10],[9,1,10],[10,1,12],[11,1,12],[12,1,12]]
for (const [t,mn,mx] of tables) {
  for (let n = mn; n <= mx; n++) {
    const ans = t*n
    add({ subject:'maths',topic:'multiplication',difficulty:n<=5?2:3,type:'multiple-choice',
      question:`What is ${t} × ${n}?`,
      options: makeOptions(ans,[ans+t,ans-t,ans+1]),
      answer: String(ans),
      explanation:`${t} × ${n} = ${ans}. This is the ${t} times table — ${t} groups of ${n}.` })
  }
}
// Arrays / grouping
for (let i = 0; i < 20; i++) {
  const rows = rnd(2,9), cols = rnd(2,9), ans = rows*cols
  add({ subject:'maths',topic:'multiplication',difficulty:2,type:'multiple-choice',
    question:`There are ${rows} rows of seats with ${cols} seats in each row. How many seats altogether?`,
    options: makeOptions(ans,[ans+rows,ans-cols,ans+1]),
    answer: String(ans),
    explanation:`${rows} rows × ${cols} seats = ${ans} seats. Multiplication counts equal groups.` })
}
// 2-digit × 1-digit
for (let i = 0; i < 20; i++) {
  const a = rnd(11,29), b = rnd(2,9), ans = a*b
  add({ subject:'maths',topic:'multiplication',difficulty:3,type:'multiple-choice',
    question:`What is ${a} × ${b}?`,
    options: makeOptions(ans,[ans+b,ans-b,ans+10]),
    answer: String(ans),
    explanation:`${a} × ${b} = ${ans}. Multiply the units by ${b}, then the tens by ${b}.` })
}

// ─── DIVISION ────────────────────────────────────────────────────────────────
for (const [t,,mx] of tables) {
  for (let n = 1; n <= mx; n++) {
    const dividend = t*n
    add({ subject:'maths',topic:'division',difficulty:n<=5?2:3,type:'multiple-choice',
      question:`What is ${dividend} ÷ ${t}?`,
      options: makeOptions(n,[n+1,n-1>0?n-1:n+2,n+t]),
      answer: String(n),
      explanation:`${dividend} ÷ ${t} = ${n}. Division is the opposite of multiplication: ${t} × ${n} = ${dividend}.` })
  }
}
// Division with remainders
for (let i = 0; i < 25; i++) {
  const divisor = rnd(2,9), quotient = rnd(3,12), remainder = rnd(1,divisor-1)
  const dividend = divisor*quotient + remainder
  add({ subject:'maths',topic:'division',difficulty:4,type:'multiple-choice',
    question:`What is ${dividend} ÷ ${divisor}?`,
    options: makeOptions(`${quotient} remainder ${remainder}`,[`${quotient+1} remainder ${remainder}`,`${quotient} remainder ${remainder+1}`,`${quotient-1} remainder ${remainder}`]),
    answer: `${quotient} remainder ${remainder}`,
    explanation:`${dividend} ÷ ${divisor} = ${quotient} remainder ${remainder}. ${divisor} × ${quotient} = ${divisor*quotient}, and ${dividend} − ${divisor*quotient} = ${remainder}.` })
}
// Sharing word problems
for (let i = 0; i < 20; i++) {
  const people = rnd(2,8), each = rnd(3,12), total = people*each
  const name = rndName()
  add({ subject:'maths',topic:'division',difficulty:2,type:'multiple-choice',
    question:`${name} has ${total} sweets and shares them equally among ${people} friends. How many does each friend get?`,
    options: makeOptions(each,[each+1,each-1>0?each-1:each+2,each+people]),
    answer: String(each),
    explanation:`${total} ÷ ${people} = ${each}. Sharing equally means dividing.` })
}

// ─── FRACTIONS ───────────────────────────────────────────────────────────────
// Basic fractions of amounts
const fracPairs = [[2,1],[4,1],[4,3],[3,1],[3,2],[8,1],[8,3],[5,1],[5,2],[6,1],[10,1],[10,3]]
for (const [denom,num] of fracPairs) {
  for (let total = denom*2; total <= denom*12; total += denom) {
    const ans = (total/denom)*num
    add({ subject:'maths',topic:'fractions',difficulty:denom<=4?2:3,type:'multiple-choice',
      question:`What is ${num}/${denom} of ${total}?`,
      options: makeOptions(ans,[ans+num,ans-num>0?ans-num:ans+denom,total/denom]),
      answer: String(ans),
      explanation:`Divide ${total} by ${denom} to get ${total/denom}, then multiply by ${num}: ${total/denom} × ${num} = ${ans}.` })
  }
}
// Equivalent fractions
const equivSets = [[1,2,2,4],[1,2,3,6],[1,4,2,8],[2,4,1,2],[3,6,1,2],[2,8,1,4]]
for (const [n1,d1,n2,d2] of equivSets) {
  add({ subject:'maths',topic:'fractions',difficulty:3,type:'multiple-choice',
    question:`Which fraction is equivalent to ${n1}/${d1}?`,
    options: shuffle([`${n2}/${d2}`,`${n1+1}/${d1}`,`${n2}/${d2+1}`,`${n1}/${d1+2}`]),
    answer: `${n2}/${d2}`,
    explanation:`${n1}/${d1} = ${n2}/${d2}. Multiply (or divide) both numerator and denominator by the same number.` })
}
// Comparing fractions
const compPairs = [[1,2,1,4],[3,4,1,2],[1,3,1,4],[2,3,3,4],[1,8,1,4]]
for (const [n1,d1,n2,d2] of compPairs) {
  const f1dec = n1/d1, f2dec = n2/d2
  const bigger = f1dec > f2dec ? `${n1}/${d1}` : `${n2}/${d2}`
  add({ subject:'maths',topic:'fractions',difficulty:3,type:'multiple-choice',
    question:`Which fraction is larger: ${n1}/${d1} or ${n2}/${d2}?`,
    options: shuffle([`${n1}/${d1}`,`${n2}/${d2}`,'They are equal',`Cannot tell`]),
    answer: bigger,
    explanation:`${n1}/${d1} = ${(n1/d1).toFixed(2)} and ${n2}/${d2} = ${(n2/d2).toFixed(2)}, so ${bigger} is larger.` })
}
// Fractions on number line / ordering
add({ subject:'maths',topic:'fractions',difficulty:2,type:'multiple-choice',
  question:'What fraction is halfway between 0 and 1?',
  options:['1/2','1/4','3/4','1/3'],answer:'1/2',explanation:'Halfway between 0 and 1 is one half (1/2).' })
add({ subject:'maths',topic:'fractions',difficulty:2,type:'multiple-choice',
  question:'A pizza is cut into 8 equal slices. Seán eats 3 slices. What fraction has he eaten?',
  options:['3/8','3/5','5/8','1/3'],answer:'3/8',explanation:'3 slices out of 8 total = 3/8.' })

// ─── MEASUREMENT ─────────────────────────────────────────────────────────────
// Length
const lengthConv = [[100,'cm','1 m',1],[200,'cm','2 m',2],[50,'cm','half a metre',0.5],[1000,'m','1 km',1],[500,'m','half a kilometre',0.5]]
for (const [val,from,to,_] of lengthConv) {
  add({ subject:'maths',topic:'measurement',difficulty:2,type:'multiple-choice',
    question:`How many ${from} are in ${to}?`,
    options: makeOptions(val,[val+10,val-10,val+50]),
    answer: String(val),
    explanation:`There are ${val} ${from} in ${to}. Remember: 100 cm = 1 m, and 1000 m = 1 km.` })
}
for (let i = 0; i < 20; i++) {
  const m = rnd(1,9), extra = rnd(1,99), total = m*100+extra
  add({ subject:'maths',topic:'measurement',difficulty:3,type:'multiple-choice',
    question:`${total} cm is the same as how many metres and centimetres?`,
    options: makeOptions(`${m} m ${extra} cm`,[`${m+1} m ${extra} cm`,`${m} m ${extra+1} cm`,`${m-1} m ${extra} cm`]),
    answer: `${m} m ${extra} cm`,
    explanation:`${total} cm = ${m} m ${extra} cm. Divide by 100 to get metres; the remainder is centimetres.` })
}
// Weight
const weightConv = [[1000,'g','1 kg'],[2000,'g','2 kg'],[500,'g','half a kilogram'],[1500,'g','1.5 kg']]
for (const [val,from,to] of weightConv) {
  add({ subject:'maths',topic:'measurement',difficulty:2,type:'multiple-choice',
    question:`How many ${from} are in ${to}?`,
    options: makeOptions(val,[val+100,val-100,val+500]),
    answer: String(val),
    explanation:`${to} = ${val} ${from}. There are 1,000 grams in every kilogram.` })
}
for (let i = 0; i < 15; i++) {
  const kg = rnd(1,5), g = rnd(100,900), total = kg*1000+g
  add({ subject:'maths',topic:'measurement',difficulty:3,type:'multiple-choice',
    question:`A bag weighs ${total} g. What is this in kg and g?`,
    options: makeOptions(`${kg} kg ${g} g`,[`${kg+1} kg ${g} g`,`${kg} kg ${g+100} g`,`${kg} kg ${g-100} g`]),
    answer: `${kg} kg ${g} g`,
    explanation:`${total} g = ${kg} kg ${g} g. Divide by 1000 for kg; the rest stays as grams.` })
}
// Capacity
const capConv = [[1000,'ml','1 litre'],[500,'ml','half a litre'],[2000,'ml','2 litres'],[1500,'ml','1.5 litres']]
for (const [val,from,to] of capConv) {
  add({ subject:'maths',topic:'measurement',difficulty:2,type:'multiple-choice',
    question:`How many ${from} are in ${to}?`,
    options: makeOptions(val,[val+100,val-100,val+250]),
    answer: String(val),
    explanation:`${to} = ${val} ${from}. There are 1,000 ml in every litre.` })
}
// Perimeter & area (3rd class introduction)
for (let i = 0; i < 15; i++) {
  const l = rnd(3,12), w = rnd(3,12), p = 2*(l+w)
  add({ subject:'maths',topic:'measurement',difficulty:3,type:'multiple-choice',
    question:`A rectangle is ${l} cm long and ${w} cm wide. What is its perimeter?`,
    options: makeOptions(p,[p+2,p-2,l+w]),
    answer: String(p),
    explanation:`Perimeter = 2 × (length + width) = 2 × (${l} + ${w}) = 2 × ${l+w} = ${p} cm.` })
}
for (let i = 0; i < 10; i++) {
  const s = rnd(3,12), p = 4*s
  add({ subject:'maths',topic:'measurement',difficulty:2,type:'multiple-choice',
    question:`A square has sides of ${s} cm. What is its perimeter?`,
    options: makeOptions(p,[p+s,p-s,s*s]),
    answer: String(p),
    explanation:`A square has 4 equal sides: ${s} + ${s} + ${s} + ${s} = ${p} cm.` })
}

// ─── SHAPES ──────────────────────────────────────────────────────────────────
const shape2D = [
  ['triangle',3,'polygon','straight'],['square',4,'quadrilateral','equal'],
  ['rectangle',4,'quadrilateral','two pairs of equal sides'],['pentagon',5,'polygon','5 straight sides'],
  ['hexagon',6,'polygon','6 straight sides'],['heptagon',7,'polygon','7 straight sides'],
  ['octagon',8,'polygon','8 straight sides'],['circle',0,'not a polygon','curved side'],
]
for (const [name,sides,type,note] of shape2D) {
  if (sides > 0) {
    add({ subject:'maths',topic:'shapes',difficulty:1,type:'multiple-choice',
      question:`How many sides does a ${name} have?`,
      options: makeOptions(sides,[sides+1,sides-1,sides+2]),
      answer: String(sides),
      explanation:`A ${name} has ${sides} sides. It is a ${type} with ${note}.` })
    add({ subject:'maths',topic:'shapes',difficulty:2,type:'multiple-choice',
      question:`How many angles (corners) does a ${name} have?`,
      options: makeOptions(sides,[sides+1,sides-1,sides+2]),
      answer: String(sides),
      explanation:`A ${name} has ${sides} angles — the same number as its sides.` })
  }
}
// 3D shapes
const shape3D = [
  ['cube',6,12,8,'a square on every face'],
  ['cuboid',6,12,8,'rectangular faces'],
  ['sphere',1,0,0,'a perfectly round ball — no edges or vertices'],
  ['cylinder',3,2,0,'two circular faces and one curved face'],
  ['cone',2,1,1,'one circular base and one curved face'],
  ['triangular prism',5,9,6,'two triangular and three rectangular faces'],
  ['square-based pyramid',5,8,5,'a square base and four triangular faces'],
]
for (const [name,faces,edges,vertices,note] of shape3D) {
  add({ subject:'maths',topic:'shapes',difficulty:2,type:'multiple-choice',
    question:`How many faces does a ${name} have?`,
    options: makeOptions(faces,[faces+1,faces-1>0?faces-1:faces+2,faces+2]),
    answer: String(faces),
    explanation:`A ${name} has ${faces} face${faces!==1?'s':''} — ${note}.` })
  if (edges>0) add({ subject:'maths',topic:'shapes',difficulty:3,type:'multiple-choice',
    question:`How many edges does a ${name} have?`,
    options: makeOptions(edges,[edges+1,edges-1,edges+2]),
    answer: String(edges),
    explanation:`A ${name} has ${edges} edges where two faces meet.` })
}
// Symmetry
const symShapes = [['square',4],['rectangle',2],['equilateral triangle',3],['circle','infinite'],['regular hexagon',6]]
for (const [name,lines] of symShapes) {
  add({ subject:'maths',topic:'shapes',difficulty:3,type:'multiple-choice',
    question:`How many lines of symmetry does a ${name} have?`,
    options: String(lines)==='infinite'
      ? shuffle(['Infinite (many)','1','2','4'])
      : makeOptions(lines,[lines+1,lines-1>=0?lines-1:lines+1,lines+2]),
    answer: String(lines)==='infinite'?'Infinite (many)':String(lines),
    explanation:`A ${name} has ${lines} line${lines!==1&&lines!=='infinite'?'s':''} of symmetry — you can fold it ${lines==='infinite'?'in any direction through the centre':lines+' time'+(lines!==1?'s':'')+' and both halves match exactly'}.` })
}

// ─── TIME ─────────────────────────────────────────────────────────────────────
const clockTimes = [
  ['3:00','three o\'clock'],['6:30','half past six'],['9:15','quarter past nine'],
  ['4:45','quarter to five'],['7:00','seven o\'clock'],['12:00','noon (midday)'],
  ['8:30','half past eight'],['11:15','quarter past eleven'],['2:45','quarter to three'],
  ['1:00','one o\'clock'],['5:30','half past five'],['10:15','quarter past ten'],
]
for (const [digital,analogue] of clockTimes) {
  add({ subject:'maths',topic:'time',difficulty:1,type:'multiple-choice',
    question:`A clock shows ${analogue}. What is this in digital time?`,
    options: shuffle([digital, digital.replace(':','').slice(0,2)+':'+(parseInt(digital.split(':')[1]||0)+15).toString().padStart(2,'0'), digital.split(':')[0]+':00', '0'+digital]),
    answer: digital,
    explanation:`${analogue} = ${digital} in digital time.` })
}
// Duration
const durations = [
  [60,'1 hour','60 minutes'],
  [90,'one and a half hours','90 minutes'],
  [120,'2 hours','120 minutes'],
  [30,'half an hour','30 minutes'],
  [45,'three-quarters of an hour','45 minutes'],
  [24,'1 day','24 hours'],
  [7,'1 week','7 days'],
  [365,'1 year','365 days'],
  [60,'1 minute','60 seconds'],
  [12,'1 year','12 months'],
]
for (const [val,period,unit] of durations) {
  add({ subject:'maths',topic:'time',difficulty:2,type:'multiple-choice',
    question:`How many ${unit.replace(/\d+ /,'')} are in ${period}?`,
    options: makeOptions(val,[val+5,val-5,val+10]),
    answer: String(val),
    explanation:`There are ${val} ${unit.replace(/\d+ /,'')} in ${period}.` })
}
// Time elapsed
for (let i = 0; i < 20; i++) {
  const startH = rnd(1,11), startM = [0,15,30,45][rnd(0,3)], durM = [15,20,25,30,40,45,60][rnd(0,6)]
  const totalM = startH*60+startM+durM
  const endH = Math.floor(totalM/60)%12||12, endM = totalM%60
  const startStr = `${startH}:${String(startM).padStart(2,'0')}`
  const endStr = `${endH}:${String(endM).padStart(2,'0')}`
  add({ subject:'maths',topic:'time',difficulty:3,type:'multiple-choice',
    question:`A film starts at ${startStr} and lasts ${durM} minutes. What time does it end?`,
    options: makeOptions(endStr,[`${endH}:${String((endM+5)%60).padStart(2,'0')}`,`${endH>1?endH-1:12}:${String(endM).padStart(2,'0')}`,`${(endH%12)+1}:${String(endM).padStart(2,'0')}`]),
    answer: endStr,
    explanation:`${startStr} + ${durM} minutes = ${endStr}. Count on ${durM} minutes from the start time.` })
}
// Calendar
add({ subject:'maths',topic:'time',difficulty:1,type:'multiple-choice',question:'How many months are in a year?',options:['12','10','11','13'],answer:'12',explanation:'There are 12 months in a year, from January to December.' })
add({ subject:'maths',topic:'time',difficulty:1,type:'multiple-choice',question:'How many days are in a week?',options:['7','5','6','8'],answer:'7',explanation:'There are 7 days in a week: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday.' })
add({ subject:'maths',topic:'time',difficulty:2,type:'multiple-choice',question:'Which month comes after March?',options:['April','May','February','June'],answer:'April',explanation:'The months in order are January, February, March, April, May, June...' })
add({ subject:'maths',topic:'time',difficulty:2,type:'multiple-choice',question:'How many days are in February in a leap year?',options:['29','28','30','27'],answer:'29',explanation:'Normally February has 28 days, but in a leap year (every 4 years) it has 29 days.' })

// ─── PLACE VALUE ─────────────────────────────────────────────────────────────
for (let i = 0; i < 20; i++) {
  const h = rnd(1,9), t = rnd(0,9), u = rnd(0,9), n = h*100+t*10+u
  add({ subject:'maths',topic:'place-value',difficulty:2,type:'multiple-choice',
    question:`In the number ${n}, what is the value of the digit ${h}?`,
    options: makeOptions(h*100,[h*10,h,h*1000]),
    answer: String(h*100),
    explanation:`In ${n}, the digit ${h} is in the hundreds place, so its value is ${h*100}.` })
}
for (let i = 0; i < 20; i++) {
  const th = rnd(1,9), h = rnd(0,9), t = rnd(0,9), u = rnd(0,9), n = th*1000+h*100+t*10+u
  add({ subject:'maths',topic:'place-value',difficulty:3,type:'multiple-choice',
    question:`What is the value of the digit ${th} in the number ${n}?`,
    options: makeOptions(th*1000,[th*100,th*10,th]),
    answer: String(th*1000),
    explanation:`In ${n}, the digit ${th} is in the thousands place, so its value is ${th*1000}.` })
}
// Rounding
for (let i = 0; i < 25; i++) {
  const n = rnd(10,99)
  const rounded = Math.round(n/10)*10
  add({ subject:'maths',topic:'place-value',difficulty:2,type:'multiple-choice',
    question:`Round ${n} to the nearest 10.`,
    options: makeOptions(rounded,[rounded+10,rounded-10,(Math.floor(n/10))*10+5]),
    answer: String(rounded),
    explanation:`${n} rounded to the nearest 10 is ${rounded}. Look at the units digit — if it's 5 or more, round up; if it's 4 or less, round down.` })
}
for (let i = 0; i < 20; i++) {
  const n = rnd(100,999)
  const rounded = Math.round(n/100)*100
  add({ subject:'maths',topic:'place-value',difficulty:3,type:'multiple-choice',
    question:`Round ${n} to the nearest 100.`,
    options: makeOptions(rounded,[rounded+100,rounded-100>=0?rounded-100:rounded+200,Math.floor(n/100)*100+50]),
    answer: String(rounded),
    explanation:`${n} rounded to the nearest 100 is ${rounded}. Look at the tens digit to decide which hundred it's closest to.` })
}
// Ordering numbers
for (let i = 0; i < 15; i++) {
  const nums = Array.from({length:4},()=>rnd(100,999)).sort((a,b)=>a-b)
  const shuffled = shuffle(nums)
  add({ subject:'maths',topic:'place-value',difficulty:2,type:'multiple-choice',
    question:`Put these numbers in order from smallest to largest: ${shuffled.join(', ')}`,
    options: shuffle([nums.join(', '),nums.slice().reverse().join(', '),shuffle(nums).join(', '),shuffle(nums).join(', ')]),
    answer: nums.join(', '),
    explanation:`${nums.join(', ')} — compare the hundreds first, then tens, then units.` })
}

// ─── MONEY ──────────────────────────────────────────────────────────────────
// Euro/cent basics
const euroPairs = [[100,'cent','€1'],[200,'cent','€2'],[50,'cent','50c']]
for (const [val,from,to] of euroPairs) {
  add({ subject:'maths',topic:'money',difficulty:1,type:'multiple-choice',
    question:`How many ${from} are in ${to}?`,
    options: makeOptions(val,[val+10,val-10,val+50]),
    answer: String(val),
    explanation:`${to} = ${val} ${from}. There are 100 cent in every euro.` })
}
// Adding prices
for (let i = 0; i < 30; i++) {
  const a = rnd(1,9)*100 + rnd(0,9)*10, b = rnd(1,9)*100 + rnd(0,9)*10
  const aStr = `€${(a/100).toFixed(2)}`, bStr = `€${(b/100).toFixed(2)}`
  const total = a+b, totStr = `€${(total/100).toFixed(2)}`
  add({ subject:'maths',topic:'money',difficulty:2,type:'multiple-choice',
    question:`${rndName()} buys an item for ${aStr} and another for ${bStr}. How much did they spend in total?`,
    options: makeOptions(totStr,[`€${((total+100)/100).toFixed(2)}`,`€${((total-50)/100).toFixed(2)}`,`€${((total+50)/100).toFixed(2)}`]),
    answer: totStr,
    explanation:`${aStr} + ${bStr} = ${totStr}. Add the euro amounts, then the cent.` })
}
// Change
for (let i = 0; i < 25; i++) {
  const paid = (rnd(2,10))*100, cost = rnd(50,paid-50)
  const change = paid-cost
  const paidStr = `€${(paid/100).toFixed(2)}`, costStr = `€${(cost/100).toFixed(2)}`, changeStr = `€${(change/100).toFixed(2)}`
  add({ subject:'maths',topic:'money',difficulty:3,type:'multiple-choice',
    question:`You pay ${paidStr} for something that costs ${costStr}. How much change do you get?`,
    options: makeOptions(changeStr,[`€${((change+10)/100).toFixed(2)}`,`€${((change-10)/100).toFixed(2)}`,`€${((change+50)/100).toFixed(2)}`]),
    answer: changeStr,
    explanation:`${paidStr} − ${costStr} = ${changeStr} change. Subtract the cost from the amount paid.` })
}

// ─── MENTAL MATHS ───────────────────────────────────────────────────────────
// Number bonds to 10 / 20 / 100
for (let n = 1; n <= 9; n++) {
  add({ subject:'maths',topic:'mental-maths',difficulty:1,type:'multiple-choice',
    question:`${n} + ? = 10`,
    options: makeOptions(10-n,[10-n+1,10-n-1,n]),
    answer: String(10-n),
    explanation:`${n} + ${10-n} = 10. These are number bonds to 10 — knowing them makes addition fast!` })
}
for (let n = 1; n <= 19; n++) {
  add({ subject:'maths',topic:'mental-maths',difficulty:1,type:'multiple-choice',
    question:`${n} + ? = 20`,
    options: makeOptions(20-n,[20-n+1,20-n-1,n]),
    answer: String(20-n),
    explanation:`${n} + ${20-n} = 20. Number bonds to 20 are very useful for quick calculations.` })
}
// Doubles and halves
for (let n = 1; n <= 25; n++) {
  add({ subject:'maths',topic:'mental-maths',difficulty:1,type:'multiple-choice',
    question:`What is double ${n}?`,
    options: makeOptions(2*n,[2*n+1,2*n-1,2*n+2]),
    answer: String(2*n),
    explanation:`Double ${n} = ${n} + ${n} = ${2*n}.` })
}
for (let n = 1; n <= 20; n++) {
  add({ subject:'maths',topic:'mental-maths',difficulty:1,type:'multiple-choice',
    question:`What is half of ${n*2}?`,
    options: makeOptions(n,[n+1,n-1>=1?n-1:n+2,n+2]),
    answer: String(n),
    explanation:`Half of ${n*2} = ${n*2} ÷ 2 = ${n}.` })
}
// Quick rounding for mental calculation
for (let i = 0; i < 20; i++) {
  const a = rnd(18,99), b = rnd(1,5), ans = a+b
  add({ subject:'maths',topic:'mental-maths',difficulty:2,type:'multiple-choice',
    question:`What is ${a} + ${b}? (Think: round ${a} to the nearest 10 first!)`,
    options: makeOptions(ans,[ans+1,ans-1,ans+10]),
    answer: String(ans),
    explanation:`${a} + ${b} = ${ans}. You can round ${a} to ${Math.round(a/10)*10}, add ${b}, then adjust.` })
}

// ─── WORD PROBLEMS ──────────────────────────────────────────────────────────
// Multi-step addition/subtraction
for (let i = 0; i < 20; i++) {
  const a = rnd(20,100), b = rnd(10,50), c = rnd(5,30), ans = a+b-c
  if (ans <= 0) continue
  const name = rndName()
  add({ subject:'maths',topic:'word-problems',difficulty:3,type:'multiple-choice',
    question:`${name} has ${a} marbles, wins ${b} more, then gives ${c} to a friend. How many marbles does ${name} have now?`,
    options: makeOptions(ans,[ans+b,ans+c,a+b]),
    answer: String(ans),
    explanation:`${a} + ${b} = ${a+b} marbles, then ${a+b} − ${c} = ${ans} marbles left.` })
}
// Multiplication word problems
for (let i = 0; i < 20; i++) {
  const bags = rnd(2,9), perBag = rnd(3,12), ans = bags*perBag
  add({ subject:'maths',topic:'word-problems',difficulty:2,type:'multiple-choice',
    question:`There are ${bags} bags with ${perBag} apples in each bag. How many apples are there altogether?`,
    options: makeOptions(ans,[ans+perBag,ans-bags,bags+perBag]),
    answer: String(ans),
    explanation:`${bags} × ${perBag} = ${ans} apples. Multiplication is the quickest way to count equal groups.` })
}
// Mixed operations
for (let i = 0; i < 15; i++) {
  const price = rnd(50,200), qty = rnd(2,5), paid = (Math.ceil((price*qty)/100)+1)*100
  const total = price*qty, change = paid-total
  const pricStr = `€${(price/100).toFixed(2)}`
  add({ subject:'maths',topic:'word-problems',difficulty:4,type:'multiple-choice',
    question:`${rndName()} buys ${qty} books at ${pricStr} each and pays with €${paid/100}. How much change does ${rndName()} get?`,
    options: makeOptions(`€${(change/100).toFixed(2)}`,[`€${((change+50)/100).toFixed(2)}`,`€${((change-50)/100).toFixed(2)}`,`€${(total/100).toFixed(2)}`]),
    answer: `€${(change/100).toFixed(2)}`,
    explanation:`${qty} × ${pricStr} = €${(total/100).toFixed(2)}. Change = €${paid/100} − €${(total/100).toFixed(2)} = €${(change/100).toFixed(2)}.` })
}
// Fraction word problems
for (let i = 0; i < 15; i++) {
  const denom = [2,4,5,8,10][rnd(0,4)], total = denom * rnd(3,10)
  const frac = [1,rnd(1,denom-1)][rnd(0,1)], ans = (total/denom)*frac
  const name = rndName()
  add({ subject:'maths',topic:'word-problems',difficulty:3,type:'multiple-choice',
    question:`${name} has ${total} sweets and eats ${frac}/${denom} of them. How many sweets did ${name} eat?`,
    options: makeOptions(ans,[ans+frac,ans-frac>0?ans-frac:ans+denom,total-ans]),
    answer: String(ans),
    explanation:`${frac}/${denom} of ${total} = ${total/denom} × ${frac} = ${ans} sweets.` })
}

// ─── DATA ────────────────────────────────────────────────────────────────────
// Reading tally / bar chart values
const datasets = [
  {label:'favourite sports',items:[['Football',12],['Hurling',8],['Swimming',5],['Basketball',10],['Tennis',3]]},
  {label:'books read',items:[['Aoife',7],['Seán',4],['Niamh',9],['Ciarán',6],['Róisín',11]]},
  {label:'pets owned',items:[['Dogs',15],['Cats',11],['Fish',7],['Rabbits',4],['Birds',3]]},
  {label:'favourite colours',items:[['Blue',9],['Green',6],['Red',8],['Yellow',5],['Purple',7]]},
]
for (const ds of datasets) {
  const sorted = [...ds.items].sort((a,b)=>b[1]-a[1])
  const max = sorted[0], min = sorted[sorted.length-1]
  const total = ds.items.reduce((s,x)=>s+x[1],0)
  const mode = max[0]
  const range = max[1]-min[1]
  add({ subject:'maths',topic:'data',difficulty:2,type:'multiple-choice',
    question:`A survey shows ${ds.label}: ${ds.items.map(([l,v])=>`${l}: ${v}`).join(', ')}. Which category has the most?`,
    options: shuffle(ds.items.map(([l])=>l)),
    answer: max[0],
    explanation:`${max[0]} has ${max[1]} — the highest number in the ${ds.label} survey.` })
  add({ subject:'maths',topic:'data',difficulty:2,type:'multiple-choice',
    question:`Using this data (${ds.label}: ${ds.items.map(([l,v])=>`${l}:${v}`).join(', ')}), what is the total number surveyed?`,
    options: makeOptions(total,[total+5,total-3,total+10]),
    answer: String(total),
    explanation:`Add all values: ${ds.items.map(([,v])=>v).join(' + ')} = ${total}.` })
  add({ subject:'maths',topic:'data',difficulty:3,type:'multiple-choice',
    question:`Using this data (${ds.label}: ${ds.items.map(([l,v])=>`${l}:${v}`).join(', ')}), what is the range?`,
    options: makeOptions(range,[range+1,range-1,max[1]]),
    answer: String(range),
    explanation:`Range = highest − lowest = ${max[1]} − ${min[1]} = ${range}.` })
  add({ subject:'maths',topic:'data',difficulty:2,type:'multiple-choice',
    question:`In the ${ds.label} data (${ds.items.map(([l,v])=>`${l}:${v}`).join(', ')}), what is the mode (most common)?`,
    options: shuffle(ds.items.map(([l])=>l)),
    answer: mode,
    explanation:`The mode is the value that appears most — ${mode} has ${max[1]}, the highest count.` })
}
// Mean (simple)
const meanSets = [[4,6,8],[3,5,7,9],[10,14,12],[5,10,15,20],[2,4,6,8,10]]
for (const set of meanSets) {
  const mean = set.reduce((a,b)=>a+b,0)/set.length
  if (!Number.isInteger(mean)) continue
  add({ subject:'maths',topic:'data',difficulty:4,type:'multiple-choice',
    question:`What is the mean (average) of: ${set.join(', ')}?`,
    options: makeOptions(mean,[mean+1,mean-1,mean+2]),
    answer: String(mean),
    explanation:`Add all values: ${set.join('+')}=${set.reduce((a,b)=>a+b,0)}, then divide by ${set.length}: ${set.reduce((a,b)=>a+b,0)}÷${set.length}=${mean}.` })
}
// Chart questions
add({ subject:'maths',topic:'data',difficulty:1,type:'multiple-choice',question:'What does the x-axis of a bar chart usually show?',options:['The categories or labels','The numbers (values)','The title of the chart','The key or legend'],answer:'The categories or labels',explanation:'The x-axis (horizontal axis) shows the categories — like names of sports or days of the week.' })
add({ subject:'maths',topic:'data',difficulty:1,type:'multiple-choice',question:'What does the y-axis of a bar chart usually show?',options:['The numbers (values)','The categories or labels','The title of the chart','The key or legend'],answer:'The numbers (values)',explanation:'The y-axis (vertical axis) shows the numbers — how many of each category there are.' })
add({ subject:'maths',topic:'data',difficulty:2,type:'multiple-choice',question:'What type of chart uses pictures or symbols to represent data?',options:['Pictogram','Bar chart','Line graph','Pie chart'],answer:'Pictogram',explanation:'A pictogram uses pictures or symbols, where each picture represents a certain number of items.' })
add({ subject:'maths',topic:'data',difficulty:2,type:'multiple-choice',question:'In a tally chart, what does "IIII" with a line through it represent?',options:['5','4','6','10'],answer:'5',explanation:'In tally charts, you make 4 marks then cross through them for the 5th — this makes counting in fives easy.' })

// ── Assign IDs and merge ───────────────────────────────────────────────────
const topicCounters = {}
existing.forEach(q => {
  const t = q.topic; topicCounters[t] = (topicCounters[t]||0) + 1
})
newQs.forEach(q => {
  const t = q.topic
  topicCounters[t] = (topicCounters[t]||0) + 1
  q.id = `mat-${t}-${String(topicCounters[t]).padStart(3,'0')}`
})

const all = [...existing, ...newQs]
fs.writeFileSync(FILE, JSON.stringify(all, null, 2))

// Summary
const finalTopics = {}
all.forEach(q => { finalTopics[q.topic] = (finalTopics[q.topic]||0)+1 })
console.log('\n✅ Maths questions updated:')
Object.entries(finalTopics).sort((a,b)=>a[0].localeCompare(b[0])).forEach(([t,n])=>console.log(`  ${t}: ${n}`))
console.log(`\nTotal: ${all.length} (was ${existing.length}, added ${newQs.length})`)
