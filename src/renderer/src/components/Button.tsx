import type { ButtonHTMLAttributes, JSX, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary'
}

export function Button({
  children,
  variant = 'primary',
  className = '',
  ...rest
}: ButtonProps): JSX.Element {
  const base = 'rounded-lg px-4 py-2 font-semibold transition-all cursor-pointer'
  const variants = {
    primary:
      'bg-accent-orange text-bg-dark hover:opacity-90 hover:shadow-[0_0_16px_rgba(255,122,0,0.5)]',
    secondary:
      'bg-transparent border border-accent-green text-accent-green hover:bg-accent-green/10 hover:shadow-[0_0_16px_rgba(116,163,125,0.35)]'
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  )
}
