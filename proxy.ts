import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Next.js 16: Middleware は Proxy に改名（機能は同じ）
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // 静的アセット・画像最適化を除く全ルートで実行
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
