import './GameOverScreen.css'

function PauseMenu({ onResume, onRestartLevel, onExit }) {
  return (
    <div className="gameover-overlay">
      <div className="gameover-panel" role="dialog" aria-modal="true" aria-labelledby="pause-title">
        <h2 id="pause-title" className="gameover-title">
          Paused
        </h2>
        <div className="gameover-actions">
          <button type="button" className="btn btn-primary" onClick={onResume}>
            ▶ Resume
          </button>
          <button type="button" className="btn btn-secondary" onClick={onRestartLevel}>
            ↻ Restart Level
          </button>
          <button type="button" className="btn btn-secondary" onClick={onExit}>
            ← Back to Menu
          </button>
        </div>
      </div>
    </div>
  )
}

export default PauseMenu
