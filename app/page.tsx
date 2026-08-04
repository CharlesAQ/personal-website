"use client";

import { useEffect, useState } from "react";
import type { SoftwareItem } from "./types";
import { SoftwareGrid } from "./components/SoftwareGrid";
import { BookmarksGrid } from "./components/BookmarksGrid";
import FlipClock from "./components/FlipClock";
import ParticleText from "./components/ParticleText/ParticleText";
import PixelBlast from "./components/PixelBlast/PixelBlast";

type Bookmark = {
  id: number;
  name: string;
  url: string;
  description: string;
  category: string;
  createdAt: string;
};

export default function HomePage() {
  const [items, setItems] = useState<SoftwareItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [bookmarksLoading, setBookmarksLoading] = useState(true);

  useEffect(() => {
    fetch("/api/software")
      .then((r) => r.json())
      .then((d) => setItems(d.software ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));

    fetch("/api/bookmarks")
      .then((r) => r.json())
      .then((d) => setBookmarks(d.bookmarks ?? []))
      .catch(() => setBookmarks([]))
      .finally(() => setBookmarksLoading(false));
  }, []);

  return (
    <div className="page">
      {/* ── Nav ── */}
      <nav className="top-nav">
        <div className="nav-inner">
          <a href="/" className="nav-brand">
            <span className="brand-dot" />
            糯米的小窝
          </a>
          <div className="nav-links">
            <a href="#software">软件库</a>
            <a href="#bookmarks">网址收藏</a>
          <a href="#about">关于</a>
            <a href="/admin" className="nav-admin">管理</a>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero hero-with-bg">
        <div className="hero-bg" aria-hidden="true">
          <PixelBlast
            variant="square"
            color="#0a0a0a"
            pixelSize={3}
            patternScale={1.5}
            patternDensity={2}
            enableRipples
            rippleIntensityScale={2}
            rippleSpeed={0.5}
            edgeFade={0.4}
            speed={1}
          />
        </div>
        <div className="hero-inner">
          <span className="eyebrow">NUOMI&apos;S PLACE</span>
          <ParticleText
            text="糯米的小窝"
            color="#0a0a0a"
            highlightColor="#737373"
            particleSize={2.5}
            density={4}
            fontSize="clamp(52px, 7.5vw, 88px)"
            fontWeight={600}
            fontFamily="'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif"
            glow={false}
            trigger="mount"
            pointerRepel={70}
            repelRadius={140}
            idleDrift={1.2}
            style={{ height: 136, minHeight: 136, margin: "4px auto 0" }}
          />
          <p>
            把喜欢的工具和生活片段，安静地放在一起。
          </p>
          <FlipClock />
        </div>
      </section>

      {/* ── Software ── */}
      <SoftwareGrid items={items} loading={loading} />

      {/* ── Bookmarks ── */}
      <BookmarksGrid items={bookmarks} loading={bookmarksLoading} />

      {/* ── About ── */}
      <section id="about" className="page-section about-section">
        <div className="about-grid">
          <div className="about-orb">
            <img src="/avatar.JPG" alt="糯米的头像" />
          </div>
          <div>
            <span className="eyebrow">A SMALL PLACE ON THE WEB</span>
            <h2>关于小窝</h2>
            <p>
              一个安静的个人角落——软件库随手可取，抽屉深处收着开发笔记和私人日记。不喧哗，不社交，只是糯米在互联网上的一张书桌。
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="page-footer">
        <div className="footer-inner">
          <span>糯米的小窝</span>
          <span className="footer-dot">·</span>
          <span>Built with ❤️</span>
        </div>
      </footer>
    </div>
  );
}
