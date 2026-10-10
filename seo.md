# SEO and Discoverability: Instructions for the AI Developer

Site: **https://oviyascrochet.ignisailabs.com/** (Next.js App Router)
Business: Oviya's Crochet, handmade crochet toys, bags, baby gifts and custom orders, made in Kanniyakumari, shipped across India.

Goal: close every SEO gap so search engines can **find, crawl, understand, index and display** the whole site, and so shared links look good.

Work in this order: **audit first, then fix, then verify.** Do not skip the audit. Reply at the end with the report described in section 14.

---

## 1. Rules for the AI

1. **Audit before changing.** Open the real code and the live pages (`view-source:`) and confirm each item below. Where this file says "verify", check it. Skip anything that is already correct.
2. **Do not invent data.** No fake reviews, ratings, prices, addresses, phone numbers, SKUs or stock counts. Take values from the database or from the owner. Where something is missing, leave a `TODO_OWNER` comment and list it in your final report.
3. **Only mark up what visitors can see.** Structured data (JSON-LD) must match the visible page content (same price, same name, same availability).
4. **No keyword stuffing.** Write natural, useful text for people first.
5. **Keep the existing design.** Do not restyle pages. Add content blocks only where a gap is listed.
6. **One source of truth for the site URL.** Use `NEXT_PUBLIC_SITE_URL` (section 3). Never hardcode the domain elsewhere.
7. **Check the Next.js version** (`package.json`). Code below uses the App Router Metadata API. In Next.js 15 and later, `params` and `searchParams` in pages are Promises (`await` them). Adapt the examples to the installed version.
8. Run `npm run build` and `npm run lint` and fix errors before finishing.

---

## 2. Audit findings (from the live home page, 10 October 2026)

I could read the rendered home page text and its meta tags, but not the raw `<head>` link tags or other routes. Verify each item.

| # | Finding | Why it matters | Fix (section) |
|---|---|---|---|
| 1 | Page title is "Oviya's Crochet \| Handmade crochet toys, bags and gifts \| Oviya's Crochet" (brand appears twice) | Duplicated, longer than needed title | 4 |
| 2 | Meta description, `og:title`, `og:description`, `twitter:card` exist | Good, keep (text is reused below) | 4 |
| 3 | **No `og:image` or `twitter:image`** in the meta tags | Shared links show no picture | 4, 11 |
| 4 | No `og:url`, `og:site_name`, `og:locale`, **no canonical link** seen | Duplicate URL risk, weaker sharing | 4, 5 |
| 5 | Same categories reachable at two URLs: `/shop/bags` **and** `/shop?category=bags` (and `?color=` filters) | Duplicate content, split ranking | 5 |
| 6 | `meta keywords` is set | Ignored by Google; harmless. Leave or remove | 4 |
| 7 | Hero image is `hero_placeholder.jpg`, requested at `w=3840` | Slow LCP, placeholder content, weak alt text | 9 |
| 8 | "Our top picks" shows "Featured products coming soon!" | Thin / empty section on the key page | 10 |
| 9 | Heading order: "Popular searches", "Shop by color", "Recommended collections" are `h4` and come **before** the page `h1` | Messy heading hierarchy | 10 |
| 10 | Home page says "Real reviews from real customers" with three testimonials | Must be genuine and verifiable before using review markup (section 7.6) | 7 |
| 11 | Brand is written "Oviya's Crochet" on the site but "Oviyas Crochet" on the logo and email | Inconsistent entity name | 7.1 |
| 12 | Custom orders page is `/custom-orders` (earlier planning docs said `/request-custom-piece`) | Use the real route everywhere | 6, 12 |
| 13 | Payment claims differ: hero says "UPI or card", footer says "UPI, Cards, NetBanking, COD" | Keep claims consistent with policy pages | 10 |
| 14 | Cart drawer shows stray text "zz" above the empty-cart message | Looks like leftover test text | 10 |
| 15 | Site lives on a subdomain of `ignisailabs.com` | Fine for launch; own domain is better long term (section 13) | 13 |
| 16 | Unknown: robots.txt, sitemap.xml, favicon/icons, 404 handling, structured data | Verify and create where missing | 5, 7, 8 |

