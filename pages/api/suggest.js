// pages/api/suggest.js
import { Configuration, OpenAIApi } from 'openai'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { mood, tags = [], colors = [] } = req.body
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'OPENAI_API_KEY not configured' })
  }
  if (!mood) {
    return res.status(400).json({ error: 'Mood is required' })
  }

  // model specs as requested
  const modelDesc = `5'6" height,black hair,pale skin, medium body build with fair skin , long wavy hair`

  const openai = new OpenAIApi(new Configuration({ apiKey }))
  let outfitInfo = { text: '', keywords: '' }

  try {
    const chat = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: "You're a stylish personal shopper." },
        {
          role: 'user',
          content:
            `Suggest an outfit for mood: "${mood}". ` +
            `Incorporate tags: [${tags.join(', ')}], colors: [${colors.join(', ')}], ` +
            `for a model who is ${modelDesc}. ` +
            `Respond ONLY in valid JSON: { "text": "...", "keywords": "..." }`
        }
      ],
      temperature: 0.8
    })

    try {
      outfitInfo = JSON.parse(chat.data.choices[0].message.content)
    } catch {
      outfitInfo.text = chat.data.choices[0].message.content.trim()
    }
  } catch (err) {
    console.error('ChatGPT error:', err)
    return res.status(500).json({ error: 'Failed to generate outfit text' })
  }

  // build the Pollinations prompt
  let prompt = `high-fashion editorial photo, ${outfitInfo.text}, worn by a model who is ${modelDesc}`
  if (tags.length)   prompt += `, featuring ${tags.join(', ')}`
  if (colors.length) prompt += `, color theme ${colors.join(', ')}`
  prompt += `, pastel colours, cinematic lighting --ar 1:1`

  const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`

  return res.status(200).json({
    outfit: {
      text: outfitInfo.text,
      imageUrl
    }
  })
}