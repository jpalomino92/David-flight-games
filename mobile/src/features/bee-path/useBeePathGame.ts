import { useMemo, useState } from 'react'

import {
  BEE_PATH_FEEDBACK,
  BEE_PATH_PATHS,
  BEE_PATH_ROUNDS_PER_SESSION,
  createBeePathMoveState,
  createBeePathRoundState,
  createBeePathSessionPathIndices,
  isNearBee,
} from './logic'
import type { BeePathGameState, BeePathPoint } from './types'

export function useBeePathGame() {
  const [pathIndices, setPathIndices] = useState(() => createBeePathSessionPathIndices())
  const [isComplete, setIsComplete] = useState(false)
  const [state, setState] = useState<BeePathGameState>(() => {
    const initialPath = BEE_PATH_PATHS[pathIndices[0]]
    const roundState = createBeePathRoundState(initialPath)

    return {
      ...roundState,
      round: 0,
      score: 0,
      totalRounds: BEE_PATH_ROUNDS_PER_SESSION,
    }
  })

  const currentPathIndex = pathIndices[state.round] ?? pathIndices[0] ?? 0
  const currentPath = BEE_PATH_PATHS[currentPathIndex]
  const canAdvanceRound = state.feedback === BEE_PATH_FEEDBACK.ROUND_COMPLETE

  const progressLabel = useMemo(
    () => `${state.round + 1} / ${state.totalRounds}`,
    [state.round, state.totalRounds],
  )

  const beginDrag = (pointerPosition: BeePathPoint) => {
    if (isComplete || canAdvanceRound) {
      return false
    }

    if (!isNearBee(pointerPosition, state.beePosition)) {
      return false
    }

    setState((currentState) => ({
      ...currentState,
      isDragging: true,
    }))

    return true
  }

  const updateDrag = (pointerPosition: BeePathPoint) => {
    setState((currentState) => {
      if (!currentState.isDragging) {
        return currentState
      }

      const moveState = createBeePathMoveState(pointerPosition, currentPath)

      if (moveState.flowerReached) {
        return {
          ...currentState,
          beePosition: moveState.beePosition,
          feedback: BEE_PATH_FEEDBACK.ROUND_COMPLETE,
          isDragging: false,
          pathProgress: moveState.pathProgress,
          score: currentState.score + 1,
        }
      }

      return {
        ...currentState,
        beePosition: moveState.beePosition,
        pathProgress: moveState.pathProgress,
      }
    })
  }

  const endDrag = () => {
    setState((currentState) => {
      if (!currentState.isDragging || currentState.feedback === BEE_PATH_FEEDBACK.ROUND_COMPLETE) {
        return {
          ...currentState,
          isDragging: false,
        }
      }

      const roundState = createBeePathRoundState(currentPath)

      return {
        ...currentState,
        ...roundState,
      }
    })
  }

  const startNextRound = () => {
    if (!canAdvanceRound) {
      return
    }

    if (state.round + 1 >= state.totalRounds) {
      setIsComplete(true)
      return
    }

    const nextRound = state.round + 1
    const nextPath = BEE_PATH_PATHS[pathIndices[nextRound]]

    setState((currentState) => ({
      ...currentState,
      ...createBeePathRoundState(nextPath),
      round: nextRound,
    }))
  }

  const restartGame = () => {
    const nextPathIndices = createBeePathSessionPathIndices()
    const firstPath = BEE_PATH_PATHS[nextPathIndices[0]]

    setPathIndices(nextPathIndices)
    setIsComplete(false)
    setState({
      ...createBeePathRoundState(firstPath),
      round: 0,
      score: 0,
      totalRounds: BEE_PATH_ROUNDS_PER_SESSION,
    })
  }

  return {
    beginDrag,
    canAdvanceRound,
    currentPath,
    endDrag,
    gameState: state,
    isComplete,
    progressLabel,
    restartGame,
    startNextRound,
    updateDrag,
  }
}
