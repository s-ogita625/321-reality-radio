import "server-only";
import { cache } from "react";
import { createPublicClient, isSupabaseConfigured } from "@/lib/supabase/public";
import type { Broadcast, Archive, Guest, Member, XPost } from "@/data/types";
import { broadcasts as seedBroadcasts } from "@/data/schedule";
import { archives as seedArchives } from "@/data/archives";
import { guests as seedGuests } from "@/data/guests";
import { members as seedMembers } from "@/data/members";
import { site as seedSite } from "@/data/site";

// =============================================================
//  コンテンツ取得層
//  Supabase の環境変数があれば DB から、無ければ data/ の静的データから取得。
//  これにより Supabase 未接続でも公開サイトは動作する（無停止移行）。
// =============================================================

type Row = Record<string, unknown>;

function rowToBroadcast(r: Row): Broadcast {
  return {
    id: String(r.id),
    episode: (r.episode as string) ?? "",
    date: String(r.date),
    start: (r.start_time as string) ?? "",
    end: (r.end_time as string) ?? "",
    title: (r.title as string) ?? "",
    platform: (r.platform as string) ?? "REALITY",
    hosts: (r.hosts as string[]) ?? [],
    guests: (r.guests as string[]) ?? [],
    thumbnail: (r.thumbnail as string) ?? undefined,
    url: (r.url as string) ?? undefined,
    description: (r.description as string) ?? undefined,
    status: (r.status as Broadcast["status"]) ?? "upcoming",
  };
}

function rowToArchive(r: Row): Archive {
  return {
    id: String(r.id),
    episode: (r.episode as string) ?? "",
    date: String(r.date),
    title: (r.title as string) ?? "",
    thumbnail: (r.thumbnail as string) ?? "",
    url: (r.url as string) ?? "",
    hosts: (r.hosts as string[]) ?? [],
    guests: (r.guests as string[]) ?? [],
    summary: (r.summary as string) ?? undefined,
    duration: (r.duration as string) ?? undefined,
  };
}

function rowToMember(r: Row): Member {
  const arr = (v: unknown) => (Array.isArray(v) ? v : []);
  return {
    slug: String(r.slug),
    name: (r.name as string) ?? "",
    kana: (r.kana as string) ?? "",
    romaji: (r.romaji as string) ?? "",
    color: (r.color as string) ?? "#9a63e6",
    colorSub: (r.color_sub as string) ?? "#ff7ec2",
    catch: (r.catch as string) ?? "",
    image: (r.image as string) ?? "",
    bio: (r.bio as string) ?? "",
    profile: arr(r.profile) as { label: string; value: string }[],
    links: arr(r.links) as { label: string; url: string }[],
  };
}

function rowToGuest(r: Row): Guest {
  return {
    id: String(r.id),
    name: (r.name as string) ?? "",
    role: (r.role as string) ?? undefined,
    avatar: (r.avatar as string) ?? undefined,
    bio: (r.bio as string) ?? undefined,
    appearances: (r.appearances as string[]) ?? [],
    link: (r.link as string) ?? undefined,
  };
}

export type SiteSettings = {
  name: string;
  nameEn: string;
  tagline: string;
  description: string;
  about: string;
  company: string;
  regularSlot: string;
  platform: string;
  url: string;
  mailFormUrl: string;
  socials: { label: string; url: string }[];
};

const seedSettings: SiteSettings = {
  name: seedSite.name,
  nameEn: seedSite.nameEn,
  tagline: seedSite.tagline,
  description: seedSite.description,
  about: seedSite.about,
  company: seedSite.company,
  regularSlot: seedSite.regularSlot,
  platform: seedSite.platform,
  url: seedSite.url,
  mailFormUrl: seedSite.mailFormUrl,
  socials: [...seedSite.socials],
};

export async function getBroadcasts(): Promise<Broadcast[]> {
  if (!isSupabaseConfigured()) return seedBroadcasts;
  try {
    const sb = createPublicClient();
    const { data, error } = await sb.from("broadcasts").select("*").order("date", { ascending: true });
    if (error || !data) return seedBroadcasts;
    return data.map(rowToBroadcast);
  } catch {
    return seedBroadcasts;
  }
}

export async function getArchives(): Promise<Archive[]> {
  if (!isSupabaseConfigured()) return seedArchives;
  try {
    const sb = createPublicClient();
    const { data, error } = await sb.from("archives").select("*").order("date", { ascending: false });
    if (error || !data) return seedArchives;
    return data.map(rowToArchive);
  } catch {
    return seedArchives;
  }
}

export async function getGuests(): Promise<Guest[]> {
  if (!isSupabaseConfigured()) return seedGuests;
  try {
    const sb = createPublicClient();
    const { data, error } = await sb.from("guests").select("*").order("created_at", { ascending: true });
    if (error || !data) return seedGuests;
    return data.map(rowToGuest);
  } catch {
    return seedGuests;
  }
}

// cache() で同一リクエスト内の複数呼び出しを1回のクエリに集約（MemberChip等のN+1防止）
export const getMembers = cache(async (): Promise<Member[]> => {
  if (!isSupabaseConfigured()) return seedMembers;
  try {
    const sb = createPublicClient();
    const { data, error } = await sb.from("members").select("*").order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) return seedMembers;
    return data.map(rowToMember);
  } catch {
    return seedMembers;
  }
});

export async function getMemberBySlug(slug: string): Promise<Member | undefined> {
  return (await getMembers()).find((m) => m.slug === slug);
}

export async function getXPosts(): Promise<XPost[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const sb = createPublicClient();
    const { data, error } = await sb
      .from("x_posts")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data.map((r: Row) => ({
      id: String(r.id),
      url: (r.url as string) ?? "",
      note: (r.note as string) ?? undefined,
      sortOrder: (r.sort_order as number) ?? 0,
    }));
  } catch {
    return [];
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured()) return seedSettings;
  try {
    const sb = createPublicClient();
    const { data, error } = await sb.from("site_settings").select("*").eq("id", 1).maybeSingle();
    if (error || !data) return seedSettings;
    return {
      ...seedSettings,
      name: (data.name as string) ?? seedSettings.name,
      tagline: (data.tagline as string) ?? seedSettings.tagline,
      description: (data.description as string) ?? seedSettings.description,
      about: (data.about as string) ?? seedSettings.about,
      company: (data.company as string) ?? seedSettings.company,
      regularSlot: (data.regular_slot as string) ?? seedSettings.regularSlot,
      platform: (data.platform as string) ?? seedSettings.platform,
      mailFormUrl: (data.mail_form_url as string) ?? seedSettings.mailFormUrl,
      socials: Array.isArray(data.socials) ? (data.socials as SiteSettings["socials"]) : seedSettings.socials,
    };
  } catch {
    return seedSettings;
  }
}
