import Link from "next/link";
import Image from "next/image";
import { getMembers } from "@/lib/content";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "MC紹介" };
export const revalidate = 60;

export default async function MembersPage() {
  const members = await getMembers();
  return (
    <>
      <PageHeader
        label="PERSONALITY"
        title="MC紹介"
        description="番組をお届けする4人の新パーソナリティ。"
      />

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {members.map((m, i) => (
            <li
              key={m.slug}
              className="reveal"
              style={{ animationDelay: `${0.1 * i}s` }}
            >
              <Link
                href={`/members/${m.slug}`}
                className="group relative block rounded-3xl overflow-hidden bg-white shadow-[var(--shadow-pop)] hover:-translate-y-1.5 transition-transform focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--magenta)]/40"
                aria-label={`${m.name}のプロフィールを見る`}
              >
                {/* キャラクター（テーマカラーのグラデ背景 + halftone） */}
                <div
                  className="relative aspect-[3/4]"
                  style={{
                    background: `linear-gradient(160deg, ${m.colorSub}, ${m.color})`,
                  }}
                >
                  <div className="absolute inset-0 halftone opacity-40" />
                  <Image
                    src={m.image}
                    alt={m.name}
                    fill
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
                    className="object-contain object-bottom drop-shadow-xl transition-transform duration-300 group-hover:scale-105"
                    priority={i < 2}
                  />
                  <span
                    className="absolute top-3 right-3 w-3.5 h-3.5 rounded-full ring-2 ring-white"
                    style={{ background: m.color }}
                    aria-hidden
                  />
                </div>

                {/* テキスト */}
                <div className="p-5">
                  <p className="font-[family-name:var(--font-latin)] text-[11px] tracking-[0.18em] text-[var(--ink-soft)]">
                    {m.romaji}
                  </p>
                  <h2 className="mt-0.5 font-[family-name:var(--font-rounded)] font-black text-xl text-[var(--ink)] leading-tight">
                    {m.name}
                  </h2>
                  <p className="mt-2 text-sm text-[var(--ink-soft)] leading-snug line-clamp-2">
                    {m.catch}
                  </p>
                  <span
                    className="mt-4 inline-flex items-center gap-1 text-sm font-bold transition-colors"
                    style={{ color: m.color }}
                  >
                    プロフィールを見る
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
