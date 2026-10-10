# Oviyas Crochet – Footer Links and Pages (FAQ, Contact, Policies)

This file gives you everything to build the **Support & Policies** links in the footer and the six pages behind them:

1. FAQ
2. Contact us
3. Terms of service
4. Privacy policy
5. Shipping policy
6. Data sharing opt-out

Plus one optional page the Terms refer to: **Returns & refunds** (section 11).

It uses the page styling from `oviyas-crochet-ui-implementation-guide-v2.md` (same tokens, fonts, buttons and inputs).

> **Instruction for the implementer (developer or AI assistant):** create these pages with the content below, replace every `[[PLACEHOLDER]]` with the real value from section 1, wire up the footer links (section 2), and style with the shared page template (section 3). Do not change unrelated pages.

---

## 0. Read this first

**How I built the content.** I read the six Magic Needles pages for their *structure and topics* (which questions to answer, which policy sections exist, which details are covered). I then **wrote new text for Oviyas Crochet in my own words** and removed things that only apply to them (yarn resale rules, memberships, retail store, franchise, their company registration numbers and address, their free-shipping amount, their country list). Their FAQ answers were collapsed on the page, so I could only see the questions; the answers here are mine.

**Fill in the blanks.** I don't know your real business facts (legal name, address, shipping times, return rules, payment methods). They appear as `[[DOUBLE_BRACKET]]` placeholders. Section 1 lists them all. Search the finished pages for `[[` before launch to make sure none are left.

**Not legal advice.** These are solid starting drafts, not reviewed by a lawyer. Have a legal or compliance professional check the Terms, Privacy Policy and Returns policy before launch, especially for:
- India's e-commerce and consumer protection rules (for example, showing seller details and a grievance officer contact)
- India's Digital Personal Data Protection Act, 2023 and its rules (check the current status and timelines)
- GST details, if you are registered

**Policy choices are yours.** Return and exchange rules, delivery times and the free-shipping limit are business decisions. I've suggested sensible defaults for a handmade shop and marked them clearly. Only publish what you will actually honor.

---

## 1. Business details to fill in

