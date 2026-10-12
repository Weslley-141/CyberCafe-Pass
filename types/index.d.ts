export interface PasswordEntry {
  id: string
  title: string
  category: string
  username: string
  passwordEncrypted: string
  url?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CyberCafeAPI {
  vaultExists: () => Promise<boolean>
  createVault: (masterPassword: string) => Promise<void>
  unlockVault: (masterPassword: string) => Promise<PasswordEntry[]>
  lockVault: () => Promise<void>
  getEntries: () => Promise<PasswordEntry[]>
  createEntry: (
    data: Omit<PasswordEntry, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<PasswordEntry>
  updateEntry: (
    id: string,
    data: Partial<Omit<PasswordEntry, 'id' | 'createdAt' | 'updatedAt'>>
  ) => Promise<void>
  deleteEntry: (id: string) => Promise<void>
  exportVault: () => Promise<{ success: boolean; filePath?: string }>
  importVault: () => Promise<{ success: boolean; error?: string }>
  onLockWarning: (callback: () => void) => () => void
  onAutoLocked: (callback: () => void) => () => void
  onWindowBlur: (callback: () => void) => () => void
  onWindowFocus: (callback: () => void) => () => void
}

declare global {
  interface Window {
    api: CyberCafeAPI
  }
}
