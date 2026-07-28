import { and, desc, eq, like, or } from "drizzle-orm";
import { getDb } from "@/db";
import { journalEntries } from "@/db/schema";
import { requireAdminApi } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireAdminApi();
  if ("response" in auth) return auth.response;
  const url = new URL(request.url);
  const kind = url.searchParams.get("kind");
  const query = url.searchParams.get("q")?.trim();
  const filters = [];
  if (kind === "dev" || kind === "diary") filters.push(eq(journalEntries.kind, kind));
  if (query) {
    const pattern = `%${query.replace(/[%_]/g, "")}%`;
    filters.push(or(
      like(journalEntries.title, pattern),
      like(journalEntries.content, pattern),
      like(journalEntries.tags, pattern),
    )!);
  }
  const rows = await getDb().select().from(journalEntries)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(journalEntries.entryDate), desc(journalEntries.id));
  return Response.json({ entries: rows });
}

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if ("response" in auth) return auth.response;
  const payload = await request.json() as Partial<typeof journalEntries.$inferInsert>;
  const kind = payload.kind === "diary" ? "diary" : "dev";
  const title = String(payload.title ?? "").trim();
  const entryDate = String(payload.entryDate ?? "").trim();
  if (!title || !/^\d{4}-\d{2}-\d{2}$/.test(entryDate)) {
    return Response.json({ error: "请填写标题和日期。" }, { status: 400 });
  }
  const [entry] = await getDb().insert(journalEntries).values({
    kind,
    title,
    content: String(payload.content ?? "").trim(),
    tags: String(payload.tags ?? "").trim(),
    mood: String(payload.mood ?? "平静").trim(),
    entryDate,
  }).returning();
  return Response.json({ entry }, { status: 201 });
}
