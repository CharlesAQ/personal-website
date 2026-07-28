import { env } from "cloudflare:workers";
import { getChatGPTUser } from "@/app/chatgpt-auth";

function configuredAdminEmail() {
  return (env as unknown as { ADMIN_EMAIL?: string }).ADMIN_EMAIL?.trim().toLowerCase();
}

export function isAdminEmail(email: string) {
  const adminEmail = configuredAdminEmail();
  return Boolean(adminEmail && email.trim().toLowerCase() === adminEmail);
}

export async function requireAdminApi() {
  const user = await getChatGPTUser();
  if (!user) {
    return { response: Response.json({ error: "请先登录管理员账号。" }, { status: 401 }) };
  }
  if (!isAdminEmail(user.email)) {
    return { response: Response.json({ error: "当前账号没有管理员权限。" }, { status: 403 }) };
  }
  return { user };
}
