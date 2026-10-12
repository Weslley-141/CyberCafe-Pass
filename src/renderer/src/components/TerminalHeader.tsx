import type { JSX } from 'react'

interface TerminalHeaderProps {
  command: string
}

export function TerminalHeader({ command }: TerminalHeaderProps): JSX.Element {
  return (
    <div className="flex items-baseline gap-1 font-mono-vibe text-lg">
      <span className="text-accent-green">cybercafe</span>
      <span className="text-text-cream/40">@</span>
      <span className="text-accent-orange">pass</span>
      <span className="text-text-cream/40">:~$</span>
      <span className="text-text-cream">{command}</span>
      <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-accent-cyan" />
    </div>
  )
}
