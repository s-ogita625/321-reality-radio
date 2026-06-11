import Link from "next/link";
import type { ReactNode } from "react";
import { Headphones } from "@/components/Logo";
import { signOut } from "@/app/admin/actions";

const TABS = [
  { href: "/admin", label: "ダッシュボード", exact: true },
  { href: "/admin/broadcasts", label: "放送予定" },
  { href: "/admin/archives", label: "アーカイブ" },
  { href: "/admin/guests", label: "ゲスト" },
  { href: "/admin/settings", label: "リンク・設定" },
];

export function AdminShell({
  children,
  active,
  email,
}: {
  children: ReactNode;
  active: string;
  email?: string;
}) {
  return (
    <div className="min-h-screen bg-[var(--cream)]">
      {/* ヘッダー */}
      <header className="bg-brand text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="grid place-items-center w-8 h-8 rounded-full bg-white/20">
              <Headphones className="w-4 h-4 text-white" />
            </span>
            <span className="font-[family-name:var(--font-rounded)] font-bold text-sm">
              321 REALITY ラジオ 管理画面
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-white/80 hover:text-white hidden sm:inline"
            >
              公開サイト ↗
            </Link>
            <form action={signOut}>
              <button className="text-xs bg-white/15 hover:bg-white/25 rounded-full px-3 py-1.5 font-bold">
                ログアウト
              </button>
            </form>
          </div>
        </div>
        {/* タブ */}
        <nav className="mx-auto max-w-5xl px-2 sm:px-6 flex gap-1 overflow-x-auto">
          {TABS.map((t) => {
            const isActive = active === t.href;
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`whitespace-nowrap px-3 py-2.5 text-sm font-bold border-b-2 transition-colors ${
                  isActive
                    ? "border-white text-white"
                    : "border-transparent text-white/70 hover:text-white"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        {email && (
          <p className="text-xs text-[var(--ink-soft)] mb-4">
            ログイン中: <span className="font-bold">{email}</span>
          </p>
        )}
        {children}
      </main>
    </div>
  );
}

/** 保存/削除の完了トースト（?saved=1 / ?deleted=1） */
export function FlashMessage({ saved, deleted }: { saved?: boolean; deleted?: boolean }) {
  if (!saved && !deleted) return null;
  return (
    <div className="mb-5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 text-sm font-bold">
      {saved && "✓ 保存しました。公開サイトに反映されています。"}
      {deleted && "✓ 削除しました。"}
    </div>
  );
}
