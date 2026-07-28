import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { software } from "@/db/schema";
import { getFilesBucket, safeDownloadName } from "@/lib/files";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) return new Response("Not found", { status: 404 });

  const [item] = await getDb().select().from(software).where(eq(software.id, numericId)).limit(1);
  if (!item) return new Response("Not found", { status: 404 });
  const object = await getFilesBucket().get(item.fileKey);
  if (!object) return new Response("File not found", { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("content-length", String(object.size));
  headers.set("content-disposition", `attachment; filename*=UTF-8''${encodeURIComponent(safeDownloadName(item.fileName))}`);
  headers.set("cache-control", "private, max-age=0, must-revalidate");
  return new Response(object.body, { headers });
}
