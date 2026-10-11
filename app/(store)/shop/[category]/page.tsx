import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
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
  const sp = await searchParams;

  const qs = new URLSearchParams();
  qs.set("category", slug);
  if (sp.sort) qs.set("sort", sp.sort);

  redirect(`/shop?${qs.toString()}`);
}

