import type { JSX } from 'react'
import { useState } from 'react'
import { Pencil, Trash2, Eye, EyeOff, ExternalLink } from 'lucide-react'
import type { PasswordEntry } from '../../../../types'
import { getCategoryMeta } from '../lib/categories'

interface EntryCardProps {
  entry: PasswordEntry
  onEdit: (entry: PasswordEntry) => void
  onDelete: (id: string) => void
}

export function EntryCard({ entry, onEdit, onDelete }: EntryCardProps): JSX.Element {
  const [revealed, setRevealed] = useState(false)
  const { icon: CategoryIcon, colorClass, glowClass } = getCategoryMeta(entry.category)

  return (
    <div className="group flex items-center gap-4 rounded-xl border border-text-cream/10 bg-linear-to-b from-card to-bg-dark/40 p-4 shadow-md transition-all hover:-translate-y-0.5 hover:border-accent-orange/30 hover:shadow-[0_0_20px_rgba(255,122,0,0.15)]">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-bg-dark ${colorClass} ${glowClass}`}
      >
        <CategoryIcon size={20} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-semibold text-text-cream">{entry.title}</p>
          {entry.url ? (
            <a
              href={entry.url}
              target="_blank"
              rel="noreferrer"
              className="text-text-cream/40 hover:text-accent-cyan"
              title={entry.url}
            >
              <ExternalLink size={14} />
            </a>
          ) : null}
        </div>
        <p className="truncate text-sm text-text-cream/60">{entry.username}</p>

        <div className="mt-2 flex h-5 items-center gap-2">
          {revealed ? (
            <span
              key="revealed"
              className="decrypt-in font-mono-vibe text-sm tracking-wide text-text-cream"
            >
              {entry.passwordEncrypted}
            </span>
          ) : (
            <span className="select-none font-mono-vibe text-sm tracking-widest text-text-cream/70">
              ••••••••••••
            </span>
          )}
          <button
            type="button"
            onMouseDown={() => setRevealed(true)}
            onMouseUp={() => setRevealed(false)}
            onMouseLeave={() => setRevealed(false)}
            className="text-text-cream/40 hover:text-accent-cyan"
            aria-label={revealed ? 'Ocultar senha' : 'Segurar para revelar senha'}
          >
            {revealed ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          onClick={() => onEdit(entry)}
          className="rounded-md p-2 text-text-cream/50 hover:bg-bg-dark hover:text-accent-orange"
          aria-label="Editar"
        >
          <Pencil size={18} />
        </button>
        <button
          type="button"
          onClick={() => onDelete(entry.id)}
          className="rounded-md p-2 text-text-cream/50 hover:bg-bg-dark hover:text-danger"
          aria-label="Excluir"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  )
}
