import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getEffectivePrice } from "@/lib/pricing";
import { toDiscountInput } from "@/lib/discount-mapper";
import { ProductCard } from "@/components/store/product-card";
import { ProductGallery, ProductActions } from "./product-client";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  }).catch(() => null);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} — Oviya's Crochet`,
    description: product.description.slice(0, 160),
    openGraph: { title: product.name, description: product.description.slice(0, 160) },
  };
}

async function getProduct(slug: string) {
  const now = new Date();
  try {
    const product = await prisma.product.findUnique({
      where: { slug, isActive: true },
      include: { images: { orderBy: { position: "asc" } }, category: true },
    });
    if (!product) return null;

    const rawDiscounts = await prisma.discount.findMany({
      where: { isActive: true, startsAt: { lte: now }, OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
      include: { products: true },
    });
    const discounts = rawDiscounts.map(toDiscountInput);

    const pricing = getEffectivePrice(
      { id: product.id, price: Number(product.price), categoryId: product.categoryId },
      discounts,
      now
    );

    const related = await prisma.product.findMany({
      where: { isActive: true, categoryId: product.categoryId, id: { not: product.id } },
      include: { images: { orderBy: { position: "asc" } } },
      take: 4,
    });

    const relatedWithPricing = related.map((r, i) => {
      const rPricing = getEffectivePrice(
        { id: r.id, price: Number(r.price), categoryId: r.categoryId },
        discounts,
        now
      );
      const imgs = [...r.images].sort((a, b) => a.position - b.position);
      return {
        id: r.id, name: r.name, slug: r.slug,
        price: rPricing.finalPrice, originalPrice: rPricing.originalPrice,
        discountPercent: rPricing.savingPercent,
        primaryImage: imgs.find((img) => img.isPrimary)?.url ?? imgs[0]?.url,
        secondaryImage: imgs[1]?.url,
        index: i,
      };
    });

    const details = product.details as Record<string, unknown> | null;
    const colors = details?.colors as string[] | undefined;
    const imgs = [...product.images].sort((a, b) => a.position - b.position);
    const primaryImage = imgs.find((img) => img.isPrimary)?.url ?? imgs[0]?.url;

    return { product, pricing, primaryImage, colors, related: relatedWithPricing };
  } catch {
    return null;
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const data = await getProduct(slug);
  if (!data) notFound();

  const { product, pricing, primaryImage, colors, related } = data;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    offers: {
      "@type": "Offer",
      price: pricing.finalPrice,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="page-pad" style={{ paddingTop: 20 }}>
        <nav aria-label="Breadcrumb" style={{ marginBottom: 16, fontSize: 13, color: "var(--mute)" }}>
          <Link href="/" style={{ color: "var(--mute)" }}>Home</Link>{" / "}
          <Link href="/shop" style={{ color: "var(--mute)" }}>Shop</Link>{" / "}
          <Link href={`/shop/${product.category.slug}`} style={{ color: "var(--mute)" }}>{product.category.name}</Link>{" / "}
          <span style={{ color: "var(--ink)", fontWeight: 600 }}>{product.name}</span>
        </nav>
      </div>

      <div className="pdp-grid">
        <ProductGallery
          images={product.images.map((img) => ({ url: img.url, alt: img.alt, isPrimary: img.isPrimary }))}
          productName={product.name}
          discountPercent={pricing.savingPercent}
        />
        <ProductActions
          id={product.id} name={product.name} slug={product.slug}
          price={pricing.finalPrice} originalPrice={pricing.originalPrice}
          discountPercent={pricing.savingPercent}
          description={product.description} categoryName={product.category.name}
          primaryImage={primaryImage} colors={colors}
        />
      </div>

      {related.length > 0 && (
        <section className="sec" aria-labelledby="related-heading" style={{ marginTop: 24 }}>
          <hr className="stitched-divider" />
          <h2 id="related-heading" className="text-section" style={{ marginBottom: 16 }}>You might also like</h2>
          <div className="product-grid">
            {related.map((r) => <ProductCard key={r.id} {...r} />)}
          </div>
        </section>
      )}
    </>
  );
}
