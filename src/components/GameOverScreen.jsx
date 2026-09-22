import './GameOverScreen.css'

function GameOverScreen({ score, onRestart, onExit, title = "Time's Up!", scoreLabel = 'Final Score' }) {
  return (
    <div className="gameover-overlay">
      <div className="gameover-panel">
        <h2 className="gameover-title">{title}</h2>
        <p className="gameover-score-label">{scoreLabel}</p>
        <p className="gameover-score">{score.toLocaleString()}</p>
        <div className="gameover-actions">
          <button type="button" className="btn btn-primary" onClick={onRestart}>
            ↻ Play Again
          </button>
          <button type="button" className="btn btn-secondary" onClick={onExit}>
            ← Back to Menu
          </button>
        </div>
      </div>
    </div>
  )
}

export default GameOverScreen
