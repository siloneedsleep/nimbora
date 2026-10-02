import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { signSession, verifySession, type SessionUser } from "@/lib/session";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}

export function generateToken(userId: string, username: string): Promise<string> {
  return signSession({ userId, username });
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  return verifySession(cookieStore.get("token")?.value);
}

export { verifySession };
