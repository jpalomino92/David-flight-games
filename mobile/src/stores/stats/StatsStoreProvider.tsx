import type { PropsWithChildren } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'

import { mobileStorageMeta, readJsonValue, writeJsonValue } from '../../services/storage/mobileStorage'
import { MOBILE_STORAGE_KEY } from '../../services/storage/storageKeys'
import type { GameSessionSummary, GameStatsSnapshot, MobileStatsState } from '../../types/stats'

interface StatsStoreValue {
  getGameStats: (gameId: string) => GameStatsSnapshot | null
  recordSession: (summary: GameSessionSummary) => void
  state: MobileStatsState
}

const defaultStatsState: MobileStatsState = {
  byGameId: {},
  isHydrated: false,
  storageMode: mobileStorageMeta.persistenceMode,
}

const StatsStoreContext = createContext<StatsStoreValue | null>(null)

export function StatsStoreProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<MobileStatsState>(defaultStatsState)

  useEffect(() => {
    let isMounted = true

    async function hydrateStats() {
      const byGameId = await readJsonValue(MOBILE_STORAGE_KEY.STATS, defaultStatsState.byGameId)

      if (!isMounted) {
        return
      }

      setState({
        byGameId,
        isHydrated: true,
        storageMode: mobileStorageMeta.persistenceMode,
      })
    }

    void hydrateStats()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!state.isHydrated) {
      return
    }

    void writeJsonValue(MOBILE_STORAGE_KEY.STATS, state.byGameId)
  }, [state.byGameId, state.isHydrated])

  const value: StatsStoreValue = {
    getGameStats(gameId) {
      return state.byGameId[gameId] ?? null
    },
    recordSession(summary) {
      setState((currentState) => {
        const previousStats = currentState.byGameId[summary.gameId]
        const nextStats: GameStatsSnapshot = {
          bestScore: previousStats ? Math.max(previousStats.bestScore, summary.score) : summary.score,
          gameId: summary.gameId,
          gameName: summary.gameName,
          lastCompletedAt: summary.completedAt,
          sessionsPlayed: previousStats ? previousStats.sessionsPlayed + 1 : 1,
          totalRoundsCompleted: previousStats
            ? previousStats.totalRoundsCompleted + summary.totalRounds
            : summary.totalRounds,
        }

        return {
          ...currentState,
          byGameId: {
            ...currentState.byGameId,
            [summary.gameId]: nextStats,
          },
        }
      })
    },
    state,
  }

  return <StatsStoreContext.Provider value={value}>{children}</StatsStoreContext.Provider>
}

export function useStatsStore() {
  const context = useContext(StatsStoreContext)

  if (!context) {
    throw new Error('useStatsStore must be used within StatsStoreProvider')
  }

  return context
}
