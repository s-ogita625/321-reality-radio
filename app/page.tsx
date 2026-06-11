import Link from "next/link";
import Image from "next/image";
import { members } from "@/data/members";
import { getBroadcasts, getArchives, getSiteSettings } from "@/lib/content";
import { Headphones } from "@/components/Logo";
import {
  SectionTitle,
  Thumb16x9,
  GradButton,
  HostStack,
  StatusBadge,
  formatDate,
} from "@/components/ui";

export default async function Home() {
  const [broadcasts, archives, site] = await Promise.all([
    getBroadcasts(),
    getArchives(),
    getSiteSettings(),
  ]);
  // 直近の放送予定（upcoming/live のうち日付が一番近いもの）
  const next = [...broadcasts]
    .filter((b) => b.status !== "ended")
    .sort((a, b) => a.date.localeCompare(b.date))[0];
  const latest = archives.slice(0, 3);

  return (
    <>
      {/* ===================== HERO ===================== */}
      <section className="relative bg-brand overflow-hidden">
        <div className="absolute inset-0 halftone opacity-50" />
        {/* 浮遊する装飾 */}
        <Headphones className="hidden sm:block absolute right-[8%] top-16 w-24 h-24 text-white/30 animate-floaty" />
        <div className="absolute left-[6%] bottom-40 w-16 h-16 rounded-full border-4 border-white/25 animate-floaty [animation-delay:1.5s]" />
        <RadioGlyph className="hidden sm:block absolute left-[4%] top-24 w-20 h-20 text-white/25 animate-floaty [animation-delay:0.8s]" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-14 sm:pt-16 pb-10 sm:pb-16">
          <div className="text-center reveal">
            <span className="pill bg-white/20 text-white text-xs px-4 py-2 backdrop-blur tracking-[0.2em] font-[family-name:var(--font-latin)]">
              {site.company}
            </span>
            <h1 className="mt-6 leading-[0.9]">
              <span className="block font-[family-name:var(--font-latin)] font-bold text-outline text-5xl sm:text-7xl md:text-8xl tracking-tight">
                321 REALITY
              </span>
              <span className="block mt-2 font-[family-name:var(--font-display)] text-white text-6xl sm:text-8xl md:text-9xl drop-shadow-[0_6px_0_rgba(154,99,230,0.35)]">
                ラジオ
              </span>
            </h1>
            <p className="mt-6 text-white text-base sm:text-lg font-medium max-w-xl mx-auto">
              {site.tagline}
            </p>
            <p className="mt-2 inline-flex items-center gap-2 text-white/90 text-sm font-[family-name:var(--font-latin)] tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              {site.regularSlot} ｜ {site.platform}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <GradButton href="/schedule" variant="ghost">
                📻 放送予定を見る
              </GradButton>
              <GradButton href="/archives" variant="ghost">
                ▶ アーカイブを観る
              </GradButton>
            </div>
          </div>

          {/* 4人のキャラクター（バナー再現） */}
          <div className="mt-8 sm:mt-10 grid grid-cols-4 gap-1 sm:gap-4 items-end">
            {members.map((m, i) => (
              <Link
                key={m.slug}
                href={`/members/${m.slug}`}
                className="group relative flex flex-col items-center reveal"
                style={{ animationDelay: `${0.15 * (i + 1)}s` }}
              >
                <div
                  className="relative w-full max-w-[150px] aspect-[3/4] rounded-t-[40%] overflow-hidden"
                  style={{
                    background: `radial-gradient(120% 90% at 50% 100%, ${m.colorSub}cc, transparent 70%)`,
                  }}
                >
                  <Image
                    src={m.image}
                    alt={m.name}
                    fill
                    sizes="(max-width:640px) 25vw, 150px"
                    className="object-contain object-bottom drop-shadow-2xl transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-1"
                    priority={i < 2}
                  />
                </div>
                <span className="mt-1.5 text-[8px] sm:text-xs text-white/80 font-bold tracking-tight">
                  新パーソナリティ
                </span>
                <span className="text-[11px] leading-tight sm:text-base font-[family-name:var(--font-rounded)] font-black text-white text-center break-keep">
                  {m.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
        {/* 下端の波 */}
        <div className="h-10 sm:h-16 bg-[var(--cream)] [clip-path:ellipse(75%_100%_at_50%_100%)] -mt-2" />
      </section>

      {/* ===================== 次回放送 ===================== */}
      {next && (
        <section className="mx-auto max-w-6xl px-4 sm:px-6 -mt-2">
          <div className="grad-border p-1 shadow-[var(--shadow-pop)]">
            <div className="rounded-[20px] bg-white p-5 sm:p-7 flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-2/5">
                <Thumb16x9 src={next.thumbnail} alt={next.title} label="NEXT LIVE" />
              </div>
              <div className="flex-1 w-full">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="pill bg-[var(--magenta)]/10 text-[var(--magenta)] text-xs px-3 py-1.5">
                    NEXT 放送予定
                  </span>
                  <StatusBadge status={next.status} />
                  {next.episode && (
                    <span className="text-xs font-bold text-[var(--ink-soft)]">
                      {next.episode}
                    </span>
                  )}
                </div>
                <p className="mt-3 font-[family-name:var(--font-latin)] text-2xl font-semibold text-grad">
                  {formatDate(next.date)}
                </p>
                <p className="text-sm text-[var(--ink-soft)] font-bold">
                  {next.start} - {next.end} ／ {next.platform}
                </p>
                <h3 className="mt-2 font-[family-name:var(--font-rounded)] font-bold text-lg sm:text-xl text-[var(--ink)]">
                  {next.title}
                </h3>
                {next.description && (
                  <p className="mt-2 text-sm text-[var(--ink-soft)] leading-relaxed">
                    {next.description}
                  </p>
                )}
                <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
                  <HostStack slugs={next.hosts} />
                  {next.url && (
                    <GradButton href={next.url} external>
                      視聴ページへ →
                    </GradButton>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===================== MC 紹介 ===================== */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-24">
        <SectionTitle label="PERSONALITY" title="パーソナリティ紹介" align="center" />
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {members.map((m) => (
            <Link
              key={m.slug}
              href={`/members/${m.slug}`}
              className="group relative rounded-3xl overflow-hidden bg-white shadow-[var(--shadow-pop)] hover:-translate-y-1 transition-transform"
            >
              <div
                className="relative aspect-[3/4]"
                style={{ background: `linear-gradient(160deg, ${m.colorSub}, ${m.color})` }}
              >
                <div className="absolute inset-0 halftone opacity-40" />
                <Image
                  src={m.image}
                  alt={m.name}
                  fill
                  sizes="(max-width:1024px) 50vw, 25vw"
                  className="object-contain object-bottom drop-shadow-xl transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <p className="font-[family-name:var(--font-latin)] text-[10px] tracking-widest text-[var(--ink-soft)]">
                  {m.romaji}
                </p>
                <h3 className="font-[family-name:var(--font-rounded)] font-black text-lg text-[var(--ink)]">
                  {m.name}
                </h3>
                <p className="mt-1 text-xs text-[var(--ink-soft)] leading-snug line-clamp-2">
                  {m.catch}
                </p>
              </div>
              <span
                className="absolute top-3 right-3 w-3 h-3 rounded-full ring-2 ring-white"
                style={{ background: m.color }}
              />
            </Link>
          ))}
        </div>
      </section>

      {/* ===================== 最新アーカイブ ===================== */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-24">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <SectionTitle label="ARCHIVE" title="最新アーカイブ" />
          <Link
            href="/archives"
            className="text-sm font-bold text-[var(--magenta)] hover:underline whitespace-nowrap"
          >
            すべて見る →
          </Link>
        </div>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {latest.map((a) => (
            <a
              key={a.id}
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-3xl bg-white shadow-[var(--shadow-pop)] overflow-hidden hover:-translate-y-1 transition-transform"
            >
              <div className="relative">
                <Thumb16x9 src={a.thumbnail} alt={a.title} className="rounded-none" />
                <span className="absolute bottom-2 right-2 pill bg-black/60 text-white text-[10px] px-2 py-1">
                  ▶ {a.duration ?? "アーカイブ"}
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 text-xs text-[var(--ink-soft)] font-bold">
                  <span className="text-[var(--magenta)]">{a.episode}</span>
                  <span>{formatDate(a.date)}</span>
                </div>
                <h3 className="mt-1 font-[family-name:var(--font-rounded)] font-bold text-[var(--ink)] leading-snug line-clamp-2">
                  {a.title}
                </h3>
                <div className="mt-3">
                  <HostStack slugs={a.hosts} />
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ===================== お便り CTA ===================== */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-24">
        <div className="relative rounded-[32px] bg-brand overflow-hidden p-8 sm:p-14 text-center text-white">
          <div className="absolute inset-0 halftone opacity-40" />
          <div className="relative">
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl">
              お便り募集中📮
            </h2>
            <p className="mt-3 text-white/90 max-w-lg mx-auto text-sm sm:text-base">
              番組への質問・お悩み相談・リクエストをお待ちしています。
              あなたのメッセージが番組で読まれるかも？
            </p>
            {site.mailFormUrl && (
              <div className="mt-6">
                <GradButton href={site.mailFormUrl} external variant="ghost">
                  お便りを送る ✉
                </GradButton>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function RadioGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="3" y="8" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 8 16 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="15.5" cy="13.5" r="2.6" stroke="currentColor" strokeWidth="1.6" />
      <path d="M6.5 12.5h2M6.5 15h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
