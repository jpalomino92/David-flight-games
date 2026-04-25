import type { StoragePersistenceMode } from '../services/storage/mobileStorage'

export interface ParentalControlsConfig {
  gateEnabled: boolean
  lockedGameIds: string[]
}

export interface ParentalControlsState {
  config: ParentalControlsConfig
  isHydrated: boolean
  sessionUnlocked: boolean
  storageMode: StoragePersistenceMode
}
