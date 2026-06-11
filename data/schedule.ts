import type { Broadcast } from "./types";

// =============================================================
//  放送予定 ※仮案
//  ・新しい放送回を追加するときは配列の先頭に足してください。
//  ・status: "upcoming"=放送予定 / "live"=配信中 / "ended"=放送終了
//  ・hosts には members.ts の slug を入れます。
//  ・thumbnail は 16:9 画像（/public/thumbnails/ に配置）。
//    省略するとグラデーションのプレースホルダが表示されます。
// =============================================================

export const broadcasts: Broadcast[] = [
  {
    id: "ep-001",
    episode: "新パーソナリティ初回",
    date: "2026-01-30",
    start: "21:00",
    end: "22:00",
    title: "新生『321 REALITY ラジオ』スタート！4人の初顔合わせSP",
    platform: "REALITY",
    hosts: ["riu", "neru", "kurumi", "miru"],
    thumbnail: "/thumbnails/ep-001.svg",
    url: "https://youtube.com/",
    description:
      "新パーソナリティ4人が初集結。自己紹介から番組のこれからまで、たっぷり1時間お届けする記念すべき初回放送。",
    status: "upcoming",
  },
  {
    id: "ep-002",
    episode: "第2回",
    date: "2026-02-06",
    start: "21:00",
    end: "22:00",
    title: "リスナーお便り大募集SP 〜はじめましての悩み相談〜",
    platform: "REALITY",
    hosts: ["neru", "kurumi"],
    url: "https://youtube.com/",
    description: "届いたお便りに新パーソナリティが全力で回答。",
    status: "upcoming",
  },
  {
    id: "ep-003",
    episode: "第3回",
    date: "2026-02-13",
    start: "21:00",
    end: "22:00",
    title: "ゲスト回・第一弾！ひみつのゲストをお迎えして",
    platform: "REALITY",
    hosts: ["riu", "miru"],
    guests: ["ゲスト調整中"],
    url: "https://youtube.com/",
    description: "記念すべき初ゲスト回。お楽しみに。",
    status: "upcoming",
  },
];
