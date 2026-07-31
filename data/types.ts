// =============================================================
//  321 REALITY ラジオ — 型定義
//  ここを直接編集する必要はありません。
//  コンテンツは members.ts / schedule.ts / archives.ts / guests.ts
//  を編集してください。
// =============================================================

/** MC（パーソナリティ）プロフィール */
export type Member = {
  /** URL に使う英小文字スラッグ（例: "riu"）。変更すると個別ページの URL が変わります */
  slug: string;
  /** 表示名（例: "灰島リウ"） */
  name: string;
  /** ふりがな（例: "はいじま りう"） */
  kana: string;
  /** ローマ字表記（ロゴ的に使用） */
  romaji: string;
  /** テーマカラー（メイン）HEX */
  color: string;
  /** テーマカラー（サブ）HEX */
  colorSub: string;
  /** キャッチコピー（1行） */
  catch: string;
  /** キャラクター画像パス（/public からの絶対パス。例: "/members/riu.png"） */
  image: string;
  /** 自己紹介・紹介文（複数段落は \n\n で区切る） */
  bio: string;
  /** プロフィール項目（自由に増減可） */
  profile: { label: string; value: string }[];
  /** SNS など外部リンク */
  links: { label: string; url: string }[];
};

/** 配信ステータス */
export type BroadcastStatus = "upcoming" | "live" | "ended";

/** 放送予定 / 配信回 */
export type Broadcast = {
  /** 一意な ID（例: "ep-013"） */
  id: string;
  /** 回数表記（例: "第13回"）。無ければ空文字 */
  episode: string;
  /** 放送日（ISO形式 "YYYY-MM-DD"） */
  date: string;
  /** 開始時刻（"HH:MM"） */
  start: string;
  /** 終了時刻（"HH:MM"） */
  end: string;
  /** タイトル */
  title: string;
  /** 配信プラットフォーム（例: "YouTube Live"） */
  platform: string;
  /** 出演 MC のスラッグ配列（members.ts の slug） */
  hosts: string[];
  /** ゲスト名（任意。複数可） */
  guests?: string[];
  /** 16:9 のサムネイル画像パス（例: "/thumbnails/ep-013.jpg"）。無ければプレースホルダ表示 */
  thumbnail?: string;
  /** 視聴 / 予約 URL（任意） */
  url?: string;
  /** 概要文（任意） */
  description?: string;
  /** ステータス。upcoming=放送予定 / live=配信中 / ended=放送終了 */
  status: BroadcastStatus;
  /** 公開状態。false=サイト上で非表示（データは保持）。未指定は公開扱い */
  published?: boolean;
};

/** X（旧Twitter）投稿（手動キュレーション） */
export type XPost = {
  /** 一意なID */
  id: string;
  /** 投稿のURL（例: https://x.com/xxx/status/123...） */
  url: string;
  /** メモ（管理用・任意） */
  note?: string;
  /** このサイト上で全文表示するか（true=省略せず全部表示） */
  full: boolean;
  /** 表示順（小さいほど先頭） */
  sortOrder: number;
};

/** 過去ゲスト */
export type Guest = {
  /** 一意な ID（例: "guest-001"） */
  id: string;
  /** ゲスト名 */
  name: string;
  /** 肩書き / 所属（例: "VTuber / 321 inc."） */
  role?: string;
  /** アイコン画像パス（任意。例: "/guests/xxx.png"） */
  avatar?: string;
  /** 紹介文（任意） */
  bio?: string;
  /** 出演回の表記（例: ["第8回", "第11回"]） */
  appearances: string[];
  /** 外部リンク（任意） */
  link?: string;
};

/** 過去アーカイブ */
export type Archive = {
  /** 一意な ID（例: "ep-012"） */
  id: string;
  /** 回数表記（例: "第12回"） */
  episode: string;
  /** 配信日（ISO形式 "YYYY-MM-DD"） */
  date: string;
  /** タイトル */
  title: string;
  /** 16:9 のサムネイル画像パス（例: "/thumbnails/ep-012.jpg"） */
  thumbnail: string;
  /** アーカイブ視聴 URL（YouTube など） */
  url: string;
  /** 出演 MC のスラッグ配列 */
  hosts: string[];
  /** 出演ゲスト名（任意） */
  guests?: string[];
  /** 内容サマリー（任意） */
  summary?: string;
  /** 再生時間表記（任意。例: "58:21"） */
  duration?: string;
};
