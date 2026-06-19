const PROXY_URL = '/.netlify/functions/groq'

export async function getExplanation(question, wrongAnswer, correctAnswer, subject) {
  const prompt = `You are a friendly tutor helping an 8-year-old Irish child named Emilia with ${subject}.
She answered "${wrongAnswer}" but the correct answer is "${correctAnswer}".
Question: "${question}"
Give a short, encouraging explanation (2-3 sentences, simple words, fun and friendly). Start with something positive.`

  try {
    const res = await fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
        temperature: 0.7
      })
    })
    if (!res.ok) throw new Error('proxy error')
    const data = await res.json()
    return data.content || `Good try! The correct answer is: ${correctAnswer}`
  } catch {
    return `Good try! The correct answer is: ${correctAnswer}`
  }
}
