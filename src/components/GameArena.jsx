import { useEffect, useRef, useState } from 'react'
import ArenaCreature from './ArenaCreature.jsx'
import GameHud from './GameHud.jsx'
import PauseMenu from './PauseMenu.jsx'
import { LEVELS, PLAYER_DEF, TOTAL_LEVELS } from './levels.js'
import './GameArena.css'

const ARENA_W = 100
const ARENA_H = 60
const PLAYER_RADIUS = 4.4
const BOT_RADIUS = 4.1
const COIN_RADIUS = 1.9
const GAME_DURATION = 60
const JUMP_DURATION = 0.32
const JUMP_COOLDOWN = 0.55
const MAX_SPEED_CAP = 70

const MOVE_KEYS = new Set(['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'])

function createEntities(charDefs) {
  return charDefs.map((def, i) => ({
    ...def,
    index: i,
    x: def.start.x,
    y: def.start.y,
    vx: 0,
    vy: 0,
    radius: def.isPlayer ? PLAYER_RADIUS : BOT_RADIUS,
    isJumping: false,
    jumpTimer: 0,
    jumpCooldown: Math.random() * 0.6,
    wanderT: Math.random() * 1.2,
    targetX: def.start.x,
    targetY: def.start.y,
  }))
}

function randCoinPos(bumpers) {
  let pos
  let tries = 0
  do {
    pos = {
      x: COIN_RADIUS * 2 + Math.random() * (ARENA_W - COIN_RADIUS * 4),
      y: COIN_RADIUS * 2 + Math.random() * (ARENA_H - COIN_RADIUS * 4),
    }
    tries += 1
  } while (
    bumpers.some((b) => Math.hypot(pos.x - b.x, pos.y - b.y) < b.radius + COIN_RADIUS + 3) &&
    tries < 12
  )
  return pos
}

function createCoins(bumpers, numCoins) {
  return Array.from({ length: numCoins }, (_, i) => ({ id: i, ...randCoinPos(bumpers), active: true, respawnAt: 0 }))
}

function clampSpeed(e, max) {
  const sp = Math.hypot(e.vx, e.vy)
  if (sp > max) {
    e.vx = (e.vx / sp) * max
    e.vy = (e.vy / sp) * max
  }
}

function resolveEntityCollision(a, b, onBonk) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  let dist = Math.hypot(dx, dy)
  const minDist = a.radius + b.radius
  if (dist >= minDist) return
  if (dist === 0) dist = 0.01
  const nx = dx / dist
  const ny = dy / dist
  const overlap = minDist - dist
  a.x -= (nx * overlap) / 2
  a.y -= (ny * overlap) / 2
  b.x += (nx * overlap) / 2
  b.y += (ny * overlap) / 2
  const rvx = b.vx - a.vx
  const rvy = b.vy - a.vy
  const relVel = rvx * nx + rvy * ny
  if (relVel < 0) {
    const bonkBoost = a.isJumping || b.isJumping ? 2.2 : 1
    const impulse = -relVel * bonkBoost
    a.vx -= impulse * nx * 0.5
    a.vy -= impulse * ny * 0.5
    b.vx += impulse * nx * 0.5
    b.vy += impulse * ny * 0.5
    onBonk(a)
    onBonk(b)
  }
}

function resolveObstacle(e, obs, onBonk) {
  const dx = e.x - obs.x
  const dy = e.y - obs.y
  let dist = Math.hypot(dx, dy)
  const minDist = e.radius + obs.radius
  if (dist >= minDist) return
  if (dist === 0) dist = 0.01
  const nx = dx / dist
  const ny = dy / dist
  e.x = obs.x + nx * minDist
  e.y = obs.y + ny * minDist
  const vDotN = e.vx * nx + e.vy * ny
  if (vDotN < 0) {
    e.vx -= 2 * vDotN * nx * 1.15
    e.vy -= 2 * vDotN * ny * 1.15
    onBonk(e)
  }
}

