/**
 * generate-maths-questions.mjs
 * Generates Irish primary school 3rd class maths questions and appends to maths.json.
 * Uses deterministic template functions (no Math.random(), no API calls).
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MATHS_FILE = join(__dirname, '../src/data/questions/maths.json');

const existing = JSON.parse(readFileSync(MATHS_FILE, 'utf8'));

const existingQuestions = new Set(existing.map(q => q.question.trim().toLowerCase()));
const existingIds = new Set(existing.map(q => q.id));

const maxIds = {};
existing.forEach(q => {
  const parts = q.id.split('-');
  const num = parseInt(parts[parts.length - 1]);
  const prefix = parts.slice(0, parts.length - 1).join('-');
  if (!maxIds[prefix] || num > maxIds[prefix]) maxIds[prefix] = num;
});

function nextId(prefix) {
  if (!maxIds[prefix]) maxIds[prefix] = 0;
  maxIds[prefix]++;
  return `${prefix}-${String(maxIds[prefix]).padStart(3, '0')}`;
}

function makeQ(prefix, topic, difficulty, question, options, answer, explanation) {
  return { id: nextId(prefix), subject: 'maths', topic, difficulty, type: 'multiple-choice', question, options, answer, explanation };
}

const allNew = [];

function addQ(q) {
  const key = q.question.trim().toLowerCase();
  if (!existingQuestions.has(key) && !existingIds.has(q.id)) {
    existingQuestions.add(key);
    existingIds.add(q.id);
    allNew.push(q);
  }
}

function makeOpts(correct, delta1, delta2) {
  const c = parseInt(correct);
  const candidates = [c+delta1, c-delta1, c+delta2, c-delta2, c+delta1*2, c-delta2*2, c+delta1*3, c+delta2*3, c+17, c+23];
  const wrong = candidates.filter(x => x !== c && x >= 0).filter((x,i,arr) => arr.indexOf(x)===i);
  const pos = c % 4;
  const arr = [String(wrong[0]??c+11), String(wrong[1]??c+13), String(wrong[2]??c+19)];
  arr.splice(pos, 0, String(c));
  // guarantee uniqueness
  const seen = new Set();
  const final = [];
  arr.slice(0,4).forEach(x => { if(!seen.has(x)){seen.add(x);final.push(x);} });
  let extra = c + 29;
  while(final.length < 4){ const s=String(extra++); if(!seen.has(s)){seen.add(s);final.push(s);} }
  return final;
}

function rot4(arr, ans) {
  const idx = arr.indexOf(ans);
  if (idx < 0) { arr[0] = ans; return arr.slice(0,4); }
  const pos = ans.length % 4;
  return [...arr.slice(pos), ...arr.slice(0, pos)].slice(0,4);
}

// ─── ADDITION ───────────────────────────────────────────────────────────────
function genAddition() {
  const P = 'mth-add', T = 'addition';
  const singles = [[3,4],[5,2],[6,3],[7,1],[4,4],[8,1],[5,3],[6,6],[7,2],[9,0],[8,2],[4,5],[3,6],[9,1],[7,3],[2,8],[1,9],[5,5],[6,2],[3,7]];
  singles.forEach(([a,b]) => {
    const ans = a+b;
    addQ(makeQ(P,T,1,`What is ${a} + ${b}?`,makeOpts(ans,1,2),String(ans),`${a} + ${b} = ${ans}. Count on from the bigger number!`));
  });
  const noCarry = [[23,14],[31,25],[42,13],[50,27],[11,36],[40,19],[22,35],[13,44],[30,28],[61,12],[20,45],[34,13],[43,21],[52,16],[11,48],[60,13],[25,34],[41,22],[33,51],[14,53]];
  noCarry.forEach(([a,b]) => {
    const ans = a+b;
    addQ(makeQ(P,T,2,`What is ${a} + ${b}?`,makeOpts(ans,1,2),String(ans),`${a} + ${b} = ${ans}. Add the ones, then the tens!`));
  });
  const withCarry = [[27,15],[38,24],[46,17],[55,28],[37,46],[29,33],[48,15],[56,27],[39,44],[67,18],[28,43],[47,26],[59,13],[36,47],[48,34],[29,46],[37,55],[68,14],[49,23],[57,35]];
  withCarry.forEach(([a,b]) => {
    const ans = a+b;
    addQ(makeQ(P,T,3,`What is ${a} + ${b}?`,makeOpts(ans,1,2),String(ans),`${a} + ${b} = ${ans}. Carry the ten when the ones add up past 9!`));
  });
  const threeD = [[123,145],[234,251],[315,162],[421,238],[132,254],[203,345],[412,163],[325,142],[214,263],[331,245],[142,325],[263,214],[312,245],[421,136],[233,254],[145,232],[263,124],[314,253],[421,165],[232,345]];
  threeD.forEach(([a,b]) => {
    const ans = a+b;
    addQ(makeQ(P,T,4,`What is ${a} + ${b}?`,makeOpts(ans,2,5),String(ans),`${a} + ${b} = ${ans}. Work column by column!`));
  });
  const threeNums = [[4,5,3],[6,2,7],[8,3,4],[5,5,5],[7,2,6],[3,8,4],[9,1,5],[4,6,7],[2,8,3],[5,7,4],[6,3,8],[1,9,6],[7,4,5],[3,6,8],[8,2,7],[4,7,6],[5,6,9],[3,7,8],[6,4,7],[8,5,4]];
  threeNums.forEach(([a,b,c]) => {
    const ans = a+b+c;
    addQ(makeQ(P,T,2,`What is ${a} + ${b} + ${c}?`,makeOpts(ans,1,2),String(ans),`${a} + ${b} = ${a+b}, then + ${c} = ${ans}!`));
  });
  const ctx = [[12,15,'Aoife','stickers','Dublin'],[23,34,'Ciarán','pages','Cork'],[45,32,'Síle','steps','Galway'],[18,24,'Liam','books','Limerick'],[36,28,'Niamh','flowers','Sligo'],[47,35,'Seán','cards','Dublin'],[29,43,'Oisín','marbles','Cork'],[56,27,'Aoife','beads','Galway'],[34,19,'Ciarán','seeds','Limerick'],[22,48,'Niamh','stickers','Sligo']];
  ctx.forEach(([a,b,name,item,place]) => {
    const ans = a+b;
    addQ(makeQ(P,T,2,`${name} from ${place} collected ${a} ${item} on Monday and ${b} ${item} on Tuesday. How many ${item} altogether?`,makeOpts(ans,1,2),String(ans),`${a} + ${b} = ${ans} ${item} in total!`));
  });
}

// ─── SUBTRACTION ────────────────────────────────────────────────────────────
function genSubtraction() {
  const P = 'mth-sub', T = 'subtraction';
  const singles = [[9,3],[8,5],[7,2],[6,4],[10,6],[8,3],[9,7],[7,4],[6,2],[8,6],[9,4],[10,7],[7,3],[8,1],[9,5],[10,4],[6,1],[7,6],[10,3],[9,2]];
  singles.forEach(([a,b]) => {
    const ans = a-b;
    addQ(makeQ(P,T,1,`What is ${a} − ${b}?`,makeOpts(ans,1,2),String(ans),`${a} − ${b} = ${ans}. Count back from ${a}!`));
  });
  const noB = [[57,23],[68,35],[79,42],[85,43],[96,54],[74,31],[63,22],[87,45],[59,36],[78,43],[94,62],[65,34],[83,51],[72,41],[91,60],[58,24],[76,32],[89,53],[95,64],[67,41]];
  noB.forEach(([a,b]) => {
    const ans = a-b;
    addQ(makeQ(P,T,2,`What is ${a} − ${b}?`,makeOpts(ans,1,2),String(ans),`${a} − ${b} = ${ans}. Subtract ones first, then tens!`));
  });
  const withB = [[52,17],[63,28],[74,39],[85,47],[93,56],[72,34],[61,25],[83,47],[94,58],[71,36],[62,28],[53,17],[84,39],[75,46],[91,54],[64,28],[73,37],[82,46],[95,68],[61,37]];
  withB.forEach(([a,b]) => {
    const ans = a-b;
    addQ(makeQ(P,T,3,`What is ${a} − ${b}?`,makeOpts(ans,1,2),String(ans),`${a} − ${b} = ${ans}. Borrow from the tens column when needed!`));
  });
  const threeD = [[456,231],[578,342],[693,451],[784,362],[865,423],[734,512],[621,314],[847,525],[963,641],[752,431],[843,522],[674,351],[935,614],[786,453],[647,325],[845,312],[763,241],[954,632],[876,543],[745,321]];
  threeD.forEach(([a,b]) => {
    const ans = a-b;
    addQ(makeQ(P,T,4,`What is ${a} − ${b}?`,makeOpts(ans,2,5),String(ans),`${a} − ${b} = ${ans}. Work right to left!`));
  });
  const ctx = [[45,18,'Niamh','sweets','Cork'],[73,29,'Seán','points','Dublin'],[82,35,'Aoife','stickers','Galway'],[61,24,'Ciarán','pages','Limerick'],[94,47,'Síle','steps','Sligo'],[56,28,'Liam','cards','Dublin'],[83,36,'Oisín','marbles','Cork'],[72,45,'Aoife','beads','Galway'],[65,38,'Seán','seeds','Limerick'],[91,54,'Niamh','flowers','Sligo']];
  ctx.forEach(([a,b,name,item,place]) => {
    const ans = a-b;
    addQ(makeQ(P,T,3,`${name} from ${place} had ${a} ${item} and gave away ${b}. How many ${item} are left?`,makeOpts(ans,1,2),String(ans),`${a} − ${b} = ${ans} ${item} remaining!`));
  });
}

// ─── MULTIPLICATION ─────────────────────────────────────────────────────────
function genMultiplication() {
  const P = 'mth-mult', T = 'multiplication';
  for (let table = 2; table <= 12; table++) {
    for (let mult = 1; mult <= 12; mult++) {
      const ans = table * mult;
      addQ(makeQ(P,T,table<=5?1:table<=9?2:3,`What is ${table} × ${mult}?`,makeOpts(ans,2,4),String(ans),`${table} × ${mult} = ${ans}. Count in ${table}s to check!`));
    }
  }
  const arrays = [[4,6,'rows','chairs'],[3,7,'rows','eggs'],[5,8,'rows','flowers'],[4,9,'shelves','books'],[6,5,'trays','cakes'],[3,8,'bags','apples'],[7,4,'boxes','pencils'],[5,6,'plates','biscuits'],[8,3,'rows','seats'],[9,4,'packets','sweets'],[6,7,'pots','seeds'],[4,11,'jars','marbles']];
  arrays.forEach(([rows,cols,word,item]) => {
    const ans = rows*cols;
    addQ(makeQ(P,T,2,`There are ${rows} ${word} of ${cols} ${item}. How many ${item} altogether?`,makeOpts(ans,2,4),String(ans),`${rows} × ${cols} = ${ans}. Rows × columns = total!`));
  });
  const ctx = [[6,'Síle','bags',8,'apples','Galway'],[7,'Oisín','boxes',5,'crayons','Dublin'],[9,'Aoife','trays',4,'buns','Cork'],[3,'Ciarán','shelves',12,'books','Limerick'],[4,'Niamh','packs',11,'cards','Sligo'],[8,'Seán','rows',6,'chairs','Dublin'],[4,'Liam','buckets',9,'shells','Galway'],[5,'Aoife','jars',7,'sweets','Cork'],[3,'Oisín','strips',11,'stickers','Limerick'],[6,'Síle','pages',8,'questions','Dublin'],[7,'Ciarán','bags',5,'rolls','Cork'],[4,'Niamh','trays',12,'muffins','Galway']];
  ctx.forEach(([n,name,container,each,item,place]) => {
    const ans = n*each;
    addQ(makeQ(P,T,2,`${name} from ${place} has ${n} ${container}, each with ${each} ${item}. How many ${item} in total?`,makeOpts(ans,2,4),String(ans),`${n} × ${each} = ${ans} ${item}!`));
  });
}

// ─── DIVISION ───────────────────────────────────────────────────────────────
function genDivision() {
  const P = 'mth-div', T = 'division';
  for (let divisor = 2; divisor <= 12; divisor++) {
    for (let quotient = 1; quotient <= 10; quotient++) {
      const dividend = divisor * quotient;
      addQ(makeQ(P,T,divisor<=4?1:divisor<=7?2:3,`What is ${dividend} ÷ ${divisor}?`,makeOpts(quotient,1,2),String(quotient),`${dividend} ÷ ${divisor} = ${quotient}. The inverse of ${divisor} × ${quotient} = ${dividend}!`));
    }
  }
  const withRem = [[13,4],[17,5],[19,3],[22,7],[25,4],[29,6],[31,8],[37,5],[41,6],[43,9],[47,8],[53,7],[59,6],[61,9],[67,8],[23,4],[27,5],[34,9],[38,7],[44,6]];
  withRem.forEach(([a,b]) => {
    const q = Math.floor(a/b), r = a%b;
    const ans = `${q} remainder ${r}`;
    const opts = [ans, `${q} remainder ${r+1}`, `${q+1} remainder ${r}`, `${q-1} remainder ${r===0?b-1:r-1}`].filter((x,i,arr)=>arr.indexOf(x)===i);
    while(opts.length < 4) opts.push(`${q+opts.length} remainder 0`);
    addQ(makeQ(P,T,3,`What is ${a} ÷ ${b}?`,opts.slice(0,4),ans,`${b} goes into ${a}, ${q} times (${b}×${q}=${b*q}), with ${r} left over. Answer: ${q} remainder ${r}!`));
  });
  const share = [[24,4,'Aoife','Cork','sweets'],[30,5,'Ciarán','Dublin','stickers'],[36,6,'Síle','Galway','flowers'],[40,8,'Liam','Limerick','cards'],[45,9,'Niamh','Sligo','biscuits'],[32,4,'Seán','Dublin','crayons'],[48,6,'Oisín','Cork','beads'],[56,7,'Aoife','Galway','marbles'],[63,9,'Ciarán','Limerick','pages'],[72,8,'Síle','Dublin','apples'],[42,7,'Liam','Cork','pencils'],[54,6,'Niamh','Galway','seeds'],[66,11,'Seán','Sligo','tokens'],[84,12,'Oisín','Dublin','tiles'],[60,10,'Aoife','Cork','coins'],[77,7,'Liam','Limerick','counters'],[88,8,'Seán','Galway','buttons'],[99,9,'Niamh','Dublin','beads'],[110,10,'Ciarán','Cork','pebbles'],[55,5,'Síle','Sligo','flags']];
  share.forEach(([total,groups,name,place,item]) => {
    const ans = total/groups;
    addQ(makeQ(P,T,2,`${name} from ${place} shares ${total} ${item} equally among ${groups} friends. How many does each friend get?`,makeOpts(ans,1,2),String(ans),`${total} ÷ ${groups} = ${ans}!`));
  });
}

// ─── FRACTIONS ──────────────────────────────────────────────────────────────
function genFractions() {
  const P = 'mth-frac', T = 'fractions';
  const fracAmts = [[1,2,16,8],[1,2,24,12],[1,2,30,15],[1,2,40,20],[1,2,50,25],[1,4,16,4],[1,4,20,5],[1,4,24,6],[1,4,28,7],[1,4,32,8],[1,3,12,4],[1,3,15,5],[1,3,18,6],[1,3,21,7],[1,3,24,8],[2,4,20,10],[3,4,20,15],[2,3,12,8],[2,3,15,10],[1,5,20,4],[1,5,25,5],[1,5,30,6],[1,5,35,7],[1,5,40,8],[1,10,30,3],[1,10,50,5],[1,10,70,7],[1,10,100,10],[3,4,40,30],[2,5,30,12],[3,5,25,15],[4,5,30,24],[1,6,24,4],[1,6,30,5],[5,6,24,20]];
  fracAmts.forEach(([num,den,total,ans]) => {
    addQ(makeQ(P,T,num===1&&den<=4?2:3,`What is ${num}/${den} of ${total}?`,makeOpts(ans,1,2),String(ans),`Divide ${total} by ${den} = ${total/den}, then × ${num} = ${ans}!`));
  });
  const equiv = [['1/2','2/4'],['1/2','3/6'],['1/2','4/8'],['1/3','2/6'],['1/3','3/9'],['1/4','2/8'],['1/4','3/12'],['2/3','4/6'],['3/4','6/8'],['1/5','2/10'],['2/5','4/10'],['3/5','6/10']];
  equiv.forEach(([f1,f2]) => {
    const wrongs = ['3/5','2/7','4/9','5/8','3/7','5/6','1/6','3/8'].filter(x=>x!==f2&&x!==f1);
    const opts = [f2,wrongs[0],wrongs[1],wrongs[2]];
    addQ(makeQ(P,T,3,`Which fraction is equivalent to ${f1}?`,opts,f2,`${f1} = ${f2}. Multiply top and bottom by the same number!`));
  });
  const shaded = [[1,2,'one half'],[1,4,'one quarter'],[3,4,'three quarters'],[1,3,'one third'],[2,3,'two thirds'],[2,5,'two fifths'],[3,5,'three fifths'],[1,8,'one eighth'],[3,8,'three eighths'],[5,8,'five eighths'],[1,6,'one sixth'],[5,6,'five sixths'],[2,4,'two quarters'],[1,10,'one tenth'],[3,10,'three tenths']];
  shaded.forEach(([num,den,name]) => {
    const frac = `${num}/${den}`;
    const wrongs = ['1/6','2/6','5/6','4/5','1/7','2/7','4/7','5/9','2/9','3/11'].filter(x=>x!==frac);
    const opts = [frac,wrongs[0],wrongs[1],wrongs[2]];
    addQ(makeQ(P,T,2,`A shape is split into ${den} equal parts. ${num} part${num>1?'s are':' is'} shaded. What fraction is shaded?`,opts,frac,`${num} out of ${den} parts shaded = ${frac} (${name})!`));
  });
  const compare = [['1/2','1/4','1/2'],['1/3','1/2','1/2'],['3/4','1/4','3/4'],['2/3','1/3','2/3'],['1/4','1/3','1/3'],['3/4','2/3','3/4'],['2/5','3/5','3/5'],['4/5','3/4','4/5'],['1/2','3/4','3/4'],['1/3','2/5','2/5'],['3/8','5/8','5/8'],['1/4','3/8','3/8']];
  compare.forEach(([f1,f2,ans]) => {
    const loser = ans===f1?f2:f1;
    const opts = [ans,loser,'they are equal','1/12'];
    addQ(makeQ(P,T,3,`Which fraction is bigger: ${f1} or ${f2}?`,opts,ans,`${ans} is bigger. Compare by converting to the same denominator!`));
  });
  const ctx = [[1,2,18,9,'Aoife','biscuits','Dublin'],[1,4,24,6,'Seán','sweets','Cork'],[1,3,21,7,'Niamh','stickers','Galway'],[3,4,20,15,'Ciarán','pages','Limerick'],[2,5,25,10,'Síle','cards','Sligo'],[1,2,34,17,'Oisín','marbles','Dublin'],[1,4,32,8,'Liam','flowers','Cork'],[2,3,18,12,'Aoife','apples','Galway'],[1,5,35,7,'Seán','coins','Limerick'],[3,4,28,21,'Niamh','seeds','Sligo']];
  ctx.forEach(([num,den,total,ans,name,item,place]) => {
    addQ(makeQ(P,T,2,`${name} from ${place} has ${total} ${item}. She uses ${num}/${den} of them. How many does she use?`,makeOpts(ans,1,2),String(ans),`${num}/${den} of ${total} = ${ans}. Divide by ${den}, multiply by ${num}!`));
  });
}

// ─── MEASUREMENT ────────────────────────────────────────────────────────────
function genMeasurement() {
  const P = 'mth-meas', T = 'measurement';
  const cmToM = [[100,'1'],[200,'2'],[300,'3'],[150,'1.5'],[250,'2.5'],[500,'5'],[350,'3.5'],[400,'4'],[450,'4.5'],[600,'6'],[750,'7.5'],[1000,'10'],[50,'0.5'],[125,'1.25'],[175,'1.75']];
  cmToM.forEach(([cm,m]) => {
    const n = parseFloat(m);
    const opts = [m,String(n+1),String(n+0.5),String(n+2)];
    addQ(makeQ(P,T,2,`How many metres is ${cm} cm?`,opts,m,`100 cm = 1 m. ${cm} ÷ 100 = ${m} m!`));
  });
  const mToCm = [[1,100],[2,200],[3,300],[4,400],[5,500],[6,600],[7,700],[8,800],[9,900],[10,1000],[11,1100],[12,1200]];
  mToCm.forEach(([m,cm]) => {
    addQ(makeQ(P,T,2,`How many centimetres is ${m} metre${m>1?'s':''}?`,makeOpts(cm,50,100),String(cm),`1 m = 100 cm. ${m} × 100 = ${cm} cm!`));
  });
  const gToKg = [[1000,'1'],[2000,'2'],[3000,'3'],[500,'0.5'],[1500,'1.5'],[2500,'2.5'],[750,'0.75'],[1250,'1.25']];
  gToKg.forEach(([g,kg]) => {
    const n = parseFloat(kg);
    const opts = [kg,String(n+1),String(n+0.5),String(n+2)];
    addQ(makeQ(P,T,2,`How many kg is ${g} grams?`,opts,kg,`1000 g = 1 kg. ${g} ÷ 1000 = ${kg} kg!`));
  });
  const mlToL = [[1000,'1'],[2000,'2'],[500,'0.5'],[1500,'1.5'],[3000,'3'],[2500,'2.5'],[4000,'4'],[750,'0.75']];
  mlToL.forEach(([ml,l]) => {
    const n = parseFloat(l);
    const opts = [l,String(n+1),String(n+0.5),String(n+2)];
    addQ(makeQ(P,T,2,`How many litres is ${ml} ml?`,opts,l,`1000 ml = 1 litre. ${ml} ÷ 1000 = ${l} litre!`));
  });
  const units = [['the length of a pencil','cm','km','kg','litre','cm'],['the distance from Dublin to Cork','km','cm','mm','ml','km'],['the weight of a dog','kg','cm','mm','litre','kg'],['the amount of water in a glass','ml','km','kg','cm','ml'],['the height of a door','m','km','g','ml','m'],['the weight of a feather','g','kg','km','litre','g'],['the amount of milk in a bathtub','litres','ml','g','cm','litres'],['the width of your fingernail','mm','km','kg','litre','mm'],['the weight of a school bag','kg','mm','litre','km','kg'],['the capacity of a swimming pool','litres','g','km','mm','litres'],['the length of a football pitch','m','mm','kg','ml','m'],['the weight of a grape','g','kg','litre','km','g'],['the amount of juice in a bottle','ml','g','km','mm','ml'],['the distance walked in a day','km','mm','kg','litre','km'],['the height of a table','cm','km','litre','g','cm']];
  units.forEach(([thing,u1,u2,u3,u4,ans]) => {
    addQ(makeQ(P,T,1,`Which unit would you use to measure ${thing}?`,[u1,u2,u3,u4],ans,`We use ${ans} for ${thing}!`));
  });
  const perims = [[4,5],[3,7],[6,6],[5,8],[4,9],[7,7],[3,10],[5,5],[6,8],[4,11],[8,8],[5,12],[3,9],[7,5],[6,10]];
  perims.forEach(([l,w]) => {
    const p = 2*(l+w);
    const ans = `${p} cm`;
    const opts = [`${p} cm`,`${p+2} cm`,`${p-2} cm`,`${p+4} cm`];
    addQ(makeQ(P,T,3,`What is the perimeter of a rectangle ${l} cm long and ${w} cm wide?`,opts,ans,`Perimeter = 2×(${l}+${w}) = 2×${l+w} = ${p} cm!`));
  });
  const areas = [[3,4],[5,5],[6,4],[7,3],[8,5],[4,9],[6,7],[3,8],[5,9],[7,6],[4,8],[6,9],[5,7],[8,8],[3,12]];
  areas.forEach(([l,w]) => {
    const a = l*w;
    const ans = `${a} cm²`;
    const opts = [`${a} cm²`,`${a+4} cm²`,`${a-4>0?a-4:a+8} cm²`,`${a+8} cm²`];
    addQ(makeQ(P,T,3,`What is the area of a rectangle ${l} cm long and ${w} cm wide?`,opts,ans,`Area = length × width = ${l} × ${w} = ${a} cm²!`));
  });
}

// ─── SHAPES ─────────────────────────────────────────────────────────────────
function genShapes() {
  const P = 'mth-shape', T = 'shapes';
  const shapes2D = [['triangle',3,3,0],['square',4,4,4],['rectangle',4,4,2],['pentagon',5,5,0],['hexagon',6,6,6],['heptagon',7,7,0],['octagon',8,8,8],['circle',0,0,'infinite']];
  shapes2D.forEach(([shape,sides,corners,symLines]) => {
    if(sides>0) {
      addQ(makeQ(P,T,1,`How many sides does a ${shape} have?`,makeOpts(sides,1,2),String(sides),`A ${shape} has ${sides} sides!`));
      addQ(makeQ(P,T,1,`How many corners does a ${shape} have?`,makeOpts(corners,1,2),String(corners),`A ${shape} has ${corners} corners (vertices)!`));
    }
    if(typeof symLines === 'number' && symLines > 0) {
      addQ(makeQ(P,T,2,`How many lines of symmetry does a regular ${shape} have?`,makeOpts(symLines,1,2),String(symLines),`A ${shape} has ${symLines} line${symLines>1?'s':''} of symmetry!`));
    }
  });
  const shapes3D = [['cube',6,12,8],['cuboid',6,12,8],['sphere',1,0,0],['cone',2,1,1],['cylinder',3,2,0],['triangular prism',5,9,6],['square pyramid',5,8,5],['rectangular prism',6,12,8]];
  shapes3D.forEach(([shape,faces,edges,vertices]) => {
    addQ(makeQ(P,T,2,`How many faces does a ${shape} have?`,makeOpts(faces,1,2),String(faces),`A ${shape} has ${faces} face${faces!==1?'s':''}!`));
    if(edges>0) addQ(makeQ(P,T,2,`How many edges does a ${shape} have?`,makeOpts(edges,2,3),String(edges),`A ${shape} has ${edges} edges!`));
    if(vertices>0) addQ(makeQ(P,T,2,`How many vertices does a ${shape} have?`,makeOpts(vertices,1,2),String(vertices),`A ${shape} has ${vertices} vertices (pointy corners)!`));
  });
  const recog = [['I have 4 equal sides and 4 right angles','square','rectangle','rhombus','triangle','square'],['I have 3 sides and 3 corners','triangle','square','circle','rectangle','triangle'],['I have no corners and no sides','circle','triangle','hexagon','square','circle'],['I have 6 equal sides','hexagon','pentagon','octagon','heptagon','hexagon'],['I have 8 sides','octagon','hexagon','heptagon','pentagon','octagon'],['I have 5 sides','pentagon','hexagon','octagon','square','pentagon'],['I am a 3D shape with 6 square faces','cube','cuboid','sphere','cone','cube'],['I have no edges and no vertices (3D)','sphere','cone','cylinder','cube','sphere'],['I am a 3D shape like a tin can','cylinder','cone','cube','sphere','cylinder'],['I am a 3D shape like an ice cream cone','cone','sphere','cylinder','cube','cone'],['I have 4 sides but they are not all equal','rectangle','square','circle','triangle','rectangle'],['I am flat, round, and have no corners','circle','oval','square','triangle','circle'],['I have exactly 4 right angles (2D)','rectangle','circle','triangle','hexagon','rectangle'],['I am a 3D shape with a triangular base','triangular prism','cube','cone','sphere','triangular prism'],['I look the same from all directions (3D)','sphere','cone','cube','cylinder','sphere']];
  recog.forEach(([clue,a,b,c,d,ans]) => {
    addQ(makeQ(P,T,2,`${clue}. What shape am I?`,[a,b,c,d],ans,`That's a ${ans}!`));
  });
}

// ─── TIME ───────────────────────────────────────────────────────────────────
function genTime() {
  const P = 'mth-time', T = 'time';
  const clockTimes = [["3 o'clock",'3:00','3:30','2:45','3:15','3:00'],["half past 5",'5:30','5:00','5:15','5:45','5:30'],["quarter past 7",'7:15','7:30','7:45','7:00','7:15'],["quarter to 4",'3:45','4:15','4:45','3:30','3:45'],["half past 11",'11:30','11:00','11:15','12:30','11:30'],["quarter past 2",'2:15','2:30','1:45','2:45','2:15'],["quarter to 8",'7:45','8:15','7:30','8:45','7:45'],["10 o'clock",'10:00','10:30','9:45','10:15','10:00'],["quarter past 12",'12:15','12:00','12:30','11:45','12:15'],["quarter to 1",'12:45','1:15','1:45','12:30','12:45'],["20 minutes past 4",'4:20','4:02','3:40','4:40','4:20'],["25 minutes to 6",'5:35','5:25','6:25','6:35','5:35'],["10 minutes past 9",'9:10','9:50','8:10','9:01','9:10'],["5 minutes to 3",'2:55','3:05','2:05','3:55','2:55'],["20 minutes to 7",'6:40','7:20','6:20','7:40','6:40'],["half past 8",'8:30','8:00','8:15','9:30','8:30'],["quarter to 12",'11:45','12:15','11:15','12:45','11:45'],["5 minutes past 6",'6:05','6:50','5:05','7:05','6:05'],["quarter past 9",'9:15','9:30','9:45','9:00','9:15'],["half past 3",'3:30','3:00','3:15','4:30','3:30']];
  clockTimes.forEach(([desc,a,b,c,d,ans]) => {
    addQ(makeQ(P,T,2,`What time is "${desc}" in digital (hh:mm) format?`,[a,b,c,d],ans,`${desc} = ${ans}. Think of the clock face!`));
  });
  const durations = [['9:00','9:30','30 minutes'],['10:15','10:45','30 minutes'],['2:00','3:00','60 minutes'],['4:30','5:00','30 minutes'],['8:00','8:45','45 minutes'],['11:00','12:30','90 minutes'],['3:15','4:15','60 minutes'],['7:30','8:15','45 minutes'],['9:45','10:30','45 minutes'],['1:00','2:30','90 minutes'],['6:15','7:45','90 minutes'],['10:00','11:15','75 minutes'],['9:00','10:30','90 minutes'],['3:30','5:00','90 minutes'],['8:15','9:00','45 minutes'],['7:00','8:30','90 minutes'],['2:45','3:30','45 minutes'],['11:15','12:00','45 minutes'],['4:00','5:15','75 minutes'],['6:30','7:00','30 minutes']];
  durations.forEach(([start,end,dur]) => {
    const mins = parseInt(dur);
    const opts = [`${mins} minutes`,`${mins+15} minutes`,`${mins-15>0?mins-15:mins+30} minutes`,`${mins+30} minutes`];
    addQ(makeQ(P,T,3,`A film starts at ${start} and ends at ${end}. How long is the film?`,opts,`${dur}`,`From ${start} to ${end} = ${dur}. Count on from the start time!`));
  });
  const h24 = [['2:00 pm','14:00','12:00','2:00','24:00','14:00'],['3:30 pm','15:30','3:30','13:30','16:30','15:30'],['midnight','00:00','12:00','24:00','11:00','00:00'],['noon','12:00','00:00','24:00','21:00','12:00'],['6:45 pm','18:45','6:45','8:45','16:45','18:45'],['8:00 pm','20:00','8:00','18:00','22:00','20:00'],['11:30 pm','23:30','11:30','13:30','21:30','23:30'],['9:15 am','09:15','21:15','9:50','09:51','09:15'],['7:00 am','07:00','17:00','19:00','17:00 am','07:00'],['5:20 pm','17:20','5:20','15:20','7:20','17:20'],['1:00 pm','13:00','1:00','12:00','14:00','13:00'],['4:15 pm','16:15','4:15','14:15','18:15','16:15'],['10:30 am','10:30','22:30','10:03','00:30','10:30'],['11:00 pm','23:00','11:00','21:00','13:00','23:00'],['6:00 am','06:00','16:00','6:00 pm','18:00','06:00']];
  h24.forEach(([time12,a,b,c,d,ans]) => {
    addQ(makeQ(P,T,3,`What is ${time12} in 24-hour clock format?`,[a,b,c,d],ans,`For pm times (except noon) add 12. ${time12} = ${ans}!`));
  });
  const calQ = [['January',31,28,30,29,31],['February (non-leap year)',28,29,30,31,28],['April',30,29,31,28,30],['December',31,28,30,29,31],['June',30,28,31,29,30],['September',30,29,31,28,30],['November',30,29,31,28,30],['March',31,28,30,29,31],['July',31,28,30,29,31],['August',31,28,30,29,31]];
  calQ.forEach(([month,a,b,c,d,ans]) => {
    addQ(makeQ(P,T,2,`How many days are in the month of ${month}?`,[String(a),String(b),String(c),String(d)],String(ans),`${month} has ${ans} days!`));
  });
  const convQ = [['How many days are in a week?','7','6','8','5','7'],['How many months are in a year?','12','10','11','13','12'],['How many weeks are in a year?','52','48','50','54','52'],['How many seconds are in a minute?','60','100','30','45','60'],['How many minutes are in an hour?','60','100','30','50','60'],['How many hours are in a day?','24','12','30','48','24'],['How many days are in a fortnight?','14','7','21','10','14'],['How many minutes are in half an hour?','30','15','45','60','30'],['How many hours are in half a day?','12','6','24','8','12'],['How many months in half a year?','6','3','9','12','6'],['How many days in two weeks?','14','7','21','28','14'],['How many minutes in 2 hours?','120','60','180','240','120'],['How many seconds in 2 minutes?','120','60','180','200','120'],['How many hours in 2 days?','48','24','36','72','48']];
  convQ.forEach(([q,a,b,c,d,ans]) => {
    addQ(makeQ(P,T,1,q,[a,b,c,d],ans,`${ans}! An important time fact!`));
  });
}

// ─── PLACE VALUE ─────────────────────────────────────────────────────────────
function genPlaceValue() {
  const P = 'mth-pv', T = 'place-value';
  const pvQ = [[342,'hundreds',3],[567,'tens',6],[891,'ones',1],[234,'hundreds',2],[756,'tens',5],[419,'ones',9],[983,'hundreds',9],[147,'tens',4],[628,'ones',8],[305,'hundreds',3],[705,'tens',0],[830,'ones',0],[462,'hundreds',4],[719,'tens',1],[854,'ones',4],[137,'hundreds',1],[590,'tens',9],[243,'ones',3],[681,'hundreds',6],[924,'tens',2],[348,'hundreds',3],[572,'ones',2],[639,'tens',3],[481,'hundreds',4],[756,'ones',6],[327,'tens',2],[845,'hundreds',8],[963,'ones',3],[124,'tens',2],[509,'hundreds',5]];
  pvQ.forEach(([num,place,ans]) => {
    addQ(makeQ(P,T,2,`What digit is in the ${place} place in the number ${num}?`,makeOpts(ans,1,2).map(String),String(ans),`In ${num}, the ${place} digit is ${ans}. Hundreds | Tens | Ones!`));
  });
  const orderNums = [[[34,12,56,23],'smallest',12],[[87,45,99,32],'largest',99],[[156,234,112,198],'smallest',112],[[432,389,500,421],'largest',500],[[67,76,66,77],'smallest',66],[[321,312,132,231],'largest',321],[[450,405,504,540],'smallest',405],[[789,798,879,897],'largest',897],[[123,321,213,132],'smallest',123],[[654,645,564,546],'largest',654],[[250,520,205,502],'smallest',205],[[380,308,830,803],'largest',830]];
  orderNums.forEach(([nums,dir,ans]) => {
    addQ(makeQ(P,T,2,`Which is the ${dir} number: ${nums.join(', ')}?`,nums.map(String),String(ans),`The ${dir} is ${ans}. Compare hundreds, then tens, then ones!`));
  });
  const round10 = [[34,30],[47,50],[52,50],[68,70],[23,20],[85,90],[11,10],[96,100],[45,50],[73,70],[18,20],[64,60],[31,30],[89,90],[56,60],[72,70],[37,40],[63,60],[48,50],[91,90]];
  round10.forEach(([num,r]) => {
    addQ(makeQ(P,T,2,`Round ${num} to the nearest 10.`,makeOpts(r,10,20),String(r),`Ones digit is ${num%10}. ${num%10>=5?'Round up':'Round down'} to ${r}!`));
  });
  const round100 = [[234,200],[378,400],[450,500],[512,500],[687,700],[123,100],[849,800],[352,400],[765,800],[219,200],[534,500],[671,700],[148,100],[825,800],[456,500],[362,400],[743,700],[286,300],[517,500],[934,900]];
  round100.forEach(([num,r]) => {
    addQ(makeQ(P,T,3,`Round ${num} to the nearest 100.`,makeOpts(r,100,200),String(r),`Tens digit is ${Math.floor(num/10)%10}. ${Math.floor(num/10)%10>=5?'Round up':'Round down'} to ${r}!`));
  });
  const vals = [[347,'hundreds',300],[582,'tens',80],[694,'ones',4],[421,'hundreds',400],[736,'tens',30],[815,'ones',5],[963,'hundreds',900],[274,'tens',70],[538,'ones',8],[156,'hundreds',100],[829,'tens',20],[645,'ones',5],[371,'hundreds',300],[264,'tens',60],[918,'ones',8]];
  vals.forEach(([num,place,val]) => {
    const opts = makeOpts(val,10,100).map(String);
    addQ(makeQ(P,T,2,`What is the VALUE of the ${place} digit in ${num}?`,opts,String(val),`The ${place} digit in ${num} has a value of ${val}!`));
  });
  const expanded = [[345,'300 + 40 + 5','300 + 45','30 + 45','3 + 4 + 5','300 + 40 + 5'],[628,'600 + 20 + 8','600 + 28','62 + 8','6 + 2 + 8','600 + 20 + 8'],[417,'400 + 10 + 7','400 + 17','41 + 7','4 + 1 + 7','400 + 10 + 7'],[903,'900 + 0 + 3','900 + 3','90 + 3','9 + 0 + 3','900 + 0 + 3'],[560,'500 + 60 + 0','500 + 6','56 + 0','5 + 6 + 0','500 + 60 + 0'],[732,'700 + 30 + 2','700 + 32','73 + 2','7 + 3 + 2','700 + 30 + 2'],[815,'800 + 10 + 5','800 + 15','81 + 5','8 + 1 + 5','800 + 10 + 5']];
  expanded.forEach(([num,a,b,c,d,ans]) => {
    addQ(makeQ(P,T,3,`Write ${num} in expanded form.`,[a,b,c,d],ans,`${num} = ${ans}. Expanded form shows each digit's value!`));
  });
}

// ─── MONEY ──────────────────────────────────────────────────────────────────
function genMoney() {
  const P = 'mth-money', T = 'money';
  const prices = [[1.50,2.00,3.50,'Aoife','Cork'],[0.75,1.25,2.00,'Seán','Dublin'],[2.30,1.70,4.00,'Niamh','Galway'],[1.99,1.01,3.00,'Ciarán','Limerick'],[3.45,2.55,6.00,'Síle','Sligo'],[0.85,1.15,2.00,'Oisín','Dublin'],[4.20,3.80,8.00,'Liam','Cork'],[1.60,2.40,4.00,'Aoife','Galway'],[2.75,1.25,4.00,'Seán','Limerick'],[3.50,2.50,6.00,'Niamh','Dublin'],[1.30,0.70,2.00,'Ciarán','Cork'],[2.15,1.85,4.00,'Síle','Galway'],[0.95,2.05,3.00,'Oisín','Sligo'],[1.45,1.55,3.00,'Liam','Dublin'],[3.25,2.75,6.00,'Aoife','Cork'],[4.50,0.50,5.00,'Seán','Limerick'],[1.75,3.25,5.00,'Niamh','Galway'],[2.60,1.40,4.00,'Ciarán','Dublin'],[3.80,1.20,5.00,'Síle','Cork'],[0.65,2.35,3.00,'Oisín','Sligo']];
  prices.forEach(([p1,p2,total,name,place]) => {
    const ans = `€${total.toFixed(2)}`;
    const opts = [ans,`€${(total+0.50).toFixed(2)}`,`€${(total-0.50>0?total-0.50:total+1).toFixed(2)}`,`€${(total+1.00).toFixed(2)}`];
    addQ(makeQ(P,T,2,`${name} from ${place} buys a juice for €${p1.toFixed(2)} and a sandwich for €${p2.toFixed(2)}. How much does she spend in total?`,opts,ans,`€${p1.toFixed(2)} + €${p2.toFixed(2)} = ${ans}!`));
  });
  const changeData = [[5.00,3.20,1.80,'Liam','Dublin'],[10.00,7.45,2.55,'Síle','Cork'],[2.00,1.35,0.65,'Oisín','Galway'],[5.00,4.60,0.40,'Niamh','Limerick'],[10.00,6.75,3.25,'Seán','Sligo'],[20.00,15.50,4.50,'Aoife','Dublin'],[1.00,0.45,0.55,'Ciarán','Cork'],[5.00,2.85,2.15,'Liam','Galway'],[10.00,8.30,1.70,'Síle','Limerick'],[2.00,0.75,1.25,'Oisín','Dublin'],[5.00,3.99,1.01,'Niamh','Cork'],[10.00,5.60,4.40,'Seán','Galway'],[20.00,13.25,6.75,'Aoife','Sligo'],[2.00,1.55,0.45,'Ciarán','Dublin'],[5.00,1.80,3.20,'Liam','Cork'],[10.00,4.35,5.65,'Síle','Limerick'],[20.00,17.50,2.50,'Oisín','Galway'],[5.00,2.25,2.75,'Niamh','Dublin'],[10.00,9.15,0.85,'Seán','Cork'],[2.00,0.90,1.10,'Aoife','Sligo']];
  changeData.forEach(([paid,cost,chg,name,place]) => {
    const ans = `€${chg.toFixed(2)}`;
    const opts = [ans,`€${(chg+0.50).toFixed(2)}`,`€${(chg+0.10).toFixed(2)}`,`€${(chg-0.10>0?chg-0.10:chg+0.20).toFixed(2)}`];
    addQ(makeQ(P,T,3,`${name} from ${place} pays €${paid.toFixed(2)} for an item costing €${cost.toFixed(2)}. How much change does ${name} get?`,opts,ans,`€${paid.toFixed(2)} − €${cost.toFixed(2)} = ${ans} change!`));
  });
  const diffs = [[3.50,2.00,1.50,'book','pen','Aoife','Dublin'],[4.75,2.25,2.50,'toy','card','Seán','Cork'],[6.00,3.50,2.50,'game','notebook','Niamh','Galway'],[8.50,5.00,3.50,'bag','hat','Ciarán','Limerick'],[2.80,1.30,1.50,'drink','snack','Síle','Sligo'],[5.50,3.00,2.50,'lunch','juice','Liam','Dublin'],[7.25,4.75,2.50,'shirt','socks','Oisín','Cork'],[9.00,5.50,3.50,'shoes','belt','Aoife','Galway'],[3.20,1.70,1.50,'apple','orange','Seán','Limerick'],[4.50,2.50,2.00,'muffin','scone','Niamh','Sligo'],[6.50,4.00,2.50,'cap','gloves','Ciarán','Dublin'],[8.00,5.50,2.50,'shorts','tshirt','Síle','Cork']];
  diffs.forEach(([p1,p2,diff,item1,item2,name,place]) => {
    const ans = `€${diff.toFixed(2)}`;
    const opts = [ans,`€${(diff+0.50).toFixed(2)}`,`€${(diff+1.00).toFixed(2)}`,`€${(diff-0.50>0?diff-0.50:diff+1.50).toFixed(2)}`];
    addQ(makeQ(P,T,3,`In a shop in ${place}, a ${item1} costs €${p1.toFixed(2)} and a ${item2} costs €${p2.toFixed(2)}. How much more does the ${item1} cost?`,opts,ans,`€${p1.toFixed(2)} − €${p2.toFixed(2)} = ${ans} more!`));
  });
  const coins = [['€2 coin and a 50c coin','€2.50','€2.05','€3.00','€1.50','€2.50'],['€1 coin and a 20c coin','€1.20','€1.02','€2.00','€0.80','€1.20'],['50c coin and a 10c coin','60c','40c','55c','51c','60c'],['€5 note and a €2 coin','€7.00','€52.00','€6.00','€8.00','€7.00'],['€10 note and 75c','€10.75','€10.07','€11.00','€9.25','€10.75'],['three 20c coins','60c','23c','40c','80c','60c'],['four 50c coins','€2.00','€4.50','€0.54','€1.50','€2.00'],['two €1 coins and three 10c coins','€2.30','€2.13','€3.20','€1.70','€2.30'],['€5 note and two 50c coins','€6.00','€5.50','€7.00','€5.02','€6.00'],['a 20c coin, a 10c coin and a 5c coin','35c','25c','30c','15c','35c']];
  coins.forEach(([desc,a,b,c,d,ans]) => {
    addQ(makeQ(P,T,2,`How much money is ${desc} worth altogether?`,[a,b,c,d],ans,`${desc} = ${ans}. Add each coin or note!`));
  });
}

// ─── MENTAL MATHS ───────────────────────────────────────────────────────────
function genMentalMaths() {
  const P = 'mth-mental', T = 'mental-maths';
  for(let i=0;i<=10;i++){const j=10-i;if(i<=j){addQ(makeQ(P,T,1,`What number added to ${i} makes 10?`,makeOpts(j,1,2),String(j),`${i} + ${j} = 10. Number bonds to 10!`));}}
  for(let i=0;i<=20;i+=2){const j=20-i;if(i<=j){addQ(makeQ(P,T,1,`What number added to ${i} makes 20?`,makeOpts(j,1,2),String(j),`${i} + ${j} = 20. Number bonds to 20!`));}}
  [[10,90],[20,80],[30,70],[40,60],[50,50],[25,75],[35,65],[45,55],[15,85],[5,95],[60,40],[70,30],[80,20],[90,10]].forEach(([a,b])=>{
    addQ(makeQ(P,T,2,`What number added to ${a} makes 100?`,makeOpts(b,5,10),String(b),`${a} + ${b} = 100. Think in tens!`));
  });
  [3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,25,30,35,40,45,50,55,60].forEach(n=>{
    const ans=n*2;
    addQ(makeQ(P,T,1,`What is double ${n}?`,makeOpts(ans,1,2),String(ans),`Double ${n} = ${n} + ${n} = ${ans}!`));
  });
  [4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,50,60,70,80,100].forEach(n=>{
    const ans=n/2;
    addQ(makeQ(P,T,1,`What is half of ${n}?`,makeOpts(ans,1,2),String(ans),`Half of ${n} = ${n} ÷ 2 = ${ans}!`));
  });
  [2,3,4,5,6,7,8,9,11,12,13,14,15,20,25,30,50].forEach(n=>{
    addQ(makeQ(P,T,1,`What is ${n} × 10?`,makeOpts(n*10,5,10),String(n*10),`${n} × 10 = ${n*10}. Add a zero (or shift digits left)!`));
  });
  [2,3,4,5,6,7,8,9,10,11,12].forEach(n=>{
    addQ(makeQ(P,T,2,`What is ${n} × 100?`,makeOpts(n*100,50,100),String(n*100),`${n} × 100 = ${n*100}. Add two zeros!`));
  });
  [20,30,40,50,60,70,80,90,100,110,120,150,200,250,300].forEach(n=>{
    addQ(makeQ(P,T,2,`What is ${n} ÷ 10?`,makeOpts(n/10,1,2),String(n/10),`${n} ÷ 10 = ${n/10}. Remove a zero (or shift right)!`));
  });
  [100,200,300,400,500,600,700,800,900,1000,1100,1200].forEach(n=>{
    addQ(makeQ(P,T,2,`What is ${n} ÷ 100?`,makeOpts(n/100,1,2),String(n/100),`${n} ÷ 100 = ${n/100}. Remove two zeros!`));
  });
}

// ─── WORD PROBLEMS ──────────────────────────────────────────────────────────
function genWordProblems() {
  const P = 'mth-word', T = 'word-problems';
  const problems = [
    {q:'Aoife has 24 stickers. She gets 13 more from Síle, then gives 8 to Liam. How many stickers does Aoife have now?',ans:'29',d:3},
    {q:'Ciarán reads 15 pages on Monday, 22 pages on Tuesday, and 18 pages on Wednesday. How many pages did he read in total?',ans:'55',d:3},
    {q:'There are 48 children in a Galway school going on a trip. 16 are boys. How many are girls?',ans:'32',d:2},
    {q:'Seán collects 35 seashells in Sligo. He finds 24 more but loses 12. How many does he have?',ans:'47',d:3},
    {q:'A baker in Cork makes 60 buns in the morning and 45 in the afternoon. She sells 38. How many buns are left?',ans:'67',d:3},
    {q:'Oisín has 72 cards. He gives 15 to Ciarán and 23 to Liam. How many cards does Oisín have left?',ans:'34',d:3},
    {q:'In a Dublin park there are 28 ducks and 37 swans. How many birds are there altogether?',ans:'65',d:2},
    {q:'A Limerick school has 256 pupils. 128 are in junior classes. How many are in senior classes?',ans:'128',d:3},
    {q:'There are 6 classes in a Galway school. Each class has 28 pupils. How many pupils are in the school?',ans:'168',d:4},
    {q:'Aoife plants 5 rows of sunflowers. Each row has 9 sunflowers. How many sunflowers are there?',ans:'45',d:2},
    {q:'A baker makes 8 trays of 12 buns each. How many buns does she make in total?',ans:'96',d:3},
    {q:'Ciarán buys 4 comics at €3 each. How much does he spend?',ans:'€12',d:2},
    {q:'Liam jogs 3 km every day. How many km does he jog in a week (7 days)?',ans:'21',d:2},
    {q:'There are 9 tables in a Cork restaurant. Each table seats 4 people. How many people can sit in the restaurant?',ans:'36',d:2},
    {q:'Niamh reads 12 pages every day. How many pages does she read in 5 days?',ans:'60',d:3},
    {q:'A pack of stickers has 11 stickers. Oisín buys 7 packs. How many stickers does he have?',ans:'77',d:3},
    {q:'Síle has 56 sweets to share equally among 7 friends. How many sweets does each friend get?',ans:'8',d:2},
    {q:'45 children are put into equal groups of 9. How many groups are there?',ans:'5',d:2},
    {q:'72 eggs are packed into boxes of 12. How many boxes are needed?',ans:'6',d:3},
    {q:'There are 63 children and 7 tables. How many children sit at each table if they share equally?',ans:'9',d:2},
    {q:'Aoife has a ribbon 96 cm long. She cuts it into pieces of 8 cm each. How many pieces does she get?',ans:'12',d:3},
    {q:'Liam earns €48 in 6 days. How much does he earn per day?',ans:'€8',d:3},
    {q:'A box has 6 rows of 8 chocolates. Seán eats 15 chocolates. How many are left?',ans:'33',d:4},
    {q:'There are 48 seats in a cinema. 27 are filled. How many seats are empty?',ans:'21',d:2},
    {q:'Síle has 36 flowers. She puts them in groups of 4. How many groups does she make?',ans:'9',d:2},
    {q:'Ciarán scores 45 points in a game. He then doubles his score. What is his new score?',ans:'90',d:3},
    {q:'In a class of 30 pupils, 2/3 have packed lunch. How many pupils have packed lunch?',ans:'20',d:3},
    {q:'There are 4 teams. Each team has 9 players. 6 players are absent today. How many players are present?',ans:'30',d:4},
    {q:'Niamh has €10. She spends half on a book and €1.50 on a snack. How much does she have left?',ans:'€3.50',d:4},
    {q:'Oisín has 100 stickers. He gives 1/4 to Ciarán and 1/4 to Aoife. How many does Oisín have left?',ans:'50',d:4},
    {q:'A shop in Dublin sells apples at 3 for €1.00. How much do 9 apples cost?',ans:'€3.00',d:3},
    {q:'Seán earns €7 for each hour he works. He works 8 hours. How much does he earn?',ans:'€56',d:3},
    {q:'There are 120 sweets shared equally among 10 children. How many sweets each?',ans:'12',d:2},
    {q:'A train journey from Dublin to Cork takes 2 hours 30 minutes. If the train leaves at 10:00, when does it arrive?',ans:'12:30',d:3},
    {q:'Niamh saves €2.50 each week for 6 weeks. How much has she saved?',ans:'€15.00',d:3},
    {q:'A recipe needs 150 g of butter. Aoife wants to make 4 batches. How much butter does she need?',ans:'600 g',d:3},
    {q:'Liam walks 1.5 km to school and back each day. How far does he walk in 5 days?',ans:'15 km',d:4},
    {q:'84 pupils are divided equally into 12 groups. How many pupils are in each group?',ans:'7',d:4},
    {q:'A school trip costs €8 per child. There are 25 children going. What is the total cost?',ans:'€200',d:4},
    {q:'Síle has 3 bags with 12 apples each. She eats 5 apples. How many apples are left?',ans:'31',d:3},
    {q:'Ciarán reads 8 pages on Monday, 11 on Tuesday and 9 on Wednesday. What is the total?',ans:'28',d:2},
    {q:'There are 7 shelves. Each shelf has 9 books. How many books are there altogether?',ans:'63',d:2},
    {q:'Aoife has €20. She buys a hat for €7.50 and a scarf for €4.50. How much does she have left?',ans:'€8.00',d:3},
    {q:'Seán runs 400 m four times. How far does he run in total?',ans:'1600 m',d:3},
    {q:'A class of 32 pupils is split into groups of 4. How many groups are there?',ans:'8',d:2},
    {q:'Niamh collects 5 stickers every day. How many stickers does she collect in 3 weeks (21 days)?',ans:'105',d:4},
    {q:'Oisín has 144 building blocks. He uses 1/3 of them to build a tower. How many blocks did he use?',ans:'48',d:3},
    {q:'A school canteen serves 6 tables. Each table seats 8 children. How many children can sit in the canteen?',ans:'48',d:2},
    {q:'Ciarán has 3 times as many cards as Liam. Liam has 15 cards. How many cards does Ciarán have?',ans:'45',d:3},
    {q:'There were 95 passengers on a train. 37 got off at Dublin. How many passengers are still on the train?',ans:'58',d:3},
  ];
  problems.forEach(({q,ans,d}) => {
    let opts;
    if(ans.startsWith('€')) {
      const n = parseFloat(ans.replace('€',''));
      opts = [ans, `€${(n+5).toFixed(2)}`, `€${(n-5>0?n-5:n+2).toFixed(2)}`, `€${(n+10).toFixed(2)}`];
      if(!opts.includes(ans)) opts[0]=ans;
    } else if(ans.includes(' ')) {
      const parts = ans.split(' ');
      const num = parseInt(parts[0]);
      const unit = parts.slice(1).join(' ');
      opts = [ans, `${num+5} ${unit}`, `${num-5>0?num-5:num+2} ${unit}`, `${num+10} ${unit}`];
    } else if(ans.includes(':')) {
      opts = [ans, '12:00', '13:00', '11:30'];
      if(!opts.includes(ans)) opts[0]=ans;
    } else {
      opts = makeOpts(parseInt(ans)||0,3,7);
    }
    addQ(makeQ(P,T,d,q,opts.slice(0,4),ans,`Work through each step carefully. The answer is ${ans}!`));
  });
}

// ─── DATA ───────────────────────────────────────────────────────────────────
function genData() {
  const P = 'mth-data', T = 'data';
  const charts = [
    {ctx:"A bar chart shows the favourite sports of 3rd class children in Cork. Football: 12, Hurling: 8, Swimming: 6, Tennis: 4.",qs:[
      {q:'How many children chose Football?',ans:'12',d:1},{q:'How many children chose Hurling?',ans:'8',d:1},
      {q:'Which sport was chosen by the most children?',ans:'Football',opts:['Football','Hurling','Swimming','Tennis'],d:1},
      {q:'Which sport was chosen by the fewest children?',ans:'Tennis',opts:['Football','Hurling','Swimming','Tennis'],d:1},
      {q:'How many children chose either Swimming or Tennis?',ans:'10',d:2},
      {q:'How many more children chose Football than Hurling?',ans:'4',d:2},
      {q:'How many children were surveyed in total?',ans:'30',d:2},
    ]},
    {ctx:"A pictogram shows books read: Aoife: 5, Seán: 3, Niamh: 7, Ciarán: 4. Each picture = 1 book.",qs:[
      {q:'Who read the most books?',ans:'Niamh',opts:['Aoife','Seán','Niamh','Ciarán'],d:1},
      {q:'Who read the fewest books?',ans:'Seán',opts:['Aoife','Seán','Niamh','Ciarán'],d:1},
      {q:'How many books did Aoife and Ciarán read together?',ans:'9',d:2},
      {q:'How many books were read altogether?',ans:'19',d:2},
      {q:'How many more books did Niamh read than Seán?',ans:'4',d:2},
    ]},
    {ctx:"A bar chart shows pets on a Galway street: Dogs: 9, Cats: 11, Birds: 3, Fish: 7.",qs:[
      {q:'How many cats are there?',ans:'11',d:1},
      {q:'What is the most popular pet?',ans:'Cats',opts:['Dogs','Cats','Birds','Fish'],d:1},
      {q:'What is the least popular pet?',ans:'Birds',opts:['Dogs','Cats','Birds','Fish'],d:1},
      {q:'How many more dogs than birds are there?',ans:'6',d:2},
      {q:'How many pets are there in total?',ans:'30',d:2},
      {q:'How many dogs and fish are there together?',ans:'16',d:2},
    ]},
    {ctx:"A tally chart shows the weather in Dublin for 20 days: Sunny: 8, Cloudy: 5, Rainy: 7.",qs:[
      {q:'How many sunny days were there?',ans:'8',d:1},
      {q:'How many days had rain?',ans:'7',d:1},
      {q:'What was the most common type of weather?',ans:'Sunny',opts:['Sunny','Cloudy','Rainy','Snowy'],d:1},
      {q:'How many days were either sunny or rainy?',ans:'15',d:2},
      {q:'How many more sunny days than cloudy days were there?',ans:'3',d:2},
    ]},
    {ctx:"A bar chart shows how many goals 4 teams scored: Lions: 6, Eagles: 9, Tigers: 4, Sharks: 7.",qs:[
      {q:'Which team scored the most goals?',ans:'Eagles',opts:['Lions','Eagles','Tigers','Sharks'],d:1},
      {q:'Which team scored the fewest goals?',ans:'Tigers',opts:['Lions','Eagles','Tigers','Sharks'],d:1},
      {q:'How many goals did the Lions and Tigers score together?',ans:'10',d:2},
      {q:'How many goals were scored in total?',ans:'26',d:2},
      {q:'How many more goals did Eagles score than Lions?',ans:'3',d:2},
    ]},
  ];
  charts.forEach(({ctx,qs}) => {
    qs.forEach(({q,ans,d,opts: custOpts}) => {
      const opts = custOpts ? custOpts : makeOpts(parseInt(ans)||0,2,5);
      addQ(makeQ(P,T,d,`${ctx} ${q}`,opts,ans,`Look at the chart carefully. The answer is ${ans}!`));
    });
  });
  const modeRange = [{q:'What is the mode of: 2, 4, 4, 3, 4, 5, 2?',ans:'4',d:3},{q:'What is the mode of: 1, 3, 3, 7, 9?',ans:'3',d:3},{q:'What is the mode of: 5, 8, 2, 8, 3?',ans:'8',d:3},{q:'What is the range of: 2, 4, 6, 8?',ans:'6',d:3},{q:'What is the range of: 3, 1, 7, 9, 5?',ans:'8',d:3},{q:'What is the range of: 3, 7, 12, 5, 9?',ans:'9',d:3},{q:'What is the mode of: 5, 7, 7, 9, 7, 3?',ans:'7',d:3},{q:'What is the range of: 10, 25, 30, 40, 15?',ans:'30',d:3},{q:'What is the mode of: 4, 6, 6, 2, 6?',ans:'6',d:3},{q:'What is the range of: 5, 12, 18, 20, 9?',ans:'15',d:3},{q:'What is the mode of: 2, 2, 3, 4, 2, 5?',ans:'2',d:3},{q:'What is the range of: 1, 5, 3, 9, 7?',ans:'8',d:3},{q:'What is the mode of: 10, 20, 20, 30, 10, 20?',ans:'20',d:3},{q:'What is the range of: 15, 25, 35, 45?',ans:'30',d:3},{q:'What is the mode of: 6, 8, 6, 9, 6, 7?',ans:'6',d:3}];
  modeRange.forEach(({q,ans,d}) => {
    addQ(makeQ(P,T,d,q,makeOpts(parseInt(ans),1,2),ans,`The answer is ${ans}. Mode = most frequent; Range = largest − smallest!`));
  });
  const means = [[[2,4,6],4],[[3,5,7],5],[[1,3,5,7],4],[[2,4,6,8],5],[[10,20,30],20],[[4,8,12],8],[[5,10,15],10],[[6,8,10],8],[[2,6,4],4],[[1,2,3,4,5],3],[[4,8,12,16],10],[[10,20,10],13.33]];
  means.slice(0,11).forEach(([nums,avg]) => {
    const sum = nums.reduce((a,b)=>a+b,0);
    addQ(makeQ(P,T,4,`What is the average (mean) of: ${nums.join(', ')}?`,makeOpts(avg,1,2),String(avg),`Sum = ${sum}, ÷ ${nums.length} numbers = ${avg}!`));
  });
}

// ─── RUN ALL ──────────────────────────────────────────────────────────────────
genAddition();
genSubtraction();
genMultiplication();
genDivision();
genFractions();
genMeasurement();
genShapes();
genTime();
genPlaceValue();
genMoney();
genMentalMaths();
genWordProblems();
genData();

// ─── VALIDATE ────────────────────────────────────────────────────────────────
const validated = [];
const errors = [];
allNew.forEach(q => {
  if(!q.options || q.options.length !== 4){errors.push(`${q.id}: not 4 options (${q.options?.length}): ${q.question.slice(0,40)}`);return;}
  if(new Set(q.options).size !== 4){errors.push(`${q.id}: duplicate options: ${q.options.join('|')}`);return;}
  if(!q.options.includes(q.answer)){errors.push(`${q.id}: answer "${q.answer}" not in [${q.options.join(',')}]`);return;}
  if(![1,2,3,4,5].includes(q.difficulty)){errors.push(`${q.id}: bad difficulty ${q.difficulty}`);return;}
  validated.push(q);
});

if(errors.length > 0){
  console.error(`\n${errors.length} VALIDATION ERRORS:`);
  errors.slice(0,20).forEach(e => console.error(' ', e));
  if(errors.length > 20) console.error(`  ... and ${errors.length-20} more`);
}

const topicCounts = {};
validated.forEach(q => { topicCounts[q.topic]=(topicCounts[q.topic]||0)+1; });
console.log('\nNew questions generated per topic:');
Object.entries(topicCounts).sort().forEach(([t,c]) => console.log(`  ${t}: +${c}`));
console.log(`\nTotal new: ${validated.length}`);
console.log(`Validation errors: ${errors.length}`);

const combined = [...existing, ...validated];
writeFileSync(MATHS_FILE, JSON.stringify(combined, null, 2));
console.log(`Total in maths.json: ${combined.length}`);
