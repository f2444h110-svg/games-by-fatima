import { forwardRef } from 'react'

const ArenaCreature = forwardRef(function ArenaCreature(
  { color, colorDark, name, isPlayer },
  ref,
) {
  return (
    <div ref={ref} className={`arena-creature${isPlayer ? ' is-player' : ''}`}>
      <div className="arena-creature-inner">
        <div className="arena-creature-shadow" />
        <svg viewBox="0 0 200 200" className="arena-creature-svg">
          <path
            d="M100,18 C144,18 182,52 182,100 C182,148 144,182 100,182 C56,182 18,148 18,100 C18,52 56,18 100,18 Z"
            fill={color}
            stroke={colorDark}
            strokeWidth="9"
          />
          <ellipse cx="58" cy="152" rx="17" ry="13" fill={colorDark} />
          <ellipse cx="142" cy="152" rx="17" ry="13" fill={colorDark} />
          <circle cx="72" cy="88" r="21" fill="#fff8ef" />
          <circle cx="76" cy="92" r="9.5" fill="#1a1030" />
          <circle cx="128" cy="88" r="21" fill="#fff8ef" />
          <circle cx="132" cy="92" r="9.5" fill="#1a1030" />
          <path d="M76,128 Q100,148 124,128" fill="none" stroke={colorDark} strokeWidth="7" strokeLinecap="round" />
        </svg>
      </div>
      {name && <span className="arena-creature-name">{name}</span>}
    </div>
  )
})

export default ArenaCreature
