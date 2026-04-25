import type { PropsWithChildren } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet, View } from 'react-native'

import { COLORS } from '../../constants/theme'

export function Screen({ children }: PropsWithChildren) {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
})
