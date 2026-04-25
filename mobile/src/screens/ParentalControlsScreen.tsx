import { useRouter } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native'

import { Screen } from '../components/ui/Screen'
import { MOBILE_GAME_CATALOG } from '../constants/games'
import { COLORS, SPACING } from '../constants/theme'
import { mobileStorageMeta } from '../services/storage/mobileStorage'
import { useParentalControlsStore } from '../stores/parental-controls/ParentalControlsStoreProvider'
import { useSettingsStore } from '../stores/settings/SettingsStoreProvider'

export function ParentalControlsScreen() {
  const router = useRouter()
  const { endUnlockedSession, setGateEnabled, state, toggleGameLock, unlockSession } =
    useParentalControlsStore()
  const { setAudioEnabled, setHapticsEnabled, state: settingsState } = useSettingsStore()

  const liveGames = MOBILE_GAME_CATALOG.filter((game) => game.isEnabled)

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable
          onPress={() => router.replace('/')}
          style={({ pressed }) => [styles.backButton, pressed && styles.buttonPressed]}
        >
          <Text style={styles.backButtonText}>← Volver</Text>
        </Pressable>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Base shared mobile</Text>
          <Text style={styles.title}>Parental controls</Text>
          <Text style={styles.description}>
            Punto de entrada mínimo para revisar locks por juego, sesión desbloqueada y
            toggles globales de feedback. Quedan pendientes PIN real y restricciones más
            avanzadas.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Estado actual</Text>
          <Text style={styles.cardCopy}>
            Persistencia: {state.storageMode}. Adapter actual: {mobileStorageMeta.adapterName}.
          </Text>
          <Text style={styles.cardCopy}>
            Pendiente: PIN/biometría y restricciones por horario.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.rowHeader}>
            <View style={styles.rowCopyWrap}>
              <Text style={styles.rowTitle}>Gate parental</Text>
              <Text style={styles.rowCopy}>Activa los locks configurados para los juegos mobile.</Text>
            </View>
            <Switch onValueChange={setGateEnabled} value={state.config.gateEnabled} />
          </View>

          <View style={styles.rowHeader}>
            <View style={styles.rowCopyWrap}>
              <Text style={styles.rowTitle}>Sesión desbloqueada</Text>
              <Text style={styles.rowCopy}>
                Bypass temporal para validar UX mientras no exista una autenticación adulta real.
              </Text>
            </View>
            <Pressable
              onPress={state.sessionUnlocked ? endUnlockedSession : unlockSession}
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
            >
              <Text style={styles.secondaryButtonText}>
                {state.sessionUnlocked ? 'Cerrar' : 'Desbloquear'}
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Locks por juego</Text>
          <Text style={styles.cardCopy}>
            Esta capa ya permite bloquear desde Home todos los juegos jugables en mobile,
            incluido BeePath.
          </Text>

          <View style={styles.list}>
            {liveGames.map((game) => {
              const isLocked = state.config.lockedGameIds.includes(game.id)

              return (
                <View key={game.id} style={styles.rowHeader}>
                  <View style={styles.rowCopyWrap}>
                    <Text style={styles.rowTitle}>{game.name}</Text>
                    <Text style={styles.rowCopy}>
                      {isLocked ? 'Bloqueado desde Home y desde la route.' : 'Disponible para jugar.'}
                    </Text>
                  </View>
                  <Switch
                    disabled={!state.config.gateEnabled}
                    onValueChange={() => toggleGameLock(game.id)}
                    value={isLocked}
                  />
                </View>
              )
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Feedback global</Text>
          <Text style={styles.cardCopy}>
            Wrapper listo para audio/haptics. Hoy audio es placeholder y haptics usa vibración nativa.
          </Text>

          <View style={styles.rowHeader}>
            <View style={styles.rowCopyWrap}>
              <Text style={styles.rowTitle}>Audio</Text>
              <Text style={styles.rowCopy}>Switch de configuración listo para futuras cues reales.</Text>
            </View>
            <Switch onValueChange={setAudioEnabled} value={settingsState.config.audioEnabled} />
          </View>

          <View style={styles.rowHeader}>
            <View style={styles.rowCopyWrap}>
              <Text style={styles.rowTitle}>Haptics</Text>
              <Text style={styles.rowCopy}>Hoy se resuelve con `Vibration` como fallback sin deps extra.</Text>
            </View>
            <Switch onValueChange={setHapticsEnabled} value={settingsState.config.hapticsEnabled} />
          </View>
        </View>
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  backButton: {
    alignSelf: 'flex-start',
    borderColor: COLORS.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  backButtonText: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.82,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 24,
    borderWidth: 1,
    gap: SPACING.md,
    padding: SPACING.lg,
  },
  cardCopy: {
    color: COLORS.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  cardTitle: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  content: {
    gap: SPACING.lg,
    padding: SPACING.lg,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
  eyebrow: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  hero: {
    backgroundColor: COLORS.accentSoft,
    borderRadius: 24,
    gap: SPACING.sm,
    padding: SPACING.lg,
  },
  list: {
    gap: SPACING.md,
  },
  rowCopy: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  rowCopyWrap: {
    flex: 1,
    gap: SPACING.xs,
    paddingRight: SPACING.md,
  },
  rowHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: SPACING.md,
    justifyContent: 'space-between',
  },
  rowTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: COLORS.accentSoft,
    borderRadius: 16,
    justifyContent: 'center',
    minHeight: 42,
    paddingHorizontal: SPACING.md,
  },
  secondaryButtonText: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '700',
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 30,
    fontWeight: '800',
  },
})
