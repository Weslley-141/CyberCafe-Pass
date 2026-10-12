import { create } from 'zustand'

interface UIState {
  cafeMode: boolean
  toggleCafeMode: () => void
}

export const useUIStore = create<UIState>((set) => ({
  cafeMode: false,
  toggleCafeMode: (): void => set((state) => ({ cafeMode: !state.cafeMode }))
}))
