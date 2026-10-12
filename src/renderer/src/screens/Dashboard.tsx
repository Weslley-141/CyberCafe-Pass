import type { JSX } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { Plus, LogOut, Search, Download, Upload } from 'lucide-react'
import { useSessionStore } from '../store/useSessionStore'
import { useUIStore } from '../store/useUIStore'
import { CafeModeToggle } from '../components/CafeModeToggle'
import { EntryCard } from '../components/EntryCard'
import { EntryForm } from '../components/EntryForm'
import { Button } from '../components/Button'
import { LockWarningToast } from '../components/LockWarningToast'
import { TerminalHeader } from '../components/TerminalHeader'
import type { PasswordEntry } from '../../../../types'

export function Dashboard(): JSX.Element {
  const { entries, setEntries, setScreen } = useSessionStore()
  const cafeMode = useUIStore((state) => state.cafeMode)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('Todas')
  const [editingEntry, setEditingEntry] = useState<PasswordEntry | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showLockWarning, setShowLockWarning] = useState(false)
  const [windowBlurred, setWindowBlurred] = useState(false)

  useEffect(() => {
    const unsubscribeWarning = window.api.onLockWarning(() => setShowLockWarning(true))
    const unsubscribeLocked = window.api.onAutoLocked(() => {
      setEntries([])
      setScreen('login')
    })
    const unsubscribeBlur = window.api.onWindowBlur(() => setWindowBlurred(true))
    const unsubscribeFocus = window.api.onWindowFocus(() => setWindowBlurred(false))

    return () => {
      unsubscribeWarning()
      unsubscribeLocked()
      unsubscribeBlur()
      unsubscribeFocus()
    }
  }, [setEntries, setScreen])

  const categories = useMemo(() => {
    const unique = new Set(entries.map((e) => e.category))
    return ['Todas', ...Array.from(unique)]
  }, [entries])

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesSearch =
        entry.title.toLowerCase().includes(search.toLowerCase()) ||
        entry.username.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = categoryFilter === 'Todas' || entry.category === categoryFilter
      return matchesSearch && matchesCategory
    })
  }, [entries, search, categoryFilter])

  function openNewEntry(): void {
    setEditingEntry(null)
    setShowForm(true)
  }

  function openEditEntry(entry: PasswordEntry): void {
    setEditingEntry(entry)
    setShowForm(true)
  }

  async function handleSave(
    data: Omit<PasswordEntry, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<void> {
    if (editingEntry) {
      await window.api.updateEntry(editingEntry.id, data)
      setEntries(
        entries.map((e) =>
          e.id === editingEntry.id ? { ...e, ...data, updatedAt: new Date().toISOString() } : e
        )
      )
    } else {
      const created = await window.api.createEntry(data)
      setEntries([...entries, created])
    }
    setShowForm(false)
    setEditingEntry(null)
  }

  async function handleDelete(id: string): Promise<void> {
    await window.api.deleteEntry(id)
    setEntries(entries.filter((e) => e.id !== id))
  }

  async function handleLock(): Promise<void> {
    await window.api.lockVault()
    setEntries([])
    setScreen('login')
  }

  async function handleExport(): Promise<void> {
    const result = await window.api.exportVault()
    if (result.success) {
      alert(`Backup exportado com sucesso!\n${result.filePath}`)
    }
  }

  async function handleImport(): Promise<void> {
    const confirmed = confirm(
      'Importar um backup vai substituir o cofre atual. Você vai precisar da Senha Mestre do backup para acessá-lo depois. Deseja continuar?'
    )
    if (!confirmed) return

    const result = await window.api.importVault()
    if (result.success) {
      setEntries([])
      setScreen('login')
    } else if (result.error) {
      alert(result.error)
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <TerminalHeader command="list-entries" />
          <div className="flex items-center gap-2">
            <CafeModeToggle />
            <button
              type="button"
              onClick={handleExport}
              className="text-text-cream/50 hover:text-accent-green"
              aria-label="Exportar backup"
              title="Exportar backup"
            >
              <Download size={20} />
            </button>
            <button
              type="button"
              onClick={handleImport}
              className="text-text-cream/50 hover:text-accent-orange"
              aria-label="Importar backup"
              title="Importar backup"
            >
              <Upload size={20} />
            </button>
            <button
              type="button"
              onClick={handleLock}
              className="text-text-cream/50 hover:text-danger"
              aria-label="Bloquear cofre"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-text-cream/20 bg-card px-3 py-2">
            <Search size={16} className="text-text-cream/50" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por título ou usuário..."
              className="flex-1 bg-transparent text-text-cream outline-none"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-text-cream/20 bg-card px-3 py-2 text-text-cream outline-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <Button onClick={openNewEntry} className="flex w-fit items-center gap-2">
          <Plus size={18} /> Nova entrada
        </Button>

        <div className="relative flex flex-col gap-3">
          {filteredEntries.length === 0 && (
            <p className="text-center text-text-cream/50">Nenhuma entrada encontrada.</p>
          )}
          <div
            className={`flex flex-col gap-3 transition-all duration-300 ${
              cafeMode && windowBlurred ? 'pointer-events-none blur-xl' : ''
            }`}
          >
            {filteredEntries.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onEdit={openEditEntry}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {cafeMode && windowBlurred && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <p className="rounded-lg bg-bg-dark/80 px-4 py-2 font-mono-vibe text-sm text-accent-cyan">
                Modo Cafeteria ativo — conteúdo oculto
              </p>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <EntryForm
          initialData={editingEntry}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setEditingEntry(null)
          }}
        />
      )}

      {showLockWarning && <LockWarningToast onDismiss={() => setShowLockWarning(false)} />}
    </div>
  )
}
