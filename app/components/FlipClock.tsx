"use client";

import { useEffect, useRef, useState } from "react";

// 单个翻页数字卡片
function FlipDigit({ value, animate = false }: { value: string; animate?: boolean }) {
  const [prev, setPrev] = useState(value);
  const [active, setActive] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (value === prev) return;

    if (!animate) {
      setPrev(value);
      return;
    }

    // 翻页动画：上半块先翻转，然后同步新值
    setActive(true);
    timerRef.current = window.setTimeout(() => {
      setPrev(value);
      setActive(false);
    }, 320);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [value, prev, animate]);

  return (
    <div className="flip-digit">
      <div className={`flip-half flip-top ${active ? "flipping-top" : ""}`}>
        <span>{active ? prev : value}</span>
      </div>
      <div className={`flip-half flip-bottom ${active ? "flipping-bottom" : ""}`}>
        <span>{value}</span>
      </div>
      <div className="flip-seam" />
    </div>
  );
}

// 冒号分隔符
function Colon({ blinking }: { blinking: boolean }) {
  return (
    <div className={`flip-colon ${blinking ? "blink" : ""}`} aria-hidden="true">
      <i />
      <i />
    </div>
  );
}

export default function FlipClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (!now) return null;

  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  const dateText = new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(now);

  return (
    <div className="flip-clock">
      <div className="flip-clock-digits">
        <FlipDigit value={hh[0]} />
        <FlipDigit value={hh[1]} />
        <Colon blinking />
        <FlipDigit value={mm[0]} animate />
        <FlipDigit value={mm[1]} animate />
        <Colon blinking />
        <FlipDigit value={ss[0]} />
        <FlipDigit value={ss[1]} />
      </div>
      <div className="flip-clock-date">{dateText}</div>
    </div>
  );
}
