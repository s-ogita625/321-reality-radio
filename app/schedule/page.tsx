import { getBroadcasts } from "@/lib/content";
import type { Broadcast } from "@/data/types";
import {
  StatusBadge,
  Thumb16x9,
  HostStack,
  GradButton,
  formatDate,
} from "@/components/ui";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "放送予定" };

// upcoming/live を上に、ended を下に。各グループ内は日付昇順。
function sortBroadcasts(list: Broadcast[]) {
  const rank = (b: Broadcast) => (b.status === "ended" ? 1 : 0);
  return [...list].sort(
    (a, b) => rank(a) - rank(b) || a.date.localeCompare(b.date)
  );
}

export default async function SchedulePage() {
  const sorted = sortBroadcasts(await getBroadcasts());

  return (
    <>
      <PageHeader
        label="SCHEDULE"
        title="放送予定"
        description="毎週金曜よる21時オンエア。最新の放送スケジュールはこちら。"
      />

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
        {sorted.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="flex flex-col gap-6 sm:gap-8">
            {sorted.map((b, i) => (
              <li
                key={b.id}
                className="reveal"
                style={{ animationDelay: `${0.08 * i}s` }}
              >
                <BroadcastCard broadcast={b} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

function BroadcastCard({ broadcast: b }: { broadcast: Broadcast }) {
  const isEnded = b.status === "ended";

  return (
    <article
      className={`grid grid-cols-1 sm:grid-cols-[minmax(220px,38%)_1fr] gap-5 sm:gap-7 rounded-3xl bg-white p-4 sm:p-6 shadow-[var(--shadow-pop)] hover:-translate-y-1 transition-transform ${
        isEnded ? "opacity-80" : ""
      }`}
    >
      {/* 左: サムネ + 日付ブロック */}
      <div className="flex flex-col gap-3">
        <Thumb16x9 src={b.thumbnail} alt={b.title} label="COMING SOON" />
        <div className="text-center sm:text-left">
          <p className="font-[family-name:var(--font-latin)] text-2xl sm:text-3xl font-semibold text-grad leading-none">
            {formatDate(b.date)}
          </p>
          <p className="mt-1 text-sm font-bold text-[var(--ink-soft)]">
            <time dateTime={`${b.date}T${b.start}`}>{b.start}</time>
            {" - "}
            <time dateTime={`${b.date}T${b.end}`}>{b.end}</time>
            <span className="mx-1.5 text-[var(--ink-soft)]/50">/</span>
            {b.platform}
          </p>
        </div>
      </div>

      {/* 右: 詳細 */}
      <div className="flex flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={b.status} />
          {b.episode && (
            <span className="text-xs font-bold text-[var(--ink-soft)]">
              {b.episode}
            </span>
          )}
        </div>

        <h2 className="mt-3 font-[family-name:var(--font-rounded)] font-bold text-lg sm:text-xl text-[var(--ink)] leading-snug">
          {b.title}
        </h2>

        {b.description && (
          <p className="mt-2 text-sm text-[var(--ink-soft)] leading-relaxed">
            {b.description}
          </p>
        )}

        {b.guests && b.guests.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {b.guests.map((g) => (
              <span
                key={g}
                className="pill bg-[var(--purple)]/10 text-[var(--purple)] text-xs px-3 py-1.5"
              >
                ゲスト：{g}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-4 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[var(--ink-soft)]">
              出演
            </span>
            <HostStack slugs={b.hosts} />
          </div>
          {b.url && (
            <GradButton
              href={b.url}
              external
              variant={isEnded ? "ghost" : "solid"}
            >
              {isEnded ? "アーカイブを観る →" : "視聴ページへ →"}
            </GradButton>
          )}
        </div>
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="grad-border p-1 shadow-[var(--shadow-pop)]">
      <div className="rounded-[20px] bg-white px-6 py-16 text-center">
        <p className="font-[family-name:var(--font-display)] text-2xl text-grad">
          COMING SOON
        </p>
        <p className="mt-3 font-[family-name:var(--font-rounded)] font-bold text-lg text-[var(--ink)]">
          放送予定は準備中です
        </p>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">
          次回放送が決まり次第こちらでお知らせします。お楽しみに！
        </p>
      </div>
    </div>
  );
}
