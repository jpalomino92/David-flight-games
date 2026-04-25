import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { PARENTAL_CODE, USAGE_STATS_STORAGE_KEY } from '../core/config/parental'
import { buildUsageReport } from '../core/usage/reporting'
import { readStorageJson, writeStorageJson } from '../core/browser/storage'

const GameConfigContext = createContext()

export function GameConfigProvider({ children }) {
  const [timer, setTimer] = useState(null)
  const [timerRemaining, setTimerRemaining] = useState(null)
  const [timerExpired, setTimerExpired] = useState(false)
  const [volume, setVolume] = useState(80)
  const [volumeLocked, setVolumeLocked] = useState(false)
  const [parentsPanelOpen, setParentsPanelOpen] = useState(false)
  const [usageStats, setUsageStats] = useState(() => readStorageJson(USAGE_STATS_STORAGE_KEY, {}))
  
  const timerIntervalRef = useRef(null)
  const activeGameRef = useRef(null)

  useEffect(() => {
    writeStorageJson(USAGE_STATS_STORAGE_KEY, usageStats)
  }, [usageStats])

  const startTimer = (minutes) => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }
    
    if (minutes === null) {
      setTimer(null)
      setTimerRemaining(null)
      setTimerExpired(false)
      return
    }
    
    setTimer(minutes)
    setTimerRemaining(minutes * 60)
    setTimerExpired(false)
    
    timerIntervalRef.current = setInterval(() => {
      setTimerRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current)
          timerIntervalRef.current = null
          setTimerExpired(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const stopTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
    }
    setTimer(null)
    setTimerRemaining(null)
    setTimerExpired(false)
  }

  const extendTimer = (minutes) => {
    setTimerRemaining(prev => prev + minutes * 60)
    setTimerExpired(false)
  }

  const trackGameTime = (gameId, seconds) => {
    const today = new Date().toISOString().split('T')[0]
    setUsageStats(prev => ({
      ...prev,
      [gameId]: {
        timePlayed: (prev[gameId]?.timePlayed || 0) + seconds,
        lastPlayed: today,
        dailyStats: {
          ...prev[gameId]?.dailyStats,
          [today]: (prev[gameId]?.dailyStats?.[today] || 0) + seconds
        }
      }
    }))
  }

  const getUsageReport = () => {
    return buildUsageReport(usageStats)
  }

  const value = {
    timer,
    timerRemaining,
    timerExpired,
    volume,
    setVolume,
    volumeLocked,
    setVolumeLocked,
    parentsPanelOpen,
    setParentsPanelOpen,
    usageStats,
    startTimer,
    stopTimer,
    extendTimer,
    trackGameTime,
    getUsageReport,
    PARENTAL_CODE,
    activeGameRef
  }

  return (
    <GameConfigContext.Provider value={value}>
      {children}
    </GameConfigContext.Provider>
  )
}

export const useGameConfig = () => useContext(GameConfigContext)
