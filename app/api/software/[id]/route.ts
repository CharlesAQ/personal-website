import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { software } from "@/db/schema";
import { requireAdminApi } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi();
  if ("response" in auth) return auth.response;
  const { id } = await context.params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) return Response.json({ error: "无效的软件编号。" }, { status: 400 });

  const payload = await request.json() as Record<string, unknown>;
  const name = String(payload.name ?? "").trim();
  const downloadUrl = String(payload.downloadUrl ?? "").trim();
  const officialUrl = String(payload.officialUrl ?? "").trim();

  if (!name || !downloadUrl) {
    return Response.json({ error: "请填写软件名称和下载链接。" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {
    name,
    description: String(payload.description ?? "").trim(),
    version: String(payload.version ?? "").trim(),
    platform: String(payload.platform ?? "Windows").trim(),
    officialUrl,
    downloadUrl,
    fileName: String(payload.fileName ?? "").trim(),
    fileSize: Number(payload.fileSize ?? 0),
  };

  const [item] = await getDb()
    .update(software)
    .set(updates)
    .where(eq(software.id, numericId))
    .returning();

  if (!item) return Response.json({ error: "软件不存在。" }, { status: 404 });
  return Response.json({ item });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi();
  if ("response" in auth) return auth.response;
  const { id } = await context.params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) return Response.json({ error: "无效的软件编号。" }, { status: 400 });

  await getDb().delete(software).where(eq(software.id, numericId));
  return Response.json({ ok: true });
}
