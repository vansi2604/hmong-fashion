import type { NextConfig } from "next";

// Trích xuất hostname từ biến môi trường NEXT_PUBLIC_BASE_URL
const backendUrl = process.env.NEXT_PUBLIC_BASE_URL;
const remotePatterns: Array<{
  protocol: "http" | "https";
  hostname: string;
  port?: string;
  pathname?: string;
}> = [
  {
    protocol: "https",
    hostname: "images.unsplash.com",
  },
  {
    protocol: "http",
    hostname: "127.0.0.1",
    port: "8000",
    pathname: "/**",
  },
  {
    protocol: "http",
    hostname: "localhost",
    port: "8000",
    pathname: "/**",
  },
];

if (backendUrl) {
  try {
    const parsed = new URL(backendUrl);
    const protocol = parsed.protocol.replace(":", "") as "http" | "https";
    if (parsed.hostname && parsed.hostname !== "127.0.0.1" && parsed.hostname !== "localhost") {
      remotePatterns.push({
        protocol,
        hostname: parsed.hostname,
        port: parsed.port || undefined,
        pathname: "/**",
      });
    }
  } catch {
    // Bỏ qua nếu URL không đúng định dạng
  }
}

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
  },
  images: {
    remotePatterns,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
