export const SITE = {
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://oviyascrochet.ignisailabs.com").replace(/\/$/, ""),
  name: "Oviya's Crochet",            // TODO_OWNER: confirm spelling (Oviya's vs Oviyas) and use it everywhere
  alternateName: "Oviyas Crochet",
  tagline: "Handmade crochet toys, bags and gifts",
  description:
    "Cuddly toys, everyday bags and thoughtful gifts, crocheted to order in Kanniyakumari and delivered across India. Made with love, shipped with care.",
  locale: "en_IN",
  email: process.env.CONTACT_EMAIL ?? "oviyascrochet@gmail.com",
  instagram: "https://www.instagram.com/oviyas_crochet",
  youtube: "https://www.youtube.com/@oviyas_crochet",
  ogImage: "/og-default.png",         // 1200x630, supplied (copy to /public)
  currency: "INR",
};

export const absoluteUrl = (path = "/") =>
  `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;

// Only the real production site should be indexable
export const IS_PRODUCTION_SITE =
  (process.env.VERCEL_ENV ?? process.env.NODE_ENV) === "production" &&
  SITE.url.startsWith("https://oviyascrochet");
