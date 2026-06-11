import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getBroadcasts } from "@/lib/content";
import { members } from "@/data/members";
import type { Broadcast } from "@/data/types";
import { AdminShell, FlashMessage } from "@/components/admin/AdminShell";
import {
  Card,
  Field,
  inputClass,
  PrimaryButton,
  DangerButton,
  SectionHeading,
} from "@/components/admin/fields";
import { saveBroadcast, deleteBroadcast, archiveBroadcast } from "@/app/admin/actions";

const slugHint = `MCの slug: ${members.map((m) => `${m.slug}(${m.name})`).join(" / ")}`;

function BroadcastForm({ b }: { b?: Broadcast }) {
  return (
    <form action={saveBroadcast} className="space-y-3">
      {b && <input type="hidden" name="id" value={b.id} />}
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="回表記" hint="例: 第4回">
          <input name="episode" defaultValue={b?.episode} className={inputClass} placeholder="第4回" />
        </Field>
        <Field label="ステータス" required>
          <select name="status" defaultValue={b?.status ?? "upcoming"} className={inputClass}>
            <option value="upcoming">放送予定</option>
            <option value="live">配信中(LIVE)</option>
            <option value="ended">放送終了</option>
          </select>
        </Field>
      </div>
      <Field label="タイトル" required>
        <input name="title" defaultValue={b?.title} required className={inputClass} />
      </Field>
      <div className="grid sm:grid-cols-3 gap-3">
        <Field label="放送日" required hint="YYYY-MM-DD">
          <input type="date" name="date" defaultValue={b?.date} required className={inputClass} />
        </Field>
        <Field label="開始" hint="HH:MM">
          <input name="start" defaultValue={b?.start ?? "21:00"} className={inputClass} placeholder="21:00" />
        </Field>
        <Field label="終了" hint="HH:MM">
          <input name="end" defaultValue={b?.end ?? "22:00"} className={inputClass} placeholder="22:00" />
        </Field>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="配信プラットフォーム">
          <input name="platform" defaultValue={b?.platform ?? "REALITY"} className={inputClass} />
        </Field>
        <Field label="視聴/予約URL">
          <input name="url" defaultValue={b?.url} className={inputClass} placeholder="https://" />
        </Field>
      </div>
      <Field label="出演MC" hint={slugHint}>
        <input name="hosts" defaultValue={b?.hosts.join(", ")} className={inputClass} placeholder="riu, kurumi" />
      </Field>
      <Field label="ゲスト" hint="カンマ区切り（任意）">
        <input name="guests" defaultValue={b?.guests?.join(", ")} className={inputClass} />
      </Field>
      <Field label="サムネイル(16:9)パス" hint="例: /thumbnails/ep-004.jpg（任意）">
        <input name="thumbnail" defaultValue={b?.thumbnail} className={inputClass} placeholder="/thumbnails/..." />
      </Field>
      <Field label="概要">
        <textarea name="description" defaultValue={b?.description} rows={2} className={inputClass} />
      </Field>
      <div className="flex items-center gap-3 pt-1">
        <PrimaryButton>{b ? "更新する" : "追加する"}</PrimaryButton>
      </div>
    </form>
  );
}

export default async function AdminBroadcasts({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  if (!isSupabaseConfigured()) return null;
  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect("/admin/login");

  const sp = await searchParams;
  const list = [...(await getBroadcasts())].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <AdminShell active="/admin/broadcasts" email={user.email ?? undefined}>
      <SectionHeading title="放送予定" desc="配信スケジュールの追加・編集・削除ができます。" />
      <FlashMessage saved={!!sp.saved} deleted={!!sp.deleted} />

      <Card className="mb-8">
        <h2 className="font-bold text-[var(--ink)] mb-4">＋ 新しい放送予定を追加</h2>
        <BroadcastForm />
      </Card>

      <h2 className="font-bold text-[var(--ink)] mb-3">
        登録済み（{list.length}件）
      </h2>
      <div className="space-y-3">
        {list.map((b) => (
          <details key={b.id} className="rounded-2xl bg-white shadow-[var(--shadow-pop)] overflow-hidden">
            <summary className="cursor-pointer px-5 py-4 flex items-center gap-3 list-none">
              <span className={`pill text-[10px] px-2 py-1 ${
                b.status === "ended" ? "bg-[var(--ink-soft)]/15 text-[var(--ink-soft)]" : "bg-brand text-white"
              }`}>
                {b.status === "ended" ? "終了" : b.status === "live" ? "LIVE" : "予定"}
              </span>
              <span className="text-xs text-[var(--ink-soft)] font-bold tabular-nums">{b.date}</span>
              <span className="flex-1 text-sm font-bold text-[var(--ink)] truncate">
                {b.episode && <span className="text-[var(--magenta)] mr-1">{b.episode}</span>}
                {b.title}
              </span>
              <span className="text-xs text-[var(--ink-soft)]">編集 ▼</span>
            </summary>
            <div className="px-5 pb-5 pt-1 border-t border-[var(--ink-soft)]/10">
              <BroadcastForm b={b} />
              <div className="mt-4 pt-4 border-t border-dashed border-[var(--ink-soft)]/20 flex flex-wrap items-center gap-3">
                <form action={archiveBroadcast}>
                  <input type="hidden" name="id" value={b.id} />
                  <button className="pill bg-[var(--magenta)]/10 text-[var(--magenta)] border border-[var(--magenta)]/30 px-4 py-2 text-xs font-bold hover:bg-[var(--magenta)]/20 transition">
                    ▶ アーカイブへ移行
                  </button>
                </form>
                <span className="text-[11px] text-[var(--ink-soft)]">
                  放送終了後に押すと、この内容がアーカイブへ移動します（移行後にアーカイブURLを設定できます）。
                </span>
                <form action={deleteBroadcast} className="ml-auto">
                  <input type="hidden" name="id" value={b.id} />
                  <DangerButton>削除</DangerButton>
                </form>
              </div>
            </div>
          </details>
        ))}
        {list.length === 0 && (
          <p className="text-sm text-[var(--ink-soft)]">まだ登録がありません。</p>
        )}
      </div>
    </AdminShell>
  );
}
