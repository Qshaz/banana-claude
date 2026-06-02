export function useAI() {
  async function suggestCategories(content, existingTags = []) {
    const apiKey = localStorage.getItem('dah_api_key')
    if (!apiKey || content.trim().length < 80) return []

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 80,
          messages: [{
            role: 'user',
            content: `Suggest 1-3 category tags for this note.${existingTags.length ? ` Prefer existing tags if fitting: ${existingTags.slice(0, 15).join(', ')}.` : ''} Reply with ONLY a JSON array like ["tag1","tag2"]. Tags must be lowercase, no spaces (use hyphens).

Note: ${content.slice(0, 500)}`
          }]
        })
      })
      if (!res.ok) return []
      const data = await res.json()
      const parsed = JSON.parse(data.content[0].text.trim())
      if (!Array.isArray(parsed)) return []
      return parsed
        .slice(0, 3)
        .map(t => String(t).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9_-]/g, ''))
        .filter(Boolean)
    } catch {
      return []
    }
  }

  return { suggestCategories }
}
