# Oviyas Crochet – UI Update + New Shopping Experience

This file builds on `oviyas-crochet-styling-guide.md` (brand fonts, core palette, logo rules). Read that first. This one covers:

1. What we borrowed from the reference sites
2. A small palette extension (inspired by Magic Needles)
3. Site-wide UI updates (header, home, footer)
4. A new **shopping / browsing / filtering / sorting / searching** experience
5. Ready-to-use CSS/HTML patterns
6. Implementation notes and checklist

> **Instruction for whoever implements this (developer or AI assistant):** change UI and layout only. Keep existing products, data, URLs, cart and checkout logic working. Apply brand fonts and colors from the styling guide.

---

## 0. What I could and couldn't review

- **magicneedles.in** (home + the *Aran Baby Cake* collection page): reviewed. Observations below come from its page content and metadata. I could only read text/structure, not see the visual design, so colors beyond its declared theme color (`#5cc9b3`, a mint/teal) are not verified.
- **leafyaffair.com/collections/all**: the link was too long for my page reader and I could not open the page. **I did not copy anything from it.** The shopping patterns below are based on Magic Needles plus standard best practice for fashion/gift stores (which is what Leafy Affair is, a botanical jewellery brand). If you send a screenshot or a shorter link (`https://leafyaffair.com/collections/all`), I'll fold in its specific ideas.

---

## 1. What Magic Needles does well (borrow) and where it falls short (improve)

### Borrow
| Pattern | Why it works |
|---|---|
| Top announcement/membership bar | Promotes offers and loyalty without crowding the hero |
| Mega menu with featured image tiles and item counts (e.g. "Handmade Tops Collection 65") | Visual shortcuts; people see what's inside before clicking |
| Search overlay with **Popular Searches** and **Recommended Collections** | Helps people who don't know what to type |
| Home page shortcut tiles (Yarns, Tools, Kits, Flowers) | One-tap entry into main categories |
| Horizontal product rows per category with "View All" | Easy browsing without leaving the home page |
| Sale countdown and anniversary banner | Creates urgency (use sparingly) |
| Learn/Inspire area (guides, workshops, blog) | Builds trust and repeat visits |
| Wishlist, Quick view, Quick add on cards | Fewer clicks to buy |
| MRP strike-through with sale price | Clear value |

### Improve (problems seen on the collection page)
| Problem on their collection page | Fix in our design |
|---|---|
| Filters like Product Type (22), Thickness (22), Fibre (22), Ply (22), Brand (22) have **one value each**, so they do nothing | **Hide any filter that has fewer than 2 values** in the current results |
| 22 near-identical cards with titles like "Aran Baby Cake Anti-Pill Yarn by Hobby Store – 3035" | Short, human product names, color swatches, and mixed-size tiles so the grid has rhythm |
| Sold-out items appear mixed in with available ones | **In stock first**, sold-out pushed to the end with "Notify me" |
| 9 sort options, including both "Featured" and "Most relevant" | Cut to 5 clear options |
| Grid switcher offers List, 2, 3, 4, 5 columns | Offer just two density choices (comfortable / compact) |
| Numbered pagination (1, 2, »)  | "Load more" with a progress count |
| Long repeated description text on every card | Remove from cards; keep name, price, swatches, one badge |
| Many buttons per card (wishlist, cart, quick view, quick add) | One primary action (Quick add) plus a heart |

---

## 2. Palette extension (inspired by Magic Needles' mint theme color)

Brand core stays **Cotton Candy / Chalk White / Jet Black / Pewter Gray**. Magic Needles' declared theme color is a fresh mint (`#5CC9B3`). We use a **small amount of mint as a supporting accent** so the pink doesn't have to do every job. This is an extension of the brand book, not part of it, so approve it before shipping.

