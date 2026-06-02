import { useState, useRef } from 'react'
import { parseImportText } from '../hooks/useNotes'

export default function ImportModal({ onClose, onImport }) {
  const [tab, setTab] = useState('paste')
  const [text, setText] = useState('')
  const [fileNotes, setFileNotes] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef()

  const pastePreview = text.trim() ? parseImportText(text) : []
  const preview = tab === 'paste' ? pastePreview : (fileNotes || [])
  const canImport = preview.length > 0

  function handleImport() {
    if (!canImport) return
    onImport(preview)
    onClose()
  }

  function readFiles(files) {
    const promises = [...files].map(f => f.text())
    Promise.all(promises).then(texts => {
      const combined = texts.join('\n---\n')
      setFileNotes(parseImportText(combined))
    })
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    readFiles(e.dataTransfer.files)
  }

  function handleFileChange(e) {
    if (e.target.files.length) readFiles(e.target.files)
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <div className="modal-title">Import from Apple Notes</div>
            <div className="modal-subtitle">
              Bring your Apple Notes into this app. Paste text directly, upload files, or follow the guide.
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="import-tabs">
            <button className={`import-tab${tab === 'paste' ? ' active' : ''}`} onClick={() => setTab('paste')}>
              Paste Text
            </button>
            <button className={`import-tab${tab === 'file' ? ' active' : ''}`} onClick={() => setTab('file')}>
              Upload Files
            </button>
            <button className={`import-tab${tab === 'guide' ? ' active' : ''}`} onClick={() => setTab('guide')}>
              How to Export
            </button>
          </div>

          {tab === 'paste' && (
            <div className="import-section">
              <h4>Paste your notes</h4>
              <p style={{ marginBottom: 8 }}>
                Open Apple Notes, select all text in a note (or multiple notes), copy, and paste below.
                Separate multiple notes with <code style={{ background: '#f0f0f5', padding: '0 4px', borderRadius: 3 }}>---</code> on its own line.
                Lines starting with <code style={{ background: '#f0f0f5', padding: '0 4px', borderRadius: 3 }}>#tag</code> are auto-tagged.
              </p>
              <textarea
                className="import-textarea"
                placeholder={`My Shopping List\nMilk, eggs, butter #grocery\n\n---\n\nProject Ideas\nBuild a notes app #work #ideas`}
                value={text}
                onChange={e => setText(e.target.value)}
                autoFocus
              />
              {pastePreview.length > 0 && (
                <div className="import-preview">
                  <strong>{pastePreview.length} note{pastePreview.length > 1 ? 's' : ''} detected:</strong>{' '}
                  {pastePreview.map(n => n.title || 'Untitled').join(', ')}
                </div>
              )}
            </div>
          )}

          {tab === 'file' && (
            <div className="import-section">
              <h4>Upload text or markdown files</h4>
              <p style={{ marginBottom: 10 }}>
                Upload .txt or .md files exported from Apple Notes. Each file becomes a note.
                You can upload multiple files at once.
              </p>
              <div
                className={`drop-zone${dragOver ? ' drag-over' : ''}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current.click()}
              >
                <div className="drop-zone-icon">📂</div>
                <div className="drop-zone-text">Drop files here or click to browse</div>
                <div className="drop-zone-hint">.txt and .md files supported</div>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".txt,.md"
                  multiple
                  onChange={handleFileChange}
                />
              </div>
              {fileNotes && (
                <div className="import-preview">
                  <strong>{fileNotes.length} note{fileNotes.length > 1 ? 's' : ''} found:</strong>{' '}
                  {fileNotes.map(n => n.title || 'Untitled').join(', ')}
                </div>
              )}
            </div>
          )}

          {tab === 'guide' && (
            <div className="import-section">
              <h4>Method 1 — Copy &amp; Paste (quickest)</h4>
              <ol>
                <li>Open <strong>Apple Notes</strong> on your Mac or iPhone</li>
                <li>Open any note and press <strong>⌘A</strong> to select all</li>
                <li>Press <strong>⌘C</strong> to copy</li>
                <li>Come back here, click the <strong>Paste Text</strong> tab, and paste</li>
                <li>For multiple notes, separate them with <code style={{ background: '#f0f0f5', padding: '0 3px', borderRadius: 3 }}>---</code> on its own line</li>
              </ol>

              <h4 style={{ marginTop: 14 }}>Method 2 — Export as text files (Mac)</h4>
              <ol>
                <li>Open <strong>Notes</strong> on your Mac</li>
                <li>Select one or more notes in the sidebar</li>
                <li>Go to <strong>File → Export as PDF</strong> — or use an Automator script to export as .txt</li>
                <li>Alternatively: open a note, select all, save as a .txt file</li>
                <li>Upload the .txt files in the <strong>Upload Files</strong> tab</li>
              </ol>

              <h4 style={{ marginTop: 14 }}>Tip: Auto-tagging</h4>
              <p>
                Add <strong>#tags</strong> anywhere in your note text and they'll be extracted automatically as tags when you import.
                For example: <code style={{ background: '#f0f0f5', padding: '0 3px', borderRadius: 3 }}>#work</code> or <code style={{ background: '#f0f0f5', padding: '0 3px', borderRadius: 3 }}>#ideas</code>.
              </p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            disabled={!canImport}
            onClick={handleImport}
          >
            Import {canImport ? `${preview.length} note${preview.length > 1 ? 's' : ''}` : ''}
          </button>
        </div>
      </div>
    </div>
  )
}
