import { ipcMain, app, BrowserWindow, dialog } from 'electron'
import { copyFileSync } from 'fs'
import { join } from 'path'
import {
  vaultExists as checkVaultExists,
  createVault as createVaultFile,
  unlockVault as unlockVaultFile,
  saveEntries,
  createEntry as buildEntry,
  isValidVaultFile,
  PasswordEntry
} from './database'

const VAULT_PATH = join(app.getPath('userData'), 'vault.enc')
const AUTO_LOCK_MS = 5 * 60 * 1000 // 5 minutos de inatividade
const WARNING_BEFORE_LOCK_MS = 30 * 1000 // avisa 30s antes de trancar

// Estado da sessão — vive só na RAM do Main Process, nunca é persistido
let sessionKey: Buffer | null = null
let sessionEntries: PasswordEntry[] | null = null
let autoLockTimer: NodeJS.Timeout | null = null
let warningTimer: NodeJS.Timeout | null = null

function broadcast(channel: string): void {
  BrowserWindow.getAllWindows().forEach((win) => win.webContents.send(channel))
}

function lockSession(): void {
  sessionKey = null
  sessionEntries = null
  if (autoLockTimer) clearTimeout(autoLockTimer)
  if (warningTimer) clearTimeout(warningTimer)
  broadcast('vault:autoLocked')
}

function resetAutoLockTimer(): void {
  if (autoLockTimer) clearTimeout(autoLockTimer)
  if (warningTimer) clearTimeout(warningTimer)

  warningTimer = setTimeout(() => {
    broadcast('vault:lockWarning')
  }, AUTO_LOCK_MS - WARNING_BEFORE_LOCK_MS)

  autoLockTimer = setTimeout(lockSession, AUTO_LOCK_MS)
}

function requireUnlockedSession(): { key: Buffer; entries: PasswordEntry[] } {
  if (!sessionKey || !sessionEntries) {
    throw new Error('Cofre bloqueado. Faça login novamente.')
  }
  resetAutoLockTimer()
  return { key: sessionKey, entries: sessionEntries }
}

export function registerIpcHandlers(): void {
  ipcMain.handle('vault:exists', () => {
    return checkVaultExists(VAULT_PATH)
  })

  ipcMain.handle('vault:create', (_event, masterPassword: string) => {
    sessionKey = createVaultFile(VAULT_PATH, masterPassword)
    sessionEntries = []
    resetAutoLockTimer()
  })

  ipcMain.handle('vault:unlock', (_event, masterPassword: string) => {
    const { key, entries } = unlockVaultFile(VAULT_PATH, masterPassword)
    sessionKey = key
    sessionEntries = entries
    resetAutoLockTimer()
    return entries
  })

  ipcMain.handle('vault:lock', () => {
    lockSession()
  })

  ipcMain.handle('entries:getAll', () => {
    const { entries } = requireUnlockedSession()
    return entries
  })

  ipcMain.handle(
    'entries:create',
    (_event, data: Omit<PasswordEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { key, entries } = requireUnlockedSession()
      const entry = buildEntry(data)
      const updated = [...entries, entry]
      saveEntries(VAULT_PATH, updated, key)
      sessionEntries = updated
      return entry
    }
  )

  ipcMain.handle('entries:update', (_event, id: string, data: Partial<PasswordEntry>) => {
    const { key, entries } = requireUnlockedSession()
    const updated = entries.map((entry) =>
      entry.id === id ? { ...entry, ...data, updatedAt: new Date().toISOString() } : entry
    )
    saveEntries(VAULT_PATH, updated, key)
    sessionEntries = updated
  })

  ipcMain.handle('entries:delete', (_event, id: string) => {
    const { key, entries } = requireUnlockedSession()
    const updated = entries.filter((entry) => entry.id !== id)
    saveEntries(VAULT_PATH, updated, key)
    sessionEntries = updated
  })

  ipcMain.handle('vault:export', async () => {
    const { canceled, filePath } = await dialog.showSaveDialog({
      title: 'Exportar backup do cofre',
      defaultPath: `cybercafe-pass-backup-${new Date().toISOString().split('T')[0]}.enc`,
      filters: [{ name: 'Backup CyberCafé Pass', extensions: ['enc'] }]
    })

    if (canceled || !filePath) {
      return { success: false }
    }

    copyFileSync(VAULT_PATH, filePath)
    return { success: true, filePath }
  })

  ipcMain.handle('vault:import', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: 'Importar backup do cofre',
      properties: ['openFile'],
      filters: [{ name: 'Backup CyberCafé Pass', extensions: ['enc'] }]
    })

    if (canceled || filePaths.length === 0) {
      return { success: false }
    }

    const sourcePath = filePaths[0]
    // Valida a estrutura antes de substituir o cofre atual — um arquivo qualquer
    // não pode sobrescrever o cofre real
    if (!isValidVaultFile(sourcePath)) {
      return {
        success: false,
        error: 'O arquivo selecionado não é um backup válido do CyberCafé Pass.'
      }
    }

    copyFileSync(sourcePath, VAULT_PATH)
    lockSession() // sessão atual fica inválida — o usuário precisa logar de novo com a senha do backup
    return { success: true }
  })
}
