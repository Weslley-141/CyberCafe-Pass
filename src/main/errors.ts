export class VaultCorruptedError extends Error {
  constructor(message = 'O arquivo do cofre está corrompido ou em formato inválido.') {
    super(message)
    this.name = 'VaultCorruptedError'
  }
}

export class VaultNotFoundError extends Error {
  constructor(message = 'Nenhum cofre encontrado neste dispositivo.') {
    super(message)
    this.name = 'VaultNotFoundError'
  }
}

export class InvalidMasterPasswordError extends Error {
  constructor(message = 'Senha Mestre incorreta.') {
    super(message)
    this.name = 'InvalidMasterPasswordError'
  }
}

export class VaultWriteError extends Error {
  constructor(message = 'Não foi possível salvar o cofre em disco.') {
    super(message)
    this.name = 'VaultWriteError'
  }
}
