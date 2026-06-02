import { getGreeting, formatRelativeDate } from '../utils'

const NAME = 'Shazia'

export default function Dashboard({ notes, allTags, onSelectNote, onNewNote, onFilter, className, isActive }) {
  const greeting = getGreeting()

  const untagged = notes.filter(n => n.tags.length === 0).length
  const pinned = notes.filter(n => n.pinned).length
  const taggedPercent = notes.length > 0
    ? Math.round(((notes.length - untagged) / notes.length) * 100)
    : 0

  // Tags sorted by note count descending
  const topTags = allTags
    .map(tag => ({
      tag,
      count: notes.filter(n => n.tags.includes(tag)).length,
      latest: notes
        .filter(n => n.tags.includes(tag))
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0]?.updatedAt,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // Recent notes
  const recentNotes = [...notes]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 6)

  return (
    <div className={`dashboard${className ? ` ${className}` : ''}`}>
      <div className="dashboard-header">
        <h1 className="dashboard-greeting serif">
          {greeting}, {NAME}
        </h1>
        <button className="dashboard-new-btn" onClick={onNewNote}>
          + New Note
        </button>
      </div>

      <div className="dashboard-stats">
        <div className="stat-item">
          <div className="stat-value serif">{notes.length}</div>
          <div className="stat-label">Notes</div>
        </div>
        <div className="stat-item">
          <div className="stat-value serif">{allTags.length}</div>
          <div className="stat-label">Categories</div>
        </div>
        <div className="stat-item">
          <div className="stat-value serif">{untagged}</div>
          <div className="stat-label">Untagged</div>
        </div>
        {pinned > 0 && (
          <div className="stat-item cta" onClick={() => onFilter({ type: 'pinned' })}>
            <div className="stat-value serif">{pinned}</div>
            <div className="stat-label">Pinned →</div>
          </div>
        )}
      </div>

      {untagged > 0 && notes.length > 0 && (
        <div className="dashboard-continue">
          <div className="dashboard-section-label">Continue Organizing</div>
          <div className="dashboard-continue-bar">
            <div className="dashboard-continue-text">
              <span>{untagged}</span> note{untagged !== 1 ? 's' : ''} awaiting a category
            </div>
            <button
              className="dashboard-review-link"
              onClick={() => onFilter({ type: 'all' })}
            >
              Review Now →
            </button>
          </div>
          <div className="dashboard-continue-progress">
            <div
              className="dashboard-continue-progress-fill"
              style={{ width: `${taggedPercent}%` }}
            />
          </div>
        </div>
      )}

      {notes.length === 0 ? (
        <div className="no-tags-hint">
          Your knowledge archive is empty.{' '}
          <button
            style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', font: 'inherit', fontWeight: 500 }}
            onClick={onNewNote}
          >
            Create your first note →
          </button>
        </div>
      ) : (
        <div className="dashboard-cols">
          <div>
            <div className="dashboard-col-label">Recent Categories</div>
            {topTags.length === 0 ? (
              <div className="no-tags-hint">No categories yet. Add #tags to your notes to organize them.</div>
            ) : (
              <>
                {topTags.map(({ tag, count, latest }) => (
                  <div
                    key={tag}
                    className="recent-category-row"
                    onClick={() => onFilter({ type: 'tag', tag })}
                  >
                    <div className="recent-category-icon">
                      <IconFolder />
                    </div>
                    <div className="recent-category-name">{tag}</div>
                    <div className="recent-category-count">{count} note{count !== 1 ? 's' : ''}</div>
                    <div className="recent-category-date">
                      {latest ? formatRelativeDate(latest) : ''}
                    </div>
                  </div>
                ))}
                {allTags.length > 5 && (
                  <button className="dashboard-view-all" onClick={() => onFilter({ type: 'all' })}>
                    View all {allTags.length} categories →
                  </button>
                )}
              </>
            )}
          </div>

          <div>
            <div className="dashboard-col-label">Recent Notes</div>
            {recentNotes.map(note => (
              <div
                key={note.id}
                className="recent-note-row"
                onClick={() => onSelectNote(note.id)}
              >
                <div className="recent-note-title">{note.title || 'Untitled'}</div>
                <div className="recent-note-date">{formatRelativeDate(note.updatedAt)}</div>
              </div>
            ))}
            {notes.length > 6 && (
              <button className="dashboard-view-all" onClick={() => onFilter({ type: 'all' })}>
                View all {notes.length} notes →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function IconFolder() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
    </svg>
  )
}
