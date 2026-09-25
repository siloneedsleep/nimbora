import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  // Không fallback về secret cứng — nếu thiếu env, token ký ra sẽ không an
  // toàn (ai biết default cũ cũng forge được). Fail fast thay vì âm thầm
  // chạy với secret công khai trong source code.
  throw new Error(
    "JWT_SECRET chưa được set. Thêm biến môi trường JWT_SECRET (vd: openssl rand -hex 32) trước khi chạy app."
  );
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}

export function generateToken(userId: string, username: string): string {
  return jwt.sign({ userId, username }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function getCurrentUser(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) return null;
  const decoded = verifyToken(token);
  if (!decoded) return null;
  return decoded as { userId: string; username: string };
}
