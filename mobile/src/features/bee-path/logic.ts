import { shuffleArray } from '../../utils/shuffle'
import type { BeePathDefinition, BeePathMoveState, BeePathPoint, BeePathRoundState } from './types'
import { BEE_PATH_FEEDBACK } from './types'

const BEE_PATH_ROUNDS_PER_SESSION = 4
const BEE_PATH_MARKER_COUNT = 24
const BEE_DRAG_START_DISTANCE = 0.12
const BEE_FLOWER_REACHED_DISTANCE = 0.08

const BEE_START_POSITION: BeePathPoint = { x: 0.1, y: 0.5 }

const BEE_PATHS: BeePathDefinition[] = [
  {
    flower: { x: 0.9, y: 0.5 },
    id: 'gentle-arc',
    points: [
      BEE_START_POSITION,
      { x: 0.24, y: 0.5 },
      { x: 0.38, y: 0.35 },
      { x: 0.52, y: 0.2 },
      { x: 0.7, y: 0.36 },
      { x: 0.9, y: 0.5 },
    ],
  },
  {
    flower: { x: 0.9, y: 0.5 },
    id: 'soft-wave',
    points: [
      BEE_START_POSITION,
      { x: 0.26, y: 0.36 },
      { x: 0.46, y: 0.5 },
      { x: 0.66, y: 0.66 },
      { x: 0.9, y: 0.5 },
    ],
  },
  {
    flower: { x: 0.9, y: 0.3 },
    id: 'high-breeze',
    points: [
      { x: 0.1, y: 0.32 },
      { x: 0.28, y: 0.38 },
      { x: 0.5, y: 0.3 },
      { x: 0.68, y: 0.22 },
      { x: 0.9, y: 0.3 },
    ],
  },
  {
    flower: { x: 0.9, y: 0.7 },
    id: 'low-bounce',
    points: [
      { x: 0.1, y: 0.68 },
      { x: 0.28, y: 0.42 },
      { x: 0.5, y: 0.68 },
      { x: 0.7, y: 0.86 },
      { x: 0.9, y: 0.7 },
    ],
  },
  {
    flower: { x: 0.9, y: 0.4 },
    id: 'zig-up',
    points: [
      { x: 0.1, y: 0.42 },
      { x: 0.3, y: 0.58 },
      { x: 0.52, y: 0.4 },
      { x: 0.74, y: 0.22 },
      { x: 0.9, y: 0.4 },
    ],
  },
  {
    flower: { x: 0.9, y: 0.6 },
    id: 'zig-down',
    points: [
      { x: 0.1, y: 0.58 },
      { x: 0.3, y: 0.24 },
      { x: 0.54, y: 0.58 },
      { x: 0.74, y: 0.76 },
      { x: 0.9, y: 0.6 },
    ],
  },
]

function getDistance(from: BeePathPoint, to: BeePathPoint) {
  return Math.sqrt(Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2))
}

function clampBeePosition(pointerPosition: BeePathPoint) {
  return {
    x: Math.max(0.05, Math.min(0.95, pointerPosition.x)),
    y: Math.max(0.1, Math.min(0.9, pointerPosition.y)),
  }
}

function getSegmentLength(start: BeePathPoint, end: BeePathPoint) {
  return getDistance(start, end)
}

function getNearestPointOnSegment(
  pointerPosition: BeePathPoint,
  start: BeePathPoint,
  end: BeePathPoint,
) {
  const deltaX = end.x - start.x
  const deltaY = end.y - start.y
  const segmentLengthSquared = deltaX * deltaX + deltaY * deltaY

  if (segmentLengthSquared === 0) {
    return {
      point: start,
      ratio: 0,
    }
  }

  const projection =
    ((pointerPosition.x - start.x) * deltaX + (pointerPosition.y - start.y) * deltaY) /
    segmentLengthSquared
  const ratio = Math.max(0, Math.min(1, projection))

  return {
    point: {
      x: start.x + deltaX * ratio,
      y: start.y + deltaY * ratio,
    },
    ratio,
  }
}

function getPathLength(points: BeePathPoint[]) {
  let length = 0

  for (let index = 0; index < points.length - 1; index += 1) {
    length += getSegmentLength(points[index], points[index + 1])
  }

  return length
}