| Placeholder | What to put | Example / suggestion |
|---|---|---|
| `[[BRAND]]` | Brand name | Oviyas Crochet |
| `[[LEGAL_NAME]]` | Registered business name (or your name if a sole proprietor) | |
| `[[SITE_URL]]` | Website address | |
| `[[ADDRESS]]` | Business address | |
| `[[CITY_STATE]]` | City and state whose courts apply | |
| `[[SUPPORT_EMAIL]]` | Customer support email | |
| `[[WHATSAPP_NUMBER]]` | WhatsApp number, with country code | |
| `[[WHATSAPP_LINK]]` | `https://wa.me/<number>` | |
| `[[SUPPORT_HOURS]]` | When you reply | Mon–Sat, 10 AM – 6 PM IST |
| `[[REPLY_TIME]]` | Typical reply time | within 1 business day |
| `[[INSTAGRAM_URL]]`, `[[FACEBOOK_URL]]`, `[[YOUTUBE_URL]]` | Social links (delete what you don't use) | |
| `[[READY_TO_SHIP_DAYS]]` | Dispatch time for in-stock items | 1–3 business days |
| `[[MADE_TO_ORDER_DAYS]]` | Making time for made-to-order and custom pieces | 7–14 business days (confirm per product) |
| `[[DELIVERY_DAYS_INDIA]]` | Courier transit time after dispatch | 3–10 business days |
| `[[FREE_SHIPPING_MIN]]` | Free-shipping order value | ₹999 (or remove the offer) |
| `[[SHIPPING_FEE]]` | Flat or calculated fee below that | ₹__ per order, shown at checkout |
| `[[COURIER_PARTNERS]]` | Couriers you use | e.g. Delhivery, DTDC, India Post |
| `[[PAYMENT_METHODS]]` | What you accept | UPI, credit and debit cards, net banking, wallets |
| `[[PAYMENT_GATEWAY]]` | Provider | e.g. Razorpay / Shopify Payments |
| `[[RETURN_WINDOW]]` | Days to report problems or request returns | 7 days from delivery |
| `[[CANCEL_WINDOW]]` | How long customers can cancel or edit an order | within 12 hours of ordering, before making starts |
| `[[GRIEVANCE_OFFICER_NAME]]` | Person responsible for complaints | |
| `[[GRIEVANCE_EMAIL]]` | Their email | |
| `[[GRIEVANCE_RESPONSE_TIME]]` | Acknowledgement and resolution time | acknowledge in 48 hours, resolve in 30 days |
| `[[GSTIN]]` | GST number (only if registered) | |
| `[[EFFECTIVE_DATE]]` | Date each policy takes effect | |
| `[[ANALYTICS_TOOLS]]` | Tools you actually use | Google Analytics, Meta Pixel |

---

## 2. Footer links and routes

**Footer column ("Support & Policies")** matches the layout from the v2 guide.

| Link text | URL (Shopify-style, same as reference) | Alternative for custom sites |
|---|---|---|
| Contact us | `/pages/contact` | `/contact` |
| FAQ | `/pages/faq` | `/faq` |
| Shipping policy | `/policies/shipping-policy` | `/shipping-policy` |
| Returns & refunds *(optional)* | `/policies/refund-policy` | `/returns-refunds` |
| Data sharing opt-out | `/pages/data-sharing-opt-out` | `/data-sharing-opt-out` |
| Terms of service | `/policies/terms-of-service` | `/terms-of-service` |
| Privacy policy | `/policies/privacy-policy` | `/privacy-policy` |

```html
<div class="footer__col">
  <h4>Support &amp; Policies</h4>
  <ul>
    <li><a href="/pages/contact">Contact us</a></li>
    <li><a href="/pages/faq">FAQ</a></li>
    <li><a href="/policies/shipping-policy">Shipping policy</a></li>
    <li><a href="/policies/refund-policy">Returns &amp; refunds</a></li>
    <li><a href="/pages/data-sharing-opt-out">Data sharing opt-out</a></li>
    <li><a href="/policies/terms-of-service">Terms of service</a></li>
    <li><a href="/policies/privacy-policy">Privacy policy</a></li>
  </ul>
</div>
```

Also add a small legal strip at the very bottom of the footer, next to the copyright line: `© 2026 [[BRAND]]. All rights reserved.`

**If you use Shopify:**
- Terms, Privacy, Shipping and Refund policies live in **Settings → Policies**. Paste the content there (their editor accepts basic formatting; you can paste the HTML below).
- FAQ, Contact and Data sharing opt-out are **Pages** (**Online Store → Pages**). Create them with the handles `faq`, `contact`, `data-sharing-opt-out`.
- Footer links are edited in **Online Store → Navigation → Footer menu**.
- For the Contact page, use a page template that includes Shopify's contact form.

**If you use another platform or custom code:** create the routes above, render each page with the shared template (section 3), and store the content as Markdown or HTML files.

---

## 3. Shared page template and styling

Uses the tokens from the v2 guide (`--ice`, `--ink`, `--mint`, `--line`, `--font-heading`, `--font-body`, `.container`, `.btn`).

```html
<main class="page">
  <header class="page-hero">
    <div class="container">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> <span>/</span> <span>FAQ</span></nav>
      <h1 class="page-title">FAQ</h1>
      <p class="page-intro">Quick answers to the questions we hear most.</p>
    </div>
  </header>

  <div class="container prose">
    <!-- page content here -->
  </div>
</main>
```

```css
.page-hero { background: var(--ice); padding: 48px 0 40px; text-align: center; }
.crumbs { font-size: .8rem; color: var(--text-muted); margin-bottom: 14px; }
.crumbs a { color: inherit; text-decoration: none; }
.crumbs a:hover { color: var(--mint-hover); }
.crumbs span { margin: 0 6px; }

.prose { max-width: 780px; margin: 0 auto; padding: 48px var(--gutter) 80px; }
.prose h2 { font: 500 1.35rem/1.3 var(--font-heading); color: var(--ink); margin: 40px 0 12px; }
.prose h3 { font: 600 1.05rem/1.4 var(--font-body); color: var(--ink); margin: 24px 0 8px; }
.prose p, .prose li { font-size: .98rem; line-height: 1.75; color: var(--text); }
.prose ul, .prose ol { padding-left: 1.3em; margin: 8px 0 16px; }
.prose li { margin: 6px 0; }
.prose a { color: var(--ink); text-decoration: underline; text-decoration-color: var(--mint); text-underline-offset: 3px; text-decoration-thickness: 2px; }
.prose a:hover { background: var(--ice); }
.prose hr { border: 0; border-top: 1px solid var(--line); margin: 32px 0; }
.prose .meta { font-size: .85rem; color: var(--text-muted); }

/* Highlight box, e.g. "Need help?" */
.callout { background: var(--ice); border: 1px solid var(--line); border-radius: var(--radius-card); padding: 20px 24px; margin: 32px 0; }
.callout strong { color: var(--ink); }

/* Tables inside policies (delivery times etc.) */
.prose table { width: 100%; border-collapse: collapse; margin: 16px 0 24px; font-size: .92rem; }
.prose th, .prose td { text-align: left; padding: 12px 14px; border-bottom: 1px solid var(--line); vertical-align: top; }
.prose th { background: var(--ice); font-weight: 700; color: var(--ink); }
```

Show "Last updated: [[EFFECTIVE_DATE]]" at the top of each policy using `<p class="meta">`.

---

## 4. Page 1: FAQ (`/pages/faq`)

**Layout:** a list of expandable questions (accordion) using `<details>`. One question can be open at a time (optional). A "Still need help?" callout at the bottom links to the Contact page.

```html
<div class="faq">
  <details class="faq__item">
    <summary>Do you have any discount codes available?</summary>
    <div class="faq__body"><p>Answer…</p></div>
  </details>
  <!-- repeat for each question -->
</div>

<div class="callout"><strong>Still need help?</strong>
  <p>Message us on <a href="[[WHATSAPP_LINK]]">WhatsApp</a> or write to <a href="mailto:[[SUPPORT_EMAIL]]">[[SUPPORT_EMAIL]]</a>. We reply [[REPLY_TIME]].</p>
  <a class="btn btn--primary" href="/pages/contact">Contact us</a>
</div>
```

```css
.faq__item { border-bottom: 1px solid var(--line); }
.faq__item summary { list-style: none; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 16px;
  padding: 20px 0; font: 600 1.05rem/1.4 var(--font-body); color: var(--ink); }
.faq__item summary::-webkit-details-marker { display: none; }
.faq__item summary::after { content: "+"; font-size: 1.5rem; line-height: 1; color: var(--mint); transition: transform .2s; }
.faq__item[open] summary::after { transform: rotate(45deg); }
.faq__body { padding: 0 0 20px; }
.faq__body p { margin: 0 0 10px; }
```

**SEO:** add FAQ structured data so questions can show in search results. Generate it from the same Q&A list:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "How fast is shipping and how much does it cost?",
      "acceptedAnswer": { "@type": "Answer", "text": "Plain-text version of the answer…" } }
  ]
}
</script>
```

### FAQ content (15 questions)

**1. Do you have any discount codes available?**
Yes, from time to time. Active offers and codes are shown on our website banner and shared on our [Instagram]([[INSTAGRAM_URL]]) and WhatsApp updates. Enter a code at checkout. Codes can't be applied after an order is placed, and only one code can be used per order unless stated otherwise. Sign up to our newsletter to hear about new offers first.

**2. How fast is shipping and how much does it cost?**
Ready-to-ship items are dispatched within [[READY_TO_SHIP_DAYS]], and made-to-order pieces within [[MADE_TO_ORDER_DAYS]]. After dispatch, delivery within India usually takes [[DELIVERY_DAYS_INDIA]]. Shipping is free on orders above [[FREE_SHIPPING_MIN]]; below that, the fee ([[SHIPPING_FEE]]) is shown at checkout. See our [Shipping policy](/policies/shipping-policy) for full details.

**3. How can I track my order?**
Once your order is dispatched, we email you (and message you on WhatsApp, if you've given us your number) with a tracking link. You can also check your order status from your account page.

**4. I need to cancel or modify my order. What do I do?**
Message us on WhatsApp at [[WHATSAPP_NUMBER]] or email [[SUPPORT_EMAIL]] with your order number as soon as possible. We can usually cancel or change an order [[CANCEL_WINDOW]]. Because every piece is handmade, we can't change or cancel once making has started or the order has been dispatched.

**5. Why choose Oviyas Crochet?**
Every piece is handmade with care, so you won't find the same factory-made look everywhere. Our designs are bold, playful and made for people who love to express themselves. We use quality yarns, finish each piece by hand, and you can talk to the people who made it.

**6. Where are your products made?**
All our crochet pieces are handmade in India by us and our small team of makers. *(Edit this answer to match your real setup.)*

**7. Where are you located?**
We're based in [[CITY_STATE]], India. We ship to customers across India. Our full address is on the [Contact page](/pages/contact).

**8. Is your site secure?**
Yes. Payments are processed through [[PAYMENT_GATEWAY]], which uses industry-standard encryption. We never see or store your full card details. Read more in our [Privacy policy](/policies/privacy-policy).

**9. What payment methods do you accept?**
We accept [[PAYMENT_METHODS]]. The options available to you are shown at checkout.

**10. Do the photos on the site match the product exactly?**
We photograph our pieces as accurately as we can, but because each item is handmade, small differences in stitch pattern, size and shape are normal and part of the charm. Colors can also look slightly different on different screens. If you want to see more, message us and we'll share extra photos or a short video.

**11. Can I order a custom size or a custom color?**
Often, yes! Tell us what you have in mind through the [Contact page](/pages/contact) or on WhatsApp. Share the product, the size or colors you want, and when you need it. We'll confirm the price and timeline before you pay. Custom orders usually take [[MADE_TO_ORDER_DAYS]] and are non-refundable once making begins.

**12. What happens if an item is out of stock?**
Out-of-stock items show as "Sold out". Use the **Notify me** option on the product to get an alert when it's back, or message us to ask if we can make it to order. If an item sells out while your order is being processed, we'll contact you to offer a substitute, a wait for the new batch, or a full refund.

**13. I entered the wrong address. What do I do?**
Contact us right away on WhatsApp or email with your order number and the correct address. If the parcel hasn't been dispatched, we'll update it. Once it's shipped, we can't guarantee a change; delivery to an incorrect address provided at checkout is the customer's responsibility.

**14. How do I return or exchange an order?**
Please see our [Returns & refunds policy](/policies/refund-policy). In short: report any problem within [[RETURN_WINDOW]] of delivery with your order number, photos and an unboxing video. Made-to-order and custom pieces can't be returned unless they arrive damaged or incorrect. *(Edit this to match your real policy.)*

**15. How do I care for my crochet pieces?**
Hand wash gently in cool water with a mild detergent, don't wring or twist, and dry flat in the shade. Store folded, not hung, to keep the shape. Avoid direct heat and harsh chemicals. Check the care label on your product for specific instructions.

---

## 5. Page 2: Contact us (`/pages/contact`)

**Layout:** two columns on desktop. Left: contact details and quick buttons. Right: contact form. Optional map below. Single column on mobile.

```html
<main class="page">
  <header class="page-hero">
    <div class="container">
      <h1 class="page-title">Contact Us</h1>
      <p class="page-intro">Questions about an order, a custom piece or something else? We're happy to help.</p>
    </div>
  </header>

  <div class="container contact">
    <section class="contact__info">
      <h2>Reach us</h2>

      <h3>WhatsApp (fastest)</h3>
      <p><a class="btn btn--primary" href="[[WHATSAPP_LINK]]">Chat on WhatsApp</a></p>
      <p class="small">[[WHATSAPP_NUMBER]] · Messages only, voice calls not supported.</p>

      <h3>Email</h3>
      <p><a href="mailto:[[SUPPORT_EMAIL]]">[[SUPPORT_EMAIL]]</a></p>

      <h3>Address</h3>
      <p>[[LEGAL_NAME]]<br>[[ADDRESS]]</p>

      <h3>Hours</h3>
      <p>[[SUPPORT_HOURS]]. We usually reply [[REPLY_TIME]].</p>

      <h3>Follow us</h3>
      <div class="social"><!-- round mint social icons from the v2 footer --></div>
    </section>

    <section class="contact__form">
      <h2>Send us a message</h2>
      <form id="contact-form" method="post" action="/contact" novalidate>
        <label>Name <input name="name" type="text" required autocomplete="name"></label>
        <label>Email <input name="email" type="email" required autocomplete="email"></label>
        <label>Phone (optional) <input name="phone" type="tel" autocomplete="tel"></label>
        <label>Topic
          <select name="topic" required>
            <option value="">Choose a topic</option>
            <option>Order status or tracking</option>
            <option>Change or cancel an order</option>
            <option>Custom order</option>
            <option>Bulk / gifting enquiry</option>
            <option>Return or damaged item</option>
            <option>Something else</option>
          </select>
        </label>
        <label>Order number (if any) <input name="order" type="text"></label>
        <label>Message <textarea name="message" rows="6" required></textarea></label>
        <input type="text" name="website" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true"> <!-- spam trap -->
        <button class="btn btn--primary" type="submit">Send message</button>
        <p class="form-status" role="status" aria-live="polite"></p>
      </form>
    </section>
  </div>

  <!-- Optional: embedded map -->
  <div class="container map"><iframe title="Map" src="[[GOOGLE_MAPS_EMBED_URL]]" loading="lazy" width="100%" height="360" style="border:0;border-radius:16px"></iframe></div>

  <!-- Optional: custom orders / wholesale band -->
  <section class="band band--ice">
    <div class="container" style="max-width:780px;text-align:center">
      <h2>Custom orders &amp; bulk gifting</h2>
      <p>Planning a wedding favour, corporate gift or something one-of-a-kind? Tell us your idea and we'll make it happen.</p>
      <a class="btn btn--white" href="[[WHATSAPP_LINK]]">Start a custom order</a>
    </div>
  </section>
