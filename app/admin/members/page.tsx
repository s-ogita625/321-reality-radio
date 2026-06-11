import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getMembers } from "@/lib/content";
import type { Member } from "@/data/types";
import { AdminShell, FlashMessage } from "@/components/admin/AdminShell";
import {
  Card,
  Field,
  inputClass,
  PrimaryButton,
  DangerButton,
  SectionHeading,
} from "@/components/admin/fields";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { saveMember, deleteMember } from "@/app/admin/actions";

function MemberForm({ m }: { m?: Member }) {
  const profileText = (m?.profile ?? []).map((p) => `${p.label}|${p.value}`).join("\n");
  const linksText = (m?.links ?? []).map((l) => `${l.label}|${l.url}`).join("\n");
  return (
    <form action={saveMember} className="space-y-3">
      <div className="grid sm:grid-cols-3 gap-3">
        <Field label="slug（URL用ID・英小文字）" required hint={m ? "変更不可" : "例: riu"}>
          <input
            name="slug"
            defaultValue={m?.slug}
            required
            readOnly={!!m}
            className={`${inputClass} ${m ? "bg-[var(--cream)] text-[var(--ink-soft)]" : ""}`}
            placeholder="riu"
          />
        </Field>
        <Field label="表示名" required>
          <input name="name" defaultValue={m?.name} required className={inputClass} placeholder="灰島リウ" />
        </Field>
        <Field label="表示順" hint="小さいほど先頭">
          <input type="number" name="sort_order" defaultValue={m ? undefined : 99} className={inputClass} placeholder="1" />
        </Field>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="ふりがな">
          <input name="kana" defaultValue={m?.kana} className={inputClass} placeholder="はいじま りう" />
        </Field>
        <Field label="ローマ字表記">
          <input name="romaji" defaultValue={m?.romaji} className={inputClass} placeholder="RIU HAIJIMA" />
        </Field>
      </div>
      <Field label="キャッチコピー">
        <input name="catch" defaultValue={m?.catch} className={inputClass} />
      </Field>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="テーマカラー（メイン）" hint="HEX">
          <div className="flex gap-2 items-center">
            <input type="color" name="color" defaultValue={m?.color ?? "#9a63e6"} className="h-9 w-12 rounded border border-[var(--ink-soft)]/25" />
            <span className="text-xs text-[var(--ink-soft)]">{m?.color ?? "#9a63e6"}</span>
          </div>
        </Field>
        <Field label="テーマカラー（サブ）" hint="HEX">
          <div className="flex gap-2 items-center">
            <input type="color" name="color_sub" defaultValue={m?.colorSub ?? "#ff7ec2"} className="h-9 w-12 rounded border border-[var(--ink-soft)]/25" />
            <span className="text-xs text-[var(--ink-soft)]">{m?.colorSub ?? "#ff7ec2"}</span>
          </div>
        </Field>
      </div>
      <ImageUpload
        name="image"
        defaultValue={m?.image ?? ""}
        folder="members"
        label="キャラクター画像（全身・縦長）"
        hint="背景透過PNG推奨"
        aspect="portrait"
      />
      <Field label="紹介文" hint="段落は空行で区切り">
        <textarea name="bio" defaultValue={m?.bio} rows={4} className={inputClass} />
      </Field>
      <Field label="プロフィール項目" hint="1行に「ラベル|値」（例: 誕生日|11月3日）">
        <textarea name="profile" defaultValue={profileText} rows={5} className={`${inputClass} font-mono text-xs`} placeholder={"誕生日|11月3日\n身長|182cm"} />
      </Field>
      <Field label="SNS・リンク" hint="1行に「ラベル|URL」">
        <textarea name="links" defaultValue={linksText} rows={3} className={`${inputClass} font-mono text-xs`} placeholder={"X (Twitter)|https://x.com/"} />
      </Field>
      <div className="pt-1">
        <PrimaryButton>{m ? "更新する" : "追加する"}</PrimaryButton>
      </div>
    </form>
  );
}

export default async function AdminMembers({
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
  const list = await getMembers();

  return (
    <AdminShell active="/admin/members" email={user.email ?? undefined}>
      <SectionHeading title="MC紹介" desc="パーソナリティの追加・編集・削除ができます。" />
      <FlashMessage saved={!!sp.saved} deleted={!!sp.deleted} />

      <Card className="mb-8">
        <h2 className="font-bold text-[var(--ink)] mb-4">＋ 新しいMCを追加</h2>
        <MemberForm />
      </Card>

      <h2 className="font-bold text-[var(--ink)] mb-3">登録済み（{list.length}名）</h2>
      <div className="space-y-3">
        {list.map((m) => (
          <details key={m.slug} className="rounded-2xl bg-white shadow-[var(--shadow-pop)] overflow-hidden">
            <summary className="cursor-pointer px-5 py-4 flex items-center gap-3 list-none">
              <span className="w-4 h-4 rounded-full ring-2 ring-white shadow" style={{ background: m.color }} />
              <span className="flex-1 text-sm font-bold text-[var(--ink)] truncate">
                {m.name}
                <span className="ml-2 text-xs font-normal text-[var(--ink-soft)]">{m.slug}</span>
              </span>
              <span className="text-xs text-[var(--ink-soft)]">編集 ▼</span>
            </summary>
            <div className="px-5 pb-5 pt-1 border-t border-[var(--ink-soft)]/10">
              <MemberForm m={m} />
              <form action={deleteMember} className="mt-3">
                <input type="hidden" name="slug" value={m.slug} />
                <DangerButton>このMCを削除</DangerButton>
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
