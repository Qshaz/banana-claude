import { useState } from 'react'

export default function SettingsModal({ onClose }) {
  const [key, setKey] = useState(localStorage.getItem('dah_api_key') || '')
  const [saved, setSaved] = useState(false)

  function save() {
    if (key.trim()) localStorage.setItem('dah_api_key', key.trim())
    else localStorage.removeItem('dah_api_key')
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
          <div className="settings-section">
            <div className="settings-label">AI Category Suggestions</div>
            <p className="settings-hint">
              Enter your Anthropic API key to enable automatic category suggestions as you write.
              Stored only in your browser — never sent anywhere else.
            </p>
            <input
              className="settings-input"
              type="password"
              value={key}
              onChange={e => setKey(e.target.value)}
              placeholder="sk-ant-api03-…"
              spellCheck={false}
              autoComplete="off"
            />
            <p className="settings-hint" style={{ marginTop: 6 }}>
              Get a key at{' '}
              <a
                href="https://console.anthropic.com/settings/keys"
                target="_blank"
                rel="noreferrer"
                className="settings-link"
              >
                console.anthropic.com
              </a>
            </p>
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
