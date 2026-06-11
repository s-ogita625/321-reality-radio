"use client";

import { useEffect, useState } from "react";

/**
 * スマホ表示時、左下に常時表示する「お便り」ボタン。
 * トップの「お便り募集中」セクション(#otayori-cta)が画面に入ると非表示になる。
 * 該当セクションが無いページ（下層ページ）では常に表示。
 */
export function FloatingMailButton({ href }: { href: string }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const target = document.getElementById("otayori-cta");
    if (!target) return; // 対象が無いページでは常時表示
    const io = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { threshold: 0.01 },
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);

  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="お便りを送る"
      className={`md:hidden fixed bottom-4 left-4 z-40 pill bg-brand text-white shadow-[0_10px_30px_-8px_rgba(154,99,230,0.7)] px-4 py-3 text-sm font-bold ring-2 ring-white/70 transition-all duration-300 ${
        hidden
          ? "opacity-0 translate-y-3 pointer-events-none"
          : "opacity-100 translate-y-0 animate-pulse-ring"
      }`}
    >
      📮 お便り
    </a>
  );
}
