import { useState } from 'react'
import Logo from './Logo'
import { getProfiles, addProfile, deleteProfile, profileColor, saveProfiles } from '../utils/profiles'

function initials(name) {
  return name.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export default function ProfileScreen({ onSelect, onProfilesChange }) {
  const [profiles, setProfiles] = useState(getProfiles)

  // If only the auto-created "Me" profile exists, show the signup screen
  const isFirstTime = profiles.length === 1 && profiles[0].id === 'default' && profiles[0].name === 'Me'
  const [view, setView] = useState(isFirstTime ? 'signup' : 'login')
  const [inputName, setInputName] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  function handleSignup() {
    if (!inputName.trim()) return
    // Rename the default profile to the user's name
    const updated = [{ id: 'default', name: inputName.trim() }]
    saveProfiles(updated)
    setProfiles(updated)
    onProfilesChange?.(updated)
    onSelect(updated[0])
  }

  function handleAddProfile() {
    if (!inputName.trim()) return
    const p = addProfile(inputName.trim())
    const updated = getProfiles()
    setProfiles(updated)
    setInputName('')
    setView('login')
    onProfilesChange?.(updated)
  }

  function handleDelete(id) {
    deleteProfile(id)
    const updated = getProfiles()
    setProfiles(updated)
    setDeleteConfirm(null)
    onProfilesChange?.(updated)
  }

  if (view === 'signup') {
    return (
      <div className="lock-screen">
        <div className="welcome-screen">
          <Logo size={56} />
          <div className="welcome-title">Dar Al Hikmah</div>
          <div className="welcome-subtitle">Your personal knowledge archive</div>

          <div className="welcome-form">
            <label className="welcome-label">What's your name?</label>
            <input
              className="welcome-input"
              placeholder="e.g. Shazia"
              value={inputName}
              onChange={e => setInputName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSignup()}
              autoFocus
              maxLength={30}
            />
            <button
              className="welcome-btn"
              onClick={handleSignup}
              disabled={!inputName.trim()}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (view === 'add') {
    return (
      <div className="lock-screen">
        <div className="welcome-screen">
          <Logo size={44} />
          <div className="welcome-title" style={{ fontSize: 22 }}>Create Profile</div>

          <div className="welcome-form">
            <label className="welcome-label">Name</label>
            <input
              className="welcome-input"
              placeholder="Profile name"
              value={inputName}
              onChange={e => setInputName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAddProfile(); if (e.key === 'Escape') setView('login') }}
              autoFocus
              maxLength={30}
            />
            <button className="welcome-btn" onClick={handleAddProfile} disabled={!inputName.trim()}>
              Create Profile
            </button>
            <button className="welcome-link" onClick={() => { setView('login'); setInputName('') }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="lock-screen">
      <div className="profile-screen-content">
        <Logo size={44} />
        <div className="profile-screen-title">Who's signing in?</div>

        <div className="profile-list">
          {profiles.map((p, i) => (
            <div key={p.id} className="profile-card-wrapper">
              <button className="profile-card" onClick={() => onSelect(p)}>
                <div className="profile-avatar" style={{ background: profileColor(i) }}>
                  {initials(p.name)}
                </div>
                <div className="profile-name">{p.name}</div>
                <svg className="profile-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
              {profiles.length > 1 && (
                <button className="profile-delete-btn" onClick={e => { e.stopPropagation(); setDeleteConfirm(p.id) }}>×</button>
              )}
            </div>
          ))}

          <button className="profile-add-btn" onClick={() => { setView('add'); setInputName('') }}>
            <span className="profile-add-icon">+</span>
            <span>Add Profile</span>
          </button>
        </div>
      </div>

      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal confirm-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Delete profile?</div>
              <button className="modal-close" onClick={() => setDeleteConfirm(null)}>✕</button>
            </div>
            <div className="confirm-body">
              All notes for "{profiles.find(p => p.id === deleteConfirm)?.name}" will be permanently deleted.
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
