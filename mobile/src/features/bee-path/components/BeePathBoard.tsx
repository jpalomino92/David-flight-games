import { useMemo, useRef, useState } from 'react'
import type { LayoutChangeEvent } from 'react-native'
import { PanResponder, StyleSheet, Text, View } from 'react-native'

import { COLORS, SPACING } from '../../../constants/theme'
import { createBeePathTrailMarkers } from '../logic'
import type { BeePathDefinition, BeePathPoint } from '../types'

interface BoardLayout {
  height: number
  width: number
}

interface BeePathBoardProps {
  beePosition: BeePathPoint
  currentPath: BeePathDefinition
  isDragging: boolean
  onGestureEnd: () => void
  onGestureMove: (pointerPosition: BeePathPoint) => void
  onGestureStart: (pointerPosition: BeePathPoint) => boolean
  pathProgress: number
}

const BEE_SIZE = 44
const FLOWER_SIZE = 48

export function BeePathBoard({
  beePosition,
  currentPath,
  isDragging,
  onGestureEnd,
  onGestureMove,
  onGestureStart,
  pathProgress,
}: BeePathBoardProps) {
  const [layout, setLayout] = useState<BoardLayout | null>(null)
  const isGestureActiveRef = useRef(false)
  const markers = useMemo(() => createBeePathTrailMarkers(currentPath), [currentPath])

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (event) => {
          if (!layout) {
            return
          }

          const pointerPosition = getNormalizedPointerPosition(layout, event.nativeEvent.locationX, event.nativeEvent.locationY)
          isGestureActiveRef.current = onGestureStart(pointerPosition)
        },
        onPanResponderMove: (event) => {
          if (!layout || !isGestureActiveRef.current) {
            return
          }

          const pointerPosition = getNormalizedPointerPosition(layout, event.nativeEvent.locationX, event.nativeEvent.locationY)
          onGestureMove(pointerPosition)
        },
        onPanResponderRelease: () => {
          isGestureActiveRef.current = false
          onGestureEnd()
        },
        onPanResponderTerminate: () => {
          isGestureActiveRef.current = false
          onGestureEnd()
        },
        onStartShouldSetPanResponder: () => true,
      }),
    [layout, onGestureEnd, onGestureMove, onGestureStart],
  )

  const handleLayout = (event: LayoutChangeEvent) => {
    setLayout({
      height: event.nativeEvent.layout.height,
      width: event.nativeEvent.layout.width,
    })
  }

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Arrastrá la abeja por el aire</Text>
      <Text style={styles.cardCopy}>
        Tocá la abeja y mantenela apretada para seguir el camino hasta la flor.
      </Text>

      <View onLayout={handleLayout} style={styles.board} {...panResponder.panHandlers}>
        {markers.map((marker, index) => {
          const isActive = markers.length <= 1 ? pathProgress > 0 : index / (markers.length - 1) <= pathProgress

          return (
            <View
              key={`${currentPath.id}-${index}`}
              style={[
                styles.trailMarker,
                getMarkerPositionStyle(marker),
                isActive && styles.trailMarkerActive,
              ]}
            />
          )
        })}

        <View style={[styles.startBadge, getMarkerPositionStyle(currentPath.points[0] ?? beePosition)]}>
          <Text style={styles.startBadgeText}>Start</Text>
        </View>

        <View style={[styles.flower, getObjectPositionStyle(currentPath.flower, FLOWER_SIZE)]}>
          <Text style={styles.flowerEmoji}>🌸</Text>
        </View>

        <View style={[styles.bee, getObjectPositionStyle(beePosition, BEE_SIZE), isDragging && styles.beeDragging]}>
          <Text style={styles.beeEmoji}>🐝</Text>
        </View>
      </View>
    </View>
  )
}

function getNormalizedPointerPosition(layout: BoardLayout, locationX: number, locationY: number): BeePathPoint {
  return {
    x: locationX / layout.width,
    y: locationY / layout.height,
  }
}

function getMarkerPositionStyle(position: BeePathPoint) {
  return {
    left: `${position.x * 100}%`,
    top: `${position.y * 100}%`,
    transform: [{ translateX: -7 }, { translateY: -7 }],
  } as const
}

function getObjectPositionStyle(position: BeePathPoint, size: number) {
  return {
    left: `${position.x * 100}%`,
    top: `${position.y * 100}%`,
    transform: [{ translateX: -(size / 2) }, { translateY: -(size / 2) }],
  } as const
}

const styles = StyleSheet.create({
  bee: {
    alignItems: 'center',
    backgroundColor: '#FFF6CC',
    borderColor: '#E8C24C',
    borderRadius: BEE_SIZE / 2,
    borderWidth: 2,
    height: BEE_SIZE,
    justifyContent: 'center',
    position: 'absolute',
    width: BEE_SIZE,
  },
  beeDragging: {
    transform: [{ translateX: -(BEE_SIZE / 2) }, { translateY: -(BEE_SIZE / 2) }, { scale: 1.06 }],
  },
  beeEmoji: {
    fontSize: 24,
  },
  board: {
    aspectRatio: 1,
    backgroundColor: '#F7FBFF',
    borderColor: COLORS.border,
    borderRadius: 24,
    borderWidth: 1,
    minHeight: 280,
    overflow: 'hidden',
    position: 'relative',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 24,
    borderWidth: 1,
    gap: SPACING.sm,
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
  flower: {
    alignItems: 'center',
    backgroundColor: '#FFE3F2',
    borderColor: '#F4A7CC',
    borderRadius: FLOWER_SIZE / 2,
    borderWidth: 2,
    height: FLOWER_SIZE,
    justifyContent: 'center',
    position: 'absolute',
    width: FLOWER_SIZE,
  },
  flowerEmoji: {
    fontSize: 28,
  },
  startBadge: {
    backgroundColor: COLORS.accentSoft,
    borderRadius: 999,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    position: 'absolute',
  },
  startBadgeText: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  trailMarker: {
    backgroundColor: '#D6E9C7',
    borderRadius: 7,
    height: 14,
    position: 'absolute',
    width: 14,
  },
  trailMarkerActive: {
    backgroundColor: '#6CBF5F',
  },
})
