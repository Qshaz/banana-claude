import { tagColor } from '../hooks/useNotes'

function formatDate(iso) {
  const d = new Date(iso)
  const now = new Date()
  const diffDays = Math.floor((now - d) / 86400000)
  if (diffDays === 0) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return d.toLocaleDateString([], { weekday: 'short' })
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
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
        <select
          className="sort-select-inline"
          value={sort}
          onChange={e => setSort(e.target.value)}
          title="Sort by"
        >
          <option value="updated">Last edited</option>
          <option value="created">Date created</option>
          <option value="title">Title A–Z</option>
        </select>
        <button className="new-note-btn" onClick={onNew} title="New note">New note</button>
      </div>

      {notes.length === 0 ? (
        <div className="empty-list">
          <div className="empty-list-icon">📭</div>
          <div className="empty-list-text">No notes here yet.<br />Hit "New note" to create one.</div>
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
  return (
    <div
      className={`note-card${active ? ' active' : ''}`}
      onClick={() => onSelect(note.id)}
    >
      {note.pinned && <span className="pin-icon" aria-label="Pinned">·pin</span>}
      <div className="note-card-title">{note.title || 'Untitled'}</div>
      <div className="note-card-preview">{note.content}</div>
      <div className="note-card-meta">
        <span className="note-date">{formatDate(note.updatedAt)}</span>
        {note.tags.slice(0, 2).map(tag => (
          <span key={tag} className="note-tag">
            {tag}
          </span>
        ))}
        {note.tags.length > 2 && (
          <span className="note-tag">+{note.tags.length - 2}</span>
        )}
      </div>
    </div>
  )
}
