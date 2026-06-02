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

    return [
      ...sorted.filter(n => n.pinned),
      ...sorted.filter(n => !n.pinned),
    ]
  }, [notes, filter, sort, search])

  function handleNewNote() {
    const id = createNote()
    setSelectedId(id)
    setView('notes')
    setFilter({ type: 'all' })
  }

  function handleSelectNote(id) {
    setSelectedId(id)
    setView('notes')
  }

  function handleFilter(f) {
    setFilter(f)
    setView('notes')
    setSelectedId(null)
  }

  function handleSidebarFilter(f) {
    setFilter(f)
    setView('notes')
    setSelectedId(null)
  }

  function handleDelete(id) {
    setDeleteConfirm(id)
  }

  function confirmDelete() {
    if (deleteConfirm) {
      deleteNote(deleteConfirm)
      if (selectedId === deleteConfirm) setSelectedId(null)
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
  }

  const effectiveSelected = view === 'notes'
    ? (visibleNotes.find(n => n.id === selectedId) ? selectedId : visibleNotes[0]?.id || null)
    : null

  // Home icon in sidebar goes to dashboard
  function handleSidebarNav(f) {
    if (f.type === 'home') {
      setView('dashboard')
      setSelectedId(null)
    } else {
      handleSidebarFilter(f)
    }
  }

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
        {view === 'dashboard' ? (
          <Dashboard
            notes={notes}
            allTags={allTags}
            onSelectNote={handleSelectNote}
            onNewNote={handleNewNote}
            onFilter={handleFilter}
          />
        ) : (
          <>
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
            />
            <NoteEditor
              note={notes.find(n => n.id === effectiveSelected) || null}
              onUpdate={updateNote}
              onDelete={handleDelete}
              onPin={handlePin}
            />
          </>
        )}
      </div>

      {showImport && (
        <ImportModal
          onClose={() => setShowImport(false)}
          onImport={handleImport}
        />
      )}

      {deleteConfirm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setDeleteConfirm(null)}>
          <div className="modal confirm-dialog">
            <div className="modal-header">
              <div>
                <div className="modal-title">Delete note?</div>
              </div>
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
