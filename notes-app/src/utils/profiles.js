export const PROFILE_COLORS = ['#B89A64', '#355C8C', '#27AE60', '#C0392B', '#8E44AD', '#E67E22']

export function getProfiles() {
  try {
    const raw = localStorage.getItem('dah_profiles')
    if (raw) return JSON.parse(raw)
    migrateToProfiles()
    return JSON.parse(localStorage.getItem('dah_profiles'))
  } catch {
    return [{ id: 'default', name: 'Me' }]
  }
}

function migrateToProfiles() {
  const profile = { id: 'default', name: 'Me' }
  localStorage.setItem('dah_profiles', JSON.stringify([profile]))
  const notes = localStorage.getItem('banana-notes-v1')
  if (notes) localStorage.setItem('dah_notes_v1_default', notes)
  const pin = localStorage.getItem('dah_pin_hash')
  if (pin) localStorage.setItem('dah_pin_hash_default', pin)
  const token = localStorage.getItem('dah_gist_token')
  if (token) localStorage.setItem('dah_gist_token_default', token)
  const gistId = localStorage.getItem('dah_gist_id')
  if (gistId) localStorage.setItem('dah_gist_id_default', gistId)
}

export function saveProfiles(profiles) {
  localStorage.setItem('dah_profiles', JSON.stringify(profiles))
}

export function addProfile(name) {
  const profiles = getProfiles()
  const profile = { id: crypto.randomUUID(), name: name.trim() }
  saveProfiles([...profiles, profile])
  return profile
}

export function deleteProfile(id) {
  saveProfiles(getProfiles().filter(p => p.id !== id))
  ;['dah_notes_v1_', 'dah_pin_hash_', 'dah_gist_token_', 'dah_gist_id_'].forEach(k =>
    localStorage.removeItem(k + id)
  )
}

export function profileColor(index) {
  return PROFILE_COLORS[index % PROFILE_COLORS.length]
}

export function notesKey(profileId)     { return `dah_notes_v1_${profileId}` }
export function pinKey(profileId)       { return `dah_pin_hash_${profileId}` }
export function gistTokenKey(profileId) { return `dah_gist_token_${profileId}` }
export function gistIdKey(profileId)    { return `dah_gist_id_${profileId}` }
