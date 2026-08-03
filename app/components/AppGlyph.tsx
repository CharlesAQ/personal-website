import type { WindowName } from "../types";

export function AppGlyph({ kind }: { kind: WindowName | "folder" }) {
  if (kind === "software") return <span className="glyph glyph-download" aria-hidden="true">↓</span>;
  if (kind === "admin") return <span className="glyph glyph-journal" aria-hidden="true">▤</span>;
  if (kind === "about") return <span className="glyph glyph-home" aria-hidden="true">⌂</span>;
  return <span className="glyph glyph-folder" aria-hidden="true">⌑</span>;
}
