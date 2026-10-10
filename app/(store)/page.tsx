import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { getEffectivePrice } from "@/lib/pricing";
import { toDiscountInput } from "@/lib/discount-mapper";
import { YarnMascot } from "@/components/ui/yarn-mascot";
import { ProductCard } from "@/components/store/product-card";
import { NewsletterForm } from "@/components/store/newsletter-form";
import { formatINR, phClass } from "@/lib/utils";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Oviya's Crochet | Handmade crochet toys, bags and gifts",
  description:
    "Cuddly toys, everyday bags and thoughtful gifts, crocheted to order in Kanniyakumari and delivered across India. Made with love, shipped with care.",
  openGraph: {
    title: "Oviya's Crochet | Handmade crochet toys, bags and gifts",
    description: "Handmade crochet from Kanniyakumari — amigurumi, bags, baby gifts and more.",
    type: "website",
  },
};

/* §9.1 Category cards data */
const CATEGORY_CARDS = [
  { slug: "amigurumi", label: "Amigurumi", image: "/cat_amigurumi.jpg" },
  { slug: "bags", label: "Bags", image: "/cat_bags.jpg" },
  { slug: "home-decor", label: "Home Décor", image: "/cat_home_decor.jpg" },
  { slug: "baby", label: "Baby Gifts", image: "/cat_baby.jpg" },
  { slug: "accessories", label: "Accessories", image: "/cat_accessories.jpg" },
  { slug: "gift-hampers", label: "Gift Hampers", image: "/hero_placeholder.jpg" },
];

const COLLECTION_TILES = [
  { href: "/shop?category=amigurumi", label: "Amigurumi", bg: "#CFEBDD", image: "/coll_amigurumi.jpg" },
  { href: "/shop?category=bags", label: "Bags & Pouches", bg: "#F9C6DB", image: "/coll_bags.jpg" },
  { href: "/shop?category=accessories", label: "Accessories", bg: "#E7D6FA", image: "/coll_accessories.jpg" },
  { href: "/shop?category=home-decor", label: "Home Décor", bg: "#FBE3B5", image: "/cat_home_decor.jpg" },
];

const HOW_STEPS = [
  { title: "Choose", desc: "Pick a product and your colour." },
  { title: "Pay securely", desc: "UPI, cards or netbanking." },
  { title: "We crochet", desc: "You get an email at every step." },
  { title: "Delivered", desc: "Wrapped with care in 5 to 7 days." },
];

const FALLBACK_TESTIMONIALS = [
  { id: "1", name: "Priya", town: "Kumbakonam", quote: "The bunny arrived beautifully wrapped and my daughter will not let go of it." },
  { id: "2", name: "Meena", town: "Chennai", quote: "The tote is sturdy and the colours are even prettier in person." },
  { id: "3", name: "Anitha", town: "Madurai", quote: "Loved the email updates. It felt like watching my gift being made." },
];

async function getData() {
  const now = new Date();
  try {
    const [rawFeatured, rawDiscounts, gallery, testimonials] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true, isFeatured: true },
        orderBy: [{ featuredPosition: "asc" }, { createdAt: "desc" }],
        take: 3,
        include: {
          images: { orderBy: { position: "asc" } },
          category: true,
          discounts: { include: { discount: { include: { products: true } } } },
        },
      }),
      prisma.discount.findMany({
        where: { isActive: true, startsAt: { lte: now }, OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
        include: { products: true },
      }),
      prisma.galleryImage.findMany({
        where: { isActive: true }, orderBy: { position: "asc" }, take: 6,
      }).catch(() => []),
      prisma.testimonial.findMany({
        where: { isActive: true }, orderBy: { position: "asc" }, take: 3,
      }).catch(() => []),
    ]);

    const discounts = rawDiscounts.map(toDiscountInput);
    const featured = rawFeatured.map((p) => {
      const pricing = getEffectivePrice(
        { id: p.id, price: Number(p.price), categoryId: p.categoryId },
        discounts, now
      );
      const sortedImages = [...p.images].sort((a, b) => a.position - b.position);
      const primaryImage = sortedImages.find((i) => i.isPrimary)?.url ?? sortedImages[0]?.url;
      const secondaryImage = sortedImages[1]?.url;
      return {
        id: p.id, name: p.name, slug: p.slug, description: p.description,
        price: pricing.finalPrice, originalPrice: pricing.originalPrice,
        discountPercent: pricing.savingPercent,
        featuredLabel: p.featuredLabel ?? "Featured",
        primaryImage,
        secondaryImage,
        inStock: (p as any).inStock ?? true,
      };
    });

    return {
      featured,
      gallery: gallery as { id: string; url: string; alt: string }[],
      testimonials: (testimonials.length > 0 ? testimonials : FALLBACK_TESTIMONIALS) as {
        id: string; name: string; town: string; quote: string;
      }[],
    };
  } catch {
    return { featured: [], gallery: [], testimonials: FALLBACK_TESTIMONIALS };
  }
}

