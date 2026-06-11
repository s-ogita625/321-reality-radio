import Link from "next/link";
import { getSiteSettings } from "@/lib/content";
import { Logo, Headphones } from "./Logo";

export async function SiteFooter() {
  const site = await getSiteSettings();
  return (
    <footer className="relative mt-24 bg-brand text-white overflow-hidden">
      <div className="absolute inset-0 halftone opacity-40" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-14">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          <div className="max-w-sm">
            <div className="[&_*]:!text-white">
              <span className="inline-flex items-center gap-2">
                <span className="grid place-items-center w-10 h-10 rounded-full bg-white/20">
                  <Headphones className="w-6 h-6 text-white" />
                </span>
                <span className="leading-none">
                  <span className="block font-[family-name:var(--font-latin)] text-[10px] tracking-[0.25em] text-white/80">
                    321 REALITY
                  </span>
                  <span className="block font-[family-name:var(--font-display)] text-xl">
                    ラジオ
                  </span>
                </span>
              </span>
            </div>
            <p className="mt-4 text-sm text-white/85 leading-relaxed">
              {site.description}
            </p>
            <p className="mt-4 text-xs text-white/70 font-[family-name:var(--font-latin)] tracking-wider">
              {site.regularSlot}
            </p>
          </div>

          <div className="flex gap-12">
            <nav>
              <h3 className="font-[family-name:var(--font-rounded)] font-bold text-sm mb-3">
                メニュー
              </h3>
              <ul className="space-y-2 text-sm text-white/85">
                <li><Link href="/schedule" className="hover:text-white">放送予定</Link></li>
                <li><Link href="/archives" className="hover:text-white">アーカイブ＆ゲスト</Link></li>
                <li><Link href="/members" className="hover:text-white">MC紹介</Link></li>
              </ul>
            </nav>
            <div>
              <h3 className="font-[family-name:var(--font-rounded)] font-bold text-sm mb-3">
                公式リンク
              </h3>
              <ul className="space-y-2 text-sm text-white/85">
                {site.socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/70">
          <Logo href={null} className="[&_.text-grad]:!text-white [&_*]:!text-white scale-90 origin-left" />
          <p>© {new Date().getFullYear()} {site.company}</p>
        </div>
      </div>
    </footer>
  );
}