```css
:root {
  /* Brand core (from brand book) */
  --cotton-candy: #FF99CC;
  --chalk-white:  #FAF5F0;
  --jet-black:    #000000;
  --pewter-gray:  #A3A3A3;

  /* Extension */
  --mint:         #5CC9B3;   /* fills/badges, always with BLACK text on top */
  --mint-deep:    #17776A;   /* mint used as TEXT on light backgrounds (≈5:1 contrast) */
  --pink-wash:    #FFE6F2;   /* soft pink tint for hover rows, selected chips, banners */
  --pink-hover:   #FF80C0;
  --line:         #E4DDD6;   /* hairline borders on Chalk White */
  --danger:       #D6336C;   /* errors, "only 2 left" (≥4.5:1 on white) */
}
```

**Where each color goes**

| Use | Color |
|---|---|
| Page background | Chalk White |
| Primary buttons, selected states, key highlights | Cotton Candy with Jet Black text |
| Dark bands (announcement bar, footer, "new drop" row) | Jet Black with Chalk White text, pink accents |
| In stock, free-shipping progress, "New" badge, success messages | Mint fill with black text (or Mint Deep text on light) |
| Selected filter chip background | Pink Wash with black border |
| Hairlines, disabled, placeholders | Pewter Gray / Line |
| Low stock, errors | Danger |

Keep the ratio roughly **60% Chalk White / 20% Black / 12% Pink / 8% Mint**. Mint is a supporting actor.

**Accessibility:** never use Cotton Candy or Mint as text on light backgrounds. Use Mint Deep for mint text.

---

## 3. Site-wide UI updates

### 3.1 Header
- Row 1: **announcement bar** (Jet Black, Chalk White text, small DM Sans, rotating message, e.g. "Free shipping over ₹999 · Handmade to order · Ships in 3–5 days"). Adjust the message to your real policies.
- Row 2: logo (left, min width 152 px), main nav (center), **search icon + wishlist + account + cart with count bubble** (right).
- Sticky on scroll; shrinks to a compact bar (logo icon only).
- Main nav (suggested; map to your actual categories): **New In · Wear · Home · Gifts · Custom Orders · Our Story**.
- Mega menu: 3–4 link columns + 1–2 image tiles with category name and item count (like Magic Needles). Image tiles use 4:5 photos with rounded corners (16px).
- Mobile: hamburger opens a full-height drawer; large tap targets (min 44 px); search field lives at the top of the drawer.

### 3.2 Home page order
1. Hero: Cotton Candy or Jet Black background, DM Serif Display headline, one CTA.
2. **Shop by category tiles** (4–6 big rounded tiles with photo + label).
3. **New drop** row (horizontal scroll product cards, "View all" link).
4. **Shop by color**: a row of round swatches (pink, mint, black, cream…) that link to color-filtered results.
5. **Gift finder** banner: "Gifts under ₹500 / ₹1000 / ₹2000" chips.
6. **Custom orders / made-for-you** banner with a short, witty line.
7. Story strip: maker photo + short brand story ("Handmade warmth, woven for individual style.").
8. Instagram / customer photos grid.
9. Reviews carousel (3 short quotes).
10. Newsletter signup (Jet Black band, pink button).

### 3.3 Footer
Jet Black background. Columns: Shop, Help (shipping, returns, care guide, size guide, contact), About, Follow. Payment icons row. Small print in Pewter Gray.

### 3.4 Motion and shape
- Radius: 12px inputs, 16–20px cards and tiles, 999px pills.
- Hover: lift 2–4px, pink offset shadow (`6px 6px 0 var(--cotton-candy)`).
- Transitions 150–250ms. Respect `prefers-reduced-motion`.

---

## 4. The new shopping experience

### 4.1 Collection page layout

```
[ Breadcrumb ]
[ Collection banner: title (DM Serif Display), 1–2 line witty intro, hero image ]
[ Subcategory circles / chips: All · Tops · Bags · Scarves · Hair accessories … ]
[ Toolbar (sticky): Filter  | quick chips | Sort ▾ | View ▢▢ ]
[ Applied filter chips + "Clear all" + result count ]
[ Product grid with rhythm (feature tiles and story tiles mixed in) ]
[ Load more (Showing 24 of 86 ▬▬▬▬░░░░) ]
[ Recently viewed ]
```