---

## 3. Central config

`lib/site.ts`

```ts
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
```

`.env`:

```env
NEXT_PUBLIC_SITE_URL=https://oviyascrochet.ignisailabs.com
CONTACT_EMAIL=oviyascrochet@gmail.com
```

Add `/public/og-default.png` (a 1200×630 share image using the logo is provided with this file). Also keep `/public/logo.png` (the full logo, transparent PNG) for structured data.

---

## 4. Metadata (titles, descriptions, social cards)

### 4.1 Root layout

`app/layout.tsx`

```tsx
import type { Metadata, Viewport } from "next";
import { SITE, IS_PRODUCTION_SITE } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,        // fixes the doubled brand name
  },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: SITE.locale,
    url: "/",
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.description,
    images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: `${SITE.name} logo` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.description,
    images: [SITE.ogImage],
  },
  // staging/preview deployments must never be indexed
  robots: IS_PRODUCTION_SITE ? { index: true, follow: true } : { index: false, follow: false },
  // TODO_OWNER: paste the Search Console "HTML tag" token (section 13)
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  // do NOT set `alternates.canonical` here: it would canonicalize every page to the home page
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#edf4fb",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <body>
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        {children}
      </body>
    </html>
  );
}
```

> Important: in Next.js, a page that defines its own `openGraph` or `twitter` **replaces** the layout's object completely (no deep merge). So every page must go through the helper below, which always includes image, site name and locale.

### 4.2 Helper for every page

`lib/seo.ts`

```ts
import type { Metadata } from "next";
import { SITE, absoluteUrl } from "@/lib/site";

type Args = {
  title: Metadata["title"];       // string, or { absolute: "..." } to skip the template
  description: string;            // 120 to 155 characters
  path: string;                   // clean path, e.g. "/shop/bags"
  image?: string;                 // absolute or site-relative image URL
  noindex?: boolean;
};

export function pageMetadata({ title, description, path, image, noindex }: Args): Metadata {
  const img = image ?? SITE.ogImage;
  const plainTitle = typeof title === "string" ? title : undefined;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: SITE.locale,
      url: absoluteUrl(path),
      title: plainTitle ?? SITE.name,
      description,
      images: [{ url: img, width: 1200, height: 630, alt: plainTitle ?? SITE.name }],
    },
    twitter: { card: "summary_large_image", title: plainTitle ?? SITE.name, description, images: [img] },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
```

### 4.3 Title and description for each page

Titles are written **without** the brand (the template adds ` | Oviya's Crochet`). Keep titles under about 60 characters including the brand, descriptions between 120 and 155 characters.

| Route | Title | Meta description |
|---|---|---|
| `/` | `{ absolute: "Oviya's Crochet \| Handmade crochet toys, bags and gifts" }` | Cuddly toys, everyday bags and thoughtful gifts, crocheted to order in Kanniyakumari and delivered across India. Made with love, shipped with care. |
| `/shop` | Shop Handmade Crochet Toys, Bags & Gifts | Browse handmade crochet amigurumi, bags, baby gifts, home décor and gift hampers. Made to order in Kanniyakumari and shipped across India. |
| `/shop/amigurumi` | Handmade Amigurumi Crochet Toys | Soft, cuddly handmade amigurumi toys, crocheted to order in Kanniyakumari from 100% cotton yarn and shipped across India. |
| `/shop/bags` | Handmade Crochet Bags & Pouches | Sturdy, colourful crochet totes and pouches, handmade to order in cotton yarn. Choose your colour and get it delivered across India. |
| `/shop/baby` | Handmade Crochet Baby Gifts | Soft handmade crochet baby gifts and outfits, made to order with gentle cotton yarn. A thoughtful gift, delivered across India. |
| `/shop/gift-hampers` | Crochet Gift Hampers | Thoughtful handmade crochet gift hampers with gift wrapping available, made to order and delivered across India. |
| `/shop/home-decor`, `/shop/accessories` | Handmade Crochet Home Décor / Handmade Crochet Accessories | Same pattern: one factual sentence about the category, "made to order in Kanniyakumari", "ships across India". |
| `/custom-orders` | Custom Crochet Orders: Baby Outfits, Hats & Character Sets | Request custom handmade crochet baby outfits, hats, keychains and superhero or anime-inspired sets. Send your idea and we'll reach back by email. |
| `/about` | Our Story: Handmade in Kanniyakumari | Meet Oviya and her team, who crochet every piece by hand in Kanniyakumari. See how each made-to-order piece is made. |
| `/contact` | Contact Us | Questions about an order or a custom piece? Contact Oviya's Crochet by email or Instagram. We reply as soon as we can. |
| `/faq` | FAQ: Orders, Shipping & Custom Pieces | Answers about ordering, made-to-order timelines, shipping, payments and custom crochet requests. |
| `/shipping-policy` | Shipping Policy | How we pack and ship handmade crochet orders across India, with delivery times and charges. |
| `/returns-refunds` | Returns & Refunds | Our returns and refund policy for handmade and made-to-order crochet pieces. |
| `/privacy-policy`, `/terms-of-service`, `/data-sharing-opt-out` | Privacy Policy / Terms of Service / Data Sharing Opt-Out | One plain sentence describing the page. |

