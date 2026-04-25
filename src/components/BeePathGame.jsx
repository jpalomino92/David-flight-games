import { useState, useRef, useEffect } from 'react'
import Confetti from 'react-confetti'
import { useGameConfig } from '../context/GameConfigContext'
import { playSuccessSound } from '../core/audio/webAudio'
import { useViewportSize } from '../core/browser/useViewportSize'
import {
  BEE_PATHS,
  BEE_START_POSITION,
  createBeePathMoveState,
  createBeePathResetState,
  getPointerPosition,
  isNearBee,
} from '../features/bee-path/logic'
import { useBeePathWebInput } from '../features/bee-path/useBeePathWebInput'
import './BeePathGame.css'

function BeePathGame({ onBack }) {
  const { trackGameTime, timerExpired } = useGameConfig()
  const { width, height } = useViewportSize()
  
  const [beePos, setBeePos] = useState(BEE_START_POSITION)
  const [flowerReached, setFlowerReached] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [pathProgress, setPathProgress] = useState(0)
  const [pathIndex, setPathIndex] = useState(() => Math.floor(Math.random() * BEE_PATHS.length))
  const currentPath = BEE_PATHS[pathIndex]
  const flowerPos = currentPath.flower
  
  const containerRef = useRef(null)
  const hideConfettiTimeoutRef = useRef(null)
  const beePosRef = useRef(BEE_START_POSITION)
  const isDraggingRef = useRef(false)
  const flowerReachedRef = useRef(false)
  const gameStartedRef = useRef(false)
  const gameWonRef = useRef(false)
  const flowerPosRef = useRef(flowerPos)
  const timerExpiredRef = useRef(timerExpired)

  useEffect(() => {
    beePosRef.current = beePos
  }, [beePos])

  useEffect(() => {
    isDraggingRef.current = isDragging
  }, [isDragging])

  useEffect(() => {
    flowerReachedRef.current = flowerReached
  }, [flowerReached])

  useEffect(() => {
    gameStartedRef.current = gameStarted
  }, [gameStarted])

  useEffect(() => {
    gameWonRef.current = gameWon
  }, [gameWon])

  useEffect(() => {
    flowerPosRef.current = flowerPos
  }, [flowerPos])

  useEffect(() => {
    timerExpiredRef.current = timerExpired
  }, [timerExpired])

  useEffect(() => {
    if (gameStarted && !gameWon && !timerExpired) {
      const interval = setInterval(() => {
        trackGameTime('beePath', 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [gameStarted, gameWon, timerExpired, trackGameTime])

  const handleStart = (clientX, clientY) => {
    if (gameWonRef.current || timerExpiredRef.current) return
    
    const pos = getPointerPosition(containerRef.current, { clientX, clientY })
    if (!pos) return
    
    if (isNearBee(pos, beePosRef.current)) {
      isDraggingRef.current = true
      setIsDragging(true)
      if (!gameStartedRef.current) {
        gameStartedRef.current = true
        setGameStarted(true)
      }
    }
  }

  const handleMove = (clientX, clientY) => {
    if (!isDraggingRef.current || gameWonRef.current || timerExpiredRef.current) return
    
    const pos = getPointerPosition(containerRef.current, { clientX, clientY })
    if (!pos) return
    
    const moveState = createBeePathMoveState(pos, flowerPosRef.current)

    setBeePos(moveState.beePosition)
    
    if (!flowerReachedRef.current) {
      if (moveState.flowerReached) {
        flowerReachedRef.current = true
        gameWonRef.current = moveState.gameWon
        setFlowerReached(moveState.flowerReached)
        setGameWon(moveState.gameWon)
        setShowConfetti(true)
        playSuccessSound()

        if (hideConfettiTimeoutRef.current) {
          clearTimeout(hideConfettiTimeoutRef.current)
        }

        hideConfettiTimeoutRef.current = setTimeout(() => {
          setShowConfetti(false)
        }, 5000)
      }
    }
    
    setPathProgress(moveState.pathProgress)
  }

  const handleEnd = () => {
    isDraggingRef.current = false
    setIsDragging(false)
  }

  useBeePathWebInput({
    containerRef,
    onStart: handleStart,
    onMove: handleMove,
    onEnd: handleEnd,
  })

  useEffect(() => {
    return () => {
      if (hideConfettiTimeoutRef.current) {
        clearTimeout(hideConfettiTimeoutRef.current)
      }
    }
  }, [])

  const resetGame = () => {
    const resetState = createBeePathResetState(pathIndex)

    if (hideConfettiTimeoutRef.current) {
      clearTimeout(hideConfettiTimeoutRef.current)
      hideConfettiTimeoutRef.current = null
    }

    beePosRef.current = resetState.beePosition
    isDraggingRef.current = resetState.isDragging
    flowerReachedRef.current = resetState.flowerReached
    gameStartedRef.current = resetState.gameStarted
    gameWonRef.current = resetState.gameWon

    setBeePos(resetState.beePosition)
    setPathProgress(resetState.pathProgress)
    setFlowerReached(resetState.flowerReached)
    setGameWon(resetState.gameWon)
    setShowConfetti(resetState.showConfetti)
    setGameStarted(resetState.gameStarted)
    setPathIndex(resetState.pathIndex)
  }

  return (
    <div className="bee-game" ref={containerRef}>
      <button className="back-button" onClick={onBack}>
        ← Menú
      </button>

      <div className="game-title">
        {!gameStarted && <h2>🧑‍🏫 Arrastra la abeja hacia la flor!</h2>}
        {gameStarted && !gameWon && <h2>🐝 → 🌸</h2>}
        {gameWon && <h2>🎉 GANASTE! 🎉</h2>}
      </div>

      <svg className="path-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C8E6C9" />
            <stop offset={`${pathProgress * 100}%`} stopColor="#4CAF50" />
            <stop offset="100%" stopColor="#C8E6C9" />
          </linearGradient>
        </defs>
        
        <path
          className="path-line"
          d={currentPath.d}
          fill="none"
          stroke="url(#pathGradient)"
          strokeWidth="10"
          strokeLinecap="round"
        />
      </svg>

      <div 
        className={`flower ${flowerReached ? 'reached' : ''}`}
        style={{
          left: `${flowerPos.x * 100}%`,
          top: `${flowerPos.y * 100}%`
        }}
      >
        🌸
      </div>

      <div 
        className={`bee ${isDragging ? 'dragging' : ''}`}
        style={{
          left: `${beePos.x * 100}%`,
          top: `${beePos.y * 100}%`
        }}
      >
        🐝
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pathProgress * 100}%` }} />
      </div>

      {gameWon && (
        <button className="play-again-btn" onClick={resetGame}>
          🔄 Jugar de nuevo
        </button>
      )}

      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={100}
          recycle={false}
          gravity={0.2}
        />
      )}
    </div>
  )
}

export default BeePathGame