**Banner:** short and brand-voiced, e.g. *"Tops. Stitched loud."* Keep it under 120px tall on mobile.

**Subcategory circles:** round thumbnails (64–80px) in a horizontal scroll row, like story bubbles. The selected one gets a pink ring.

### 4.2 Make the grid less "card, card, card"

The problem is a wall of identical boxes. Fixes:

1. **Borderless product tiles.** Image with rounded corners and text underneath. No heavy box, no shadow until hover.
2. **Consistent 4:5 portrait images** (crochet photographs best in portrait). Second image appears on hover (desktop) or swipe (mobile).
3. **Rhythm tiles.** Every 8th–10th slot, insert a full-width or double-width tile: a lookbook photo, a "Style it with…" picture, a gift-guide banner, or a witty line in DM Serif Display on Cotton Candy. This breaks monotony.
4. **Shop-the-look tiles** (optional): a model photo with tap-points that open a mini product popup.
5. **Columns:** mobile 2, tablet 3, desktop 4. Compact density option allows 5 on large screens. Drop the "list" view.
6. **Pink-wash skeleton loaders** while products load.

### 4.3 Product tile content (keep it minimal)

Show only:
- Image (with hover alt image)
- One badge max: `New`, `Bestseller`, `Made to order`, `Only 2 left`, or `Sale –25%`
- Heart (wishlist), top-right of image
- Name (max 2 lines), DM Sans medium
- Price (sale price bold, MRP struck through in gray)
- **Color dots** (up to 4, plus "+3")
- Small star rating with count (e.g. ★ 4.8 (44)), only if there are reviews
- **Quick add** button appears on hover (desktop) and as a small "+" button (mobile). If the item has sizes/colors, it opens a bottom sheet to pick them.

Remove: description snippets, multiple buttons, "Quick view" as a separate button (the tile itself can open a quick-view sheet on long-press or via the "+" sheet).

**Naming:** use short, human names ("Candy Crush Crop Top", "Bubblegum Bucket Bag"), not code-style titles with SKU numbers. If SKU numbers are required, show them small on the product page, not in the grid.

### 4.4 Filtering

**Desktop:** a sticky left sidebar (collapsible accordions) *or* a "Filter" button that opens a right-side drawer. For a small catalog (under ~150 items), prefer the **chips + drawer** approach, which feels lighter and more fashion-forward.

**Mobile:** a "Filter & Sort" button opens a **bottom sheet** (85% height) with accordions and a sticky footer: `Clear all` · `Show 42 items` (live count, Cotton Candy button).

**Quick chips in the toolbar** (one tap, no drawer): `In stock` · `New` · `Under ₹999` · `Gift ideas` · `Ready to ship`. Selected chips get Pink Wash background and a black border.

**Filter groups** (show only those that apply to the current collection and have 2+ values):

| Group | Control | Notes |
|---|---|---|
| Availability | Toggle: *In stock only* (**on by default**), *Include made-to-order* | |
| Category | Checkboxes | With counts |
| **Color** | **Round swatches** (multi-select) | Swatch = actual color; show a check on selected; label on hover/long-press |
| Size | Pill buttons (XS–XL, Free size) | Only for wearables |
| Price | Dual-range slider + two inputs | Preset chips: Under ₹500, ₹500–1000, ₹1000–2000, ₹2000+ |
| Occasion / Style | Checkboxes: Everyday, Party, Festive, Beach, Gifting, Baby | Great for handmade goods |
| Material | Checkboxes: Cotton, Acrylic, Wool, Blend | If you track it |
| Delivery time | Radio: Ready to ship / 3–5 days / Made to order | Reduces surprise |
| Rating | 4★ & up | Optional |

