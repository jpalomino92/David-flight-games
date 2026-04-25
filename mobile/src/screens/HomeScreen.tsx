import { useRouter } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

import { GameCard } from '../components/home/GameCard'
import { Screen } from '../components/ui/Screen'
import { MOBILE_GAME_CATALOG } from '../constants/games'
import { COLORS, SPACING } from '../constants/theme'
import { useParentalControlsStore } from '../stores/parental-controls/ParentalControlsStoreProvider'
import { useSettingsStore } from '../stores/settings/SettingsStoreProvider'
import { useStatsStore } from '../stores/stats/StatsStoreProvider'

export function HomeScreen() {
  const router = useRouter()
  const { isGameLocked, state: parentalState } = useParentalControlsStore()
  const { state: settingsState } = useSettingsStore()
  const { state: statsState } = useStatsStore()

  const totalSessions = Object.values(statsState.byGameId).reduce(
    (sum, gameStats) => sum + gameStats.sessionsPlayed,
    0,
  )
  const lockedGamesCount = parentalState.config.lockedGameIds.length

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Expo mobile bootstrap</Text>
          <Text style={styles.title}>David&apos;s PlayGround</Text>
          <Text style={styles.description}>
            Base mobile compartida para iOS y Android. Ya tiene slices jugables, stats,
            settings de feedback y una entrada mínima para parental controls sin tocar la web.
          </Text>
        </View>

        <View style={styles.infrastructureCard}>
          <View style={styles.infrastructureHeader}>
            <View style={styles.infrastructureCopyWrap}>
              <Text style={styles.sectionTitle}>Infraestructura compartida</Text>
              <Text style={styles.sectionCopy}>
                Persistencia actual: {statsState.storageMode}. Stats jugables: {totalSessions}{' '}
                sesiones. Audio: {settingsState.config.audioEnabled ? 'on' : 'off'}. Haptics:{' '}
                {settingsState.config.hapticsEnabled ? 'on' : 'off'}.
              </Text>
              <Text style={styles.sectionCopy}>
                Locks configurados: {lockedGamesCount}. Gate parental:{' '}
                {parentalState.config.gateEnabled ? 'activo' : 'apagado'}.
              </Text>
            </View>

            <Pressable
              onPress={() => router.push('/parental-controls')}
              style={({ pressed }) => [styles.infrastructureButton, pressed && styles.buttonPressed]}
            >
              <Text style={styles.infrastructureButtonText}>Abrir panel base</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Juegos disponibles</Text>
          <Text style={styles.sectionCopy}>
            El catálogo mobile mantiene los mismos IDs visibles en web. FindTheOddOne,
            TouchGame y BeePath ya usan la base shared para stats, haptics fallback y
            locks parentales.
          </Text>

          <View style={styles.list}>
            {MOBILE_GAME_CATALOG.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                isLocked={isGameLocked(game.id)}
                onPress={() => {
                  if (game.route && !isGameLocked(game.id)) {
                    router.push(game.route)
                  }
                }}
                sessionCount={statsState.byGameId[game.id]?.sessionsPlayed ?? 0}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Terreno listo para próximos batches</Text>
          <Text style={styles.sectionCopy}>
            Próximamente: PIN/adult gate, audio nativo real y una capa visual más rica para
            los juegos gestuales.
          </Text>
        </View>
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  content: {
    padding: SPACING.lg,
    gap: SPACING.xl,
  },
  hero: {
    borderRadius: 24,
    backgroundColor: COLORS.accentSoft,
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  eyebrow: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 34,
    fontWeight: '800',
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
  buttonPressed: {
    opacity: 0.82,
  },
  section: {
    gap: SPACING.sm,
  },
  infrastructureButton: {
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    borderRadius: 18,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: SPACING.lg,
  },
  infrastructureButtonText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: '700',
  },
  infrastructureCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 24,
    borderWidth: 1,
    padding: SPACING.lg,
  },
  infrastructureCopyWrap: {
    flex: 1,
    gap: SPACING.sm,
  },
  infrastructureHeader: {
    gap: SPACING.md,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '700',
  },
  sectionCopy: {
    color: COLORS.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  list: {
    gap: SPACING.md,
    marginTop: SPACING.sm,
  },
})
