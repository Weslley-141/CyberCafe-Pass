import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { rmSync, mkdtempSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import {
  vaultExists,
  createVault,
  unlockVault,
  saveEntries,
  createEntry,
  isValidVaultFile
} from './database'
import { InvalidMasterPasswordError, VaultCorruptedError, VaultNotFoundError } from './errors'

describe('database.ts', () => {
  let tempDir: string
  let vaultPath: string

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'cybercafe-test-'))
    vaultPath = join(tempDir, 'vault.enc')
  })

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true })
  })

  it('não existe cofre antes da criação', () => {
    expect(vaultExists(vaultPath)).toBe(false)
  })

  it('cria um cofre vazio no disco', () => {
    createVault(vaultPath, 'senhaMestre123')
    expect(vaultExists(vaultPath)).toBe(true)
  })

  it('destranca o cofre com a senha correta e retorna lista vazia', () => {
    createVault(vaultPath, 'senhaMestre123')
    const { entries } = unlockVault(vaultPath, 'senhaMestre123')
    expect(entries).toEqual([])
  })

  it('lança InvalidMasterPasswordError ao destrancar com senha errada', () => {
    createVault(vaultPath, 'senhaCerta')
    expect(() => unlockVault(vaultPath, 'senhaErrada')).toThrow(InvalidMasterPasswordError)
  })

  it('lança VaultNotFoundError se o cofre não existir', () => {
    expect(() => unlockVault(vaultPath, 'qualquerSenha')).toThrow(VaultNotFoundError)
  })

  it('lança VaultCorruptedError se o arquivo estiver corrompido', () => {
    createVault(vaultPath, 'senhaCerta')
    writeFileSync(vaultPath, '{ isso não é json válido')
    expect(() => unlockVault(vaultPath, 'senhaCerta')).toThrow(VaultCorruptedError)
  })

  it('salva e recupera uma entrada de senha', () => {
    const key = createVault(vaultPath, 'senhaMestre123')
    const entry = createEntry({
      title: 'GitHub Pessoal',
      category: 'Trabalho',
      username: 'weslley322',
      passwordEncrypted: 'S3nh@Forte!'
    })

    saveEntries(vaultPath, [entry], key)

    const { entries } = unlockVault(vaultPath, 'senhaMestre123')
    expect(entries).toHaveLength(1)
    expect(entries[0].title).toBe('GitHub Pessoal')
    expect(entries[0].username).toBe('weslley322')
  })

  it('isValidVaultFile aceita um cofre real e rejeita lixo', () => {
    createVault(vaultPath, 'senhaMestre123')
    expect(isValidVaultFile(vaultPath)).toBe(true)

    const junkPath = join(tempDir, 'junk.enc')
    writeFileSync(junkPath, 'qualquer coisa')
    expect(isValidVaultFile(junkPath)).toBe(false)
    expect(isValidVaultFile(join(tempDir, 'nao-existe.enc'))).toBe(false)
  })
})
