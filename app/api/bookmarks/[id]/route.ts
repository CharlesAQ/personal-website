import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { bookmarks } from "@/db/schema";
import { requireAdminApi } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi();
  if ("response" in auth) return auth.response;
  const { id } = await context.params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) return Response.json({ error: "无效的编号。" }, { status: 400 });

  const payload = await request.json() as Record<string, unknown>;
  const name = String(payload.name ?? "").trim();
  const url = String(payload.url ?? "").trim();
  if (!name || !url) {
    return Response.json({ error: "请填写名称和网址。" }, { status: 400 });
  }

  const [item] = await getDb()
    .update(bookmarks)
    .set({
      name,
      url,
      description: String(payload.description ?? "").trim(),
      category: String(payload.category ?? "其他").trim(),
    })
    .where(eq(bookmarks.id, numericId))
    .returning();

  if (!item) return Response.json({ error: "网址不存在。" }, { status: 404 });
  return Response.json({ item });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi();
  if ("response" in auth) return auth.response;
  const { id } = await context.params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) return Response.json({ error: "无效的编号。" }, { status: 400 });

  await getDb().delete(bookmarks).where(eq(bookmarks.id, numericId));
  return Response.json({ ok: true });
}
