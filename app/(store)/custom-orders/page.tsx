import { CustomDesignGallery } from "@/components/store/custom-design-gallery";
import { CustomRequestForm } from "@/components/store/custom-request-form";
import { Suspense } from "react";
import Image from "next/image";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = pageMetadata({
  title: "Custom Crochet Orders: Baby Outfits, Hats & Character Sets",
  description: "Request custom handmade crochet baby outfits, hats, keychains and superhero or anime-inspired sets. Send your idea and we'll reach back by email.",
  path: "/custom-orders",
});

export default function CustomOrdersPage() {
  const bJsonLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Custom Orders", path: "/custom-orders" },
  ]);

  return (
    <main className="page">
      <JsonLd data={bJsonLd} />
      {/* Hero */}
      <section className="band band--ice" style={{ padding: "64px 0", textAlign: "center" }}>
        <div className="container" style={{ maxWidth: "800px" }}>
          <h1 style={{ fontSize: "3rem", color: "var(--ink)", marginBottom: "24px", fontFamily: "var(--font-heading)" }}>
            Custom orders, made for you
          </h1>
          <p style={{ fontSize: "1.1rem", color: "var(--ink)", marginBottom: "32px", lineHeight: "1.6" }}>
            Have something special in mind? We'll crochet it in your colours, your style, your size. From everyday baby wear to superhero and anime-inspired sets, send us your idea and we'll bring it to life.
          </p>
          <a href="#request-form" className="btn btn--primary" style={{ padding: "14px 28px", fontSize: "1.1rem" }}>
            Request a custom piece
          </a>
          <p style={{ marginTop: "16px", fontSize: "0.9rem", color: "var(--text-muted)" }}>
            We'll reach back to you by email to confirm the design and price.
          </p>
        </div>
      </section>

      {/* What we can make */}
      <section className="container" style={{ padding: "80px 0" }}>
        <h2 style={{ fontSize: "2rem", color: "var(--ink)", textAlign: "center", marginBottom: "48px" }}>What we can make</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "32px" }}>
          {[
            { title: "Baby outfits and dresses", text: "Rompers, dresses, sweaters, jackets and full themed sets, made to your baby's size.", image: process.env.NEXT_PUBLIC_CLOUDFLARE_R2 ? `${process.env.NEXT_PUBLIC_CLOUDFLARE_R2}/app/outfits.jpg` : "/images/custom-orders/outfits.jpg" },
            { title: "Hats and beanies", text: "Cosy hats with ears, spikes, straw-hat brims and more, so your little one can dress up as their favourite character.", image: process.env.NEXT_PUBLIC_CLOUDFLARE_R2 ? `${process.env.NEXT_PUBLIC_CLOUDFLARE_R2}/app/hats.jpg` : "/images/custom-orders/hats.jpg" },
            { title: "Keychains", text: "Small handmade character keychains, a thoughtful gift for fans of any age.", image: process.env.NEXT_PUBLIC_CLOUDFLARE_R2 ? `${process.env.NEXT_PUBLIC_CLOUDFLARE_R2}/app/keychains.jpg` : "/images/custom-orders/keychains.jpg" },
            { title: "Accessories", text: "Booties, mittens, headbands, capes, bibs and photo-shoot props to complete the look.", image: process.env.NEXT_PUBLIC_CLOUDFLARE_R2 ? `${process.env.NEXT_PUBLIC_CLOUDFLARE_R2}/app/accessories.jpg` : "/images/custom-orders/accessories.jpg" }
          ].map(c => (
            <div key={c.title} style={{ background: "var(--ice)", borderRadius: "16px", textAlign: "center", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ position: "relative", width: "100%", aspectRatio: "4/3" }}>
                <Image src={c.image} alt={c.title} fill sizes="(max-width: 768px) 100vw, 25vw" style={{ objectFit: "cover" }} />
              </div>
              <div style={{ padding: "24px", flexGrow: 1, display: "flex", flexDirection: "column" }}>
                <h3 style={{ fontSize: "1.2rem", color: "var(--ink)", marginBottom: "12px" }}>{c.title}</h3>
                <p style={{ color: "var(--ink)", fontSize: "0.95rem" }}>{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="band band--ice" style={{ padding: "80px 0" }}>
        <div className="container" style={{ maxWidth: "900px" }}>
          <h2 style={{ fontSize: "2rem", color: "var(--ink)", textAlign: "center", marginBottom: "48px" }}>How it works</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "32px", textAlign: "center" }}>
            {[
              { title: "1. Share your idea", text: "Tell us the character or design, and add reference photos or links." },
              { title: "2. Tell us the details", text: "Size, colours and when you need it by." },
              { title: "3. We reach back to you", text: "We'll email you to confirm the design and price. We start crocheting once you approve." }
            ].map(c => (
              <div key={c.title}>
                <h3 style={{ fontSize: "1.2rem", color: "var(--ink)", marginBottom: "12px" }}>{c.title}</h3>
                <p style={{ color: "var(--ink)", fontSize: "0.95rem" }}>{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Superhero & anime designs */}
      <section className="container" style={{ padding: "80px 0" }}>
        <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 48px" }}>
          <h2 style={{ fontSize: "2.5rem", color: "var(--ink)", marginBottom: "16px" }}>Superhero & Anime Knits</h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "24px", padding: "8px 16px", background: "var(--ice)", borderRadius: "8px", display: "inline-block" }}>
            Previews are AI-generated design concepts. Finished pieces are handmade, so stitches, shades and proportions may differ slightly.
          </p>
          <p style={{ fontSize: "1.05rem", color: "var(--ink)", lineHeight: "1.6" }}>
            Fan of a character? We take custom orders for any anime, superhero, cartoon or game reference. These are design previews to spark ideas. Yours will be made to order and customised to you.
          </p>
        </div>

        <CustomDesignGallery />

        <p style={{ textAlign: "center", fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "48px" }}>
          Oviya's Crochet is not affiliated with or endorsed by the owners of the characters shown. All pieces are handmade, fan-inspired creations.
        </p>
      </section>

      {/* Request form */}
      <section className="band band--ice" style={{ padding: "80px 0" }} id="request-form">
        <div className="container">
          <h2 style={{ fontSize: "2rem", color: "var(--ink)", textAlign: "center", marginBottom: "48px" }}>Request a custom piece</h2>
          <Suspense fallback={<div style={{ textAlign: "center", padding: "48px" }}>Loading form...</div>}>
            <CustomRequestForm />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
