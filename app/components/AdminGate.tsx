import type { WindowName } from "../types";
import { AppGlyph } from "./AppGlyph";

export function AdminGate({ onOpenWindow }: { onOpenWindow: (name: WindowName) => void }) {
  return (
    <div className="admin-gate">
      <div className="admin-illustration">
        <AppGlyph kind="admin" />
        <span className="key-hole" />
      </div>
      <span className="eyebrow">PRIVATE DRAWER</span>
      <h1>抽屉上了锁</h1>
      <p>开发日志、私人日记和软件上传只对管理员开放。</p>
      <a href="/admin" className="primary-button">
        使用管理员账号进入
      </a>
      <button onClick={() => onOpenWindow("software")} className="text-button">
        返回软件库
      </button>
    </div>
  );
}
