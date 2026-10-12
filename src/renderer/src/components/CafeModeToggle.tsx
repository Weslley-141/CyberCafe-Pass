import type { JSX } from 'react'
import { Coffee } from 'lucide-react'
import { useUIStore } from '../store/useUIStore'

export function CafeModeToggle(): JSX.Element {
  const { cafeMode, toggleCafeMode } = useUIStore()

  return (
    <button
      type="button"
      onClick={toggleCafeMode}
      title="Quando ativo, a lista de senhas é borrada sempre que esta janela perde o foco"
      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
        cafeMode ? 'bg-accent-green text-bg-dark' : 'bg-card text-text-cream/70'
      }`}
    >
      <Coffee size={16} />
      Modo Cafeteria {cafeMode ? 'ativo' : 'inativo'}
    </button>
  )
}
