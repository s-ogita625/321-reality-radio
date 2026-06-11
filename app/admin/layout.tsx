import type { ReactNode } from "react";
import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata = { title: "管理画面" };

// 管理画面は常に最新（キャッシュしない）
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: ReactNode }) {
  // Supabase 未設定時はセットアップ案内を表示（誤動作防止）
  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen grid place-items-center bg-[var(--cream)] px-6">
        <div className="max-w-lg rounded-2xl bg-white shadow-[var(--shadow-pop)] p-8 text-center">
          <h1 className="font-[family-name:var(--font-rounded)] font-black text-xl text-[var(--ink)]">
            管理画面のセットアップが必要です
          </h1>
          <p className="mt-3 text-sm text-[var(--ink-soft)] leading-relaxed text-left">
            管理画面を使うには Supabase の接続情報（環境変数）が必要です。
            <br />
            <code className="text-xs">NEXT_PUBLIC_SUPABASE_URL</code> と{" "}
            <code className="text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
            を設定してください。手順は <code className="text-xs">README.md</code> /{" "}
            <code className="text-xs">supabase/schema.sql</code> を参照。
          </p>
          <Link
            href="/"
            className="inline-block mt-5 pill bg-brand text-white px-5 py-2.5 text-sm font-bold"
          >
            公開サイトへ戻る
          </Link>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
