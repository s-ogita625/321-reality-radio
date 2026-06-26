import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getXPosts } from "@/lib/content";
import type { XPost } from "@/data/types";
import { AdminShell, FlashMessage } from "@/components/admin/AdminShell";
import {
  Card,
  Field,
  inputClass,
  PrimaryButton,
  DangerButton,
  SectionHeading,
} from "@/components/admin/fields";
import { saveXPost, deleteXPost } from "@/app/admin/actions";

function PostForm({ p }: { p?: XPost }) {
  return (
    <form action={saveXPost} className="space-y-3">
      {p && <input type="hidden" name="id" value={p.id} />}
      <Field
        label="X(旧Twitter)投稿URL"
        required
        hint="例: https://x.com/ユーザー名/status/123456..."
      >
        <input
          name="url"
          defaultValue={p?.url}
          required
          className={inputClass}
          placeholder="https://x.com/.../status/..."
        />
      </Field>
      <div className="grid sm:grid-cols-3 gap-3">
        <Field label="表示順" hint="小さいほど先頭">
          <input
            type="number"
            name="sort_order"
            defaultValue={p ? p.sortOrder : 0}
            className={inputClass}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="メモ（管理用・任意）">
            <input name="note" defaultValue={p?.note} className={inputClass} />
          </Field>
        </div>
      </div>
      <label className="flex items-start gap-2.5 rounded-lg bg-[var(--cream)] px-3 py-2.5 cursor-pointer">
        <input
          type="checkbox"
          name="show_full"
          value="1"
          defaultChecked={p?.full ?? false}
          className="mt-0.5 w-4 h-4 accent-[var(--magenta)]"
        />
        <span className="text-xs text-[var(--ink)] leading-relaxed">
          <span className="font-bold">このサイトで全文を表示する</span>
          <br />
          <span className="text-[var(--ink-soft)]">
            OFF（標準）= 高さ統一カードで表示し、長い投稿は省略。ON = 省略せず全文を表示します。
          </span>
        </span>
      </label>
      <div className="pt-1">
        <PrimaryButton>{p ? "更新する" : "追加する"}</PrimaryButton>
      </div>
    </form>
  );
}

export default async function AdminPosts({
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
  const list = await getXPosts();

  return (
    <AdminShell active="/admin/posts" email={user.email ?? undefined}>
      <SectionHeading
        title="X投稿（#321REALITYラジオ）"
        desc="表示したいXの投稿URLを登録します。テキスト・画像・動画つきで公式埋め込み表示されます。"
      />
      <FlashMessage saved={!!sp.saved} deleted={!!sp.deleted} />

      <Card className="mb-8">
        <h2 className="font-bold text-[var(--ink)] mb-4">＋ 投稿を追加</h2>
        <PostForm />
        <p className="mt-4 text-[11px] text-[var(--ink-soft)] leading-relaxed">
          ※ Xの投稿で「…」メニュー →「ポストへのリンクをコピー」で取得したURLを貼り付けてください。
          非公開アカウントや削除された投稿は表示されません。
        </p>
      </Card>

      <h2 className="font-bold text-[var(--ink)] mb-3">登録済み（{list.length}件）</h2>
      <div className="space-y-3">
        {list.map((p) => (
          <details key={p.id} className="rounded-2xl bg-white shadow-[var(--shadow-pop)] overflow-hidden">
            <summary className="cursor-pointer px-5 py-4 flex items-center gap-3 list-none">
              <span className="text-xs text-[var(--ink-soft)] font-bold tabular-nums">
                #{p.sortOrder}
              </span>
              <span className="flex-1 text-xs sm:text-sm text-[var(--ink)] truncate">
                {p.note ? <span className="font-bold mr-2">{p.note}</span> : null}
                <span className="text-[var(--ink-soft)]">{p.url}</span>
              </span>
              <span className="text-xs text-[var(--ink-soft)]">編集 ▼</span>
            </summary>
            <div className="px-5 pb-5 pt-1 border-t border-[var(--ink-soft)]/10">
              <PostForm p={p} />
              <form action={deleteXPost} className="mt-3">
                <input type="hidden" name="id" value={p.id} />
                <DangerButton>この投稿を削除</DangerButton>
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
