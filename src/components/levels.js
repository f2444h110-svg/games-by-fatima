const PLAYER_DEF = { id: 'player', color: '#ff3ea5', colorDark: '#b3106b', isPlayer: true, name: 'You', start: { x: 8, y: 8 } }

const BASE_BOTS = [
  { id: 'bot1', color: '#3de8e0', colorDark: '#0e9d97', name: 'Zap', start: { x: 92, y: 8 } },
  { id: 'bot2', color: '#ffd23f', colorDark: '#c98f00', name: 'Blob', start: { x: 8, y: 52 } },
  { id: 'bot3', color: '#9dff3d', colorDark: '#5fae00', name: 'Wobb', start: { x: 92, y: 52 } },
]

const EXTRA_BOTS = [
  { id: 'bot4', color: '#c084fc', colorDark: '#7b2ff7', name: 'Puff', start: { x: 50, y: 6 } },
  { id: 'bot5', color: '#ff8a3d', colorDark: '#b35a00', name: 'Spike', start: { x: 50, y: 54 } },
]

export { PLAYER_DEF }

export const LEVELS = [
  {
    number: 1,
    bumpers: [
      { x: 32, y: 18, radius: 5 },
      { x: 68, y: 42, radius: 5 },
      { x: 50, y: 30, radius: 4 },
    ],
    bots: BASE_BOTS,
    speedMult: 1,
    numCoins: 7,
  },
  {
    number: 2,
    bumpers: [
      { x: 22, y: 20, radius: 4.5 },
      { x: 78, y: 20, radius: 4.5 },
      { x: 50, y: 30, radius: 4 },
      { x: 50, y: 50, radius: 4 },
    ],
    bots: [...BASE_BOTS, EXTRA_BOTS[0]],
    speedMult: 1.15,
    numCoins: 8,
  },
  {
    number: 3,
    bumpers: [
      { x: 25, y: 20, radius: 4 },
      { x: 75, y: 20, radius: 4 },
      { x: 50, y: 30, radius: 4.5 },
      { x: 25, y: 40, radius: 4 },
      { x: 75, y: 40, radius: 4 },
    ],
    bots: [...BASE_BOTS, ...EXTRA_BOTS],
    speedMult: 1.3,
    numCoins: 9,
  },
]

export const TOTAL_LEVELS = LEVELS.length
