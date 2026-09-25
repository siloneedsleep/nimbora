import crypto from "crypto";

// Mã hoá API key của user trước khi lưu DB (AES-256-GCM).
// ENCRYPTION_KEY phải khác JWT_SECRET — 32 byte, dạng hex (64 ký tự).
// Tạo bằng: openssl rand -hex 32

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // khuyến nghị cho GCM

function getKey(): Buffer {
  const raw = process.env.ENCRYPTION_KEY;
  if (!raw) {
    throw new Error(
      "ENCRYPTION_KEY chưa được set. Thêm biến môi trường ENCRYPTION_KEY (32 byte hex, vd: openssl rand -hex 32)."
    );
  }
  const key = Buffer.from(raw, "hex");
  if (key.length !== 32) {
    throw new Error("ENCRYPTION_KEY phải là 32 byte dạng hex (64 ký tự).");
  }
  return key;
}

/**
 * Mã hoá một chuỗi plaintext (vd: API key thô của user).
 * Kết quả lưu được thẳng vào DB dạng string: "iv:authTag:ciphertext" (hex).
 */
export function encrypt(plaintext: string): string {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [iv.toString("hex"), authTag.toString("hex"), ciphertext.toString("hex")].join(":");
}

/**
 * Giải mã chuỗi đã lưu bằng encrypt(). Throw nếu format sai hoặc key sai
 * (authTag không khớp — dữ liệu có thể đã bị sửa).
 */
export function decrypt(stored: string): string {
  const key = getKey();
  const parts = stored.split(":");
  if (parts.length !== 3) {
    throw new Error("Dữ liệu mã hoá không đúng định dạng.");
  }
  const [ivHex, authTagHex, ciphertextHex] = parts;
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const ciphertext = Buffer.from(ciphertextHex, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return plaintext.toString("utf8");
}
