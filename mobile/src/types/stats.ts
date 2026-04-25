import type { StoragePersistenceMode } from '../services/storage/mobileStorage'

export interface GameSessionSummary {
  completedAt: string
  gameId: string
  gameName: string
  score: number
  totalRounds: number
}

export interface GameStatsSnapshot {
  bestScore: number
  gameId: string
  gameName: string
  lastCompletedAt: string | null
  sessionsPlayed: number
  totalRoundsCompleted: number
}

export interface MobileStatsState {
  byGameId: Record<string, GameStatsSnapshot>
  isHydrated: boolean
  storageMode: StoragePersistenceMode
}
