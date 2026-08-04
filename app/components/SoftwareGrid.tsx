"use client";

import { useEffect, useMemo, useState } from "react";
import type { SoftwareItem } from "../types";
import { formatBytes } from "../lib/format";

type SoftwareGridProps = {
  items: SoftwareItem[];
  loading: boolean;
};

export function SoftwareGrid({ items, loading }: SoftwareGridProps) {
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState("全部");

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

  return (
    <section id="software" className="page-section">
      <div className="section-header">
        <div>
          <span className="eyebrow">SOFTWARE SHELF</span>
          <h2>软件库</h2>
          <p>免去反复翻找 Release 页的麻烦。</p>
        </div>
        <label className="search-box">
          <span>⌕</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索软件…"
            aria-label="搜索软件"
          />
        </label>
      </div>

      <div className="platform-filters">
        {platforms.map((name) => (
          <button
            key={name}
            className={platform === name ? "active" : ""}
            onClick={() => setPlatform(name)}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="software-meta">
        <span>{visibleItems.length} 个收藏</span>
        <span>公开访问 · 随时下载</span>
      </div>

      <div className="software-grid">
        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div className="software-card loading-card" key={i} />
          ))}

        {!loading &&
          visibleItems.map((item) => (
            <article className="software-card cursor-target" key={item.id}>
              <div className="software-icon">
                <span className="file-glyph">⌑</span>
              </div>
              <div className="software-body">
                <div className="software-title">
                  <h3>{item.name}</h3>
                  {item.version && <span>v{item.version.replace(/^v/i, "")}</span>}
                </div>
                <p>{item.description || "糯米收藏的开源小工具。"}</p>
                <div className="software-stats">
                  <span>{item.platform}</span>
                  <span>{formatBytes(item.fileSize)}</span>
                </div>
              </div>
              <div className="software-actions">
                <a className="primary-button" href={`/api/software/${item.id}/download`}>
                  下载
                </a>
                <a className="ghost-link" href={item.officialUrl} target="_blank" rel="noreferrer">
                  官方页面 ↗
                </a>
              </div>
            </article>
          ))}

        {!loading && visibleItems.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">⌑</div>
            <h3>{items.length ? "没有匹配的软件" : "软件架还是空的"}</h3>
            <p>
              {items.length
                ? "换个关键词，或查看全部平台。"
                : "管理员添加第一个软件后，它会出现在这里。"}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
