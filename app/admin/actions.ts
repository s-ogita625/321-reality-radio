"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// ---- ユーティリティ ----

/** "riu, neru 、kurumi" → ["riu","neru","kurumi"] */
function parseList(v: FormDataEntryValue | null): string[] {
  if (!v) return [];
  return String(v)
    .split(/[,、\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function str(v: FormDataEntryValue | null): string {
  return v ? String(v).trim() : "";
}

function strOrNull(v: FormDataEntryValue | null): string | null {
  const s = str(v);
  return s === "" ? null : s;
}

function genId(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

function revalidateAll() {
  // 公開サイト全体を再生成（出演回などページ横断で反映）
  revalidatePath("/", "layout");
}

// ====================== 放送予定 ======================

export async function saveBroadcast(formData: FormData) {
  const sb = await createClient();
  const id = str(formData.get("id")) || genId("ep");
  const row = {
    id,
    episode: str(formData.get("episode")),
    date: str(formData.get("date")),
    start_time: str(formData.get("start")),
    end_time: str(formData.get("end")),
    title: str(formData.get("title")),
    platform: str(formData.get("platform")) || "REALITY",
    hosts: parseList(formData.get("hosts")),
    guests: parseList(formData.get("guests")),
    thumbnail: strOrNull(formData.get("thumbnail")),
    url: strOrNull(formData.get("url")),
    description: strOrNull(formData.get("description")),
    status: str(formData.get("status")) || "upcoming",
  };
  const { error } = await sb.from("broadcasts").upsert(row);
  if (error) throw new Error(error.message);
  revalidateAll();
  redirect("/admin/broadcasts?saved=1");
}

export async function deleteBroadcast(formData: FormData) {
  const sb = await createClient();
  const id = str(formData.get("id"));
  const { error } = await sb.from("broadcasts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAll();
  redirect("/admin/broadcasts?deleted=1");
}

/**
 * 放送予定をアーカイブへ移行する。
 * 放送予定の内容（回・日付・タイトル・出演者・ゲスト・サムネ・概要）を
 * そのままアーカイブへコピーし、放送予定からは削除する。
 * 視聴URLはアーカイブURLの初期値として引き継ぎ（移行後に編集可能）。
 */
export async function archiveBroadcast(formData: FormData) {
  const sb = await createClient();
  const id = str(formData.get("id"));
  const { data: b, error: e1 } = await sb
    .from("broadcasts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (e1) throw new Error(e1.message);
  if (!b) throw new Error("対象の放送予定が見つかりませんでした。");

  const archiveRow = {
    id: b.id,
    episode: b.episode ?? "",
    date: b.date,
    title: b.title,
    thumbnail: b.thumbnail ?? "",
    url: b.url ?? "", // アーカイブURLの初期値（移行後に設定）
    hosts: b.hosts ?? [],
    guests: b.guests ?? [],
    summary: b.description ?? null,
    duration: null,
  };
  const { error: e2 } = await sb.from("archives").upsert(archiveRow);
  if (e2) throw new Error(e2.message);

  const { error: e3 } = await sb.from("broadcasts").delete().eq("id", id);
  if (e3) throw new Error(e3.message);

  revalidateAll();
  // 移行先アーカイブを自動で開いて URL を設定してもらう
  redirect(`/admin/archives?moved=${encodeURIComponent(id)}`);
}

// ====================== アーカイブ ======================

export async function saveArchive(formData: FormData) {
  const sb = await createClient();
  const id = str(formData.get("id")) || genId("ep");
  const row = {
    id,
    episode: str(formData.get("episode")),
    date: str(formData.get("date")),
    title: str(formData.get("title")),
    thumbnail: str(formData.get("thumbnail")),
    url: str(formData.get("url")),
    hosts: parseList(formData.get("hosts")),
    guests: parseList(formData.get("guests")),
    summary: strOrNull(formData.get("summary")),
    duration: strOrNull(formData.get("duration")),
  };
  const { error } = await sb.from("archives").upsert(row);
  if (error) throw new Error(error.message);
  revalidateAll();
  redirect("/admin/archives?saved=1");
}

export async function deleteArchive(formData: FormData) {
  const sb = await createClient();
  const id = str(formData.get("id"));
  const { error } = await sb.from("archives").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAll();
  redirect("/admin/archives?deleted=1");
}

// ====================== ゲスト ======================

export async function saveGuest(formData: FormData) {
  const sb = await createClient();
  const id = str(formData.get("id")) || genId("guest");
  const row = {
    id,
    name: str(formData.get("name")),
    role: strOrNull(formData.get("role")),
    avatar: strOrNull(formData.get("avatar")),
    bio: strOrNull(formData.get("bio")),
    appearances: parseList(formData.get("appearances")),
    link: strOrNull(formData.get("link")),
  };
  const { error } = await sb.from("guests").upsert(row);
  if (error) throw new Error(error.message);
  revalidateAll();
  redirect("/admin/guests?saved=1");
}

export async function deleteGuest(formData: FormData) {
  const sb = await createClient();
  const id = str(formData.get("id"));
  const { error } = await sb.from("guests").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAll();
  redirect("/admin/guests?deleted=1");
}

// ====================== サイト設定 / リンク ======================

export async function saveSettings(formData: FormData) {
  const sb = await createClient();
  // socials は1行ごとに "ラベル|URL"
  const socials = String(formData.get("socials") ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...rest] = line.split("|");
      return { label: (label ?? "").trim(), url: rest.join("|").trim() };
    })
    .filter((s) => s.label && s.url);

  const row = {
    id: 1,
    name: str(formData.get("name")),
    tagline: str(formData.get("tagline")),
    description: str(formData.get("description")),
    company: str(formData.get("company")),
    regular_slot: str(formData.get("regular_slot")),
    platform: str(formData.get("platform")) || "REALITY",
    mail_form_url: str(formData.get("mail_form_url")),
    socials,
    updated_at: new Date().toISOString(),
  };
  const { error } = await sb.from("site_settings").upsert(row);
  if (error) throw new Error(error.message);
  revalidateAll();
  redirect("/admin/settings?saved=1");
}

// ====================== MC（パーソナリティ） ======================

/** "ラベル|値" の複数行を {label,value} 配列に */
function parsePairs(v: FormDataEntryValue | null, key: "value" | "url") {
  return String(v ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...rest] = line.split("|");
      return { label: (label ?? "").trim(), [key]: rest.join("|").trim() };
    })
    .filter((o) => o.label && (o as Record<string, string>)[key]);
}

export async function saveMember(formData: FormData) {
  const sb = await createClient();
  const slug = str(formData.get("slug"));
  if (!slug) throw new Error("slug（英小文字のID）は必須です。");
  const row = {
    slug,
    name: str(formData.get("name")),
    kana: str(formData.get("kana")),
    romaji: str(formData.get("romaji")),
    color: str(formData.get("color")) || "#9a63e6",
    color_sub: str(formData.get("color_sub")) || "#ff7ec2",
    catch: str(formData.get("catch")),
    image: str(formData.get("image")),
    bio: str(formData.get("bio")),
    profile: parsePairs(formData.get("profile"), "value"),
    links: parsePairs(formData.get("links"), "url"),
    sort_order: Number(str(formData.get("sort_order"))) || 0,
  };
  const { error } = await sb.from("members").upsert(row);
  if (error) throw new Error(error.message);
  revalidateAll();
  redirect("/admin/members?saved=1");
}

export async function deleteMember(formData: FormData) {
  const sb = await createClient();
  const slug = str(formData.get("slug"));
  const { error } = await sb.from("members").delete().eq("slug", slug);
  if (error) throw new Error(error.message);
  revalidateAll();
  redirect("/admin/members?deleted=1");
}

// ====================== 認証 ======================

export async function signOut() {
  const sb = await createClient();
  await sb.auth.signOut();
  redirect("/admin/login");
}
