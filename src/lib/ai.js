const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models'
const MODEL_FALLBACKS = ['gemini-2.0-flash', 'gemini-1.5-flash']

function fallbackRuleReply(message) {
  const lowered = message.toLowerCase()
  if (lowered.includes('plastic')) {
    return 'Plastic items like bottles should be rinsed and placed in the Blue recycling bin. They earn you 10 points!'
  }
  if (lowered.includes('glass')) {
    return 'Glass bottles and jars go in the Green bin. Be careful not to break them! They earn you 15 points!'
  }
  return "I'm your Eco Assistant! Ask me how to recycle plastic, glass, or general waste."
}

function buildFriendlyError(status, details) {
  if (status === 429 || details.includes('RESOURCE_EXHAUSTED')) {
    return 'AI quota exceeded for this API key. Enable billing or wait for quota reset in Google AI Studio.'
  }
  if (status === 403 || details.includes('PERMISSION_DENIED')) {
    return 'AI key is blocked or API is not enabled for this project.'
  }
  if (status === 400 || details.includes('API key not valid')) {
    return 'AI key is invalid. Please check VITE_GEMINI_API_KEY.'
  }
  return `AI request failed (${status || 'network'}).`
}

export async function getEcoAssistantReply(userMessage) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY

  if (!apiKey) {
    throw new Error('Missing Gemini API key. Set VITE_GEMINI_API_KEY in your .env file.')
  }

  const prompt = `
You are GreenEdu Loop's Eco Assistant.
Give short, practical recycling guidance for students and families.
Keep replies between 1 and 4 sentences.
Include safety reminders when relevant.

User question: "${userMessage}"
  `.trim()

  let lastErrorMessage = ''

  for (const model of MODEL_FALLBACKS) {
    const response = await fetch(`${GEMINI_BASE_URL}/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 220,
        },
      }),
    })

    if (!response.ok) {
      const details = await response.text()
      lastErrorMessage = buildFriendlyError(response.status, details)

      // If the model doesn't exist for this key/project, try next model.
      if (response.status === 404) continue

      throw new Error(lastErrorMessage)
    }

    const data = await response.json()
    const modelText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

    if (modelText) return modelText
  }

  throw new Error(lastErrorMessage || fallbackRuleReply(userMessage))
}

export function getOfflineEcoReply(userMessage) {
  return fallbackRuleReply(userMessage)
}
