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
  /** 番組概要 */
  description:
    "321 inc. 所属ライバーがお届けする公式ラジオ番組『321 REALITY ラジオ』。毎週金曜よる21時、トーク・お便り・ゲストコーナーでREALITYのリアルをお届けします。",
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
