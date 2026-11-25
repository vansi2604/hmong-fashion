import type { NextConfig } from "next";
import fs from "fs";
import path from "path";

// Tự động sao chép logo từ uploaded media vào thư mục public/images
const sourceLogo =
  "/home/ubvansi/snap/antigravity-cli/common/.gemini/antigravity-cli/brain/1d04c5a2-a3e6-4f42-97b6-3c09aafce0a1/.user_uploaded/uploaded_media_1795166392653.jpg";
const publicImagesDir = path.join(process.cwd(), "public", "images");
const publicLogoDest = path.join(publicImagesDir, "logo.jpg");
const rootLogoDest = path.join(process.cwd(), "public", "logo.jpg");
const appIconDest = path.join(process.cwd(), "app", "icon.jpg");

try {
  if (fs.existsSync(sourceLogo)) {
    if (!fs.existsSync(publicImagesDir)) {
      fs.mkdirSync(publicImagesDir, { recursive: true });
    }
    if (!fs.existsSync(publicLogoDest)) {
      fs.copyFileSync(sourceLogo, publicLogoDest);
    }
    if (!fs.existsSync(rootLogoDest)) {
      fs.copyFileSync(sourceLogo, rootLogoDest);
    }
    if (!fs.existsSync(appIconDest)) {
      fs.copyFileSync(sourceLogo, appIconDest);
    }
  }
} catch (e) {
  console.warn("Could not copy logo:", e);
}

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
    protocol: "https",
    hostname: "**.trycloudflare.com",
    pathname: "/**",
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
