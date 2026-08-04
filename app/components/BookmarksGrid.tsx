"use client";

import { useMemo, useState } from "react";

type Bookmark = {
  id: number;
  name: string;
  url: string;
  description: string;
  category: string;
  createdAt: string;
};

function favicon(url: string) {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return null;
  }
}

export function BookmarksGrid({ items, loading }: { items: Bookmark[]; loading: boolean }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部");

  const categories = useMemo(
    () => ["全部", ...Array.from(new Set(items.map((item) => item.category)))],
    [items],
  );

  const visibleItems = useMemo(
    () =>
      items.filter((item) => {
        const matchesCategory = category === "全部" || item.category === category;
        const haystack = `${item.name} ${item.description} ${item.url}`.toLowerCase();
        return matchesCategory && haystack.includes(query.trim().toLowerCase());
      }),
    [items, category, query],
  );

  return (
    <section id="bookmarks" className="page-section">
      <div className="section-header">
        <div>
          <span className="eyebrow">BOOKMARK SHELF</span>
          <h2>网址收藏</h2>
          <p>常用网站，随手可取。</p>
        </div>
        <label className="search-box">
          <span>⌕</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索网址…"
            aria-label="搜索网址"
          />
        </label>
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

      <div className="bookmark-grid">
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div className="bookmark-card loading-card" key={i} />
          ))}

        {!loading &&
          visibleItems.map((item) => (
            <a
              key={item.id}
              className="bookmark-card cursor-target"
              href={item.url}
              target="_blank"
              rel="noreferrer"
            >
              <div className="bookmark-favicon">
                {favicon(item.url) ? (
                  <img src={favicon(item.url)!} alt="" width={28} height={28} />
                ) : (
                  <span>⌁</span>
                )}
              </div>
              <div className="bookmark-body">
                <div className="bookmark-title">
                  <h3>{item.name}</h3>
                  <span className="bookmark-cat">{item.category}</span>
                </div>
                <p>{item.description || item.url}</p>
                <small>{item.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}</small>
              </div>
            </a>
          ))}

        {!loading && visibleItems.length === 0 && (
          <div className="empty-state bookmark-empty">
            <div className="empty-icon">⌁</div>
            <h3>{items.length ? "没有匹配的网址" : "收藏夹还是空的"}</h3>
            <p>
              {items.length
                ? "换个关键词，或查看全部分类。"
                : "管理员添加第一个网址后，它会出现在这里。"}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
