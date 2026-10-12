import type { JSX } from 'react'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface PasswordFieldProps {
  label: string
  value: string
  onChange?: (value: string) => void
  readOnly?: boolean
}

export function PasswordField({
  label,
  value,
  onChange,
  readOnly
}: PasswordFieldProps): JSX.Element {
  const [revealed, setRevealed] = useState(false)

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-text-cream/70">{label}</label>
      <div className="flex items-center gap-2 rounded-lg border border-text-cream/20 bg-bg-dark px-3 py-2 transition-shadow focus-within:border-accent-cyan focus-within:shadow-[0_0_0_3px_rgba(0,240,255,0.15)]">
        <input
          type={revealed ? 'text' : 'password'}
          value={value}
          readOnly={readOnly}
          onChange={(e) => onChange?.(e.target.value)}
          className="flex-1 bg-transparent font-mono-vibe text-text-cream outline-none"
        />
        <button
          type="button"
          onMouseDown={() => setRevealed(true)}
          onMouseUp={() => setRevealed(false)}
          onMouseLeave={() => setRevealed(false)}
          className="text-text-cream/50 hover:text-accent-orange"
          aria-label={revealed ? 'Ocultar senha' : 'Segurar para revelar senha'}
        >
          {revealed ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  )
}
