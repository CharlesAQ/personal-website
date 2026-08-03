import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { software } from "@/db/schema";
import { requireAdminApi } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await getDb()
      .select({
        id: software.id,
        name: software.name,
        description: software.description,
        version: software.version,
        platform: software.platform,
        officialUrl: software.officialUrl,
        downloadUrl: software.downloadUrl,
        fileName: software.fileName,
        fileSize: software.fileSize,
        createdAt: software.createdAt,
      })
      .from(software)
      .orderBy(desc(software.createdAt), desc(software.id));
    return Response.json({ software: rows });
  } catch {
    return Response.json({ software: [], unavailable: true });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if ("response" in auth) return auth.response;

  try {
    const payload = await request.json() as Record<string, unknown>;
    const name = String(payload.name ?? "").trim();
    const description = String(payload.description ?? "").trim();
    const version = String(payload.version ?? "").trim();
    const platform = String(payload.platform ?? "Windows").trim();
    const officialUrl = String(payload.officialUrl ?? "").trim();
    const downloadUrl = String(payload.downloadUrl ?? "").trim();
    const fileName = String(payload.fileName ?? "").trim();
    const fileSize = Number(payload.fileSize ?? 0);

    if (!name || !downloadUrl) {
      return Response.json({ error: "请填写软件名称和下载链接。" }, { status: 400 });
    }

    let official: URL;
    try {
      official = new URL(officialUrl);
      if (!['http:', 'https:'].includes(official.protocol)) throw new Error();
    } catch {
      return Response.json({ error: "请填写有效的官方页面地址。" }, { status: 400 });
    }

    let dl: URL;
    try {
      dl = new URL(downloadUrl);
      if (!['http:', 'https:'].includes(dl.protocol)) throw new Error();
    } catch {
      return Response.json({ error: "请填写有效的下载链接。" }, { status: 400 });
    }

    const [item] = await getDb().insert(software).values({
      name,
      description,
      version,
      platform,
      officialUrl: official.toString(),
      downloadUrl: dl.toString(),
      fileName,
      fileSize,
    }).returning();
    return Response.json({ item }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "添加失败。";
    return Response.json({ error: message }, { status: 500 });
  }
}
