import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  experimental: {
    turbopackUseSystemTlsCerts: true,
  },
};

export default nextConfig;
