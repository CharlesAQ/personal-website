import { createAdminSession, clearAdminSession, getAdminSession } from "@/app/chatgpt-auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const payload = await request.json() as { password?: string };
  const ok = await createAdminSession(payload.password ?? "");
  if (!ok) {
    return Response.json({ error: "密码不正确。" }, { status: 401 });
  }
  return Response.json({ ok: true });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const action = url.searchParams.get("action");
  if (action === "logout") {
    await clearAdminSession();
    redirect("/");
  }
  const authed = await getAdminSession();
  return Response.json({ authed });
}
