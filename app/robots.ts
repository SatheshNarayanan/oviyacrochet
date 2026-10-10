import type { MetadataRoute } from "next";
import { SITE, IS_PRODUCTION_SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  if (!IS_PRODUCTION_SITE) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/admin/"] }],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
