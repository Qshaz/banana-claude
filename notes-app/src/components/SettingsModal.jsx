import { useState } from 'react'
import { savePin, removePin, hasPinSet } from './LockScreen'
import { gistTokenKey, gistIdKey } from '../utils/profiles'

function PinEntry({ onComplete, label }) {
  const [digits, setDigits] = useState([])
  const LEN = 4

  function tap(d) {
    if (digits.length >= LEN) return
    const next = [...digits, d]
    setDigits(next)
    if (next.length === LEN) setTimeout(() => onComplete(next.join('')), 80)
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

          {/* Switch profile */}
          {onSwitchProfile && (
            <div className="settings-section">
              <div className="settings-label">Account</div>
              <p className="settings-hint">Signed in as <strong>{profileName}</strong></p>
              <button className="btn btn-secondary" style={{ marginTop: 8 }} onClick={onSwitchProfile}>
                Switch Profile
              </button>
            </div>
          )}

        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save}>{saved ? 'Saved ✓' : 'Save'}</button>
        </div>
      </div>
    </div>
  )
}
