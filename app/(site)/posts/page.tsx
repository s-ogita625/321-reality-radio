import { getXPosts } from "@/lib/content";
import { PageHeader } from "@/components/PageHeader";
import { XEmbeds } from "@/components/XEmbeds";

export const metadata = { title: "#321REALITYラジオ 投稿" };
export const revalidate = 60;

export default async function PostsPage() {
  const posts = await getXPosts();

  return (
    <>
      <PageHeader
        label="#321REALITYラジオ"
        title="みんなの投稿"
        description="Xでの #321REALITYラジオ の投稿をピックアップ。番組への感想・お便りはハッシュタグをつけて投稿してね！"
      />
      <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-12 sm:mt-16 mb-24">
        <XEmbeds posts={posts} />
      </section>
    </>
  );
}
