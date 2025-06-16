import { useState } from 'react'

export default function Home() {
  const [mood, setMood] = useState('')
  const [outfit, setOutfit] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setOutfit(null)
    try {
      const res = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood })
      })
      const data = await res.json()
      setOutfit(data.outfit)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pastelYellow">
      <h1 className="text-3xl font-bold mb-4">Cute Outfit Suggester</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
        <input
          type="text"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder="Describe your mood..."
          className="p-2 border rounded w-64"
        />
        <button type="submit" className="bg-pastelPink text-gray-800 py-2 px-4 rounded">
          Suggest Outfit
        </button>
      </form>
      {loading && <p className="mt-4">Thinking...</p>}
      {outfit && (
        <div className="mt-8 text-center">
          <p className="mb-4">{outfit.text}</p>
          {outfit.imageUrl && (
            <img src={outfit.imageUrl} alt="Outfit" width={512} height={512} className="rounded border" />
          )}
        </div>
      )}
    </div>
  )
}
