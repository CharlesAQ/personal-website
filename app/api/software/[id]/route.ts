import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { software } from "@/db/schema";
import { requireAdminApi } from "@/lib/admin";
import { getFilesBucket } from "@/lib/files";

export const dynamic = "force-dynamic";

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi();
  if ("response" in auth) return auth.response;
  const { id } = await context.params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) return Response.json({ error: "无效的软件编号。" }, { status: 400 });

  const [item] = await getDb().select().from(software).where(eq(software.id, numericId)).limit(1);
  if (!item) return Response.json({ error: "软件不存在。" }, { status: 404 });
  await getFilesBucket().delete(item.fileKey);
  await getDb().delete(software).where(eq(software.id, numericId));
  return Response.json({ ok: true });
}
