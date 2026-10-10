# Custom Orders Page: Instructions for the AI Developer

Build the **Request a Custom Piece** page for Oviyas Crochet (Next.js), including its content and a set of AI-generated crochet design previews for Batman, Spider-Man, Naruto, Luffy and Zoro.

Read this whole file before writing code. Follow the **Rules** section strictly.

---

## 1. Rules for the AI (read first)

1. **Reuse the existing site.** Use the app's existing layout, fonts, colour tokens/Tailwind theme, button component and card styles. Do **not** hardcode new colours. (The live "Custom orders" section uses a light blue background, navy text, rounded cards, pill buttons.)
2. **Label AI-generated images honestly.** Every AI-generated image must show a small badge: **"Design preview (AI-generated)"**, and the page must say these are concepts and the finished piece may differ slightly in stitch, shade and size. Real photos of finished work must **not** carry that badge. Never present an AI image as a real, finished product.
3. **Keep copy wording consistent:**
   - Button text everywhere: **"Request a custom piece"**.
   - Always tell the customer: **"We'll reach back to you by email."**
   - We start crocheting only **after the customer approves** the design and price.
4. **Character wording.** Describe pieces as **"inspired by"** a character (for example "Batman-inspired baby set"). Add the disclaimer in section 7. Do not use official logos, wordmarks or artwork. Generate images without text or logos.
5. **Do not invent facts.** No made-up prices, delivery times, shipping regions, reviews or testimonials. Where information is missing, use the placeholders in section 12 (`TODO_OWNER`) and list them in your final message.
6. **Server-only secrets.** The Gmail App Password and other secrets stay in server code and env vars (see `gmail-email-setup.md`).
7. **Accessibility and performance.** Real `alt` text on every image, keyboard-usable gallery and form, visible focus, `next/image` with lazy loading, images served as WebP.
8. When done, reply with: files created/changed, anything that needs the owner's input, and how to run and test it.

---

## 2. Page overview

| Item | Value |
|---|---|
| Route | `/request-custom-piece` |
| Linked from | "Custom orders" section buttons on the home page (already point here) |
| Purpose | Let customers request a made-to-order piece, with inspiration, and be reassured that we'll reach back |
| Form submits to | `POST /api/custom-request` (see `gmail-email-setup.md`; extend it with the new fields in section 8) |
| Primary action | Submit the request form |

### Page sections, in order

1. **Hero**: heading, short intro, button that scrolls to the form.
2. **What we can make**: four category cards (baby outfits, hats, keychains, accessories).
3. **How it works**: 3 steps.
4. **Superhero & anime designs**: character gallery with AI design previews and filters.
5. **Request form**.
6. **FAQ**.
7. **Closing reassurance + repeat button**.

---

## 3. Page copy (use as written, light edits allowed)

### Hero
- **Heading:** Custom orders, made for you
- **Intro:** Have something special in mind? We'll crochet it in your colours, your style, your size. From everyday baby wear to superhero and anime-inspired sets, send us your idea and we'll bring it to life.
- **Button:** Request a custom piece (scrolls to `#request-form`)
- **Small text:** We'll reach back to you by email to confirm the design and price.

### What we can make
- **Baby outfits and dresses:** Rompers, dresses, sweaters, jackets and full themed sets, made to your baby's size.
- **Hats and beanies:** Cosy hats with ears, spikes, straw-hat brims and more, so your little one can dress up as their favourite character.
- **Keychains:** Small handmade character keychains, a thoughtful gift for fans of any age.
- **Accessories:** Booties, mittens, headbands, capes, bibs and photo-shoot props to complete the look.

### How it works
1. **Share your idea.** Tell us the character or design, and add reference photos or links.
2. **Tell us the details.** Size, colours and when you need it by.
3. **We reach back to you.** We'll email you to confirm the design and price. We start crocheting once you approve.

### Superhero & anime designs
- **Heading:** Superhero & Anime Knits
- **Intro:** Fan of a character? We take custom orders for any anime, superhero, cartoon or game reference. These are design previews to spark ideas. Yours will be made to order and customised to you.
- **Preview notice (shown under the heading):** Previews are AI-generated design concepts. Finished pieces are handmade, so stitches, shades and proportions may differ slightly.
- **Card button:** Request this design (opens the form with the character and item pre-filled)

### Per-character card text (one line each)
- **Batman-inspired:** Dark cowl with ears, cape and gauntlet cuffs, finished with a bold yellow accent.
- **Spider-Man-inspired:** Red and blue bodysuit, web details and a hat with white eye lenses.
- **Naruto-inspired:** Orange and navy jacket set with a headband and spiky-hair hat.
- **Luffy-inspired:** Straw-hat style cap with a red band, red vest and blue shorts.
- **Zoro-inspired:** Deep green coat with a red sash, green hat and miniature crochet swords.

