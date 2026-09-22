import { useEffect } from 'react'
import './HowToPlayModal.css'

const RULES = [
  { icon: '🕹️', title: 'Move', text: 'Use WASD or the arrow keys to zip around the arena.' },
  { icon: '🌀', title: 'Bounce', text: 'Press Space or J to hop — bump a spring pad or another creature for a big, springy bounce.' },
  { icon: '💨', title: 'Dodge', text: 'Weave around hazards and rival bounces before they knock you off the platform.' },
  { icon: '⭐', title: 'Collect Points', text: 'Scoop up stars and orbs scattered across the arena to boost your score.' },
  { icon: '💥', title: 'Knock Others Around', text: 'Bonk rival creatures to send them flying and steal the spotlight.' },
]

function HowToPlayModal({ onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="how-to-play-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close instructions">
          ✕
        </button>
        <h2 id="how-to-play-title" className="modal-title">
          How to Play
        </h2>
        <ul className="rule-list">
          {RULES.map((rule) => (
            <li key={rule.title} className="rule-item">
              <span className="rule-icon">{rule.icon}</span>
              <span className="rule-text">
                <strong>{rule.title}</strong>
                <span>{rule.text}</span>
              </span>
            </li>
          ))}
        </ul>
        <button type="button" className="btn btn-primary modal-got-it" onClick={onClose}>
          Got it!
        </button>
      </div>
    </div>
  )
}

export default HowToPlayModal
