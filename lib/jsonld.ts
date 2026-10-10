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