### FAQ (use these questions; answers marked TODO need owner input)
- **How do I request a custom piece?** Fill in the form on this page. We'll reach back to you by email.
- **Can you make characters that are not shown here?** Yes. Tell us the character or send a picture and we'll let you know what's possible.
- **What sizes can you make?** Newborn to toddler and beyond. Tell us your baby's age or measurements in the form. (TODO_OWNER: confirm size range.)
- **How much will it cost?** The price depends on the size, colours and detail. We'll quote it by email before we start, and nothing is made until you approve.
- **How long will it take?** TODO_OWNER: add typical making time and rush-order policy.
- **Do you ship?** TODO_OWNER: add shipping regions and charges.
- **Are the previews photos of real products?** The designs labelled "Design preview (AI-generated)" are concept images. Photos without that label are of finished pieces we've made.
- **Are these official merchandise?** No. They are handmade, fan-inspired pieces and are not affiliated with or endorsed by the owners of these characters.

### After submitting (success state)
- **Heading:** Thank you, we've got your request!
- **Text:** We've sent a confirmation to your email. We'll reach back to you soon to confirm the design and price. If you don't see our email, please check your spam folder.

---

## 4. File and folder structure

```
app/
  request-custom-piece/
    page.tsx                 # server component, metadata, composes sections
  api/custom-request/route.ts  # existing; extend per section 8
components/custom-orders/
  Hero.tsx
  CategoryCards.tsx
  HowItWorks.tsx
  DesignGallery.tsx          # client component (filters, "Request this design")
  RequestForm.tsx            # client component
  Faq.tsx
data/
  customDesigns.ts           # gallery data (section 5)
public/images/custom/
  batman/        batman-outfit.webp, batman-hat.webp, batman-keychain.webp, batman-accessories.webp
  spiderman/     ... same four names with "spiderman-" prefix
  naruto/        ...
  luffy/         ...
  zoro/          ...
```

### Metadata (`page.tsx`)

```ts
export const metadata = {
  title: "Request a Custom Piece | Oviyas Crochet",
  description:
    "Order custom handmade crochet baby outfits, hats, keychains and accessories, including superhero and anime-inspired designs. We'll reach back to you by email.",
};
```

---

## 5. Gallery data

`data/customDesigns.ts`

```ts
export type DesignItem = "outfit" | "hat" | "keychain" | "accessories";

export type CustomDesign = {
  id: string;                 // e.g. "batman-hat"
  character: "Batman" | "Spider-Man" | "Naruto" | "Luffy" | "Zoro";
  item: DesignItem;
  title: string;              // e.g. "Batman-inspired cowl hat"
  blurb: string;              // one short line
  image: string;              // e.g. "/images/custom/batman/batman-hat.webp"
  alt: string;                // describe what is visible
  source: "ai" | "real";      // controls the "Design preview (AI-generated)" badge
};
```

Create **20 entries** (5 characters × 4 items). All start as `source: "ai"`. When the owner adds a real photo of a finished piece, they change the `image` and set `source: "real"`; the badge then disappears automatically.

Gallery behaviour:
- Filter chips: **All, Batman, Spider-Man, Naruto, Luffy, Zoro**, plus a second row: **All items, Outfits, Hats, Keychains, Accessories**.
- Responsive grid: 2 columns on mobile, 3 on tablet, 4 on desktop, 4:5 image ratio, rounded corners like the existing cards.
- Each card: image, "Design preview (AI-generated)" badge when `source === "ai"`, title, one-line blurb, **Request this design** button.
- "Request this design" scrolls to `#request-form` and pre-fills **Character** and **Item** (use a shared state or URL params such as `?character=Batman&item=hat`).
- Last card in the grid: **"Don't see your character?"** with the **Request a custom piece** button.

---

## 6. AI image generation

