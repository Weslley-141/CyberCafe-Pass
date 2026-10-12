import type { JSX, ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps): JSX.Element {
  return (
    <div
      className={`rounded-xl border border-text-cream/10 bg-linear-to-b from-card to-bg-dark/60 p-6 shadow-lg shadow-black/40 ${className}`}
    >
      {children}
    </div>
  )
}
