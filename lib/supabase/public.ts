import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * 公開サイトの読み取り専用クライアント（セッション不要）。
 * cookies() を使わないため、公開ページは静的生成のまま保てる。
 * 書き込みや認証は lib/supabase/server.ts のクライアントを使うこと。
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

export function isSupabaseConfigured() {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
