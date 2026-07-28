import { eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { journalEntries } from "@/db/schema";
import { requireAdminApi } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi();
  if ("response" in auth) return auth.response;
  const { id } = await context.params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) return Response.json({ error: "无效的日志编号。" }, { status: 400 });
  const payload = await request.json() as Partial<typeof journalEntries.$inferInsert>;
  const title = String(payload.title ?? "").trim();
  const entryDate = String(payload.entryDate ?? "").trim();
  if (!title || !/^\d{4}-\d{2}-\d{2}$/.test(entryDate)) {
    return Response.json({ error: "请填写标题和日期。" }, { status: 400 });
  }
  const [entry] = await getDb().update(journalEntries).set({
    kind: payload.kind === "diary" ? "diary" : "dev",
    title,
    content: String(payload.content ?? "").trim(),
    tags: String(payload.tags ?? "").trim(),
    mood: String(payload.mood ?? "平静").trim(),
    entryDate,
    updatedAt: sql`CURRENT_TIMESTAMP`,
  }).where(eq(journalEntries.id, numericId)).returning();
  if (!entry) return Response.json({ error: "日志不存在。" }, { status: 404 });
  return Response.json({ entry });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi();
  if ("response" in auth) return auth.response;
  const { id } = await context.params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) return Response.json({ error: "无效的日志编号。" }, { status: 400 });
  await getDb().delete(journalEntries).where(eq(journalEntries.id, numericId));
  return Response.json({ ok: true });
}
