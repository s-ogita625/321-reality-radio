import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getSiteSettings } from "@/lib/content";
import { AdminShell, FlashMessage } from "@/components/admin/AdminShell";
import {
  Card,
  Field,
  inputClass,
  PrimaryButton,
  SectionHeading,
} from "@/components/admin/fields";
import { saveSettings } from "@/app/admin/actions";

export default async function AdminSettings({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  if (!isSupabaseConfigured()) return null;
  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect("/admin/login");

  const sp = await searchParams;
  const s = await getSiteSettings();
  const socialsText = s.socials.map((x) => `${x.label}|${x.url}`).join("\n");

  return (
    <AdminShell active="/admin/settings" email={user.email ?? undefined}>
      <SectionHeading
        title="リンク・設定"
        desc="番組情報や各種リンク（SNS・お便りフォーム）を編集できます。"
      />
      <FlashMessage saved={!!sp.saved} />

      <form action={saveSettings} className="space-y-6">
        <Card>
          <h2 className="font-bold text-[var(--ink)] mb-4">番組情報</h2>
          <div className="space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="番組名">
                <input name="name" defaultValue={s.name} className={inputClass} />
              </Field>
              <Field label="運営表記">
                <input name="company" defaultValue={s.company} className={inputClass} />
              </Field>
            </div>
            <Field label="キャッチコピー">
              <input name="tagline" defaultValue={s.tagline} className={inputClass} />
            </Field>
            <Field label="番組概要">
              <textarea name="description" defaultValue={s.description} rows={3} className={inputClass} />
            </Field>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="放送枠" hint="例: 毎週金曜 21:00 - 22:00">
                <input name="regular_slot" defaultValue={s.regularSlot} className={inputClass} />
              </Field>
              <Field label="配信プラットフォーム">
                <input name="platform" defaultValue={s.platform} className={inputClass} />
              </Field>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="font-bold text-[var(--ink)] mb-4">各種リンク</h2>
          <div className="space-y-3">
            <Field label="お便りフォーム URL" hint="トップの「お便りを送る」ボタンに使用">
              <input name="mail_form_url" defaultValue={s.mailFormUrl} className={inputClass} placeholder="https://forms.gle/..." />
            </Field>
            <Field
              label="SNS・公式リンク"
              hint="1行に1つ、「ラベル|URL」の形式（フッターに表示）"
            >
              <textarea
                name="socials"
                defaultValue={socialsText}
                rows={5}
                className={`${inputClass} font-mono text-xs`}
                placeholder={"X (Twitter)|https://x.com/\nYouTube|https://youtube.com/"}
              />
            </Field>
          </div>
        </Card>

        <PrimaryButton>設定を保存</PrimaryButton>
      </form>
    </AdminShell>
  );
}
