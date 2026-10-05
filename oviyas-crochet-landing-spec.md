# Oviya's Crochet — Landing Page Spec (`/`)

> Extends `oviyas-crochet-ui-spec.md` (tokens, components, accessibility all apply) and matches the clickable mockup **`oviyas-crochet-landing.html`**. Open the mockup in a browser and match it at 390px, 768px and 1280px, in light and dark mode. The home page in the earlier mockup is superseded by this landing page.

Purpose: introduce the brand in seconds, route visitors to where they want to go (shop, categories, custom orders, tracking), and showcase the **top 3 featured products** to drive the first purchase.

## Page structure (top to bottom)

1. **Offer bar** — pink strip driven by the active storewide discount (hidden if none).
2. **Sticky header** — circular logo, `oviyas_crochet`, desktop nav (Shop, Categories, Custom orders, About, Track order, Contact), Cart pill with count. On mobile, nav moves to the fixed bottom bar (Home, Shop, Cart, Account).
3. **Hero** — H1 "Little loops of love, made by hand" (42px mobile / 64px desktop), lead paragraph, CTAs: primary **Shop all products** (`/shop`), secondary **Order something custom** (`/custom-orders`). Three trust points with pink dot bullets (Made to order, Ships across India, Pay with UPI or card). Right side: dashed lavender blob with the bobbing yarn-ball mascot and two floating tags ("100% cotton yarn", "Gift wrapping available"). Two columns at ≥1024px, stacked below. Replace the mascot with a real product photo collage once photos exist.
4. **Where would you like to go?** — six route tiles (dashed border, 22px radius, icon chip, title, one-line hint). Grid: 2 columns mobile, 3 tablet, 6 desktop. Hover lifts 3px and turns the border purple.

| Tile | Route |
|---|---|
| Shop all | `/shop` |
| Amigurumi | `/shop/amigurumi` |
| Bags | `/shop/bags` |
| Gift hampers | `/shop/gift-hampers` |
| Custom orders | `/custom-orders` (enquiry form → admin email) |
| Track order | `/track` |

   Category tiles should be driven from the `Category` table (top 4 by product count or admin-set order); Custom orders and Track order are fixed. Use real category images when available, pastel icon chips as fallback.
5. **Our top 3 picks** — heading, subtitle, "See all products" link. Three large cards (1 column mobile, 3 desktop): rank label top-left (Best seller / Most gifted / New), discount badge top-right when applicable, square image, name (Baloo 2, 21px), one-line description, price with struck-through original, outlined **Add to cart** button. **Data:** products where `isFeatured = true`, limit 3, ordered by a `featuredPosition` field (add an integer field to `Product`); admin sets this in the product form. Prices use the shared `getEffectivePrice` function. Rank labels are admin-editable text (`featuredLabel`).
6. **How your order is made** — lavender band with dashed top/bottom borders; four numbered steps (Choose, Pay securely, We crochet, Delivered) with pink number circles. Explains made-to-order timing and email updates.
7. **Fresh from the hook** — Instagram-style gallery: 3 columns mobile, 6 desktop, rounded tiles, "Follow on Instagram" link to `NEXT_PUBLIC_INSTAGRAM_URL`. Source: admin-managed gallery images (do not scrape Instagram).
8. **Happy homes** — three testimonial cards (name and town). Source: admin-managed testimonials list.
9. **Newsletter** — dashed purple box: "Get 10% off your first order", email field + **Send my code** button; success state changes the button text and sends the `welcome` email with the `WELCOME10` code. Label the input for screen readers.
10. **Footer** — brand blurb plus Shop, Help (Track order, Shipping and returns, FAQ) and Company (About, Contact, Instagram) columns, copyright. 4 columns desktop, 2 mobile.

Mobile only: fixed bottom nav and a floating theme toggle (theme toggle may move into the header menu in production).

## Design rules specific to this page
- Section spacing: 36px mobile, 56px desktop; headings 30px mobile / 38px desktop.
- Only motion: hero yarn-ball bob, route-tile hover lift, toast on add to cart. Respect `prefers-reduced-motion`.
- Do not highlight single words in headlines or add all-caps eyebrow labels.
- All images via `next/image` with `sizes`, blur placeholder, and meaningful `alt`. Hero image is `priority`.

## SEO and performance
- Metadata: title "Oviya's Crochet | Handmade crochet toys, bags and gifts", description, Open Graph image (logo + hero), `Organization` and `WebSite` JSON-LD.
- Server-render featured products and categories; cache with `revalidate` (e.g. 300s) and revalidate on product/discount updates.
- Targets: LCP under 2.5s on mobile 4G, Lighthouse Accessibility 95+, SEO 95+.

## Data additions required
- `Product.featuredPosition Int?`, `Product.featuredLabel String?`
- `GalleryImage { id, url, alt, position }` and `Testimonial { id, name, town, quote, isActive }` tables with admin CRUD screens.
- `CustomOrderRequest { id, name, email, phone, description, referenceImageUrl?, status, createdAt }` with a form at `/custom-orders` that emails the admin.
