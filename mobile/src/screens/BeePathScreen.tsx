import { useEffect, useRef } from 'react'
import { useRouter } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

import { Screen } from '../components/ui/Screen'
import { COLORS, SPACING } from '../constants/theme'
import { BeePathBoard } from '../features/bee-path/components/BeePathBoard'
import { BEE_PATH_FEEDBACK, type BeePathFeedbackState } from '../features/bee-path/types'
import { useBeePathGame } from '../features/bee-path/useBeePathGame'
import { useGameFeedback } from '../hooks/useGameFeedback'
import { useGameSessionTracking } from '../hooks/useGameSessionTracking'
import { useParentalControlsStore } from '../stores/parental-controls/ParentalControlsStoreProvider'

export function BeePathScreen() {
  const router = useRouter()
  const feedback = useGameFeedback()
  const { isGameLocked } = useParentalControlsStore()
  const celebratedRef = useRef(false)
  const lastRoundStateRef = useRef(BEE_PATH_FEEDBACK.IDLE)
  const {
    beginDrag,
    canAdvanceRound,
    currentPath,
    endDrag,
    gameState,
    isComplete,
    progressLabel,
    restartGame,
    startNextRound,
    updateDrag,
  } = useBeePathGame()

  const isLocked = isGameLocked('beePath')
  const isLastRound = gameState.round + 1 === gameState.totalRounds

  useGameSessionTracking({
    gameId: 'beePath',
    gameName: 'BeePath',
    isComplete,
    score: gameState.score,
    totalRounds: gameState.totalRounds,
  })

  useEffect(() => {
    if (
      lastRoundStateRef.current !== BEE_PATH_FEEDBACK.ROUND_COMPLETE &&
      gameState.feedback === BEE_PATH_FEEDBACK.ROUND_COMPLETE
    ) {
      feedback.notifySuccess()
    }

    lastRoundStateRef.current = gameState.feedback
  }, [feedback, gameState.feedback])

  useEffect(() => {
    if (isComplete && !celebratedRef.current) {
      feedback.celebrate()
      celebratedRef.current = true
    }

    if (!isComplete) {
      celebratedRef.current = false
    }
  }, [feedback, isComplete])

  if (isLocked) {
    return (
      <Screen>
        <View style={styles.completeContainer}>
          <Text style={styles.completeEmoji}>🔒</Text>
          <Text style={styles.completeTitle}>Juego bloqueado</Text>
          <Text style={styles.completeCopy}>
            BeePath quedó bloqueado por parental controls. Desbloquealo desde el panel mobile cuando quieras volver a jugar.
          </Text>

          <View style={styles.completeActions}>
            <Pressable
              onPress={() => router.push('/parental-controls')}
              style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
            >
              <Text style={styles.primaryButtonText}>Ir al panel</Text>
            </Pressable>

            <Pressable
              onPress={() => router.replace('/')}
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
            >
              <Text style={styles.secondaryButtonText}>Volver al home</Text>
            </Pressable>
          </View>
        </View>
      </Screen>
    )
  }

  if (isComplete) {
    return (
      <Screen>
        <View style={styles.completeContainer}>
          <Text style={styles.completeEmoji}>🐝🌸</Text>
          <Text style={styles.completeTitle}>¡Llegaste!</Text>
          <Text style={styles.completeCopy}>
            Completaste BeePath con {gameState.score} caminos resueltos de {gameState.totalRounds}.
          </Text>

          <View style={styles.completeActions}>
            <Pressable
              onPress={restartGame}
              style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
            >
              <Text style={styles.primaryButtonText}>Jugar de nuevo</Text>
            </Pressable>

            <Pressable
              onPress={() => router.replace('/')}
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
            >
              <Text style={styles.secondaryButtonText}>Volver al home</Text>
            </Pressable>
          </View>
        </View>
      </Screen>
    )
  }

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
          <Text style={styles.eyebrow}>Migración gestual inicial</Text>
          <Text style={styles.title}>🐝 Camino de la abeja</Text>
          <Text style={styles.description}>
            Esta versión mobile conserva la lógica reusable del juego, pero cambia el adapter de input por un drag nativo con PanResponder y tracking de stats por sesión.
          </Text>
        </View>

        <View style={styles.progressCard}>
          <Text style={styles.progressLabel}>Camino</Text>
          <Text style={styles.progressValue}>{progressLabel}</Text>
          <Text style={styles.score}>Resueltos: {gameState.score}</Text>
        </View>

        <BeePathBoard
          beePosition={gameState.beePosition}
          currentPath={currentPath}
          isDragging={gameState.isDragging}
          onGestureEnd={endDrag}
          onGestureMove={updateDrag}
          onGestureStart={(pointerPosition) => {
            const started = beginDrag(pointerPosition)

            if (started) {
              feedback.tap()
            }

            return started
          }}
          pathProgress={gameState.pathProgress}
        />

        <View style={styles.feedbackCard}>
          <Text style={styles.feedbackTitle}>{getFeedbackTitle(gameState.feedback, gameState.isDragging)}</Text>
          <Text style={styles.feedbackCopy}>{getFeedbackCopy(gameState.feedback, gameState.isDragging, isLastRound)}</Text>

          {canAdvanceRound ? (
            <Pressable
              onPress={startNextRound}
              style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
            >
              <Text style={styles.primaryButtonText}>{isLastRound ? 'Ver resultado' : 'Siguiente camino'}</Text>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.todoCard}>
          <Text style={styles.todoTitle}>Deuda futura ya visible</Text>
          <Text style={styles.todoCopy}>
            Esta primera versión usa un camino punteado y snap geométrico sobre una polilínea. Si después queremos paridad visual total con web, la próxima capa natural es SVG/Reanimated para curvas y motion más fino.
          </Text>
        </View>
      </ScrollView>
    </Screen>
  )
}

