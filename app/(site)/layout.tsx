import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

// 公開サイト共通のナビ・フッター（管理画面 /admin には適用されない）
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full flex flex-col">
      <SiteNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
