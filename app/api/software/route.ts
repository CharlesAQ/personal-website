import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { software } from "@/db/schema";
import { requireAdminApi } from "@/lib/admin";
import { getFilesBucket, safeDownloadName } from "@/lib/files";

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
    const form = await request.formData();
    const file = form.get("file");
    const name = String(form.get("name") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    const version = String(form.get("version") ?? "").trim();
    const platform = String(form.get("platform") ?? "Windows").trim();
    const officialUrl = String(form.get("officialUrl") ?? "").trim();

    if (!name || !(file instanceof File) || file.size === 0) {
      return Response.json({ error: "请填写软件名称并选择安装包。" }, { status: 400 });
    }
    if (file.size > 500 * 1024 * 1024) {
      return Response.json({ error: "单个安装包不能超过 500 MB。" }, { status: 400 });
    }
    let official: URL;
    try {
      official = new URL(officialUrl);
      if (!['http:', 'https:'].includes(official.protocol)) throw new Error();
    } catch {
      return Response.json({ error: "请填写有效的官方页面地址。" }, { status: 400 });
    }

    const key = `software/${crypto.randomUUID()}-${safeDownloadName(file.name)}`;
    await getFilesBucket().put(key, file.stream(), {
      httpMetadata: { contentType: file.type || "application/octet-stream" },
      customMetadata: { uploadedBy: auth.user.email },
    });

    try {
      const [item] = await getDb().insert(software).values({
        name,
        description,
        version,
        platform,
        officialUrl: official.toString(),
        fileName: safeDownloadName(file.name),
        fileKey: key,
        fileSize: file.size,
      }).returning();
      return Response.json({ item }, { status: 201 });
    } catch (error) {
      await getFilesBucket().delete(key);
      throw error;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "上传失败。";
    return Response.json({ error: message }, { status: 500 });
  }
}
