import { tagColor } from '../hooks/useNotes'

const TAG_COLOR_MAP = {
  yellow: '#f5a623',
  blue: '#0071e3',
  green: '#34c759',
  pink: '#ff375f',
  purple: '#af52de',
  orange: '#ff9500',
  gray: '#aeaeb2',
}

export default function Sidebar({ notes, allTags, filter, setFilter, onNewNote, onImport, search, setSearch }) {
  const counts = {
    all: notes.length,
    pinned: notes.filter(n => n.pinned).length,
    imported: notes.filter(n => n.source === 'imported').length,
  }

  const tagCounts = Object.fromEntries(
    allTags.map(tag => [tag, notes.filter(n => n.tags.includes(tag)).length])
  )

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">Notes</div>
      </div>

      <div className="sidebar-search">
        <div className="search-input-wrap">
          <input
            className="search-input"
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section">
          <div className="sidebar-section-label">Library</div>
        </div>

        <NavItem
          icon="📝" label="All Notes" count={counts.all}
          active={filter.type === 'all'}
          onClick={() => setFilter({ type: 'all' })}
        />
        <NavItem
          icon="📌" label="Pinned" count={counts.pinned}
          active={filter.type === 'pinned'}
          onClick={() => setFilter({ type: 'pinned' })}
        />
        <NavItem
          icon="📥" label="Imported" count={counts.imported}
          active={filter.type === 'imported'}
          onClick={() => setFilter({ type: 'imported' })}
        />

        {allTags.length > 0 && (
          <>
            <div className="sidebar-section" style={{ marginTop: 8 }}>
              <div className="sidebar-section-label">Tags</div>
            </div>
            {allTags.map(tag => (
              <NavItem
                key={tag}
                icon={
                  <span
                    className="tag-dot"
                    style={{ background: TAG_COLOR_MAP[tagColor(tag)] }}
                  />
                }
                label={tag}
                count={tagCounts[tag]}
                active={filter.type === 'tag' && filter.tag === tag}
                onClick={() => setFilter({ type: 'tag', tag })}
              />
            ))}
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-btn import-btn" onClick={onImport}>
          ↓ Import from Apple Notes
        </button>
        <button className="sidebar-btn" onClick={onNewNote}>
          <span>＋</span> New Note
        </button>
      </div>
    </aside>
  )
}

function NavItem({ icon, label, count, active, onClick }) {
  return (
    <div className={`nav-item${active ? ' active' : ''}`} onClick={onClick}>
      <span className="nav-item-icon">
        {icon}
      </span>
      <span className="nav-item-label">{label}</span>
      {active && count > 0 && (
        <span className="nav-item-count">({count})</span>
      )}
    </div>
  )
}
