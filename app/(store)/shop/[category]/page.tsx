import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getEffectivePrice } from "@/lib/pricing";
import { toDiscountInput } from "@/lib/discount-mapper";
import { ProductCard } from "@/components/store/product-card";

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = await prisma.category.findUnique({ where: { slug: category } }).catch(() => null);
  if (!cat) return { title: "Category Not Found" };
  return {
    title: `${cat.name} — Oviya's Crochet`,
    description: `Shop handmade crochet ${cat.name.toLowerCase()} — made to order in Tamil Nadu.`,
  };
}

async function getCategoryProducts(slug: string) {
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
        orderBy: { createdAt: "desc" },
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
      return {
        id: p.id, name: p.name, slug: p.slug,
        price: pricing.finalPrice, originalPrice: pricing.originalPrice,
        discountPercent: pricing.savingPercent,
        primaryImage: sorted.find((img) => img.isPrimary)?.url ?? sorted[0]?.url,
        secondaryImage: sorted[1]?.url,
        index: i,
      };
    });

    return { category, products: mapped };
  } catch {
    return null;
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const data = await getCategoryProducts(slug);
  if (!data) notFound();

  return (
    <div style={{ padding: "20px var(--pad-mobile) 40px" }}>
      <nav aria-label="Breadcrumb" style={{ marginBottom: 16, fontSize: 13, color: "var(--mute)" }}>
        <Link href="/" style={{ color: "var(--mute)" }}>Home</Link>{" / "}
        <Link href="/shop" style={{ color: "var(--mute)" }}>Shop</Link>{" / "}
        <span style={{ color: "var(--ink)", fontWeight: 600 }}>{data.category.name}</span>
      </nav>
      <h1 className="text-section" style={{ marginBottom: 20 }}>{data.category.name}</h1>
      {data.products.length > 0 ? (
        <div className="product-grid">
          {data.products.map((p) => <ProductCard key={p.id} {...p} />)}
        </div>
      ) : (
        <p style={{ color: "var(--mute)", textAlign: "center", padding: "40px 0" }}>
          No products in this category yet. Check back soon!
        </p>
      )}
    </div>
  );
}
