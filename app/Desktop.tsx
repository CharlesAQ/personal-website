"use client";

import { useEffect, useMemo, useState } from "react";
import type { SoftwareItem, WindowName } from "./types";
import { DesktopIcons } from "./components/DesktopIcons";
import { StartMenu } from "./components/StartMenu";
import { Taskbar } from "./components/Taskbar";
import { SoftwareWindow } from "./components/SoftwareWindow";
import { AboutWindow } from "./components/AboutWindow";
import { AdminGate } from "./components/AdminGate";

export default function Desktop() {
  const [activeWindow, setActiveWindow] = useState<WindowName>("software");
  const [isMinimized, setIsMinimized] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState("全部");
  const [items, setItems] = useState<SoftwareItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState<Date | null>(null);

  // --- clock ---
  useEffect(() => {
    setTime(new Date());
    const timer = window.setInterval(() => setTime(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  // --- software data ---
  useEffect(() => {
    fetch("/api/software")
      .then((response) => response.json())
      .then((data) => setItems(data.software ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  // --- derived ---
  const platforms = useMemo(
    () => ["全部", ...Array.from(new Set(items.map((item) => item.platform)))],
    [items],
  );

  const visibleItems = useMemo(
    () =>
      items.filter((item) => {
        const matchesPlatform = platform === "全部" || item.platform === platform;
        const haystack = `${item.name} ${item.description} ${item.version}`.toLowerCase();
        return matchesPlatform && haystack.includes(query.trim().toLowerCase());
      }),
    [items, platform, query],
  );

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

  // --- window content ---
  function renderWindowContent() {
    switch (activeWindow) {
      case "software":
        return (
          <SoftwareWindow
            items={items}
            loading={loading}
            platforms={platforms}
            platform={platform}
            query={query}
            onPlatformChange={setPlatform}
            onQueryChange={setQuery}
            visibleItems={visibleItems}
          />
        );
      case "about":
        return <AboutWindow />;
      case "admin":
        return <AdminGate onOpenWindow={openWindow} />;
    }
  }

  const windowTitle =
    activeWindow === "software" ? "软件库" : activeWindow === "about" ? "关于小窝" : "管理员空间";

  return (
    <main className="desktop-shell" onClick={() => startOpen && setStartOpen(false)}>
      <div className="wallpaper-shape shape-a" />
      <div className="wallpaper-shape shape-b" />

      <div className="desktop-brand" aria-label="糯米的小窝">
        <span className="brand-kicker">NUOMI&apos;S DESKTOP</span>
        <strong>糯米的小窝</strong>
        <span>把喜欢的工具和生活片段，安静地放在一起。</span>
      </div>

      <DesktopIcons onOpenWindow={openWindow} />

      {!isMinimized && (
        <section className={`app-window app-window-${activeWindow}`} aria-label={`${activeWindow} 窗口`}>
          <header className="window-bar">
            <div className="window-title">
              <span className="mini-mark">
                <i />
                <i />
                <i />
                <i />
              </span>
              <span>{windowTitle}</span>
            </div>
            <div className="window-controls">
              <button onClick={() => setIsMinimized(true)} aria-label="最小化">—</button>
              <button aria-label="最大化" disabled>□</button>
              <button onClick={() => setIsMinimized(true)} aria-label="关闭">×</button>
            </div>
          </header>

          {renderWindowContent()}
        </section>
      )}

      {startOpen && <StartMenu onOpenWindow={openWindow} />}

      <Taskbar
        activeWindow={activeWindow}
        isMinimized={isMinimized}
        startOpen={startOpen}
        formattedTime={formattedTime}
        formattedDate={formattedDate}
        onOpenWindow={openWindow}
        onToggleStart={() => setStartOpen(!startOpen)}
      />
    </main>
  );
}
