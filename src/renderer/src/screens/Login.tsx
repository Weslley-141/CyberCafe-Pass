import type { JSX } from 'react'
import { useState } from 'react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { PasswordField } from '../components/PasswordField'
import { TerminalHeader } from '../components/TerminalHeader'
import { useSessionStore } from '../store/useSessionStore'

export function Login(): JSX.Element {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const setScreen = useSessionStore((state) => state.setScreen)
  const setEntries = useSessionStore((state) => state.setEntries)

  async function handleUnlock(): Promise<void> {
    setError('')
    setLoading(true)
    try {
      const entries = await window.api.unlockVault(password)
      setEntries(entries)
      setScreen('dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao destrancar o cofre.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <Card className="w-full max-w-sm">
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            handleUnlock()
          }}
        >
          <div>
            <TerminalHeader command="unlock-vault" />
            <p className="mt-2 text-sm text-text-cream/70">
              Digite sua Senha Mestre para destrancar o cofre.
            </p>
          </div>

          <PasswordField label="Senha Mestre" value={password} onChange={setPassword} />

          {error && <p className="text-sm text-danger">{error}</p>}

          <Button type="submit" disabled={loading}>
            {loading ? 'Destrancando...' : 'Destrancar Cofre'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
