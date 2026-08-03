import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { software } from "@/db/schema";
import { requireAdminApi } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi();
  if ("response" in auth) return auth.response;
  const { id } = await context.params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) return Response.json({ error: "无效的软件编号。" }, { status: 400 });

  await getDb().delete(software).where(eq(software.id, numericId));
  return Response.json({ ok: true });
}
