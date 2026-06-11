import type { ReactNode } from "react";
import { Headphones } from "./Logo";

/** 各下層ページ共通のグラデーションヘッダー */
export function PageHeader({
  label,
  title,
  description,
}: {
  /** 英語の小ラベル（例: "SCHEDULE"） */
  label: string;
  /** 日本語タイトル（例: "放送予定"） */
  title: ReactNode;
  description?: string;
}) {
  return (
    <header className="relative bg-brand overflow-hidden">
      <div className="absolute inset-0 halftone opacity-50" />
      <Headphones className="absolute right-[6%] top-6 w-20 h-20 text-white/25 animate-floaty" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-12 pb-20 text-center">
        <span className="font-[family-name:var(--font-latin)] text-white/80 tracking-[0.3em] text-sm">
          {label}
        </span>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-white text-4xl sm:text-5xl drop-shadow-[0_4px_0_rgba(154,99,230,0.3)]">
          {title}
        </h1>
        {description && (
          <p className="mt-4 text-white/90 text-sm sm:text-base max-w-xl mx-auto">
            {description}
          </p>
        )}
      </div>
      {/* 下端カーブ */}
      <div className="h-10 sm:h-14 bg-[var(--cream)] [clip-path:ellipse(80%_100%_at_50%_100%)] -mt-1" />
    </header>
  );
}
