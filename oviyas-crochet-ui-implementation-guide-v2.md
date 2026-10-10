# Oviyas Crochet – UI Implementation Guide (v2, based on the reference screens)

This version **replaces the visual parts** of `oviyas-crochet-ui-ux-update.md` (colors, fonts, layouts) with the design shown in your 7 screenshots (home sections, collection page with filters, list view, quick view, product page, footer). The brand-book file (`oviyas-crochet-styling-guide.md`) is still useful for logo rules and brand voice.

> **Instruction for the implementer (developer or AI assistant):** change UI only. Keep existing products, data, URLs, cart and checkout working. Rebuild the look of each screen as described below, using the tokens in section 2.

---

## 0. Read this first

**What I did:** studied the screenshots and wrote down their layout, spacing, type and color system so you can rebuild the same *style* on Oviyas Crochet.

**Values are estimates.** I can only judge by eye from screenshots. The mint `#5CC9B3` is the one color I could confirm (it's the site's declared theme color). Everything else (ice blue, navy, orange) is an eyeballed approximation. Sample the real colors with a browser color picker or DevTools before finalizing. Fonts below are my best identification: headings look like **Montserrat**, body looks like **Nunito**. Both are free on Google Fonts. Confirm in DevTools (Computed → font-family) if you want certainty.

**Use their style, not their assets.** Reuse the layout patterns, spacing and color approach. Do **not** copy their logo, product photos, product names, page text, "Magic member" badge, "Hobby Store" branding, or the Judge.me review badges. Use Oviyas Crochet's own logo, photos and copy, and your own review badges only if you actually use that service.

**Brand conflict to decide.** This theme uses Montserrat/Nunito and mint/ice-blue, which differs from your brand book (DM Sans/DM Serif Display, pink/black). I've made every color and font a variable (section 2), so you can switch the whole site by editing one block. A suggested middle path: keep this UI system, but keep the **Oviyas logo** and use **Cotton Candy pink** as a small accent (wishlist heart, "New" badge, hover tint, hero highlight). Your call.

**Accessibility flag:** white text on this mint is only about 2:1 contrast, below the 4.5:1 guideline. The screenshots use white bold text on mint buttons. I've set `--btn-text` to white to match, with a one-line switch to navy (about 6:1) if you want to pass accessibility checks. Likewise the orange price text on white is low contrast; keep it large and bold, or use the darker option provided.

---

## 1. Design summary (what the screens show)

| Area | Observed style |
|---|---|
| Overall feel | Light, airy, friendly. White page, pale ice-blue bands, mint accents, soft rounded corners |
| Top strip | Slim ice-blue bar with social icons and follower count, left-aligned |
| Header | Logo left, small uppercase nav centered with chevrons, loyalty pill + 4 outline icons (search, account, wishlist, cart) on the right |
| Page titles | Large, centered, medium-weight Montserrat in dark navy, followed by a short centered paragraph in Nunito |
| Collection layout | Left filter sidebar (~300px), right toolbar + product grid; sort at left of toolbar, **view switcher (list / 2 / 3 / 4 / 5 columns) at right**; 5 columns shown by default on desktop |
| Product card | Square image with thin border and ~14px radius; light-gray title (2 lines); price in orange with "MRP" and a struck-through amount; gold stars + review count when present |
| List view | Image left, then title, price, 1-line excerpt, mint pill button (**Quick Add** or **Select options**), circle heart button, circle eye (quick view) button |
| Quick view | Centered white modal, square corners, image left / details right, cream info chips, option pills, quantity stepper, mint **Add to cart** pill |
| Product page | Big rounded image + 3 thumbnails; title, orange price + MRP + orange "SAVE 22%" pill, "GST Included", cream chips, pincode box, option pills, stepper + Add to cart, tabs (More Details / Shipping & Return) |
| Home sections | Alternating white and ice-blue bands; category cards with circular photos; split sections with overlapping photo collages and white pill buttons; staggered collection tiles with white pill labels |
| Footer | Ice-blue, 4 link columns separated by thin vertical lines, small outline bullets, round mint social icons, centered copyright, payment icons right |

---

## 2. Design tokens (copy this first)

