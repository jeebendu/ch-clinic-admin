
import CryptoJS from 'crypto-js';
import { getEnvVariable } from './envUtils';

/**
 * Service for encryption and decryption using AES
 */
export const EncryptionService = {
  /**
   * Encrypt a string using AES-128-CBC with PKCS7 padding
   * @param text Text to encrypt
   * @returns Encrypted text
   */
  encrypt: (text: string): string => {
    if (!text) return '';
    
    const key = getEnvVariable('AES_KEY');
    if (!key) {
      console.error('AES_KEY is not defined in environment variables');
      return '';
    }
    
    const keySize = 128/8;
    const keyHex = CryptoJS.enc.Utf8.parse(key.substring(0, keySize));
    
    // Encrypt using AES in CBC mode with PKCS7 padding
    const encrypted = CryptoJS.AES.encrypt(text, keyHex, {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      iv: keyHex
    });
    
    return encrypted.toString();
  },
  
  /**
   * Decrypt a string that was encrypted using AES-128-CBC with PKCS7 padding
   * @param encryptedText Encrypted text to decrypt
   * @returns Decrypted text
   */
  decrypt: (encryptedText: string): string => {
    if (!encryptedText) return '';
    
    const key = getEnvVariable('AES_KEY');
    if (!key) {
      console.error('AES_KEY is not defined in environment variables');
      return '';
    }
    
    const keySize = 128/8;
    const keyHex = CryptoJS.enc.Utf8.parse(key.substring(0, keySize));
    
    // Decrypt using AES in CBC mode with PKCS7 padding
    const decrypted = CryptoJS.AES.decrypt(encryptedText, keyHex, {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      iv: keyHex
    });
    
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
};
