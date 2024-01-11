
export function generatePbkdf2Params(salt: Uint8Array): Pbkdf2Params {
  return {
    name: 'PBKDF2',
    hash: 'SHA-256',
    salt: salt,
    iterations: 1000000,
  };
}

export function generateSalt(bytes: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(bytes));
}
