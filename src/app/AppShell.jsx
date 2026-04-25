import { useEffect, useRef, useState } from 'react'
import { useGameConfig } from '../context/GameConfigContext'
import { APP_SCREENS } from './routes'
import {
  DEFAULT_UNLOCK_MINUTES,
  PARENTAL_CODE,
  UNLOCK_MINUTE_OPTIONS,
} from '../core/config/parental'
import Home from '../components/Home'
import TouchGame from '../components/TouchGame'
import BeePathGame from '../components/BeePathGame'
import FindTheOddOne from '../components/FindTheOddOne'
import ParentsPanel from '../components/ParentsPanel'
import { setWindowVolume } from '../core/browser/window'
import '../App.css'

function AppShell() {
  const {
    parentsPanelOpen,
    setParentsPanelOpen,
    timerExpired,
    volume,
    volumeLocked,
    extendTimer,
  } = useGameConfig()

  const [currentScreen, setCurrentScreen] = useState(APP_SCREENS.home)
  const [showCodeInput, setShowCodeInput] = useState(false)
  const [codeInput, setCodeInput] = useState('')
  const [codeError, setCodeError] = useState(false)
  const [unlockMinutes, setUnlockMinutes] = useState(DEFAULT_UNLOCK_MINUTES)
  const parentsTapRef = useRef(0)
  const parentsTimerRef = useRef(null)

  useEffect(() => {
    if (volumeLocked) {
      setWindowVolume(volume / 100)
    }
  }, [volume, volumeLocked])

  useEffect(() => {
    if (timerExpired) {
      setShowCodeInput(true)
    }
  }, [timerExpired])

  const resetCodeModal = () => {
    setCodeError(false)
    setCodeInput('')
    setShowCodeInput(false)
  }

  const returnHome = () => {
    resetCodeModal()
    setCurrentScreen(APP_SCREENS.home)
  }

  const handleParentsTap = () => {
    parentsTapRef.current += 1

    if (parentsTapRef.current === 1) {
      parentsTimerRef.current = setTimeout(() => {
        parentsTapRef.current = 0
      }, 500)
      return
    }

    if (parentsTapRef.current === 2) {
      clearTimeout(parentsTimerRef.current)
      parentsTapRef.current = 0
      setShowCodeInput(true)
    }
  }

  const handleCodeSubmit = () => {
    if (codeInput !== PARENTAL_CODE) {
      setCodeError(true)
      return
    }

    resetCodeModal()

    if (timerExpired) {
      extendTimer(unlockMinutes)
      return
    }

    setParentsPanelOpen(true)
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case APP_SCREENS.touchGame:
        return <TouchGame onBack={() => setCurrentScreen(APP_SCREENS.home)} />
      case APP_SCREENS.beePath:
        return <BeePathGame onBack={() => setCurrentScreen(APP_SCREENS.home)} />
      case APP_SCREENS.findOddOne:
        return <FindTheOddOne onBack={() => setCurrentScreen(APP_SCREENS.home)} />
      default:
        return <Home onSelectGame={setCurrentScreen} />
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
              onChange={(event) => setCodeInput(event.target.value)}
              placeholder="Código"
              className="code-input"
              maxLength={4}
            />
            {codeError && <p className="code-error">Código incorrecto</p>}
            <button className="code-submit-btn" onClick={handleCodeSubmit}>
              {timerExpired ? '🔓 Desbloquear' : 'Entrar'}
            </button>
            <button className="code-cancel-btn" onClick={returnHome}>
              Cancelar
            </button>

            {timerExpired && (
              <>
                <select
                  className="unlock-select"
                  value={unlockMinutes}
                  onChange={(event) => setUnlockMinutes(Number(event.target.value))}
                >
                  {UNLOCK_MINUTE_OPTIONS.map((minutes) => (
                    <option key={minutes} value={minutes}>
                      {minutes} min
                    </option>
                  ))}
                </select>
                <div className="code-buttons">
                  <button className="code-cancel-btn" onClick={returnHome}>
                    Volver al menú
                  </button>
                  <button className="code-settings-btn" onClick={() => setParentsPanelOpen(true)}>
                    ⚙️ Configuración
                  </button>
                </div>
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

export default AppShell