// Pastel placeholder colours for gallery when no images
const GALLERY_COLORS = ["p1", "p2", "p3", "p4", "p2", "p1"];

export default async function HomePage() {
  const { featured, gallery, testimonials } = await getData();

  return (
    <>
      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="hero" aria-label="Hero">
        <div>
          <h1 className="text-hero" style={{ marginBottom: 16, textAlign: "left" }}>
            Little loops of love,<br />made by hand
          </h1>
          <p style={{ color: "var(--mute)", maxWidth: "46ch", marginBottom: 22, fontSize: 18, lineHeight: 1.55 }}>
            Cuddly toys, everyday bags and thoughtful gifts, crocheted to order in Kanniyakumari and delivered across India.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 22 }}>
            <Link href="/shop" className="btn">Shop all products</Link>
            <Link href="/custom-orders#request-form" className="btn btn-alt">Order something custom</Link>
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", color: "var(--text-muted)", fontSize: 14 }}>
            {["Made to order", "Ships across India", "Pay with UPI or card"].map((t) => (
              <span key={t} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--mint)", display: "inline-block", flexShrink: 0 }} />
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="art" style={{ position: "relative", width: "100%", maxWidth: 500, justifySelf: "center", aspectRatio: "1", borderRadius: "24px", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>
          <Image
            src="/hero_placeholder.jpg"
            alt="Handmade crochet toys and bags"
            fill
            sizes="(max-width: 1023px) 100vw, 50vw"
            style={{ objectFit: "cover" }}
            priority
          />
          <span style={{
            position: "absolute", top: "6%", left: "4%",
            background: "var(--surface)", border: "2px solid var(--line)",
            borderRadius: 18, padding: "8px 14px", fontWeight: 700, fontSize: 14, zIndex: 2,
            color: "var(--ink)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}>
            100% cotton yarn
          </span>
          <span style={{
            position: "absolute", bottom: "8%", right: "4%",
            background: "var(--mint)", color: "#fff", borderRadius: 18,
            padding: "8px 14px", fontWeight: 700, fontSize: 14, zIndex: 2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}>
            Gift wrapping available
          </span>
        </div>
      </section>

      {/* ── §9.1 CATEGORY CARDS ROW (circle photos) ─────────────────── */}
      <section className="band--ice-mint" style={{ padding: "48px 0" }} aria-labelledby="cats-heading">
        <div className="container">
          <div className="section-head">
            <h2 id="cats-heading" style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.6rem,3vw,2.25rem)", fontWeight: 500, marginBottom: 12 }}>
              Shop by category
            </h2>
            <Link href="/shop" className="btn btn--white">View All</Link>
          </div>
          <div className="cat-row" role="list">
            {CATEGORY_CARDS.map((cat) => (
              <Link
                key={cat.slug}
                href={`/shop?category=${cat.slug}`}
                className="cat-card"
                role="listitem"
              >
                <span>{cat.label}</span>
                <div style={{
                  width: "100%", aspectRatio: "1/1", borderRadius: "50%",
                  background: "#EEF1F4", position: "relative", overflow: "hidden"
                }}>
                  <Image src={cat.image} alt={cat.label} fill sizes="160px" style={{ objectFit: "cover" }} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR TOP PICKS ────────────────────────────────────────── */}
      <section className="sec" id="shop" aria-labelledby="featured-heading">
        <div style={{ padding: "0 var(--pad-mobile)", maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
            <div>
              <h2 id="featured-heading" className="text-section">Our top picks</h2>
              <p style={{ color: "var(--mute)", margin: "6px 0 0" }}>The pieces customers love most right now.</p>
            </div>
            <Link href="/shop" className="btn btn--white">See all products</Link>
          </div>

          {featured.length > 0 ? (
            <div className="feat-grid">
              {featured.map((p, i) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  slug={p.slug}
                  price={p.price}
                  originalPrice={p.originalPrice}
                  discountPercent={p.discountPercent}
                  primaryImage={p.primaryImage}
                  secondaryImage={p.secondaryImage}
                  inStock={p.inStock}
                  index={i}
                />
              ))}
            </div>
          ) : (
            <div style={{ padding: "48px 0", textAlign: "center", color: "var(--mute)" }}>
              <YarnMascot size={80} animate={false} />
              <p style={{ marginTop: 12 }}>Featured products coming soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* ── §9.2 SPLIT SECTION — Crochet Kits / Custom Orders ──────── */}
      <section className="band band--ice" aria-label="Custom orders and kits">
        <div className="container co-intro">
          <div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 500, fontSize: "clamp(1.6rem,3vw,2.25rem)", marginBottom: 12 }}>
              Custom orders, made for you
            </h2>
            <p>
              Have something special in mind? We&apos;ll crochet it in your colours, your style, your size. We also make <strong>custom crochet outfits for babies</strong>, including dresses, sweaters, hats and shoes. They&apos;re perfect for special occasions, gifts, or something uniquely yours.
            </p>
            <p style={{ marginTop: 12 }}>
              Whether it&apos;s everyday wear or a full superhero or anime baby suit, we can bring your idea to life.
            </p>
            <Link href="/custom-orders#request-form" className="btn btn--white" style={{ marginTop: 20, display: "inline-flex" }}>
              Request a custom piece
            </Link>
            <p style={{ fontSize: 14, marginTop: 12, color: "var(--text-muted)" }}>Fill in the request form and we&apos;ll reach back to you by email.</p>
          </div>
          <div className="co-photos" aria-hidden="true">
            <div className="a">
              <Image src="/girl_outfit.jpg" alt="Custom crochet baby girl outfit" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: "cover" }} />
            </div>
            <div className="b">
              <Image src="/boy_outfit.jpg" alt="Custom crochet baby boy outfit" fill sizes="(max-width: 768px) 50vw, 30vw" style={{ objectFit: "cover" }} />
            </div>
          </div>
        </div>

        <div className="container">
          {/* ── CHARACTER REQUESTS BLOCK ── */}
          <div className="co-char">
            <div>
              <h3 style={{ fontSize: 22, marginBottom: 10, fontFamily: "var(--font-heading)", fontWeight: 600 }}>Have a favourite character? We&apos;ll make it.</h3>
              <p style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>We take custom orders for <strong>any anime or superhero reference</strong>. Send us the character, a picture, or just the name, and we&apos;ll crochet it as a baby outfit, hat, set or toy.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
                {["Superheroes", "Anime", "Cartoons", "Video games"].map(t => (
                  <span key={t} style={{ background: "#ffe3ee", color: "#a3285f", borderRadius: 999, padding: "6px 14px", fontSize: 13.5, fontWeight: 500 }}>{t}</span>
                ))}
              </div>
              <Link href="/custom-orders#request-form" className="btn" style={{ marginTop: 22, display: "inline-flex" }}>
                Request a custom piece
              </Link>
              <p style={{ fontSize: 14, marginTop: 12, color: "var(--text-muted)" }}>Send us the character and your details on the request page. We&apos;ll reach back to you by email.</p>
            </div>
            <ul className="co-steps">
              {[
                { t: "Share your idea.", d: "Fill in the request page with the character name or reference photos." },
                { t: "Tell us the details.", d: "Size, colours and when you need it by." },
                { t: "We reach back to you.", d: "We'll email you to confirm the design and price. We start crocheting once you approve." }
              ].map((s, i) => (
                <li key={i}>
                  <span><b style={{ color: "var(--ink)", fontWeight: 600 }}>{s.t}</b> {s.d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── SUPERHERO & ANIME CAROUSEL ── */}
        {/* <div style={{ marginTop: 64, paddingBottom: 16 }}>
          <div className="container" style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 24, fontFamily: "var(--font-heading)", fontWeight: 600 }}>Superhero &amp; Anime Knits</h3>
            <p style={{ marginTop: 4, fontSize: 15, color: "var(--text-muted)" }}>A few of our made-to-order pieces. Yours could be next.</p>
          </div>
          <div className="hide-scroll" style={{
            display: "flex", gap: 16, overflowX: "auto", scrollSnapType: "x mandatory", 
            paddingInline: "max(var(--pad-mobile), calc((100vw - 1160px) / 2))",
          }}>
            {[
              { src: "/superhero_batman.jpg", title: "Batman set", sub: "Cowl, cape and gauntlets" },
              { src: "/superhero_spiderman.jpg", title: "Spider-Man set", sub: "Bodysuit, hat and booties" },
              { src: "/superhero_naruto.png", title: "Naruto set", sub: "Jacket, pants and headband" },
              { src: "/superhero_luffy.jpg", title: "Luffy set", sub: "Straw hat, vest and shorts" },
              { src: "/superhero_zoro.png", title: "Zoro set", sub: "Coat, sash and hat" }
            ].map((item, i) => (
              <figure key={i} style={{ flex: "0 0 min(260px, 72%)", scrollSnapAlign: "start", margin: 0 }}>
                <div style={{ position: "relative", aspectRatio: "4/5", borderRadius: 18, overflow: "hidden", background: "#d8e4f2" }}>
                  <Image src={item.src} alt={item.title} fill sizes="260px" style={{ objectFit: "cover" }} />
                </div>
                <figcaption style={{ padding: "10px 4px 0", fontWeight: 600, fontSize: 15 }}>
                  {item.title}
                  <small style={{ display: "block", fontWeight: 400, color: "var(--text-muted)", fontSize: 13, marginTop: 2 }}>{item.sub}</small>
                </figcaption>
              </figure>
            ))}
            <div style={{ 
              flex: "0 0 min(260px, 72%)", scrollSnapAlign: "start", 
              background: "var(--ink)", borderRadius: 18, padding: 24, display: "flex", flexDirection: "column", justifyContent: "center" 
            }}>
              <h4 style={{ color: "#fff", fontSize: 20, lineHeight: 1.3, margin: "0 0 10px", fontWeight: 600 }}>Don&apos;t see your character?</h4>
              <p style={{ color: "#c9d6e8", fontSize: 15, marginBottom: 20 }}>Tell us the name or send a picture. We&apos;ll reach back by email.</p>
              <Link href="/custom-orders" className="btn btn--white" style={{ alignSelf: "flex-start", padding: "10px 18px", fontSize: 14 }}>
                Request a custom piece
              </Link>
            </div>
          </div>
        </div> */}
      </section>

      {/* ── §9.3 STAGGERED COLLECTION TILES ─────────────────────────── */}
      <section className="sec" aria-labelledby="collections-heading">
        <div className="container">
          <h2 id="collections-heading" className="text-section" style={{ textAlign: "center", marginBottom: 8 }}>
            Explore collections
          </h2>
          <p className="page-intro">Everything is crocheted by hand, made to order — no two pieces are identical.</p>
          <div className="tiles">
            {COLLECTION_TILES.map((tile) => (
              <Link key={tile.href} href={tile.href} className="coll-tile">
                <div style={{
                  width: "100%", height: "100%",
                  background: tile.bg,
                  position: "relative", overflow: "hidden"
                }}>
                  <Image src={tile.image} alt={tile.label} fill sizes="(max-width: 768px) 50vw, 33vw" style={{ objectFit: "cover" }} />
                </div>
                <span className="coll-tile__label">{tile.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── §9.2 SPLIT (reversed) — Learn / Story ───────────────────── */}
      <section className="band band--ice" aria-label="Our story">
        <div className="container split split--reverse">
          <div className="split__text">
            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 500, fontSize: "clamp(1.6rem,3vw,2.25rem)", marginBottom: 12 }}>
              Made in Kanniyakumari, with love
            </h2>
            <p>
              Every stitch is made by Oviya and her team in Kanniyakumari. We crochet after you order, so each piece is fresh, personalised and made with full attention.
            </p>
            <Link href="/about" className="btn btn--white" style={{ marginTop: 20, display: "inline-flex" }}>
              Our story
            </Link>
          </div>
          <div className="collage" aria-hidden="true">
            <div className="collage__back" style={{
              borderRadius: "var(--radius-img)",
              overflow: "hidden",
              boxShadow: "0 12px 32px rgba(0,0,0,0.1)",
              position: "absolute",
              right: 0, top: 0, width: "70%", aspectRatio: "1/1"
            }}>
              <Image src="/kanniyakumari_scenic_1.jpg" alt="Beautiful sunrise in Kanniyakumari with subtle crochet texture" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: "cover" }} />
            </div>
            <div className="collage__front" style={{
              borderRadius: "var(--radius-img)",
              overflow: "hidden",
              boxShadow: "0 12px 32px rgba(0,0,0,0.1)",
              border: "4px solid var(--white)",
              position: "absolute",
              left: 0, bottom: "20px", width: "42%", aspectRatio: "1/1"
            }}>
              <Image src="/kanniyakumari_scenic_2.jpg" alt="Palm trees and coast in Kanniyakumari with cozy handmade crochet texture" fill sizes="(max-width: 768px) 50vw, 30vw" style={{ objectFit: "cover" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW YOUR ORDER IS MADE ──────────────────────────────────── */}
      <section className="sec band" id="how" aria-labelledby="how-heading">
        <div style={{ padding: "36px var(--pad-mobile)", maxWidth: 1160, margin: "0 auto" }}>
          <h2 id="how-heading" className="text-section" style={{ marginBottom: 6 }}>How your order is made</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>Every piece is stitched after you order, so it is truly yours.</p>
          <div className="steps-grid">
            {HOW_STEPS.map((step, i) => (
              <div key={step.title} style={{
                background: "var(--white)", borderRadius: 22, padding: 18,
                border: "1px solid var(--line)",
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", background: "var(--mint)",
                  color: "#fff", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 18,
                  display: "grid", placeItems: "center", marginBottom: 10,
                }}>
                  {i + 1}
                </div>
                <b style={{ fontFamily: "var(--font-heading)", fontWeight: 500, fontSize: 18, color: "var(--ink)" }}>{step.title}</b>
                <p style={{ margin: "4px 0 0", color: "var(--text-muted)" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── FRESH FROM THE HOOK ─────────────────────────────────────── */}
      {/* <section className="sec" id="story" aria-labelledby="ig-heading">
        <div style={{ padding: "0 var(--pad-mobile)", maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
            <div>
              <h2 id="ig-heading" className="text-section">Fresh from the hook</h2>
              <p style={{ color: "var(--mute)", margin: "6px 0 0" }}>Behind the scenes on @oviyas_crochet</p>
            </div>
            <a
              href={process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "https://www.instagram.com/oviyas_crochet"}
              target="_blank" rel="noopener noreferrer"
              className="btn btn--white"
            >
              Follow on Instagram
            </a>
          </div>
          <div className="ig-grid">
            {Array.from({ length: 6 }).map((_, i) => {
              const img = gallery[i];
              return (
                <div key={i} className={`ph ${phClass(i)}`} style={{ borderRadius: 16, aspectRatio: "1", position: "relative", overflow: "hidden" }}>
                  {img && (
                    <Image src={img.url} alt={img.alt} fill sizes="(min-width:768px) 16vw, 33vw" style={{ objectFit: "cover" }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section> */}

      {/* ── HAPPY HOMES ─────────────────────────────────────────────── */}
      <section className="sec band--ice-mint" aria-labelledby="reviews-heading" style={{ paddingTop: 0 }}>
        <div style={{ padding: "48px var(--pad-mobile)", maxWidth: 1160, margin: "0 auto" }}>
          <h2 id="reviews-heading" className="text-section" style={{ marginBottom: 8 }}>Happy homes 💬</h2>
          <p className="page-intro" style={{ marginBottom: 24 }}>Real reviews from real customers across India.</p>
          <div className="quotes-grid">
            {testimonials.map((t) => (
              <div key={t.id} style={{
                background: "var(--white)", border: "1px solid var(--line)",
                borderRadius: "var(--radius-card)", padding: 20,
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}>
                <div style={{ color: "var(--star)", marginBottom: 8 }}>★★★★★</div>
                <p style={{ margin: "0 0 10px", lineHeight: 1.6, fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "1.05rem" }}>&ldquo;{t.quote}&rdquo;</p>
                <small style={{ color: "var(--text-muted)", fontWeight: 600 }}>{t.name}, {t.town}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ──────────────────────────────────────────────── */}
      <section className="sec" aria-labelledby="nl-heading" style={{ paddingTop: 0 }}>
        <div style={{ padding: "0 var(--pad-mobile)", maxWidth: 1160, margin: "0 auto" }}>
          <div style={{
            background: "var(--ice)", border: "1px solid var(--line)",
            borderRadius: "var(--radius-img)", padding: "40px 32px", textAlign: "center",
          }}>
            <h2 id="nl-heading" className="text-section">Get 10% off your first order</h2>
            <p className="page-intro" style={{ marginBottom: 20 }}>Join for new arrivals and festive offers. No spam.</p>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
}
