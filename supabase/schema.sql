-- =============================================================
--  321 REALITY ラジオ — Supabase スキーマ
--  Supabase ダッシュボードの「SQL Editor」に貼り付けて実行してください。
--  （公開サイトは読み取りのみ、管理画面ログイン後のみ書き込み可能）
-- =============================================================

-- ---------- 放送予定 ----------
create table if not exists public.broadcasts (
  id          text primary key,
  episode     text not null default '',
  date        date not null,
  start_time  text not null default '',
  end_time    text not null default '',
  title       text not null,
  platform    text not null default 'REALITY',
  hosts       text[] not null default '{}',
  guests      text[] not null default '{}',
  thumbnail   text,
  url         text,
  description text,
  status      text not null default 'upcoming'
              check (status in ('upcoming','live','ended')),
  created_at  timestamptz not null default now()
);

-- ---------- 過去アーカイブ ----------
create table if not exists public.archives (
  id         text primary key,
  episode    text not null default '',
  date       date not null,
  title      text not null,
  thumbnail  text not null default '',
  url        text not null default '',
  hosts      text[] not null default '{}',
  guests     text[] not null default '{}',
  summary    text,
  duration   text,
  created_at timestamptz not null default now()
);

-- ---------- 過去ゲスト ----------
create table if not exists public.guests (
  id           text primary key,
  name         text not null,
  role         text,
  avatar       text,
  bio          text,
  appearances  text[] not null default '{}',
  link         text,
  created_at   timestamptz not null default now()
);

-- ---------- サイト設定（リンク等・単一行） ----------
create table if not exists public.site_settings (
  id           int primary key default 1 check (id = 1),
  name         text not null default '321 REALITY ラジオ',
  tagline      text not null default '',
  description  text not null default '',
  company      text not null default '321 inc. — LIVER MANAGEMENT',
  regular_slot text not null default '毎週金曜 21:00 - 22:00',
  platform     text not null default 'REALITY',
  mail_form_url text not null default '',
  socials      jsonb not null default '[]'::jsonb,
  updated_at   timestamptz not null default now()
);

-- =============================================================
--  Row Level Security
--  読み取り: 全員 / 書き込み: ログイン済み(authenticated)のみ
-- =============================================================
alter table public.broadcasts    enable row level security;
alter table public.archives      enable row level security;
alter table public.guests        enable row level security;
alter table public.site_settings enable row level security;

-- 公開読み取り
create policy "public read broadcasts"    on public.broadcasts    for select to anon, authenticated using (true);
create policy "public read archives"      on public.archives      for select to anon, authenticated using (true);
create policy "public read guests"        on public.guests        for select to anon, authenticated using (true);
create policy "public read site_settings" on public.site_settings for select to anon, authenticated using (true);

-- 認証ユーザーによる書き込み（管理画面）
create policy "auth write broadcasts" on public.broadcasts for insert to authenticated with check (true);
create policy "auth edit broadcasts"  on public.broadcasts for update to authenticated using (true) with check (true);
create policy "auth del broadcasts"   on public.broadcasts for delete to authenticated using (true);

create policy "auth write archives" on public.archives for insert to authenticated with check (true);
create policy "auth edit archives"  on public.archives for update to authenticated using (true) with check (true);
create policy "auth del archives"   on public.archives for delete to authenticated using (true);

create policy "auth write guests" on public.guests for insert to authenticated with check (true);
create policy "auth edit guests"  on public.guests for update to authenticated using (true) with check (true);
create policy "auth del guests"   on public.guests for delete to authenticated using (true);

create policy "auth edit site_settings"   on public.site_settings for update to authenticated using (true) with check (true);
create policy "auth insert site_settings" on public.site_settings for insert to authenticated with check (true);

-- Data API へ公開（roleにアクセス付与）
grant select on public.broadcasts, public.archives, public.guests, public.site_settings to anon, authenticated;
grant insert, update, delete on public.broadcasts, public.archives, public.guests, public.site_settings to authenticated;