**Behavior rules**
- Apply instantly (no page reload) and update the URL (`?color=pink&price=0-999`) so filtered pages are shareable and the back button works.
- Show applied filters as removable chips above the grid, with a **Clear all** link.
- Show live counts next to options; hide options with 0 results (or gray them out).
- **Never show a filter with only one value.**
- Remember filters when the person opens a product and comes back.
- Empty state (witty): *"Nothing here matches. Even our yarn is confused."* + `Clear filters` button + 4 suggested products.

### 4.5 Sorting

One dropdown (or bottom sheet on mobile), five options only:

1. **Featured** (default; in stock first, then your curated order)
2. **New arrivals**
3. **Best selling**
4. **Price: low to high**
5. **Price: high to low**

Sold-out items always sink to the bottom regardless of sort. Show the current sort in the button label: `Sort: Featured ▾`.

### 4.6 Searching

**Search overlay** (full-width panel under the header on desktop, full-screen on mobile):

- Autofocus input with placeholder like *"Search tops, bags, gifts, pink…"*
- **Before typing:**
  - *Recent searches* (stored locally on the device)
  - *Popular searches* (chips; e.g. "Crochet top", "Flower bag", "Gift under 500", "Baby set")
  - *Shop by color* (swatches)
  - *Recommended collections* (2–4 image tiles, like Magic Needles)
- **While typing (after 2 characters, ~200ms debounce):**
  - Suggested queries (autocomplete)
  - Matching collections/categories
  - Top 4–6 matching products with thumbnail, name, price (and "Sold out" tag if relevant)
  - "See all results for 'xyz' →"
- Search should understand **color, category and price words together** ("pink bag under 1000"). If the platform can't do that natively, map color/category words to filters.
- Typo tolerance and synonyms: top/crop top/bralette, tote/bag, scrunchie/hair tie, keychain/keyring.
- **No results page:** apologize in brand voice, show "Did you mean…", popular searches and a "Request a custom piece" link.
- Search results page uses the same toolbar, filters and sort as collections.
- Keyboard: `/` focuses search on desktop; `Esc` closes; arrow keys move through suggestions.

### 4.7 Loading more products
- Replace numbered pages with **"Load more"** button plus a progress line: *"Showing 24 of 86"* with a thin Cotton Candy progress bar.
- Optionally auto-load on scroll after the first manual click, but keep the button as fallback.
- Preserve scroll position when returning from a product page.

### 4.8 Sold-out handling
- Group sold-out items at the end of the grid.
- Show them dimmed (opacity .6) with a "Sold out" label and a **Notify me** button (collect email/WhatsApp).
- Offer "Similar in stock" on the product page.

### 4.9 Helpful extras (nice to have)
- **Free-shipping progress bar** in the cart drawer (Mint fill).
- **Compare / size guide** link on tiles for wearables.
- **Wishlist** page with "move all to cart".
- **Gift finder quiz** (3 questions: who, budget, vibe) leading to a pre-filtered collection.
- **"Complete the look"** and **"Customers also bought"** rows on product pages.
- **Back-in-stock** WhatsApp alerts.

---

## 5. Ready-to-use patterns (HTML + CSS)

Uses the variables from section 2 and the fonts from the styling guide.

### 5.1 Product tile

```html
<article class="tile">
  <a class="tile__media" href="/products/candy-crush-crop-top">
    <img class="tile__img" src="front.jpg" alt="Candy Crush crop top in pink" loading="lazy" width="800" height="1000">
    <img class="tile__img tile__img--alt" src="alt.jpg" alt="" loading="lazy" width="800" height="1000">
    <span class="badge badge--new">New</span>
  </a>
  <button class="tile__heart" aria-label="Add to wishlist">♡</button>
  <button class="tile__add" aria-label="Quick add">+ Quick add</button>

  <div class="tile__body">
    <h3 class="tile__title"><a href="/products/candy-crush-crop-top">Candy Crush Crop Top</a></h3>
    <p class="tile__price"><strong>₹799</strong> <s>₹999</s></p>
    <div class="tile__dots" aria-label="Available in 3 colors">
      <span style="--c:#FF99CC"></span><span style="--c:#5CC9B3"></span><span style="--c:#000"></span>
    </div>
  </div>
</article>
```

