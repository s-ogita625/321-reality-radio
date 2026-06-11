import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBroadcasts, getArchives, getMembers } from "@/lib/content";
import { GradButton, formatDate } from "@/components/ui";

export const revalidate = 60;

export async function generateStaticParams() {
  const members = await getMembers();
  return members.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const m = (await getMembers()).find((x) => x.slug === slug);
  if (!m) return { title: "MC紹介" };
  return { title: m.name };
}

export default async function MemberPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const members = await getMembers();
  const m = members.find((x) => x.slug === slug);
  if (!m) notFound();

  // 出演回を抽出
  const [allBroadcasts, allArchives] = await Promise.all([
    getBroadcasts(),
    getArchives(),
  ]);
  const upcoming = allBroadcasts.filter((b) => b.hosts.includes(m.slug));
  const pastArchives = allArchives.filter((a) => a.hosts.includes(m.slug));

  // 他のMCへの導線（前後 + 残りのアバター）
  const idx = members.findIndex((x) => x.slug === m.slug);
  const prev = members[(idx - 1 + members.length) % members.length];
  const next = members[(idx + 1) % members.length];
  const others = members.filter((x) => x.slug !== m.slug);

  const bioParagraphs = m.bio.split("\n\n");

  return (
    <>
      {/* ===================== HERO ===================== */}
      <header
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(150deg, ${m.colorSub} 0%, ${m.color} 70%)`,
        }}
      >
        <div className="absolute inset-0 halftone opacity-40" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-10 sm:pt-14 pb-0">
          {/* パンくず */}
          <Link
            href="/members"
            className="inline-flex items-center gap-1.5 text-white/90 text-sm font-bold hover:text-white transition-colors"
          >
            <span aria-hidden>←</span> MC紹介一覧へ
          </Link>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-end">
            {/* テキスト */}
            <div className="reveal order-2 md:order-1 pb-10 md:pb-16">
              <p className="font-[family-name:var(--font-latin)] tracking-[0.22em] text-white/85 text-sm">
                {m.romaji}
              </p>
              <h1 className="mt-2 font-[family-name:var(--font-display)] text-white text-5xl sm:text-6xl md:text-7xl leading-[0.95] drop-shadow-[0_4px_0_rgba(0,0,0,0.15)]">
                {m.name}
              </h1>
              <p className="mt-3 text-white/90 font-[family-name:var(--font-rounded)] font-bold text-base">
                {m.kana}
              </p>
              <p className="mt-5 inline-block pill bg-white/20 text-white text-sm px-4 py-2 backdrop-blur font-bold leading-snug">
                {m.catch}
              </p>
            </div>

            {/* キャラクター全身画像 */}
            <div className="order-1 md:order-2 flex justify-center md:justify-end">
              <div className="relative w-full max-w-[360px] aspect-[3/4]">
                <Image
                  src={m.image}
                  alt={m.name}
                  fill
                  priority
                  sizes="(max-width:768px) 80vw, 360px"
                  className="object-contain object-bottom drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
        {/* 下端カーブ */}
        <div className="h-10 sm:h-14 bg-[var(--cream)] [clip-path:ellipse(80%_100%_at_50%_100%)] -mt-1" />
      </header>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(280px,360px)] gap-8 lg:gap-12">
          {/* ===================== 左カラム: bio + 出演回 ===================== */}
          <div className="min-w-0">
            {/* bio */}
            <section aria-labelledby="bio-heading">
              <h2
                id="bio-heading"
                className="font-[family-name:var(--font-rounded)] font-black text-2xl text-[var(--ink)] flex items-center gap-3"
              >
                <span
                  className="inline-block w-2 h-7 rounded-full"
                  style={{ background: m.color }}
                  aria-hidden
                />
                プロフィール
              </h2>
              <div className="mt-5 space-y-4">
                {bioParagraphs.map((p, i) => (
                  <p
                    key={i}
                    className="text-[var(--ink)] leading-relaxed text-sm sm:text-base"
                  >
                    {p}
                  </p>
                ))}
              </div>

              {/* links */}
              {m.links.length > 0 && (
                <div className="mt-7 flex flex-wrap gap-3">
                  {m.links.map((l) => (
                    <GradButton key={l.url} href={l.url} external variant="ghost">
                      {l.label} ↗
                    </GradButton>
                  ))}
                </div>
              )}
            </section>

            {/* 出演回 */}
            {(upcoming.length > 0 || pastArchives.length > 0) && (
              <section aria-labelledby="appearances-heading" className="mt-12">
                <h2
                  id="appearances-heading"
                  className="font-[family-name:var(--font-rounded)] font-black text-2xl text-[var(--ink)] flex items-center gap-3"
                >
                  <span
                    className="inline-block w-2 h-7 rounded-full"
                    style={{ background: m.color }}
                    aria-hidden
                  />
                  出演回
                </h2>

                {/* 放送予定 */}
                {upcoming.length > 0 && (
                  <div className="mt-5">
                    <p className="text-xs font-bold tracking-wider text-[var(--ink-soft)]">
                      放送予定
                    </p>
                    <ul className="mt-3 flex flex-col gap-3">
                      {upcoming.map((b) => {
                        const card = (
                          <div className="rounded-2xl bg-white p-4 shadow-[var(--shadow-pop)] flex items-start gap-3 transition-transform group-hover:-translate-y-0.5">
                            <span
                              className="mt-0.5 shrink-0 pill text-white text-[11px] px-2.5 py-1"
                              style={{ background: m.color }}
                            >
                              {b.episode || "放送予定"}
                            </span>
                            <div className="min-w-0">
                              <p className="font-[family-name:var(--font-latin)] text-sm font-semibold text-[var(--ink-soft)]">
                                {formatDate(b.date)}
                              </p>
                              <p className="mt-0.5 font-[family-name:var(--font-rounded)] font-bold text-[var(--ink)] leading-snug">
                                {b.title}
                              </p>
                            </div>
                          </div>
                        );
                        return (
                          <li key={b.id}>
                            {b.url ? (
                              <a
                                href={b.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group block"
                              >
                                {card}
                              </a>
                            ) : (
                              card
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/* アーカイブ */}
                {pastArchives.length > 0 && (
                  <div className="mt-6">
                    <p className="text-xs font-bold tracking-wider text-[var(--ink-soft)]">
                      アーカイブ
                    </p>
                    <ul className="mt-3 flex flex-col gap-3">
                      {pastArchives.map((a) => (
                        <li key={a.id}>
                          <a
                            href={a.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block rounded-2xl bg-white p-4 shadow-[var(--shadow-pop)] flex items-start gap-3 transition-transform hover:-translate-y-0.5"
                          >
                            <span
                              className="mt-0.5 shrink-0 pill text-[11px] px-2.5 py-1"
                              style={{
                                background: `${m.color}1a`,
                                color: m.color,
                              }}
                            >
                              {a.episode}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="font-[family-name:var(--font-latin)] text-sm font-semibold text-[var(--ink-soft)]">
                                {formatDate(a.date)}
                              </p>
                              <p className="mt-0.5 font-[family-name:var(--font-rounded)] font-bold text-[var(--ink)] leading-snug">
                                {a.title}
                              </p>
                            </div>
                            <span className="shrink-0 self-center text-[var(--ink-soft)] transition-transform group-hover:translate-x-1">
                              ▶
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}
          </div>

          {/* ===================== 右カラム: プロフィール表 ===================== */}
          <aside className="lg:sticky lg:top-6 self-start">
            <div className="grad-border p-1 shadow-[var(--shadow-pop)]">
              <div className="rounded-[18px] bg-white p-6">
                <h2
                  className="font-[family-name:var(--font-rounded)] font-black text-lg text-[var(--ink)]"
                  style={{ color: m.color }}
                >
                  DATA
                </h2>
                <dl className="mt-4 divide-y divide-[var(--ink-soft)]/10">
                  {m.profile.map((p) => (
                    <div
                      key={p.label}
                      className="py-3 flex items-start justify-between gap-4"
                    >
                      <dt className="shrink-0 text-xs font-bold tracking-wide text-[var(--ink-soft)]">
                        {p.label}
                      </dt>
                      <dd className="text-right text-sm font-bold text-[var(--ink)]">
                        {p.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </aside>
        </div>

        {/* ===================== 他のMCへの導線 ===================== */}
        <nav
          aria-label="他のパーソナリティ"
          className="mt-16 pt-10 border-t border-[var(--ink-soft)]/10"
        >
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h2 className="font-[family-name:var(--font-rounded)] font-black text-xl text-[var(--ink)]">
              ほかのパーソナリティ
            </h2>
            <Link
              href="/members"
              className="text-sm font-bold text-[var(--magenta)] hover:underline"
            >
              一覧へ戻る →
            </Link>
          </div>

          {/* 他3人のアバターリンク */}
          <ul className="mt-6 grid grid-cols-3 gap-3 sm:gap-5">
            {others.map((o) => (
              <li key={o.slug}>
                <Link
                  href={`/members/${o.slug}`}
                  className="group block rounded-3xl overflow-hidden bg-white shadow-[var(--shadow-pop)] hover:-translate-y-1 transition-transform"
                >
                  <div
                    className="relative aspect-[3/4]"
                    style={{
                      background: `linear-gradient(160deg, ${o.colorSub}, ${o.color})`,
                    }}
                  >
                    <div className="absolute inset-0 halftone opacity-40" />
                    <Image
                      src={o.image}
                      alt={o.name}
                      fill
                      sizes="(max-width:640px) 33vw, 200px"
                      className="object-contain object-bottom transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <p className="px-2 py-3 text-center font-[family-name:var(--font-rounded)] font-black text-xs sm:text-sm text-[var(--ink)] leading-tight">
                    {o.name}
                  </p>
                </Link>
              </li>
            ))}
          </ul>

          {/* 前後ナビ */}
          <div className="mt-8 flex items-stretch justify-between gap-3">
            <Link
              href={`/members/${prev.slug}`}
              className="group flex-1 max-w-[48%] rounded-2xl bg-white p-4 shadow-[var(--shadow-pop)] hover:-translate-y-0.5 transition-transform"
            >
              <span className="text-xs font-bold text-[var(--ink-soft)]">
                ← PREV
              </span>
              <p
                className="mt-1 font-[family-name:var(--font-rounded)] font-black text-[var(--ink)] leading-tight truncate"
                style={{ color: prev.color }}
              >
                {prev.name}
              </p>
            </Link>
            <Link
              href={`/members/${next.slug}`}
              className="group flex-1 max-w-[48%] rounded-2xl bg-white p-4 shadow-[var(--shadow-pop)] hover:-translate-y-0.5 transition-transform text-right"
            >
              <span className="text-xs font-bold text-[var(--ink-soft)]">
                NEXT →
              </span>
              <p
                className="mt-1 font-[family-name:var(--font-rounded)] font-black text-[var(--ink)] leading-tight truncate"
                style={{ color: next.color }}
              >
                {next.name}
              </p>
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
