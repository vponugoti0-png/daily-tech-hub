import type { NextConfig } from "next";
import lessonRedirects from "./lesson-redirects.json";

const nextConfig: NextConfig = {
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
  serverExternalPackages: ["better-sqlite3"],
  devIndicators: false,
  async redirects() {
    return [
      {
        source: "/training/prompt-engineering/ask-better-questions",
        destination: "/training/prompt-engineering/pe-ask-better-questions",
        permanent: true,
      },
      ...lessonRedirects,
    ];
  },
};

export default nextConfig;
