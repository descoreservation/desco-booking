import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

function getKey() {
    const key = process.env.ENCRYPTION_KEY;
    if (!key || key.length !== 64) {
        throw new Error('ENCRYPTION_KEY must be 64 hex characters (32 bytes)');
    }
    return Buffer.from(key, 'hex');
}

export function encrypt(plaintext) {
    if (!plaintext) return plaintext;
    const key = getKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();
    // Format: iv + authTag + ciphertext → base64
    return Buffer.concat([iv, authTag, encrypted]).toString('base64');
}

export function decrypt(encoded) {
    if (!encoded) return encoded;
    try {
        const key = getKey();
        const data = Buffer.from(encoded, 'base64');
        const iv = data.subarray(0, IV_LENGTH);
        const authTag = data.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
        const ciphertext = data.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        decipher.setAuthTag(authTag);
        return decipher.update(ciphertext, null, 'utf8') + decipher.final('utf8');
    } catch {
        // Fallback for unencrypted legacy data
        return encoded;
    }
}

export function encryptBookingPII(booking) {
    const encrypted = { ...booking };
    if (encrypted.phone_encrypted) encrypted.phone_encrypted = encrypt(encrypted.phone_encrypted);
    if (encrypted.email_encrypted) encrypted.email_encrypted = encrypt(encrypted.email_encrypted);
    if (encrypted.dob_encrypted) encrypted.dob_encrypted = encrypt(encrypted.dob_encrypted);
    return encrypted;
}

export function decryptBookingPII(booking) {
    const decrypted = { ...booking };
    if (decrypted.phone_encrypted) decrypted.phone_encrypted = decrypt(decrypted.phone_encrypted);
    if (decrypted.email_encrypted) decrypted.email_encrypted = decrypt(decrypted.email_encrypted);
    if (decrypted.dob_encrypted) decrypted.dob_encrypted = decrypt(decrypted.dob_encrypted);
    return decrypted;
}