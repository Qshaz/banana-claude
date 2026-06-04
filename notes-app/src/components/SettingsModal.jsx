import { useState } from 'react'
import { savePin, removePin, hasPinSet } from './LockScreen'
import { gistTokenKey, gistIdKey, getProfiles, addProfile, deleteProfile, profileColor } from '../utils/profiles'

function initials(name) {
  return name.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

function PinEntry({ onComplete, label }) {
  const [digits, setDigits] = useState([])
  const LEN = 4

  function tap(d) {
    if (digits.length >= LEN) return
    const next = [...digits, d]
    setDigits(next)
    if (next.length === LEN) { setTimeout(() => onComplete(next.join('')), 80) }
  }

  function del() { setDigits(p => p.slice(0, -1)) }

  const PAD = [1,2,3,4,5,6,7,8,9,null,0,'del']

  return (
    <div className="pin-setup">
      <div className="pin-setup-label">{label}</div>
      <div className="pin-setup-dots">
        {Array.from({length: LEN}).map((_, i) => (
          <div key={i} className={`lock-dot${i < digits.length ? ' filled' : ''}`} />
        ))}
      </div>
      <div className="pin-grid pin-grid-sm">
        {PAD.map((key, i) => {
          if (key === null) return <div key={i} />
          if (key === 'del') return <button key={i} className="pin-btn pin-del" onClick={del}>⌫</button>
          return <button key={i} className="pin-btn" onClick={() => tap(key)}>{key}</button>
        })}
      </div>
    </div>
  )
}

export default function SettingsModal({ onClose, profileId = 'default', profileName = 'Me', onSwitchProfile }) {
  const tokenKey = gistTokenKey(profileId)
  const idKey = gistIdKey(profileId)

  const [gistToken, setGistToken] = useState(localStorage.getItem(tokenKey) || '')
  const [saved, setSaved] = useState(false)
  const [pinFlow, setPinFlow] = useState(null)
  const [firstPin, setFirstPin] = useState('')
  const [pinError, setPinError] = useState('')
  const [pinEnabled, setPinEnabled] = useState(() => hasPinSet(profileId))

  const [profiles, setProfiles] = useState(getProfiles)
  const [addingProfile, setAddingProfile] = useState(false)
  const [newProfileName, setNewProfileName] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  function handleFirstPin(pin) { setFirstPin(pin); setPinFlow('set2') }

  async function handleConfirmPin(pin) {
    if (pin !== firstPin) {
      setPinError("PINs don't match. Try again.")
      setPinFlow('set1'); setFirstPin('')
      setTimeout(() => setPinError(''), 2000)
      return
    }
    await savePin(pin, profileId)
    setPinEnabled(true); setPinFlow('done')
    setTimeout(() => setPinFlow(null), 1500)
  }

  function handleRemovePin() { removePin(profileId); setPinEnabled(false) }

  function handleAddProfile() {
    if (!newProfileName.trim()) return
    const p = addProfile(newProfileName)
    setProfiles(getProfiles())
    setNewProfileName(''); setAddingProfile(false)
  }

  function handleDeleteProfile(id) {
    deleteProfile(id)
    setProfiles(getProfiles())
    setDeleteConfirm(null)
  }

  function save() {
    if (gistToken.trim()) localStorage.setItem(tokenKey, gistToken.trim())
    else { localStorage.removeItem(tokenKey); localStorage.removeItem(idKey) }
    setSaved(true)
    setTimeout(onClose, 700)
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <div className="modal-title">Settings</div>
            <div className="modal-subtitle">{profileName}</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="settings-body">

          {/* Profiles */}
          <div className="settings-section">
            <div className="settings-label">Profiles</div>
            <div className="settings-profiles-list">
              {profiles.map((p, i) => (
                <div key={p.id} className={`settings-profile-row${p.id === profileId ? ' active' : ''}`}>
                  <div className="settings-profile-avatar" style={{ background: profileColor(i) }}>
                    {initials(p.name)}
                  </div>
                  <span className="settings-profile-name">{p.name}</span>
                  <div className="settings-profile-actions">
                    {p.id !== profileId && onSwitchProfile && (
                      <button className="btn btn-secondary btn-xs" onClick={onSwitchProfile}>Switch</button>
                    )}
                    {p.id === profileId && <span className="settings-profile-badge">Active</span>}
                    {profiles.length > 1 && (
                      <button
                        className="btn btn-xs"
                        style={{ color: 'var(--danger)' }}
                        onClick={() => setDeleteConfirm(p.id)}
                      >Delete</button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {addingProfile ? (
              <div className="settings-add-profile">
                <input
                  className="settings-input"
                  placeholder="Profile name"
                  value={newProfileName}
                  onChange={e => setNewProfileName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleAddProfile(); if (e.key === 'Escape') setAddingProfile(false) }}
                  autoFocus
                  maxLength={20}
                />
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button className="btn btn-secondary" onClick={() => { setAddingProfile(false); setNewProfileName('') }}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleAddProfile} disabled={!newProfileName.trim()}>Add</button>
                </div>
              </div>
            ) : (
              <button className="btn btn-secondary" style={{ marginTop: 10 }} onClick={() => setAddingProfile(true)}>
                + Add Profile
              </button>
            )}
          </div>

          {/* PIN lock */}
          <div className="settings-section">
            <div className="settings-label">App Lock (PIN)</div>
            {pinFlow === null && (
              <>
                <p className="settings-hint">
                  {pinEnabled ? 'PIN lock is enabled for this profile.' : 'Lock this profile with a 4-digit PIN.'}
                </p>
                {pinError && <p className="settings-hint" style={{ color: 'var(--danger)' }}>{pinError}</p>}
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button className="btn btn-secondary" onClick={() => setPinFlow('set1')}>
                    {pinEnabled ? 'Change PIN' : 'Set PIN'}
                  </button>
                  {pinEnabled && (
                    <button className="btn btn-secondary" style={{ color: 'var(--danger)' }} onClick={handleRemovePin}>
                      Remove PIN
                    </button>
                  )}
                </div>
              </>
            )}
            {pinFlow === 'set1' && <PinEntry label="Enter a new 4-digit PIN" onComplete={handleFirstPin} />}
            {pinFlow === 'set2' && <PinEntry label="Confirm your PIN" onComplete={handleConfirmPin} />}
            {pinFlow === 'done' && (
              <p className="settings-hint" style={{ color: '#27AE60', marginTop: 8 }}>✓ PIN set successfully</p>
            )}
          </div>

          {/* AI */}
          <div className="settings-section">
            <div className="settings-label">AI Category Suggestions</div>
            <p className="settings-hint">
              Built-in — no setup needed. As you write, the app suggests categories based on your note content.
            </p>
          </div>

          {/* Gist sync */}
          <div className="settings-section">
            <div className="settings-label">Cross-Device Sync (GitHub Gist)</div>
            <p className="settings-hint">
              Enter a GitHub Personal Access Token with <code>gist</code> scope to sync this profile's notes across devices.
            </p>
            <input
              className="settings-input"
              type="password"
              value={gistToken}
              onChange={e => setGistToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxx"
              spellCheck={false}
              autoComplete="off"
            />
            {gistToken !== (localStorage.getItem(tokenKey) || '') && (
              <p className="settings-hint" style={{ color: 'var(--gold)', marginTop: 4 }}>
                Token changed — save to apply. Clear field to disable sync.
              </p>
            )}
          </div>

        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save}>{saved ? 'Saved ✓' : 'Save'}</button>
        </div>
      </div>

      {deleteConfirm && (
        <div className="modal-overlay" style={{ zIndex: 1100 }} onClick={() => setDeleteConfirm(null)}>
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
              <button className="btn btn-danger" onClick={() => handleDeleteProfile(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
