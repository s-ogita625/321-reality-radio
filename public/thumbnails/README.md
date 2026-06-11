# サムネイル画像（16:9）

放送予定・アーカイブのサムネイルはここに置きます。

## ルール
- **アスペクト比は必ず 16:9**（推奨サイズ: 1280 × 720px / 1920 × 1080px）
- 形式: `.jpg` / `.png` / `.webp` / `.svg`
- ファイル名は回 ID に合わせると管理しやすいです（例: `ep-013.jpg`）

## 使い方
1. この `public/thumbnails/` フォルダに画像を入れる
2. `data/schedule.ts`（放送予定）または `data/archives.ts`（アーカイブ）の
   `thumbnail` に `"/thumbnails/ファイル名"` を指定する

例:
```ts
thumbnail: "/thumbnails/ep-013.jpg",
```

放送予定で `thumbnail` を省略すると、自動でグラデーションのプレースホルダが表示されます
（アーカイブはサムネイル必須）。

`ep-001.svg` / `placeholder-1〜3.svg` は仮のサンプル画像です。差し替えてください。