```css
.grid { display:grid; gap:28px 16px; grid-template-columns:repeat(2,1fr); }
@media (min-width:768px)  { .grid { grid-template-columns:repeat(3,1fr); } }
@media (min-width:1100px) { .grid { grid-template-columns:repeat(4,1fr); gap:40px 20px; } }

.tile { position:relative; }
.tile__media { position:relative; display:block; aspect-ratio:4/5; border-radius:18px; overflow:hidden; background:var(--pink-wash); }
.tile__img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; transition:opacity .25s ease, transform .4s ease; }
.tile__img--alt { opacity:0; }
.tile:hover .tile__img--alt { opacity:1; }
.tile:hover .tile__img { transform:scale(1.03); }

.tile__heart { position:absolute; top:10px; right:10px; width:38px; height:38px; border-radius:50%; border:0;
  background:rgba(250,245,240,.92); font-size:18px; cursor:pointer; }
.tile__add { position:absolute; left:10px; right:10px; bottom:calc(var(--body-h, 84px) + 10px);
  padding:.7em 1em; border-radius:999px; border:2px solid var(--jet-black); background:var(--cotton-candy);
  font:500 .9rem var(--font-primary); cursor:pointer; opacity:0; transform:translateY(8px); transition:.2s; }
.tile:hover .tile__add, .tile__add:focus-visible { opacity:1; transform:none; }
@media (hover:none) { .tile__add { opacity:1; transform:none; width:auto; left:auto; right:10px; bottom:auto; top:56px; padding:.5em .8em; } }

.tile__body { padding:12px 2px 0; }
.tile__title { font:500 1rem/1.3 var(--font-primary); margin:0 0 4px; }
.tile__title a { color:inherit; text-decoration:none; }
.tile__price { margin:0; font-size:.95rem; }
.tile__price s { color:#6b6b6b; margin-left:6px; }
.tile__dots { display:flex; gap:6px; margin-top:8px; }
.tile__dots span { width:14px; height:14px; border-radius:50%; background:var(--c); border:1px solid rgba(0,0,0,.25); }

.badge { position:absolute; top:10px; left:10px; padding:.3em .7em; border-radius:999px; font:600 .72rem var(--font-primary);
  letter-spacing:.08em; text-transform:uppercase; background:var(--jet-black); color:var(--chalk-white); }
.badge--new { background:var(--mint); color:var(--jet-black); }
.badge--low { background:var(--danger); color:#fff; }

.tile--soldout .tile__media { opacity:.55; }
```

### 5.2 Rhythm (feature) tile inside the grid

```css
.tile--feature { grid-column: span 2; }
.tile--feature .tile__media { aspect-ratio: 8/5; }
.tile--quote { grid-column: span 2; display:flex; align-items:center; padding:32px; border-radius:18px;
  background:var(--cotton-candy); }
.tile--quote p { font:400 clamp(1.5rem,3vw,2.4rem)/1.1 var(--font-display); margin:0; }
```

### 5.3 Toolbar, chips and applied filters

```html
<div class="toolbar">
  <button class="btn-filter">Filter <span class="count">2</span></button>
  <div class="chips" role="group" aria-label="Quick filters">
    <button class="chip" aria-pressed="true">In stock</button>
    <button class="chip" aria-pressed="false">New</button>
    <button class="chip" aria-pressed="false">Under ₹999</button>
    <button class="chip" aria-pressed="false">Gift ideas</button>
  </div>
  <label class="sort">Sort: <select><option>Featured</option><option>New arrivals</option>
    <option>Best selling</option><option>Price: low to high</option><option>Price: high to low</option></select></label>
</div>
<div class="applied"><span>42 items</span> <button class="chip chip--x">Pink ✕</button> <button class="link">Clear all</button></div>
```

