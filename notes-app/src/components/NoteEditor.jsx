import { useState, useEffect, useRef } from 'react'
import Logo from './Logo'
import { useAI } from '../hooks/useAI'

const COLORS = ['default', 'yellow', 'pink', 'green', 'blue', 'purple']
const COLOR_VALUES = {
  default: '#E6E4DF', yellow: '#B89A64', pink: '#C0392B',
  green: '#27AE60', blue: '#355C8C', purple: '#8E44AD'
}
const NOTE_BG = {
  yellow: '#FFFDF5', pink: '#FFF8F7', green: '#F5FFF8',
  blue: '#F5F8FF', purple: '#FAF5FF', default: '#FFFFFF'
}

function formatDateLong(iso) {
  return new Date(iso).toLocaleString([], {
    weekday: 'short', month: 'short', day: 'numeric',
    year: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

const SpeechAPI = typeof window !== 'undefined'
  ? (window.SpeechRecognition || window.webkitSpeechRecognition || null)
  : null

export default function NoteEditor({ note, onUpdate, onDelete, onPin, mobileActive, onMobileBack, allTags }) {
  const [tagInput, setTagInput] = useState('')
  const [listening, setListening] = useState(false)
  const [micError, setMicError] = useState('')
  const [aiSuggestions, setAiSuggestions] = useState([])
  const [aiPending, setAiPending] = useState(false)
  const titleRef = useRef(null)
  const recognitionRef = useRef(null)
  const listeningRef = useRef(false)
  const noteContentRef = useRef(note?.content || '')
  const noteIdRef = useRef(note?.id)
  const suggestTimer = useRef(null)
  const { suggestCategories } = useAI()

  // Keep content ref in sync so mic can always read latest without stale closure
  useEffect(() => { noteContentRef.current = note?.content || '' }, [note?.content])
  useEffect(() => { noteIdRef.current = note?.id }, [note?.id])

  useEffect(() => {
    if (note && !note.title && titleRef.current) titleRef.current.focus()
    setTagInput('')
    setAiSuggestions([])
  }, [note?.id])

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
        recognitionRef.current = null
      }
    }
  }, [note?.id])

  // Debounced AI suggestions (local, no API key needed)
  useEffect(() => {
    clearTimeout(suggestTimer.current)
    if (!note?.content || note.content.trim().length < 20) {
      setAiSuggestions([])
      setAiPending(false)
      return
    }
    setAiPending(true)
    suggestTimer.current = setTimeout(() => {
      const suggestions = suggestCategories(note.content, note.tags, allTags || [])
      setAiPending(false)
      if (suggestions.length > 0) setAiSuggestions(suggestions)
    }, 1500)

    return () => clearTimeout(suggestTimer.current)
  }, [note?.content, note?.id])

  function startRecognition() {
    if (!SpeechAPI || !listeningRef.current) return

    const recognition = new SpeechAPI()
    recognition.continuous = false   // iOS Safari requires false
    recognition.interimResults = false
    recognition.lang = 'en-US'
    recognitionRef.current = recognition

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(r => r[0].transcript)
        .join(' ')
        .trim()
      if (transcript && noteIdRef.current) {
        const current = noteContentRef.current
        const sep = current && !current.endsWith(' ') ? ' ' : ''
        const newContent = current + sep + transcript
        noteContentRef.current = newContent
        onUpdate(noteIdRef.current, { content: newContent })
      }
    }

    recognition.onerror = (e) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        setMicError('Microphone access denied. Go to iOS Settings → Safari → Microphone → Allow.')
        listeningRef.current = false
        setListening(false)
        recognitionRef.current = null
      } else if (e.error === 'not-supported') {
        setMicError('Voice dictation is not supported in this browser.')
        listeningRef.current = false
        setListening(false)
      } else if (e.error !== 'no-speech') {
        listeningRef.current = false
        setListening(false)
        recognitionRef.current = null
      }
    }

    // iOS stops after each phrase — restart automatically while still listening
    recognition.onend = () => {
      if (listeningRef.current) {
        try { startRecognition() } catch { }
      } else {
        recognitionRef.current = null
      }
    }

    try { recognition.start() } catch { }
  }

  function handleMicClick() {
    if (!SpeechAPI) return

    if (listening) {
      listeningRef.current = false
      setListening(false)
      recognitionRef.current?.stop()
      recognitionRef.current = null
      return
    }

    listeningRef.current = true
    setListening(true)
    startRecognition()
  }

  function acceptSuggestion(tag) {
    onUpdate(note.id, { tags: [...note.tags, tag] })
    setAiSuggestions(prev => prev.filter(s => s !== tag))
  }

  if (!note) {
    return (
      <div className={`editor-panel${mobileActive ? ' mobile-active' : ''}`}>
        <div className="no-note">
          <Logo iconOnly size={48} className="no-note-logo" />
          <div className="no-note-text">Select a note</div>
          <div className="no-note-hint">or create a new one with +</div>
        </div>
      </div>
    )
  }

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); commitTag() }
  }

  const commitTag = () => {
    const tag = tagInput.trim().toLowerCase().replace(/^#/, '').replace(/[^a-z0-9_-]/g, '')
    if (tag && !note.tags.includes(tag)) onUpdate(note.id, { tags: [...note.tags, tag] })
    setTagInput('')
  }

  const removeTag = (tag) => onUpdate(note.id, { tags: note.tags.filter(t => t !== tag) })

  return (
    <div className={`editor-panel${mobileActive ? ' mobile-active' : ''}`} style={{ background: NOTE_BG[note.color] || '#FFFFFF' }}>
      <div className="editor-toolbar">
        <div className="editor-toolbar-row1">
          <div className="tag-input-wrap">
            {note.tags.map(tag => (
              <span key={tag} className="tag-chip" onClick={() => removeTag(tag)} title="Click to remove">
                {tag}<span className="tag-chip-remove">×</span>
              </span>
            ))}
            <input
              className="add-tag-input"
              placeholder="+ category"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              onBlur={commitTag}
            />
          </div>

          <div className="editor-toolbar-controls">
            <div className="color-picker">
              {COLORS.map(c => (
                <span
                  key={c}
                  className={`color-dot${note.color === c ? ' selected' : ''}`}
                  style={{ background: COLOR_VALUES[c] }}
                  onClick={() => onUpdate(note.id, { color: c })}
                  title={c}
                />
              ))}
            </div>

            <div className="editor-actions">
              {SpeechAPI && (
                <button
                  className={`editor-action-btn icon-btn${listening ? ' mic-active' : ''}`}
                  onClick={() => { setMicError(''); handleMicClick() }}
                  title={listening ? 'Stop recording' : 'Dictate note'}
                >
                  {listening ? <><IconStop /><span style={{fontSize:11,marginLeft:4}}>Listening…</span></> : <IconMic />}
                </button>
              )}
              <button
                className={`editor-action-btn${note.pinned ? ' pin-active' : ''}`}
                onClick={() => onPin(note.id)}
              >
                {note.pinned ? 'Unpin' : 'Pin'}
              </button>
              <button className="editor-action-btn danger" onClick={() => onDelete(note.id)}>
                Delete
              </button>
            </div>
          </div>
        </div>

        {micError && (
          <div className="mic-error">{micError}</div>
        )}

        {aiSuggestions.length > 0 && (
          <div className="ai-suggestion-bar">
            <span className="ai-suggestion-label"><IconSparkle /> Suggested:</span>
            {aiSuggestions.map(tag => (
              <button key={tag} className="ai-suggestion-chip" onClick={() => acceptSuggestion(tag)}>
                + {tag}
              </button>
            ))}
            <button className="ai-dismiss" onClick={() => setAiSuggestions([])}>×</button>
          </div>
        )}

        {aiPending && aiSuggestions.length === 0 && (note?.content?.trim().length || 0) >= 20 && (
          <div className="ai-pending-hint"><IconSparkle /> Analyzing…</div>
        )}
      </div>

      <div className="editor-body">
        <div className="editor-inner">
          <textarea
            ref={titleRef}
            className="editor-title-input"
            rows={1}
            placeholder="Note title"
            value={note.title}
            onChange={e => onUpdate(note.id, { title: e.target.value })}
          />

          <div className="editor-meta">
            <span className="editor-date">Edited {formatDateLong(note.updatedAt)}</span>
            {note.source === 'imported' && <span className="editor-source-badge">Imported</span>}
          </div>

          <textarea
            className="editor-textarea"
            placeholder="Write something…"
            value={note.content}
            onChange={e => onUpdate(note.id, { content: e.target.value })}
          />
        </div>
      </div>
    </div>
  )
}

function IconMic() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="15" height="15" strokeWidth="1.8">
      <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
      <path d="M19 10v2a7 7 0 01-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  )
}

function IconStop() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" width="14" height="14">
      <rect x="5" y="5" width="14" height="14" rx="2" />
    </svg>
  )
}

function IconSparkle() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="12" height="12" strokeWidth="1.5">
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
    </svg>
  )
}
