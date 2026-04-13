import { useState, useRef, useEffect } from 'react'
import Confetti from 'react-confetti'
import { useGameConfig } from '../context/GameConfigContext'
import './BeePathGame.css'

const PATHS = [
  { d: "M 10 50 Q 30 50 40 35 Q 50 20 65 35 Q 80 50 90 50", flower: { x: 0.9, y: 0.5 } },
  { d: "M 10 50 Q 35 30 50 50 Q 65 70 90 50", flower: { x: 0.9, y: 0.5 } },
  { d: "M 10 30 Q 40 40 50 30 Q 60 20 90 30", flower: { x: 0.9, y: 0.3 } }
]

function BeePathGame({ onBack }) {
  const { trackGameTime, timerExpired } = useGameConfig()
  
  const [beePos, setBeePos] = useState({ x: 0.1, y: 0.5 })
  const [flowerReached, setFlowerReached] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [pathProgress, setPathProgress] = useState(0)
  const [pathIndex, setPathIndex] = useState(() => Math.floor(Math.random() * PATHS.length))
  
  const containerRef = useRef(null)
  const currentPath = PATHS[pathIndex]
  const flowerPos = currentPath.flower

  useEffect(() => {
    if (gameStarted && !gameWon && !timerExpired) {
      const interval = setInterval(() => {
        trackGameTime('beePath', 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [gameStarted, gameWon, timerExpired, trackGameTime])

  const getEventPos = (e) => {
    const rect = containerRef.current.getBoundingClientRect()
    if (e.touches && e.touches.length > 0) {
      return {
        x: (e.touches[0].clientX - rect.left) / rect.width,
        y: (e.touches[0].clientY - rect.top) / rect.height
      }
    } else if (e.clientX !== undefined) {
      return {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height
      }
    }
    return null
  }

  const handleStart = (clientX, clientY) => {
    if (gameWon || timerExpired) return
    
    const pos = getEventPos({ clientX, clientY })
    if (!pos) return
    
    const distance = Math.sqrt(
      Math.pow(pos.x - beePos.x, 2) + 
      Math.pow(pos.y - beePos.y, 2)
    )
    
    if (distance < 0.15) {
      setIsDragging(true)
      if (!gameStarted) setGameStarted(true)
    }
  }

  const handleMove = (clientX, clientY) => {
    if (!isDragging || gameWon || timerExpired) return
    
    const pos = getEventPos({ clientX, clientY })
    if (!pos) return
    
    const clampedX = Math.max(0.05, Math.min(0.95, pos.x))
    const clampedY = Math.max(0.1, Math.min(0.9, pos.y))
    
    setBeePos({ x: clampedX, y: clampedY })
    
    if (!flowerReached) {
      const distance = Math.sqrt(
        Math.pow(clampedX - flowerPos.x, 2) + 
        Math.pow(clampedY - flowerPos.y, 2)
      )
      
      if (distance < 0.06) {
        setFlowerReached(true)
        setGameWon(true)
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 5000)
      }
    }
    
    const progress = Math.min(1, Math.max(0, (clampedX - 0.1) / 0.7))
    setPathProgress(progress)
  }

  const handleEnd = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    
    const onMouseDown = (e) => handleStart(e.clientX, e.clientY)
    const onMouseMove = (e) => {
      if (isDragging) handleMove(e.clientX, e.clientY)
    }
    const onMouseUp = () => handleEnd()
    
    const onTouchStart = (e) => {
      e.preventDefault()
      handleStart(e.touches[0].clientX, e.touches[0].clientY)
    }
    const onTouchMove = (e) => {
      e.preventDefault()
      if (isDragging) handleMove(e.touches[0].clientX, e.touches[0].clientY)
    }
    const onTouchEnd = () => handleEnd()
    
    container.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    container.addEventListener('touchstart', onTouchStart, { passive: false })
    container.addEventListener('touchmove', onTouchMove, { passive: false })
    container.addEventListener('touchend', onTouchEnd)
    
    return () => {
      container.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      container.removeEventListener('touchstart', onTouchStart)
      container.removeEventListener('touchmove', onTouchMove)
      container.removeEventListener('touchend', onTouchEnd)
    }
  }, [isDragging, gameWon, timerExpired, flowerReached, beePos])

  const resetGame = () => {
    setBeePos({ x: 0.1, y: 0.5 })
    setPathProgress(0)
    setFlowerReached(false)
    setGameWon(false)
    setShowConfetti(false)
    setGameStarted(false)
    setPathIndex(Math.floor(Math.random() * PATHS.length))
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
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={100}
          recycle={false}
          gravity={0.2}
        />
      )}
    </div>
  )
}

export default BeePathGame