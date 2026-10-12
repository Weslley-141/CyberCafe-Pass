import { describe, it, expect } from 'vitest'
import { generateSalt, deriveKey, encrypt, decrypt } from './crypto'

describe('crypto.ts', () => {
  it('deriva a mesma chave a partir da mesma senha e salt', () => {
    const salt = generateSalt()
    const key1 = deriveKey('minhaSenhaForte123', salt)
    const key2 = deriveKey('minhaSenhaForte123', salt)

    expect(key1.equals(key2)).toBe(true)
  })

  it('deriva chaves diferentes para senhas diferentes', () => {
    const salt = generateSalt()
    const key1 = deriveKey('senhaA', salt)
    const key2 = deriveKey('senhaB', salt)

    expect(key1.equals(key2)).toBe(false)
  })

  it('criptografa e descriptografa corretamente (round-trip)', () => {
    const salt = generateSalt()
    const key = deriveKey('minhaSenhaForte123', salt)
    const original = 'GitHub Pessoal - senha: S3nh@Super!Secreta'

    const payload = encrypt(original, key)
    const result = decrypt(payload, key)

    expect(result).toBe(original)
  })

  it('lança erro se a chave estiver errada', () => {
    const salt = generateSalt()
    const key = deriveKey('senhaCerta', salt)
    const wrongKey = deriveKey('senhaErrada', salt)

    const payload = encrypt('dado sensível', key)

    expect(() => decrypt(payload, wrongKey)).toThrow()
  })

  it('gera IV diferente a cada chamada de encrypt (mesmo texto e chave)', () => {
    const salt = generateSalt()
    const key = deriveKey('minhaSenhaForte123', salt)

    const payload1 = encrypt('mesmo texto', key)
    const payload2 = encrypt('mesmo texto', key)

    expect(payload1.iv).not.toBe(payload2.iv)
    expect(payload1.ciphertext).not.toBe(payload2.ciphertext)
  })
})
