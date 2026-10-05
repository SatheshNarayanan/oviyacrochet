import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getEffectivePrice } from "@/lib/pricing";
import { toDiscountInput } from "@/lib/discount-mapper";
import { ProductCard } from "@/components/store/product-card";
import { YarnMascot } from "@/components/ui/yarn-mascot";
import { SortSelect } from "@/components/store/sort-select";

export const metadata: Metadata = {
  title: "Shop — Oviya's Crochet",
  description: "Browse all handmade crochet products. Amigurumi, bags, baby gifts, accessories and more — all made to order.",
};



const CATEGORIES_FILTER = [
  { slug: "all", label: "All" },
  { slug: "amigurumi", label: "Amigurumi" },
  { slug: "bags", label: "Bags" },
  { slug: "home-decor", label: "Home Decor" },
  { slug: "baby", label: "Baby" },
  { slug: "accessories", label: "Accessories" },
  { slug: "gift-hampers", label: "Gift Hampers" },
];

async function getProducts(params: { category?: string; sort?: string; sale?: string }) {
  const now = new Date();

  try {
    const [rawDiscounts, products] = await Promise.all([
      prisma.discount.findMany({
        where: {
          isActive: true,
          startsAt: { lte: now },
          OR: [{ endsAt: null }, { endsAt: { gte: now } }],
        },
        include: { products: true },
      }),
      prisma.product.findMany({
        where: {
          isActive: true,
          ...(params.category && params.category !== "all"
            ? { category: { slug: params.category } }
            : {}),
        },
        include: { images: { orderBy: { position: "asc" } }, category: true },
        orderBy:
          params.sort === "price_asc"
            ? { price: "asc" }
            : params.sort === "price_desc"
            ? { price: "desc" }
            : { createdAt: "desc" },
      }),
    ]);

    const discounts = rawDiscounts.map(toDiscountInput);

    const mapped = products.map((p) => {
      const pricing = getEffectivePrice(
        { id: p.id, price: Number(p.price), categoryId: p.categoryId },
        discounts,
        now
      );
      const sorted = [...p.images].sort((a, b) => a.position - b.position);
      return {
        id: p.id, name: p.name, slug: p.slug,
        price: pricing.finalPrice, originalPrice: pricing.originalPrice,
        discountPercent: pricing.savingPercent,
        primaryImage: sorted.find((i) => i.isPrimary)?.url ?? sorted[0]?.url,
        secondaryImage: sorted[1]?.url,
      };
    });

    if (params.sale === "1") return mapped.filter((p) => p.discountPercent > 0);
    return mapped;
  } catch {
    return [];
  }
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string; sale?: string }>;
}) {
  const params = await searchParams;
  const products = await getProducts(params);
  const activeCategory = params.category ?? "all";
  const activeSort = params.sort ?? "newest";

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Filter bar */}
      <div style={{ padding: "16px var(--pad-mobile) 8px", borderBottom: "2px dashed var(--line)", background: "var(--surface)" }}>
        <div className="no-scrollbar" style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 12 }}>
          {CATEGORIES_FILTER.map((c) => (
            <Link key={c.slug} href={`/shop?category=${c.slug}&sort=${activeSort}`} className={`chip ${activeCategory === c.slug ? "active" : ""}`}>
              {c.label}
            </Link>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
          <Link href={`/shop?category=${activeCategory}&sort=${activeSort}&sale=${params.sale === "1" ? "0" : "1"}`} className={`chip ${params.sale === "1" ? "active" : ""}`} style={{ fontSize: 13 }}>
            On sale only
          </Link>
          <SortSelect activeSort={activeSort} />
        </div>
      </div>

      <div style={{ padding: "20px var(--pad-mobile)" }}>
        {products.length > 0 ? (
          <>
            <p style={{ color: "var(--mute)", fontSize: 13, marginBottom: 16 }}>{products.length} product{products.length !== 1 ? "s" : ""}</p>
            <div className="product-grid">
              {products.map((p, i) => <ProductCard key={p.id} {...p} index={i} />)}
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "60px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <YarnMascot size={80} animate={false} />
            <p style={{ color: "var(--mute)", fontWeight: 500 }}>No products found in this category yet.</p>
            <Link href="/shop" className="btn btn-sm btn-alt">View all products</Link>
          </div>
        )}
      </div>
    </div>
  );
}
