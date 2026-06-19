# /add-questions

Add new questions to the question bank for a given subject and topic.

## Usage
`/add-questions subject=english topic=spelling count=10`

## What to do
1. Read the existing questions from `src/data/questions/$subject.json`
2. Check what topics already exist and what the highest ID number is
3. Write `$count` new age-appropriate questions (3rd class Ireland level, 8-year-old) for `$topic`
4. Follow this exact format:
```json
{
  "id": "$subject-$topic-NNN",
  "subject": "$subject",
  "topic": "$topic",
  "difficulty": 1-3,
  "type": "multiple-choice",
  "question": "...",
  "options": ["A", "B", "C", "D"],
  "answer": "A",
  "explanation": "Short, fun explanation an 8-year-old will enjoy"
}
```
5. Append the new questions to the existing array in the JSON file
6. Confirm how many questions now exist in that file

Valid subjects: `english` `irish` `maths` `history` `geography` `science` `genknow` `sphe` `ethics`
