import { useEffect, useState } from 'react'
import { getViewportSize, getWindowObject } from './window'

export function useViewportSize() {
  const [viewportSize, setViewportSize] = useState(() => getViewportSize())

  useEffect(() => {
    const browserWindow = getWindowObject()

    if (!browserWindow) {
      return undefined
    }

    const syncViewportSize = () => {
      setViewportSize(getViewportSize())
    }

    syncViewportSize()
    browserWindow.addEventListener('resize', syncViewportSize)

    return () => {
      browserWindow.removeEventListener('resize', syncViewportSize)
    }
  }, [])

  return viewportSize
}
