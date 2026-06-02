import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'banana-notes-v1'

function uuid() {
  return crypto.randomUUID()
}

function now() {
  return new Date().toISOString()
}

const TAG_COLORS = [
  'yellow', 'blue', 'green', 'pink', 'purple', 'orange', 'gray'
]

// Deterministic color for a tag name
export function tagColor(tag) {
  let h = 0
  for (let i = 0; i < tag.length; i++) h = (h * 31 + tag.charCodeAt(i)) & 0xffffffff
  return TAG_COLORS[Math.abs(h) % TAG_COLORS.length]
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function save(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
}

export function useNotes() {
  const [notes, setNotes] = useState(load)

  useEffect(() => {
    save(notes)
  }, [notes])

  const createNote = useCallback((partial = {}) => {
    const note = {
      id: uuid(),
      title: '',
      content: '',
      tags: [],
      color: 'default',
      pinned: false,
      createdAt: now(),
      updatedAt: now(),
      source: 'manual',
      ...partial,
    }
    setNotes(prev => [note, ...prev])
    return note.id
  }, [])

  const updateNote = useCallback((id, changes) => {
    setNotes(prev => prev.map(n =>
      n.id === id ? { ...n, ...changes, updatedAt: now() } : n
    ))
  }, [])

  const deleteNote = useCallback((id) => {
    setNotes(prev => prev.filter(n => n.id !== id))
  }, [])

  const importNotes = useCallback((parsed) => {
    const imported = parsed.map(p => ({
      id: uuid(),
      title: p.title || 'Untitled',
      content: p.content || '',
      tags: p.tags || [],
      color: 'default',
      pinned: false,
      createdAt: p.createdAt || now(),
      updatedAt: now(),
      source: 'imported',
    }))
    setNotes(prev => [...imported, ...prev])
    return imported.length
  }, [])

  const deleteAll = useCallback(() => {
    setNotes([])
  }, [])

  // All unique tags across all notes
  const allTags = [...new Set(notes.flatMap(n => n.tags))].sort()

  return { notes, allTags, createNote, updateNote, deleteNote, importNotes, deleteAll }
}

// Parse pasted/uploaded text into an array of {title, content, tags, createdAt}
export function parseImportText(text) {
  const raw = text.trim()
  if (!raw) return []

  // Split on explicit separator `---` on its own line
  const chunks = raw.split(/\n---+\n/)

  return chunks.map(chunk => {
    const lines = chunk.trim().split('\n')
    const title = (lines[0] || '').replace(/^#+\s*/, '').trim()
    const content = lines.slice(1).join('\n').trim()

    // Extract #hashtags from content
    const tagMatches = content.match(/#([a-zA-Z][a-zA-Z0-9_-]*)/g) || []
    const tags = [...new Set(tagMatches.map(t => t.slice(1).toLowerCase()))]

    return { title, content, tags }
  }).filter(n => n.title || n.content)
}
