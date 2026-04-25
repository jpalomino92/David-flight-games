import { useState } from 'react'
import { useGameConfig } from '../context/GameConfigContext'
import './ParentsPanel.css'
import { TIMER_OPTIONS, DEFAULT_UNLOCK_MINUTES, UNLOCK_MINUTE_OPTIONS } from '../core/config/parental'
import { formatDurationShort, formatSecondsAsClock } from '../core/utils/formatters'
import { getGameLabel } from '../features/home/gameCatalog'

function ParentsPanel() {
  const {
    timer,
    timerRemaining,
    volume,
    setVolume,
    volumeLocked,
    setVolumeLocked,
    setParentsPanelOpen,
    startTimer,
    stopTimer,
    extendTimer,
    getUsageReport
  } = useGameConfig()

  const [activeTab, setActiveTab] = useState('settings')
  const [extendMinutes, setExtendMinutes] = useState(DEFAULT_UNLOCK_MINUTES)

  const usageReport = getUsageReport()
  const gamesReport = Object.keys(usageReport).length > 0 ? Object.entries(usageReport) : []

  return (
    <div className="parents-panel-overlay">
      <div className="parents-panel">
        <div className="parents-header">
          <h2>Panel de Padres</h2>
          <button className="close-btn" onClick={() => setParentsPanelOpen(false)}>✕</button>
        </div>

        <div className="parents-tabs">
          <button 
            className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Configuración
          </button>
          <button 
            className={`tab-btn ${activeTab === 'usage' ? 'active' : ''}`}
            onClick={() => setActiveTab('usage')}
          >
            📊 Uso
          </button>
        </div>

        {activeTab === 'settings' && (
          <div className="settings-content">
            <div className="setting-section">
              <h3>⏱️ Temporizador</h3>
              <div className="timer-display">
                {timerRemaining !== null ? (
                  <div className="timer-active">
                    <span className="timer-time">{formatSecondsAsClock(timerRemaining)}</span>
                    <button className="timer-stop" onClick={stopTimer}>Detener</button>
                  </div>
                ) : (
                  <span className="timer-inactive">Sin timer activo</span>
                )}
              </div>
              <div className="timer-options">
                {TIMER_OPTIONS.map(opt => (
                  <button
                    key={opt.value ?? 'none'}
                    className={`timer-option ${timer === opt.value ? 'active' : ''}`}
                    onClick={() => startTimer(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="setting-section">
              <h3>🔊 Volumen</h3>
              <div className="volume-control">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => !volumeLocked && setVolume(Number(e.target.value))}
                  disabled={volumeLocked}
                  className="volume-slider"
                />
                <span className="volume-value">{volume}%</span>
              </div>
              <label className="lock-checkbox">
                <input
                  type="checkbox"
                  checked={volumeLocked}
                  onChange={(e) => setVolumeLocked(e.target.checked)}
                />
                🔒 Bloquear volumen
              </label>
            </div>

            {timerRemaining !== null && (
              <div className="setting-section">
                <h3>⏰ Extender tiempo</h3>
                <div className="extend-options">
                  <select 
                    value={extendMinutes} 
                    onChange={(e) => setExtendMinutes(Number(e.target.value))}
                    className="extend-select"
                  >
                    {UNLOCK_MINUTE_OPTIONS.map((minutes) => (
                      <option key={minutes} value={minutes}>{minutes} min</option>
                    ))}
                  </select>
                  <button 
                    className="extend-btn"
                    onClick={() => extendTimer(extendMinutes)}
                  >
                    + Agregar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'usage' && (
          <div className="usage-content">
            {gamesReport.length === 0 ? (
              <p className="no-data">No hay datos de uso aún</p>
            ) : (
              gamesReport.map(([gameId, days]) => (
                <div key={gameId} className="game-usage">
                  <h4>{getGameLabel(gameId)}</h4>
                  <div className="usage-chart">
                    {days.map(day => (
                      <div key={day.date} className="usage-day">
                        <div 
                           className="usage-bar" 
                           style={{ height: `${Math.min(day.total / 60 * 20, 100)}px` }}
                         />
                        <span className="usage-label">{day.label}</span>
                        <span className="usage-time">{formatDurationShort(day.total)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        
        <button 
          className="exit-btn"
          onClick={() => setParentsPanelOpen(false)}
        >
          ❌ Salir
        </button>
      </div>
    </div>
  )
}

export default ParentsPanel
