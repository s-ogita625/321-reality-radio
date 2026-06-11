import type { Archive } from "./types";

// =============================================================
//  過去アーカイブ ※仮案
//  ・配信が終わった回をここに追加します（新しい回を先頭に）。
//  ・thumbnail は 16:9 画像（/public/thumbnails/ に配置）。必須。
//  ・url はアーカイブ動画（YouTube など）の URL。
//  ・hosts には members.ts の slug、guests には出演ゲスト名。
// =============================================================

export const archives: Archive[] = [
  {
    id: "ep-012",
    episode: "第12回",
    date: "2026-01-16",
    title: "2026年の抱負を語る回 〜今年こそ叶えたいこと〜",
    thumbnail: "/thumbnails/placeholder-1.svg",
    url: "https://youtube.com/",
    hosts: ["riu", "kurumi"],
    guests: ["藤堂レン"],
    summary: "新年一発目。今年の目標と番組のこれからについて熱く語った回。",
    duration: "58:42",
  },
  {
    id: "ep-011",
    episode: "第11回",
    date: "2026-01-09",
    title: "新春お便りスペシャル 〜年末年始エピソード大放出〜",
    thumbnail: "/thumbnails/placeholder-2.svg",
    url: "https://youtube.com/",
    hosts: ["neru", "miru"],
    guests: ["夜空かなで"],
    summary: "リスナーから届いた年末年始エピソードを一挙紹介。",
    duration: "61:05",
  },
  {
    id: "ep-010",
    episode: "第10回",
    date: "2025-12-19",
    title: "番組ロゴができるまで 〜クリエイター裏話回〜",
    thumbnail: "/thumbnails/placeholder-3.svg",
    url: "https://youtube.com/",
    hosts: ["riu", "neru", "kurumi", "miru"],
    guests: ["天野ひかり"],
    summary: "番組ビジュアルを手がけたイラストレーターを招いた制作秘話回。",
    duration: "55:18",
  },
];
