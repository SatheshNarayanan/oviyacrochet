import type { MetadataRoute } from "next";
import { SITE, absoluteUrl } from "@/lib/site";
import { prisma } from "@/lib/db";

export const revalidate = 3600; // refresh hourly

const STATIC = ["/", "/shop", "/custom-orders", "/about", "/contact", "/faq",
  "/shipping-policy", "/returns-refunds", "/privacy-policy", "/terms-of-service"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categories = await prisma.category.findMany({
    select: { slug: true }
  });

  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: {
      slug: true,
      updatedAt: true,
      category: { select: { slug: true } }
    }
  });

  return [
    ...STATIC.map((p) => ({ url: absoluteUrl(p), changeFrequency: "weekly" as const, priority: p === "/" ? 1 : 0.7 })),
    ...categories.map((c) => ({ url: absoluteUrl(`/shop/${c.slug}`), changeFrequency: "weekly" as const, priority: 0.8 })),
    ...products.map((p) => ({
      url: absoluteUrl(`/shop/${p.category.slug}/${p.slug}`),
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];
}