</main>
```

```css
.contact { display: grid; grid-template-columns: 1fr 1.2fr; gap: 56px; padding-block: 56px; max-width: 1100px; margin-inline: auto; }
.contact h2 { font: 500 1.5rem var(--font-heading); color: var(--ink); margin: 0 0 16px; }
.contact h3 { font: 700 .9rem var(--font-body); color: var(--ink); margin: 22px 0 6px; }
.contact__form form { display: grid; gap: 16px; }
.contact__form label { display: grid; gap: 6px; font: 600 .9rem var(--font-body); color: var(--ink); }
.contact__form input, .contact__form select, .contact__form textarea {
  font: 400 1rem var(--font-body); padding: .8em 1em; border: 1px solid var(--line); border-radius: 10px; background: var(--white); }
.contact__form input:focus, .contact__form select:focus, .contact__form textarea:focus { outline: 2px solid var(--mint); outline-offset: 1px; }
.hp { position: absolute; left: -9999px; }
.form-status { min-height: 1.4em; font-size: .9rem; }
.form-status.is-error { color: var(--danger, #D6336C); }
.form-status.is-success { color: #1F7F6D; }
.map { margin-bottom: 56px; }
@media (max-width: 800px) { .contact { grid-template-columns: 1fr; gap: 40px; } }
```

**Form behaviour (required):**
- Validate required fields and email format; show a clear message beside the field.
- On success show: *"Thanks! We've got your message and will reply within [[REPLY_TIME]]."* and clear the form.
- On the server: send the message to `[[SUPPORT_EMAIL]]`, send an auto-reply to the customer, and add spam protection (the honeypot field above, a rate limit, and optionally reCAPTCHA or Turnstile).
- Shopify: use the built-in contact form (`{% form 'contact' %}`) so submissions land in your store inbox.

**Business details to show (recommended for Indian online sellers):** legal name, address, support email and a grievance officer (see the Terms, section 21).

---

## 6. Page 3: Terms of service (`/policies/terms-of-service`)

> Put this content inside the shared template. Use `<h1>` "Terms of Service" and `<p class="meta">Last updated: [[EFFECTIVE_DATE]]</p>`.

# Terms of Service

This website is operated by **[[LEGAL_NAME]]**, trading as **[[BRAND]]**. In these terms, "we", "us" and "our" mean [[LEGAL_NAME]] ([[BRAND]]), and "you" means anyone who visits the site or buys from us.

By visiting this site or placing an order, you agree to these Terms of Service and to the policies linked below. If you don't agree, please don't use the site.

- [Privacy policy](/policies/privacy-policy)
- [Shipping policy](/policies/shipping-policy)
- [Returns & refunds policy](/policies/refund-policy)
- Any other policy or guideline we publish on the site

**[[BRAND]]** and our logo, designs, photographs, patterns, text and other content are our intellectual property and are protected by applicable law.

## 1. Using the site

You confirm that you are at least 18 years old, or that you are using the site with the permission of a parent or guardian. You agree to use the site only for lawful purposes. You must not send us viruses or any harmful code. We may suspend access if these terms are broken.

## 2. General conditions

We may refuse service to anyone, at any time, for reasons permitted by law. You agree not to copy, reproduce, sell, resell or exploit any part of the site or our content without our written permission. Information you send to the site, other than payment details, may pass through networks without encryption; payment details are handled securely by our payment provider.

## 3. Accuracy of information

We work hard to keep the site accurate, but we don't promise that all content is complete, current or error-free. Please don't rely on the site alone for important decisions. We may update content at any time and aren't obliged to do so.

## 4. Changes to the site and prices

Prices and availability can change without notice. We may change or stop any part of the site or our services, and we aren't liable to you or anyone else for doing so.

## 5. Our products

- Every piece is **handmade**, so small variations in size, shape, stitching and shade are normal and are not defects.
- Colors in photos may look different on different screens.
- Some products are made in limited quantities or **made to order**. Production times are shown on the product page or confirmed by us before we begin.
- **Custom orders** are made to your specifications after we confirm details and price with you.
- We may limit quantities, discontinue products or change what we sell without notice.
- Product sizes and descriptions are approximate.

## 6. Orders, billing and payment

We may accept, refuse or cancel any order at our discretion, for example if an item is unavailable, there is a pricing error, or we suspect misuse. We may limit the quantity bought per person, household or order.

Prices are in Indian rupees and include applicable GST unless stated otherwise. You agree to give accurate and complete billing and contact details and to keep them up to date. Payments are processed by our payment provider ([[PAYMENT_GATEWAY]]). Please see our [Returns & refunds policy](/policies/refund-policy) for cancellations, returns and refunds.

## 7. Third-party tools and links

We may use third-party tools (such as payment, delivery and analytics services) and may link to other websites. We don't control them and aren't responsible for their content or practices. Please read their terms and policies before using them.

## 8. Reviews, comments and submissions

If you send us reviews, comments, photos or ideas, you give us permission to use, edit and display them (for example on our website or social media) without payment. You confirm you own what you submit and that it is lawful and not offensive, misleading or infringing. We may remove anything that breaks these rules.

## 9. Our designs and intellectual property

Our handmade pieces are for your personal use or as gifts. You may not copy or mass-produce our designs, patterns or photographs, or resell our products as your own work, or use our brand name or logo, without our written permission. If you want to stock our products or collaborate, please contact us.

## 10. Personal information

Your personal information is handled as described in our [Privacy policy](/policies/privacy-policy).

## 11. Errors and omissions

There may sometimes be mistakes in product descriptions, prices, promotions or shipping details. We may correct them and cancel or amend orders affected by an error, with a refund if you've already paid.

## 12. Respectful communication

We expect respectful behavior from everyone. We won't tolerate abusive, threatening or harassing language toward our team or other customers. If it happens, we may end the conversation, cancel the order and refuse future service.

## 13. Prohibited uses

You must not use the site to:

- break any law or regulation
- infringe anyone's intellectual property rights
- upload or transmit malware or harmful code
- collect other people's personal data
- harass, abuse or discriminate against others
- bypass or interfere with the site's security
- resell, repackage or pass off our products or content as your own without our written consent

## 14. Disclaimer and limitation of liability

We don't guarantee that the site will be uninterrupted or error-free. The site and products are provided "as is" and "as available" to the extent allowed by law. To the extent permitted by law, we are not liable for indirect, incidental or consequential losses, such as lost profits or data, replacement costs or business interruption. Nothing in these terms limits any rights you have under applicable consumer protection law.

## 15. Indemnification

You agree to protect [[LEGAL_NAME]] and its owners, staff and partners from claims and costs that arise from your breach of these terms or your misuse of the site.

## 16. Severability

If any part of these terms is found to be unenforceable, the rest still applies.

## 17. Termination

These terms remain in effect until ended by you or us. We may end or suspend your access without notice if you break these terms. You remain responsible for any amounts owed before termination.

## 18. Entire agreement

These terms and the policies listed above are the whole agreement between you and us. If we don't enforce a provision right away, we haven't given up the right to enforce it later.

## 19. Changes to these terms

We may update these terms from time to time. Changes take effect when posted on this page. By continuing to use the site after changes, you accept them.

## 20. Governing law

These terms are governed by the laws of India. Courts in [[CITY_STATE]] have jurisdiction over disputes, subject to any rights you have under applicable consumer law.

## 21. Contact and grievance officer

Questions about these terms? Contact us:

**Email:** [[SUPPORT_EMAIL]]
**Address:** [[LEGAL_NAME]], [[ADDRESS]]
**GSTIN:** [[GSTIN]] *(remove if not registered)*

**Grievance officer:** [[GRIEVANCE_OFFICER_NAME]] · [[GRIEVANCE_EMAIL]]. We acknowledge complaints within [[GRIEVANCE_RESPONSE_TIME]].

<div class="callout"><strong>Need help?</strong> If you have questions about these terms, reach out before placing your order. <a href="/pages/contact">Contact us</a>.</div>

---

## 7. Page 4: Privacy policy (`/policies/privacy-policy`)

> Use `<h1>` "Privacy Policy" and `<p class="meta">Last updated: [[EFFECTIVE_DATE]]</p>`.

# Privacy Policy

This policy explains how **[[LEGAL_NAME]]** ("[[BRAND]]", "we", "us") collects, uses and shares your personal information when you visit or buy from [[SITE_URL]] (the "Site"), and what choices you have.

## 1. Information we collect

**Information about your device and visit.** When you visit the Site, we automatically collect certain information, including:

- your browser type and version
- your IP address and approximate location
- your time zone and language
- cookies installed on your device
- the pages and products you view, the search terms you use, how you reached the Site and how you interact with it

We collect this using:

- **Cookies:** small files stored on your device (see section 4)
- **Log files:** records of actions on the Site, such as IP address, browser type, internet provider and timestamps
- **Pixels, tags and similar tools:** used to understand how the Site is used and how our ads perform

**Order and account information.** When you buy or try to buy, or create an account, we collect:

- your name
- billing and delivery address
- email address and phone number
- order details and payment status (we do **not** receive or store your full card number; payments are handled by our payment provider)

**Messages you send us.** If you contact us by form, email or WhatsApp, we keep the messages and details you share so we can help you.

**Reviews and photos.** If you post a review or share a photo, we collect that content and your name as you provide it.

## 2. How we use your information

We use order and account information to:

- process payments and fulfil and deliver orders
- send order confirmations, updates and invoices
- answer your questions and provide support
- screen orders for fraud or risk
- send news, offers and updates, **only where you've agreed** (you can unsubscribe at any time)
- meet legal, tax and accounting duties

We use device and visit information to:

- keep the Site secure and detect fraud
- understand how the Site is used and improve it
- measure and improve our advertising, where permitted

## 3. Who we share information with

We share information only with people who help us run the business, and only what they need:

- **Payment provider** ([[PAYMENT_GATEWAY]]): to process your payment
- **Delivery partners** ([[COURIER_PARTNERS]]): to deliver your order
- **Platform and technology providers:** such as our website host, email and messaging tools
- **Analytics and advertising tools** ([[ANALYTICS_TOOLS]]): to understand site use and measure ads. For example, Google Analytics helps us understand how visitors use the Site. You can review Google's privacy policy and opt out at [tools.google.com/dlpage/gaoptout](https://tools.google.com/dlpage/gaoptout)
- **Authorities or advisers:** where the law requires, or to protect our rights, customers or business

We do not sell your personal information for money. Sharing with advertising and analytics tools may count as "sharing" or "selling" under some privacy laws, and you can opt out on our [Data sharing opt-out](/pages/data-sharing-opt-out) page.

## 4. Cookies

We use cookies to keep the Site working (for example, to remember your cart), to understand how the Site is used, and to show relevant ads. You can control or delete cookies in your browser settings, but parts of the Site may not work properly without essential cookies. To learn more about cookies, visit [allaboutcookies.org](https://www.allaboutcookies.org).

## 5. Do Not Track and Global Privacy Control

Some browsers send "Do Not Track" signals. There is no common standard for responding to them, so we don't change our practices based on those signals. We **do** treat a Global Privacy Control (GPC) signal from your browser as a request to opt out of advertising-related sharing, where applicable.

## 6. Your rights

Depending on where you live, you may have the right to:

- ask for a copy of the personal information we hold about you
- ask us to correct inaccurate or incomplete information
- ask us to delete your information (see section 7)
- withdraw consent you've given, for example for marketing messages
- opt out of advertising-related sharing
- raise a complaint with us (see section 11)

If you're in India, these rights are in line with India's Digital Personal Data Protection Act, 2023 and its rules. If you are in the European Economic Area or the UK, you also have rights under local data protection law, including the right to object to or limit certain processing. We rely on contract (to fulfil your orders), legal obligation, consent and our legitimate business interests as the basis for using your information.

To use any of these rights, email [[SUPPORT_EMAIL]].

## 7. Keeping and deleting your information

We keep order and account information for as long as needed to provide our services and meet legal, tax, accounting, fraud-prevention and dispute-resolution requirements. You can ask us to delete your personal information at any time by emailing [[SUPPORT_EMAIL]] with your full name, registered email address, phone number and any order details. We will verify your identity, then delete or anonymize your information within a reasonable time, except where we must keep it for legal or legitimate business reasons.

## 8. Security

We use reasonable technical and organizational measures to protect your information. No online system is completely secure, so we can't guarantee absolute security. Please use a strong password and keep it private.

## 9. Children

The Site is not meant for children under 18, and we don't knowingly collect their personal information. If you believe a child has given us information, contact us and we will delete it.

## 10. Where your information is processed

Some of our service providers may process data outside India. Where this happens, we take steps to make sure your information is protected as described in this policy.

## 11. Changes, contact and grievance officer

We may update this policy to reflect changes in our practices or legal requirements. The latest version is always on this page, with the date at the top.

Questions or complaints about your privacy:

**Email:** [[SUPPORT_EMAIL]]
**Address:** [[LEGAL_NAME]], [[ADDRESS]]
**Grievance officer:** [[GRIEVANCE_OFFICER_NAME]] · [[GRIEVANCE_EMAIL]]

<div class="callout"><strong>Need help?</strong> If you have questions about your data or privacy, contact us any time. <a href="/pages/contact">Contact us</a>.</div>

---

## 8. Page 5: Shipping policy (`/policies/shipping-policy`)

> Use `<h1>` "Shipping Policy" and `<p class="meta">Last updated: [[EFFECTIVE_DATE]]</p>`. Replace the example numbers with your real ones.

# Shipping Policy

At **[[BRAND]]**, we want your handmade pieces to reach you safely and on time. Please read this policy before ordering.

## 1. Processing time

Orders are processed on business days, Monday to Saturday, excluding holidays. Orders placed on Sundays, public holidays or during sale and festive periods may take longer.

| Order type | Time before dispatch |
|---|---|
| Ready-to-ship items | [[READY_TO_SHIP_DAYS]] |
| Made-to-order items | [[MADE_TO_ORDER_DAYS]] (shown on the product page) |
| Custom orders | Confirmed with you before you pay |

If your order has both ready-to-ship and made-to-order items, we'll either send everything together when ready or split it into two parcels. We'll tell you which, before dispatch.

## 2. Delivery within India

### Delivery timeframe

After dispatch, delivery usually takes **[[DELIVERY_DAYS_INDIA]]**, depending on your location. We ship through courier partners including [[COURIER_PARTNERS]].

- **Remote and non-serviceable areas:** if our main couriers don't deliver to your pin code, we may ship by India Post. These deliveries can take longer (up to 15 business days).
- **Delays:** couriers, weather, strikes and other events outside our control can cause delays. We'll help you follow up with the courier if this happens.

### Shipping charges

- **Free shipping** on orders above **[[FREE_SHIPPING_MIN]]** within India.
- Below that amount, shipping is **[[SHIPPING_FEE]]**, shown at checkout before you pay.

### Tracking

When your order is dispatched, you'll get a tracking link by email (and WhatsApp, if you've shared your number).

### Wrong or incomplete address

Please check your address and phone number carefully at checkout. We can correct an address only before dispatch. If a parcel is returned because of an incorrect or incomplete address, re-shipping charges may apply.

## 3. Reporting delivery problems

- **Delivery concerns** must be reported within **[[RETURN_WINDOW]]** of the delivery date shown in tracking. After this, we may not be able to investigate.
- **Marked as delivered but not received:** contact us within **3 days** of the delivery update so we can check with the courier. We can't investigate beyond this period.

## 4. Damaged or tampered packages

If your parcel looks damaged or opened when it arrives, **please don't accept it**, or note the damage with the delivery person, and message us immediately on WhatsApp at [[WHATSAPP_NUMBER]] with photos.

**Unboxing video:** to process damage, missing-item or wrong-item claims (including courier insurance claims), we need **one continuous video** that shows the parcel sealed, the opening, and the problem. Please record it before opening the parcel. Without this video we may not be able to approve a claim. *(Optional rule: keep it only if you will enforce it.)*

## 5. International shipping

We currently ship **within India only** *(edit this if you ship abroad; if you do, add delivery times, rate rules, the list of countries and a customs and import duties section)*.

## 6. Questions?

<div class="callout"><strong>Need help?</strong> For any shipping question, contact us at <a href="mailto:[[SUPPORT_EMAIL]]">[[SUPPORT_EMAIL]]</a> or on <a href="[[WHATSAPP_LINK]]">WhatsApp</a> before you order.</div>

---

## 9. Page 6: Data sharing opt-out (`/pages/data-sharing-opt-out`)

**Purpose:** lets visitors opt out of their data being shared with advertising and analytics tools (and honors browser Global Privacy Control signals). Keep the page simple: explanation, two ways to opt out, and confirmation.

**Page content**

# Do Not Sell or Share My Personal Information

This page lets you opt out of sharing your personal information for advertising or similar purposes, as allowed under applicable privacy laws.

At **[[BRAND]]**, we respect your privacy and want you to be in control of how your data is used.

## 1. How we use your data

As described in our [Privacy policy](/policies/privacy-policy), we collect information through your visits to our site, including through cookies and similar technologies. Some of this information may be shared with analytics and advertising partners ([[ANALYTICS_TOOLS]]) to improve your experience and to show you relevant ads.

## 2. Your right to opt out

Depending on where you live, you may have the right to opt out of data sharing that is treated as a "sale", "sharing" or "targeted advertising". You can use the options below.

## 3. Opt out now

**Option A: opt out on this device (instant).** Select the button below. We'll store your choice in a cookie on this browser and stop advertising and analytics tools from loading.

<button class="btn btn--primary" id="optout-btn" type="button">Opt out on this device</button>
<p class="form-status" id="optout-status" role="status" aria-live="polite"></p>

**Option B: send us a request (covers your account and email).** Use this if you want us to apply your choice to your customer record.

```html
<form id="optout-form" method="post" action="/data-sharing-opt-out" novalidate>
  <label>Full name <input name="name" type="text" required autocomplete="name"></label>
  <label>Email address used for orders <input name="email" type="email" required autocomplete="email"></label>
  <label class="check"><input type="checkbox" name="confirm" required>
    <span>I want to opt out of the sale or sharing of my personal information for advertising and analytics.</span></label>
  <input type="text" name="website" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
  <button class="btn btn--primary" type="submit">Submit request</button>
  <p class="form-status" role="status" aria-live="polite"></p>
</form>
```

We'll confirm your request by email within [[GRIEVANCE_RESPONSE_TIME]].

## 4. Important notes

- This opt-out applies to advertising and analytics-related data sharing.
- It does **not** affect information needed to process and deliver your orders or to keep the site working.
- You may still see ads, but they won't be personalized using this data.
- If your browser sends a **Global Privacy Control (GPC)** signal, we treat it as an opt-out request, where applicable.
- You can change your mind at any time by clearing cookies or contacting us.

**Implementation: opt-out logic (load before analytics and ad scripts)**

```html
<script>
(function () {
  var COOKIE = 'oc_optout';
  function hasCookie() { return document.cookie.split('; ').indexOf(COOKIE + '=1') !== -1; }
  function setCookie() { document.cookie = COOKIE + '=1; max-age=31536000; path=/; SameSite=Lax; Secure'; }

  // 1. Has the visitor opted out? (button, saved cookie, or browser GPC signal)
  window.OC_OPTED_OUT = (navigator.globalPrivacyControl === true) || hasCookie();

  // 2. Only load analytics and advertising scripts when NOT opted out
  window.OC_loadTracking = function () {
    if (window.OC_OPTED_OUT) return;
    // TODO: add your real tracking snippets here, e.g. Google Analytics and Meta Pixel
  };
  window.OC_loadTracking();

  // 3. Opt-out button on the opt-out page
  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('optout-btn');
    var msg = document.getElementById('optout-status');
    if (!btn) return;
    if (window.OC_OPTED_OUT && msg) { msg.textContent = 'You are currently opted out on this device.'; msg.className = 'form-status is-success'; }
    btn.addEventListener('click', function () {
      setCookie();
      window.OC_OPTED_OUT = true;
      // Disable Google Analytics for this browser (replace with your real measurement ID)
      window['ga-disable-G-XXXXXXXXXX'] = true;
      if (msg) { msg.textContent = 'Done. You have opted out of advertising and analytics sharing on this device.'; msg.className = 'form-status is-success'; }
    });
  });
})();
</script>
```

**Notes**
- Shopify stores: use Shopify's Customer Privacy settings and API for consent and opt-out so Shopify apps and pixels respect the choice, and keep the page and button wired to it.
- Make sure every tracking tool (analytics, ad pixels) only loads after the check above. A button that sets a cookie does nothing if scripts still load.
- Store submitted requests (Option B) in your email inbox or admin, and apply them to your marketing and ad audiences.

---

## 10. Page extra (recommended): Returns & refunds (`/policies/refund-policy`)

Your Terms and FAQ point to this page, so create it too. **These rules are examples; set your real policy.** Many handmade shops don't accept returns on made-to-order items. Whatever you choose, state it clearly and match it on your product pages.

# Returns & Refunds

We love our handmade pieces and hope you do too. Because each item is made by hand, please read this policy before ordering.

## 1. Eligibility

You can request a return or replacement within **[[RETURN_WINDOW]]** of delivery if:

- the item arrived **damaged**, or
- you received the **wrong item**, or
- the item has a **significant defect** that was not described.

## 2. What we can't take back

- **Made-to-order and custom pieces**, unless they arrive damaged or incorrect
- **Items marked "non-returnable"** on the product page (for example hair accessories, innerwear-style tops or sale items; choose what applies)
- Items that have been **worn, washed, altered or damaged** after delivery
- Small differences in shade, size or stitching that are normal for handmade work

## 3. How to request a return or replacement

1. Message us within [[RETURN_WINDOW]] on WhatsApp ([[WHATSAPP_NUMBER]]) or email [[SUPPORT_EMAIL]].
2. Include your **order number**, clear **photos** and, for damage or missing items, the **unboxing video** (see our [Shipping policy](/policies/shipping-policy)).
3. We'll review and reply within [[REPLY_TIME]]. If approved, we'll arrange a pickup or tell you how to send the item back.

## 4. Refunds

Approved refunds are sent to your **original payment method** within **[[REFUND_DAYS]]** business days of us receiving and checking the item (your bank may take a few more days to show it). Shipping charges are non-refundable unless the error was ours. Where you prefer, we can offer a **replacement** or **store credit** instead.

## 5. Cancellations

You can cancel an order [[CANCEL_WINDOW]]. After making has started or the order has been dispatched, it can't be cancelled.

<div class="callout"><strong>Need help?</strong> <a href="/pages/contact">Contact us</a> and we'll sort it out.</div>

*(Add `[[REFUND_DAYS]]` to your list in section 1, for example "5–7".)*

---

## 11. SEO titles and descriptions

| Page | Title tag | Meta description |
|---|---|---|
| FAQ | FAQ – [[BRAND]] | Answers about shipping, payments, custom orders, returns and caring for handmade crochet from [[BRAND]]. |
| Contact | Contact Us – [[BRAND]] | Get in touch with [[BRAND]] for order help, custom crochet orders and gifting enquiries. WhatsApp and email support. |
| Terms | Terms of Service – [[BRAND]] | The terms that apply when you browse or buy handmade crochet from [[BRAND]]. |
| Privacy | Privacy Policy – [[BRAND]] | How [[BRAND]] collects, uses and protects your personal information, and your choices. |
| Shipping | Shipping Policy – [[BRAND]] | Dispatch times, delivery across India, free shipping limit and how to report delivery problems. |
| Opt-out | Do Not Sell or Share My Personal Information – [[BRAND]] | Manage your privacy choices and opt out of advertising and analytics data sharing at [[BRAND]]. |
| Returns | Returns & Refunds – [[BRAND]] | Our policy for damaged, incorrect or defective handmade items, plus refunds and cancellations. |

Allow search engines to index these pages. Add each one to your sitemap.

---

## 12. Accessibility and quality checks

- One `<h1>` per page, headings in order
- Accordion questions work with keyboard (Enter/Space) and screen readers
- Form fields have visible labels, errors are announced, and the spam trap is hidden from users and screen readers
- Links are underlined and clearly distinguishable
- Text contrast is at least 4.5:1 (use `--text` and `--ink` on white or ice)
- Pages are readable on mobile with no sideways scrolling (tables scroll inside their container)

---

## 13. Launch checklist

- [ ] Fill in every placeholder in section 1; search all pages for `[[` and make sure none remain
- [ ] Decide your real shipping, returns and cancellation rules and match them everywhere (FAQ, Shipping, Returns, Terms, product pages)
- [ ] Remove any statement that isn't true for your business (for example, "ships only within India", the unboxing-video rule, "made by our team")
- [ ] Create the six pages (plus Returns & refunds) with the shared template
- [ ] Add the Support & Policies column to the footer with all links
- [ ] Connect the contact form to your email and add spam protection
- [ ] Wire the opt-out button and GPC check, and confirm tracking scripts respect it
- [ ] Add FAQ structured data
- [ ] Set page titles and meta descriptions; add pages to the sitemap
- [ ] Have a legal professional review the Terms, Privacy and Returns policies
- [ ] Test every footer link on desktop and mobile
- [ ] Put the "Last updated" date on each policy and update it whenever the policy changes

---

## 14. Prompt to hand to an AI coding assistant

> Using `oviyas-crochet-footer-pages-guide.md` and the styling in `oviyas-crochet-ui-implementation-guide-v2.md`, add the Support & Policies column to my footer and create these pages: FAQ, Contact, Terms of Service, Privacy Policy, Shipping Policy, Data sharing opt-out, and Returns & Refunds. Use the shared page template and CSS, the accordion for the FAQ, the contact form (with validation, honeypot and a success message), and the opt-out button with Global Privacy Control handling. Use the content in the guide exactly, but replace every `[[PLACEHOLDER]]` with the values I give you (ask me for any I haven't provided, and don't invent business facts). Add page titles, meta descriptions and FAQ structured data. Don't change unrelated pages, and list every file you changed.
