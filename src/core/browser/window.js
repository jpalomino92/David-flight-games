export function getWindowObject() {
  if (typeof window === 'undefined') {
    return null
  }

  return window
}

export function getViewportSize() {
  const browserWindow = getWindowObject()

  if (!browserWindow) {
    return { width: 0, height: 0 }
  }

  return {
    width: browserWindow.innerWidth,
    height: browserWindow.innerHeight,
  }
}

export function setWindowVolume(volume) {
  const browserWindow = getWindowObject()

  if (!browserWindow) {
    return
  }

  browserWindow.volume = volume
}
