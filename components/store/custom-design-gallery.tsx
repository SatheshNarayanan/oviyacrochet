"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

const slideshowDesigns = [
  { id: "batman", character: "Batman", title: "Batman-inspired Design", blurb: "Dark cowl with ears, cape and gauntlet cuffs, finished with a bold yellow accent.", image: "/images/custom-gallery/batman.webp" },
  { id: "levi", character: "Levi", title: "Levi-inspired Design", blurb: "Scout regiment cape and detailed Survey Corps aesthetic.", image: "/images/custom-gallery/levi.webp" },
  { id: "luffy", character: "Luffy", title: "Luffy-inspired Design", blurb: "Straw-hat style cap with a red band, red vest and blue shorts.", image: "/images/custom-gallery/luffy.webp" },
  { id: "naruto", character: "Naruto", title: "Naruto-inspired Design", blurb: "Orange and navy jacket set with a headband and spiky-hair hat.", image: "/images/custom-gallery/naruto.webp" },
  { id: "zoro", character: "Zoro", title: "Zoro-inspired Design", blurb: "Deep green coat with a red sash, green hat and miniature crochet swords.", image: "/images/custom-gallery/zoro.webp" },
  { id: "mermaid-princess", character: "Mermaid Princess", title: "Mermaid Princess-inspired Design", blurb: "Beautiful under-the-sea aesthetics with scale patterns and elegant fins.", image: "/images/custom-gallery/mermaid%20princess.webp" },
  { id: "micky-mouse", character: "Mickey Mouse", title: "Mickey Mouse-inspired Design", blurb: "Iconic red, white, and black style featuring classic round mouse ears.", image: "/images/custom-gallery/micky%20mouse.webp" },
  { id: "pikachu", character: "Pikachu", title: "Pikachu-inspired Design", blurb: "Bright yellow set with pointed black-tipped ears and a lightning bolt tail.", image: "/images/custom-gallery/pikachu.webp" },
];

export function CustomDesignGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slideshowDesigns.length);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slideshowDesigns.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const currentDesign = slideshowDesigns[currentIndex];

  return (
    <div>
      {/* Mobile Carousel View (< 768px) */}
      <div className="md:hidden" style={{ maxWidth: "560px", margin: "0 auto" }}>
        <div style={{ position: "relative", background: "var(--surface)", borderRadius: "24px", overflow: "hidden", boxShadow: "0 12px 40px rgba(0,0,0,0.08)", border: "1px solid var(--line)" }}>
          <div style={{ position: "relative", width: "100%", aspectRatio: "4/5", backgroundColor: "var(--ice)" }}>
            {slideshowDesigns.map((design, index) => (
              <div
                key={design.id}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  opacity: index === currentIndex ? 1 : 0,
                  transition: "opacity 0.6s ease-in-out",
                  pointerEvents: index === currentIndex ? "auto" : "none",
                }}
              >
                <Image 
                  src={design.image} 
                  alt={design.title} 
                  fill 
                  sizes="(max-width: 600px) 100vw, 600px" 
                  style={{ objectFit: "cover" }} 
                  priority={index === 0} 
                />
              </div>
            ))}
            
            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              style={{ position: "absolute", top: "50%", left: "12px", transform: "translateY(-50%)", width: "40px", height: "40px", borderRadius: "50%", background: "var(--surface)", border: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 10, transition: "transform 0.2s" }}
              aria-label="Previous image"
              onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-50%) scale(1.05)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "translateY(-50%) scale(1)")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            
            <button
              onClick={nextSlide}
              style={{ position: "absolute", top: "50%", right: "12px", transform: "translateY(-50%)", width: "40px", height: "40px", borderRadius: "50%", background: "var(--surface)", border: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 10, transition: "transform 0.2s" }}
              aria-label="Next image"
              onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-50%) scale(1.05)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "translateY(-50%) scale(1)")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
            
            {/* Slide Indicators */}
            <div style={{ position: "absolute", bottom: "16px", left: "0", right: "0", display: "flex", justifyContent: "center", gap: "6px", zIndex: 10 }}>
              {slideshowDesigns.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  style={{ width: index === currentIndex ? "20px" : "6px", height: "6px", borderRadius: "3px", background: index === currentIndex ? "var(--mint)" : "rgba(255,255,255,0.8)", border: "none", cursor: "pointer", transition: "all 0.3s ease", padding: 0 }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div style={{ padding: "24px 20px", textAlign: "center" }}>
            <h3 style={{ fontSize: "1.4rem", marginBottom: "8px", color: "var(--ink)", fontFamily: "var(--font-heading)" }}>{currentDesign.title}</h3>
            <p style={{ fontSize: "0.95rem", color: "var(--text)", marginBottom: "20px", maxWidth: "600px", marginInline: "auto" }}>{currentDesign.blurb}</p>
            <Link href={`?character=${currentDesign.character}&item=Outfit or dress&title=${encodeURIComponent(currentDesign.title)}#request-form`} className="btn btn--primary" style={{ padding: "12px 24px", fontSize: "1rem" }}>
              Request this design
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop Grid View (>= 768px) */}
      <div className="hidden md:grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" }}>
        {slideshowDesigns.map((design) => (
          <div key={design.id} style={{ display: "flex", flexDirection: "column", background: "var(--surface)", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", border: "1px solid var(--line)", transition: "transform 0.2s, box-shadow 0.2s" }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.1)"; }} onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"; }}>
            <div style={{ position: "relative", width: "100%", aspectRatio: "4/5", background: "var(--ice)" }}>
              <Image 
                src={design.image} 
                alt={design.title} 
                fill 
                sizes="(max-width: 1200px) 33vw, 25vw" 
                style={{ objectFit: "cover" }} 
              />
            </div>
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
              <h3 style={{ fontSize: "1.15rem", marginBottom: "8px", color: "var(--ink)", fontFamily: "var(--font-heading)" }}>{design.title}</h3>
              <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", marginBottom: "20px", flexGrow: 1 }}>{design.blurb}</p>
              <Link href={`?character=${design.character}&item=Outfit or dress&title=${encodeURIComponent(design.title)}#request-form`} className="btn btn--white" style={{ textAlign: "center", width: "100%" }}>
                Request this design
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Shared Call to Action */}
      <div style={{ display: "flex", flexDirection: "column", background: "var(--ice-mint)", borderRadius: "16px", padding: "40px 24px", justifyContent: "center", alignItems: "center", textAlign: "center", marginTop: "48px", border: "1px dashed var(--mint)" }}>
        <h3 style={{ fontSize: "1.3rem", marginBottom: "16px", color: "var(--ink)", fontFamily: "var(--font-heading)" }}>Don't see your character?</h3>
        <p style={{ fontSize: "1rem", color: "var(--text-muted)", marginBottom: "24px", maxWidth: "500px" }}>We can make almost any character! Whether it's from an anime, game, or movie—tell us what you have in mind.</p>
        <a href="#request-form" className="btn btn--white" style={{ border: "2px solid var(--ink)", padding: "12px 24px" }}>Request a custom piece</a>
      </div>
    </div>
  );
}
