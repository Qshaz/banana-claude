import { useState, useEffect } from 'react'
import Logo from './Logo'

const PIN_LENGTH = 4

async function hashPin(pin) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pin))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function savePin(pin) {
  const hash = await hashPin(pin)
  localStorage.setItem('dah_pin_hash', hash)
}

export function removePin() {
  localStorage.removeItem('dah_pin_hash')
}

export function hasPinSet() {
  return !!localStorage.getItem('dah_pin_hash')
}

export default function LockScreen({ onUnlock }) {
  const [digits, setDigits] = useState([])
  const [shake, setShake] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Keyboard support
  useEffect(() => {
    function onKey(e) {
      if (e.key >= '0' && e.key <= '9') addDigit(Number(e.key))
      if (e.key === 'Backspace') deleteDigit()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [digits])

  function addDigit(d) {
    if (shake) return
    setDigits(prev => {
      if (prev.length >= PIN_LENGTH) return prev
      const next = [...prev, d]
      if (next.length === PIN_LENGTH) verify(next)
      return next
    })
  }

  function deleteDigit() {
    setDigits(prev => prev.slice(0, -1))
    setErrorMsg('')
  }

  async function verify(enteredDigits) {
    const pin = enteredDigits.join('')
    const hash = await hashPin(pin)
    if (hash === localStorage.getItem('dah_pin_hash')) {
      onUnlock()
    } else {
      setShake(true)
      setErrorMsg('Incorrect PIN')
      setTimeout(() => {
        setDigits([])
        setShake(false)
        setErrorMsg('')
      }, 700)
    }
  }

  const PAD = [1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'del']

  return (
    <div className="lock-screen">
      <div className="lock-content">
        <Logo size={44} />

        <div className={`lock-dots${shake ? ' shake' : ''}`}>
          {Array.from({ length: PIN_LENGTH }).map((_, i) => (
            <div key={i} className={`lock-dot${i < digits.length ? ' filled' : ''}`} />
          ))}
        </div>

        {errorMsg
          ? <div className="lock-error">{errorMsg}</div>
          : <div className="lock-hint">Enter your PIN</div>
        }

        <div className="pin-grid">
          {PAD.map((key, i) => {
            if (key === null) return <div key={i} />
            if (key === 'del') return (
              <button key={i} className="pin-btn pin-del" onClick={deleteDigit}>⌫</button>
            )
            return (
              <button key={i} className="pin-btn" onClick={() => addDigit(key)}>
                {key}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
