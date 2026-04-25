export interface BeePathPoint {
  x: number
  y: number
}

export interface BeePathDefinition {
  flower: BeePathPoint
  id: string
  points: BeePathPoint[]
}

export interface BeePathMoveState {
  beePosition: BeePathPoint
  flowerReached: boolean
  pathProgress: number
}

export interface BeePathRoundState {
  beePosition: BeePathPoint
  feedback: BeePathFeedbackState
  isDragging: boolean
  pathProgress: number
}

export interface BeePathGameState extends BeePathRoundState {
  round: number
  score: number
  totalRounds: number
}

const BEE_PATH_FEEDBACK = {
  IDLE: 'idle',
  ROUND_COMPLETE: 'round-complete',
} as const

export type BeePathFeedbackState =
  (typeof BEE_PATH_FEEDBACK)[keyof typeof BEE_PATH_FEEDBACK]

export { BEE_PATH_FEEDBACK }
