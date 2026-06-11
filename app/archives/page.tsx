import Image from "next/image";
import { getArchives, getGuests } from "@/lib/content";
import { PageHeader } from "@/components/PageHeader";
import {
  SectionTitle,
  Thumb16x9,
  HostStack,
  GradButton,
  formatDate,
} from "@/components/ui";

export const metadata = { title: "アーカイブ＆ゲスト" };

export default async function ArchivesPage() {
  const [archives, guests] = await Promise.all([getArchives(), getGuests()]);
  // 日付降順（新しい回が先頭）
  const sortedArchives = [...archives].sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  return (
    <>
      <PageHeader
        label="ARCHIVE & GUEST"
        title="アーカイブ＆ゲスト"
        description="過去放送のアーカイブと、これまでにご出演いただいたゲストの一覧。"
      />

      {/* ===================== 過去アーカイブ ===================== */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-16">
        <SectionTitle label="ARCHIVE" title="過去アーカイブ" />

        {sortedArchives.length > 0 ? (
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedArchives.map((a) => (
              <a
                key={a.id}
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-3xl bg-white shadow-[var(--shadow-pop)] overflow-hidden hover:-translate-y-1 transition-transform"
              >
                <div className="relative">
                  <Thumb16x9 src={a.thumbnail} alt={a.title} className="rounded-none" />
                  {a.duration && (
                    <span className="absolute bottom-2 right-2 pill bg-black/60 text-white text-[10px] px-2 py-1">
                      ▶ {a.duration}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 text-xs text-[var(--ink-soft)] font-bold">
                    <span className="text-[var(--magenta)]">{a.episode}</span>
                    <span>{formatDate(a.date)}</span>
                  </div>
                  <h3 className="mt-1 font-[family-name:var(--font-rounded)] font-bold text-[var(--ink)] leading-snug line-clamp-2">
                    {a.title}
                  </h3>
                  {a.guests && a.guests.length > 0 && (
                    <p className="mt-2 text-xs font-bold text-[var(--ink-soft)]">
                      ゲスト：{a.guests.join("、")}
                    </p>
                  )}
                  {a.summary && (
                    <p className="mt-2 text-xs text-[var(--ink-soft)] leading-relaxed line-clamp-2">
                      {a.summary}
                    </p>
                  )}
                  <div className="mt-3">
                    <HostStack slugs={a.hosts} />
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl bg-white/70 border border-[var(--magenta)]/15 shadow-sm p-10 text-center">
            <p className="text-[var(--ink-soft)] text-sm">
              まだアーカイブがありません。放送終了後に順次公開予定です📻
            </p>
          </div>
        )}
      </section>

      {/* ===================== 過去ゲスト ===================== */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-24 mb-24">
        <SectionTitle label="GUEST" title="過去ゲスト" />

        {guests.length > 0 ? (
          <ul className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {guests.map((g) => (
              <li
                key={g.id}
                className="rounded-3xl bg-white shadow-[var(--shadow-pop)] p-6 hover:-translate-y-1 transition-transform"
              >
                <div className="flex items-center gap-4">
                  {g.avatar ? (
                    <Image
                      src={g.avatar}
                      alt={g.name}
                      width={56}
                      height={56}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-sm"
                    />
                  ) : (
                    <span
                      className="grid place-items-center w-14 h-14 rounded-full bg-brand text-white ring-2 ring-white shadow-sm font-[family-name:var(--font-rounded)] font-black text-xl"
                      aria-hidden
                    >
                      {[...g.name][0]}
                    </span>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-[family-name:var(--font-rounded)] font-bold text-[var(--ink)] leading-tight truncate">
                      {g.name}
                    </h3>
                    {g.role && (
                      <span className="mt-1 inline-block pill bg-[var(--magenta)]/10 text-[var(--magenta)] text-[10px] px-2.5 py-1">
                        {g.role}
                      </span>
                    )}
                  </div>
                </div>

                {g.bio && (
                  <p className="mt-4 text-sm text-[var(--ink-soft)] leading-relaxed">
                    {g.bio}
                  </p>
                )}

                {g.appearances.length > 0 && (
                  <div className="mt-4">
                    <p className="font-[family-name:var(--font-latin)] text-[10px] tracking-widest text-[var(--ink-soft)]">
                      APPEARANCES
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {g.appearances.map((ep) => (
                        <span
                          key={ep}
                          className="pill bg-soft text-[var(--ink-soft)] text-[10px] px-2.5 py-1 font-bold"
                        >
                          {ep}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {g.link && (
                  <div className="mt-5">
                    <GradButton href={g.link} external variant="ghost">
                      プロフィール →
                    </GradButton>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-8 rounded-3xl bg-white/70 border border-[var(--magenta)]/15 shadow-sm p-10 text-center">
            <p className="text-[var(--ink-soft)] text-sm">
              これまでにご出演いただいたゲストはまだいません。
            </p>
          </div>
        )}
      </section>
    </>
  );
}
