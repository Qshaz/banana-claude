import Logo from './Logo'

export default function Sidebar({ filter, setFilter, onNewNote, onImport, allTags, notes }) {
  const nav = [
    { id: 'all', tip: 'All Notes', icon: <IconHome /> },
    { id: 'pinned', tip: 'Pinned', icon: <IconPin /> },
    { id: 'imported', tip: 'Imported', icon: <IconImported /> },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Logo iconOnly size={32} />
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
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function IconImported() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <polyline points="8 17 12 21 16 17" />
      <line x1="12" y1="21" x2="12" y2="9" />
      <path d="M20.88 18.09A5 5 0 0018 9h-1.26A8 8 0 103 16.29" />
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
      <polyline points="16 16 12 12 8 16" />
      <line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
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
