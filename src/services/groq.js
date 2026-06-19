const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.1-8b-instant'

export async function getExplanation(question, wrongAnswer, correctAnswer, subject) {
  const key = import.meta.env.VITE_GROQ_API_KEY
  if (!key) return `Good try! The correct answer is: ${correctAnswer}. ${correctAnswer}`

  const prompt = `You are a friendly tutor helping an 8-year-old Irish child named Emilia with ${subject}.
She answered "${wrongAnswer}" but the correct answer is "${correctAnswer}".
Question: "${question}"
Give a short, encouraging explanation (2-3 sentences, simple words, fun and friendly). Start with something positive.`

  try {
    const res = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
        temperature: 0.7
      })
    })
    const data = await res.json()
    return data.choices?.[0]?.message?.content || `Good try! The correct answer is: ${correctAnswer}`
  } catch {
    return `Good try! The correct answer is: ${correctAnswer}`
  }
}
