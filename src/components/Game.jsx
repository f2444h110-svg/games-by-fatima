import { useEffect, useState } from 'react'
import PlayScreen from './PlayScreen.jsx'
import GameArena from './GameArena.jsx'
import { TOTAL_LEVELS } from './levels.js'
import LevelCompleteScreen from './LevelCompleteScreen.jsx'
import GameOverScreen from './GameOverScreen.jsx'

function Game({ onExit }) {
  const [ready, setReady] = useState(false)
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [roundPhase, setRoundPhase] = useState('playing')
  const [runId, setRunId] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1100)
    return () => clearTimeout(t)
  }, [])

  const handleRoundEnd = (finalScore) => {
    setScore(finalScore)
    setRoundPhase(level >= TOTAL_LEVELS ? 'finished' : 'levelComplete')
  }

  const handleNextLevel = () => {
    setLevel((l) => l + 1)
    setRoundPhase('playing')
    setRunId((r) => r + 1)
  }

  const handleRestartLevel = () => {
    setRunId((r) => r + 1)
  }

  const handleRestartAll = () => {
    setLevel(1)
    setScore(0)
    setRoundPhase('playing')
    setRunId((r) => r + 1)
  }

  if (!ready) {
    return <PlayScreen onBackToMenu={onExit} />
  }

  return (
    <>
      <GameArena
        key={runId}
        level={level}
        initialScore={score}
        onRoundEnd={handleRoundEnd}
        onRestartLevel={handleRestartLevel}
        onExit={onExit}
      />

      {roundPhase === 'levelComplete' && (
        <LevelCompleteScreen
          level={level}
          totalLevels={TOTAL_LEVELS}
          score={score}
          onNext={handleNextLevel}
          onExit={onExit}
        />
      )}

      {roundPhase === 'finished' && (
        <GameOverScreen
          title="All Levels Complete!"
          scoreLabel="Total Score"
          score={score}
          onRestart={handleRestartAll}
          onExit={onExit}
        />
      )}
    </>
  )
}

export default Game
