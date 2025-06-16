// pages/index.js
import React, { useState, useEffect } from 'react'

export default function Home() {
  /* ---------------- state ---------------- */
  const [mood, setMood] = useState('')
  const [customInstructions, setCustomInstructions] = useState('') // new state for extra instructions
  const [outfit, setOutfit] = useState(null)
  const [loading, setLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const [revealingLevel, setRevealingLevel] = useState(50) // Default 50%

  const outfitTags = [
    'Crop tops', 'Dresses', 'Shirts', 'T‑shirts', 'Pants',
    'Shorts', 'Skirts', 'Mini skirts', 'Jeans', 'Tights',
    // new sexy look tags added:
 'sexy',  
  ]
  const [selectedTags, setSelectedTags] = useState([])

  const presetColors = [
    '#FFC0CB', // Pastel Pink
    '#FFFACD', // Pastel Yellow
    '#98FB98', // Mint Green
    '#87CEEB', // Sky Blue
    '#E6E6FA', // Lavender
    '#D3D3D3', // Soft Gray
    '#FFB6C1', // Light Pink
    '#FFD700', // Gold
    '#90EE90', // Light Green
    '#ADD8E6', // Light Blue
    '#F0E68C', // Khaki
    '#B0C4DE'  // Light Steel Blue
  ]
  const [selectedColors, setSelectedColors] = useState([])
  const [customColor, setCustomColor] = useState('#ffffff')

  /* ---------------- helpers ---------------- */
  const toggleTag = tag =>
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  const toggleColor = col =>
    setSelectedColors(prev =>
      prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
    )
  const pickCustom = e => {
    const hex = e.target.value
    setCustomColor(hex)
    if (!selectedColors.includes(hex)) setSelectedColors([...selectedColors, hex])
  }
  const clearCustom = () => {
    setSelectedColors(selectedColors.filter(c => c !== customColor))
    setCustomColor('#ffffff')
  }

  useEffect(() => {
    if (outfit?.imageUrl) setImageLoading(true)
  }, [outfit])

  /* ---------------- submit ---------------- */
  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setOutfit(null)
    try {
      const r = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood,
          tags: selectedTags,
          colors: selectedColors,
          customInstructions,
          revealingLevel
        })
      })
      const { outfit } = await r.json()
      setOutfit(outfit)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  /* ---------------- ui ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100/60 to-gray-200/60 backdrop-blur-md flex items-center justify-center p-6 font-sf-pro font-thin text-gray-900 animate-fadeIn">
      <div className="w-full max-w-6xl bg-white/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden md:flex">

        {/* left — controls */}
        <div className="w-full md:w-1/2 p-10 space-y-8">
          <h1 className="text-5xl font-thin tracking-tight select-none animate-bounce">Cute Outfit Suggester</h1>

          {/* tags */}
          <section>
            <h2 className="text-lg mb-3">Outfit Ideas</h2>
            <div className="flex flex-wrap gap-2">
              {outfitTags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-1 rounded-full border text-sm transition backdrop-blur-sm ${
                    selectedTags.includes(tag) ? 'bg-gray-900 text-white' : 'bg-white/20 hover:bg-white/40'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </section>

          {/* colours */}
          <section>
            <h2 className="text-lg mb-3">Colour Themes</h2>
            <div className="flex flex-wrap items-center gap-3">
              {presetColors.map(col => (
                <button
                  key={col}
                  type="button"
                  onClick={() => toggleColor(col)}
                  className={`w-10 h-10 rounded-lg border-2 transition ${
                    selectedColors.includes(col)
                      ? 'border-gray-900 shadow-md scale-105'
                      : 'border-gray-300 hover:scale-105 hover:shadow-sm'
                  }`}
                  style={{ backgroundColor: col }}
                  title={col}
                />
              ))}

              {/* custom wheel */}
              <div className="flex items-center gap-2 ml-1">
                <div className="relative">
                  <input
                    type="color"
                    value={customColor}
                    onChange={pickCustom}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    title="Pick custom colour"
                  />
                  <div
                    className="w-10 h-10 rounded-full border-2 border-gray-300 shadow-sm"
                    style={{
                      background: `conic-gradient(
                        red, orange, yellow, green, cyan, blue, violet, red
                      )`
                    }}
                    title="Color Wheel"
                  />
                </div>
                <button
                  type="button"
                  onClick={clearCustom}
                  className="text-xs underline hover:opacity-70"
                >
                  clear
                </button>
              </div>
            </div>
          </section>

          {/* optional clothing instructions */}
          <section>
            <h2 className="text-lg mb-3">Additional Instructions</h2>
            <textarea
              value={customInstructions}
              onChange={e => setCustomInstructions(e.target.value)}
              placeholder="Optional: specify any clothing details to refine the outfit..."
              className="w-full h-24 px-4 py-2 rounded-xl border border-gray-300 bg-white/70 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 backdrop-blur-sm transition transform hover:scale-105"
            />
          </section>

          {/* revealing slider */}
          <section>
            <h2 className="text-lg mb-3">Revealing Level</h2>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="100"
                value={revealingLevel}
                onChange={(e) => setRevealingLevel(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>Conservative</span>
                <span>{revealingLevel}%</span>
                <span>Revealing</span>
              </div>
            </div>
          </section>

          {/* mood + submit */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              value={mood}
              onChange={e => setMood(e.target.value)}
              placeholder="Describe your mood…"
              className="w-full px-5 py-3 rounded-xl border border-gray-300 bg-white/70 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 backdrop-blur-sm transition transform hover:scale-105"
            />
            <button
              type="submit"
              disabled={loading || !mood.trim()}
              className="w-full px-6 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-40 transition transform hover:animate-pulse"
            >
              {loading ? 'Suggesting…' : 'Suggest Outfit'}
            </button>
          </form>

          {loading && (
            <div className="flex items-center gap-2 pt-4 animate-pulse">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
              <span className="text-sm">Thinking…</span>
            </div>
          )}
        </div>

        {/* right — result */}
        <div className="w-full md:w-1/2 bg-white/20 backdrop-blur-lg border-l border-white/60 p-10 flex items-center justify-center">
          {!outfit && !loading && (
            <p className="text-center text-gray-500 select-none">Your outfit will appear here.</p>
          )}

          {outfit && (
            <div className="w-full max-w-sm mx-auto space-y-4">
              <p className="text-md leading-relaxed">{outfit.text}</p>
              <div className="relative w-full" style={{ paddingTop: '100%' }}>
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
                  </div>
                )}
                <img
                  src={outfit.imageUrl}
                  alt="Suggested outfit"
                  onLoad={() => setImageLoading(false)}
                  className={`absolute inset-0 w-full h-full object-cover rounded-2xl shadow-md ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}