```css
.toolbar { position:sticky; top:var(--header-h,64px); z-index:20; display:flex; align-items:center; gap:12px;
  padding:10px 16px; background:rgba(250,245,240,.94); backdrop-filter:blur(8px); border-bottom:1px solid var(--line); }
.chips { display:flex; gap:8px; overflow-x:auto; scrollbar-width:none; flex:1; }
.chip { white-space:nowrap; padding:.5em 1em; border-radius:999px; border:1.5px solid var(--jet-black);
  background:transparent; font:500 .9rem var(--font-primary); cursor:pointer; }
.chip[aria-pressed="true"] { background:var(--pink-wash); }
.btn-filter { padding:.55em 1.1em; border-radius:999px; border:2px solid var(--jet-black); background:var(--cotton-candy); font:500 .95rem var(--font-primary); }
.btn-filter .count { margin-left:6px; background:var(--jet-black); color:var(--chalk-white); border-radius:999px; padding:0 .5em; font-size:.8rem; }
```

### 5.4 Filter drawer / bottom sheet

```css
.drawer { position:fixed; inset:0 0 0 auto; width:min(420px,100%); background:var(--chalk-white); z-index:60;
  transform:translateX(100%); transition:transform .3s ease; display:flex; flex-direction:column; }
.drawer[open], .drawer.is-open { transform:none; }
@media (max-width:767px) {
  .drawer { inset:auto 0 0 0; width:100%; height:85dvh; border-radius:24px 24px 0 0; transform:translateY(100%); }
}
.drawer__body { overflow:auto; padding:8px 20px; flex:1; }
.drawer__foot { display:flex; gap:12px; padding:14px 20px calc(14px + env(safe-area-inset-bottom)); border-top:1px solid var(--line); background:#fff; }
.drawer__foot .btn-primary { flex:1; }
.fgroup summary { font:500 1rem var(--font-primary); padding:16px 0; cursor:pointer; list-style:none; display:flex; justify-content:space-between; }
.fgroup { border-bottom:1px solid var(--line); }
```

### 5.5 Color swatches filter

```css
.swatches { display:flex; flex-wrap:wrap; gap:10px; padding-bottom:16px; }
.swatch { width:36px; height:36px; border-radius:50%; background:var(--c); border:1px solid rgba(0,0,0,.25); cursor:pointer; position:relative; }
.swatch[aria-pressed="true"]::after { content:"✓"; position:absolute; inset:0; display:grid; place-items:center; color:#000; font-weight:700; }
.swatch[aria-pressed="true"] { outline:3px solid var(--cotton-candy); outline-offset:2px; }
```

### 5.6 Search overlay (structure)

```html
<div class="search" role="dialog" aria-label="Search">
  <form role="search"><input type="search" placeholder="Search tops, bags, gifts, pink…" autocomplete="off"></form>
  <section class="search__empty">
    <h4 class="eyebrow">Recent</h4>      <div class="chips">…</div>
    <h4 class="eyebrow">Popular</h4>     <div class="chips">…</div>
    <h4 class="eyebrow">Shop by color</h4><div class="swatches">…</div>
    <h4 class="eyebrow">Recommended</h4> <div class="search__tiles">…</div>
  </section>
  <section class="search__live" hidden>
    <ul class="search__suggest">…</ul>
    <ul class="search__products">…</ul>
    <a class="link" href="/search?q=">See all results →</a>
  </section>
</div>
```

```css
.search { position:fixed; inset:0; background:var(--chalk-white); z-index:70; padding:20px; overflow:auto; }
@media (min-width:900px) { .search { inset:0 0 auto 0; max-height:80vh; padding:32px max(24px, calc((100vw - 1100px)/2)); box-shadow:0 20px 40px rgba(0,0,0,.15); } }
.search input { width:100%; font:400 1.5rem var(--font-display); padding:.6em 0; border:0; border-bottom:2px solid var(--jet-black); background:transparent; }
.search input:focus { outline:none; border-color:var(--cotton-candy); }
```

### 5.7 Load more with progress

```html
<div class="more">
  <p>Showing <b>24</b> of <b>86</b></p>
  <div class="bar"><i style="width:28%"></i></div>
  <button class="btn btn-secondary">Load more</button>
</div>
```

