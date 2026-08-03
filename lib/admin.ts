import { getAdminSession } from "@/app/chatgpt-auth";

export async function requireAdminApi() {
  const authed = await getAdminSession();
  if (!authed) {
    return { response: Response.json({ error: "请先登录管理员账号。" }, { status: 401 }) };
  }
  return {};
}
