import { useEffect, useRef } from 'react'
import { useRouter } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

import { Screen } from '../components/ui/Screen'
import { COLORS, SPACING } from '../constants/theme'
import { OddOptionCard } from '../features/find-the-odd-one/components/OddOptionCard'
import {
  FIND_THE_ODD_ONE_FEEDBACK,
  type FindTheOddOneFeedback,
} from '../features/find-the-odd-one/types'
import { useFindTheOddOneGame } from '../features/find-the-odd-one/useFindTheOddOneGame'
import { useGameFeedback } from '../hooks/useGameFeedback'
import { useGameSessionTracking } from '../hooks/useGameSessionTracking'
import { useParentalControlsStore } from '../stores/parental-controls/ParentalControlsStoreProvider'

export function FindTheOddOneScreen() {
  const router = useRouter()
  const feedback = useGameFeedback()
  const { isGameLocked } = useParentalControlsStore()
  const lastFeedbackRef = useRef<FindTheOddOneFeedback>(FIND_THE_ODD_ONE_FEEDBACK.IDLE)
  const celebratedRef = useRef(false)
  const {
    canAdvanceRound,
    gameState,
    isComplete,
    resetRoundFeedback,
    restartGame,
    selectOption,
    startNextRound,
  } = useFindTheOddOneGame()

  const isLocked = isGameLocked('findOddOne')
  const isLastRound = gameState.round + 1 === gameState.totalRounds

  useGameSessionTracking({
    gameId: 'findOddOne',
    gameName: 'Find The Odd One',
    isComplete,
    score: gameState.score,
    totalRounds: gameState.totalRounds,
  })

  useEffect(() => {
    if (lastFeedbackRef.current === gameState.feedback) {
      return
    }

    lastFeedbackRef.current = gameState.feedback

    if (gameState.feedback === FIND_THE_ODD_ONE_FEEDBACK.CORRECT) {
      feedback.notifySuccess()
    }

    if (gameState.feedback === FIND_THE_ODD_ONE_FEEDBACK.WRONG) {
      feedback.notifyError()
    }
  }, [gameState.feedback])

  useEffect(() => {
    if (isComplete && !celebratedRef.current) {
      feedback.celebrate()
      celebratedRef.current = true
    }

    if (!isComplete) {
      celebratedRef.current = false
    }
  }, [isComplete])

  const handleOptionPress = (index: number) => {
    if (gameState.feedback !== FIND_THE_ODD_ONE_FEEDBACK.IDLE) {
      return
    }

    feedback.tap()
    selectOption(index)
  }

  const handlePrimaryAction = () => {
    if (gameState.feedback === FIND_THE_ODD_ONE_FEEDBACK.WRONG) {
      resetRoundFeedback()
      return
    }

    if (canAdvanceRound) {
      startNextRound()
    }
  }

  if (isLocked) {
    return (
      <Screen>
        <View style={styles.completeContainer}>
          <Text style={styles.completeEmoji}>🔒</Text>
          <Text style={styles.completeTitle}>Juego bloqueado</Text>
          <Text style={styles.completeCopy}>
            Este juego quedó bloqueado por la base de parental controls. Desbloquealo desde el panel mobile para volver a entrar.
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
          <Text style={styles.completeEmoji}>🎉</Text>
          <Text style={styles.completeTitle}>¡Muy bien!</Text>
          <Text style={styles.completeCopy}>
            Terminaste la partida con {gameState.score} aciertos de {gameState.totalRounds}.
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
          <Text style={styles.eyebrow}>Primer juego migrado</Text>
          <Text style={styles.title}>🔍 ¿Cuál es diferente?</Text>
          <Text style={styles.description}>
            Tocá la carta distinta. Esta versión ya reporta stats al store mobile y usa la
            capa shared de feedback/haptics sin sumar dependencias nuevas.
          </Text>
        </View>

        <View style={styles.progressCard}>
          <Text style={styles.progressLabel}>Ronda</Text>
          <Text style={styles.progressValue}>
            {gameState.round + 1} / {gameState.totalRounds}
          </Text>
          <Text style={styles.score}>Puntaje: {gameState.score}</Text>
        </View>

        <View style={styles.grid}>
          {gameState.currentRound.options.map((option, index) => (
            <OddOptionCard
              key={`${gameState.round}-${option.id}-${index}`}
              feedback={gameState.feedback}
              isSelected={gameState.selectedIndex === index}
              onPress={() => handleOptionPress(index)}
              symbol={option}
            />
          ))}
        </View>

        <View style={styles.feedbackCard}>
          <Text style={styles.feedbackTitle}>{getFeedbackTitle(gameState.feedback)}</Text>
          <Text style={styles.feedbackCopy}>{getFeedbackCopy(gameState.feedback, isLastRound)}</Text>

          {gameState.feedback !== FIND_THE_ODD_ONE_FEEDBACK.IDLE ? (
            <Pressable
              onPress={handlePrimaryAction}
              style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
            >
              <Text style={styles.primaryButtonText}>
                {gameState.feedback === FIND_THE_ODD_ONE_FEEDBACK.WRONG
                  ? 'Intentar otra vez'
                  : isLastRound
                    ? 'Ver resultado'
                    : 'Siguiente ronda'}
              </Text>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.todoCard}>
          <Text style={styles.todoTitle}>Siguiente capa</Text>
          <Text style={styles.todoCopy}>
            Ya quedó lista la base para stats, persistencia durable y parental controls.
            Pendiente: audio nativo real y seguir refinando la capa shared entre juegos.
          </Text>
        </View>
      </ScrollView>
    </Screen>
  )
}

function getFeedbackTitle(feedback: FindTheOddOneFeedback) {
  if (feedback === FIND_THE_ODD_ONE_FEEDBACK.CORRECT) {
    return '¡Correcto!'
  }

  if (feedback === FIND_THE_ODD_ONE_FEEDBACK.WRONG) {
    return 'Casi'
  }

  return 'Elegí una opción'
}

function getFeedbackCopy(feedback: FindTheOddOneFeedback, isLastRound: boolean) {
  if (feedback === FIND_THE_ODD_ONE_FEEDBACK.CORRECT) {
    return isLastRound
      ? 'Acertaste la última ronda. Tocá para ver tu resultado final.'
      : 'Encontraste la carta distinta. Avanzá cuando quieras.'
  }

  if (feedback === FIND_THE_ODD_ONE_FEEDBACK.WRONG) {
    return 'Esa no era. Volvé a mirar y probá otra vez.'
  }

  return 'Hay 3 iguales y 1 distinta. Tocá la diferente para sumar un punto.'
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
    fontSize: 20,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    justifyContent: 'space-between',
  },
  hero: {
    backgroundColor: COLORS.accentSoft,
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
    paddingVertical: SPACING.sm,
  },
  primaryButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: '700',
  },
  progressCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 20,
    borderWidth: 1,
    gap: SPACING.xs,
    padding: SPACING.md,
  },
  progressLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
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
    paddingVertical: SPACING.sm,
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
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 20,
    borderStyle: 'dashed',
    borderWidth: 1,
    gap: SPACING.sm,
    padding: SPACING.md,
  },
  todoCopy: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },
  todoTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
})
