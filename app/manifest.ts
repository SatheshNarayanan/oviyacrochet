import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Oviya's Crochet",
    short_name: "Oviya's",
    description: "Handmade crochet toys, bags and gifts, made to order in Kanniyakumari.",
    start_url: "/",
    display: "standalone",
    background_color: "#edf4fb",
    theme_color: "#edf4fb",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
