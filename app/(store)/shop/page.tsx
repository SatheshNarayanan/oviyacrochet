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
  description:
    "Browse all handmade crochet products. Amigurumi, bags, baby gifts, accessories and more — all made to order.",
};

/* Subcategory bubbles – emoji used as fallback when no image */
const CATEGORIES_FILTER = [
  { slug: "all", label: "All", emoji: "🧶" },
  { slug: "amigurumi", label: "Amigurumi", emoji: "🐻" },
  { slug: "bags", label: "Bags", emoji: "👜" },
  { slug: "home-decor", label: "Home Decor", emoji: "🏠" },
  { slug: "baby", label: "Baby", emoji: "🍼" },
  { slug: "accessories", label: "Accessories", emoji: "💍" },
  { slug: "gift-hampers", label: "Gift Hampers", emoji: "🎁" },
];

/* Quick filter chips shown in the toolbar */
const QUICK_CHIPS = [
  { key: "in_stock", label: "In stock", param: "availability", value: "in_stock" },
  { key: "new", label: "New", param: "new", value: "1" },
  { key: "under999", label: "Under ₹999", param: "max_price", value: "999" },
  { key: "gifts", label: "Gift ideas", param: "tag", value: "gift" },
  { key: "sale", label: "On sale", param: "sale", value: "1" },
];

/* Filter groups for the sidebar */
const FILTER_GROUPS = [
  {
    id: "type",
    label: "Category",
    options: CATEGORIES_FILTER.filter((c) => c.slug !== "all").map((c) => ({
      value: c.slug,
      label: c.label,
    })),
  },
  {
    id: "price",
    label: "Price",
    options: [
      { value: "under500", label: "Under ₹500" },
      { value: "under999", label: "Under ₹999" },
      { value: "under2000", label: "Under ₹2,000" },
    ],
  },
];

type SortKey = "featured" | "newest" | "best_selling" | "price_asc" | "price_desc";

