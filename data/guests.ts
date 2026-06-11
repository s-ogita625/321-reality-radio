import type { Guest } from "./types";

// =============================================================
//  過去ゲスト ※仮案
//  ・出演したゲストを登録します。
//  ・avatar は任意（/public/guests/ に画像を置く）。
//  ・appearances には出演回の表記を入れます。
// =============================================================

export const guests: Guest[] = [
  {
    id: "guest-001",
    name: "夜空かなで",
    role: "VTuber / 321 inc.",
    bio: "歌系ライバー。番組テーマソングを担当。透明感のある歌声で番組を彩った。",
    appearances: ["第8回", "第11回"],
    link: "https://x.com/",
  },
  {
    id: "guest-002",
    name: "天野ひかり",
    role: "イラストレーター",
    bio: "番組ロゴ・サムネイルを手がけるクリエイター。制作秘話を語った。",
    appearances: ["第10回"],
    link: "https://x.com/",
  },
  {
    id: "guest-003",
    name: "藤堂レン",
    role: "ゲーム配信者 / 321 inc.",
    bio: "ゲーム実況で人気のライバー。深夜テンションのトークで大盛り上がり。",
    appearances: ["第9回", "第12回"],
    link: "https://x.com/",
  },
];

/** ID からゲストを引く */
export const getGuest = (id: string) => guests.find((g) => g.id === id);
