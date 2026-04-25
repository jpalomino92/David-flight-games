export const GAME_CATALOG = [
  { id: 'touchGame', name: '🐶 ¿Dónde está el perro?', emoji: '🐶' },
  { id: 'beePath', name: '🐝 Camino de la abeja', emoji: '🐝' },
  { id: 'findOddOne', name: '🔍 ¿Cuál es diferente?', emoji: '🔍' },
] as const

export type GameCatalogEntry = (typeof GAME_CATALOG)[number]
export type GameId = GameCatalogEntry['id']

export const GAME_LABELS: Record<GameId, GameCatalogEntry['name']> = GAME_CATALOG.reduce(
  (labels, game) => {
    labels[game.id] = game.name
    return labels
  },
  {} as Record<GameId, GameCatalogEntry['name']>,
)

export function getGameLabel(gameId: string) {
  return GAME_LABELS[gameId as GameId] ?? gameId
}
