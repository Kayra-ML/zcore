import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
// In a real app, you would securely generate and store this,
// or derive it from the user's auth token + machineId.
// For now, we will use a derived key from a fixed dummy token if none provided.
const DUMMY_SECRET = 'zcore-desktop-super-secret-key-32'; 

function getEncryptionKey(seed?: string): Buffer {
  const secretString = seed || DUMMY_SECRET;
  // Create a 32-byte key from the secret string using SHA-256
  return crypto.createHash('sha256').update(String(secretString)).digest();
}

export function encryptData(data: any, keySeed?: string): string {
  const key = getEncryptionKey(keySeed);
  const iv = crypto.randomBytes(16); // Initialization Vector
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  const jsonStr = JSON.stringify(data);
  let encrypted = cipher.update(jsonStr, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();

  // Return the IV, Encrypted Data, and AuthTag combined
  return `${iv.toString('hex')}:${encrypted}:${authTag.toString('hex')}`;
}

export function decryptData(encryptedString: string, keySeed?: string): any {
  try {
    const key = getEncryptionKey(keySeed);
    const parts = encryptedString.split(':');
    
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format');
    }

    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = parts[1];
    const authTag = Buffer.from(parts[2], 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Decryption failed:', error);
    return null; // Return null if tampering is detected or key is wrong
  }
}
