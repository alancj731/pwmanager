import * as crypto from "crypto";

const crypto_secret_key = process.env.CRYPTO_SECRET_KEY || "not found";

// Encryption function
export function encrypt(
  text: string,
  secretKey: string = crypto_secret_key
): string | null {
  if (secretKey === "not found") {
    console.error("CRYPTO_SECRET_KEY not found in environment variables");
    return null;
  }
  const iv = crypto.randomBytes(16); // Generate random IV (Initialization Vector)

  // Create the cipher using AES-256-CBC mode
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(secretKey, "hex"),
    iv
  );

  // Encrypt the data
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  // Return the IV and encrypted data combined
  return iv.toString("hex") + encrypted;
}

// Decryption function
export function decrypt(
  encryptedText: string,
  secretKey: string = crypto_secret_key
): string | null {
  if (secretKey === "not found") {
    console.error("CRYPTO_SECRET_KEY not found in environment variables");
    return null;
  }

  const iv = Buffer.from(encryptedText.substring(0, 32), "hex"); // Extract IV (first 16 bytes)
  const encrypted = encryptedText.substring(32); // Extract the encrypted data

  // Create the decipher using AES-256-CBC mode
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(secretKey, "hex"),
    iv
  );

  // Decrypt the data
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
