import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import CursorOverlay from "./components/CursorOverlay";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "nuomi-home.local";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);
  return {
    metadataBase: base,
    title: "糯米的小窝",
    description: "糯米的个人软件收藏、开发日志与私人日记桌面。",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title: "糯米的小窝",
      description: "软件收藏 · 开发日志 · 私人日记",
      type: "website",
      images: [{ url: new URL("/og.png", base).toString(), width: 1200, height: 630, alt: "糯米的小窝" }],
    },
    twitter: { card: "summary_large_image", title: "糯米的小窝", description: "软件收藏 · 开发日志 · 私人日记", images: [new URL("/og.png", base).toString()] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <CursorOverlay />
        {children}
      </body>
    </html>
  );
}
