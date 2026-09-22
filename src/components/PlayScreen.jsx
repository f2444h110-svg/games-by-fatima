import './PlayScreen.css'

function PlayScreen({ onBackToMenu }) {
  return (
    <div className="play-screen">
      <div className="play-glow" />
      <div className="loading-dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <h1 className="loading-text">Game Loading...</h1>
      <p className="loading-sub">Warming up the arena — bots are stretching, coins are hiding.</p>
      <button type="button" className="btn btn-secondary" onClick={onBackToMenu}>
        ← Back to Menu
      </button>
    </div>
  )
}

export default PlayScreen
