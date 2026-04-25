const TOUCH_GAME_FEEDBACK = {
  IDLE: 'idle',
  CORRECT: 'correct',
  WRONG: 'wrong',
} as const

export type TouchGameFeedback =
  (typeof TOUCH_GAME_FEEDBACK)[keyof typeof TOUCH_GAME_FEEDBACK]

export interface TouchGameAnimalOption {
  id: string
  emoji: string
  label: string
}

export interface TouchGameRound {
  correctOptionId: string
  options: TouchGameAnimalOption[]
}

export interface TouchGameState {
  currentRound: TouchGameRound
  feedback: TouchGameFeedback
  round: number
  score: number
  selectedOptionId: string | null
  totalRounds: number
}

export { TOUCH_GAME_FEEDBACK }
