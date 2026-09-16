import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/db";

const SESSION_COOKIE = "axiom_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET environment variable is not set");
  }
  return secret;
}

function sign(value: string): string {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

function encodeSession(userId: string, expiresAt: number): string {
  const payload = Buffer.from(JSON.stringify({ userId, expiresAt })).toString(
    "base64url"
  );
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

function decodeSession(
  token: string
): { userId: string; expiresAt: number } | null {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expectedSignature = sign(payload);
  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expectedSignature);
  if (
    sigBuf.length !== expectedBuf.length ||
    !timingSafeEqual(sigBuf, expectedBuf)
  ) {
    return null;
  }

  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (typeof decoded.userId !== "string" || typeof decoded.expiresAt !== "number") {
      return null;
    }
    if (decoded.expiresAt < Date.now()) return null;
    return decoded;
  } catch {
    return null;
  }
}

export async function createAdminSession(userId: string) {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const token = encodeSession(userId, expiresAt);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expiresAt),
  });
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const decoded = decodeSession(token);
  if (!decoded) return null;

  const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
  if (!user) return null;

  return user;
}
