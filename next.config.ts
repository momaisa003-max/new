import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  experimental: {
    dynamicIO: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
