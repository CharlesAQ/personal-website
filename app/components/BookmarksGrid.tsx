"use client";

import { useMemo, useState } from "react";
import PixelCard from "./PixelCard/PixelCard";

type Bookmark = {
  id: number;
  name: string;
  url: string;
  description: string;
  category: string;
  createdAt: string;
};

const PIXEL_COLORS = "#d4d4d4,#a3a3a3,#737373";

function favicon(url: string) {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return null;
  }
}

function BookmarkIcon({ url }: { url: string }) {
  const [failed, setFailed] = useState(false);
  const icon = favicon(url);
  if (!icon || failed) return <span>⌁</span>;
  return <img src={icon} alt="" onError={() => setFailed(true)} />;
}

export function BookmarksGrid({ items, loading }: { items: Bookmark[]; loading: boolean }) {
  const [category, setCategory] = useState("全部");

  const categories = useMemo(
    () => ["全部", ...Array.from(new Set(items.map((item) => item.category)))],
    [items],
  );

  const visibleItems = useMemo(
    () => items.filter((item) => category === "全部" || item.category === category),
    [items, category],
  );

  return (
    <section id="bookmarks" className="page-section">
      <div className="section-header">
        <div>
          <span className="eyebrow">BOOKMARK SHELF</span>
          <h2>网址收藏</h2>
        </div>
      </div>

      <div className="platform-filters">
        {categories.map((name) => (
          <button
            key={name}
            className={category === name ? "active" : ""}
            onClick={() => setCategory(name)}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="bookmark-meta">
        <span>{visibleItems.length} 个收藏</span>
      </div>

      <div className="tile-grid">
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div className="tile-card loading-card" key={i} />
          ))}

        {!loading &&
          visibleItems.map((item) => (
            <a key={item.id} href={item.url} target="_blank" rel="noreferrer" className="tile-link">
              <PixelCard colors={PIXEL_COLORS} gap={5} speed={40} className="tile-card">
                <div className="tile-icon tile-favicon">
                  <BookmarkIcon url={item.url} />
                </div>
                <div className="tile-name">{item.name}</div>
                <div className="tile-version">{item.category}</div>
              </PixelCard>
            </a>
          ))}

        {!loading && visibleItems.length === 0 && (
          <div className="empty-state tile-empty">
            <div className="empty-icon">⌁</div>
            <h3>{items.length ? "没有匹配的网址" : "收藏夹还是空的"}</h3>
            <p>
              {items.length
                ? "换个分类看看。"
                : "管理员添加第一个网址后，它会出现在这里。"}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
