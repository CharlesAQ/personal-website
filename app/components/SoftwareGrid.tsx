"use client";

import { useMemo, useState } from "react";
import type { SoftwareItem } from "../types";
import { formatBytes } from "../lib/format";
import SpotlightCard from "./SpotlightCard/SpotlightCard";

type SoftwareGridProps = {
  items: SoftwareItem[];
  loading: boolean;
};

const SPOTLIGHT_COLOR = "rgba(23, 23, 23, 0.08)";

export function SoftwareGrid({ items, loading }: SoftwareGridProps) {
  const [platform, setPlatform] = useState("全部");

  const platforms = useMemo(
    () => ["全部", ...Array.from(new Set(items.map((item) => item.platform)))],
    [items],
  );

  const visibleItems = useMemo(
    () =>
      items.filter((item) => {
        return platform === "全部" || item.platform === platform;
      }),
    [items, platform],
  );

  return (
    <section id="software" className="page-section">
      <div className="section-header">
        <div>
          <span className="eyebrow">SOFTWARE SHELF</span>
          <h2>软件库</h2>
        </div>
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
      </div>

      <div className="tile-grid">
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div className="tile-card loading-card" key={i} />
          ))}

        {!loading &&
          visibleItems.map((item) => (
            <SpotlightCard
              key={item.id}
              className="tile-card"
              spotlightColor={SPOTLIGHT_COLOR}
            >
              <div className="tile-icon">
                <span className="file-glyph">⌑</span>
              </div>
              <div className="tile-name">{item.name}</div>
              {item.version && <div className="tile-version">v{item.version.replace(/^v/i, "")}</div>}
              <div className="tile-stats">
                <span>{item.platform}</span>
                <span>{formatBytes(item.fileSize)}</span>
              </div>
              <a className="tile-download" href={`/api/software/${item.id}/download`}>
                下载
              </a>
            </SpotlightCard>
          ))}

        {!loading && visibleItems.length === 0 && (
          <div className="empty-state tile-empty">
            <div className="empty-icon">⌑</div>
            <h3>{items.length ? "没有匹配的软件" : "软件架还是空的"}</h3>
            <p>
              {items.length
                ? "换个平台看看。"
                : "管理员添加第一个软件后，它会出现在这里。"}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
