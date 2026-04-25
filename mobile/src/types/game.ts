import type { GameId } from '../../../shared/gameCatalog'

const GAME_MIGRATION_STATUS = {
  LIVE_ON_MOBILE: 'live-on-mobile',
  PLACEHOLDER: 'placeholder',
  READY_FOR_MIGRATION: 'ready-for-migration',
} as const

export type GameMigrationStatus =
  (typeof GAME_MIGRATION_STATUS)[keyof typeof GAME_MIGRATION_STATUS]

export interface GameCardDescriptor {
  id: GameId
  isEnabled: boolean
  name: string
  emoji: string
  migrationStatus: GameMigrationStatus
  route: string | null
  summary: string
}

export { GAME_MIGRATION_STATUS }
