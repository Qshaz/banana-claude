import { tagColor } from '../hooks/useNotes'

const TAG_BG = {
  yellow: '#fff3cc', blue: '#ddeeff', green: '#d8f4e2',
  pink: '#ffe0e6', purple: '#f0e4ff', orange: '#ffe8cc', gray: '#f0f0f5'
}
const TAG_FG = {
  yellow: '#a07800', blue: '#0050aa', green: '#1a7a3a',
  pink: '#c0003c', purple: '#6600cc', orange: '#b05000', gray: '#6e6e73'
}

function formatDate(iso) {
  const d = new Date(iso)
  const now = new Date()
  const diffDays = Math.floor((now - d) / 86400000)
  if (diffDays === 0) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return d.toLocaleDateString([], { weekday: 'short' })
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

const NOTE_BG = {
  yellow: '#fffce8', pink: '#fff5f7', green: '#f0fff5',
  blue: '#f0f7ff', purple: '#f8f0ff', default: undefined
}

export default function NoteList({ notes, selectedId, onSelect, onNew, filter, sort, setSort }) {
  const pinned = notes.filter(n => n.pinned)
  const unpinned = notes.filter(n => !n.pinned)

  const filterLabel = filter.type === 'all' ? 'All Notes'
    : filter.type === 'pinned' ? 'Pinned'
    : filter.type === 'imported' ? 'Imported'
    : `#${filter.tag}`

  return (
    <div className="note-list-panel">
      <div className="list-header">
        <span className="list-title">{filterLabel}</span>
        <span className="list-count">{notes.length}</span>
        <button className="icon-btn primary" onClick={onNew} title="New note">＋</button>
      </div>

      <div className="sort-bar">
        <span className="sort-label">Sort:</span>
        <select
          className="sort-select"
          value={sort}
          onChange={e => setSort(e.target.value)}
        >
          <option value="updated">Last edited</option>
          <option value="created">Date created</option>
          <option value="title">Title A–Z</option>
        </select>
      </div>

      {notes.length === 0 ? (
        <div className="empty-list">
          <div className="empty-list-icon">📭</div>
          <div className="empty-list-text">No notes here yet.<br />Hit ＋ to create one.</div>
        </div>
      ) : (
        <div className="note-list">
          {pinned.length > 0 && <div className="pinned-divider">Pinned</div>}
          {pinned.map(n => (
            <NoteCard key={n.id} note={n} active={n.id === selectedId} onSelect={onSelect} />
          ))}
          {pinned.length > 0 && unpinned.length > 0 && <div className="pinned-divider">Notes</div>}
          {unpinned.map(n => (
            <NoteCard key={n.id} note={n} active={n.id === selectedId} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  )
}

function NoteCard({ note, active, onSelect }) {
  const color = tagColor(note.tags[0] || '')
  const bg = NOTE_BG[note.color] || undefined

  return (
    <div
      className={`note-card${active ? ' active' : ''}`}
      style={bg && !active ? { background: bg } : undefined}
      onClick={() => onSelect(note.id)}
    >
      {note.pinned && <span className="pin-icon">📌</span>}
      <div className="note-card-title">{note.title || 'Untitled'}</div>
      <div className="note-card-preview">{note.content}</div>
      <div className="note-card-meta">
        <span className="note-date">{formatDate(note.updatedAt)}</span>
        {note.tags.slice(0, 2).map(tag => (
          <span
            key={tag}
            className="note-tag"
            style={{
              background: TAG_BG[tagColor(tag)],
              color: TAG_FG[tagColor(tag)],
            }}
          >
            {tag}
          </span>
        ))}
        {note.tags.length > 2 && (
          <span className="note-tag" style={{ background: '#f0f0f5', color: '#6e6e73' }}>
            +{note.tags.length - 2}
          </span>
        )}
      </div>
    </div>
  )
}
