"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import RichEditor from "../components/RichEditor";

type Tab = "software" | "dev" | "diary";
type SoftwareItem = { id: number; name: string; description: string; version: string; platform: string; fileName: string; fileSize: number; officialUrl: string; downloadUrl: string };
type Entry = { id: number; kind: "dev" | "diary"; title: string; content: string; tags: string; mood: string; entryDate: string };

const today = new Date().toISOString().slice(0, 10);

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), 3);
  return `${(bytes / 1024 ** index).toFixed(index > 1 ? 1 : 0)} ${["B", "KB", "MB", "GB"][index]}`;
}

export default function AdminPanel({ displayName, onSignOut }: { displayName: string; onSignOut: () => void }) {
  const [tab, setTab] = useState<Tab>("software");
  const [software, setSoftware] = useState<SoftwareItem[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [entryDraft, setEntryDraft] = useState({ title: "", content: "", tags: "", mood: "平静", entryDate: today });
  const [editingSoftwareId, setEditingSoftwareId] = useState<number | null>(null);
  const [softwareDraft, setSoftwareDraft] = useState({ name: "", description: "", version: "", platform: "Windows", officialUrl: "", downloadUrl: "", fileName: "", fileSize: 0 });

  const loadSoftware = useCallback(async () => {
    const response = await fetch("/api/software");
    const data = await response.json();
    setSoftware(data.software ?? []);
  }, []);

  const loadEntries = useCallback(async (activeTab: Tab, q = "") => {
    if (activeTab === "software") return;
    const params = new URLSearchParams({ kind: activeTab, q });
    const response = await fetch(`/api/journal?${params}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "无法读取日志。");
    setEntries(data.entries ?? []);
  }, []);

  useEffect(() => { loadSoftware(); }, [loadSoftware]);
  useEffect(() => {
    setSelectedId(null);
    setEntryDraft({ title: "", content: "", tags: "", mood: "平静", entryDate: today });
    if (tab !== "software") loadEntries(tab).catch((error) => setNotice(error.message));
  }, [tab, loadEntries]);

  async function uploadSoftware(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setNotice(editingSoftwareId ? "正在保存…" : "正在添加…");
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload: Record<string, unknown> = {};
    formData.forEach((value, key) => { payload[key] = value; });
    const fileSize = parseInt(String(payload.fileSize ?? "0"), 10) || 0;
    const body = { ...payload, fileSize };

    const endpoint = editingSoftwareId ? `/api/software/${editingSoftwareId}` : "/api/software";
    const method = editingSoftwareId ? "PATCH" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (response.ok) {
        form.reset();
        setEditingSoftwareId(null);
        setSoftwareDraft({ name: "", description: "", version: "", platform: "Windows", officialUrl: "", downloadUrl: "", fileName: "", fileSize: 0 });
        setNotice(editingSoftwareId ? "软件已更新。" : "软件已放上公开书架。");
        await loadSoftware();
      } else {
        setNotice(data.error || "保存失败。");
      }
    } catch {
      setNotice("网络错误，请重试。");
    } finally {
      setBusy(false);
    }
  }

  function editSoftware(item: SoftwareItem) {
    setEditingSoftwareId(item.id);
    setSoftwareDraft({
      name: item.name,
      description: item.description || "",
      version: item.version,
      platform: item.platform,
      officialUrl: item.officialUrl,
      downloadUrl: item.downloadUrl,
      fileName: item.fileName || "",
      fileSize: item.fileSize || 0,
    });
  }

  function cancelEdit() {
    setEditingSoftwareId(null);
    setSoftwareDraft({ name: "", description: "", version: "", platform: "Windows", officialUrl: "", downloadUrl: "", fileName: "", fileSize: 0 });
  }

  async function deleteSoftware(id: number) {
    if (!window.confirm("同时删除安装包和软件信息？")) return;
    const response = await fetch(`/api/software/${id}`, { method: "DELETE" });
    const data = await response.json();
    setNotice(response.ok ? "软件已删除。" : data.error || "删除失败。");
    if (response.ok) loadSoftware();
  }

  function editEntry(entry: Entry) {
    setSelectedId(entry.id);
    setEntryDraft({ title: entry.title, content: entry.content, tags: entry.tags, mood: entry.mood, entryDate: entry.entryDate });
  }

  function newEntry() {
    setSelectedId(null);
    setEntryDraft({ title: "", content: "", tags: "", mood: "平静", entryDate: today });
    // Focus the title input after state update
    setTimeout(() => {
      const input = document.querySelector<HTMLInputElement>(".title-input");
      input?.focus();
    }, 0);
  }

  async function saveEntry(event: FormEvent) {
    event.preventDefault();
    setBusy(true); setNotice("正在保存…");
    const endpoint = selectedId ? `/api/journal/${selectedId}` : "/api/journal";
    const response = await fetch(endpoint, {
      method: selectedId ? "PATCH" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...entryDraft, kind: tab }),
    });
    const data = await response.json();
    if (response.ok) {
      setNotice(selectedId ? "修改已保存。" : "新记录已保存。");
      setSelectedId(data.entry.id);
      await loadEntries(tab, query);
    } else setNotice(data.error || "保存失败。");
    setBusy(false);
  }

  async function deleteEntry() {
    if (!selectedId || !window.confirm("确定删除这条记录？")) return;
    const response = await fetch(`/api/journal/${selectedId}`, { method: "DELETE" });
    const data = await response.json();
    setNotice(response.ok ? "记录已删除。" : data.error || "删除失败。");
    if (response.ok) { newEntry(); loadEntries(tab, query); }
  }

  return (
    <main className="admin-page">
      <aside className="admin-sidebar">
        <a className="admin-logo" href="/"><span className="mini-mark"><i /><i /><i /><i /></span><strong>糯米的小窝</strong></a>
        <p className="admin-caption">PRIVATE DESK</p>
        <nav>
          <button className={tab === "software" ? "active" : ""} onClick={() => setTab("software")}><span>↓</span>软件管理</button>
          <button className={tab === "dev" ? "active" : ""} onClick={() => setTab("dev")}><span>⌘</span>开发日志</button>
          <button className={tab === "diary" ? "active" : ""} onClick={() => setTab("diary")}><span>✦</span>私人日记</button>
        </nav>
        <div className="admin-account"><span className="avatar">糯</span><div><strong>{displayName}</strong><a href="#" onClick={(e) => { e.preventDefault(); onSignOut(); }}>退出登录</a></div></div>
      </aside>

      <section className="admin-workspace">
        <header className="admin-topbar">
          <div><span className="eyebrow">{tab === "software" ? "PUBLIC LIBRARY" : "PRIVATE NOTES"}</span><h1>{tab === "software" ? "软件管理" : tab === "dev" ? "开发日志" : "私人日记"}</h1></div>
          <div className="secure-pill"><span />仅管理员可见</div>
        </header>

        {notice && <div className="notice" role="status"><span>{notice}</span><button onClick={() => setNotice("")}>×</button></div>}

        {tab === "software" ? (
          <div className="software-admin-layout">
            <form className="admin-card upload-form" onSubmit={uploadSoftware}>
              <div className="card-heading">
                <div>
                  <span className="eyebrow">{editingSoftwareId ? "EDIT PACKAGE" : "NEW PACKAGE"}</span>
                  <h2>{editingSoftwareId ? "编辑软件" : "上传软件"}</h2>
                </div>
                <span className="step-badge">公开</span>
              </div>
              <label>软件名称<input name="name" required placeholder="例如：LocalSend" value={softwareDraft.name} onChange={(e) => setSoftwareDraft({ ...softwareDraft, name: e.target.value })} /></label>
              <div className="form-row"><label>版本号<input name="version" placeholder="1.17.0" value={softwareDraft.version} onChange={(e) => setSoftwareDraft({ ...softwareDraft, version: e.target.value })} /></label><label>平台<select name="platform" value={softwareDraft.platform} onChange={(e) => setSoftwareDraft({ ...softwareDraft, platform: e.target.value })}><option>Windows</option><option>macOS</option><option>Linux</option><option>跨平台</option></select></label></div>
              <label>一句话说明<textarea name="description" rows={3} placeholder="这个工具解决什么问题？" value={softwareDraft.description} onChange={(e) => setSoftwareDraft({ ...softwareDraft, description: e.target.value })} /></label>
              <label>官方页面<input name="officialUrl" type="url" required placeholder="https://github.com/…" value={softwareDraft.officialUrl} onChange={(e) => setSoftwareDraft({ ...softwareDraft, officialUrl: e.target.value })} /></label>
              <label>下载链接<input name="downloadUrl" type="url" required placeholder="https://github.com/…/releases/download/…" value={softwareDraft.downloadUrl} onChange={(e) => setSoftwareDraft({ ...softwareDraft, downloadUrl: e.target.value })} /></label>
              <div className="form-row"><label>文件名<small>（可选，仅展示）</small><input name="fileName" placeholder="app-v1.0-x64.zip" value={softwareDraft.fileName} onChange={(e) => setSoftwareDraft({ ...softwareDraft, fileName: e.target.value })} /></label><label>文件大小 (MB)<input name="fileSize" type="number" placeholder="0" value={softwareDraft.fileSize || ""} onChange={(e) => setSoftwareDraft({ ...softwareDraft, fileSize: parseInt(e.target.value) || 0 })} /></label></div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="primary-button" disabled={busy} style={{ flex: 1 }}>{editingSoftwareId ? "保存修改" : "添加到书架"}</button>
                {editingSoftwareId && <button type="button" className="ghost-button" onClick={cancelEdit}>取消</button>}
              </div>
            </form>
            <div className="admin-card package-list">
              <div className="card-heading"><div><span className="eyebrow">ON THE SHELF</span><h2>已有软件</h2></div><span className="count-badge">{software.length}</span></div>
              {software.length ? software.map((item) => <article key={item.id}><div className="package-icon">⌑</div><div><strong>{item.name}</strong><span>{item.version ? `v${item.version.replace(/^v/i, "")} · ` : ""}{item.platform}{item.fileSize ? ` · ${formatBytes(item.fileSize)}` : ""}</span>{item.fileName && <small>{item.fileName}</small>}</div><div className="package-actions"><button onClick={() => editSoftware(item)}>编辑</button><button onClick={() => deleteSoftware(item.id)}>删除</button></div></article>) : <div className="admin-empty"><span>⌑</span><p>还没有上传软件</p></div>}
            </div>
          </div>
        ) : (
          <div className="journal-layout">
            <aside className="entry-list admin-card">
              <div className="entry-list-tools"><label><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === "Enter" && loadEntries(tab, query)} placeholder="搜索记录" /></label><button type="button" onClick={newEntry}>＋</button></div>
              <div className="entry-scroll">
                {entries.map((entry) => <button key={entry.id} className={selectedId === entry.id ? "selected" : ""} onClick={() => editEntry(entry)}><span>{entry.entryDate}</span><strong>{entry.title}</strong><small>{entry.tags || entry.content.slice(0, 38) || "还没有正文"}</small></button>)}
                {!entries.length && <div className="admin-empty"><span>▤</span><p>写下第一条{tab === "dev" ? "开发记录" : "日记"}</p></div>}
              </div>
            </aside>
            <form className="editor admin-card" onSubmit={saveEntry}>
              <div className="editor-toolbar"><span>{selectedId ? "正在编辑" : "新建记录"}</span><div>{selectedId && <button type="button" className="danger-text" onClick={deleteEntry}>删除</button>}<button className="primary-button" disabled={busy}>保存</button></div></div>
              <input className="title-input" value={entryDraft.title} onChange={(event) => setEntryDraft({ ...entryDraft, title: event.target.value })} placeholder={tab === "dev" ? "这次解决了什么？" : "今天发生了什么？"} required />
              <div className="editor-meta"><label>日期<input type="date" value={entryDraft.entryDate} onChange={(event) => setEntryDraft({ ...entryDraft, entryDate: event.target.value })} /></label><label>心情<select value={entryDraft.mood} onChange={(event) => setEntryDraft({ ...entryDraft, mood: event.target.value })}><option>平静</option><option>开心</option><option>专注</option><option>疲惫</option><option>有灵感</option></select></label><label>标签<input value={entryDraft.tags} onChange={(event) => setEntryDraft({ ...entryDraft, tags: event.target.value })} placeholder="用逗号分隔" /></label></div>
              <div className="content-editor-wrapper">
                <RichEditor
                  content={entryDraft.content}
                  onChange={(html) => setEntryDraft({ ...entryDraft, content: html })}
                  placeholder={tab === "dev" ? "记录思路、问题、取舍和下一步……" : "这里完全只属于你……"}
                />
              </div>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}
