import { useState, useMemo } from 'react'
import './App.css'
import { useNotes } from './hooks/useNotes'
import Sidebar from './components/Sidebar'
import NoteList from './components/NoteList'
import NoteEditor from './components/NoteEditor'
import Dashboard from './components/Dashboard'
import ImportModal from './components/ImportModal'

export default function App() {
  const { notes, allTags, createNote, updateNote, deleteNote, importNotes } = useNotes()

  const [selectedId, setSelectedId] = useState(null)
  const [filter, setFilter] = useState({ type: 'all' })
  const [sort, setSort] = useState('updated')
  const [search, setSearch] = useState('')
  const [showImport, setShowImport] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [view, setView] = useState('dashboard') // 'dashboard' | 'notes'
  const [mobilePanel, setMobilePanel] = useState('dashboard') // 'dashboard' | 'list' | 'editor'

  const visibleNotes = useMemo(() => {
    let list = notes
    if (filter.type === 'pinned') list = list.filter(n => n.pinned)
    else if (filter.type === 'imported') list = list.filter(n => n.source === 'imported')
    else if (filter.type === 'tag') list = list.filter(n => n.tags.includes(filter.tag))

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.tags.some(t => t.includes(q))
      )
    }

    const sorted = [...list].sort((a, b) => {
      if (sort === 'title') return (a.title || '').localeCompare(b.title || '')
      if (sort === 'created') return new Date(b.createdAt) - new Date(a.createdAt)
      return new Date(b.updatedAt) - new Date(a.updatedAt)
    })

    return [...sorted.filter(n => n.pinned), ...sorted.filter(n => !n.pinned)]
  }, [notes, filter, sort, search])

  function handleNewNote() {
    const id = createNote()
    setSelectedId(id)
    setView('notes')
    setFilter({ type: 'all' })
    setMobilePanel('editor')
  }

  function handleSelectNote(id) {
    setSelectedId(id)
    setView('notes')
    setMobilePanel('editor')
  }

  function handleFilter(f) {
    setFilter(f)
    setView('notes')
    setSelectedId(null)
    setMobilePanel('list')
  }

  function handleSidebarNav(f) {
    if (f.type === 'home') {
      setView('dashboard')
      setSelectedId(null)
      setMobilePanel('dashboard')
    } else {
      setFilter(f)
      setView('notes')
      setSelectedId(null)
      setMobilePanel('list')
    }
  }

  function handleDelete(id) { setDeleteConfirm(id) }

  function confirmDelete() {
    if (deleteConfirm) {
      deleteNote(deleteConfirm)
      if (selectedId === deleteConfirm) {
        setSelectedId(null)
        setMobilePanel('list')
      }
      setDeleteConfirm(null)
    }
  }

  function handlePin(id) {
    const note = notes.find(n => n.id === id)
    if (note) updateNote(id, { pinned: !note.pinned })
  }

  function handleImport(parsed) {
    importNotes(parsed)
    setFilter({ type: 'imported' })
    setView('notes')
    setSelectedId(null)
    setMobilePanel('list')
  }

  const effectiveSelected = view === 'notes'
    ? (visibleNotes.find(n => n.id === selectedId) ? selectedId : visibleNotes[0]?.id || null)
    : null

  return (
    <div className="app">
      <Sidebar
        notes={notes}
        allTags={allTags}
        filter={view === 'dashboard' ? { type: 'home' } : filter}
        setFilter={handleSidebarNav}
        onNewNote={handleNewNote}
        onImport={() => setShowImport(true)}
      />

      <div className="main-area">
        <Dashboard
          notes={notes}
          allTags={allTags}
          onSelectNote={handleSelectNote}
          onNewNote={handleNewNote}
          onFilter={handleFilter}
          className={mobilePanel === 'dashboard' ? 'mobile-active' : ''}
          isActive={view === 'dashboard'}
        />

        {(view === 'notes' || true) && (
          <NoteList
            notes={visibleNotes}
            selectedId={effectiveSelected}
            onSelect={handleSelectNote}
            onNew={handleNewNote}
            filter={filter}
            sort={sort}
            setSort={setSort}
            search={search}
            setSearch={setSearch}
            mobileActive={mobilePanel === 'list'}
            onMobileBack={() => setMobilePanel('dashboard')}
          />
        )}

        <NoteEditor
          note={notes.find(n => n.id === effectiveSelected) || null}
          onUpdate={updateNote}
          onDelete={handleDelete}
          onPin={handlePin}
          mobileActive={mobilePanel === 'editor'}
          onMobileBack={() => setMobilePanel('list')}
        />
      </div>

      {/* Mobile bottom nav */}
      <nav className="mobile-nav">
        <button
          className={`mobile-nav-btn${mobilePanel === 'dashboard' ? ' active' : ''}`}
          onClick={() => { setMobilePanel('dashboard'); setView('dashboard') }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
            <path d="M9 21V12h6v9" />
          </svg>
          <span>Home</span>
        </button>

        <button
          className={`mobile-nav-btn${mobilePanel === 'list' ? ' active' : ''}`}
          onClick={() => { setMobilePanel('list'); setView('notes') }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <span>Notes</span>
        </button>

        <button className="mobile-nav-btn nav-new" onClick={handleNewNote}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>New</span>
        </button>

        <button className="mobile-nav-btn" onClick={() => setShowImport(true)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>Import</span>
        </button>
      </nav>

      {showImport && (
        <ImportModal onClose={() => setShowImport(false)} onImport={handleImport} />
      )}

      {deleteConfirm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setDeleteConfirm(null)}>
          <div className="modal confirm-dialog">
            <div className="modal-header">
              <div><div className="modal-title">Delete note?</div></div>
              <button className="modal-close" onClick={() => setDeleteConfirm(null)}>✕</button>
            </div>
            <div className="confirm-body">
              This will permanently delete "{notes.find(n => n.id === deleteConfirm)?.title || 'Untitled'}".
              This action cannot be undone.
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
