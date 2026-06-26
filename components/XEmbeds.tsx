"use client";

import { useEffect, useRef } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    twttr?: any;
  }
}

const WIDGETS_SRC = "https://platform.twitter.com/widgets.js";

type Post = { url: string; full?: boolean };

function XIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

/**
 * X（旧Twitter）の投稿を公式埋め込みで表示する。
 * - full=false: 高さ固定カード（440px）に収め、はみ出しはフェード（見た目を統一）。
 * - full=true : このサイト上で全文を表示（高さ自由）。
 * いずれも内容とは別に「Xで見る」ボタンを独立配置。
 * 高さがバラついてもマソンリー（段組み）で隙間なく並ぶ。
 */
export function XEmbeds({ posts }: { posts: Post[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = () => window.twttr?.widgets?.load(ref.current ?? undefined);
    if (window.twttr?.widgets) {
      load();
      return;
    }
    let script = document.querySelector<HTMLScriptElement>(
      `script[src="${WIDGETS_SRC}"]`,
    );
    if (!script) {
      script = document.createElement("script");
      script.src = WIDGETS_SRC;
      script.async = true;
      script.charset = "utf-8";
      script.addEventListener("load", load);
      document.body.appendChild(script);
    } else {
      script.addEventListener("load", load);
      load();
    }
    return () => script?.removeEventListener("load", load);
  }, [posts]);

  if (posts.length === 0) {
    return (
      <div className="rounded-3xl bg-white/70 border border-[var(--magenta)]/15 shadow-sm p-10 text-center">
        <p className="text-[var(--ink-soft)] text-sm">
          まだ投稿がありません。#321REALITYラジオ の投稿を準備中です🐦
        </p>
      </div>
    );
  }

  return (
    <div ref={ref} className="columns-1 sm:columns-2 lg:columns-3 gap-5">
      {posts.map((p, i) => (
        <div
          key={`${p.url}-${i}`}
          className="mb-5 break-inside-avoid rounded-2xl bg-white shadow-[var(--shadow-pop)] overflow-hidden"
        >
          {/* 埋め込み本体 */}
          <div
            className={
              p.full
                ? "relative px-2 pt-2"
                : "relative px-2 pt-2 h-[440px] overflow-hidden"
            }
          >
            <blockquote
              className="twitter-tweet !m-0 !w-full"
              data-dnt="true"
              data-conversation="none"
            >
              <a href={p.url}></a>
            </blockquote>
            {!p.full && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white via-white/80 to-transparent" />
            )}
          </div>

          {/* Xで見るボタン（内容とは独立） */}
          <div className="p-3 border-t border-[var(--ink-soft)]/10">
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-full bg-black text-white text-xs font-bold py-2.5 hover:opacity-85 transition-opacity"
            >
              <XIcon className="w-3.5 h-3.5" />
              ポストをXで見る
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
