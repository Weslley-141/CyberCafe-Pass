import { randomBytes, pbkdf2Sync, createCipheriv, createDecipheriv } from 'crypto'

// Parâmetros seguem a recomendação atual da OWASP (2026) pra PBKDF2-HMAC-SHA256
const PBKDF2_ITERATIONS = 600_000
const KEY_LENGTH = 32 // 256 bits
const SALT_LENGTH = 16 // 128 bits
const IV_LENGTH = 12 // tamanho recomendado de IV pro modo GCM
const DIGEST = 'sha256'
const ALGORITHM = 'aes-256-gcm'

export interface EncryptedPayload {
  iv: string // hex
  authTag: string // hex
  ciphertext: string // hex
}

/**
 * Gera um salt aleatório criptograficamente seguro.
 * Um salt novo deve ser gerado uma única vez, na criação da Senha Mestre,
 * e armazenado (não é segredo) para permitir derivar a mesma chave depois.
 */
export function generateSalt(): Buffer {
  return randomBytes(SALT_LENGTH)
}

/**
 * Deriva uma chave de 256 bits a partir da Senha Mestre + salt.
 * A Senha Mestre em si NUNCA é armazenada — só usamos ela em memória
 * no momento da derivação.
 */
export function deriveKey(masterPassword: string, salt: Buffer): Buffer {
  return pbkdf2Sync(masterPassword, salt, PBKDF2_ITERATIONS, KEY_LENGTH, DIGEST)
}

/**
 * Criptografa um texto plano com AES-256-GCM.
 * Retorna IV, authTag (garante integridade) e o texto cifrado, todos em hex.
 */
export function encrypt(plaintext: string, key: Buffer): EncryptedPayload {
  const iv = randomBytes(IV_LENGTH)
  const cipher = createCipheriv(ALGORITHM, key, iv)

  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()

  return {
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
    ciphertext: ciphertext.toString('hex')
  }
}

/**
 * Descriptografa um payload gerado por encrypt().
 * Se o authTag não bater (dado corrompido ou chave errada), lança erro —
 * isso é o GCM garantindo integridade, não é bug.
 */
export function decrypt(payload: EncryptedPayload, key: Buffer): string {
  const decipher = createDecipheriv(ALGORITHM, key, Buffer.from(payload.iv, 'hex'))
  decipher.setAuthTag(Buffer.from(payload.authTag, 'hex'))

  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(payload.ciphertext, 'hex')),
    decipher.final()
  ])

  return plaintext.toString('utf8')
}
