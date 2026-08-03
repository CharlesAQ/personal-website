import type { WindowName } from "../types";
import { AppGlyph } from "./AppGlyph";

export function DesktopIcons({ onOpenWindow }: { onOpenWindow: (name: WindowName) => void }) {
  return (
    <nav className="desktop-icons" aria-label="桌面快捷方式">
      <button
        onDoubleClick={() => onOpenWindow("software")}
        onClick={() => onOpenWindow("software")}
      >
        <AppGlyph kind="software" />
        <span>软件库</span>
      </button>
      <button
        onDoubleClick={() => onOpenWindow("about")}
        onClick={() => onOpenWindow("about")}
      >
        <AppGlyph kind="about" />
        <span>关于小窝</span>
      </button>
      <button
        onDoubleClick={() => onOpenWindow("admin")}
        onClick={() => onOpenWindow("admin")}
      >
        <AppGlyph kind="admin" />
        <span>日志与日记</span>
        <i className="lock-dot">锁</i>
      </button>
    </nav>
  );
}
