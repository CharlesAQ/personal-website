import type { WindowName } from "../types";
import { AppGlyph } from "./AppGlyph";

export function StartMenu({ onOpenWindow }: { onOpenWindow: (name: WindowName) => void }) {
  return (
    <div className="start-menu" onClick={(event) => event.stopPropagation()}>
      <div className="start-search">⌕　输入应用名称</div>
      <div className="start-heading">
        <span>已固定</span>
        <small>糯米的小窝</small>
      </div>
      <div className="start-grid">
        <button onClick={() => onOpenWindow("software")}>
          <AppGlyph kind="software" />
          <span>软件库</span>
        </button>
        <button onClick={() => onOpenWindow("about")}>
          <AppGlyph kind="about" />
          <span>关于小窝</span>
        </button>
        <button onClick={() => onOpenWindow("admin")}>
          <AppGlyph kind="admin" />
          <span>管理员</span>
        </button>
      </div>
      <div className="start-footer">
        <span className="avatar">糯</span>
        <span>糯米</span>
        <a href="/admin" aria-label="进入管理员空间">⌁</a>
      </div>
    </div>
  );
}
