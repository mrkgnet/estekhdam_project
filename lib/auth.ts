// lib/auth.ts
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function getUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  const secret = process.env.JWT_SECRET;
  if (!secret) return null;

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    const userId = payload.userId as string | undefined;
    return userId ?? null;
  } catch {
    return null;
  }
}
