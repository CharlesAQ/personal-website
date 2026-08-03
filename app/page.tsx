"use client";

import { useEffect, useState } from "react";
import type { SoftwareItem } from "./types";
import { SoftwareGrid } from "./components/SoftwareGrid";

export default function HomePage() {
  const [items, setItems] = useState<SoftwareItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/software")
      .then((r) => r.json())
      .then((d) => setItems(d.software ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
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
            <a href="#about">关于</a>
            <a href="/admin" className="nav-admin">管理</a>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <span className="eyebrow">NUOMI&apos;S PLACE</span>
        <h1>糯米的小窝</h1>
        <p>
          把喜欢的工具和生活片段，安静地放在一起。
        </p>
      </section>

      {/* ── Software ── */}
      <SoftwareGrid items={items} loading={loading} />

      {/* ── About ── */}
      <section id="about" className="page-section about-section">
        <div className="about-grid">
          <div className="about-orb">
            <img src="/avatar.jpg" alt="糯米的头像" />
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
