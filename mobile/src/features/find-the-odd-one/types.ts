const FIND_THE_ODD_ONE_FEEDBACK = {
  IDLE: 'idle',
  CORRECT: 'correct',
  WRONG: 'wrong',
} as const

export type FindTheOddOneFeedback =
  (typeof FIND_THE_ODD_ONE_FEEDBACK)[keyof typeof FIND_THE_ODD_ONE_FEEDBACK]

export interface FindTheOddOneSymbol {
  id: string
  emoji: string
  label: string
}

export interface FindTheOddOneRound {
  oddOneIndex: number
  options: FindTheOddOneSymbol[]
}

export interface FindTheOddOneGameState {
  currentRound: FindTheOddOneRound
  feedback: FindTheOddOneFeedback
  round: number
  score: number
  selectedIndex: number | null
  totalRounds: number
}

export { FIND_THE_ODD_ONE_FEEDBACK }
