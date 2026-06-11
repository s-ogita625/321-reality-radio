"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Headphones } from "@/components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("ログインに失敗しました。メールアドレスとパスワードをご確認ください。");
      setLoading(false);
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen grid place-items-center bg-brand px-6 relative overflow-hidden">
      <div className="absolute inset-0 halftone opacity-40" />
      <form
        onSubmit={onSubmit}
        className="relative w-full max-w-sm rounded-3xl bg-white shadow-[var(--shadow-pop)] p-8"
      >
        <div className="flex flex-col items-center text-center mb-6">
          <span className="grid place-items-center w-12 h-12 rounded-full bg-brand text-white mb-3">
            <Headphones className="w-6 h-6" />
          </span>
          <h1 className="font-[family-name:var(--font-rounded)] font-black text-lg text-[var(--ink)]">
            管理画面ログイン
          </h1>
          <p className="text-xs text-[var(--ink-soft)] mt-1">
            321 REALITY ラジオ
          </p>
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2">
            {error}
          </p>
        )}

        <label className="block mb-3">
          <span className="block text-xs font-bold text-[var(--ink)] mb-1">
            メールアドレス
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-[var(--ink-soft)]/25 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--magenta)]/40"
            placeholder="you@321.inc"
          />
        </label>
        <label className="block mb-5">
          <span className="block text-xs font-bold text-[var(--ink)] mb-1">
            パスワード
          </span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-[var(--ink-soft)]/25 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--magenta)]/40"
            placeholder="••••••••"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full pill justify-center bg-brand text-white py-3 text-sm font-bold hover:brightness-105 transition disabled:opacity-60"
        >
          {loading ? "ログイン中…" : "ログイン"}
        </button>

        <p className="mt-5 text-[11px] text-[var(--ink-soft)] text-center leading-relaxed">
          アカウントは Supabase ダッシュボードの Authentication →
          Users から発行してください。
        </p>
        <Link
          href="/"
          className="block mt-3 text-center text-xs text-[var(--magenta)] hover:underline"
        >
          ← 公開サイトへ戻る
        </Link>
      </form>
    </div>
  );
}
