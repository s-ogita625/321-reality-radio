import type { Member } from "./types";

// =============================================================
//  MC（新パーソナリティ）プロフィール ※仮案
//  ・bio / profile / links は運営が手動で書き換えてください。
//  ・画像は public/members/<slug>.png に配置されています。
//  ・並び順がそのまま一覧の表示順になります。
// =============================================================

export const members: Member[] = [
  {
    slug: "riu",
    name: "灰島リウ",
    kana: "はいじま りう",
    romaji: "RIU HAIJIMA",
    color: "#3E6BE0",
    colorSub: "#7FA8FF",
    catch: "クールでミステリアスな堕天使系ナビゲーター",
    image: "/members/riu.png",
    bio: "蒼い翼を背負う堕天使系パーソナリティ。低く落ち着いた声と鋭い切り返しで番組の進行を支える司令塔。\n\nクールな佇まいの裏に隠れた抜けた一面とリスナー思いの優しさがギャップとして人気。ゲストの本音を引き出すインタビューに定評あり。",
    profile: [
      { label: "誕生日", value: "11月3日" },
      { label: "身長", value: "182cm" },
      { label: "イメージカラー", value: "スティールブルー" },
      { label: "趣味", value: "ガジェット収集・夜のドライブ" },
      { label: "担当", value: "進行 / トークMC" },
    ],
    links: [
      { label: "X (Twitter)", url: "https://x.com/" },
      { label: "YouTube", url: "https://youtube.com/" },
    ],
  },
  {
    slug: "neru",
    name: "亞紫太ねる。",
    kana: "あした ねる",
    romaji: "NERU ASHITA",
    color: "#27406E",
    colorSub: "#6FD4E8",
    catch: "ゴシック×ガーリーな二面性アイドル",
    image: "/members/neru.png",
    bio: "白と黒、二色に分かれた髪と角がトレードマークのゴシックガーリーなアイドル。無邪気な笑顔とちょっぴり毒のあるトークの二面性が魅力。\n\nお便りコーナーを溺愛しており、リスナーの悩みに全力で寄り添う。語尾の「。」がチャームポイント。",
    profile: [
      { label: "誕生日", value: "2月14日" },
      { label: "身長", value: "154cm" },
      { label: "イメージカラー", value: "ネイビー × アイスミント" },
      { label: "趣味", value: "お裁縫・紅茶・ホラー映画" },
      { label: "担当", value: "お便り / ゲストコーナー" },
    ],
    links: [
      { label: "X (Twitter)", url: "https://x.com/" },
      { label: "YouTube", url: "https://youtube.com/" },
    ],
  },
  {
    slug: "kurumi",
    name: "月森くるみ",
    kana: "つきもり くるみ",
    romaji: "KURUMI TSUKIMORI",
    color: "#EC4899",
    colorSub: "#F9A8D4",
    catch: "ふわもこ癒し系アイドル",
    image: "/members/kurumi.png",
    bio: "くまみみおだんごがトレードマークの、ふわもこ癒し系アイドル。やわらかな声と天然な発言で番組の和みを担当。\n\n甘い見た目に反してトークはしっかり者。リスナーを「くるみんファミリー」と呼んで大切にしている。",
    profile: [
      { label: "誕生日", value: "9月20日" },
      { label: "身長", value: "150cm" },
      { label: "イメージカラー", value: "シュガーピンク" },
      { label: "趣味", value: "お菓子作り・ぬいぐるみ集め" },
      { label: "担当", value: "癒し / リスナー対応" },
    ],
    links: [
      { label: "X (Twitter)", url: "https://x.com/" },
      { label: "YouTube", url: "https://youtube.com/" },
    ],
  },
  {
    slug: "miru",
    name: "北条みる",
    kana: "ほうじょう みる",
    romaji: "MIRU HOJO",
    color: "#F0593C",
    colorSub: "#FF5A9E",
    catch: "和風ネコミミの元気担当",
    image: "/members/miru.png",
    bio: "ネコミミと和装がトレードマークの元気担当。明るくまっすぐな性格で、番組を一気に盛り上げるムードメーカー。\n\n企画・大喜利コーナーが得意で、アドリブの瞬発力はピカイチ。語尾に「にゃ」が出るのはここだけの秘密。",
    profile: [
      { label: "誕生日", value: "5月5日" },
      { label: "身長", value: "158cm" },
      { label: "イメージカラー", value: "サンセットオレンジ × マゼンタ" },
      { label: "趣味", value: "お祭り巡り・カラオケ" },
      { label: "担当", value: "企画 / 盛り上げ" },
    ],
    links: [
      { label: "X (Twitter)", url: "https://x.com/" },
      { label: "YouTube", url: "https://youtube.com/" },
    ],
  },
];

/** slug から MC を引く（コンポーネントで使用） */
export const getMember = (slug: string) => members.find((m) => m.slug === slug);
