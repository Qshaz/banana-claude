import { useState } from 'react'
import Logo from './Logo'
import { getProfiles, addProfile, deleteProfile, profileColor, saveProfiles } from '../utils/profiles'
import { savePin } from './LockScreen'

const PIN_LENGTH = 4

function initials(name) {
  return name.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

function PinPad({ onComplete, label, onBack }) {
  const [digits, setDigits] = useState([])

  function tap(d) {
    if (digits.length >= PIN_LENGTH) return
    const next = [...digits, d]
    setDigits(next)
    if (next.length === PIN_LENGTH) setTimeout(() => onComplete(next.join('')), 80)
  }

  function del() { setDigits(p => p.slice(0, -1)) }

  const PAD = [1,2,3,4,5,6,7,8,9,null,0,'del']

  return (
    <div className="signup-pin-step">
      <div className="signup-pin-label">{label}</div>
      <div className="lock-dots">
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <div key={i} className={`lock-dot${i < digits.length ? ' filled' : ''}`} />
        ))}
      </div>
      <div className="pin-grid">
        {PAD.map((key, i) => {
          if (key === null) return <div key={i} />
          if (key === 'del') return <button key={i} className="pin-btn pin-del" onClick={del}>⌫</button>
          return <button key={i} className="pin-btn" onClick={() => tap(key)}>{key}</button>
        })}
      </div>
      {onBack && <button className="welcome-link" onClick={onBack}>Back</button>}
    </div>
  )
}

export default function ProfileScreen({ onSelect, onProfilesChange }) {
  const [profiles, setProfiles] = useState(getProfiles)
  const [view, setView] = useState('list') // 'list' | 'signup-name' | 'signup-pin' | 'signup-pin-confirm'
  const [signupName, setSignupName] = useState('')
  const [firstPin, setFirstPin] = useState('')
  const [pinError, setPinError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  function refresh() {
    const updated = getProfiles()
    setProfiles(updated)
    onProfilesChange?.(updated)
    return updated
  }

  function handleNameNext() {
    if (!signupName.trim()) return
    setView('signup-pin')
  }

  function handleFirstPin(pin) {
    setFirstPin(pin)
    setView('signup-pin-confirm')
  }

  async function handleConfirmPin(pin) {
    if (pin !== firstPin) {
      setPinError("PINs don't match. Try again.")
      setView('signup-pin')
      setFirstPin('')
      setTimeout(() => setPinError(''), 2000)
      return
    }
    const profile = addProfile(signupName.trim())
    await savePin(pin, profile.id)
    refresh()
    onSelect(profile)
  }

  function handleDelete(id) {
    deleteProfile(id)
    refresh()
    setDeleteConfirm(null)
  }

  if (view === 'signup-name') {
    return (
      <div className="lock-screen">
        <div className="welcome-screen">
          <Logo size={44} />
          <div className="welcome-title" style={{ fontSize: 22 }}>Create Account</div>
          <div className="welcome-form">
            <label className="welcome-label">Your name</label>
            <input
              className="welcome-input"
              placeholder="e.g. Shazia"
              value={signupName}
              onChange={e => setSignupName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleNameNext()}
              autoFocus
              maxLength={30}
            />
            <button className="welcome-btn" onClick={handleNameNext} disabled={!signupName.trim()}>
              Next
            </button>
            <button className="welcome-link" onClick={() => { setView('list'); setSignupName('') }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (view === 'signup-pin') {
    return (
      <div className="lock-screen">
        <div className="lock-content">
          <Logo size={44} />
          {pinError && <div style={{ color: 'var(--danger)', fontSize: 13, marginBottom: -8 }}>{pinError}</div>}
          <PinPad
            label={`Hi ${signupName} — create a 4-digit PIN`}
            onComplete={handleFirstPin}
            onBack={() => setView('signup-name')}
          />
        </div>
      </div>
    )
  }

  if (view === 'signup-pin-confirm') {
    return (
      <div className="lock-screen">
        <div className="lock-content">
          <Logo size={44} />
          <PinPad
            label="Confirm your PIN"
            onComplete={handleConfirmPin}
            onBack={() => setView('signup-pin')}
          />
        </div>
      </div>
    )
  }

  // Main list view
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

          <button className="profile-signup-btn" onClick={() => { setSignupName(''); setView('signup-name') }}>
            <div className="profile-avatar" style={{ background: 'rgba(255,255,255,0.08)', border: '1.5px dashed rgba(255,255,255,0.25)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </div>
            <div className="profile-name" style={{ color: 'rgba(255,255,255,0.5)' }}>Sign Up</div>
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