> Owner check: the shipping, returns and delivery descriptions above must match the real policy pages. Edit the sentence if a policy differs.

### 4.4 Product pages (dynamic)

`app/shop/[category]/[slug]/page.tsx` (adapt to the real product route)

```tsx
export async function generateMetadata({ params }) {
  const { slug } = await params;                 // remove `await` on Next 14
  const p = await getProductBySlug(slug);
  if (!p) return { title: "Product not found", robots: { index: false } };
  const description = (p.shortDescription ?? p.description)
    .replace(/\s+/g, " ").slice(0, 150).trim();
  return pageMetadata({
    title: `${p.name} | Handmade Crochet ${p.categoryName}`,
    description: `${description} Made to order in Kanniyakumari.`.slice(0, 160),
    path: `/shop/${p.categorySlug}/${p.slug}`,
    image: p.images?.[0]?.url,
  });
}
```

If products are not yet routed like this, inspect the existing product route and keep its URL; just make sure there is **one** canonical URL per product.

Product social image: the product's first photo may be any ratio. That's fine for the card; keep it at least 1200 px wide.

---

## 5. Crawling, indexing and URLs

### 5.1 `robots.txt`

`app/robots.ts`

```ts
import type { MetadataRoute } from "next";
import { SITE, IS_PRODUCTION_SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  if (!IS_PRODUCTION_SITE) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/admin/"] }],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
```

- Do **not** block `/_next/` (Google needs its CSS and JS to render the pages).
- Do **not** block filter or account URLs here. Control them with canonical and `noindex` (below): a blocked URL cannot show Google its `noindex` tag.

### 5.2 `sitemap.xml`

`app/sitemap.ts`

```ts
import type { MetadataRoute } from "next";
import { SITE, absoluteUrl } from "@/lib/site";

export const revalidate = 3600; // refresh hourly

const STATIC = ["/", "/shop", "/custom-orders", "/about", "/contact", "/faq",
  "/shipping-policy", "/returns-refunds", "/privacy-policy", "/terms-of-service"];
const CATEGORIES = ["amigurumi", "bags", "baby", "gift-hampers", "home-decor", "accessories"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllPublishedProducts(); // TODO: real data function; slug, categorySlug, updatedAt
  return [
    ...STATIC.map((p) => ({ url: absoluteUrl(p), changeFrequency: "weekly" as const, priority: p === "/" ? 1 : 0.7 })),
    ...CATEGORIES.map((c) => ({ url: absoluteUrl(`/shop/${c}`), changeFrequency: "weekly" as const, priority: 0.8 })),
    ...products.map((p) => ({
      url: absoluteUrl(`/shop/${p.categorySlug}/${p.slug}`),
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];
}
```

Include only canonical, indexable URLs. Exclude: filters (`?color=`, `?sort=`), cart, checkout, account, track, search, thank-you pages.

### 5.3 One URL per page (fix duplicates)

The same category is reachable as `/shop/bags` and `/shop?category=bags`.

