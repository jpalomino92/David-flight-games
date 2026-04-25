import { GameConfigProvider } from './context/GameConfigContext'
import AppShell from './app/AppShell'

function App() {
  return (
    <GameConfigProvider>
      <AppShell />
    </GameConfigProvider>
  )
}

export default App
