import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { SectionHeading } from "@/components/admin/fields";

export default async function AdminDashboard() {
  if (!isSupabaseConfigured()) return null;
  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect("/admin/login");

  const [bc, ar, gu, me] = await Promise.all([
    sb.from("broadcasts").select("id", { count: "exact", head: true }),
    sb.from("archives").select("id", { count: "exact", head: true }),
    sb.from("guests").select("id", { count: "exact", head: true }),
    sb.from("members").select("slug", { count: "exact", head: true }),
  ]);

  const cards = [
    { href: "/admin/broadcasts", label: "放送予定", count: bc.count ?? 0, desc: "配信スケジュールの追加・編集・削除", icon: "📻" },
    { href: "/admin/archives", label: "アーカイブ", count: ar.count ?? 0, desc: "過去アーカイブの追加・編集・削除", icon: "▶" },
    { href: "/admin/guests", label: "ゲスト", count: gu.count ?? 0, desc: "過去ゲストの追加・編集・削除", icon: "🎤" },
    { href: "/admin/members", label: "MC紹介", count: me.count ?? 0, desc: "パーソナリティの追加・編集・削除", icon: "🎙" },
    { href: "/admin/settings", label: "リンク・設定", count: null, desc: "SNS・お便りフォーム等の各種リンク", icon: "🔗" },
  ];

  return (
    <AdminShell active="/admin" email={user.email ?? undefined}>
      <SectionHeading
        title="ダッシュボード"
        desc="各メニューから内容を編集できます。保存すると公開サイトに即反映されます。"
      />
      <div className="grid sm:grid-cols-2 gap-4">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group rounded-2xl bg-white shadow-[var(--shadow-pop)] p-5 flex items-center gap-4 hover:-translate-y-0.5 transition-transform"
          >
            <span className="grid place-items-center w-12 h-12 rounded-xl bg-soft text-xl">
              {c.icon}
            </span>
            <div className="flex-1">
              <p className="font-[family-name:var(--font-rounded)] font-bold text-[var(--ink)]">
                {c.label}
                {c.count !== null && (
                  <span className="ml-2 text-xs text-[var(--magenta)] font-black">
                    {c.count}件
                  </span>
                )}
              </p>
              <p className="text-xs text-[var(--ink-soft)] mt-0.5">{c.desc}</p>
            </div>
            <span className="text-[var(--ink-soft)] group-hover:text-[var(--magenta)]">→</span>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
