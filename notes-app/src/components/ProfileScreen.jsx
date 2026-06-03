import { useState } from 'react'
import Logo from './Logo'
import { getProfiles, addProfile, deleteProfile, profileColor } from '../utils/profiles'

function initials(name) {
  return name.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export default function ProfileScreen({ onSelect, onProfilesChange }) {
  const [profiles, setProfiles] = useState(getProfiles)
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  function handleAdd() {
    if (!newName.trim()) return
    const profile = addProfile(newName)
    const updated = [...profiles, profile]
    setProfiles(updated)
    setNewName('')
    setAdding(false)
    onProfilesChange?.(updated)
  }

  function handleDelete(id) {
    deleteProfile(id)
    const updated = profiles.filter(p => p.id !== id)
    setProfiles(updated)
    setDeleteConfirm(null)
    onProfilesChange?.(updated)
  }

  return (
    <div className="lock-screen">
      <div className="profile-screen-content">
        <Logo size={44} />
        <div className="profile-screen-title">Who's using the app?</div>

        <div className="profile-list">
          {profiles.map((p, i) => (
            <div key={p.id} className="profile-card-wrapper">
              <button className="profile-card" onClick={() => onSelect(p)}>
                <div className="profile-avatar" style={{ background: profileColor(i) }}>
                  {initials(p.name)}
                </div>
                <div className="profile-name">{p.name}</div>
              </button>
              {profiles.length > 1 && (
                <button
                  className="profile-delete-btn"
                  onClick={e => { e.stopPropagation(); setDeleteConfirm(p.id) }}
                >×</button>
              )}
            </div>
          ))}

          {adding ? (
            <div className="profile-add-form">
              <input
                className="profile-add-input"
                placeholder="Profile name"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setAdding(false) }}
                autoFocus
                maxLength={20}
              />
              <div className="profile-add-actions">
                <button className="btn btn-secondary" onClick={() => { setAdding(false); setNewName('') }}>Cancel</button>
                <button className="btn btn-primary" onClick={handleAdd} disabled={!newName.trim()}>Add</button>
              </div>
            </div>
          ) : (
            <button className="profile-add-btn" onClick={() => setAdding(true)}>
              <span className="profile-add-icon">+</span>
              <span>Add Profile</span>
            </button>
          )}
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
              This will permanently delete "{profiles.find(p => p.id === deleteConfirm)?.name}" and all their notes.
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
