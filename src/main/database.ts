import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs'
import { dirname } from 'path'
import { randomUUID } from 'crypto'
import { generateSalt, deriveKey, encrypt, decrypt, EncryptedPayload } from './crypto'
import {
  VaultCorruptedError,
  VaultNotFoundError,
  InvalidMasterPasswordError,
  VaultWriteError
} from './errors'

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

interface VaultFile {
  salt: string // hex — gerado uma única vez na criação do cofre
  payload: EncryptedPayload
}

/** Verifica se já existe um cofre criado nesse caminho. */
export function vaultExists(vaultPath: string): boolean {
  return existsSync(vaultPath)
}

/**
 * Cria um cofre novo (primeiro uso do app): gera salt, deriva a chave
 * a partir da Senha Mestre e persiste um cofre vazio criptografado.
 * Retorna a chave derivada para ser mantida em memória durante a sessão.
 */
export function createVault(vaultPath: string, masterPassword: string): Buffer {
  const salt = generateSalt()
  const key = deriveKey(masterPassword, salt)
  const payload = encrypt(JSON.stringify([]), key)

  writeVaultFile(vaultPath, { salt: salt.toString('hex'), payload })

  return key
}

/**
 * Tenta destrancar o cofre existente com a Senha Mestre informada.
 * Lança InvalidMasterPasswordError se a senha estiver errada, porque o
 * decrypt() do AES-GCM falha na verificação do authTag.
 */
export function unlockVault(
  vaultPath: string,
  masterPassword: string
): { key: Buffer; entries: PasswordEntry[] } {
  const vaultFile = readVaultFile(vaultPath)
  const salt = Buffer.from(vaultFile.salt, 'hex')
  const key = deriveKey(masterPassword, salt)

  let entries: PasswordEntry[]
  try {
    entries = JSON.parse(decrypt(vaultFile.payload, key))
  } catch {
    // decrypt() falha (authTag inválido) quando a senha está errada —
    // é assim que o AES-GCM garante integridade
    throw new InvalidMasterPasswordError()
  }

  return { key, entries }
}

/**
 * Persiste a lista de entradas atualizada, re-criptografando com a
 * mesma chave da sessão. O salt original é preservado.
 */
export function saveEntries(vaultPath: string, entries: PasswordEntry[], key: Buffer): void {
  const currentFile = readVaultFile(vaultPath)
  const payload = encrypt(JSON.stringify(entries), key)

  writeVaultFile(vaultPath, { salt: currentFile.salt, payload })
}

/** Monta uma nova entrada com id (UUID v4) e timestamps automáticos. */
export function createEntry(
  data: Omit<PasswordEntry, 'id' | 'createdAt' | 'updatedAt'>
): PasswordEntry {
  const now = new Date().toISOString()
  return {
    ...data,
    id: randomUUID(),
    createdAt: now,
    updatedAt: now
  }
}

/**
 * Confere se um arquivo tem a estrutura de um cofre válido (salt + payload),
 * sem precisar da Senha Mestre. Usado antes de importar um backup, pra não
 * substituir o cofre atual por um arquivo qualquer.
 */
export function isValidVaultFile(path: string): boolean {
  try {
    readVaultFile(path)
    return true
  } catch {
    return false
  }
}

function readVaultFile(vaultPath: string): VaultFile {
  if (!existsSync(vaultPath)) {
    throw new VaultNotFoundError()
  }

  let raw: string
  try {
    raw = readFileSync(vaultPath, 'utf8')
  } catch {
    throw new VaultWriteError('Não foi possível ler o arquivo do cofre em disco.')
  }

  try {
    const parsed = JSON.parse(raw)
    if (!parsed.salt || !parsed.payload) {
      throw new Error('missing fields')
    }
    return parsed
  } catch {
    throw new VaultCorruptedError()
  }
}

function writeVaultFile(vaultPath: string, vaultFile: VaultFile): void {
  const dir = dirname(vaultPath)
  try {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }
    writeFileSync(vaultPath, JSON.stringify(vaultFile), 'utf8')
  } catch {
    throw new VaultWriteError()
  }
}
