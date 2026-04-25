import type { PropsWithChildren } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'

import { mobileStorageMeta, readJsonValue, writeJsonValue } from '../../services/storage/mobileStorage'
import { MOBILE_STORAGE_KEY } from '../../services/storage/storageKeys'
import type { MobileSettingsConfig, MobileSettingsState } from '../../types/settings'

interface SettingsStoreValue {
  setAudioEnabled: (enabled: boolean) => void
  setHapticsEnabled: (enabled: boolean) => void
  state: MobileSettingsState
}

const defaultSettingsConfig: MobileSettingsConfig = {
  audioEnabled: true,
  hapticsEnabled: true,
}

const defaultSettingsState: MobileSettingsState = {
  config: defaultSettingsConfig,
  isHydrated: false,
  storageMode: mobileStorageMeta.persistenceMode,
}

const SettingsStoreContext = createContext<SettingsStoreValue | null>(null)

export function SettingsStoreProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<MobileSettingsState>(defaultSettingsState)

  useEffect(() => {
    let isMounted = true

    async function hydrateSettings() {
      const config = await readJsonValue(MOBILE_STORAGE_KEY.SETTINGS, defaultSettingsConfig)

      if (!isMounted) {
        return
      }

      setState({
        config,
        isHydrated: true,
        storageMode: mobileStorageMeta.persistenceMode,
      })
    }

    void hydrateSettings()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!state.isHydrated) {
      return
    }

    void writeJsonValue(MOBILE_STORAGE_KEY.SETTINGS, state.config)
  }, [state.config, state.isHydrated])

  const value: SettingsStoreValue = {
    setAudioEnabled(enabled) {
      setState((currentState) => ({
        ...currentState,
        config: {
          ...currentState.config,
          audioEnabled: enabled,
        },
      }))
    },
    setHapticsEnabled(enabled) {
      setState((currentState) => ({
        ...currentState,
        config: {
          ...currentState.config,
          hapticsEnabled: enabled,
        },
      }))
    },
    state,
  }

  return <SettingsStoreContext.Provider value={value}>{children}</SettingsStoreContext.Provider>
}

export function useSettingsStore() {
  const context = useContext(SettingsStoreContext)

  if (!context) {
    throw new Error('useSettingsStore must be used within SettingsStoreProvider')
  }

  return context
}
