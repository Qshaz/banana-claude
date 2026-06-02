import { useState, useMemo } from 'react'
import './App.css'
import { useNotes } from './hooks/useNotes'
import Sidebar from './components/Sidebar'
import NoteList from './components/NoteList'
import NoteEditor from './components/NoteEditor'
import Dashboard from './components/Dashboard'
import ImportModal from './components/ImportModal'
import SettingsModal from './components/SettingsModal'
import Logo from './components/Logo'

export default function App() {
  const { notes, allTags, createNote, updateNote, deleteNote, importNotes } = useNotes()

  const [selectedId, setSelectedId] = useState(null)
  const [filter, setFilter] = useState({ type: 'all' })
  const [sort, setSort] = useState('updated')
  const [search, setSearch] = useState('')
  const [showImport, setShowImport] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [view, setView] = useState('dashboard')
  const [mobilePanel, setMobilePanel] = useState('dashboard')

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
      <header className="mobile-header">
        <Logo size={28} />
      </header>

      <Sidebar
        notes={notes}
        allTags={allTags}
        filter={view === 'dashboard' ? { type: 'home' } : filter}
        setFilter={handleSidebarNav}
        onNewNote={handleNewNote}
        onImport={() => setShowImport(true)}
        onSettings={() => setShowSettings(true)}
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
            onDelete={handleDelete}
          />
        )}

        <NoteEditor
          note={notes.find(n => n.id === effectiveSelected) || null}
          onUpdate={updateNote}
          onDelete={handleDelete}
          onPin={handlePin}
          mobileActive={mobilePanel === 'editor'}
          onMobileBack={() => setMobilePanel('list')}
          allTags={allTags}
        />
      </div>

      {/* Mobile bottom nav */}
      <nav className="mobile-nav">
        <button
          className={`mobile-nav-btn${mobilePanel === 'dashboard' ? ' active' : ''}`}
          onClick={() => { setMobilePanel('dashboard'); setView('dashboard') }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
            <path d="M9 21V12h6v9" />
          </svg>
          <span>Home</span>
        </button>

        <button
          className={`mobile-nav-btn${mobilePanel === 'list' ? ' active' : ''}`}
          onClick={() => { setMobilePanel('list'); setView('notes') }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
          </svg>
          <span>Notes</span>
        </button>

        <button className="mobile-nav-btn nav-new" onClick={handleNewNote}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>New</span>
        </button>

        <button className="mobile-nav-btn" onClick={() => setShowImport(true)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="16 16 12 12 8 16" />
            <line x1="12" y1="12" x2="12" y2="21" />
            <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
          </svg>
          <span>Import</span>
        </button>

        <button className="mobile-nav-btn" onClick={() => setShowSettings(true)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
          <span>Settings</span>
        </button>
      </nav>

      {showImport && (
        <ImportModal onClose={() => setShowImport(false)} onImport={handleImport} />
      )}

      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
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
