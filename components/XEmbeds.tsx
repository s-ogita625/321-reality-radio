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
 * URLを <blockquote class="twitter-tweet"> で並べ、widgets.js が
 * テキスト・画像・動画つきのカードに変換する（APIキー不要・無料）。
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
      className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start justify-items-center"
    >
      {urls.map((url, i) => (
        <blockquote
          key={`${url}-${i}`}
          className="twitter-tweet !w-full !max-w-[550px] !my-0"
          data-dnt="true"
          data-conversation="none"
        >
          <a href={url}></a>
        </blockquote>
      ))}
    </div>
  );
}
