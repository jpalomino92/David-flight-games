import { Pressable, StyleSheet, Text, View } from 'react-native'

import { COLORS, SPACING } from '../../constants/theme'
import { GAME_MIGRATION_STATUS, type GameCardDescriptor } from '../../types/game'

interface GameCardProps {
  game: GameCardDescriptor
  isLocked?: boolean
  onPress: () => void
  sessionCount?: number
}

export function GameCard({ game, isLocked = false, onPress, sessionCount = 0 }: GameCardProps) {
  const statusLabel = getStatusLabel(game.migrationStatus)
  const isDisabled = !game.isEnabled || isLocked
  const note = isLocked
    ? 'Bloqueado por controles parentales en esta sesión.'
    : game.isEnabled
      ? 'Disponible ahora. Entrá y jugá una ronda mobile.'
      : 'Todavía no migrado. Queda visible para próximos batches.'

  return (
    <Pressable
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        !isDisabled && styles.cardEnabled,
        isLocked && styles.cardLocked,
        pressed && !isDisabled && styles.cardPressed,
      ]}
    >
      <View style={styles.headerRow}>
        <Text style={styles.emoji}>{game.emoji}</Text>
        <View
          style={[
            styles.badge,
            game.migrationStatus === GAME_MIGRATION_STATUS.LIVE_ON_MOBILE && styles.badgeLive,
          ]}
        >
          <Text style={styles.badgeText}>{statusLabel}</Text>
        </View>
      </View>

      <Text style={styles.title}>{game.name}</Text>
      <Text style={styles.summary}>{game.summary}</Text>
      {sessionCount > 0 ? (
        <Text style={styles.sessionMeta}>Sesiones mobile registradas: {sessionCount}</Text>
      ) : null}
      <Text style={[styles.note, isLocked && styles.noteLocked]}>{note}</Text>
    </Pressable>
  )
}

function getStatusLabel(status: GameCardDescriptor['migrationStatus']) {
  if (status === GAME_MIGRATION_STATUS.LIVE_ON_MOBILE) {
    return 'Jugable'
  }

  if (status === GAME_MIGRATION_STATUS.READY_FOR_MIGRATION) {
    return 'Lista para migrar'
  }

  return 'Placeholder'
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    gap: SPACING.sm,
    opacity: 0.85,
  },
  cardEnabled: {
    opacity: 1,
  },
  cardLocked: {
    backgroundColor: COLORS.accentSoft,
  },
  cardPressed: {
    transform: [{ scale: 0.99 }],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emoji: {
    fontSize: 30,
  },
  badge: {
    borderRadius: 999,
    backgroundColor: COLORS.successSoft,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  badgeLive: {
    backgroundColor: COLORS.accentSoft,
  },
  badgeText: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  summary: {
    color: COLORS.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  note: {
    color: COLORS.accent,
    fontSize: 13,
    fontWeight: '600',
  },
  noteLocked: {
    color: COLORS.textPrimary,
  },
  sessionMeta: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
})
