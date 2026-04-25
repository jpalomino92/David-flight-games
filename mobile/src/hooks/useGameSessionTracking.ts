import { useEffect, useRef } from 'react'

import { useStatsStore } from '../stores/stats/StatsStoreProvider'

interface GameSessionTrackingInput {
  gameId: string
  gameName: string
  isComplete: boolean
  score: number
  totalRounds: number
}

export function useGameSessionTracking(input: GameSessionTrackingInput) {
  const hasTrackedSessionRef = useRef(false)
  const { recordSession } = useStatsStore()

  useEffect(() => {
    if (!input.isComplete) {
      hasTrackedSessionRef.current = false
      return
    }

    if (hasTrackedSessionRef.current) {
      return
    }

    recordSession({
      completedAt: new Date().toISOString(),
      gameId: input.gameId,
      gameName: input.gameName,
      score: input.score,
      totalRounds: input.totalRounds,
    })

    hasTrackedSessionRef.current = true
  }, [input.gameId, input.gameName, input.isComplete, input.score, input.totalRounds, recordSession])
}
