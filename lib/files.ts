import { env } from "cloudflare:workers";

export function getFilesBucket(): R2Bucket {
  const bucket = (env as unknown as { FILES?: R2Bucket }).FILES;
  if (!bucket) throw new Error("文件存储尚未连接。");
  return bucket;
}

export function safeDownloadName(name: string) {
  return name.replace(/[\r\n"\\/]/g, "_").slice(0, 180) || "download";
}
