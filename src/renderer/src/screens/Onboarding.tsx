import type { JSX } from 'react'
import { useState } from 'react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { PasswordField } from '../components/PasswordField'
import { TerminalHeader } from '../components/TerminalHeader'
import { useSessionStore } from '../store/useSessionStore'

export function Onboarding(): JSX.Element {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const setScreen = useSessionStore((state) => state.setScreen)
  const setEntries = useSessionStore((state) => state.setEntries)

  async function handleCreate(): Promise<void> {
    setError('')

    if (password.length < 8) {
      setError('A Senha Mestre precisa ter no mínimo 8 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    setLoading(true)
    try {
      await window.api.createVault(password)
      setEntries([])
      setScreen('dashboard')
    } catch {
      setError('Não foi possível criar o cofre. Tente novamente.')
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
            handleCreate()
          }}
        >
          <div>
            <TerminalHeader command="create-vault" />
            <p className="mt-2 text-sm text-text-cream/70">
              Primeiro acesso — crie sua Senha Mestre. Ela não fica salva em lugar nenhum por
              questões de segurança, então guarde-a bem: sem ela, não há como recuperar o cofre.
            </p>
          </div>

          <PasswordField label="Senha Mestre" value={password} onChange={setPassword} />
          <PasswordField
            label="Confirmar Senha Mestre"
            value={confirmPassword}
            onChange={setConfirmPassword}
          />

          {error && <p className="text-sm text-danger">{error}</p>}

          <Button type="submit" disabled={loading}>
            {loading ? 'Criando cofre...' : 'Criar cofre'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
