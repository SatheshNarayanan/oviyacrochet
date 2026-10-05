import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "cdn.pixabay.com" },
      { protocol: "https", hostname: "uploadthing.com" },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "140.245.205.19"],
    },
  },
};

export default nextConfig;