async function getProducts(params: {
  category?: string;
  sort?: string;
  sale?: string;
  new?: string;
  max_price?: string;
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
                  ? [{
                    OR: [
                      { name: { contains: params.q, mode: "insensitive" } },
                      { description: { contains: params.q, mode: "insensitive" } },
                    ],
                  }]
                  : []),
                ...(params.color
                  ? [{
                    OR: [
                      { name: { contains: params.color, mode: "insensitive" } },
                      { description: { contains: params.color, mode: "insensitive" } },
                    ],
                  }]
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
              : { createdAt: "desc" }, // newest / featured / best_selling all default to newest for now
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

    /* Apply quick-chip filters */
    if (params.sale === "1") result = result.filter((p) => p.discountPercent > 0);
    if (params.new === "1") result = result.filter((p) => p.isNew);
    if (params.max_price) result = result.filter((p) => p.price <= Number(params.max_price));

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
    tag?: string;
    q?: string;
    color?: string;
  }>;
}) {
  const params = await searchParams;
  const products = await getProducts(params);
  const activeCategory = params.category ?? "all";
  const activeSort = params.sort ?? "featured";

  /* Build base URL helper (preserves current state) */
  function buildUrl(extra: Record<string, string>) {
    const p = new URLSearchParams();

    // Copy existing params safely
    if (params.category && params.category !== "all") p.set("category", params.category);
    if (params.sort && params.sort !== "featured") p.set("sort", params.sort);
    if (params.sale) p.set("sale", params.sale);
    if (params.new) p.set("new", params.new);
    if (params.max_price) p.set("max_price", params.max_price);
    if (params.tag) p.set("tag", params.tag);
    if (params.q) p.set("q", params.q);
    if (params.color) p.set("color", params.color);

    // Apply overrides
    Object.entries(extra).forEach(([k, v]) => {
      if (v && v !== "all" && v !== "featured") {
        p.set(k, v);
      } else {
        p.delete(k);
      }
    });

    const qs = p.toString();
    return `/shop${qs ? `?${qs}` : ""}`;
  }

  /* Active quick chips */
  const activeChips = {
    in_stock: false, // we always sort in-stock first, no explicit filter needed in UI
    new: params.new === "1",
    under999: params.max_price === "999",
    gifts: params.tag === "gift",
    sale: params.sale === "1",
  };

  const inStockCount = products.filter((p) => p.inStock).length;
  const soldOutCount = products.filter((p) => !p.inStock).length;

  return (
    <div style={{ paddingBottom: 48 }}>
      {/* ── Page title (v2 centered, Montserrat) ── */}
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

        {/* ── LEFT: Filter sidebar (desktop only) ── */}
        <aside className="filters-sidebar" aria-label="Product filters">
          <h2 className="filters__title">Filters</h2>

          {/* Category filter */}
          <details className="fgroup" open>
            <summary>Category</summary>
            <div className="fgroup__body">
              {CATEGORIES_FILTER.map((cat) => (
                <Link
                  key={cat.slug}
                  href={buildUrl({ category: cat.slug })}
                  className="check"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <input
                    type="radio"
                    name="category"
                    value={cat.slug}
                    checked={activeCategory === cat.slug}
                    readOnly
                    style={{ pointerEvents: "none" }}
                  />
                  <span
                    style={{
                      color: activeCategory === cat.slug ? "var(--mint)" : "var(--text)",
                      fontWeight: activeCategory === cat.slug ? 700 : 400,
                    }}
                  >
                    {cat.label}
                  </span>
                </Link>
              ))}
            </div>
          </details>

          {/* Quick filters */}
          <details className="fgroup" open>
            <summary>Filter by</summary>
            <div className="fgroup__body">
              {QUICK_CHIPS.filter((c) => c.key !== "in_stock").map((chip) => {
                const isActive = activeChips[chip.key as keyof typeof activeChips];
                return (
                  <Link
                    key={chip.key}
                    href={isActive ? buildUrl({ [chip.param]: "" }) : buildUrl({ [chip.param]: chip.value })}
                    className="check"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <input
                      type="checkbox"
                      checked={isActive}
                      readOnly
                      style={{ pointerEvents: "none" }}
                    />
                    <span
                      style={{
                        color: isActive ? "var(--mint)" : "var(--text)",
                        fontWeight: isActive ? 700 : 400,
                      }}
                    >
                      {chip.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </details>

          {/* Sort (desktop sidebar) */}
          <details className="fgroup" open>
            <summary>Sort by</summary>
            <div className="fgroup__body">
              <SortSelect activeSort={activeSort} />
            </div>
          </details>
        </aside>

        {/* ── RIGHT: Results area ── */}
        <section className="results" aria-label="Product results">
          {/* Mobile subcategory bubbles */}
          <div className="subcat-row shop-subcat-mobile" role="navigation" aria-label="Browse by category">
            {CATEGORIES_FILTER.map((c) => (
              <Link
                key={c.slug}
                href={buildUrl({ category: c.slug })}
                className={`subcat-bubble${activeCategory === c.slug ? " active" : ""}`}
                aria-current={activeCategory === c.slug ? "page" : undefined}
              >
                <span className="subcat-bubble__img" aria-hidden="true">{c.emoji}</span>
                <span className="subcat-bubble__label">{c.label}</span>
              </Link>
            ))}
          </div>

          {/* Toolbar: sort (mobile) + view switcher */}
          <div className="toolbar">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Mobile filter button */}
              <button className="btn-filter shop-filter-mobile" aria-label="Open filters" id="open-filter-btn">
                Filter &amp; sort
              </button>
              <span className="result-count" aria-live="polite" style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                {inStockCount} product{inStockCount !== 1 ? "s" : ""} in stock
                {soldOutCount > 0 && ` · ${soldOutCount} sold out`}
              </span>
            </div>
            {/* v2 View switcher (list / 2 / 3 / 4 / 5 columns) */}
            {/* <div className="view-switch" role="group" aria-label="Grid size" id="view-switch">
              {[
                { cols: "1", label: "List view", icon: "☰" },
                { cols: "2", label: "2 columns", icon: "⊞" },
                { cols: "3", label: "3 columns", icon: "⊟" },
                { cols: "4", label: "4 columns", icon: "⊠" },
                { cols: "5", label: "5 columns", icon: "⊡" },
              ].map(({ cols, label, icon }) => (
                <button
                  key={cols}
                  data-cols={cols}
                  aria-label={label}
                  aria-pressed={cols === "4" ? "true" : undefined}
                  title={label}
                  style={{ fontSize: "1.1rem" }}
                >
                  {icon}
                </button>
              ))}
            </div> */}
          </div>

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

      {/* View switcher JS — toggles data-cols on #product-grid */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){
            var switcher = document.getElementById('view-switch');
            var grid = document.getElementById('product-grid');
            if(!switcher||!grid) return;
            switcher.querySelectorAll('button[data-cols]').forEach(function(btn){
              btn.addEventListener('click',function(){
                var cols = btn.getAttribute('data-cols');
                grid.className = 'shop-grid';
                if(cols==='1'){grid.style.gridTemplateColumns='1fr';}
                else if(cols==='2'){grid.style.gridTemplateColumns='repeat(2,1fr)';}
                else if(cols==='3'){grid.style.gridTemplateColumns='repeat(3,1fr)';}
                else if(cols==='4'){grid.style.gridTemplateColumns='';}
                else if(cols==='5'){grid.classList.add('shop-grid--compact');}
                switcher.querySelectorAll('button').forEach(function(b){b.removeAttribute('aria-pressed');});
                btn.setAttribute('aria-pressed','true');
              });
            });
          })();`,
        }}
      />
    </div>
  );
}
