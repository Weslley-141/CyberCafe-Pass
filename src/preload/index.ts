import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import type { PasswordEntry, CyberCafeAPI } from '../../types'

// Inscreve um callback num evento enviado pelo Main e devolve a função de cancelar a inscrição
function subscribe(channel: string, callback: () => void): () => void {
  const listener = (): void => callback()
  ipcRenderer.on(channel, listener)
  return () => ipcRenderer.removeListener(channel, listener)
}

const api: CyberCafeAPI = {
  vaultExists: () => ipcRenderer.invoke('vault:exists'),
  createVault: (masterPassword: string) => ipcRenderer.invoke('vault:create', masterPassword),
  unlockVault: (masterPassword: string): Promise<PasswordEntry[]> =>
    ipcRenderer.invoke('vault:unlock', masterPassword),
  lockVault: () => ipcRenderer.invoke('vault:lock'),
  getEntries: (): Promise<PasswordEntry[]> => ipcRenderer.invoke('entries:getAll'),
  createEntry: (data) => ipcRenderer.invoke('entries:create', data),
  updateEntry: (id, data) => ipcRenderer.invoke('entries:update', id, data),
  deleteEntry: (id: string) => ipcRenderer.invoke('entries:delete', id),
  exportVault: () => ipcRenderer.invoke('vault:export'),
  importVault: () => ipcRenderer.invoke('vault:import'),
  onLockWarning: (callback) => subscribe('vault:lockWarning', callback),
  onAutoLocked: (callback) => subscribe('vault:autoLocked', callback),
  onWindowBlur: (callback) => subscribe('window:blur', callback),
  onWindowFocus: (callback) => subscribe('window:focus', callback)
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
