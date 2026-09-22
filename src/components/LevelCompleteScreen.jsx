import './GameOverScreen.css'

function LevelCompleteScreen({ level, totalLevels, score, onNext, onExit }) {
  return (
    <div className="gameover-overlay">
      <div className="gameover-panel">
        <h2 className="gameover-title">Level {level} Complete!</h2>
        <p className="gameover-score-label">Score</p>
        <p className="gameover-score">{score.toLocaleString()}</p>
        <p className="levelcomplete-next-label">
          Up next: Level {level + 1} of {totalLevels}
        </p>
        <div className="gameover-actions">
          <button type="button" className="btn btn-primary" onClick={onNext}>
            Next Level →
          </button>
          <button type="button" className="btn btn-secondary" onClick={onExit}>
            ← Back to Menu
          </button>
        </div>
      </div>
    </div>
  )
}

export default LevelCompleteScreen