1. Choose the clean path form as canonical for **all six** categories: `/shop/amigurumi`, `/shop/bags`, `/shop/baby`, `/shop/gift-hampers`, `/shop/home-decor`, `/shop/accessories`. (Create the missing `home-decor` and `accessories` routes if they do not exist.)
2. In `middleware.ts`, permanently redirect (308) `/shop?category=<known slug>` to `/shop/<slug>`, **removing** the `category` parameter from the new URL.
3. Update every internal link, nav item and footer link to the clean path.
4. Filters and sorting (`?color=pink`, `?sort=price`): keep them working for users, set the canonical to the clean base path (without the parameter), and keep the links crawlable.
5. Pagination (`?page=2`): self-referencing canonical that keeps `page` but drops sort and filter parameters.
6. Trailing slashes and `www`: pick one form, redirect the other to it (one hop).

```tsx
// In a category page's generateMetadata, canonical is always the clean path:
alternates: { canonical: `/shop/${category}` }
// For ?page=N (N > 1): canonical `/shop/${category}?page=${N}`
```

### 5.4 Pages that must not be indexed

Add `robots: { index: false, follow: false }` (via `pageMetadata({ noindex: true, ... })` or the route layout's `metadata`) to: `/account/*` (including login), `/cart`, `/checkout/*`, `/track`, search results pages, order confirmation/thank-you pages, `/admin/*`.

### 5.5 404 and errors

- `app/not-found.tsx`: friendly message, links to Shop, Custom orders and Home, and `robots: { index: false }`. It must return a real HTTP **404**.
- In dynamic routes call `notFound()` when a product or category does not exist (never render an empty product page with a 200 status).
- Discontinued products: keep the page if it has external links, mark it unavailable (structured data `OutOfStock`), and link to similar items. Otherwise return 404 and remove it from the sitemap.

### 5.6 Static generation and speed of crawling

- Category and product pages should be statically generated or ISR (`generateStaticParams` plus `export const revalidate = 3600`), so crawlers get fast HTML.
- Important content (headings, descriptions, prices, links) must be present in the server-rendered HTML, not loaded only after JavaScript runs in the browser.

---

## 6. Internal linking

- Header, footer and home page already link to the main pages. Keep them as normal `<a>`/`<Link>` elements (no click-only buttons for navigation).
- Add **breadcrumbs** on category and product pages (`Home > Shop > Bags > Product`), visible in the UI and as structured data (section 7.5).
- Add "Related products" (same category) on product pages.
- Link the custom orders page from relevant category pages (Baby gifts, Amigurumi) with descriptive text such as "Want it in your colours? Request a custom piece".
- Use descriptive link text. Avoid "click here".
- The custom orders route is **`/custom-orders`** (anchor `#request-form`). Use that in all links and the sitemap.

---

## 7. Structured data (JSON-LD)

### 7.1 Helper component

`components/JsonLd.tsx`

```tsx
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
```

### 7.2 Organization and website

`lib/jsonld.ts`

```ts
import { SITE, absoluteUrl } from "@/lib/site";

export const organizationJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE.url}/#organization`,
  name: SITE.name,
  alternateName: SITE.alternateName,       // covers the Oviya's / Oviyas spelling
  url: SITE.url,
  logo: absoluteUrl("/logo.png"),
  email: SITE.email,
  sameAs: [SITE.instagram, SITE.youtube],
  areaServed: { "@type": "Country", name: "India" },
  address: {                                // city and state only; no street address was provided
    "@type": "PostalAddress",
    addressLocality: "Kanniyakumari",
    addressRegion: "Tamil Nadu",
    addressCountry: "IN",
  },
});

