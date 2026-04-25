import { Pressable, StyleSheet, Text, View } from 'react-native'

import { COLORS, SPACING } from '../../../constants/theme'
import {
  TOUCH_GAME_FEEDBACK,
  type TouchGameAnimalOption,
  type TouchGameFeedback,
} from '../types'

interface TouchOptionCardProps {
  feedback: TouchGameFeedback
  isSelected: boolean
  onPress: () => void
  option: TouchGameAnimalOption
}

export function TouchOptionCard({
  feedback,
  isSelected,
  onPress,
  option,
}: TouchOptionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        isSelected && feedback === TOUCH_GAME_FEEDBACK.CORRECT && styles.cardCorrect,
        isSelected && feedback === TOUCH_GAME_FEEDBACK.WRONG && styles.cardWrong,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.content}>
        <Text style={styles.emoji}>{option.emoji}</Text>
        <Text style={styles.label}>{option.label}</Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 24,
    borderWidth: 2,
    flexBasis: '48%',
    justifyContent: 'center',
    minHeight: 148,
    padding: SPACING.md,
  },
  cardCorrect: {
    backgroundColor: '#E8F7EC',
    borderColor: '#32A852',
  },
  cardPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
  cardWrong: {
    backgroundColor: '#FDECEC',
    borderColor: '#D64545',
  },
  content: {
    alignItems: 'center',
    gap: SPACING.sm,
  },
  emoji: {
    fontSize: 54,
  },
  label: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
})
