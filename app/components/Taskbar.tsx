import type { WindowName } from "../types";
import { AppGlyph } from "./AppGlyph";

type TaskbarProps = {
  activeWindow: WindowName;
  isMinimized: boolean;
  startOpen: boolean;
  formattedTime: string;
  formattedDate: string;
  onOpenWindow: (name: WindowName) => void;
  onToggleStart: () => void;
};

export function Taskbar({
  activeWindow,
  isMinimized,
  startOpen,
  formattedTime,
  formattedDate,
  onOpenWindow,
  onToggleStart,
}: TaskbarProps) {
  return (
    <footer className="taskbar">
      <div className="taskbar-center">
        <button
          className="start-button"
          onClick={(event) => {
            event.stopPropagation();
            onToggleStart();
          }}
          aria-label="开始菜单"
        >
          <span>
            <i />
            <i />
            <i />
            <i />
          </span>
        </button>
        <button
          className={activeWindow === "software" && !isMinimized ? "running" : ""}
          onClick={() => onOpenWindow("software")}
          aria-label="软件库"
        >
          <AppGlyph kind="software" />
        </button>
        <button
          className={activeWindow === "about" && !isMinimized ? "running" : ""}
          onClick={() => onOpenWindow("about")}
          aria-label="关于小窝"
        >
          <AppGlyph kind="about" />
        </button>
        <button
          className={activeWindow === "admin" && !isMinimized ? "running" : ""}
          onClick={() => onOpenWindow("admin")}
          aria-label="管理员"
        >
          <AppGlyph kind="admin" />
        </button>
      </div>
      <div className="taskbar-status">
        <span className="status-icons">⌃　◉　▰</span>
        <span>
          <strong>{formattedTime}</strong>
          <small>{formattedDate}</small>
        </span>
      </div>
    </footer>
  );
}
