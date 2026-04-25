import { useEffect, useRef } from 'react'
import { getWindowObject } from '../../core/browser/window'

function getTouchPoint(event) {
  if (!event.touches || event.touches.length === 0) {
    return null
  }

  return event.touches[0]
}

export function useBeePathWebInput({ containerRef, onStart, onMove, onEnd }) {
  const handlersRef = useRef({ onStart, onMove, onEnd })

  useEffect(() => {
    handlersRef.current = { onStart, onMove, onEnd }
  }, [onStart, onMove, onEnd])

  useEffect(() => {
    const container = containerRef.current
    const browserWindow = getWindowObject()

    if (!container || !browserWindow) {
      return undefined
    }

    const handleMouseDown = (event) => {
      handlersRef.current.onStart(event.clientX, event.clientY)
    }

    const handleMouseMove = (event) => {
      handlersRef.current.onMove(event.clientX, event.clientY)
    }

    const handleTouchStart = (event) => {
      event.preventDefault()
      event.stopPropagation()

      const touchPoint = getTouchPoint(event)

      if (!touchPoint) {
        return
      }

      handlersRef.current.onStart(touchPoint.clientX, touchPoint.clientY)
    }

    const handleTouchMove = (event) => {
      event.preventDefault()
      event.stopPropagation()

      const touchPoint = getTouchPoint(event)

      if (!touchPoint) {
        return
      }

      handlersRef.current.onMove(touchPoint.clientX, touchPoint.clientY)
    }

    const handlePointerEnd = () => {
      handlersRef.current.onEnd()
    }

    container.addEventListener('mousedown', handleMouseDown)
    container.addEventListener('touchstart', handleTouchStart, { passive: false })

    browserWindow.addEventListener('mousemove', handleMouseMove)
    browserWindow.addEventListener('mouseup', handlePointerEnd)
    browserWindow.addEventListener('touchmove', handleTouchMove, { passive: false })
    browserWindow.addEventListener('touchend', handlePointerEnd)

    return () => {
      container.removeEventListener('mousedown', handleMouseDown)
      container.removeEventListener('touchstart', handleTouchStart)
      browserWindow.removeEventListener('mousemove', handleMouseMove)
      browserWindow.removeEventListener('mouseup', handlePointerEnd)
      browserWindow.removeEventListener('touchmove', handleTouchMove)
      browserWindow.removeEventListener('touchend', handlePointerEnd)
    }
  }, [containerRef])
}
