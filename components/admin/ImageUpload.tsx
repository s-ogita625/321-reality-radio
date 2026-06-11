"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * 画像アップロード用フィールド。
 * Supabase Storage(media バケット) にアップロードし、
 * 取得した公開URLを name のテキスト入力にセットして送信する。
 * URL直接入力（手動パス指定）も可能。
 */
export function ImageUpload({
  name,
  defaultValue = "",
  folder,
  label,
  hint,
  required = false,
  aspect = "video",
}: {
  name: string;
  defaultValue?: string;
  folder: string; // 例: "thumbnails" / "members"
  label: string;
  hint?: string;
  required?: boolean;
  aspect?: "video" | "portrait";
}) {
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const supabase = createClient();
      const ext = (file.name.split(".").pop() || "png").toLowerCase();
      const rand = (crypto.randomUUID?.() || `${Date.now()}`).slice(0, 12);
      const path = `${folder}/${rand}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("media")
        .upload(path, file, { cacheControl: "3600", upsert: true });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      setUrl(data.publicUrl);
    } catch (err) {
      setError(
        "アップロードに失敗しました。ログイン状態・ファイル形式（画像）・サイズ（5MBまで）をご確認ください。",
      );
      console.error(err);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const box = aspect === "video" ? "aspect-video" : "aspect-[3/4] max-w-[160px]";

  return (
    <div>
      <span className="block text-xs font-bold text-[var(--ink)] mb-1">
        {label}
        {required && <span className="text-[var(--magenta)]"> *</span>}
        {hint && <span className="ml-2 font-normal text-[var(--ink-soft)]">{hint}</span>}
      </span>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-start">
        {/* プレビュー */}
        <div
          className={`relative ${box} w-full sm:w-48 shrink-0 rounded-xl overflow-hidden bg-soft border border-[var(--ink-soft)]/15 grid place-items-center`}
        >
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="w-full h-full object-contain" />
          ) : (
            <span className="text-[11px] text-[var(--ink-soft)]">プレビュー</span>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="pill bg-brand text-white px-4 py-2 text-xs font-bold hover:brightness-105 disabled:opacity-60"
            >
              {uploading ? "アップロード中…" : "画像を選択してアップロード"}
            </button>
            {url && (
              <button
                type="button"
                onClick={() => setUrl("")}
                className="text-xs text-[var(--ink-soft)] hover:text-red-500"
              >
                クリア
              </button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={onPick}
            className="hidden"
          />
          {/* 送信される値（URL直接入力も可） */}
          <input
            type="text"
            name={name}
            value={url}
            required={required}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="アップロードするか URL/パスを直接入力"
            className="w-full rounded-lg border border-[var(--ink-soft)]/25 bg-white px-3 py-2 text-xs text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--magenta)]/40"
          />
          {error && <p className="text-[11px] text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
}
