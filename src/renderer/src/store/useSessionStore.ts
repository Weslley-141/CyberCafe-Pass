import { create } from 'zustand'
import type { PasswordEntry } from '../../../../types'

type Screen = 'loading' | 'onboarding' | 'login' | 'dashboard'

interface SessionState {
  screen: Screen
  entries: PasswordEntry[]
  setScreen: (screen: Screen) => void
  setEntries: (entries: PasswordEntry[]) => void
}

export const useSessionStore = create<SessionState>((set) => ({
  screen: 'loading',
  entries: [],
  setScreen: (screen): void => set({ screen }),
  setEntries: (entries): void => set({ entries })
}))
