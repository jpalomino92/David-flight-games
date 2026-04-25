import type { PropsWithChildren } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'

import { mobileStorageMeta, readJsonValue, writeJsonValue } from '../../services/storage/mobileStorage'
import { MOBILE_STORAGE_KEY } from '../../services/storage/storageKeys'
import type { ParentalControlsConfig, ParentalControlsState } from '../../types/parental-controls'

interface ParentalControlsStoreValue {
  endUnlockedSession: () => void
  isGameLocked: (gameId: string) => boolean
  setGateEnabled: (enabled: boolean) => void
  state: ParentalControlsState
  toggleGameLock: (gameId: string) => void
  unlockSession: () => void
}

const defaultParentalControlsConfig: ParentalControlsConfig = {
  gateEnabled: false,
  lockedGameIds: [],
}

const defaultParentalControlsState: ParentalControlsState = {
  config: defaultParentalControlsConfig,
  isHydrated: false,
  sessionUnlocked: false,
  storageMode: mobileStorageMeta.persistenceMode,
}

const ParentalControlsStoreContext = createContext<ParentalControlsStoreValue | null>(null)

export function ParentalControlsStoreProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<ParentalControlsState>(defaultParentalControlsState)

  useEffect(() => {
    let isMounted = true

    async function hydrateParentalControls() {
      const config = await readJsonValue(
        MOBILE_STORAGE_KEY.PARENTAL_CONTROLS,
        defaultParentalControlsConfig,
      )

      if (!isMounted) {
        return
      }

      setState({
        config,
        isHydrated: true,
        sessionUnlocked: false,
        storageMode: mobileStorageMeta.persistenceMode,
      })
    }

    void hydrateParentalControls()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!state.isHydrated) {
      return
    }

    void writeJsonValue(MOBILE_STORAGE_KEY.PARENTAL_CONTROLS, state.config)
  }, [state.config, state.isHydrated])

  const value: ParentalControlsStoreValue = {
    endUnlockedSession() {
      setState((currentState) => ({
        ...currentState,
        sessionUnlocked: false,
      }))
    },
    isGameLocked(gameId) {
      if (!state.config.gateEnabled || state.sessionUnlocked) {
        return false
      }

      return state.config.lockedGameIds.includes(gameId)
    },
    setGateEnabled(enabled) {
      setState((currentState) => ({
        ...currentState,
        config: {
          ...currentState.config,
          gateEnabled: enabled,
        },
        sessionUnlocked: enabled ? currentState.sessionUnlocked : false,
      }))
    },
    state,
    toggleGameLock(gameId) {
      setState((currentState) => {
        const isLocked = currentState.config.lockedGameIds.includes(gameId)

        return {
          ...currentState,
          config: {
            ...currentState.config,
            lockedGameIds: isLocked
              ? currentState.config.lockedGameIds.filter((lockedGameId) => lockedGameId !== gameId)
              : [...currentState.config.lockedGameIds, gameId],
          },
        }
      })
    },
    unlockSession() {
      setState((currentState) => ({
        ...currentState,
        sessionUnlocked: true,
      }))
    },
  }

  return (
    <ParentalControlsStoreContext.Provider value={value}>
      {children}
    </ParentalControlsStoreContext.Provider>
  )
}

export function useParentalControlsStore() {
  const context = useContext(ParentalControlsStoreContext)

  if (!context) {
    throw new Error('useParentalControlsStore must be used within ParentalControlsStoreProvider')
  }

  return context
}
