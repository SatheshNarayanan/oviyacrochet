import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "cdn.pixabay.com" },
      { protocol: "https", hostname: "uploadthing.com" },
      { protocol: "https", hostname: "pub-f4009fab71cc4affa9a480dfa912e095.r2.dev" },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "140.245.205.19", "oviyascrochet.ignisailabs.com"],
    },
  },
};

export default nextConfig;
