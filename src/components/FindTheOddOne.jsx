import { useState, useRef } from 'react'
import Confetti from 'react-confetti'
import './FindTheOddOne.css'
import {
  FIND_ODD_ONE_TOTAL_ROUNDS,
  generateFindOddOneRound,
} from '../features/find-the-odd-one/rounds'
import { playSuccessSound, playWrongSound } from '../core/audio/webAudio'
import { useViewportSize } from '../core/browser/useViewportSize'

function FindTheOddOne({ onBack }) {
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [currentRound, setCurrentRound] = useState(() => generateFindOddOneRound())
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const confettiRef = useRef(null)
  const { width, height } = useViewportSize()

  const handleSelect = (index) => {
    if (disabled) return
    
    setDisabled(true)
    setSelectedIndex(index)
    
    const correct = index === currentRound.oddOneIndex
    
    if (correct) {
      setIsCorrect(true)
      setScore(s => s + 1)
      playSuccessSound()
      setShowConfetti(true)

      setTimeout(() => {
        setShowConfetti(false)
        if (round + 1 >= FIND_ODD_ONE_TOTAL_ROUNDS) {
          setGameComplete(true)
        } else {
          setRound(r => r + 1)
          setCurrentRound(generateFindOddOneRound())
          setSelectedIndex(null)
          setIsCorrect(null)
          setDisabled(false)
        }
      }, 1500)
    } else {
      setIsCorrect(false)
      playWrongSound()
      
      setTimeout(() => {
        setSelectedIndex(null)
        setIsCorrect(null)
        setDisabled(false)
      }, 500)
    }
  }

  const restartGame = () => {
    setRound(0)
    setScore(0)
    setCurrentRound(generateFindOddOneRound())
    setSelectedIndex(null)
    setIsCorrect(null)
    setShowConfetti(false)
    setGameComplete(false)
    setDisabled(false)
  }

  const getButtonClass = (index) => {
    let className = 'odd-option-button'
    if (selectedIndex === index) {
      if (isCorrect === true) {
        className += ' correct'
      } else if (isCorrect === false) {
        className += ' wrong'
      }
    }
    return className
  }

  if (gameComplete) {
    return (
      <div className="find-odd-one">
        <div className="game-complete">
          <h2 className="complete-title">🎉 Felicitaciones! 🎉</h2>
          <p className="complete-score">
            Acertaste {score} de {FIND_ODD_ONE_TOTAL_ROUNDS}!
          </p>
          <div className="complete-stars">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`star ${i < score ? 'filled' : ''}`}>
                ⭐
              </span>
            ))}
          </div>
          <button className="play-again-button" onClick={restartGame}>
            Jugar de nuevo
          </button>
          <button className="back-button" onClick={onBack}>
            Volver al menú
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="find-odd-one">
      {showConfetti && (
        <Confetti
          ref={confettiRef}
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.2}
        />
      )}
      
      <button className="back-button" onClick={onBack}>
        ⬅️ Volver
      </button>
      
      <div className="game-header">
        <h2 className="game-question">🔍 Cuál es diferente?</h2>
        <div className="game-progress">
          <span>Ronda {round + 1} de {FIND_ODD_ONE_TOTAL_ROUNDS}</span>
        </div>
      </div>
      
      <div className="options-grid">
        {currentRound.options.map((image, index) => (
          <button
            key={`${round}-${index}`}
            className={getButtonClass(index)}
            onClick={() => handleSelect(index)}
            disabled={disabled}
          >
            <img 
              src={image.src} 
              alt={image.name}
              className="odd-option-image"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export default FindTheOddOne
