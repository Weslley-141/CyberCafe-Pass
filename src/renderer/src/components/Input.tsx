import type { InputHTMLAttributes, JSX } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function Input({ label, id, className = '', ...rest }: InputProps): JSX.Element {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm text-text-cream/70">
        {label}
      </label>
      <input
        id={id}
        className={`rounded-lg border border-text-cream/20 bg-bg-dark px-3 py-2 text-text-cream outline-none transition-shadow focus:border-accent-cyan focus:shadow-[0_0_0_3px_rgba(0,240,255,0.15)] ${className}`}
        {...rest}
      />
    </div>
  )
}
