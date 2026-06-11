import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 複数 lockfile 警告を解消（このディレクトリをワークスペースルートに固定）
  turbopack: { root: __dirname },
  images: {
    // 自前の静的 SVG サムネイルを next/image で表示するため
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Supabase Storage にアップロードした画像（サムネ・MC画像）を表示するため
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
};

export default nextConfig;
