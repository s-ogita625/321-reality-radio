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

## 🔐 管理画面（Supabase連携）

`/admin` に、放送予定・アーカイブ・ゲストの **追加／編集／削除** と
**各種リンク設定** ができる管理画面があります。データは Supabase に保存され、
保存すると公開サイトに即反映されます（コードのcommit不要）。

> Supabase の環境変数が未設定の間は、公開サイトは `data/` の静的データで動作し、
> `/admin` は「セットアップが必要です」と表示します（無停止）。

### セットアップ手順（初回のみ）
1. [supabase.com](https://supabase.com) で無料プロジェクトを作成
2. ダッシュボードの **SQL Editor** で [`supabase/schema.sql`](supabase/schema.sql) を実行（テーブル＋権限）。
   サンプルデータも入れる場合は続けて [`supabase/seed.sql`](supabase/seed.sql) を実行。
3. **Project Settings → API** から以下を取得し、環境変数に設定:
   - `NEXT_PUBLIC_SUPABASE_URL`（Project URL）
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`（publishable / anon key。公開可）
   - ローカル: `.env.local` に記載（[`.env.local.example`](.env.local.example) 参照）
   - 本番: Vercel → Settings → Environment Variables に追加して再デプロイ
4. **Authentication → Users** で管理者アカウント（メール＋パスワード）を発行
5. `/admin/login` からログイン

### 仕組み・セキュリティ
- 公開サイト＝読み取りのみ（anonキー）。書き込みはログイン済みユーザーだけ（RLSで制御）。
- `service_role` キーは使用しません（ブラウザに秘密鍵を出しません）。
- セッションは `proxy.ts`（Next.js 16）でリフレッシュし、未ログインの `/admin` はログインへ誘導。

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
