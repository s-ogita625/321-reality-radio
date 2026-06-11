"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";

const NAV = [
  { href: "/", label: "トップ" },
  { href: "/schedule", label: "放送予定" },
  { href: "/archives", label: "アーカイブ＆ゲスト" },
  { href: "/members", label: "MC紹介" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-50 transition-all ${
        scrolled ? "glass shadow-[0_8px_30px_-15px_rgba(154,99,230,0.4)]" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <Logo />

        {/* PC ナビ */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV.map((n) => (
            <li key={n.href}>
              <Link
                href={n.href}
                className={`relative px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                  isActive(n.href)
                    ? "text-white bg-brand shadow-[var(--shadow-pop)]"
                    : "text-[var(--ink)] hover:text-[var(--magenta)]"
                }`}
              >
                {n.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* モバイルトグル */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden grid place-items-center w-10 h-10 rounded-full glass"
          aria-label="メニュー"
          aria-expanded={open}
        >
          <span className="relative block w-5 h-3.5">
            <span
              className={`absolute left-0 top-0 w-5 h-0.5 bg-[var(--ink)] rounded transition-all ${
                open ? "translate-y-1.5 rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-1.5 w-5 h-0.5 bg-[var(--ink)] rounded transition-all ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-3 w-5 h-0.5 bg-[var(--ink)] rounded transition-all ${
                open ? "-translate-y-1.5 -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </nav>

      {/* モバイルメニュー */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? "max-h-80" : "max-h-0"
        }`}
      >
        <ul className="glass mx-4 mb-3 rounded-2xl p-2 flex flex-col gap-1">
          {NAV.map((n) => (
            <li key={n.href}>
              <Link
                href={n.href}
                className={`block px-4 py-3 rounded-xl font-bold ${
                  isActive(n.href)
                    ? "text-white bg-brand"
                    : "text-[var(--ink)] hover:bg-white"
                }`}
              >
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
