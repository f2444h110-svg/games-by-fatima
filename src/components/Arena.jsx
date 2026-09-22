import Creature from './Creature.jsx'
import './Arena.css'

const CREATURES = [
  { color: '#ff3ea5', colorDark: '#b3106b', left: '8%', driftDuration: 7, bounceDuration: 1.5, bounceDelay: 0, size: 110 },
  { color: '#3de8e0', colorDark: '#0e9d97', left: '30%', driftDuration: 9, bounceDuration: 1.3, bounceDelay: 0.3, size: 92 },
  { color: '#ffd23f', colorDark: '#c98f00', left: '62%', driftDuration: 8, bounceDuration: 1.7, bounceDelay: 0.6, size: 128 },
  { color: '#9dff3d', colorDark: '#5fae00', left: '84%', driftDuration: 6.5, bounceDuration: 1.4, bounceDelay: 0.15, size: 100 },
]

function Arena() {
  return (
    <div className="arena" aria-hidden="true">
      <div className="arena-glow" />
      <div className="arena-grid" />
      <div className="arena-ring" />
      {Array.from({ length: 14 }).map((_, i) => (
        <span key={i} className={`spark spark-${i % 6}`} />
      ))}
      <div className="arena-floor" />
      {CREATURES.map((c, i) => (
        <Creature key={i} {...c} />
      ))}
    </div>
  )
}

export default Arena
