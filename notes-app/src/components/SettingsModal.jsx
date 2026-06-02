import { useState } from 'react'

export default function SettingsModal({ onClose }) {
  const [gistToken, setGistToken] = useState(localStorage.getItem('dah_gist_token') || '')
  const [saved, setSaved] = useState(false)

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
          <div className="settings-section">
            <div className="settings-label">AI Category Suggestions</div>
            <p className="settings-hint">
              Built-in — no setup needed. As you write, the app suggests categories
              based on your note content. Tap a suggestion chip to add it.
            </p>
          </div>

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
