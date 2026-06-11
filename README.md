# 321 REALITY ラジオ 公式サイト

321 inc. 公式ラジオ番組『321 REALITY ラジオ』の公式サイトです。
Next.js（App Router）+ TypeScript + Tailwind CSS v4 で構築し、Vercel にデプロイしています。

## ページ構成

| ページ | URL | 内容 |
| --- | --- | --- |
| トップ | `/` | ヒーロー・次回放送・MC・最新アーカイブ |
| 放送予定 | `/schedule` | 今後／過去の放送スケジュール一覧 |
| アーカイブ＆ゲスト | `/archives` | 過去アーカイブ（16:9サムネ＋視聴リンク）と過去ゲスト一覧 |
| MC紹介 | `/members` | パーソナリティ一覧 |
| MC個別 | `/members/[slug]` | 各MCのプロフィール |

---

## ✏️ コンテンツの手動編集（コードが分からなくても編集できます）

すべてのコンテンツは **`data/` フォルダ内のファイル**を書き換えるだけで更新できます。
編集して GitHub に push すると、Vercel が自動で再ビルド・公開します。

| 編集したいもの | 編集するファイル |
| --- | --- |
| 番組名・キャッチコピー・SNSリンク・お便りフォームURL | [`data/site.ts`](data/site.ts) |
| MC（パーソナリティ）のプロフィール | [`data/members.ts`](data/members.ts) |
| 放送予定 | [`data/schedule.ts`](data/schedule.ts) |
| 過去アーカイブ | [`data/archives.ts`](data/archives.ts) |
| 過去ゲスト | [`data/guests.ts`](data/guests.ts) |

各ファイルの先頭にコメントで書き方を説明しています。`{ }` で囲まれた1件分をコピーして
増やしていくイメージです。

### 放送予定を追加する例（`data/schedule.ts`）
```ts
{
  id: "ep-004",                 // 重複しない好きなID
  episode: "第4回",
  date: "2026-02-20",           // YYYY-MM-DD
  start: "21:00",
  end: "22:00",
  title: "テーマトーク回",
  platform: "YouTube Live",
  hosts: ["riu", "kurumi"],     // MCの slug（data/members.ts 参照）
  thumbnail: "/thumbnails/ep-004.jpg", // 任意（16:9画像）
  url: "https://youtube.com/...",       // 任意
  description: "概要…",                  // 任意
  status: "upcoming",           // upcoming=予定 / live=配信中 / ended=終了
},
```

### 🖼 サムネイル画像（16:9）の設定
1. 16:9 の画像（推奨 1280×720px）を [`public/thumbnails/`](public/thumbnails/) に入れる
2. `data/schedule.ts` / `data/archives.ts` の `thumbnail` に
   `"/thumbnails/ファイル名"` を指定する

詳細は [`public/thumbnails/README.md`](public/thumbnails/README.md) を参照。

### MC画像
MCのキャラクター画像は `public/members/<slug>.png` に置いています（差し替え可）。

---

## 🚀 開発・デプロイ

```bash
npm install      # 初回のみ
npm run dev      # 開発サーバー（http://localhost:3000）
npm run build    # 本番ビルド
```

`main` ブランチに push すると Vercel が自動デプロイします。

## 🎨 デザイン

バナーのビビッドなグラデーション（ピーチ→ピンク→マゼンタ→パープル→ブルー）を基調にした
ポップ＆アイドル路線。デザイントークンは [`app/globals.css`](app/globals.css) に定義。
