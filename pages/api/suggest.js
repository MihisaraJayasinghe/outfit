import { Configuration, OpenAIApi } from 'openai'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { mood } = req.body
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    res.status(500).json({ error: 'OPENAI_API_KEY not configured' })
    return
  }

  if (!mood) {
    res.status(400).json({ error: 'Mood is required' })
    return
  }

  const configuration = new Configuration({ apiKey })
  const openai = new OpenAIApi(configuration)

  try {
    const chatCompletion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: "You're a stylish personal shopper." },
        { role: 'user', content: `Suggest an outfit for: "${mood}". Please respond in JSON { "text": "...", "keywords": "..." }` }
      ]
    })

    const message = chatCompletion.data.choices[0].message?.content || '{}'
    let outfitInfo
    try {
      outfitInfo = JSON.parse(message)
    } catch (e) {
      outfitInfo = { text: message, keywords: '' }
    }

    const dallePrompt = `A clean, high-fashion editorial illustration of a woman wearing: ${outfitInfo.text}. Avoid: blurry, watermark, low resolution, deformed, cartoonish.`

    const imageResponse = await openai.createImage({
      prompt: dallePrompt,
      n: 1,
      size: '512x512'
    })

    const imageUrl = imageResponse.data.data[0].url

    res.status(200).json({ outfit: { text: outfitInfo.text, imageUrl } })
  } catch (error) {
    console.error(error.response?.data || error.message)
    res.status(500).json({ error: 'Failed to generate outfit' })
  }
}
