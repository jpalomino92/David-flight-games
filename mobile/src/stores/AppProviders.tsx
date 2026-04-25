import type { PropsWithChildren } from 'react'

import { ParentalControlsStoreProvider } from './parental-controls/ParentalControlsStoreProvider'
import { SettingsStoreProvider } from './settings/SettingsStoreProvider'
import { StatsStoreProvider } from './stats/StatsStoreProvider'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <SettingsStoreProvider>
      <StatsStoreProvider>
        <ParentalControlsStoreProvider>{children}</ParentalControlsStoreProvider>
      </StatsStoreProvider>
    </SettingsStoreProvider>
  )
}
