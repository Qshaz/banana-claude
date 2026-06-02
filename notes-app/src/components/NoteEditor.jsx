import { useState, useEffect, useRef } from 'react'
import { tagColor } from '../hooks/useNotes'

const COLORS = ['default', 'yellow', 'pink', 'green', 'blue', 'purple']
const COLOR_VALUES = {
  default: '#e0e0e8', yellow: '#f5a623', pink: '#ff375f',
  green: '#34c759', blue: '#0071e3', purple: '#af52de'
}
const NOTE_BG = {
  yellow: '#fffce8', pink: '#fff5f7', green: '#f0fff5',
  blue: '#f0f7ff', purple: '#f8f0ff', default: '#ffffff'
}
const TAG_BG = {
  yellow: '#fff3cc', blue: '#ddeeff', green: '#d8f4e2',
  pink: '#ffe0e6', purple: '#f0e4ff', orange: '#ffe8cc', gray: '#f0f0f5'
}
const TAG_FG = {
  yellow: '#a07800', blue: '#0050aa', green: '#1a7a3a',
  pink: '#c0003c', purple: '#6600cc', orange: '#b05000', gray: '#6e6e73'
}

function formatDateLong(iso) {
  return new Date(iso).toLocaleString([], {
    weekday: 'short', month: 'short', day: 'numeric',
    year: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

export default function NoteEditor({ note, onUpdate, onDelete, onPin }) {
  const [tagInput, setTagInput] = useState('')
  const tagRef = useRef(null)
  const titleRef = useRef(null)
  const contentRef = useRef(null)

  // Auto-focus title on new note
  useEffect(() => {
    if (note && !note.title && titleRef.current) {
      titleRef.current.focus()
    }
  }, [note?.id])

  if (!note) {
    return (
      <div className="editor-panel">
        <div className="no-note">
          <div className="no-note-icon">—</div>
          <div className="no-note-text">Select a note to read it</div>
          <div className="no-note-hint">or create a new one with + New note</div>
        </div>
      </div>
    )
  }

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const tag = tagInput.trim().toLowerCase().replace(/^#/, '').replace(/[^a-z0-9_-]/g, '')
      if (tag && !note.tags.includes(tag)) {
        onUpdate(note.id, { tags: [...note.tags, tag] })
      }
      setTagInput('')
    }
  }

  const removeTag = (tag) => {
    onUpdate(note.id, { tags: note.tags.filter(t => t !== tag) })
  }

  return (
    <div className="editor-panel" style={{ background: NOTE_BG[note.color] || '#ffffff' }}>
      <div className="editor-toolbar">
        <div className="tag-input-wrap">
          {note.tags.map(tag => {
            const c = tagColor(tag)
            return (
              <span
                key={tag}
                className="tag-chip"
                style={{ background: TAG_BG[c], color: TAG_FG[c] }}
                onClick={() => removeTag(tag)}
                title="Click to remove"
              >
                {tag}
                <span className="tag-chip-remove">×</span>
              </span>
            )
          })}
          <input
            ref={tagRef}
            className="add-tag-input"
            placeholder="+ tag"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            onBlur={() => {
              const tag = tagInput.trim().toLowerCase().replace(/^#/, '').replace(/[^a-z0-9_-]/g, '')
              if (tag && !note.tags.includes(tag)) {
                onUpdate(note.id, { tags: [...note.tags, tag] })
              }
              setTagInput('')
            }}
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
            title={note.pinned ? 'Unpin' : 'Pin'}
          >
            {note.pinned ? 'Unpin' : 'Pin'}
          </button>
          <button
            className="editor-action-btn danger"
            onClick={() => onDelete(note.id)}
            title="Delete note"
          >
            Delete
          </button>
        </div>
      </div>

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

      <div className="editor-content">
        <textarea
          ref={contentRef}
          className="editor-textarea"
          placeholder="Write something..."
          value={note.content}
          onChange={e => onUpdate(note.id, { content: e.target.value })}
        />
      </div>
    </div>
  )
}
