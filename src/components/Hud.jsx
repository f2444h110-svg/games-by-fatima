import { useEffect, useState } from 'react'
import './Hud.css'

const PLAYER_COLORS = ['#ff3ea5', '#3de8e0', '#ffd23f', '#9dff3d']

function Hud() {
  const [score, setScore] = useState(1280)

  useEffect(() => {
    const id = setInterval(() => {
      setScore((s) => s + Math.floor(Math.random() * 40) + 10)
    }, 2200)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="hud">
      <div className="hud-pill hud-score">
        <span className="hud-label">Score</span>
        <span className="hud-value">{score.toLocaleString()}</span>
      </div>
      <div className="hud-pill hud-round">
        <span className="hud-label">Level</span>
        <span className="hud-value">1 / 3</span>
      </div>
      <div className="hud-pill hud-players">
        <span className="hud-label">Players</span>
        <span className="hud-dots">
          {PLAYER_COLORS.map((c, i) => (
            <span key={i} className="hud-dot" style={{ background: c, animationDelay: `${i * 0.2}s` }} />
          ))}
        </span>
      </div>
    </div>
  )
}

export default Hud
