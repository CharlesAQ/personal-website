import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "nuomi_admin";
const SESSION_VALUE = "authenticated";

export async function getAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value === SESSION_VALUE;
}

export async function requireAdmin(returnTo: string): Promise<boolean> {
  const authed = await getAdminSession();
  if (authed) return true;

  const safePath = returnTo.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/";
  redirect(`/admin?return_to=${encodeURIComponent(safePath)}`);
}

export async function createAdminSession(password: string): Promise<boolean> {
  const adminPassword = (process.env as Record<string, string | undefined>).ADMIN_PASSWORD;
  if (!adminPassword || password !== adminPassword) return false;

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, SESSION_VALUE, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return true;
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
