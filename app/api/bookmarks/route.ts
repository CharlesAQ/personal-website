import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { bookmarks } from "@/db/schema";
import { requireAdminApi } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await getDb()
      .select()
      .from(bookmarks)
      .orderBy(desc(bookmarks.createdAt), desc(bookmarks.id));
    return Response.json({ bookmarks: rows });
  } catch {
    return Response.json({ bookmarks: [], unavailable: true });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if ("response" in auth) return auth.response;

  try {
    const payload = await request.json() as Record<string, unknown>;
    const name = String(payload.name ?? "").trim();
    const url = String(payload.url ?? "").trim();
    const description = String(payload.description ?? "").trim();
    const category = String(payload.category ?? "其他").trim();

    if (!name || !url) {
      return Response.json({ error: "请填写名称和网址。" }, { status: 400 });
    }

    let parsed: URL;
    try {
      parsed = new URL(url);
      if (!["http:", "https:"].includes(parsed.protocol)) throw new Error();
    } catch {
      return Response.json({ error: "请填写有效的网址。" }, { status: 400 });
    }

    const [item] = await getDb()
      .insert(bookmarks)
      .values({ name, url: parsed.toString(), description, category })
      .returning();
    return Response.json({ item }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "添加失败。";
    return Response.json({ error: message }, { status: 500 });
  }
}
