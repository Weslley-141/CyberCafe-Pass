import { Wallet, User, Briefcase, Tag, type LucideIcon } from 'lucide-react'

export const CATEGORY_OPTIONS = ['Finanças', 'Pessoal', 'Trabalho', 'Outros'] as const
export type CategoryOption = (typeof CATEGORY_OPTIONS)[number]

interface CategoryMeta {
  icon: LucideIcon
  colorClass: string
  glowClass: string
}

const CATEGORY_MAP: Record<string, CategoryMeta> = {
  Finanças: {
    icon: Wallet,
    colorClass: 'text-accent-green',
    glowClass: 'shadow-[0_0_10px_rgba(116,163,125,0.45)]'
  },
  Pessoal: {
    icon: User,
    colorClass: 'text-accent-orange',
    glowClass: 'shadow-[0_0_10px_rgba(255,122,0,0.45)]'
  },
  Trabalho: {
    icon: Briefcase,
    colorClass: 'text-accent-cyan',
    glowClass: 'shadow-[0_0_10px_rgba(0,240,255,0.45)]'
  },
  Outros: {
    icon: Tag,
    colorClass: 'text-text-cream/60',
    glowClass: ''
  }
}

/** Retorna ícone, cor e glow da categoria. Categorias antigas (texto livre) caem em "Outros". */
export function getCategoryMeta(category: string): CategoryMeta {
  return CATEGORY_MAP[category] ?? CATEGORY_MAP['Outros']
}

/** Garante que o valor é uma categoria válida; qualquer outra coisa vira "Outros". */
export function normalizeCategory(category: string | undefined): CategoryOption {
  return CATEGORY_OPTIONS.includes(category as CategoryOption)
    ? (category as CategoryOption)
    : 'Outros'
}
