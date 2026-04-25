import { useEffect, useRef } from 'react'
import { useRouter } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

import { Screen } from '../components/ui/Screen'
import { COLORS, SPACING } from '../constants/theme'
import { TouchOptionCard } from '../features/touch-game/components/TouchOptionCard'
import {
  TOUCH_GAME_FEEDBACK,
  type TouchGameFeedback,
} from '../features/touch-game/types'
import { useTouchGame } from '../features/touch-game/useTouchGame'
import { useGameFeedback } from '../hooks/useGameFeedback'
import { useGameSessionTracking } from '../hooks/useGameSessionTracking'
import { useParentalControlsStore } from '../stores/parental-controls/ParentalControlsStoreProvider'

export function TouchGameScreen() {
  const router = useRouter()
  const feedback = useGameFeedback()
  const { isGameLocked } = useParentalControlsStore()
  const lastFeedbackRef = useRef<TouchGameFeedback>(TOUCH_GAME_FEEDBACK.IDLE)
  const celebratedRef = useRef(false)
  const {
    canAdvanceRound,
    gameState,
    isComplete,
    resetRoundFeedback,
    restartGame,
    selectOption,
    startNextRound,
  } = useTouchGame()

  const isLocked = isGameLocked('touchGame')
  const isLastRound = gameState.round + 1 === gameState.totalRounds

  useGameSessionTracking({
    gameId: 'touchGame',
    gameName: 'Touch Game',
    isComplete,
    score: gameState.score,
    totalRounds: gameState.totalRounds,
  })

  useEffect(() => {
    if (lastFeedbackRef.current === gameState.feedback) {
      return
    }

    lastFeedbackRef.current = gameState.feedback

    if (gameState.feedback === TOUCH_GAME_FEEDBACK.CORRECT) {
      feedback.notifySuccess()
    }

    if (gameState.feedback === TOUCH_GAME_FEEDBACK.WRONG) {
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

  const handlePrimaryAction = () => {
    if (gameState.feedback === TOUCH_GAME_FEEDBACK.WRONG) {
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
            TouchGame está bloqueado por la base actual de parental controls. Podés destrabarlo desde el panel mobile.
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
          <Text style={styles.completeEmoji}>🐶🎉</Text>
          <Text style={styles.completeTitle}>¡Muy bien!</Text>
          <Text style={styles.completeCopy}>
            Terminaste TouchGame con {gameState.score} aciertos de {gameState.totalRounds}.
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
          <Text style={styles.eyebrow}>Segunda migración real</Text>
          <Text style={styles.title}>🐶 ¿Dónde está el perro?</Text>
          <Text style={styles.description}>
            Tocá el perro entre los animales. Esta versión ya usa feedback global, tracking
            de stats por sesión y el gate parental base para validar la infraestructura shared.
          </Text>
        </View>

        <View style={styles.progressCard}>
          <Text style={styles.progressLabel}>Ronda</Text>
          <Text style={styles.progressValue}>
            {gameState.round + 1} / {gameState.totalRounds}
          </Text>
          <Text style={styles.score}>Aciertos: {gameState.score}</Text>
        </View>

        <View style={styles.promptCard}>
          <Text style={styles.promptEyebrow}>Consigna</Text>
          <Text style={styles.promptTitle}>¿Dónde está el perro?</Text>
          <Text style={styles.promptCopy}>
            Elegí el emoji correcto. Si fallás, podés intentarlo otra vez en la misma ronda.
          </Text>
        </View>

        <View style={styles.grid}>
          {gameState.currentRound.options.map((option) => (
            <TouchOptionCard
              key={`${gameState.round}-${option.id}`}
              feedback={gameState.feedback}
              isSelected={gameState.selectedOptionId === option.id}
              onPress={() => {
                feedback.tap()
                selectOption(option.id)
              }}
              option={option}
            />
          ))}
        </View>

        <View style={styles.feedbackCard}>
          <Text style={styles.feedbackTitle}>{getFeedbackTitle(gameState.feedback)}</Text>
          <Text style={styles.feedbackCopy}>{getFeedbackCopy(gameState.feedback, isLastRound)}</Text>

          {gameState.feedback !== TOUCH_GAME_FEEDBACK.IDLE ? (
            <Pressable
              onPress={handlePrimaryAction}
              style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
            >
              <Text style={styles.primaryButtonText}>
                {gameState.feedback === TOUCH_GAME_FEEDBACK.WRONG
                  ? 'Intentar otra vez'
                  : isLastRound
                    ? 'Ver resultado'
                    : 'Siguiente ronda'}
              </Text>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.todoCard}>
          <Text style={styles.todoTitle}>Deuda futura ya identificada</Text>
          <Text style={styles.todoCopy}>
            Esta versión ya se conecta con stats, feedback global y parental controls base.
            Pendiente: audio real y assets compartidos entre web/mobile.
          </Text>
        </View>
      </ScrollView>
    </Screen>
  )
}

function getFeedbackTitle(feedback: TouchGameFeedback) {
  if (feedback === TOUCH_GAME_FEEDBACK.CORRECT) {
    return '¡Correcto!'
  }

  if (feedback === TOUCH_GAME_FEEDBACK.WRONG) {
    return 'Ups, ese no era'
  }

  return 'Elegí un animal'
}

function getFeedbackCopy(feedback: TouchGameFeedback, isLastRound: boolean) {
  if (feedback === TOUCH_GAME_FEEDBACK.CORRECT) {
    return isLastRound
      ? 'Encontraste al perro en la última ronda. Tocá para ver el resultado final.'
      : 'Encontraste al perro. Avanzá cuando quieras a la próxima ronda.'
  }

  if (feedback === TOUCH_GAME_FEEDBACK.WRONG) {
    return 'Ese animal no era el perro. Respirá, mirá de nuevo y probá otra vez.'
  }

  return 'Hay una sola respuesta correcta en cada ronda. Tocá el perro para sumar un punto.'
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
    padding: SPACING.lg,
  },
  progressLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  progressValue: {
    color: COLORS.textPrimary,
    fontSize: 30,
    fontWeight: '800',
  },
  promptCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 20,
    borderWidth: 1,
    gap: SPACING.xs,
    padding: SPACING.lg,
  },
  promptCopy: {
    color: COLORS.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  promptEyebrow: {
    color: COLORS.accent,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  promptTitle: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: '800',
  },
  score: {
    color: COLORS.textSecondary,
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
