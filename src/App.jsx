import { useState, useRef, useEffect } from 'react'
import { GameConfigProvider, useGameConfig } from './context/GameConfigContext'
import Home from './components/Home'
import TouchGame from './components/TouchGame'
import BeePathGame from './components/BeePathGame'
import ParentsPanel from './components/ParentsPanel'
import './App.css'

function AppContent() {
  const { 
    parentsPanelOpen, 
    setParentsPanelOpen, 
    timerExpired,
    timer,
    volume,
    volumeLocked,
    PARENTAL_CODE,
    extendTimer
  } = useGameConfig()
  
  const [currentScreen, setCurrentScreen] = useState('home')
  const [showCodeInput, setShowCodeInput] = useState(false)
  const [codeInput, setCodeInput] = useState('')
  const [codeError, setCodeError] = useState(false)
  const parentsTapRef = useRef(0)
  const parentsTimerRef = useRef(null)
  const [unlockMinutes, setUnlockMinutes] = useState(10)

  useEffect(() => {
    if (volumeLocked) {
      const setVol = () => {
        window.volume = volume / 100
      }
      setVol()
    }
  }, [volume, volumeLocked])

  useEffect(() => {
    if (timerExpired) {
      setShowCodeInput(true)
    }
  }, [timerExpired])

  const handleParentsTap = () => {
    parentsTapRef.current++
    if (parentsTapRef.current === 1) {
      parentsTimerRef.current = setTimeout(() => {
        parentsTapRef.current = 0
      }, 500)
    } else if (parentsTapRef.current === 2) {
      clearTimeout(parentsTimerRef.current)
      parentsTapRef.current = 0
      setShowCodeInput(true)
    }
  }

  const handleCodeSubmit = () => {
    if (codeInput === PARENTAL_CODE) {
      setCodeError(false)
      setCodeInput('')
      if (timerExpired) {
        extendTimer(unlockMinutes)
      } else {
        setShowCodeInput(false)
        setParentsPanelOpen(true)
      }
    } else {
      setCodeError(true)
    }
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'touchGame':
        return <TouchGame onBack={() => setCurrentScreen('home')} />
      case 'beePath':
        return <BeePathGame onBack={() => setCurrentScreen('home')} />
      default:
        return <Home onSelectGame={(game) => setCurrentScreen(game)} />
    }
  }

  return (
    <div className="app">
      <div className="parents-trigger" onClick={handleParentsTap} title="Doble tap para Panel de Padres">
        ⚙️
      </div>
      
      {showCodeInput && (
        <div className="code-modal-overlay">
          <div className="code-modal">
            {timerExpired ? (
              <>
                <h2>⏰ Se terminó el tiempo!</h2>
                <p>Ingresa el código parental para continuar</p>
              </>
            ) : (
              <>
                <h2>🔐 Panel de Padres</h2>
                <p>Ingresa el código para acceder</p>
              </>
            )}
            <input
              type="password"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              placeholder="Código"
              className="code-input"
              maxLength={4}
            />
            {codeError && <p className="code-error">Código incorrecto</p>}
            <button className="code-submit-btn" onClick={handleCodeSubmit}>
              {timerExpired ? '🔓 Desbloquear' : 'Entrar'}
            </button>
            {timerExpired && (
              <>
                <select 
                  className="unlock-select"
                  value={unlockMinutes} 
                  onChange={(e) => setUnlockMinutes(Number(e.target.value))}
                >
                  <option value={5}>5 min</option>
                  <option value={10}>10 min</option>
                  <option value={15}>15 min</option>
                  <option value={30}>30 min</option>
                </select>
                <button 
                  className="code-cancel-btn" 
                  onClick={() => {
                    setShowCodeInput(false)
                    setCurrentScreen('home')
                  }}
                >
                  Volver al menú
                </button>
              </>
            )}
          </div>
        </div>
      )}
      
      {parentsPanelOpen && <ParentsPanel />}
      {renderScreen()}
    </div>
  )
}

function App() {
  return (
    <GameConfigProvider>
      <AppContent />
    </GameConfigProvider>
  )
}

export default App