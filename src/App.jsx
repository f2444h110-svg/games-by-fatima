import { useState } from 'react'
import HomeScreen from './components/HomeScreen.jsx'
import Game from './components/Game.jsx'
import HowToPlayModal from './components/HowToPlayModal.jsx'

function App() {
  const [screen, setScreen] = useState('home')
  const [howToOpen, setHowToOpen] = useState(false)

  return (
    <>
      {screen === 'home' && (
        <HomeScreen
          onPlay={() => setScreen('play')}
          onHowToPlay={() => setHowToOpen(true)}
        />
      )}
      {screen === 'play' && <Game onExit={() => setScreen('home')} />}
      {howToOpen && <HowToPlayModal onClose={() => setHowToOpen(false)} />}
    </>
  )
}

export default App
