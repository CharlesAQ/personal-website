"use client";

import { FormEvent, Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AdminPanel from "./AdminPanel";

function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const params = useSearchParams();
  const router = useRouter();

  async function login(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const response = await fetch("/api/auth", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (response.ok) {
      const returnTo = params.get("return_to") || "/admin";
      router.push(returnTo);
    } else {
      setError("密码不正确。");
    }
    setBusy(false);
  }

  return (
    <main className="denied-page">
      <section>
        <span className="denied-icon">⌁</span>
        <p className="eyebrow">PRIVATE DRAWER</p>
        <h1>抽屉上了锁</h1>
        <p>请输入管理员密码。</p>
        <form onSubmit={login} style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center", marginTop: 20 }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="管理员密码"
            required
            style={{ padding: "10px 16px", borderRadius: 18, border: "1px solid #e5e5e5", background: "#f5f5f5", color: "#0a0a0a", fontSize: 14, width: 220, textAlign: "center", outline: "none" }}
          />
          {error && <small style={{ color: "#f87171" }}>{error}</small>}
          <button className="primary-button" disabled={busy} type="submit">进入管理面板</button>
        </form>
        <div style={{ marginTop: 16 }}><a href="/">返回桌面</a></div>
      </section>
    </main>
  );
}

function AdminPageInner({ authed }: { authed: boolean }) {
  const router = useRouter();

  if (authed) {
    return <AdminPanel displayName="糯米" onSignOut={() => { router.push("/api/auth?action=logout"); }} />;
  }

  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

export default function AdminPageClient({ authed }: { authed: boolean }) {
  return <AdminPageInner authed={authed} />;
}