export const websiteJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE.url}/#website`,
  url: SITE.url,
  name: SITE.name,
  inLanguage: "en-IN",
  publisher: { "@id": `${SITE.url}/#organization` },
  // Add potentialAction (SearchAction) ONLY if the site has a working search page.
  // TODO: if search exists at /search?q=..., add:
  // potentialAction: { "@type": "SearchAction", target: `${SITE.url}/search?q={search_term_string}`, "query-input": "required name=search_term_string" },
});
```

### 7.3 Product pages

```ts
export const productJsonLd = (p: {
  name: string; description: string; images: string[]; sku?: string;
  price: number; inStock: boolean; path: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: p.name,
  description: p.description,
  image: p.images.map((i) => (i.startsWith("http") ? i : absoluteUrl(i))),
  ...(p.sku ? { sku: p.sku } : {}),
  brand: { "@type": "Brand", name: SITE.name },
  offers: {
    "@type": "Offer",
    url: absoluteUrl(p.path),
    priceCurrency: SITE.currency,
    price: p.price.toFixed(2),                     // must equal the visible price
    availability: p.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    itemCondition: "https://schema.org/NewCondition",
    seller: { "@id": `${SITE.url}/#organization` },
  },
});
```

- Made-to-order items that customers can order right now count as `InStock`.
- **Do not add** `aggregateRating` or `review` unless the site stores genuine reviews from real customers and displays them on that product page.
- Optional, only with real policy data from the owner: `shippingDetails` (delivery time, India, charge) and `hasMerchantReturnPolicy`. Leave a `TODO_OWNER` instead of guessing.
- If a discount applies, the Offer price must be the price the customer actually pays.

### 7.4 Category / shop pages

Use `CollectionPage` with an `ItemList` of the first page of products (name, url, image). Keep it short (top 12 to 24 items).

### 7.5 Breadcrumbs

```ts
export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: absoluteUrl(it.path),
  })),
});
```

### 7.6 Reviews and testimonials (important)

The home page currently shows three named testimonials under "Real reviews from real customers". Before launch:

- Confirm with the owner that they are genuine and the customers agreed to be quoted. If they are placeholders, **remove them or relabel them** until real ones exist. Fake reviews risk search penalties and break consumer-protection rules.
- Do not wrap these testimonials in `Review`/`AggregateRating` markup. Use review markup only on product pages with real, stored, product-specific reviews.

### 7.7 FAQ

Add visible FAQ content on `/faq` and on `/custom-orders`. `FAQPage` markup is optional and rarely shows rich results now, so treat it as low priority. If added, it must match the visible questions exactly.

### 7.8 Validate

Test home, a category page, a product page and `/faq` in Google's **Rich Results Test** and at **validator.schema.org**. There must be no errors.

---

## 8. Icons, manifest and social images

Use the supplied logo files.

| File | Location | Notes |
|---|---|---|
| `favicon.ico` (16/32/48/64/256) | `app/favicon.ico` | from the favicon folder in the logo zip |
| `icon.png` (512×512) | `app/icon.png` | Next.js adds the `<link rel="icon">` automatically |
| `apple-icon.png` (180×180) | `app/apple-icon.png` | iOS home-screen icon |
| `og-default.png` (1200×630) | `public/og-default.png` | default share image |
| `logo.png` | `public/logo.png` | used by Organization markup |

`app/manifest.ts`

```ts
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Oviya's Crochet",
    short_name: "Oviya's",
    description: "Handmade crochet toys, bags and gifts, made to order in Kanniyakumari.",
    start_url: "/",
    display: "standalone",
    background_color: "#edf4fb",
    theme_color: "#edf4fb",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
```

(`icon-192.png` and `icon-512.png` are in the favicon folder of the logo zip as `favicon-192.png` and `favicon-512.png`; rename when copying to `public/`.)

For product pages, the product photo is used as the share image (section 4.4).

---

## 9. Images

1. **Always use `next/image`** with `width`/`height` (or `fill` plus a parent with a set aspect ratio) so layout does not jump (CLS).
2. **Fix oversized images.** The live home page requests images at `w=3840`. Add a correct `sizes` prop to each image, for example:

```tsx
<Image
  src={hero.src}
  alt="Handmade crochet bunny, bag and baby set from Oviya's Crochet"
  fill
  priority                                  // hero / LCP image only
  sizes="(min-width: 1024px) 50vw, 100vw"
