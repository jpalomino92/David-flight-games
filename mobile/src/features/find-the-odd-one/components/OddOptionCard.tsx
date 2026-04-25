import { Pressable, StyleSheet, Text, View } from 'react-native'

import { COLORS, SPACING } from '../../../constants/theme'
import { FIND_THE_ODD_ONE_FEEDBACK, type FindTheOddOneFeedback, type FindTheOddOneSymbol } from '../types'

interface OddOptionCardProps {
  feedback: FindTheOddOneFeedback
  isSelected: boolean
  onPress: () => void
  symbol: FindTheOddOneSymbol
}

export function OddOptionCard({ feedback, isSelected, onPress, symbol }: OddOptionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        isSelected && feedback === FIND_THE_ODD_ONE_FEEDBACK.CORRECT && styles.cardCorrect,
        isSelected && feedback === FIND_THE_ODD_ONE_FEEDBACK.WRONG && styles.cardWrong,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.content}>
        <Text style={styles.emoji}>{symbol.emoji}</Text>
        <Text style={styles.label}>{symbol.label}</Text>
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
    minHeight: 148,
    justifyContent: 'center',
    padding: SPACING.md,
  },
  cardPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
  cardCorrect: {
    backgroundColor: '#E8F7EC',
    borderColor: '#32A852',
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
