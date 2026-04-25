export const BEE_START_POSITION = { x: 0.1, y: 0.5 }

export const BEE_PATHS = [
  { d: 'M 10 50 Q 30 50 40 35 Q 50 20 65 35 Q 80 50 90 50', flower: { x: 0.9, y: 0.5 } },
  { d: 'M 10 50 Q 35 30 50 50 Q 65 70 90 50', flower: { x: 0.9, y: 0.5 } },
  { d: 'M 10 30 Q 40 40 50 30 Q 60 20 90 30', flower: { x: 0.9, y: 0.3 } },
  { d: 'M 10 70 Q 30 40 50 70 Q 70 90 90 70', flower: { x: 0.9, y: 0.7 } },
  { d: 'M 10 40 Q 35 60 55 40 Q 75 20 90 40', flower: { x: 0.9, y: 0.4 } },
  { d: 'M 10 60 Q 35 20 55 60 Q 75 80 90 60', flower: { x: 0.9, y: 0.6 } },
  { d: 'M 10 45 Q 40 25 50 45 Q 60 65 90 45', flower: { x: 0.9, y: 0.45 } },
  { d: 'M 10 55 Q 40 75 50 55 Q 60 35 90 55', flower: { x: 0.9, y: 0.55 } },
  { d: 'M 10 35 Q 35 55 55 35 Q 75 15 90 35', flower: { x: 0.9, y: 0.35 } },
  { d: 'M 10 65 Q 35 45 55 65 Q 75 85 90 65', flower: { x: 0.9, y: 0.65 } },
]

export function getRandomPathIndex(currentIndex) {
  if (BEE_PATHS.length <= 1) {
    return 0
  }

  let nextIndex = currentIndex

  while (nextIndex === currentIndex) {
    nextIndex = Math.floor(Math.random() * BEE_PATHS.length)
  }

  return nextIndex
}

export function getPointerPosition(container, pointer) {
  if (!container) {
    return null
  }

  const { clientX, clientY } = pointer

  if (clientX === undefined || clientY === undefined) {
    return null
  }

  const rect = container.getBoundingClientRect()

  if (rect.width <= 0 || rect.height <= 0) {
    return null
  }

  return {
    x: (clientX - rect.left) / rect.width,
    y: (clientY - rect.top) / rect.height,
  }
}

export function createBeePathMoveState(pointerPosition, flowerPosition) {
  const beePosition = clampBeePosition(pointerPosition)
  const flowerReached = isFlowerReached(beePosition, flowerPosition)

  return {
    beePosition,
    flowerReached,
    gameWon: flowerReached,
    pathProgress: getPathProgress(beePosition.x),
  }
}

export function createBeePathResetState(currentPathIndex) {
  return {
    beePosition: BEE_START_POSITION,
    flowerReached: false,
    gameStarted: false,
    gameWon: false,
    isDragging: false,
    pathIndex: getRandomPathIndex(currentPathIndex),
    pathProgress: 0,
    showConfetti: false,
  }
}

export function getDistance(from, to) {
  return Math.sqrt(Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2))
}

export function isNearBee(pointerPosition, beePosition) {
  return getDistance(pointerPosition, beePosition) < 0.15
}

export function isFlowerReached(pointerPosition, flowerPosition) {
  return getDistance(pointerPosition, flowerPosition) < 0.06
}

export function clampBeePosition(pointerPosition) {
  return {
    x: Math.max(0.05, Math.min(0.95, pointerPosition.x)),
    y: Math.max(0.1, Math.min(0.9, pointerPosition.y)),
  }
}

export function getPathProgress(positionX) {
  return Math.min(1, Math.max(0, (positionX - 0.1) / 0.7))
}