/>
```

3. Only the hero image gets `priority`. Everything below the fold is lazy-loaded (default).
4. `next.config.js`:

```js
images: { formats: ["image/avif", "image/webp"], minimumCacheTTL: 60 * 60 * 24 * 30 }
```

5. **Replace `hero_placeholder.jpg`** with a real photo of Oviya's work (TODO_OWNER). Use descriptive file names (`pink-crochet-bunny.webp`, not `IMG_2043.jpg`).
6. **Alt text rules:** describe what is in the picture in one short sentence, mentioning product type, colour and material when relevant ("Mint green crochet tote bag in cotton yarn"). Decorative images get `alt=""`. Do not stuff keywords. Fix generic alts such as "Custom crochet baby girl outfit" if they can be more specific.
7. Product images: at least 3 photos per product (front, detail, scale/in-use) where available, 1200 px or wider, first one is the share image.

---

## 10. On-page content and structure

### 10.1 Headings
- Exactly **one `<h1>` per page**, and it comes first in the page flow.
- On the home page, "Popular searches", "Shop by color" and "Recommended collections" currently use `h4` before the `h1`. Change them to `<p>`/`<span>` styled as labels, or move them below the hero, so the heading outline is `h1 > h2 > h3`.
- Keep the home `h1` ("Little loops of love, made by hand") and make sure the first paragraph names what the shop sells (it already does: toys, bags, gifts, Kanniyakumari, India).

### 10.2 Fill empty or thin content
- **"Our top picks / Featured products coming soon!"**: show real featured products (flag products as `featured` in the database). If there are none, hide the section until there are.
- **Category pages:** add a unique 80 to 150 word intro above the product grid (materials, how it is made, who it suits, link to custom orders). Write it naturally; do not copy between categories.
- **Product pages:** unique description of at least 60 to 100 words covering size, material (for example 100% cotton yarn), colours available, care instructions, made-to-order timing (the home page says delivery in 5 to 7 days: use real figures the owner confirms), and gift wrapping if offered.
- **About page:** who Oviya is, a photo of her or her work, how pieces are made, where (Kanniyakumari). Real, first-hand detail builds trust.
- **Contact page:** email, Instagram, location (city level), expected reply time (TODO_OWNER), and a contact form if it already exists.
- **FAQ:** at least 8 genuine questions (shipping time, made-to-order, payment methods, custom requests, care, returns, gift wrapping, order tracking).

### 10.3 Consistency fixes
- Make payment wording identical everywhere (hero, footer, checkout, policy pages). Confirm with the owner whether COD is offered.
- Remove the stray **"zz"** text from the cart drawer.
- Use one brand spelling in visible text (see section 7.2).
- Keep the 10% festive offer in the top banner only; do not put time-limited offers in meta titles or descriptions.

### 10.4 Optional content (after launch)
Short helpful guides help the site rank for questions people search: "How to wash crochet toys", "Gift ideas for new babies", "How custom crochet baby outfits are made", "Choosing a crochet bag size". Add under `/guides/<slug>` only if the owner will maintain them.

---

## 11. Social sharing

- Default share image: `/og-default.png` (supplied). Every page gets an image via `pageMetadata`.
- Product pages use their own photo; the home page may use a real hero photo later.
- Test with the Facebook Sharing Debugger, LinkedIn Post Inspector and by pasting the link into WhatsApp (important for India). Image should show, with the right title and description.

---

## 12. Custom orders page SEO (`/custom-orders`)

- Title and description from section 4.3.
- One `h1`: "Custom orders, made for you".
- Sections with `h2` headings: What we can make, How it works, Superhero & Anime designs, Request form, FAQ.
- AI-generated design previews keep their "Design preview (AI-generated)" label; use alt text that says what is shown ("AI design preview of a Naruto-inspired crochet baby beanie").
- Describe character pieces as **"inspired by"** and keep the "not affiliated" disclaimer from the custom orders instructions. Do not put character names in the page title beyond what the page really offers.
- Add `BreadcrumbList` (Home > Custom Orders).
- The form page should load fast and the "Request a custom piece" buttons everywhere should link to `/custom-orders#request-form`.

---

## 13. Launch, monitoring and domain

### 13.1 Search Console and Bing (owner action, AI prepares the code)
1. In Google Search Console, add a **URL-prefix property** for `https://oviyascrochet.ignisailabs.com/` (a Domain property would need DNS access to `ignisailabs.com`).
2. Verify with the **HTML tag** method: copy the token into the `GOOGLE_SITE_VERIFICATION` env var (the layout already outputs it).
3. Submit `https://oviyascrochet.ignisailabs.com/sitemap.xml`.
4. Repeat in **Bing Webmaster Tools** (it can import from Search Console).
5. After a few days, use **URL Inspection** on the home page and one product page, then "Request indexing".

