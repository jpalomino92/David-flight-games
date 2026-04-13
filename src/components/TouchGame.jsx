import { useState, useEffect, useRef } from 'react'
import Confetti from 'react-confetti'
import './TouchGame.css'

const allAnimals = ['🐶', '🐱', '🦊', '🐻', '🐰', '🐼', '🦁', '🐯']

function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function TouchGame({ onBack }) {
  const [options, setOptions] = useState([])
  const [correctAnswer, setCorrectAnswer] = useState('🐶')
  const [showConfetti, setShowConfetti] = useState(false)
  const [shakeButton, setShakeButton] = useState(null)
  const [doubleTapReady, setDoubleTapReady] = useState(false)
  const backClickCount = useRef(0)
  const backClickTimer = useRef(null)

  const generateNewRound = () => {
    const otherAnimals = allAnimals.filter(a => a !== '🐶')
    const shuffledOthers = shuffleArray(otherAnimals).slice(0, 3)
    const roundOptions = shuffleArray(['🐶', ...shuffledOthers])
    setOptions(roundOptions)
    setCorrectAnswer('🐶')
    setShowConfetti(false)
  }

  useEffect(() => {
    generateNewRound()
  }, [])

  const handleBack = () => {
    backClickCount.current++
    if (backClickCount.current === 1) {
      backClickTimer.current = setTimeout(() => {
        backClickCount.current = 0
        setDoubleTapReady(false)
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
      setShowConfetti(true)
      setTimeout(() => {
        generateNewRound()
      }, 3000)
    } else {
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
            className={`option-button ${shakeButton === animal ? 'shake' : ''}`}
            onClick={() => handleOptionClick(animal)}
          >
            <span className="option-emoji">{animal}</span>
          </button>
        ))}
      </div>

      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={80}
          recycle={false}
          gravity={0.2}
        />
      )}
    </div>
  )
}

export default TouchGame