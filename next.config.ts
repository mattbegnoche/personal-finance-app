import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Phosphor ships thousands of modules; load only the icons actually used.
    optimizePackageImports: [
      "@phosphor-icons/react",
      "@phosphor-icons/react/ssr",
    ],
  },
};

export default nextConfig;
