import Arena from './Arena.jsx'
import Hud from './Hud.jsx'
import './HomeScreen.css'

function HomeScreen({ onPlay, onHowToPlay }) {
  return (
    <div className="home">
      <Arena />
      <Hud />

      <main className="home-content">
        <div className="title-wrap">
          <h1 className="title">
            <span className="title-letters">
              {'BOUNCE RIOT'.split('').map((ch, i) =>
                ch === ' ' ? (
                  <span key={i}>&nbsp;</span>
                ) : (
                  <span key={i} className="title-letter" style={{ animationDelay: `${i * 0.06}s` }}>
                    {ch}
                  </span>
                ),
              )}
            </span>
          </h1>
          <p className="tagline">Bounce. Bonk. Survive.</p>
        </div>

        <div className="button-row">
          <button type="button" className="btn btn-primary" onClick={onPlay}>
            <span className="btn-icon">▶</span> Play Now
          </button>
          <button type="button" className="btn btn-secondary" onClick={onHowToPlay}>
            <span className="btn-icon">?</span> How to Play
          </button>
        </div>

        <div className="controls-strip" aria-label="Controls">
          <div className="control-chip">
            <span className="control-keys">
              <kbd>W</kbd>
              <kbd>A</kbd>
              <kbd>S</kbd>
              <kbd>D</kbd>
            </span>
            <span className="control-divider">/</span>
            <span className="control-keys">
              <kbd className="kbd-arrow">
                <span className="arrow-icon arrow-up" />
              </kbd>
              <kbd className="kbd-arrow">
                <span className="arrow-icon arrow-left" />
              </kbd>
              <kbd className="kbd-arrow">
                <span className="arrow-icon arrow-down" />
              </kbd>
              <kbd className="kbd-arrow">
                <span className="arrow-icon arrow-right" />
              </kbd>
            </span>
            <span className="control-desc">Move</span>
          </div>
          <div className="control-chip">
            <span className="control-keys">
              <kbd className="kbd-wide">Space</kbd>
            </span>
            <span className="control-divider">/</span>
            <span className="control-keys">
              <kbd>J</kbd>
            </span>
            <span className="control-desc">Jump &amp; Bonk</span>
          </div>
          <div className="control-chip control-chip-objective">
            <span className="control-icon" aria-hidden="true">
              ⭐
            </span>
            <span className="control-desc">Collect coins &amp; survive 3 levels of chaos</span>
          </div>
        </div>
      </main>
    </div>
  )
}

export default HomeScreen
