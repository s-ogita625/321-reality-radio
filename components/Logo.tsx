import Link from "next/link";

/** ヘッドホンのアイコン（バナーのモチーフ） */
export function Headphones({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M4 13a8 8 0 0 1 16 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect x="3" y="13" width="4" height="7" rx="2" fill="currentColor" />
      <rect x="17" y="13" width="4" height="7" rx="2" fill="currentColor" />
    </svg>
  );
}

/** 番組ロゴ（ワードマーク） */
export function Logo({
  className = "",
  href = "/",
}: {
  className?: string;
  href?: string | null;
}) {
  const inner = (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="grid place-items-center w-9 h-9 rounded-full bg-brand text-white shadow-[var(--shadow-pop)]">
        <Headphones className="w-5 h-5" />
      </span>
      <span className="leading-none">
        <span className="block font-[family-name:var(--font-latin)] text-[10px] tracking-[0.25em] text-[var(--ink-soft)]">
          321 REALITY
        </span>
        <span className="block font-[family-name:var(--font-display)] text-lg text-grad">
          ラジオ
        </span>
      </span>
    </span>
  );
  if (href === null) return inner;
  return (
    <Link href={href} aria-label="321 REALITY ラジオ トップへ">
      {inner}
    </Link>
  );
}
