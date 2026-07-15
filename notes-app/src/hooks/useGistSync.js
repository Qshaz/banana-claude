import { useState, useEffect, useCallback, useRef } from 'react'
import { notesKey, gistTokenKey, gistIdKey } from '../utils/profiles'

const GIST_FILENAME = 'dar-al-hikmah-notes.json'
const GIST_DESCRIPTION = 'Dar Al Hikmah — Notes Sync'

// status: 'idle' | 'syncing' | 'synced' | 'error'
export function useGistSync(notes, setNotes, profileId = 'default') {
  const [status, setStatus] = useState('idle')
  const pushTimer = useRef(null)
  const initialized = useRef(false)

  const getToken = () => localStorage.getItem(gistTokenKey(profileId)) || ''
  const getGistId = () => localStorage.getItem(gistIdKey(profileId)) || ''

  const headers = (token) => ({
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  })

  // Pull from Gist and merge into local notes (Gist wins by updatedAt)
  const pull = useCallback(async () => {
    const token = getToken()
    if (!token) return

    setStatus('syncing')
    try {
      let gistId = getGistId()

      if (!gistId) {
        // Find existing gist by description
        const res = await fetch('https://api.github.com/gists', { headers: headers(token) })
        if (!res.ok) throw new Error('auth')
        const gists = await res.json()
        const found = gists.find(g => g.description === GIST_DESCRIPTION && g.files[GIST_FILENAME])
        if (found) {
          gistId = found.id
          localStorage.setItem(gistIdKey(profileId), gistId)
        }
      }

      if (!gistId) {
        setStatus('synced') // No remote yet, local is source of truth
        return
      }

      const res = await fetch(`https://api.github.com/gists/${gistId}`, { headers: headers(token) })
      if (!res.ok) throw new Error('fetch')
      const gist = await res.json()
      const raw = gist.files[GIST_FILENAME]?.content
      if (!raw) { setStatus('synced'); return }

      const remoteNotes = JSON.parse(raw)
      setNotes(localNotes => {
        const merged = mergeNotes(localNotes, remoteNotes)
        localStorage.setItem(notesKey(profileId), JSON.stringify(merged))
        return merged
      })
      setStatus('synced')
    } catch {
      setStatus('error')
    }
  }, [setNotes])

  // Push local notes to Gist
  const push = useCallback(async (currentNotes) => {
    const token = getToken()
    if (!token) return

    setStatus('syncing')
    try {
      let gistId = getGistId()
      const body = JSON.stringify({
        description: GIST_DESCRIPTION,
        public: false,
        files: { [GIST_FILENAME]: { content: JSON.stringify(currentNotes) } }
      })

      if (!gistId) {
        const res = await fetch('https://api.github.com/gists', {
          method: 'POST', headers: headers(token), body
        })
        if (!res.ok) throw new Error('create')
        const gist = await res.json()
        localStorage.setItem(gistIdKey(profileId), gist.id)
      } else {
        const res = await fetch(`https://api.github.com/gists/${gistId}`, {
          method: 'PATCH', headers: headers(token), body
        })
        if (!res.ok) throw new Error('update')
      }
      setStatus('synced')
    } catch {
      setStatus('error')
    }
  }, [])

  // Pull on mount / when token added
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      pull()
    }
  }, [pull])

  // Debounced push whenever notes change
  useEffect(() => {
    if (!getToken()) return
    clearTimeout(pushTimer.current)
    pushTimer.current = setTimeout(() => push(notes), 3000)
    return () => clearTimeout(pushTimer.current)
  }, [notes, push])

  return { status, pull }
}

// Merge two note arrays: latest updatedAt wins per id
function mergeNotes(local, remote) {
  const map = new Map()
  for (const n of local) map.set(n.id, n)
  for (const n of remote) {
    const existing = map.get(n.id)
    if (!existing || new Date(n.updatedAt) > new Date(existing.updatedAt)) {
      map.set(n.id, n)
    }
  }
  return Array.from(map.values()).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
}
