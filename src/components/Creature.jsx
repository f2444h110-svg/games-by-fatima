function Creature({ color, colorDark, eyeSide = 'both', left, driftDuration, bounceDuration, bounceDelay, size = 120 }) {
  return (
    <div
      className="creature-drift"
      style={{
        left,
        animationDuration: `${driftDuration}s`,
      }}
    >
      <div
        className="creature-bounce"
        style={{
          animationDuration: `${bounceDuration}s`,
          animationDelay: `${bounceDelay}s`,
        }}
      >
        <div
          className="creature-shadow"
          style={{
            width: size * 0.8,
            animationDuration: `${bounceDuration}s`,
            animationDelay: `${bounceDelay}s`,
          }}
        />
        <svg
          className="creature-squash"
          width={size}
          height={size}
          viewBox="0 0 200 200"
          style={{
            animationDuration: `${bounceDuration}s`,
            animationDelay: `${bounceDelay}s`,
          }}
        >
          <ellipse cx="100" cy="185" rx="34" ry="10" fill={colorDark} opacity="0.5" />
          <path
            d="M100,18 C144,18 182,52 182,100 C182,148 144,182 100,182 C56,182 18,148 18,100 C18,52 56,18 100,18 Z"
            fill={color}
            stroke={colorDark}
            strokeWidth="6"
          />
          <ellipse cx="60" cy="150" rx="16" ry="12" fill={colorDark} />
          <ellipse cx="140" cy="150" rx="16" ry="12" fill={colorDark} />
          {(eyeSide === 'both' || eyeSide === 'left') && (
            <g>
              <circle cx="72" cy="88" r="20" fill="#fff8ef" />
              <circle className="pupil" cx="76" cy="92" r="9" fill="#1a1030" />
            </g>
          )}
          {(eyeSide === 'both' || eyeSide === 'right') && (
            <g>
              <circle cx="128" cy="88" r="20" fill="#fff8ef" />
              <circle className="pupil" cx="132" cy="92" r="9" fill="#1a1030" />
            </g>
          )}
          <path
            d="M78,128 Q100,146 122,128"
            fill="none"
            stroke={colorDark}
            strokeWidth="6"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  )
}

export default Creature
