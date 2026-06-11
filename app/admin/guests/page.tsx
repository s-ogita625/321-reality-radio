import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getGuests } from "@/lib/content";
import type { Guest } from "@/data/types";
import { AdminShell, FlashMessage } from "@/components/admin/AdminShell";
import {
  Card,
  Field,
  inputClass,
  PrimaryButton,
  DangerButton,
  SectionHeading,
} from "@/components/admin/fields";
import { saveGuest, deleteGuest } from "@/app/admin/actions";

function GuestForm({ g }: { g?: Guest }) {
  return (
    <form action={saveGuest} className="space-y-3">
      {g && <input type="hidden" name="id" value={g.id} />}
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="ゲスト名" required>
          <input name="name" defaultValue={g?.name} required className={inputClass} />
        </Field>
        <Field label="肩書き / 所属" hint="例: VTuber / 321 inc.">
          <input name="role" defaultValue={g?.role} className={inputClass} />
        </Field>
      </div>
      <Field label="出演回" hint="カンマ区切り（例: 第8回, 第11回）">
        <input name="appearances" defaultValue={g?.appearances.join(", ")} className={inputClass} />
      </Field>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="アイコン画像パス" hint="例: /guests/xxx.png（任意）">
          <input name="avatar" defaultValue={g?.avatar} className={inputClass} placeholder="/guests/..." />
        </Field>
        <Field label="外部リンク" hint="任意">
          <input name="link" defaultValue={g?.link} className={inputClass} placeholder="https://" />
        </Field>
      </div>
      <Field label="紹介文">
        <textarea name="bio" defaultValue={g?.bio} rows={2} className={inputClass} />
      </Field>
      <div className="pt-1">
        <PrimaryButton>{g ? "更新する" : "追加する"}</PrimaryButton>
      </div>
    </form>
  );
}

export default async function AdminGuests({
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
  const list = await getGuests();

  return (
    <AdminShell active="/admin/guests" email={user.email ?? undefined}>
      <SectionHeading title="ゲスト" desc="過去ゲストの追加・編集・削除ができます。" />
      <FlashMessage saved={!!sp.saved} deleted={!!sp.deleted} />

      <Card className="mb-8">
        <h2 className="font-bold text-[var(--ink)] mb-4">＋ 新しいゲストを追加</h2>
        <GuestForm />
      </Card>

      <h2 className="font-bold text-[var(--ink)] mb-3">登録済み（{list.length}件）</h2>
      <div className="space-y-3">
        {list.map((g) => (
          <details key={g.id} className="rounded-2xl bg-white shadow-[var(--shadow-pop)] overflow-hidden">
            <summary className="cursor-pointer px-5 py-4 flex items-center gap-3 list-none">
              <span className="flex-1 text-sm font-bold text-[var(--ink)] truncate">
                {g.name}
                {g.role && <span className="ml-2 text-xs font-normal text-[var(--ink-soft)]">{g.role}</span>}
              </span>
              <span className="text-xs text-[var(--ink-soft)]">編集 ▼</span>
            </summary>
            <div className="px-5 pb-5 pt-1 border-t border-[var(--ink-soft)]/10">
              <GuestForm g={g} />
              <form action={deleteGuest} className="mt-3">
                <input type="hidden" name="id" value={g.id} />
                <DangerButton>このゲストを削除</DangerButton>
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
