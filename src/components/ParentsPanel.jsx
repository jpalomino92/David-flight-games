import { useState } from 'react'
import { useGameConfig } from '../context/GameConfigContext'
import './ParentsPanel.css'

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
  const [extendMinutes, setExtendMinutes] = useState(10)

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatUsage = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    if (mins === 0) return `${secs}s`
    return `${mins}m ${secs}s`
  }

  const usageReport = getUsageReport()
  const gamesReport = Object.keys(usageReport).length > 0 ? Object.entries(usageReport) : []

  const timerOptions = [
    { value: null, label: 'Sin límite' },
    { value: 5, label: '5 min' },
    { value: 10, label: '10 min' },
    { value: 15, label: '15 min' },
    { value: 30, label: '30 min' }
  ]

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
                    <span className="timer-time">{formatTime(timerRemaining)}</span>
                    <button className="timer-stop" onClick={stopTimer}>Detener</button>
                  </div>
                ) : (
                  <span className="timer-inactive">Sin timer activo</span>
                )}
              </div>
              <div className="timer-options">
                {timerOptions.map(opt => (
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
                    <option value={5}>5 min</option>
                    <option value={10}>10 min</option>
                    <option value={15}>15 min</option>
                    <option value={30}>30 min</option>
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
                  <h4>{gameId === 'touchGame' ? '🐶 ¿Dónde está el perro?' : 
                       gameId === 'beePath' ? '🐝 Camino de la abeja' : gameId}</h4>
                  <div className="usage-chart">
                    {days.map(day => (
                      <div key={day.date} className="usage-day">
                        <div 
                          className="usage-bar" 
                          style={{ height: `${Math.min(day.total / 60 * 20, 100)}px` }}
                        />
                        <span className="usage-label">{day.label}</span>
                        <span className="usage-time">{formatUsage(day.total)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ParentsPanel