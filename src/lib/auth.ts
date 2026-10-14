import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "vindhya-events-super-secret-jwt-key-2026-secure-random";
const secretKey = new TextEncoder().encode(JWT_SECRET);

export interface AdminJwtPayload {
  adminId: string;
  email: string;
  role: string;
  name: string;
}

export const ADMIN_COOKIE_NAME = "vindhya_admin_token";

export async function signAdminToken(payload: AdminJwtPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

export async function verifyAdminToken(token: string): Promise<AdminJwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as AdminJwtPayload;
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminJwtPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifyAdminToken(token);
  } catch {
    return null;
  }
}

export async function getAdminFromRequest(req: NextRequest): Promise<AdminJwtPayload | null> {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyAdminToken(token);
}
