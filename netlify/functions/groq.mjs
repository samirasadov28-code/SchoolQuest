/**
 * Netlify serverless proxy for Groq.
 *
 * Keeps the Groq API key on the SERVER. The browser calls
 * `/.netlify/functions/groq` with { messages, max_tokens, temperature, model }
 * and never sees the key.
 *
 * Set the key in Netlify → Site settings → Environment variables:
 *     GROQ_API_KEY = gsk_...
 * (NOTE: no VITE_ prefix — that would bundle it into the client again.)
 */
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const DEFAULT_MODEL = 'llama-3.1-8b-instant'

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) }
  }

  const key = process.env.GROQ_API_KEY
  if (!key) {
    return { statusCode: 500, body: JSON.stringify({ error: 'GROQ_API_KEY is not configured on the server' }) }
  }

  let payload
  try { payload = JSON.parse(event.body || '{}') }
  catch { return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) } }

  const { messages, max_tokens = 300, temperature = 0.7, model = DEFAULT_MODEL } = payload
  if (!Array.isArray(messages) || messages.length === 0) {
    return { statusCode: 400, body: JSON.stringify({ error: 'messages[] is required' }) }
  }

  try {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, max_tokens, temperature }),
    })
    if (!res.ok) {
      const text = await res.text()
      return { statusCode: res.status, body: JSON.stringify({ error: `Groq error: ${text}` }) }
    }
    const data = await res.json()
    const content = data?.choices?.[0]?.message?.content ?? ''
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    }
  } catch (e) {
    return { statusCode: 502, body: JSON.stringify({ error: String(e?.message || e) }) }
  }
}
