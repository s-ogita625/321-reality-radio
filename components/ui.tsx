import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { getMemberBySlug } from "@/lib/content";

/** セクション見出し（小ラベル＋大見出し） */
export function SectionTitle({
  label,
  title,
  align = "left",
  className = "",
}: {
  label: string;
  title: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={`${align === "center" ? "text-center" : ""} ${className}`}>
      <span className="pill bg-white/70 text-[var(--magenta)] text-xs px-3 py-1.5 border border-[var(--magenta)]/20 shadow-sm font-[family-name:var(--font-latin)] tracking-[0.18em]">
        {label}
      </span>
      <h2 className="mt-3 font-[family-name:var(--font-rounded)] font-black text-3xl sm:text-4xl text-[var(--ink)] leading-tight">
        {title}
      </h2>
    </div>
  );
}

/** ステータスバッジ */
export function StatusBadge({ status }: { status: "upcoming" | "live" | "ended" }) {
  if (status === "live") {
    return (
      <span className="pill shine bg-[linear-gradient(90deg,#ff5a9e,#e457c9,#ff5a9e)] text-white text-xs px-3 py-1.5">
        <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> LIVE配信中
      </span>
    );
  }
  if (status === "ended") {
    return (
      <span className="pill bg-[var(--ink-soft)]/15 text-[var(--ink-soft)] text-xs px-3 py-1.5">
        放送終了
      </span>
    );
  }
  return (
    <span className="pill bg-brand text-white text-xs px-3 py-1.5">放送予定</span>
  );
}

/** 16:9 サムネイル枠（画像が無ければグラデーションのプレースホルダ） */
export function Thumb16x9({
  src,
  alt,
  label,
  className = "",
}: {
  src?: string;
  alt: string;
  /** プレースホルダ時に中央に出すテキスト */
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative w-full aspect-video overflow-hidden rounded-2xl bg-soft ${className}`}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width:768px) 100vw, 33vw"
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-brand halftone">
          <span className="font-[family-name:var(--font-display)] text-white/90 text-sm sm:text-base px-4 text-center drop-shadow">
            {label ?? "COMING SOON"}
          </span>
        </div>
      )}
    </div>
  );
}

/** MC のミニアバター（丸・テーマカラー枠）。slug を渡す */
export async function MemberChip({
  slug,
  size = 36,
  withName = false,
}: {
  slug: string;
  size?: number;
  withName?: boolean;
}) {
  const m = await getMemberBySlug(slug);
  if (!m) return null;
  return (
    <Link
      href={`/members/${m.slug}`}
      className="inline-flex items-center gap-1.5 group"
      title={m.name}
    >
      <span
        className="relative inline-block rounded-full overflow-hidden ring-2 ring-white shadow-sm transition-transform group-hover:scale-110"
        style={{ width: size, height: size, background: m.colorSub }}
      >
        <Image
          src={m.image}
          alt={m.name}
          width={size * 2}
          height={size * 2}
          className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[150%] max-w-none"
        />
      </span>
      {withName && (
        <span className="text-sm font-bold text-[var(--ink)]">{m.name}</span>
      )}
    </Link>
  );
}

/** 出演者の重なりアバター列 */
export function HostStack({ slugs }: { slugs: string[] }) {
  return (
    <div className="flex -space-x-2">
      {slugs.map((s) => (
        <MemberChip key={s} slug={s} size={30} />
      ))}
    </div>
  );
}

/** グラデーションのボタン */
export function GradButton({
  href,
  children,
  external = false,
  variant = "solid",
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
  variant?: "solid" | "ghost";
}) {
  const cls =
    variant === "solid"
      ? "bg-brand text-white shadow-[var(--shadow-pop)] hover:brightness-105"
      : "bg-white/80 text-[var(--magenta)] border border-[var(--magenta)]/30 hover:bg-white";
  const inner = (
    <span
      className={`pill ${cls} px-6 py-3 text-sm sm:text-base font-bold transition-all hover:-translate-y-0.5`}
    >
      {children}
    </span>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return <Link href={href}>{inner}</Link>;
}

/** 日付を「2026.01.30 (金)」形式に整形（タイムゾーン非依存） */
export function formatDate(iso: string) {
  // "YYYY-MM-DD" の年月日をそのまま使用（サーバーのTZによる日付ズレを防ぐ）
  const [y, m, day] = iso.split("-").map(Number);
  // 曜日は UTC 基準で算出（実行環境のTZに左右されない）
  const w = ["日", "月", "火", "水", "木", "金", "土"][
    new Date(Date.UTC(y, m - 1, day)).getUTCDay()
  ];
  const p = (n: number) => String(n).padStart(2, "0");
  return `${y}.${p(m)}.${p(day)} (${w})`;
}