```css
:root {
  /* Color */
  --mint:        #5CC9B3;   /* primary: buttons, active states, icons, tab underline (confirmed theme color) */
  --mint-hover:  #49B8A1;   /* button hover (estimate) */
  --ice:         #EEF6FC;   /* top strip, bands, footer, input boxes (estimate) */
  --ice-mint:    #EEF7F8;   /* alternate pale band (estimate) */
  --ink:         #1F3347;   /* headings, nav, icons (navy, estimate) */
  --text:        #2D3B4A;   /* body text (estimate) */
  --text-muted:  #5B6670;   /* product titles in grid, secondary text */
  --price:       #E59A2F;   /* sale price + SAVE badge (orange, estimate) */
  --price-text:  #A66200;   /* darker option for small price text (≈4.8:1 on white) */
  --cream:       #F3EBD9;   /* info chips (estimate) */
  --star:        #F5B800;   /* rating stars */
  --line:        #E3EAF0;   /* hairline borders on white */
  --white:       #FFFFFF;
  --overlay:     rgba(0,0,0,.35);

  /* Optional Oviyas brand accent (from brand book) */
  --brand-pink:  #FF99CC;

  /* Button text. White matches the screenshots; switch to var(--ink) for accessibility */
  --btn-text:    #FFFFFF;

  /* Type */
  --font-heading: 'Montserrat', system-ui, -apple-system, 'Segoe UI', Arial, sans-serif;
  --font-body:    'Nunito', system-ui, -apple-system, 'Segoe UI', Arial, sans-serif;

  /* Shape */
  --radius-card: 14px;
  --radius-img:  16px;
  --radius-btn:  999px;
  --radius-sm:   6px;

  /* Layout */
  --container:   1200px;
  --gutter:      24px;
}
```

**Color roles**

| Role | Token |
|---|---|
| Page background | `--white` |
| Pale sections, top strip, footer | `--ice` |
| Primary buttons, selected options, active view-switcher icon, tab underline, location pin | `--mint` |
| Headings, nav, icons | `--ink` |
| Price, SAVE badge | `--price` |
| Chips (material, size, "handmade in…") | `--cream` |
| Borders | `--line` |

---

## 3. Typography

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
```

```css
body {
  font-family: var(--font-body);
  font-size: 15px;
  line-height: 1.6;
  color: var(--text);
  background: var(--white);
}
h1, h2, h3, h4, .page-title, .filters__title {
  font-family: var(--font-heading);
  color: var(--ink);
  font-weight: 500;
  line-height: 1.2;
}
h1, .page-title { font-size: clamp(2rem, 4.2vw, 3rem); text-align: center; }
h2 { font-size: clamp(1.6rem, 3vw, 2.25rem); }
h3 { font-size: 1.25rem; }
.filters__title { font-weight: 400; font-size: 1.75rem; }      /* "Filters" is large and light */
.page-intro { max-width: 760px; margin: 12px auto 40px; text-align: center; font-size: .95rem; }
.nav a, .eyebrow { font-family: var(--font-body); font-size: .875rem; text-transform: uppercase; letter-spacing: .03em; }
.small { font-size: .8rem; }
```

Rules: headings in Montserrat (medium weight), everything else in Nunito. Buttons use Nunito bold. Replace the site's old fonts everywhere, including inputs and buttons.

---

## 4. Shared components

### Buttons

```css
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: .5em;
  font: 700 .95rem var(--font-body);
  padding: .75em 1.6em; border-radius: var(--radius-btn);
  border: 0; cursor: pointer; transition: background .15s ease, transform .15s ease;
}
.btn--primary { background: var(--mint); color: var(--btn-text); }
.btn--primary:hover { background: var(--mint-hover); }
.btn--white   { background: var(--white); color: var(--ink); font-size: .8rem; padding: .6em 1.3em; }   /* "View All", "Explore Kits", "View Calendar" */
.btn--white:hover { background: var(--mint); color: var(--btn-text); }
.btn:focus-visible { outline: 3px solid var(--ink); outline-offset: 3px; }

/* Round outline icon buttons (heart, eye) */
.icon-btn {
  width: 40px; height: 40px; border-radius: 50%;
  border: 1px solid var(--line); background: var(--white); color: var(--ink);
  display: inline-grid; place-items: center; cursor: pointer;
}
.icon-btn:hover { border-color: var(--mint); color: var(--mint); }
```

### Option pills (color/size) and info chips

```css
.option { padding: .55em 1em; border: 1px solid var(--line); border-radius: var(--radius-sm); background: var(--white);
  font: 600 .9rem var(--font-body); cursor: pointer; }
