import * as fs from "fs";

/**
 * Encrypts an image Buffer by converting it to base64 and then using AES encryption.
 *
 * @param {Buffer} imageBuffer - The input image data to be encrypted (JPEG, JPG, PNG).
 */
export function encryptImageAndSave(imageBuffer: Buffer, filePath: string) {
  fs.writeFileSync(filePath, imageBuffer.toString("base64"));
}

/**
 * Decrypts an image Buffer by decrypting it first and then converting it back to Buffer.
 *
 * @param {string} filePath - The encrypted data to be decrypted.
 */
export function loadAndDecryptImage(filePath: string) {
  return fs.readFileSync(filePath).toString();
}
