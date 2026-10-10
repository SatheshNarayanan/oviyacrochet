import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getEffectivePrice } from "@/lib/pricing";
import { toDiscountInput } from "@/lib/discount-mapper";
import { ProductCard } from "@/components/store/product-card";
import { SortSelect } from "@/components/store/sort-select";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";

interface Props {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ sort?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = await prisma.category.findUnique({ where: { slug: category } }).catch(() => null);
  if (!cat) return { title: "Category not found", robots: { index: false, follow: false } };
  
  const descriptions: Record<string, string> = {
    amigurumi: "Soft, cuddly handmade amigurumi toys, crocheted to order in Kanniyakumari from 100% cotton yarn and shipped across India.",
    bags: "Sturdy, colourful crochet totes and pouches, handmade to order in cotton yarn. Choose your colour and get it delivered across India.",
    baby: "Soft handmade crochet baby gifts and outfits, made to order with gentle cotton yarn. A thoughtful gift, delivered across India.",
    "gift-hampers": "Thoughtful handmade crochet gift hampers with gift wrapping available, made to order and delivered across India.",
    "home-decor": "Handmade crochet home décor, made to order in Kanniyakumari and shipped across India.",
    accessories: "Handmade crochet accessories, made to order in Kanniyakumari and shipped across India.",
  };
  const desc = descriptions[category] ?? `Shop handmade crochet ${cat.name.toLowerCase()} — made to order in Kanniyakumari and shipped across India.`;
  
  const titles: Record<string, string> = {
    amigurumi: "Handmade Amigurumi Crochet Toys",
    bags: "Handmade Crochet Bags & Pouches",
    baby: "Handmade Crochet Baby Gifts",
    "gift-hampers": "Crochet Gift Hampers",
    "home-decor": "Handmade Crochet Home Décor",
    accessories: "Handmade Crochet Accessories",
  };
  const title = titles[category] ?? `Handmade Crochet ${cat.name}`;

  return pageMetadata({
    title,
    description: desc,
    path: `/shop/${category}`,
  });
}

async function getCategoryProducts(slug: string, sortKey?: string) {
  const now = new Date();
  try {
    const category = await prisma.category.findUnique({ where: { slug } });
    if (!category) return null;

    const [rawDiscounts, products] = await Promise.all([
      prisma.discount.findMany({
        where: { isActive: true, startsAt: { lte: now }, OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
        include: { products: true },
      }),
      prisma.product.findMany({
        where: { isActive: true, categoryId: category.id },
        include: { images: { orderBy: { position: "asc" } } },
        orderBy:
          sortKey === "price_asc"  ? { price: "asc" }  :
          sortKey === "price_desc" ? { price: "desc" } :
          { createdAt: "desc" },
      }),
    ]);

    const discounts = rawDiscounts.map(toDiscountInput);

    const mapped = products.map((p, i) => {
      const pricing = getEffectivePrice(
        { id: p.id, price: Number(p.price), categoryId: p.categoryId },
        discounts,
        now
      );
      const sorted = [...p.images].sort((a, b) => a.position - b.position);
      const createdDaysAgo = Math.floor((now.getTime() - p.createdAt.getTime()) / 86400000);
      return {
        id: p.id, name: p.name, slug: p.slug,
        price: pricing.finalPrice, originalPrice: pricing.originalPrice,
        discountPercent: pricing.savingPercent,
        primaryImage: sorted.find((img) => img.isPrimary)?.url ?? sorted[0]?.url,
        secondaryImage: sorted[1]?.url,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        inStock: (p as any).inStock ?? true,
        isNew: createdDaysAgo <= 30,
        index: i,
      };
    });

    /* In-stock first */
    const ordered = [
      ...mapped.filter((p) => p.inStock),
      ...mapped.filter((p) => !p.inStock),
    ];

    return { category, products: ordered };
  } catch {
    return null;
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category: slug } = await params;
  const { sort } = await searchParams;
  const data = await getCategoryProducts(slug, sort);
  if (!data) notFound();

  const inStockCount = data.products.filter((p) => p.inStock).length;
  const soldOutCount = data.products.filter((p) => !p.inStock).length;

  /* Witty collection taglines per guide §4.1 */
  const taglines: Record<string, string> = {
    amigurumi:    "Cute. Stitched. Yours.",
    bags:         "Carry something handmade.",
    "home-decor": "Cozy corners, handcrafted.",
    baby:         "Soft things for tiny people.",
    accessories:  "The finishing stitch.",
    "gift-hampers":"Gifts that feel like hugs.",
  };
  const tagline = taglines[slug] ?? "Handmade warmth, woven for individual style.";

  const bJsonLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: data.category.name, path: `/shop/${slug}` },
  ]);

  return (
    <div style={{ paddingBottom: 48 }}>
      <JsonLd data={bJsonLd} />
      {/* ── Collection banner (Jet Black, guide §4.1) ── */}
      <div className="collection-banner">
        <div>
          <nav aria-label="Breadcrumb" style={{ fontSize: 12, marginBottom: 6, opacity: 0.6 }}>
            <Link href="/" style={{ color: "inherit" }}>Home</Link>
            {" / "}
            <Link href="/shop" style={{ color: "inherit" }}>Shop</Link>
            {" / "}
            <span>{data.category.name}</span>
          </nav>
          <h1 style={{ margin: 0 }}>{data.category.name}</h1>
          <p style={{ margin: "4px 0 0" }}>{tagline}</p>
        </div>
      </div>

      {/* ── Sticky toolbar ── */}
      <div className="shop-toolbar">
        <button className="btn-filter" aria-label="Open filters" id="open-filter-btn">
          Filter &amp; sort
        </button>
        <div className="shop-toolbar__chips no-scrollbar" />
        <SortSelect activeSort={sort ?? "featured"} />
      </div>

      {/* ── Result count ── */}
      <div className="applied-filters">
        <span className="result-count" aria-live="polite">
          {inStockCount} product{inStockCount !== 1 ? "s" : ""} in stock
          {soldOutCount > 0 && ` · ${soldOutCount} sold out`}
        </span>
      </div>

      {/* ── Product grid ── */}
      <div style={{ padding: "8px var(--pad-mobile)" }}>
        {data.products.length > 0 ? (
          <>
            <div className="shop-grid">
              {data.products.map((p) => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>

            {/* Progress */}
            <div className="load-more-wrap">
              <p>Showing <b>{data.products.length}</b> of <b>{data.products.length}</b></p>
              <div className="progress-bar">
                <span className="progress-bar__fill" style={{ width: "100%" }} />
              </div>
            </div>
          </>
        ) : (
          <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "40px 0" }}>
            Nothing here yet — check back soon!
          </p>
        )}
      </div>
    </div>
  );
}
