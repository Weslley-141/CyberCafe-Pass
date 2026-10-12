import type { JSX } from 'react'
import { useEffect } from 'react'
import { useSessionStore } from './store/useSessionStore'
import { Onboarding } from './screens/Onboarding'
import { Login } from './screens/Login'
import { Dashboard } from './screens/Dashboard'

function App(): JSX.Element {
  const { screen, setScreen } = useSessionStore()

  useEffect(() => {
    window.api.vaultExists().then((exists) => {
      setScreen(exists ? 'login' : 'onboarding')
    })
  }, [setScreen])

  if (screen === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-text-cream/50">Carregando...</p>
      </div>
    )
  }

  if (screen === 'onboarding') return <Onboarding />
  if (screen === 'login') return <Login />
  return <Dashboard />
}

export default App