```css
.more { text-align:center; padding:48px 0; }
.bar { width:200px; height:4px; margin:10px auto 20px; background:var(--line); border-radius:4px; overflow:hidden; }
.bar i { display:block; height:100%; background:var(--cotton-candy); }
```

---

## 6. Brand-voice microcopy (use or adapt)

| Place | Copy |
|---|---|
| Search placeholder | "Search tops, bags, gifts, pink…" |
| No results | "Nothing here matches. Even our yarn is confused." |
| Empty wishlist | "Nothing saved yet. Go on, fall in love." |
| Sold out button | "Notify me when it's back" |
| Low stock | "Only 2 left, stitched in small batches" |
| Load more | "Show me more" |
| Cart progress | "₹250 away from free shipping" |
| Filter button | "Filter & sort" |
| Quick add | "+ Quick add" |

---

## 7. Implementation notes

- **Shopify stores** (both reference sites are Shopify): use the free **Shopify Search & Discovery** app for filters (color swatches, price, availability), synonyms, and predictive search. Modern themes (Dawn-based) support the "chips + drawer" pattern with small tweaks. Product naming and images matter more than any plugin.
- **Not on Shopify** (custom/React/WordPress/Wix): the same patterns apply; keep filter state in the URL query string and fetch results with the existing product API. If the catalog is small, client-side filtering is fine. For larger catalogs, use a search service (e.g. Algolia, Typesense, Meilisearch).
- **Data you need per product:** short name, category, color(s) as swatch values, size options, price + MRP, stock status, tags (occasion, material, gift-friendly), 2+ images in 4:5, created date (for "New"), sales count (for "Best selling").
- **Performance:** serve responsive images (`srcset`), lazy-load below the fold, set `width`/`height` to prevent layout shift, keep the grid CLS near zero.
- **Accessibility:** filters are real buttons/checkboxes with labels; announce result counts with `aria-live="polite"`; focus is trapped in drawers and returns to the trigger on close; visible focus rings; swatches have text labels; touch targets at least 44×44 px.
- **Analytics events to track:** `search_submit`, `search_no_results`, `filter_applied`, `sort_changed`, `load_more`, `quick_add`, `wishlist_add`, `notify_me`. The "no results" and "filter applied" data tells you what to stock and how to name things.

---

## 8. Checklist

- [ ] Add palette extension variables (mint, pink wash, line, danger)
- [ ] Update header: announcement bar, sticky nav, search, wishlist, cart
- [ ] Build mega menu with image tiles (or simple dropdown for small catalogs)
- [ ] Rebuild home page sections per 3.2
- [ ] Collection page: banner, subcategory bubbles, sticky toolbar
- [ ] New borderless product tile with hover image, badge, swatches, quick add
- [ ] Insert rhythm tiles every 8–10 products
- [ ] Filters: chips + drawer/bottom sheet; hide single-value filters; swatches; price slider; URL state
- [ ] Sort reduced to 5 options; in-stock first, sold-out last
- [ ] Search overlay: recent, popular, colors, recommended; live suggestions; no-results state
- [ ] "Load more" with progress; keep scroll position
- [ ] Sold-out "Notify me"
- [ ] Brand-voice microcopy
- [ ] Contrast, keyboard and mobile testing
- [ ] Analytics events

---

## 9. Prompt to hand to an AI coding assistant

> Using `oviyas-crochet-styling-guide.md` and `oviyas-crochet-ui-ux-update.md`, restyle my existing site and rebuild its shop experience (collection pages, filtering, sorting, search). Change only UI/UX, not products, URLs, cart or checkout logic. Implement the product tile, sticky toolbar with quick chips, filter drawer/bottom sheet (hide filters with fewer than 2 values, color swatches, price range), 5-option sort with in-stock first, search overlay with recent/popular/color shortcuts and live suggestions, and "Load more" with a progress bar. Use the CSS variables and patterns in the files, keep it accessible and mobile-first, and list every file you change.