Generate the preview images with an image-generation model available to you (for example the project's configured image model). If you cannot generate images, create the file structure, add placeholder images (a plain tinted rectangle with the character name), and **write all prompts to `data/image-prompts.md`** so the owner can generate them.

### 6.1 Output specs
- Portrait **4:5**, at least **1600 × 2000 px**, converted to **WebP** (quality about 80), under about 250 KB each after optimisation.
- Filenames as in section 4, lowercase, hyphenated.
- Generate **3 to 4 variations** per image, pick the best, and discard any with visible problems (below).

### 6.2 Visual style guide (keep all 20 images consistent)
- Top-down **flat lay** product photograph on a natural **linen or light wood** surface.
- Soft, natural window light, gentle shadows, shallow depth of field.
- Chunky, clearly visible **hand-crocheted stitches** (single crochet / half-double crochet texture) with natural yarn fuzz.
- At most one small neutral prop (small wooden toy, dried flower). The crochet piece is the focus.
- No people, no hands, no faces, no text, no logos, no watermarks.

### 6.3 Base prompt template

```
Photorealistic top-down flat lay product photograph of a handmade crochet {ITEM},
inspired by {CHARACTER}, {CHARACTER DETAILS}.
Chunky hand-crocheted stitch texture clearly visible, soft yarn fuzz,
natural linen surface, soft window light, calm cozy baby-boutique style,
4:5 portrait composition, sharp focus on the stitching.
```

### 6.4 Negative prompt (use if the tool supports it; otherwise add "Avoid: ...")

```
text, letters, watermark, brand logo, official artwork, human face, hands,
blurry, plastic look, machine-knitted smooth fabric, melted or distorted stitches,
extra or missing parts, asymmetrical eyes or ears, cartoon illustration, 3D render
```

### 6.5 Character details to insert as `{CHARACTER DETAILS}`

Use colours and shapes only. Do not ask for logos or lettering. Emblems should be simple stitched shapes.

| Character | Details |
|---|---|
| **Batman** | black yarn with grey accents; cowl with pointed ears; short cape with grey scalloped edge; yellow belt-style trim; a simple yellow oval emblem with a black bat silhouette stitched on the chest; grey gauntlet-style cuffs |
| **Spider-Man** | bright red and deep blue; red hat with large white oval eye lenses outlined in black; red top with blue lower half; black web lines and a simple black spider shape stitched on the chest; matching red booties |
| **Naruto** | orange jacket and trousers with navy-blue shoulders and collar and white trim; navy headband with a small silver plate and spiral leaf shape; yellow spiky-hair beanie; black and white striped ankle bands |
| **Luffy** | yellow straw-hat style cap with a red band; open red vest with two buttons; bright blue shorts with white cuffs; small tan sandals |
| **Zoro** | deep green long coat with a wide red sash; fuzzy green short-hair style beanie; black booties; three miniature crochet swords in white, green and yellow handles lying beside the outfit |

### 6.6 Item-specific prompts (fill `{ITEM}`)

Generate each character in these four item types (20 images).

**Outfit / baby dress**
`{ITEM}` = "baby outfit set (romper or dress with matching trim)" and mention the character's top and bottom pieces from 6.5.

**Hat**
`{ITEM}` = "baby beanie hat" showing only the hat, front-facing on the surface, with the character's signature shape (ears, spikes, brim or lenses).

**Keychain**
`{ITEM}` = "mini amigurumi keychain, about 7 cm tall, chibi-style character doll with a simple stitched face of two small black bead eyes (no mouth text), attached to a metal key ring". Show 1 to 2 keychains on the surface. Use the same colours as 6.5.

**Accessories**
`{ITEM}` = "set of baby accessories: a pair of booties, a pair of mittens and a headband (or cape for Batman and Zoro)" in the character's colours from 6.5, arranged neatly.

### 6.7 Example, fully assembled (Naruto hat)

```
Photorealistic top-down flat lay product photograph of a handmade crochet baby
beanie hat, inspired by Naruto, yellow spiky-hair beanie with a navy headband
with a small silver plate and spiral leaf shape sewn on the front.
Chunky hand-crocheted stitch texture clearly visible, soft yarn fuzz,
natural linen surface, soft window light, calm cozy baby-boutique style,
4:5 portrait composition, sharp focus on the stitching.
Avoid: text, letters, watermark, brand logo, official artwork, human face, hands,
blurry, plastic look, machine-knitted smooth fabric, distorted stitches, 3D render.
```

### 6.8 Quality check: reject and regenerate an image if
- Stitches look smooth, printed or machine-knitted rather than crocheted.
- The item could not be crocheted as shown (impossible shapes, floating parts, glowing effects).
- Letters, logos, watermarks or garbled text appear.
- Colours differ clearly from the table in 6.5.
- Parts are missing, doubled or mismatched (for example uneven ears, three sleeves).
- The image looks like official character artwork instead of a handmade item.

Write a short `alt` for each image, for example: "Handmade crochet Batman-inspired baby beanie with pointed ears, shown flat on a linen surface".

---

## 7. Disclaimers to show on the page

Place near the gallery (small text) and in the FAQ:

1. **AI previews:** "Design previews are AI-generated concepts. Finished pieces are handmade and may differ slightly in stitch, shade and size."
2. **Not official:** "Oviyas Crochet is not affiliated with or endorsed by the owners of the characters shown. All pieces are handmade, fan-inspired creations."

> Note for the owner: selling items based on trademarked or copyrighted characters can carry legal risk in some places, even when handmade. This is not legal advice. Consider checking the rules for your country and selling platform, and keep the "inspired by" wording.

---

## 8. Request form

`components/custom-orders/RequestForm.tsx` (client component). Section id: `request-form`.

### Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| Your name | text | yes | max 100 chars |
| Email | email | yes | we reply here; validate format |
| Phone / WhatsApp | tel | no | |
| What would you like? | select | yes | Outfit or dress, Hat, Keychain, Accessories, Full themed set, Something else |
| Character or idea | text | no | pre-filled from gallery; e.g. "Naruto" |
| Size or baby's age | text | yes | e.g. "6 to 9 months" or measurements |
| Preferred colours | text | no | |
| Needed by (date) | date | no | |
| Reference links | text | no | link to a photo or post |
| Details | textarea | yes | max 3000 chars |
| Consent checkbox | checkbox | yes | "I agree that Oviyas Crochet may email me about this request." |
| Honeypot | hidden text | no | bots fill it; if filled, silently ignore the submission |

**Reference photo upload (optional, phase 2):** only add if the project already has file storage (Vercel Blob, S3 or Cloudinary). Allow up to 3 images, max 5 MB each, JPG/PNG/WebP only, validate type and size on the server, and put **links** to the stored files in the owner email (do not attach big files to Gmail messages). If no storage exists, skip uploads and rely on the reference links field.

### Behaviour
- Inline validation with clear messages, focus the first invalid field on submit.
- Disable the submit button and show "Sending..." while the request runs.
- On success: replace the form with the **success state** from section 3. On failure: keep their input and show "Something went wrong. Please try again, or email us at oviyascrochet@gmail.com."
- Under the button: "We'll reach back to you by email."

### API changes (`app/api/custom-request/route.ts`)
Extend the existing handler to accept: `phone`, `itemType`, `character`, `size`, `colours`, `neededBy`, `referenceLinks`, `details`, `consent`, `website` (honeypot).

- If `website` (honeypot) is non-empty: return `{ ok: true }` without sending anything.
- Require `consent === true`.
- Trim, length-limit and escape every field (use the `esc()` helper from `lib/email/templates.ts`).
- Add the new fields to both the customer confirmation and the owner alert templates.
- Add per-IP rate limiting (for example 5 requests per hour) so bots cannot use up the Gmail daily limit.
- Save the request to the database **before** sending email, and record `emailStatus`.

---

## 9. Layout and design notes

- Mobile first. Single column on phones; hero text and a lead image side by side on desktop.
- Reuse the "Custom orders" home section's look: soft background, rounded cards with soft shadows, pill buttons, numbered steps.
- Hero image: use the existing pink baby dress and mint romper photos already used on the home page (real photos, no badge).
- Section spacing generous (about 56 px vertical on desktop).
- Gallery cards have a consistent 4:5 image ratio so the grid stays tidy.
- Make the success state and error state visually distinct and announce them to screen readers (`role="status"` / `aria-live="polite"`).

---

## 10. SEO and sharing

- One `<h1>` only (the hero heading).
- Add `Product`-free, simple structured data if you add any: `WebPage` with name and description is enough. Do not add fake ratings or prices.
- Open Graph image: use the hero photo (a real one).
- Add the page to `sitemap.xml` if the project has one.

---

## 11. Acceptance checklist

- [ ] `/request-custom-piece` loads and matches the site's look on mobile, tablet and desktop.
- [ ] All "Request a custom piece" buttons on the site go to this page.
- [ ] 20 gallery images exist (5 characters × 4 items), all WebP, all with alt text.
- [ ] Every AI image shows the "Design preview (AI-generated)" badge; switching `source` to `"real"` removes it.
- [ ] Both disclaimers (AI previews, not official) are visible on the page.
- [ ] Gallery filters work and "Request this design" pre-fills character and item.
- [ ] Form validates, shows loading, success and error states, and keeps input on error.
- [ ] Honeypot and rate limit are in place; consent is required.
- [ ] Submitting sends a confirmation to the customer ("We'll reach back to you by email") and an alert to the owner, with Reply-To set to the customer.
- [ ] The request is saved in the database before emails are sent.
- [ ] No secrets in client code; no invented prices, times or reviews.
- [ ] Lighthouse accessibility score is 90 or higher; images lazy-load.

---

## 12. Open items for the owner (`TODO_OWNER`)

Collect these and list them in your final message:

- Size range offered
- Typical making time and rush-order policy
- Shipping regions and charges
- Price guide (optional, only if the owner provides figures)
- Whether reference photo uploads are wanted, and which storage service to use
- Real photos of finished Batman, Spider-Man, Naruto, Luffy and Zoro pieces to replace the AI previews
- A different photo for any image that includes another seller's watermark (do not use watermarked images)