function GameArena({ level, initialScore = 0, onRoundEnd, onExit, onRestartLevel }) {
  const levelConfig = LEVELS[level - 1] ?? LEVELS[0]
  const BUMPERS = levelConfig.bumpers
  const charDefsRef = useRef([PLAYER_DEF, ...levelConfig.bots])

  const containerRef = useRef(null)
  const charRefs = useRef([])
  const coinRefs = useRef([])
  const keysRef = useRef(new Set())
  const entitiesRef = useRef(createEntities(charDefsRef.current))
  const coinsRef = useRef(createCoins(BUMPERS, levelConfig.numCoins))
  const scaleRef = useRef(1)
  const elapsedRef = useRef(0)
  const runningRef = useRef(true)
  const pausedRef = useRef(false)
  const lastDisplayedTimeRef = useRef(GAME_DURATION)
  const scoreRef = useRef(initialScore)

  const [score, setScore] = useState(initialScore)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [paused, setPausedState] = useState(false)

  const pause = () => {
    pausedRef.current = true
    setPausedState(true)
  }

  const resume = () => {
    pausedRef.current = false
    setPausedState(false)
  }

  const pulseBonk = (el) => {
    if (!el) return
    el.classList.remove('bonk')
    // eslint-disable-next-line no-void
    void el.offsetWidth
    el.classList.add('bonk')
  }

  const triggerJump = (e) => {
    if (!e || e.jumpCooldown > 0) return
    e.isJumping = true
    e.jumpTimer = JUMP_DURATION
    e.jumpCooldown = JUMP_COOLDOWN
    charRefs.current[e.index]?.classList.add('is-jumping')
    entitiesRef.current.forEach((other) => {
      if (other === e) return
      const dx = other.x - e.x
      const dy = other.y - e.y
      const dist = Math.hypot(dx, dy)
      const range = e.radius + other.radius + 6
      if (dist < range) {
        const nx = dist === 0 ? 1 : dx / dist
        const ny = dist === 0 ? 0 : dy / dist
        other.vx += nx * 32
        other.vy += ny * 32
        pulseBonk(charRefs.current[other.index])
      }
    })
  }

  const collectCoin = (e, coin) => {
    coin.active = false
    coin.respawnAt = elapsedRef.current + 0.8
    if (e.isPlayer) {
      scoreRef.current += 10
      setScore(scoreRef.current)
    }
  }

  const applySizes = () => {
    const scale = scaleRef.current
    entitiesRef.current.forEach((e) => {
      const el = charRefs.current[e.index]
      if (el) el.style.width = el.style.height = `${e.radius * 2 * scale}px`
    })
    coinsRef.current.forEach((c) => {
      const el = coinRefs.current[c.id]
      if (el) el.style.width = el.style.height = `${COIN_RADIUS * 2 * scale}px`
    })
  }

  const endGame = () => {
    if (!runningRef.current) return
    runningRef.current = false
    onRoundEnd(scoreRef.current)
  }

  useEffect(() => {
    const el = containerRef.current
    if (!el || typeof ResizeObserver === 'undefined') return undefined
    const ro = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect
      scaleRef.current = width / ARENA_W
      applySizes()
    })
    ro.observe(el)
    return () => ro.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      const code = e.code
      if (MOVE_KEYS.has(code) || code === 'Space' || code === 'KeyJ') e.preventDefault()
      if (code === 'Escape') {
        if (!e.repeat && runningRef.current) {
          if (pausedRef.current) resume()
          else pause()
        }
        return
      }
      if (code === 'Space' || code === 'KeyJ') {
        if (!e.repeat && !pausedRef.current) triggerJump(entitiesRef.current[0])
        return
      }
      keysRef.current.add(code)
    }
    const handleKeyUp = (e) => keysRef.current.delete(e.code)
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return undefined

    const DRAG_DEAD_ZONE = 10
    let activePointerId = null
    let anchorX = 0
    let anchorY = 0

    const clearTouchDirections = () => {
      keysRef.current.delete('ArrowLeft')
      keysRef.current.delete('ArrowRight')
      keysRef.current.delete('ArrowUp')
      keysRef.current.delete('ArrowDown')
    }

    const updateTouchDirection = (dx, dy) => {
      if (dx < -DRAG_DEAD_ZONE) {
        keysRef.current.add('ArrowLeft')
        keysRef.current.delete('ArrowRight')
      } else if (dx > DRAG_DEAD_ZONE) {
        keysRef.current.add('ArrowRight')
        keysRef.current.delete('ArrowLeft')
      } else {
        keysRef.current.delete('ArrowLeft')
        keysRef.current.delete('ArrowRight')
      }
      if (dy < -DRAG_DEAD_ZONE) {
        keysRef.current.add('ArrowUp')
        keysRef.current.delete('ArrowDown')
      } else if (dy > DRAG_DEAD_ZONE) {
        keysRef.current.add('ArrowDown')
        keysRef.current.delete('ArrowUp')
      } else {
        keysRef.current.delete('ArrowUp')
        keysRef.current.delete('ArrowDown')
      }
    }

    const endDrag = (e) => {
      if (e.pointerId !== activePointerId) return
      activePointerId = null
      clearTouchDirections()
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', endDrag)
      window.removeEventListener('pointercancel', endDrag)
    }

    function handlePointerMove(e) {
      if (e.pointerId !== activePointerId) return
      e.preventDefault()
      updateTouchDirection(e.clientX - anchorX, e.clientY - anchorY)
    }

    const handlePointerDown = (e) => {
      if (e.pointerType === 'mouse' || activePointerId !== null) return
      activePointerId = e.pointerId
      anchorX = e.clientX
      anchorY = e.clientY
      e.preventDefault()
      window.addEventListener('pointermove', handlePointerMove, { passive: false })
      window.addEventListener('pointerup', endDrag)
      window.addEventListener('pointercancel', endDrag)
    }

    el.addEventListener('pointerdown', handlePointerDown, { passive: false })
    return () => {
      el.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', endDrag)
      window.removeEventListener('pointercancel', endDrag)
      clearTouchDirections()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    let raf
    let last = performance.now()
    const speedMult = levelConfig.speedMult

    const applyPlayerInput = (e, dt) => {
      const keys = keysRef.current
      let ix = 0
      let iy = 0
      if (keys.has('KeyW') || keys.has('ArrowUp')) iy -= 1
      if (keys.has('KeyS') || keys.has('ArrowDown')) iy += 1
      if (keys.has('KeyA') || keys.has('ArrowLeft')) ix -= 1
      if (keys.has('KeyD') || keys.has('ArrowRight')) ix += 1
      const len = Math.hypot(ix, iy)
      if (len > 0) {
        ix /= len
        iy /= len
      }
      const accel = 210
      const maxSpeed = 34
      e.vx += ix * accel * dt
      e.vy += iy * accel * dt
      const damp = Math.exp(-6 * dt)
      e.vx *= damp
      e.vy *= damp
      const sp = Math.hypot(e.vx, e.vy)
      if (sp > maxSpeed) {
        e.vx = (e.vx / sp) * maxSpeed
        e.vy = (e.vy / sp) * maxSpeed
      }
    }

    const applyBotAI = (bot, dt) => {
      bot.wanderT -= dt
      if (bot.wanderT <= 0) {
        bot.wanderT = 1.1 + Math.random() * 1.6
        const activeCoins = coinsRef.current.filter((c) => c.active)
        if (activeCoins.length && Math.random() < 0.7) {
          const target = activeCoins[Math.floor(Math.random() * activeCoins.length)]
          bot.targetX = target.x
          bot.targetY = target.y
        } else {
          bot.targetX = BOT_RADIUS + Math.random() * (ARENA_W - 2 * BOT_RADIUS)
          bot.targetY = BOT_RADIUS + Math.random() * (ARENA_H - 2 * BOT_RADIUS)
        }
      }
      const dx = bot.targetX - bot.x
      const dy = bot.targetY - bot.y
      const d = Math.hypot(dx, dy) || 1
      const accel = 150 * speedMult
      bot.vx += (dx / d) * accel * dt
      bot.vy += (dy / d) * accel * dt
      const maxSpeed = 27 * speedMult
      const sp = Math.hypot(bot.vx, bot.vy)
      if (sp > maxSpeed) {
        bot.vx = (bot.vx / sp) * maxSpeed
        bot.vy = (bot.vy / sp) * maxSpeed
      }
      if (bot.jumpCooldown <= 0 && Math.random() < dt * 0.45 * speedMult) triggerJump(bot)
    }

    const bounceWalls = (e) => {
      let hit = false
      if (e.x < e.radius) {
        e.x = e.radius
        e.vx = Math.abs(e.vx) * 0.72
        hit = true
      } else if (e.x > ARENA_W - e.radius) {
        e.x = ARENA_W - e.radius
        e.vx = -Math.abs(e.vx) * 0.72
        hit = true
      }
      if (e.y < e.radius) {
        e.y = e.radius
        e.vy = Math.abs(e.vy) * 0.72
        hit = true
      } else if (e.y > ARENA_H - e.radius) {
        e.y = ARENA_H - e.radius
        e.vy = -Math.abs(e.vy) * 0.72
        hit = true
      }
      if (hit) pulseBonk(charRefs.current[e.index])
    }

    const update = (dt) => {
      const entities = entitiesRef.current

      entities.forEach((e) => {
        if (e.isPlayer) applyPlayerInput(e, dt)
        else applyBotAI(e, dt)

        e.x += e.vx * dt
        e.y += e.vy * dt

        if (e.jumpCooldown > 0) e.jumpCooldown -= dt
        if (e.isJumping) {
          e.jumpTimer -= dt
          if (e.jumpTimer <= 0) {
            e.isJumping = false
            charRefs.current[e.index]?.classList.remove('is-jumping')
          }
        }

        bounceWalls(e)
        BUMPERS.forEach((b) => resolveObstacle(e, b, (ent) => pulseBonk(charRefs.current[ent.index])))
      })

      for (let i = 0; i < entities.length; i += 1) {
        for (let j = i + 1; j < entities.length; j += 1) {
          resolveEntityCollision(entities[i], entities[j], (ent) => pulseBonk(charRefs.current[ent.index]))
        }
      }

      entities.forEach((e) => {
        clampSpeed(e, MAX_SPEED_CAP)
        const globalDamp = Math.exp(-0.35 * dt)
        e.vx *= globalDamp
        e.vy *= globalDamp
      })

      coinsRef.current.forEach((coin) => {
        if (!coin.active) {
          if (elapsedRef.current >= coin.respawnAt) {
            Object.assign(coin, randCoinPos(BUMPERS))
            coin.active = true
            const el = coinRefs.current[coin.id]
            if (el) {
              el.classList.remove('coin-respawn')
              // eslint-disable-next-line no-void
              void el.offsetWidth
              el.classList.add('coin-respawn')
            }
          }
          return
        }
        entities.forEach((e) => {
          const dist = Math.hypot(e.x - coin.x, e.y - coin.y)
          if (dist < e.radius + COIN_RADIUS) collectCoin(e, coin)
        })
      })

      const scale = scaleRef.current
      entities.forEach((e) => {
        const el = charRefs.current[e.index]
        if (el) {
          el.style.transform = `translate3d(${e.x * scale}px, ${e.y * scale}px, 0) translate(-50%, -50%)`
        }
      })
      coinsRef.current.forEach((c) => {
        const el = coinRefs.current[c.id]
        if (el) {
          el.style.transform = `translate3d(${c.x * scale}px, ${c.y * scale}px, 0) translate(-50%, -50%)`
          el.style.opacity = c.active ? '1' : '0'
        }
      })

      elapsedRef.current += dt
      const remaining = Math.max(0, GAME_DURATION - elapsedRef.current)
      const ceilRemaining = Math.ceil(remaining)
      if (ceilRemaining !== lastDisplayedTimeRef.current) {
        lastDisplayedTimeRef.current = ceilRemaining
        setTimeLeft(ceilRemaining)
      }
      if (remaining <= 0) endGame()
    }

    const tick = (t) => {
      const dt = Math.min((t - last) / 1000, 0.05)
      last = t
      if (runningRef.current && !pausedRef.current) update(dt)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="game-arena-wrap">
      <GameHud score={score} timeLeft={timeLeft} level={level} totalLevels={TOTAL_LEVELS} />
      <button type="button" className="arena-exit-btn" onClick={onExit} aria-label="Back to menu">
        ✕
      </button>
      <button type="button" className="arena-pause-btn" onClick={pause} aria-label="Pause game">
        <span className="pause-icon">
          <span className="pause-bar" />
          <span className="pause-bar" />
        </span>
      </button>

      <div className={`game-arena${paused ? ' is-paused' : ''}`} ref={containerRef}>
        <div className="game-arena-glow" />
        <div className="game-arena-grid" />

        {BUMPERS.map((b, i) => (
          <div
            key={i}
            className="bumper"
            style={{
              left: `${(b.x / ARENA_W) * 100}%`,
              top: `${(b.y / ARENA_H) * 100}%`,
              width: `${(b.radius * 2 * 100) / ARENA_W}%`,
              paddingBottom: `${(b.radius * 2 * 100) / ARENA_W}%`,
            }}
          />
        ))}

        {coinsRef.current.map((c) => (
          <div key={c.id} ref={(el) => (coinRefs.current[c.id] = el)} className="coin">
            <span className="coin-glyph">★</span>
          </div>
        ))}

        {charDefsRef.current.map((def, i) => (
          <ArenaCreature
            key={def.id}
            ref={(el) => (charRefs.current[i] = el)}
            color={def.color}
            colorDark={def.colorDark}
            name={def.name}
            isPlayer={def.isPlayer}
          />
        ))}
      </div>

      {paused && <PauseMenu onResume={resume} onRestartLevel={onRestartLevel} onExit={onExit} />}
    </div>
  )
}

export default GameArena