.option[aria-pressed="true"], .option.is-selected { background: var(--mint); color: var(--btn-text); border-color: var(--mint); }

.chip-info { display: inline-flex; align-items: center; gap: .4em; padding: .55em 1em; border-radius: 999px;
  background: var(--cream); font: 700 .75rem var(--font-body); color: var(--ink); }
```

### Quantity stepper

```css
.qty { display: inline-flex; align-items: center; border: 1px solid var(--line); border-radius: var(--radius-sm); }
.qty button { width: 40px; height: 44px; background: none; border: 0; font-size: 1.1rem; cursor: pointer; color: var(--text-muted); }
.qty input { width: 48px; text-align: center; border: 0; font: 600 1rem var(--font-body); }
```

### Checkbox (filters)

```css
.check { display: flex; align-items: center; gap: 12px; padding: 8px 0; cursor: pointer; font-size: .95rem; }
.check input { appearance: none; width: 18px; height: 18px; border: 1.5px solid #C9D3DB; border-radius: 3px; background: var(--white); }
.check input:checked { background: var(--mint); border-color: var(--mint);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M3 8.5l3.2 3L13 5' fill='none' stroke='white' stroke-width='2'/%3E%3C/svg%3E"); }
```

### Badges

```css
.badge-save { display: inline-block; background: var(--price); color: #fff; font: 700 .7rem var(--font-body);
  text-transform: uppercase; padding: .3em .8em; border-radius: 999px; }
```

### Containers and bands

```css
.container { max-width: var(--container); margin-inline: auto; padding-inline: var(--gutter); }
.band { padding-block: 64px; }
.band--ice { background: var(--ice); }
.band--ice-mint { background: var(--ice-mint); }
```

---

## 5. Header

**Structure**

```
[ Top strip (ice): social icons · "135K Followers"-style text ]
[ Header: logo | uppercase nav with chevrons (centered) | loyalty pill (optional) · search · account · wishlist · cart ]
```

```html
<div class="topbar"><div class="container">
  <a aria-label="Facebook">…</a>
  <a aria-label="Instagram">… <span>Followers count</span></a>
  <a aria-label="YouTube">…</a>
  <a aria-label="WhatsApp">…</a>
</div></div>

<header class="site-header"><div class="container header__row">
  <a class="logo" href="/"><img src="oviyas-logo.svg" alt="Oviyas Crochet" width="160"></a>
  <nav class="nav" aria-label="Main">
    <ul>
      <li><a href="#">What's New <svg class="chev"/></a></li>
      <li><a href="#">Shop <svg class="chev"/></a></li>
      <li><a href="#">Wear <svg class="chev"/></a></li>
      <li><a href="#">Home <svg class="chev"/></a></li>
      <li><a href="#">Learn &amp; Inspire <svg class="chev"/></a></li>
      <li><a href="#">Contact</a></li>
    </ul>
  </nav>
  <div class="header__actions">
    <a class="pill-dark" href="#">Oviyas Club</a>   <!-- optional loyalty pill -->
    <button aria-label="Search">…</button>
    <a aria-label="Account">…</a>
    <a aria-label="Wishlist">…</a>
    <a aria-label="Cart">…<span class="cart-count">0</span></a>
  </div>
</div></header>
```

```css
.topbar { background: var(--ice); font-size: .85rem; color: var(--ink); }
.topbar .container { display: flex; align-items: center; gap: 22px; height: 40px; }
.topbar svg { width: 18px; height: 18px; fill: var(--ink); }

.site-header { background: var(--white); position: sticky; top: 0; z-index: 50; }
.header__row { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 24px; height: 76px; }
.nav ul { display: flex; justify-content: center; gap: 28px; margin: 0; padding: 0; list-style: none; }
.nav a { color: var(--ink); text-decoration: none; display: inline-flex; align-items: center; gap: 4px; }
.nav a:hover { color: var(--mint); }
.header__actions { display: flex; align-items: center; gap: 18px; }
.header__actions svg { width: 22px; height: 22px; stroke: var(--ink); fill: none; stroke-width: 1.8; }
.pill-dark { background: var(--ink); color: #fff; border-radius: 999px; padding: .5em 1em; font: 700 .75rem var(--font-body); text-decoration: none; }
.cart-count { margin-left: 2px; font-size: .7rem; }
```

Dropdown/mega menu: white panel under the nav, 3–4 link columns, optional 1–2 image tiles with rounded corners and a name below; open on hover (desktop) and tap (mobile). Mobile: hamburger → full-height drawer, accordion sections, search field at top.

---

## 6. Collection page (the main shopping screen)

### 6.1 Layout

```
[ Page title (centered) ]
[ Intro paragraph (centered, max 760px) ]
[ Two columns: ]
   Left (300px): "Filters" title + accordion groups with checkboxes and counts
   Right:        Toolbar [ Sort ▾ ………………… view switcher ]  then the product grid
```

```html
<h1 class="page-title">Crochet Flowers Collection</h1>
<p class="page-intro">Short, warm description of the collection…</p>

<div class="container shop">
  <aside class="filters">
    <h2 class="filters__title">Filters</h2>
    <details class="fgroup" open>
      <summary>Product Type</summary>
      <label class="check"><input type="checkbox"> Flowers – Bouquet (3)</label>
      <!-- … -->
    </details>
  </aside>

  <section class="results">
    <div class="toolbar">
      <label class="sort"><select><option>Date, new to old</option>…</select></label>
      <div class="view-switch" role="group" aria-label="Grid size">
        <button data-cols="1" aria-label="List"></button>
        <button data-cols="2" aria-label="2 columns"></button>
        <button data-cols="3" aria-label="3 columns"></button>
        <button data-cols="4" aria-label="4 columns"></button>
        <button data-cols="5" aria-label="5 columns" aria-pressed="true"></button>
      </div>
    </div>
    <div class="grid" data-cols="5"> … cards … </div>
  </section>
</div>
```

```css
.shop { display: grid; grid-template-columns: 300px 1fr; gap: 48px; align-items: start; }

/* Filters */
.fgroup { border: 0; }
.fgroup summary { list-style: none; display: flex; justify-content: space-between; align-items: center;
  font: 600 1rem var(--font-body); color: var(--ink); padding: 18px 0; cursor: pointer; }
.fgroup summary::after { content: ""; width: 10px; height: 10px; border-right: 2px solid var(--ink); border-top: 2px solid var(--ink);
  transform: rotate(-45deg); transition: transform .2s; }
.fgroup:not([open]) summary::after { transform: rotate(135deg); }

/* Toolbar */
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.sort select { border: 0; background: none; font: 400 .95rem var(--font-body); color: var(--ink); cursor: pointer; }
.view-switch { display: flex; gap: 8px; }
.view-switch button { width: 36px; height: 36px; border: 0; border-radius: var(--radius-sm); background: #EEF1F4; cursor: pointer;
  background-repeat: no-repeat; background-position: center; }   /* use column-bar icons */
.view-switch button[aria-pressed="true"] { background-color: var(--mint); }

/* Grid */
.grid { display: grid; gap: 32px 20px; }
.grid[data-cols="1"] { grid-template-columns: 1fr; }
.grid[data-cols="2"] { grid-template-columns: repeat(2, 1fr); }
.grid[data-cols="3"] { grid-template-columns: repeat(3, 1fr); }
.grid[data-cols="4"] { grid-template-columns: repeat(4, 1fr); }
.grid[data-cols="5"] { grid-template-columns: repeat(5, 1fr); }

@media (max-width: 1100px) { .grid[data-cols="5"] { grid-template-columns: repeat(4, 1fr); } .shop { gap: 32px; grid-template-columns: 240px 1fr; } }
@media (max-width: 900px)  { .grid[data-cols="4"], .grid[data-cols="5"] { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 767px)  { .shop { grid-template-columns: 1fr; } .grid { grid-template-columns: repeat(2, 1fr) !important; gap: 24px 12px; } .view-switch { display: none; } }
```

### 6.2 Grid card (default)

```html
<article class="card">
  <a class="card__media" href="/products/daisy-in-a-pot"><img src="…" alt="Daisy in a Pot crochet flower" loading="lazy" width="600" height="600"></a>
  <h3 class="card__title"><a href="/products/daisy-in-a-pot">Daisy in a Pot – Handcrafted Crochet Flowers</a></h3>
  <div class="stars" aria-label="4 out of 5">★★★★☆ <span>1 review</span></div>   <!-- only if reviews exist -->
  <p class="price"><span class="price__now">₹350</span> <span class="price__mrp">MRP <s>₹450</s></span></p>

  <!-- list view only -->
  <p class="card__excerpt">Short description…</p>
  <div class="card__actions">
    <button class="btn btn--primary">Quick Add</button>
    <button class="icon-btn" aria-label="Add to wishlist">♡</button>
    <button class="icon-btn" aria-label="Quick view">👁</button>
  </div>
</article>
```

```css
.card__media { display: block; aspect-ratio: 1 / 1; border: 1px solid var(--line); border-radius: var(--radius-card); overflow: hidden; background: var(--ice); }
.card__media img { width: 100%; height: 100%; object-fit: cover; transition: transform .35s ease; }
.card:hover .card__media img { transform: scale(1.04); }
.card__title { font: 400 .95rem/1.45 var(--font-body); margin: 14px 0 6px; color: var(--text-muted); }
.card__title a { color: inherit; text-decoration: none; }
.card__title a:hover { color: var(--ink); }
.stars { color: var(--star); font-size: .9rem; margin-bottom: 4px; }
.stars span { color: var(--text); font-size: .85rem; margin-left: 4px; }
.price { margin: 0; font-size: .9rem; }
.price__now { color: var(--price); font-weight: 700; font-size: 1rem; }
.price__mrp { margin-left: 6px; color: var(--ink); font-weight: 600; font-size: .85rem; }
.price__mrp s { font-weight: 700; }

/* hide list-only parts in grid */
.card__excerpt, .card__actions { display: none; }

/* List view (data-cols="1") */
.grid[data-cols="1"] .card { display: grid; grid-template-columns: 270px 1fr; column-gap: 28px; align-items: start; }
.grid[data-cols="1"] .card__media { grid-row: 1 / span 5; }
.grid[data-cols="1"] .card__title { margin-top: 0; font-size: 1rem; color: var(--ink); }
.grid[data-cols="1"] .card__excerpt { display: block; margin: 14px 0; }
.grid[data-cols="1"] .card__actions { display: flex; gap: 12px; align-items: center; }
```

Button label logic: show **Quick Add** when the product has a single variant, and **Select options** when it has options (like the Daisy in a Pot color choice). Both open/add as the screens show.

Pagination: keep numbered pagination or "Load more" under the grid, centered.

---

## 7. Quick view modal

```html
<div class="modal" role="dialog" aria-modal="true" aria-label="Quick view">
  <div class="modal__box">
    <button class="modal__close" aria-label="Close">✕</button>
    <div class="modal__media"><img src="…" alt=""></div>
    <div class="modal__info">
      <p>Product description…</p>
      <div class="chips">
        <span class="chip-info">Price per flower</span>
        <span class="chip-info">Acrylic Cotton Blend Yarn</span>
        <span class="chip-info">L 10 cm / 4" approx.</span>
        <span class="chip-info">Proudly Handmade In India</span>
      </div>
      <p class="policy">Return/exchange policy line</p>
      <p>Options: <b>Pink</b></p>
      <div class="options"><button class="option is-selected">pink</button><button class="option">yellow</button><button class="option">lilac</button></div>
      <p>Quantity</p>
      <div class="buy-row">
        <div class="qty"><button>−</button><input value="1"><button>+</button></div>
        <button class="btn btn--primary btn--wide">Add to cart</button>
      </div>
    </div>
  </div>
</div>
```

```css
.modal { position: fixed; inset: 0; background: var(--overlay); display: grid; place-items: center; z-index: 80; padding: 16px; }
.modal__box { position: relative; display: grid; grid-template-columns: 480px 1fr; gap: 28px; background: var(--white);
  width: min(960px, 100%); max-height: 90vh; overflow: auto; border-radius: 0; }   /* square corners, as in the screenshot */
.modal__media img { width: 100%; height: 100%; object-fit: cover; border-radius: 0 var(--radius-img) var(--radius-img) 0; }
.modal__info { padding: 24px 40px 24px 0; }
.modal__close { position: absolute; top: 14px; right: 16px; background: none; border: 0; font-size: 1.1rem; cursor: pointer; }
.chips { display: flex; flex-wrap: wrap; gap: 10px; margin: 18px 0; }
.options { display: flex; gap: 10px; margin: 8px 0 22px; }
.buy-row { display: flex; gap: 20px; align-items: center; }
.btn--wide { flex: 1; padding-block: .95em; }
@media (max-width: 767px) { .modal__box { grid-template-columns: 1fr; } .modal__info { padding: 0 20px 24px; } .modal__media img { border-radius: 0; } }
```

Close on `Esc` and on overlay click. Trap focus inside while open.

---

## 8. Product page

**Layout:** two columns. Left: large square image (rounded) + 3–5 thumbnails below. Right: title, price, details, options, buy row.

```
[ Image 1 (big, rounded 16px) ]     [ Title (Montserrat 500, ~32px)                 ♡ ]
[ thumb ][ thumb ][ thumb ]          [ ₹350  MRP ₹450  (SAVE 22%) ]
                                     [ GST Included ]
                                     [ Short description ]
                                     [ cream chips ]
                                     [ policy line ]                  [SKU, right, gray small]
                                     [ Pincode box:  📍 400083            Edit ]
                                     [ Options: Pink ]
                                     [ pink ][ yellow ][ lilac ]
                                     [ Quantity ]
                                     [ − 1 + ]  [ Add to cart ]
[ Tabs:  More Details | Shipping & Return ]
[ Tab content: paragraphs, "Key Features:" list … ]
```

```css
.pdp { display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 1.2fr); gap: 48px; padding-block: 32px; }
.pdp__main { aspect-ratio: 1/1; border-radius: var(--radius-img); overflow: hidden; border: 1px solid var(--line); }
.pdp__main img { width: 100%; height: 100%; object-fit: cover; }
.pdp__thumbs { display: flex; gap: 14px; margin-top: 16px; }
.pdp__thumbs button { width: 120px; aspect-ratio: 1/1; border-radius: 12px; overflow: hidden; border: 2px solid transparent; padding: 0; background: none; }
.pdp__thumbs button[aria-current="true"] { border-color: var(--mint); }

.pdp__head { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
.pdp__title { font: 500 clamp(1.5rem, 2.6vw, 2rem)/1.25 var(--font-heading); color: var(--ink); margin: 0; }
.pdp__price { display: flex; align-items: center; gap: 10px; margin: 14px 0 2px; }
.pdp__price .now { font: 700 1.6rem var(--font-body); color: var(--price); }
.pdp__price .mrp { color: var(--ink); }
.pdp__gst { font-size: .85rem; margin-bottom: 18px; }
.pdp__sku { text-align: right; font-size: .75rem; color: #9AA5AF; }

/* Pincode / delivery check box */
.pincode { display: flex; align-items: center; gap: 12px; width: min(350px, 100%); padding: 18px 20px;
  background: var(--ice); border: 1px solid var(--line); border-radius: 8px; }
.pincode svg { color: var(--mint); }
.pincode button { margin-left: auto; background: none; border: 0; color: var(--ink); font-weight: 600; cursor: pointer; }

/* Tabs */
.tabs { display: flex; gap: 28px; border-bottom: 1px solid var(--line); margin-top: 48px; }
.tabs button { background: none; border: 0; padding: 14px 0; font: 600 1rem var(--font-body); color: #8A96A1; cursor: pointer; }
.tabs button[aria-selected="true"] { color: var(--ink); border-bottom: 3px solid var(--mint); margin-bottom: -1px; }

@media (max-width: 900px) { .pdp { grid-template-columns: 1fr; } }
```

Mobile: image slider (swipe) with dots; sticky bottom bar with price + **Add to cart**.

---

## 9. Home page sections (from the home screenshots)

### 9.1 Category cards row ("Hooks and Needles" style)
Centered section title, a white **View All** pill under it, then a horizontally scrolling row of white cards. Each card: category name on top (small, centered), big circular photo below.

```css
.band--ice-mint .section-head { text-align: center; margin-bottom: 24px; }
.cat-row { display: flex; gap: 8px; overflow-x: auto; scroll-snap-type: x mandatory; padding-bottom: 8px; scrollbar-width: none; }
.cat-card { flex: 0 0 calc((100% - 40px) / 6); min-width: 200px; scroll-snap-align: start;
  background: var(--white); border: 1px solid var(--line); border-radius: 10px; padding: 20px 16px 16px; text-align: center; text-decoration: none; color: var(--ink); }
.cat-card span { display: block; font-size: .85rem; margin-bottom: 14px; }
.cat-card img { width: 100%; aspect-ratio: 1/1; border-radius: 50%; object-fit: cover; background: #EEF1F4; }
.cat-card:hover { border-color: var(--mint); }
```

### 9.2 Split section with photo collage ("Crochet & Knitting Kits", "Learn Crochet & Knitting")
Ice-blue band. Left: heading, short paragraph, white pill button. Right: two photos, one larger behind and one smaller overlapping at the lower-left, both with rounded corners.

```html
<section class="band band--ice">
  <div class="container split">
    <div class="split__text">
      <h2>Crochet Kits</h2>
      <p>Short description…</p>
      <a class="btn btn--white" href="#">Explore Kits</a>
    </div>
    <div class="collage">
      <img class="collage__back"  src="…" alt="">
      <img class="collage__front" src="…" alt="">
    </div>
  </div>
</section>
```

```css
.split { display: grid; grid-template-columns: 1fr 1.2fr; align-items: center; gap: 48px; }
.split__text { max-width: 320px; margin-left: auto; }
.split__text p { font-size: .8rem; }
.collage { position: relative; min-height: 420px; }
.collage__back  { position: absolute; right: 0; top: 0; width: 70%; aspect-ratio: 1/1; object-fit: cover; border-radius: var(--radius-img); }
.collage__front { position: absolute; left: 0; bottom: 20px; width: 42%; aspect-ratio: 1/1; object-fit: cover; border-radius: var(--radius-img); z-index: 1; }
.split--reverse .split__text { order: 2; margin-left: 0; margin-right: auto; }
@media (max-width: 767px) { .split { grid-template-columns: 1fr; } .split__text { margin: 0; } .collage { min-height: 320px; } }
```

### 9.3 Staggered collection tiles ("Tops", "Sweaters & Cardigans")
Two columns of tall, rounded photo tiles with a **white pill label** at bottom-left. The second column is offset downward for a staggered look. Used between the split bands (alternate: tiles → band → tiles → band).

```css
.tiles { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; max-width: 900px; margin: 0 auto; padding-block: 48px; }
.tiles > :nth-child(even) { margin-top: 64px; }
.tile { position: relative; display: block; border-radius: var(--radius-img); overflow: hidden; aspect-ratio: 4/5; background: #EEF1F4; }
.tile img { width: 100%; height: 100%; object-fit: cover; }
.tile__label { position: absolute; left: 16px; bottom: 16px; background: var(--white); color: var(--ink);
  font: 700 .75rem var(--font-body); padding: .55em 1.1em; border-radius: 999px; }
@media (max-width: 767px) { .tiles { grid-template-columns: 1fr 1fr; gap: 12px; } .tiles > :nth-child(even) { margin-top: 32px; } }
```

### 9.4 Suggested home order (matches the screens, adapted to Oviyas)
1. Top strip + header
2. Hero banner (your own image + CTA)
3. Shortcut tiles (4 main categories)
4. Product rows by category (new in, bestsellers) with "View All" pill
5. Category cards row (circle photos)
6. Split band: kits or custom orders
7. Staggered tiles: Tops / Sweaters / Bags etc.
8. Split band: workshops, story or "made for you"
9. More staggered tiles (accessories)
10. Reviews strip (only your real review numbers)
11. Footer

---

## 10. Footer

Ice-blue background. Above it, a centered row for review badges/ratings (use your real review service or a simple "★★★★★ 4.9 from X reviews"). Then **four columns** separated by thin vertical lines. Each column has bold group headings with link lists, using small outline bullets. Bottom row: round mint social icons (left), copyright centered, payment icons (right).

```css
.footer { background: var(--ice); color: var(--ink); }
.footer__cols { display: grid; grid-template-columns: repeat(4, 1fr); }
.footer__col { padding: 56px 28px; border-left: 1px solid #DCE6EE; }
.footer__col:first-child { border-left: 0; }
.footer__col h4 { font: 700 .9rem var(--font-body); margin: 20px 0 8px; color: var(--ink); }
.footer__col h4:first-child { margin-top: 0; }
.footer__col ul { list-style: none; margin: 0; padding: 0; }
.footer__col a { display: flex; align-items: center; gap: 12px; padding: 6px 0; color: var(--ink); text-decoration: none; font-size: .95rem; }
.footer__col a::before { content: ""; width: 9px; height: 9px; border: 1.5px solid var(--mint); border-radius: 3px; transform: rotate(45deg) scale(.85); flex: none; opacity: .8; }
.footer__col a:hover { color: var(--mint-hover); }

.footer__bar { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 24px;
  padding: 24px var(--gutter); border-top: 1px solid #DCE6EE; font-size: .8rem; text-align: center; }
.social { display: flex; gap: 12px; }
.social a { width: 34px; height: 34px; border-radius: 50%; background: var(--mint); display: grid; place-items: center; }
.social svg { width: 18px; height: 18px; fill: #fff; }
.pay { display: flex; gap: 8px; align-items: center; }

@media (max-width: 900px) { .footer__cols { grid-template-columns: 1fr 1fr; } .footer__col:nth-child(3) { border-left: 0; } }
@media (max-width: 600px) { .footer__cols { grid-template-columns: 1fr; } .footer__col { border-left: 0; border-top: 1px solid #DCE6EE; padding: 28px 20px; } .footer__bar { grid-template-columns: 1fr; justify-items: center; } }
```

Suggested footer groups for Oviyas (adjust to your real categories): **Shop** (Tops, Bags, Scarves, Hair accessories, Flowers, Home décor) · **Gifts & Custom** (Gift ideas, Custom orders, Gift cards) · **Learn** (Care guide, Blog, Workshops) · **Company & Support** (Our story, Contact, FAQ, Shipping, Returns, Terms, Privacy).

---

## 11. Responsive behavior summary

| Screen | Desktop | Tablet | Mobile |
|---|---|---|---|
| Header | Full nav | Full nav, tighter gaps | Hamburger drawer, icons only |
| Collection | Sidebar filters + 5-col grid (switcher visible) | 240px sidebar + 3–4 cols | **Filters in a bottom sheet**, 2 columns, no switcher |
| Quick view | Two-column modal | Two-column | Single column, full width |
| Product page | Two columns | Two columns | One column, swipe gallery, sticky Add to cart |
| Home bands | Text + collage side by side | Same | Stacked |
| Footer | 4 columns | 2 columns | 1 column accordion or stacked |

---

## 12. Optional upgrades I recommend on top of the reference design

These fix issues I saw on the reference pages while keeping the same look:

- **Hide filter groups that only have one value** (a filter with a single option is useless).
- **Add a "Color" filter with swatches** (the reference only lists Product Type here). Most handmade items are chosen by color.
- **Add a "Price" range filter and an "In stock only" toggle** (default on).
- **Show active filters as removable chips** above the grid, plus "Clear all", and a live result count.
- **Put sold-out items last**, with a "Notify me" button.
- **Search overlay** with popular searches, recent searches and live product suggestions.
- **Mobile filters** as a bottom sheet with a sticky "Show N items" button.
- **Filter and sort state in the URL** so pages are shareable and the Back button works.

(Details and code for these are in `oviyas-crochet-ui-ux-update.md`, sections 4.4 to 4.8; reuse the logic and restyle with the tokens above.)

---

## 13. Implementation checklist

- [ ] Add Google Fonts (Montserrat + Nunito); remove old font imports
- [ ] Paste the token block (section 2); sample real colors and adjust estimates
- [ ] Decide: white vs navy text on mint buttons (`--btn-text`)
- [ ] Build top strip + header + nav + dropdowns
- [ ] Collection page: title, intro, sidebar filters, sort, view switcher (list/2/3/4/5), grid, list view
- [ ] Product card (grid and list), star ratings, MRP/sale price
- [ ] Quick view modal (chips, option pills, stepper, Add to cart)
- [ ] Product page (gallery, price block, SAVE badge, pincode box, options, tabs)
- [ ] Home sections (category circle cards, split bands with collage, staggered tiles with pill labels)
- [ ] Footer (ice background, four ruled columns, mint social icons, payment icons)
- [ ] Replace all logos, images, copy with Oviyas Crochet's own
- [ ] Mobile pass (bottom-sheet filters, sticky Add to cart, 2-column grid)
- [ ] Contrast, keyboard and screen-reader pass

---

## 14. Prompt to hand to an AI coding assistant

> Rebuild the look of my existing site to match `oviyas-crochet-ui-implementation-guide-v2.md`. Change styling and layout only, not products, URLs, cart or checkout logic. Use the tokens in section 2, load Montserrat and Nunito, and rebuild: header with top strip, the collection page (left filter sidebar, sort, list/2/3/4/5 view switcher, 5-column grid, list view), quick view modal, product page (gallery, price block, SAVE badge, pincode box, option pills, tabs), the home sections (category circle cards, split bands with photo collage, staggered tiles with pill labels) and the footer. Use my own logo, images and text, not the reference site's. Apply the optional upgrades in section 12 where my platform supports them. List every file you changed.
