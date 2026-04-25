import { useState, useEffect, useRef } from 'react'
import Confetti from 'react-confetti'
import './TouchGame.css'
import { createTouchGameRound, TOUCH_TARGET_ANIMAL } from '../features/touch-game/rounds'
import { playSuccessSound, playWrongSound } from '../core/audio/webAudio'
import { useViewportSize } from '../core/browser/useViewportSize'

function TouchGame({ onBack }) {
  const [options, setOptions] = useState([])
  const [correctAnswer, setCorrectAnswer] = useState(TOUCH_TARGET_ANIMAL)
  const [showConfetti, setShowConfetti] = useState(false)
  const [shakeButton, setShakeButton] = useState(null)
  const [correctButton, setCorrectButton] = useState(null)
  const backClickCount = useRef(0)
  const backClickTimer = useRef(null)
  const { width, height } = useViewportSize()

  const generateNewRound = () => {
    const round = createTouchGameRound()
    setOptions(round.options)
    setCorrectAnswer(round.correctAnswer)
    setShowConfetti(false)
    setCorrectButton(null)
  }

  useEffect(() => {
    generateNewRound()
  }, [])

  const handleBack = () => {
    backClickCount.current++
    if (backClickCount.current === 1) {
      backClickTimer.current = setTimeout(() => {
        backClickCount.current = 0
      }, 500)
    } else if (backClickCount.current === 2) {
      clearTimeout(backClickTimer.current)
      backClickCount.current = 0
      onBack()
    }
  }

  const handleOptionClick = (animal) => {
    if (showConfetti) return

    if (animal === correctAnswer) {
      playSuccessSound()
      setCorrectButton(animal)
      setShowConfetti(true)
      setTimeout(() => {
        generateNewRound()
      }, 3000)
    } else {
      playWrongSound()
      setShakeButton(animal)
      setTimeout(() => setShakeButton(null), 500)
    }
  }

  return (
    <div className="touch-game">
      <button className="back-button" onClick={handleBack}>
        ← Menú
      </button>
      
      <h2 className="question">¿Dónde está el perro?</h2>
      
      <div className="options-grid">
        {options.map((animal) => (
          <button
            key={animal}
            className={`option-button ${shakeButton === animal ? 'shake' : ''} ${correctButton === animal ? 'correct' : ''}`}
            onClick={() => handleOptionClick(animal)}
          >
            <span className="option-emoji">{animal}</span>
          </button>
        ))}
      </div>

      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={80}
          recycle={false}
          gravity={0.2}
        />
      )}
    </div>
  )
}

export default TouchGame
