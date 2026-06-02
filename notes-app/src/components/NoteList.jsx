import { formatRelativeDate } from '../utils'

export default function NoteList({ notes, selectedId, onSelect, onNew, filter, sort, setSort, search, setSearch, mobileActive, onMobileBack }) {
  const pinned = notes.filter(n => n.pinned)
  const unpinned = notes.filter(n => !n.pinned)

  const filterLabel = filter.type === 'all' ? 'All Notes'
    : filter.type === 'pinned' ? 'Pinned'
    : filter.type === 'imported' ? 'Imported'
    : filter.tag

  return (
    <div className={`note-list-panel${mobileActive ? ' mobile-active' : ''}`}>
      <div className="list-header">
        <div className="list-header-row">
          <span className="list-title">{filterLabel}</span>
          <button className="new-note-btn" onClick={onNew}>+ New</button>
        </div>
        <input
          className="list-search"
          type="text"
          placeholder="Search notes…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {notes.length === 0 ? (
        <div className="empty-list">
          <div className="empty-list-icon">—</div>
          <div className="empty-list-text">
            {search ? 'No notes match your search.' : 'No notes here yet.'}
          </div>
        </div>
      ) : (
        <div className="note-list">
          {pinned.length > 0 && <div className="pinned-divider">Pinned</div>}
          {pinned.map(n => (
            <NoteCard key={n.id} note={n} active={n.id === selectedId} onSelect={onSelect} />
          ))}
          {pinned.length > 0 && unpinned.length > 0 && (
            <div className="pinned-divider">Notes</div>
          )}
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
      {note.pinned && <span className="pin-icon">pin</span>}
      <div className="note-card-title">{note.title || 'Untitled'}</div>
      <div className="note-card-preview">{note.content}</div>
      <div className="note-card-meta">
        <span className="note-date">{formatRelativeDate(note.updatedAt)}</span>
        {note.tags.slice(0, 1).map(tag => (
          <span key={tag} className="note-tag">{tag}</span>
        ))}
        {note.tags.length > 1 && (
          <span className="note-tag">+{note.tags.length - 1}</span>
        )}
      </div>
    </div>
  )
}
