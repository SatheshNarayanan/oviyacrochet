import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { prisma } from "@/lib/db";
import { getEffectivePrice } from "@/lib/pricing";
import { toDiscountInput } from "@/lib/discount-mapper";
import { ProductCard } from "@/components/store/product-card";
import { YarnMascot } from "@/components/ui/yarn-mascot";
import { SortSelect } from "@/components/store/sort-select";
import { ShopFilterButton } from "@/components/store/shop-filter-button";
import { ShopFilterPanel } from "@/components/store/shop-filter-panel";
import { ActiveFilters } from "@/components/store/active-filters";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}): Promise<Metadata> {
  const { category } = await searchParams;
  const titles: Record<string, string> = {
    amigurumi: "Handmade Amigurumi Crochet Toys",
    bags: "Handmade Crochet Bags & Pouches",
    baby: "Handmade Crochet Baby Gifts",
    "gift-hampers": "Crochet Gift Hampers",
    "home-decor": "Handmade Crochet Home Décor",
    accessories: "Handmade Crochet Accessories",
  };
  const title =
    category && titles[category]
      ? `${titles[category]} | Oviyas Crochet`
      : "Shop Handmade Crochet Toys, Bags & Gifts";

  return pageMetadata({
    title,
    description:
      "Browse handmade crochet amigurumi, bags, baby gifts, home décor and gift hampers. Made to order in Kanniyakumari and shipped across India.",
    path: category && category !== "all" ? `/shop?category=${category}` : "/shop",
  });
}

const CATEGORIES_FILTER = [
  { slug: "all", label: "All Products", emoji: "🧶" },
  { slug: "amigurumi", label: "Amigurumi", emoji: "🐻" },
  { slug: "bags", label: "Bags", emoji: "👜" },
  { slug: "home-decor", label: "Home Decor", emoji: "🏠" },
  { slug: "baby", label: "Baby", emoji: "🍼" },
  { slug: "accessories", label: "Accessories", emoji: "💍" },
  { slug: "gift-hampers", label: "Gift Hampers", emoji: "🎁" },
];

async function getProducts(params: {
  category?: string;
  sort?: string;
  sale?: string;
  new?: string;
  max_price?: string;
  availability?: string;
  q?: string;
  color?: string;
}) {
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
          ...(params.q || params.color
            ? {
                AND: [
                  ...(params.q
                    ? [
                        {
                          OR: [
                            { name: { contains: params.q, mode: "insensitive" as any } },
                            { description: { contains: params.q, mode: "insensitive" as any } },
                          ],
                        },
                      ]
                    : []),
                  ...(params.color
                    ? [
                        {
                          OR: [
                            { name: { contains: params.color, mode: "insensitive" as any } },
                            { description: { contains: params.color, mode: "insensitive" as any } },
                          ],
                        },
                      ]
                    : []),
                ],
              }
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
      const createdDaysAgo = Math.floor((now.getTime() - p.createdAt.getTime()) / 86400000);
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: pricing.finalPrice,
        originalPrice: pricing.originalPrice,
        discountPercent: pricing.savingPercent,
        primaryImage: sorted.find((i) => i.isPrimary)?.url ?? sorted[0]?.url,
        secondaryImage: sorted[1]?.url,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        inStock: (p as any).inStock ?? true,
        isNew: createdDaysAgo <= 30,
      };
    });

    let result = mapped;

    /* Apply filters */
    if (params.sale === "1") result = result.filter((p) => p.discountPercent > 0);
    if (params.new === "1") result = result.filter((p) => p.isNew);
    if (params.max_price) result = result.filter((p) => p.price <= Number(params.max_price));
    if (params.availability === "in_stock") result = result.filter((p) => p.inStock);

    /* Real-time price sorting based on effective price */
    if (params.sort === "price_asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (params.sort === "price_desc") {
      result.sort((a, b) => b.price - a.price);
    }

    /* In-stock first, sold-out last (always) */
    result = [
      ...result.filter((p) => p.inStock),
      ...result.filter((p) => !p.inStock),
    ];

    return result;
  } catch (err) {
    console.error("[ShopPage] Failed to fetch products:", err);
    return [];
  }
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    sale?: string;
    new?: string;
    max_price?: string;
    availability?: string;
    tag?: string;
    q?: string;
    color?: string;
  }>;
}) {
  const params = await searchParams;
  const products = await getProducts(params);
  const activeCategory = params.category ?? "all";
  const activeSort = params.sort ?? "featured";

  const inStockCount = products.filter((p) => p.inStock).length;
  const soldOutCount = products.filter((p) => !p.inStock).length;

  return (
    <div style={{ paddingBottom: 48 }}>
      {/* ── Page title ── */}
      <div style={{ padding: "32px var(--gutter) 0", textAlign: "center" }}>
        <h1 className="page-title">
          {activeCategory === "all"
            ? "All Products"
            : CATEGORIES_FILTER.find((c) => c.slug === activeCategory)?.label ?? "Shop"}
        </h1>
        <p className="page-intro">
          Handmade crochet — amigurumi, bags, home décor and more. Every piece crocheted to order in Kanniyakumari.
        </p>
      </div>

      {/* ── v2 Shop layout: sidebar + results ── */}
      <div className="container shop-layout" style={{ marginTop: 24 }}>
        {/* ── LEFT: Desktop filter sidebar (always visible on ≥768px) ── */}
        <Suspense fallback={null}>
          <ShopFilterPanel mode="desktop" />
        </Suspense>

        {/* ── RIGHT: Results area ── */}
        <section className="results" aria-label="Product results">
          {/* Toolbar: filter trigger (mobile) + result count + sort select (desktop) */}
          <div
            className="toolbar"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Mobile filter button */}
              <Suspense fallback={null}>
                <ShopFilterButton />
              </Suspense>
              <span
                className="result-count"
                aria-live="polite"
                style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}
              >
                {inStockCount} product{inStockCount !== 1 ? "s" : ""} in stock
                {soldOutCount > 0 && ` · ${soldOutCount} sold out`}
              </span>
            </div>

            {/* Desktop sort selector */}
            <div className="shop-desktop-sort">
              <Suspense fallback={null}>
                <SortSelect activeSort={activeSort} />
              </Suspense>
            </div>
          </div>

          {/* Active filters row */}
          <Suspense fallback={null}>
            <ActiveFilters />
          </Suspense>

          {/* ── Product grid ── */}
          {products.length > 0 ? (
            <>
              <div className="shop-grid" id="product-grid">
                {products.map((p, i) => (
                  <ProductCard key={p.id} {...p} index={i} />
                ))}
              </div>

              {/* ── Load more + progress bar ── */}
              <div className="load-more-wrap">
                <p>
                  Showing <b>{products.length}</b> of <b>{products.length}</b> products
                </p>
                <div className="progress-bar">
                  <span
                    className="progress-bar__fill"
                    style={{ width: "100%" }}
                    role="progressbar"
                    aria-valuenow={100}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
              </div>
            </>
          ) : (
            /* Witty empty state */
            <div className="empty-state">
              <YarnMascot size={80} animate={false} />
              <p>Nothing here matches. Even our yarn is confused.</p>
              <Link href="/shop" className="btn">
                Clear filters
              </Link>
              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                Or{" "}
                <Link href="/custom-orders" style={{ color: "var(--ink)", fontWeight: 600 }}>
                  request a custom piece
                </Link>
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
