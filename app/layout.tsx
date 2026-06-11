import type { Metadata } from "next";
import { Mochiy_Pop_One, Zen_Maru_Gothic, Zen_Kaku_Gothic_New, Outfit } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

// 見出し（丸ポップ） — バナーの「ラジオ」の雰囲気
const display = Mochiy_Pop_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});
// 中見出し（丸ゴシック）
const rounded = Zen_Maru_Gothic({
  weight: ["500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-rounded",
});
// 本文（角ゴシック）
const sans = Zen_Kaku_Gothic_New({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
});
// ラテン装飾（ジオメトリック）
const latin = Outfit({
  subsets: ["latin"],
  variable: "--font-latin",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} 公式サイト`,
    template: `%s ｜ ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name} 公式サイト`,
    description: site.description,
    type: "website",
    locale: "ja_JP",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ja"
      className={`${display.variable} ${rounded.variable} ${sans.variable} ${latin.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--cream)]">
        <SiteNav />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
