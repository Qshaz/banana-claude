import { useState, useEffect, useRef } from 'react'

const COLORS = ['default', 'yellow', 'pink', 'green', 'blue', 'purple']
const COLOR_VALUES = {
  default: '#E6E4DF', yellow: '#B89A64', pink: '#C0392B',
  green: '#27AE60', blue: '#355C8C', purple: '#8E44AD'
}
const NOTE_BG = {
  yellow: '#FFFDF5', pink: '#FFF8F7', green: '#F5FFF8',
  blue: '#F5F8FF', purple: '#FAF5FF', default: '#FFFFFF'
}

function formatDateLong(iso) {
  return new Date(iso).toLocaleString([], {
    weekday: 'short', month: 'short', day: 'numeric',
    year: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

export default function NoteEditor({ note, onUpdate, onDelete, onPin, mobileActive, onMobileBack }) {
  const [tagInput, setTagInput] = useState('')
  const titleRef = useRef(null)

  useEffect(() => {
    if (note && !note.title && titleRef.current) {
      titleRef.current.focus()
    }
    setTagInput('')
  }, [note?.id])

  if (!note) {
    return (
      <div className={`editor-panel${mobileActive ? ' mobile-active' : ''}`}>
        <div className="no-note">
          <div className="no-note-monogram">K</div>
          <div className="no-note-text">Select a note to read it</div>
          <div className="no-note-hint">or create a new one with + New</div>
        </div>
      </div>
    )
  }

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      commitTag()
    }
  }

  const commitTag = () => {
    const tag = tagInput.trim().toLowerCase().replace(/^#/, '').replace(/[^a-z0-9_-]/g, '')
    if (tag && !note.tags.includes(tag)) {
      onUpdate(note.id, { tags: [...note.tags, tag] })
    }
    setTagInput('')
  }

  const removeTag = (tag) => {
    onUpdate(note.id, { tags: note.tags.filter(t => t !== tag) })
  }

  return (
    <div className={`editor-panel${mobileActive ? ' mobile-active' : ''}`} style={{ background: NOTE_BG[note.color] || '#FFFFFF' }}>
      <div className="editor-toolbar">
        <div className="tag-input-wrap">
          {note.tags.map(tag => (
            <span
              key={tag}
              className="tag-chip"
              onClick={() => removeTag(tag)}
              title="Click to remove"
            >
              {tag}
              <span className="tag-chip-remove">×</span>
            </span>
          ))}
          <input
            className="add-tag-input"
            placeholder="+ category"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            onBlur={commitTag}
          />
        </div>

        <div className="color-picker">
          {COLORS.map(c => (
            <span
              key={c}
              className={`color-dot${note.color === c ? ' selected' : ''}`}
              style={{ background: COLOR_VALUES[c] }}
              onClick={() => onUpdate(note.id, { color: c })}
              title={c}
            />
          ))}
        </div>

        <div className="editor-actions">
          <button
            className={`editor-action-btn${note.pinned ? ' pin-active' : ''}`}
            onClick={() => onPin(note.id)}
          >
            {note.pinned ? 'Unpin' : 'Pin'}
          </button>
          <button
            className="editor-action-btn danger"
            onClick={() => onDelete(note.id)}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="editor-body">
        <div className="editor-inner">
          <textarea
            ref={titleRef}
            className="editor-title-input"
            rows={1}
            placeholder="Note title"
            value={note.title}
            onChange={e => onUpdate(note.id, { title: e.target.value })}
          />

          <div className="editor-meta">
            <span className="editor-date">
              Edited {formatDateLong(note.updatedAt)}
            </span>
            {note.source === 'imported' && (
              <span className="editor-source-badge">Imported</span>
            )}
          </div>

          <textarea
            className="editor-textarea"
            placeholder="Write something…"
            value={note.content}
            onChange={e => onUpdate(note.id, { content: e.target.value })}
          />
        </div>
      </div>
    </div>
  )
}