function getFeedbackTitle(feedbackState: BeePathFeedbackState, isDragging: boolean) {
  if (feedbackState === BEE_PATH_FEEDBACK.ROUND_COMPLETE) {
    return '¡Llegó a la flor!'
  }

  if (isDragging) {
    return 'Seguí el camino'
  }

  return 'Tocá la abeja para empezar'
}

function getFeedbackCopy(
  feedbackState: BeePathFeedbackState,
  isDragging: boolean,
  isLastRound: boolean,
) {
  if (feedbackState === BEE_PATH_FEEDBACK.ROUND_COMPLETE) {
    return isLastRound
      ? 'Completaste el último camino. Tocá para ver el resultado final.'
      : 'Buenísimo. La abeja llegó a la flor, así que ya podés avanzar al próximo camino.'
  }

  if (isDragging) {
    return 'Mantené el dedo sobre la pantalla y guiá la abeja hasta el final del recorrido.'
  }

  return 'Si soltás antes de llegar, la abeja vuelve al inicio para intentar otra vez.'
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
  completeActions: {
    gap: SPACING.md,
    width: '100%',
  },
  completeContainer: {
    alignItems: 'center',
    flex: 1,
    gap: SPACING.md,
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  completeCopy: {
    color: COLORS.textSecondary,
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center',
  },
  completeEmoji: {
    fontSize: 64,
  },
  completeTitle: {
    color: COLORS.textPrimary,
    fontSize: 32,
    fontWeight: '800',
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
  feedbackCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 24,
    borderWidth: 1,
    gap: SPACING.sm,
    padding: SPACING.lg,
  },
  feedbackCopy: {
    color: COLORS.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  feedbackTitle: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '700',
  },
  hero: {
    backgroundColor: '#FFF9D9',
    borderRadius: 24,
    gap: SPACING.sm,
    padding: SPACING.lg,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    borderRadius: 18,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: SPACING.lg,
  },
  primaryButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: '700',
  },
  progressCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 24,
    borderWidth: 1,
    gap: 4,
    padding: SPACING.lg,
  },
  progressLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  progressValue: {
    color: COLORS.textPrimary,
    fontSize: 28,
    fontWeight: '800',
  },
  score: {
    color: COLORS.accent,
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: SPACING.lg,
  },
  secondaryButtonText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 30,
    fontWeight: '800',
  },
  todoCard: {
    backgroundColor: COLORS.accentSoft,
    borderRadius: 24,
    gap: SPACING.sm,
    padding: SPACING.lg,
  },
  todoCopy: {
    color: COLORS.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  todoTitle: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
})
