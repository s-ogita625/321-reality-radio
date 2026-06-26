"use client";

import { useEffect, useRef } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    twttr?: any;
  }
}

const WIDGETS_SRC = "https://platform.twitter.com/widgets.js";

/**
 * X（旧Twitter）の投稿を公式埋め込みで表示する。
 * 投稿は文章量・画像・引用などで高さがバラつくため、
 * 「高さ固定カード」に収めて見た目を統一し、はみ出す分は
 * 下部のグラデーションでフェード＋「Xで投稿を見る」リンクで全文確認できる。
 */
export function XEmbeds({ urls }: { urls: string[] }) {
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
  }, [urls]);

  if (urls.length === 0) {
    return (
      <div className="rounded-3xl bg-white/70 border border-[var(--magenta)]/15 shadow-sm p-10 text-center">
        <p className="text-[var(--ink-soft)] text-sm">
          まだ投稿がありません。#321REALITYラジオ の投稿を準備中です🐦
        </p>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch"
    >
      {urls.map((url, i) => (
        <div
          key={`${url}-${i}`}
          className="flex flex-col h-[440px] rounded-2xl bg-white shadow-[var(--shadow-pop)] overflow-hidden"
        >
          {/* 埋め込み本体（高さ固定・はみ出しは隠す） */}
          <div className="relative flex-1 overflow-hidden px-2 pt-2">
            <blockquote
              className="twitter-tweet !m-0 !w-full"
              data-dnt="true"
              data-conversation="none"
            >
              <a href={url}></a>
            </blockquote>
            {/* 下部フェード */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white via-white/80 to-transparent" />
          </div>
          {/* フッターリンク（全文はXで） */}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 border-t border-[var(--ink-soft)]/10 text-center py-2.5 text-xs font-bold text-[var(--magenta)] hover:bg-[var(--magenta)]/5 transition-colors"
          >
            X で投稿を見る ↗
          </a>
        </div>
      ))}
    </div>
  );
}
