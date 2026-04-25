import { useState } from 'react'

import { FIND_THE_ODD_ONE_FEEDBACK, type FindTheOddOneGameState } from './types'
import { FIND_THE_ODD_ONE_TOTAL_ROUNDS } from './data'
import { generateFindTheOddOneRound } from './rounds'

interface UseFindTheOddOneGameResult {
  canAdvanceRound: boolean
  gameState: FindTheOddOneGameState
  isComplete: boolean
  resetRoundFeedback: () => void
  restartGame: () => void
  selectOption: (index: number) => void
  startNextRound: () => void
}

function createInitialState(): FindTheOddOneGameState {
  return {
    currentRound: generateFindTheOddOneRound(),
    feedback: FIND_THE_ODD_ONE_FEEDBACK.IDLE,
    round: 0,
    score: 0,
    selectedIndex: null,
    totalRounds: FIND_THE_ODD_ONE_TOTAL_ROUNDS,
  }
}

export function useFindTheOddOneGame(): UseFindTheOddOneGameResult {
  const [gameState, setGameState] = useState<FindTheOddOneGameState>(() => createInitialState())
  const [isComplete, setIsComplete] = useState(false)

  const selectOption = (index: number) => {
    if (gameState.feedback !== FIND_THE_ODD_ONE_FEEDBACK.IDLE) {
      return
    }

    const isCorrect = index === gameState.currentRound.oddOneIndex

    setGameState((currentState) => ({
      ...currentState,
      feedback: isCorrect
        ? FIND_THE_ODD_ONE_FEEDBACK.CORRECT
        : FIND_THE_ODD_ONE_FEEDBACK.WRONG,
      score: isCorrect ? currentState.score + 1 : currentState.score,
      selectedIndex: index,
    }))

  }

  const resetRoundFeedback = () => {
    setGameState((currentState) => ({
      ...currentState,
      feedback: FIND_THE_ODD_ONE_FEEDBACK.IDLE,
      selectedIndex: null,
    }))
  }

  const startNextRound = () => {
    setGameState((currentState) => {
      if (currentState.round + 1 >= currentState.totalRounds) {
        setIsComplete(true)
        return currentState
      }

      return {
        ...currentState,
        currentRound: generateFindTheOddOneRound(),
        feedback: FIND_THE_ODD_ONE_FEEDBACK.IDLE,
        round: currentState.round + 1,
        selectedIndex: null,
      }
    })
  }

  const restartGame = () => {
    setGameState(createInitialState())
    setIsComplete(false)
  }

  return {
    canAdvanceRound: gameState.feedback === FIND_THE_ODD_ONE_FEEDBACK.CORRECT,
    gameState,
    isComplete,
    resetRoundFeedback,
    restartGame,
    selectOption,
    startNextRound,
  }
}
