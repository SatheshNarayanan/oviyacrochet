import type { Metadata } from "next";
import Image from "next/image";

import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Our Story: Handmade in Kanniyakumari",
  description: "Meet Oviya and her team, who crochet every piece by hand in Kanniyakumari. See how each made-to-order piece is made.",
  path: "/about"
});

export default function AboutPage() {
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px var(--pad-mobile) 60px" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <div
            style={{
              padding: "16px 28px",
              background: "#ffffff",
              borderRadius: 20,
              // boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
              // border: "1px solid var(--line)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              maxWidth: "100%",
            }}
          >
            <Image
              src="/oc-logo.png"
              alt="Oviyas Crochet logo"
              width={340}
              height={156}
              style={{ width: "100%", maxWidth: 320, height: "auto", objectFit: "contain" }}
              priority
            />
          </div>
        </div>
        <h1 className="text-hero" style={{ marginBottom: 12, color: "var(--pri)" }}>Our story</h1>
        <p style={{ color: "var(--mute)", fontSize: 16 }}>Handmade with love in Kanniyakumari 🌸</p>
      </div>

      <div style={{ display: "grid", gap: 32 }}>
        <section>
          <h2 className="text-section" style={{ marginBottom: 12 }}>Hello, I'm Oviya!</h2>
          <p style={{ lineHeight: 1.8, color: "var(--ink)", marginBottom: 12 }}>
            I'm a crochet artist from Kanniyakumari, India, and I've been crocheting since 2019.
            What started as a hobby quickly became a passion — I love the meditative rhythm of the
            hook, the feel of soft cotton yarn, and the joy on people's faces when they receive
            something handmade just for them.
          </p>
          <p style={{ lineHeight: 1.8, color: "var(--ink)" }}>
            Every piece in this shop is made to order by me, in my home studio.
            No factories, no mass production — just slow, intentional craft.
          </p>
        </section>

        <div style={{ background: "var(--lav)", borderRadius: "var(--r-card)", padding: 24, border: "2px dashed var(--line)" }}>
          <h2 className="text-box-h2" style={{ marginBottom: 16 }}>Why handmade?</h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { emoji: "🧶", text: "Every stitch is placed with care and intention." },
              { emoji: "🌱", text: "Sustainably made — no overproduction, minimal waste." },
              { emoji: "💝", text: "Your order is unique — made specifically for you." },
              { emoji: "📦", text: "Ships in 5–7 days after your order is placed." },
            ].map((item) => (
              <li key={item.emoji} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>{item.emoji}</span>
                <p style={{ margin: 0, lineHeight: 1.6 }}>{item.text}</p>
              </li>
            ))}
          </ul>
        </div>

        <section>
          <h2 className="text-section" style={{ marginBottom: 12 }}>Follow the journey</h2>
          <p style={{ lineHeight: 1.8, color: "var(--ink)", marginBottom: 16 }}>
            I share behind-the-scenes peeks, new design previews and finished pieces on Instagram.
            Come say hello!
          </p>
          <a
            href="https://www.instagram.com/oviyas_crochet"
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            style={{ display: "inline-flex" }}
          >
            Follow @oviyas_crochet
          </a>
        </section>
      </div>
    </div>
  );
}
