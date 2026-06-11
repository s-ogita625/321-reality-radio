"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { RECRUIT_URL } from "@/data/site";

const NAV = [
  { href: "/", label: "トップ" },
  { href: "/schedule", label: "放送予定" },
  { href: "/archives", label: "アーカイブ" },
  { href: "/members", label: "MC紹介" },
];

type Social = { label: string; url: string };

export function SiteNav({
  mailFormUrl,
  socials = [],
}: {
  mailFormUrl?: string;
  socials?: Social[];
}) {
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

  const close = () => setOpen(false);

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
          open ? "max-h-[42rem]" : "max-h-0"
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

          {/* お便り / Vライバー */}
          <li className="mt-1 pt-2 border-t border-[var(--ink-soft)]/15">
            {mailFormUrl && (
              <a
                href={mailFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className="block px-4 py-3 rounded-xl font-bold text-[var(--ink)] hover:bg-white"
              >
                📮 お便り
              </a>
            )}
            <a
              href={RECRUIT_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
              className="block px-4 py-3 rounded-xl font-bold text-[var(--magenta)] hover:bg-white"
            >
              🎤 Vライバーになりたい方
            </a>
          </li>

          {/* 公式リンク */}
          {socials.length > 0 && (
            <li className="mt-1 pt-2 border-t border-[var(--ink-soft)]/15">
              <span className="block px-4 pb-1 text-[11px] font-bold tracking-wider text-[var(--ink-soft)] font-[family-name:var(--font-latin)]">
                公式リンク
              </span>
              <div className="grid grid-cols-2 gap-1">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={close}
                    className="block px-4 py-2.5 rounded-xl text-sm font-bold text-[var(--ink)] hover:bg-white"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
}
