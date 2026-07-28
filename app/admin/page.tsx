import { chatGPTSignOutPath, requireChatGPTUser } from "@/app/chatgpt-auth";
import { isAdminEmail } from "@/lib/admin";
import AdminPanel from "./AdminPanel";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireChatGPTUser("/admin");
  if (!isAdminEmail(user.email)) {
    return (
      <main className="denied-page">
        <section>
          <span className="denied-icon">⌁</span>
          <p className="eyebrow">ACCESS DENIED</p>
          <h1>这把钥匙打不开抽屉</h1>
          <p>当前登录的账号没有管理员权限。</p>
          <div><a href="/">返回桌面</a><a href={chatGPTSignOutPath("/admin")}>切换账号</a></div>
        </section>
      </main>
    );
  }
  return <AdminPanel displayName={user.displayName} signOutPath={chatGPTSignOutPath("/")} />;
}
