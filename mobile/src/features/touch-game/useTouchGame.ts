import { useState } from 'react'

import { TOUCH_GAME_TOTAL_ROUNDS } from './data'
import { generateTouchGameRound } from './rounds'
import { TOUCH_GAME_FEEDBACK, type TouchGameState } from './types'

interface UseTouchGameResult {
  canAdvanceRound: boolean
  gameState: TouchGameState
  isComplete: boolean
  resetRoundFeedback: () => void
  restartGame: () => void
  selectOption: (optionId: string) => void
  startNextRound: () => void
}

function createInitialState(): TouchGameState {
  return {
    currentRound: generateTouchGameRound(),
    feedback: TOUCH_GAME_FEEDBACK.IDLE,
    round: 0,
    score: 0,
    selectedOptionId: null,
    totalRounds: TOUCH_GAME_TOTAL_ROUNDS,
  }
}

export function useTouchGame(): UseTouchGameResult {
  const [gameState, setGameState] = useState<TouchGameState>(() => createInitialState())
  const [isComplete, setIsComplete] = useState(false)

  const selectOption = (optionId: string) => {
    if (gameState.feedback !== TOUCH_GAME_FEEDBACK.IDLE) {
      return
    }

    const isCorrect = optionId === gameState.currentRound.correctOptionId

    setGameState((currentState) => ({
      ...currentState,
      feedback: isCorrect ? TOUCH_GAME_FEEDBACK.CORRECT : TOUCH_GAME_FEEDBACK.WRONG,
      score: isCorrect ? currentState.score + 1 : currentState.score,
      selectedOptionId: optionId,
    }))
  }

  const resetRoundFeedback = () => {
    setGameState((currentState) => ({
      ...currentState,
      feedback: TOUCH_GAME_FEEDBACK.IDLE,
      selectedOptionId: null,
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
        currentRound: generateTouchGameRound(),
        feedback: TOUCH_GAME_FEEDBACK.IDLE,
        round: currentState.round + 1,
        selectedOptionId: null,
      }
    })
  }

  const restartGame = () => {
    setGameState(createInitialState())
    setIsComplete(false)
  }

  return {
    canAdvanceRound: gameState.feedback === TOUCH_GAME_FEEDBACK.CORRECT,
    gameState,
    isComplete,
    resetRoundFeedback,
    restartGame,
    selectOption,
    startNextRound,
  }
}
