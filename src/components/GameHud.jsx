import './Hud.css'

function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${r.toString().padStart(2, '0')}`
}

function GameHud({ score, timeLeft, level, totalLevels }) {
  const low = timeLeft <= 10
  return (
    <div className="hud game-hud">
      <div className="hud-pill hud-score">
        <span className="hud-label">Score</span>
        <span className="hud-value">{score.toLocaleString()}</span>
      </div>
      {level && (
        <div className="hud-pill hud-level">
          <span className="hud-label">Level</span>
          <span className="hud-value">
            {level} / {totalLevels}
          </span>
        </div>
      )}
      <div className={`hud-pill hud-round${low ? ' hud-timer-low' : ''}`}>
        <span className="hud-label">Time</span>
        <span className="hud-value">{formatTime(timeLeft)}</span>
      </div>
    </div>
  )
}

export default GameHud
