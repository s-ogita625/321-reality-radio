// =============================================================
//  サイト全体の基本設定
//  番組名・運営・SNS・配信時間などをここで編集できます。
// =============================================================

export const site = {
  /** 番組名 */
  name: "321 REALITY ラジオ",
  /** 番組名（ローマ字ロゴ用） */
  nameEn: "321 REALITY RADIO",
  /** キャッチコピー */
  tagline: "REALITYから、リアルな声を。",
  /** 番組概要（改行位置「\n」で表示が折り返されます） */
  description:
    "321 inc. 所属ライバーがお届けする\n公式ラジオ番組『321 REALITY ラジオ』\n毎週金曜21時〜トーク・お便り・ゲストコーナーで\n321REALITYライバーを紹介します。",
  /** トップの「321 REALITY ラジオとは？」紹介文（改行「\n」で折り返し） */
  about:
    "321 inc. 所属ライバーがお届けする\n公式ラジオ番組『321 REALITY ラジオ』\n毎週金曜21時〜トーク・お便り・ゲストコーナーで\n321REALITYライバーを紹介します。",
  /** 運営 */
  company: "321 inc. — LIVER MANAGEMENT",
  /** レギュラー放送枠の説明（トップに表示） */
  regularSlot: "毎週金曜 21:00 - 22:00",
  /** 配信プラットフォーム */
  platform: "REALITY",
  /** サイトの公開 URL（デプロイ後に書き換え） */
  url: "https://321-reality-radio.vercel.app",

  /** 公式 SNS / リンク（フッターに表示） */
  socials: [
    { label: "X (Twitter)", url: "https://x.com/" },
    { label: "YouTube", url: "https://youtube.com/" },
    { label: "REALITY", url: "https://reality.app/" },
    { label: "321 inc.", url: "https://321.inc/" },
  ],

  /** お便り投稿フォーム URL（任意。空文字なら非表示） */
  mailFormUrl: "https://forms.gle/",
} as const;

/** Vライバー募集の導線リンク（LINE LIFF） */
export const RECRUIT_URL =
  "https://liff-gateway.lineml.jp/landing?follow=%40234pcbne&lp=jKK2xG&liff_id=2002363483-VqGOv5m2";
