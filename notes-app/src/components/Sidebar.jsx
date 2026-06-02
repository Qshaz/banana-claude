export default function Sidebar({ filter, setFilter, onNewNote, onImport, allTags, notes }) {
  const nav = [
    { id: 'all', tip: 'All Notes', icon: <IconHome /> },
    { id: 'pinned', tip: 'Pinned', icon: <IconPin /> },
    { id: 'imported', tip: 'Imported', icon: <IconImported /> },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark">K</div>
      </div>

      <nav className="sidebar-nav">
        {nav.map(item => (
          <button
            key={item.id}
            className={`sidebar-icon-btn${filter.type === item.id ? ' active' : ''}`}
            onClick={() => setFilter({ type: item.id })}
            data-tip={item.tip}
          >
            {item.icon}
          </button>
        ))}

        {allTags.length > 0 && (
          <>
            <div className="sidebar-divider" />
            {allTags.slice(0, 8).map(tag => (
              <button
                key={tag}
                className={`sidebar-icon-btn${filter.type === 'tag' && filter.tag === tag ? ' active' : ''}`}
                onClick={() => setFilter({ type: 'tag', tag })}
                data-tip={tag}
              >
                <IconTag />
              </button>
            ))}
          </>
        )}
      </nav>

      <div className="sidebar-footer-btns">
        <div className="sidebar-divider" />
        <button className="sidebar-icon-btn" onClick={onImport} data-tip="Import from Apple Notes">
          <IconDownload />
        </button>
        <button className="sidebar-icon-btn" onClick={onNewNote} data-tip="New Note">
          <IconPlus />
        </button>
      </div>
    </aside>
  )
}

function IconHome() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  )
}

function IconPin() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

function IconImported() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

function IconTag() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  )
}

function IconDownload() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

function IconPlus() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}