function getPointAtDistance(points: BeePathPoint[], distance: number) {
  if (points.length === 0) {
    return BEE_START_POSITION
  }

  if (points.length === 1) {
    return points[0]
  }

  let remainingDistance = Math.max(0, distance)

  for (let index = 0; index < points.length - 1; index += 1) {
    const start = points[index]
    const end = points[index + 1]
    const segmentLength = getSegmentLength(start, end)

    if (remainingDistance <= segmentLength) {
      const ratio = segmentLength === 0 ? 0 : remainingDistance / segmentLength

      return {
        x: start.x + (end.x - start.x) * ratio,
        y: start.y + (end.y - start.y) * ratio,
      }
    }

    remainingDistance -= segmentLength
  }

  return points[points.length - 1]
}

function getNearestPointOnPath(pointerPosition: BeePathPoint, path: BeePathDefinition) {
  const clampedPointer = clampBeePosition(pointerPosition)
  const totalLength = getPathLength(path.points)

  let bestDistance = Number.POSITIVE_INFINITY
  let bestPoint = path.points[0] ?? BEE_START_POSITION
  let bestTravelDistance = 0
  let traversedLength = 0

  for (let index = 0; index < path.points.length - 1; index += 1) {
    const start = path.points[index]
    const end = path.points[index + 1]
    const segmentLength = getSegmentLength(start, end)
    const nearestPoint = getNearestPointOnSegment(clampedPointer, start, end)
    const distanceToPointer = getDistance(clampedPointer, nearestPoint.point)

    if (distanceToPointer < bestDistance) {
      bestDistance = distanceToPointer
      bestPoint = nearestPoint.point
      bestTravelDistance = traversedLength + segmentLength * nearestPoint.ratio
    }

    traversedLength += segmentLength
  }

  return {
    point: bestPoint,
    progress: totalLength === 0 ? 0 : bestTravelDistance / totalLength,
  }
}

function isNearBee(pointerPosition: BeePathPoint, beePosition: BeePathPoint) {
  return getDistance(pointerPosition, beePosition) < BEE_DRAG_START_DISTANCE
}

function isFlowerReached(pointerPosition: BeePathPoint, flowerPosition: BeePathPoint) {
  return getDistance(pointerPosition, flowerPosition) < BEE_FLOWER_REACHED_DISTANCE
}

function createBeePathMoveState(pointerPosition: BeePathPoint, path: BeePathDefinition): BeePathMoveState {
  const snappedPosition = getNearestPointOnPath(pointerPosition, path)
  const flowerReached = isFlowerReached(snappedPosition.point, path.flower) || snappedPosition.progress >= 0.98

  return {
    beePosition: flowerReached ? path.flower : snappedPosition.point,
    flowerReached,
    pathProgress: flowerReached ? 1 : snappedPosition.progress,
  }
}

function createBeePathRoundState(path: BeePathDefinition): BeePathRoundState {
  return {
    beePosition: path.points[0] ?? BEE_START_POSITION,
    feedback: BEE_PATH_FEEDBACK.IDLE,
    isDragging: false,
    pathProgress: 0,
  }
}

function createBeePathSessionPathIndices(roundsPerSession = BEE_PATH_ROUNDS_PER_SESSION) {
  const allIndices = BEE_PATHS.map((_, index) => index)
  const shuffledIndices = shuffleArray(allIndices)

  if (roundsPerSession <= shuffledIndices.length) {
    return shuffledIndices.slice(0, roundsPerSession)
  }

  const repeatedIndices = [...shuffledIndices]

  while (repeatedIndices.length < roundsPerSession) {
    repeatedIndices.push(...shuffleArray(allIndices))
  }

  return repeatedIndices.slice(0, roundsPerSession)
}

function createBeePathTrailMarkers(path: BeePathDefinition, markerCount = BEE_PATH_MARKER_COUNT) {
  const totalLength = getPathLength(path.points)

  if (markerCount <= 1 || totalLength === 0) {
    return [path.points[0] ?? BEE_START_POSITION]
  }

  const markers: BeePathPoint[] = []

  for (let index = 0; index < markerCount; index += 1) {
    const ratio = index / (markerCount - 1)
    markers.push(getPointAtDistance(path.points, totalLength * ratio))
  }

  return markers
}

export {
  BEE_PATH_FEEDBACK,
  BEE_PATH_MARKER_COUNT,
  BEE_PATH_ROUNDS_PER_SESSION,
  BEE_START_POSITION,
  BEE_PATHS as BEE_PATH_PATHS,
  createBeePathMoveState,
  createBeePathRoundState,
  createBeePathSessionPathIndices,
  createBeePathTrailMarkers,
  isNearBee,
}
