import { useState } from 'react'
import { savePin, removePin, hasPinSet } from './LockScreen'

// Mini PIN pad for setup flow
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

export default function SettingsModal({ onClose }) {
  const [gistToken, setGistToken] = useState(localStorage.getItem('dah_gist_token') || '')
  const [saved, setSaved] = useState(false)
  const [pinFlow, setPinFlow] = useState(null) // null | 'set1' | 'set2' | 'done'
  const [firstPin, setFirstPin] = useState('')
  const [pinError, setPinError] = useState('')
  const [pinEnabled, setPinEnabled] = useState(hasPinSet())

  function handleFirstPin(pin) {
    setFirstPin(pin)
    setPinFlow('set2')
  }

  async function handleConfirmPin(pin) {
    if (pin !== firstPin) {
      setPinError('PINs don\'t match. Try again.')
      setPinFlow('set1')
      setFirstPin('')
      setTimeout(() => setPinError(''), 2000)
      return
    }
    await savePin(pin)
    setPinEnabled(true)
    setPinFlow('done')
    setTimeout(() => setPinFlow(null), 1500)
  }

  function handleRemovePin() {
    removePin()
    setPinEnabled(false)
  }

  function save() {
    if (gistToken.trim()) localStorage.setItem('dah_gist_token', gistToken.trim())
    else { localStorage.removeItem('dah_gist_token'); localStorage.removeItem('dah_gist_id') }
    setSaved(true)
    setTimeout(onClose, 700)
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Settings</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="settings-body">

          {/* PIN lock */}
          <div className="settings-section">
            <div className="settings-label">App Lock (PIN)</div>
            {pinFlow === null && (
              <>
                <p className="settings-hint">
                  {pinEnabled
                    ? 'PIN lock is enabled. App will require PIN on open.'
                    : 'Lock the app with a 4-digit PIN. Required every time you open it.'}
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

            {pinFlow === 'set1' && (
              <PinEntry label="Enter a new 4-digit PIN" onComplete={handleFirstPin} />
            )}

            {pinFlow === 'set2' && (
              <PinEntry label="Confirm your PIN" onComplete={handleConfirmPin} />
            )}

            {pinFlow === 'done' && (
              <p className="settings-hint" style={{ color: '#27AE60', marginTop: 8 }}>
                ✓ PIN set successfully
              </p>
            )}
          </div>

          {/* AI suggestions */}
          <div className="settings-section">
            <div className="settings-label">AI Category Suggestions</div>
            <p className="settings-hint">
              Built-in — no setup needed. As you write, the app suggests categories
              based on your note content. Tap a suggestion chip to add it.
            </p>
          </div>

          {/* Gist sync */}
          <div className="settings-section">
            <div className="settings-label">Cross-Device Sync (GitHub Gist)</div>
            <p className="settings-hint">
              Enter a GitHub Personal Access Token with <code>gist</code> scope to sync your notes across devices.
              Go to github.com/settings/tokens → Generate new token (classic) → check "gist" → copy.
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
            {gistToken !== (localStorage.getItem('dah_gist_token') || '') && (
              <p className="settings-hint" style={{ color: 'var(--gold)', marginTop: 4 }}>
                Token changed — save to apply. Clear field to disable sync.
              </p>
            )}
          </div>

        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save}>
            {saved ? 'Saved ✓' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
