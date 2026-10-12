import type { JSX } from 'react'
import { useState } from 'react'
import { Card } from './Card'
import { Button } from './Button'
import { Input } from './Input'
import { PasswordField } from './PasswordField'
import { CATEGORY_OPTIONS, normalizeCategory } from '../lib/categories'
import type { PasswordEntry } from '../../../../types'

interface EntryFormProps {
  initialData: PasswordEntry | null
  onSave: (data: Omit<PasswordEntry, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  onCancel: () => void
}

export function EntryForm({ initialData, onSave, onCancel }: EntryFormProps): JSX.Element {
  const [title, setTitle] = useState(initialData?.title ?? '')
  // Entradas antigas (categoria em texto livre) caem em "Outros" em vez de quebrar o seletor
  const [category, setCategory] = useState<string>(normalizeCategory(initialData?.category))
  const [username, setUsername] = useState(initialData?.username ?? '')
  const [password, setPassword] = useState(initialData?.passwordEncrypted ?? '')
  const [url, setUrl] = useState(initialData?.url ?? '')
  const [notes, setNotes] = useState(initialData?.notes ?? '')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(): Promise<void> {
    setError('')

    if (!title.trim() || !username.trim() || !password.trim()) {
      setError('Título, usuário e senha são obrigatórios.')
      return
    }

    setSaving(true)
    try {
      await onSave({
        title: title.trim(),
        category,
        username: username.trim(),
        passwordEncrypted: password,
        url: url.trim() || undefined,
        notes: notes.trim() || undefined
      })
    } catch {
      setError('Não foi possível salvar. Tente novamente.')
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 p-4">
      <Card className="flex max-h-full w-full max-w-sm flex-col gap-4 overflow-y-auto">
        <h2 className="text-xl font-bold text-accent-orange">
          {initialData ? 'Editar entrada' : 'Nova entrada'}
        </h2>

        <Input label="Título" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />

        <div className="flex flex-col gap-1">
          <label htmlFor="category" className="text-sm text-text-cream/70">
            Categoria
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-text-cream/20 bg-bg-dark px-3 py-2 text-text-cream outline-none focus:border-accent-cyan"
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Usuário"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <PasswordField label="Senha" value={password} onChange={setPassword} />
        <Input
          label="URL (opcional)"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Input
          label="Notas (opcional)"
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {error && <p className="text-sm text-danger">{error}</p>}

        <div className="flex gap-3">
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
          <Button variant="secondary" onClick={onCancel} disabled={saving}>
            Cancelar
          </Button>
        </div>
      </Card>
    </div>
  )
}
