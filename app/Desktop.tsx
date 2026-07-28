"use client";

import { useEffect, useMemo, useState } from "react";

type SoftwareItem = {
  id: number;
  name: string;
  description: string;
  version: string;
  platform: string;
  officialUrl: string;
  fileName: string;
  fileSize: number;
  createdAt: string;
};

type WindowName = "software" | "about" | "admin";

function formatBytes(bytes: number) {
  if (!bytes) return "—";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index > 1 ? 1 : 0)} ${units[index]}`;
}

function AppGlyph({ kind }: { kind: WindowName | "folder" }) {
  if (kind === "software") return <span className="glyph glyph-download" aria-hidden="true">↓</span>;
  if (kind === "admin") return <span className="glyph glyph-journal" aria-hidden="true">▤</span>;
  if (kind === "about") return <span className="glyph glyph-home" aria-hidden="true">⌂</span>;
  return <span className="glyph glyph-folder" aria-hidden="true">⌑</span>;
}

export default function Desktop() {
  const [activeWindow, setActiveWindow] = useState<WindowName>("software");
  const [isMinimized, setIsMinimized] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState("全部");
  const [items, setItems] = useState<SoftwareItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = window.setInterval(() => setTime(new Date()), 30_000);
    fetch("/api/software")
      .then((response) => response.json())
      .then((data) => setItems(data.software ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
    return () => window.clearInterval(timer);
  }, []);

  const platforms = useMemo(() => ["全部", ...Array.from(new Set(items.map((item) => item.platform)))], [items]);
  const visibleItems = useMemo(() => items.filter((item) => {
    const matchesPlatform = platform === "全部" || item.platform === platform;
    const haystack = `${item.name} ${item.description} ${item.version}`.toLowerCase();
    return matchesPlatform && haystack.includes(query.trim().toLowerCase());
  }), [items, platform, query]);

  function openWindow(name: WindowName) {
    setActiveWindow(name);
    setIsMinimized(false);
    setStartOpen(false);
  }

  const formattedTime = time
    ? new Intl.DateTimeFormat("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false }).format(time)
    : "--:--";
  const formattedDate = time
    ? new Intl.DateTimeFormat("zh-CN", { month: "2-digit", day: "2-digit", weekday: "short" }).format(time)
    : "正在同步";

  return (
    <main className="desktop-shell" onClick={() => startOpen && setStartOpen(false)}>
      <div className="wallpaper-shape shape-a" />
      <div className="wallpaper-shape shape-b" />
      <div className="desktop-brand" aria-label="糯米的小窝">
        <span className="brand-kicker">NUOMI&apos;S DESKTOP</span>
        <strong>糯米的小窝</strong>
        <span>把喜欢的工具和生活片段，安静地放在一起。</span>
      </div>

      <nav className="desktop-icons" aria-label="桌面快捷方式">
        <button onDoubleClick={() => openWindow("software")} onClick={() => openWindow("software")}>
          <AppGlyph kind="software" /><span>软件库</span>
        </button>
        <button onDoubleClick={() => openWindow("about")} onClick={() => openWindow("about")}>
          <AppGlyph kind="about" /><span>关于小窝</span>
        </button>
        <button onDoubleClick={() => openWindow("admin")} onClick={() => openWindow("admin")}>
          <AppGlyph kind="admin" /><span>日志与日记</span><i className="lock-dot">锁</i>
        </button>
      </nav>

      {!isMinimized && (
        <section className={`app-window app-window-${activeWindow}`} aria-label={`${activeWindow} 窗口`}>
          <header className="window-bar">
            <div className="window-title">
              <span className="mini-mark"><i /><i /><i /><i /></span>
              <span>{activeWindow === "software" ? "软件库" : activeWindow === "about" ? "关于小窝" : "管理员空间"}</span>
            </div>
            <div className="window-controls">
              <button onClick={() => setIsMinimized(true)} aria-label="最小化">—</button>
              <button aria-label="最大化" disabled>□</button>
              <button onClick={() => setIsMinimized(true)} aria-label="关闭">×</button>
            </div>
          </header>

          {activeWindow === "software" && (
            <div className="software-app">
              <aside className="software-sidebar">
                <div className="side-label">我的收藏</div>
                {platforms.map((name) => (
                  <button key={name} className={platform === name ? "active" : ""} onClick={() => setPlatform(name)}>
                    <span>{name === "全部" ? "▦" : "◇"}</span>{name}
                  </button>
                ))}
                <div className="side-note">
                  <span className="pulse-dot" />
                  安装包由糯米亲自收藏
                </div>
              </aside>
              <div className="software-main">
                <div className="software-heading">
                  <div><span className="eyebrow">SOFTWARE SHELF</span><h1>常用软件</h1><p>免去反复翻找 Release 页的麻烦。</p></div>
                  <label className="search-box">
                    <span>⌕</span>
                    <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索软件" aria-label="搜索软件" />
                  </label>
                </div>
                <div className="software-meta"><span>{visibleItems.length} 个收藏</span><span>公开访问 · 随时下载</span></div>
                <div className="software-grid">
                  {loading ? Array.from({ length: 3 }).map((_, index) => <div className="software-card loading-card" key={index} />) : null}
                  {!loading && visibleItems.map((item) => (
                    <article className="software-card" key={item.id}>
                      <div className="software-icon"><AppGlyph kind="folder" /></div>
                      <div className="software-copy">
                        <div className="software-title"><h2>{item.name}</h2>{item.version && <span>v{item.version.replace(/^v/i, "")}</span>}</div>
                        <p>{item.description || "糯米收藏的开源小工具。"}</p>
                        <div className="software-stats"><span>{item.platform}</span><span>{formatBytes(item.fileSize)}</span></div>
                      </div>
                      <div className="software-actions">
                        <a className="download-button" href={`/api/software/${item.id}/download`}>下载安装包</a>
                        <a className="official-link" href={item.officialUrl} target="_blank" rel="noreferrer">官方页面 ↗</a>
                      </div>
                    </article>
                  ))}
                  {!loading && visibleItems.length === 0 && (
                    <div className="empty-shelf">
                      <div className="empty-folder"><span /></div>
                      <h2>{items.length ? "没有匹配的软件" : "软件架还是空的"}</h2>
                      <p>{items.length ? "换个关键词，或查看全部平台。" : "管理员上传第一个安装包后，它会出现在这里。"}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeWindow === "about" && (
            <div className="about-app">
              <div className="about-orbit"><span>糯</span><i /><i /><i /></div>
              <span className="eyebrow">A SMALL PLACE ON THE WEB</span>
              <h1>欢迎来到<br />糯米的小窝。</h1>
              <p>这里不是工作台，也不是公开博客。它更像一张长期使用的书桌：左边放随手可取的软件，抽屉里收着开发记录和只属于自己的日记。</p>
              <div className="about-tags"><span>开源软件</span><span>开发札记</span><span>私人日记</span></div>
            </div>
          )}

          {activeWindow === "admin" && (
            <div className="admin-gate">
              <div className="admin-illustration"><AppGlyph kind="admin" /><span className="key-hole" /></div>
              <span className="eyebrow">PRIVATE DRAWER</span>
              <h1>抽屉上了锁</h1>
              <p>开发日志、私人日记和软件上传只对管理员开放。</p>
              <a href="/admin" className="primary-button">使用管理员账号进入</a>
              <button onClick={() => openWindow("software")} className="text-button">返回软件库</button>
            </div>
          )}
        </section>
      )}

      {startOpen && (
        <div className="start-menu" onClick={(event) => event.stopPropagation()}>
          <div className="start-search">⌕　输入应用名称</div>
          <div className="start-heading"><span>已固定</span><small>糯米的小窝</small></div>
          <div className="start-grid">
            <button onClick={() => openWindow("software")}><AppGlyph kind="software" /><span>软件库</span></button>
            <button onClick={() => openWindow("about")}><AppGlyph kind="about" /><span>关于小窝</span></button>
            <button onClick={() => openWindow("admin")}><AppGlyph kind="admin" /><span>管理员</span></button>
          </div>
          <div className="start-footer"><span className="avatar">糯</span><span>糯米</span><a href="/admin" aria-label="进入管理员空间">⌁</a></div>
        </div>
      )}

      <footer className="taskbar">
        <div className="taskbar-center">
          <button className="start-button" onClick={(event) => { event.stopPropagation(); setStartOpen(!startOpen); }} aria-label="开始菜单"><span><i /><i /><i /><i /></span></button>
          <button className={activeWindow === "software" && !isMinimized ? "running" : ""} onClick={() => openWindow("software")} aria-label="软件库"><AppGlyph kind="software" /></button>
          <button className={activeWindow === "about" && !isMinimized ? "running" : ""} onClick={() => openWindow("about")} aria-label="关于小窝"><AppGlyph kind="about" /></button>
          <button className={activeWindow === "admin" && !isMinimized ? "running" : ""} onClick={() => openWindow("admin")} aria-label="管理员"><AppGlyph kind="admin" /></button>
        </div>
        <div className="taskbar-status"><span className="status-icons">⌃　◉　▰</span><span><strong>{formattedTime}</strong><small>{formattedDate}</small></span></div>
      </footer>
    </main>
  );
}
