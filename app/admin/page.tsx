import { getAdminSession } from "@/app/chatgpt-auth";
import AdminPageClient from "./AdminPageClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authed = await getAdminSession();
  return <AdminPageClient authed={authed} />;
}
