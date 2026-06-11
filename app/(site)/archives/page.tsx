import { getArchives } from "@/lib/content";
import { PageHeader } from "@/components/PageHeader";
import { SectionTitle, Thumb16x9, HostStack, formatDate } from "@/components/ui";

export const metadata = { title: "アーカイブ" };
export const revalidate = 60;

export default async function ArchivesPage() {
  const archives = await getArchives();
  // 日付降順（新しい回が先頭）
  const sortedArchives = [...archives].sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  return (
    <>
      <PageHeader
        label="ARCHIVE"
        title="アーカイブ"
        description="過去放送のアーカイブ一覧。気になる回をいつでも見返せます。"
      />

      {/* ===================== 過去アーカイブ ===================== */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-16 mb-24">
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
    </>
  );
}
