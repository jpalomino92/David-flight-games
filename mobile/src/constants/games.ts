import { GAME_CATALOG, type GameId } from '../../../shared/gameCatalog'
import {
  GAME_MIGRATION_STATUS,
  type GameCardDescriptor,
} from '../types/game'

const MOBILE_GAME_DETAILS: Record<
  GameId,
  Omit<GameCardDescriptor, 'id' | 'name' | 'emoji'>
> = {
  touchGame: {
    isEnabled: true,
    migrationStatus: GAME_MIGRATION_STATUS.LIVE_ON_MOBILE,
    route: '/touch-game',
    summary: 'Segundo vertical slice mobile con rondas simples, feedback táctil y navegación real.',
  },
  beePath: {
    isEnabled: true,
    migrationStatus: GAME_MIGRATION_STATUS.LIVE_ON_MOBILE,
    route: '/bee-path',
    summary: 'Slice gestual mobile con drag nativo, stats por sesión y base shared ya integrada.',
  },
  findOddOne: {
    isEnabled: true,
    migrationStatus: GAME_MIGRATION_STATUS.LIVE_ON_MOBILE,
    route: '/find-the-odd-one',
    summary: 'Primer vertical slice jugable en mobile para validar navegación y arquitectura.',
  },
}

export const MOBILE_GAME_CATALOG: GameCardDescriptor[] = GAME_CATALOG.map((game) => ({
  ...game,
  ...MOBILE_GAME_DETAILS[game.id],
}))