### 13.2 Own domain (recommended)
The site is on a subdomain of another brand's domain, which limits how well it can build its own reputation. When the owner buys a domain (for example `oviyascrochet.com`):
1. Change `NEXT_PUBLIC_SITE_URL`.
2. Add a permanent 301 redirect from every old URL to the same path on the new domain.
3. Add the new domain to Search Console and submit the new sitemap.
4. Update Instagram and YouTube bio links, email signatures and Google Business details.

### 13.3 Other owner tasks
- Link the website from the Instagram and YouTube profiles (already linked from the site in the other direction).
- Consider a Google Business Profile only if the owner is comfortable with the rules for home-based or online-only businesses (TODO_OWNER).
- Add privacy-friendly analytics (for example Plausible, or GA4 with a consent banner if required) and load it with `next/script` and `strategy="afterInteractive"` so it does not slow the page.

---

## 14. Verification and final report

### 14.1 Commands (replace with your URL if different)

```bash
curl -sI https://oviyascrochet.ignisailabs.com/ | head -n 10        # 200, no unexpected redirects
curl -s  https://oviyascrochet.ignisailabs.com/robots.txt            # allows /, lists the sitemap
curl -s  https://oviyascrochet.ignisailabs.com/sitemap.xml | head    # canonical URLs only
curl -sI https://oviyascrochet.ignisailabs.com/this-page-does-not-exist | head -n 1   # HTTP 404
curl -sI "https://oviyascrochet.ignisailabs.com/shop?category=bags" | head -n 5       # redirect to /shop/bags
curl -s  https://oviyascrochet.ignisailabs.com/ | grep -Eo '<link rel="canonical"[^>]*>|<meta property="og:image"[^>]*>|application/ld\+json'
```

### 14.2 Tools to run
- Lighthouse (SEO, Accessibility, Best Practices) on home, category, product and custom orders pages. Target **90+** on each.
- PageSpeed Insights (mobile): LCP under 2.5 s, INP under 200 ms, CLS under 0.1.
- Rich Results Test and validator.schema.org for the structured data.
- Social share debuggers (section 11).

### 14.3 Acceptance checklist

- [ ] Home title no longer repeats the brand name; every page has a unique title and description
- [ ] `og:image`, `twitter:image`, `og:url`, `og:site_name`, `og:locale` present on every page
- [ ] Every indexable page has a self-referencing canonical; filter and sort URLs canonicalize to the clean path
- [ ] `/shop?category=x` redirects to `/shop/x`; all internal links use clean paths
- [ ] `robots.txt` and `sitemap.xml` exist; sitemap has only canonical, indexable URLs and includes products
- [ ] Account, cart, checkout, track and search pages are `noindex`
- [ ] Non-production deployments are `noindex` and disallowed in robots
- [ ] Real 404 page and HTTP 404 status for missing routes and products
- [ ] Organization, WebSite, Product, BreadcrumbList markup valid; no fake reviews or ratings
- [ ] Favicon, Apple icon, manifest and share image work
- [ ] Hero placeholder replaced (or flagged TODO_OWNER); images use `sizes`, only hero has `priority`
- [ ] One `h1` per page and correct heading order; empty "top picks" section fixed; stray "zz" removed
- [ ] Category intros, product descriptions, About, Contact and FAQ content filled or listed as TODO_OWNER
- [ ] `<html lang="en-IN">`
- [ ] `npm run build` and `npm run lint` pass
- [ ] Lighthouse SEO 90+ on key pages

### 14.4 Final report from the AI

Reply with:
1. A table of what you **checked**, what was **already fine**, and what you **fixed** (with file paths).
2. Everything left as `TODO_OWNER` (owner inputs needed): brand spelling, real hero and product photos, genuine reviews, shipping/returns/delivery facts, payment methods (COD), contact reply time, Search Console token, custom domain.
3. Anything you could not verify and how the owner can check it.