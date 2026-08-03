import type { SoftwareItem } from "../types";
import { formatBytes } from "../lib/format";
import { AppGlyph } from "./AppGlyph";

type SoftwareWindowProps = {
  items: SoftwareItem[];
  loading: boolean;
  platforms: string[];
  platform: string;
  query: string;
  onPlatformChange: (platform: string) => void;
  onQueryChange: (query: string) => void;
  visibleItems: SoftwareItem[];
};

export function SoftwareWindow({
  items,
  loading,
  platforms,
  platform,
  query,
  onPlatformChange,
  onQueryChange,
  visibleItems,
}: SoftwareWindowProps) {
  return (
    <div className="software-app">
      <aside className="software-sidebar">
        <div className="side-label">我的收藏</div>
        {platforms.map((name) => (
          <button
            key={name}
            className={platform === name ? "active" : ""}
            onClick={() => onPlatformChange(name)}
          >
            <span>{name === "全部" ? "▦" : "◇"}</span>
            {name}
          </button>
        ))}
        <div className="side-note">
          <span className="pulse-dot" />
          安装包由糯米亲自收藏
        </div>
      </aside>

      <div className="software-main">
        <div className="software-heading">
          <div>
            <span className="eyebrow">SOFTWARE SHELF</span>
            <h1>常用软件</h1>
            <p>免去反复翻找 Release 页的麻烦。</p>
          </div>
          <label className="search-box">
            <span>⌕</span>
            <input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="搜索软件"
              aria-label="搜索软件"
            />
          </label>
        </div>

        <div className="software-meta">
          <span>{visibleItems.length} 个收藏</span>
          <span>公开访问 · 随时下载</span>
        </div>

        <div className="software-grid">
          {loading &&
            Array.from({ length: 3 }).map((_, index) => (
              <div className="software-card loading-card" key={index} />
            ))}

          {!loading &&
            visibleItems.map((item) => (
              <article className="software-card" key={item.id}>
                <div className="software-icon">
                  <AppGlyph kind="folder" />
                </div>
                <div className="software-copy">
                  <div className="software-title">
                    <h2>{item.name}</h2>
                    {item.version && <span>v{item.version.replace(/^v/i, "")}</span>}
                  </div>
                  <p>{item.description || "糯米收藏的开源小工具。"}</p>
                  <div className="software-stats">
                    <span>{item.platform}</span>
                    <span>{formatBytes(item.fileSize)}</span>
                  </div>
                </div>
                <div className="software-actions">
                  <a className="download-button" href={`/api/software/${item.id}/download`}>
                    下载安装包
                  </a>
                  <a className="official-link" href={item.officialUrl} target="_blank" rel="noreferrer">
                    官方页面 ↗
                  </a>
                </div>
              </article>
            ))}

          {!loading && visibleItems.length === 0 && (
            <div className="empty-shelf">
              <div className="empty-folder">
                <span />
              </div>
              <h2>{items.length ? "没有匹配的软件" : "软件架还是空的"}</h2>
              <p>
                {items.length
                  ? "换个关键词，或查看全部平台。"
                  : "管理员上传第一个安装包后，它会出现在这里。"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
