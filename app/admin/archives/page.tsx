import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getArchives } from "@/lib/content";
import { members } from "@/data/members";
import type { Archive } from "@/data/types";
import { AdminShell, FlashMessage } from "@/components/admin/AdminShell";
import {
  Card,
  Field,
  inputClass,
  PrimaryButton,
  DangerButton,
  SectionHeading,
} from "@/components/admin/fields";
import { saveArchive, deleteArchive } from "@/app/admin/actions";

const slugHint = `MCの slug: ${members.map((m) => `${m.slug}(${m.name})`).join(" / ")}`;

function ArchiveForm({ a }: { a?: Archive }) {
  return (
    <form action={saveArchive} className="space-y-3">
      {a && <input type="hidden" name="id" value={a.id} />}
      <div className="grid sm:grid-cols-3 gap-3">
        <Field label="回表記" hint="例: 第13回">
          <input name="episode" defaultValue={a?.episode} className={inputClass} placeholder="第13回" />
        </Field>
        <Field label="配信日" required hint="YYYY-MM-DD">
          <input type="date" name="date" defaultValue={a?.date} required className={inputClass} />
        </Field>
        <Field label="再生時間" hint="例: 58:42">
          <input name="duration" defaultValue={a?.duration} className={inputClass} placeholder="58:42" />
        </Field>
      </div>
      <Field label="タイトル" required>
        <input name="title" defaultValue={a?.title} required className={inputClass} />
      </Field>
      <Field label="アーカイブURL" required hint="YouTube など">
        <input name="url" defaultValue={a?.url} required className={inputClass} placeholder="https://youtube.com/..." />
      </Field>
      <Field label="サムネイル(16:9)パス" required hint="例: /thumbnails/ep-013.jpg">
        <input name="thumbnail" defaultValue={a?.thumbnail} required className={inputClass} placeholder="/thumbnails/..." />
      </Field>
      <Field label="出演MC" hint={slugHint}>
        <input name="hosts" defaultValue={a?.hosts.join(", ")} className={inputClass} placeholder="riu, kurumi" />
      </Field>
      <Field label="ゲスト" hint="カンマ区切り（任意）">
        <input name="guests" defaultValue={a?.guests?.join(", ")} className={inputClass} />
      </Field>
      <Field label="内容サマリー">
        <textarea name="summary" defaultValue={a?.summary} rows={2} className={inputClass} />
      </Field>
      <div className="pt-1">
        <PrimaryButton>{a ? "更新する" : "追加する"}</PrimaryButton>
      </div>
    </form>
  );
}

export default async function AdminArchives({
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
  const list = [...(await getArchives())].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <AdminShell active="/admin/archives" email={user.email ?? undefined}>
      <SectionHeading title="アーカイブ" desc="過去アーカイブの追加・編集・削除ができます。" />
      <FlashMessage saved={!!sp.saved} deleted={!!sp.deleted} />

      <Card className="mb-8">
        <h2 className="font-bold text-[var(--ink)] mb-4">＋ 新しいアーカイブを追加</h2>
        <ArchiveForm />
      </Card>

      <h2 className="font-bold text-[var(--ink)] mb-3">登録済み（{list.length}件）</h2>
      <div className="space-y-3">
        {list.map((a) => (
          <details key={a.id} className="rounded-2xl bg-white shadow-[var(--shadow-pop)] overflow-hidden">
            <summary className="cursor-pointer px-5 py-4 flex items-center gap-3 list-none">
              <span className="text-xs text-[var(--ink-soft)] font-bold tabular-nums">{a.date}</span>
              <span className="flex-1 text-sm font-bold text-[var(--ink)] truncate">
                {a.episode && <span className="text-[var(--magenta)] mr-1">{a.episode}</span>}
                {a.title}
              </span>
              <span className="text-xs text-[var(--ink-soft)]">編集 ▼</span>
            </summary>
            <div className="px-5 pb-5 pt-1 border-t border-[var(--ink-soft)]/10">
              <ArchiveForm a={a} />
              <form action={deleteArchive} className="mt-3">
                <input type="hidden" name="id" value={a.id} />
                <DangerButton>このアーカイブを削除</DangerButton>
              </form>
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
