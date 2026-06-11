import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { FloatingMailButton } from "@/components/FloatingMailButton";
import { getSiteSettings } from "@/lib/content";

// 公開サイト共通のナビ・フッター（管理画面 /admin には適用されない）
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const site = await getSiteSettings();
  return (
    <div className="min-h-full flex flex-col">
      <SiteNav mailFormUrl={site.mailFormUrl} socials={site.socials} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <FloatingMailButton href={site.mailFormUrl} />
    </div>
  );
}
