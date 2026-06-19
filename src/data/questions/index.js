import english    from './english.json'
import irish      from './irish.json'
import maths      from './maths.json'
import history    from './history.json'
import geography  from './geography.json'
import science    from './science.json'
import genknow    from './general-knowledge.json'
import sphe       from './sphe.json'
import ethics     from './ethical.json'
import coding     from './coding.json'

export const QUESTION_BANK = [
  ...english,
  ...irish,
  ...maths,
  ...history,
  ...geography,
  ...science,
  ...genknow,
  ...sphe,
  ...ethics,
  ...coding,
]

export const QUESTIONS_BY_SUBJECT = {
  english,
  irish,
  maths,
  history,
  geography,
  science,
  genknow,
  sphe,
  ethics,
  coding,
}

export default QUESTION_BANK
