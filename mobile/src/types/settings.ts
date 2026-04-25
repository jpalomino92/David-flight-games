import type { StoragePersistenceMode } from '../services/storage/mobileStorage'

export interface MobileSettingsConfig {
  audioEnabled: boolean
  hapticsEnabled: boolean
}

export interface MobileSettingsState {
  config: MobileSettingsConfig
  isHydrated: boolean
  storageMode: StoragePersistenceMode
}
