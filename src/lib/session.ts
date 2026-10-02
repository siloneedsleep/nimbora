// Reference implementation, unit-tested (28 checks) outside v0. Use it as src/lib/session.ts.
// JWT HS256 with Web Crypto: works on Edge (middleware) and Node. Tokens signed earlier by jsonwebtoken stay valid.

export interface SessionUser {
  userId: string;
  username: string;
}

export const SESSION_COOKIE = "token";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function toBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(input: string): Uint8Array {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(input.length / 4) * 4, "=");
  const bin = atob(padded);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function importKey(secret: string) {
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export async function signSession(user: SessionUser, ttlSeconds = SESSION_TTL_SECONDS): Promise<string> {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET chưa được set (vd: openssl rand -hex 32).");
  const now = Math.floor(Date.now() / 1000);
  const header = toBase64Url(encoder.encode(JSON.stringify({ alg: "HS256", typ: "JWT" })));
  const payload = toBase64Url(
    encoder.encode(JSON.stringify({ userId: user.userId, username: user.username, iat: now, exp: now + ttlSeconds }))
  );
  const data = `${header}.${payload}`;
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", await importKey(secret), encoder.encode(data)));
  return `${data}.${toBase64Url(sig)}`;
}

/** null on bad signature / expired / malformed. Never throws. */
export async function verifySession(token: string | undefined | null): Promise<SessionUser | null> {
  if (!token) return null;
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [h, p, s] = parts;
    const header = JSON.parse(decoder.decode(fromBase64Url(h)));
    if (header?.alg !== "HS256") return null; // blocks alg=none / algorithm switching
    const ok = await crypto.subtle.verify("HMAC", await importKey(secret), fromBase64Url(s), encoder.encode(`${h}.${p}`));
    if (!ok) return null;
    const payload = JSON.parse(decoder.decode(fromBase64Url(p)));
    if (typeof payload.exp !== "number" || payload.exp < Math.floor(Date.now() / 1000)) return null;
    if (typeof payload.userId !== "string" || typeof payload.username !== "string") return null;
    return { userId: payload.userId, username: payload.username };
  } catch {
    return null;
  }
}

export function readCookie(header: string | null | undefined, name: string): string | undefined {
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    if (part.slice(0, idx).trim() === name) {
      try {
        return decodeURIComponent(part.slice(idx + 1).trim());
      } catch {
        return undefined;
      }
    }
  }
  return undefined;
}
