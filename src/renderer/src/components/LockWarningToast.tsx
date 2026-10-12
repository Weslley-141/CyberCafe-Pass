import type { JSX } from 'react'
import { AlertTriangle } from 'lucide-react'

interface LockWarningToastProps {
  onDismiss: () => void
}

export function LockWarningToast({ onDismiss }: LockWarningToastProps): JSX.Element {
  return (
    <div className="fixed bottom-6 right-6 flex items-center gap-3 rounded-lg border border-accent-orange/40 bg-card px-4 py-3 shadow-lg">
      <AlertTriangle size={20} className="shrink-0 text-accent-orange" />
      <p className="text-sm text-text-cream">
        Seu cofre vai trancar em 30s por inatividade. Mova o mouse ou clique em algo pra continuar.
      </p>
      <button
        type="button"
        onClick={onDismiss}
        className="ml-2 text-text-cream/50 hover:text-text-cream"
        aria-label="Dispensar aviso"
      >
        ✕
      </button>
    </div>
  )
}
