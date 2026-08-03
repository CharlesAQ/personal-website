import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { software } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) return new Response("Not found", { status: 404 });

  const [item] = await getDb().select().from(software).where(eq(software.id, numericId)).limit(1);
  if (!item) return new Response("Not found", { status: 404 });

  return Response.redirect(item.downloadUrl, 302);
}
