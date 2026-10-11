"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X, Search } from "lucide-react";

const POPULAR_SEARCHES = [
  "Crochet bag",
  "Amigurumi",
  "Baby gift",
  "Hair accessories",
  "Custom order",
];

const COLOR_SWATCHES = [
  { label: "Pink",   color: "#FF99CC", href: "/shop?color=pink" },
  { label: "Mint",   color: "#5CC9B3", href: "/shop?color=mint" },
  { label: "Black",  color: "#000000", href: "/shop?color=black" },
  { label: "Cream",  color: "#FAF5F0", href: "/shop?color=cream" },
  { label: "Lilac",  color: "#C8A2C8", href: "/shop?color=lilac" },
  { label: "Yellow", color: "#FFE066", href: "/shop?color=yellow" },
];

const RECOMMENDED_COLLECTIONS = [
  { label: "Bags",         href: "/shop?category=bags",          emoji: "👜" },
  { label: "Baby gifts",   href: "/shop?category=baby",          emoji: "🍼" },
  { label: "Amigurumi",    href: "/shop?category=amigurumi",     emoji: "🐻" },
  { label: "Gift hampers", href: "/shop?category=gift-hampers",  emoji: "🎁" },
];

/**
 * Full-screen search overlay (guide §4.6).
 * - Before typing: Recent searches (localStorage), Popular searches, Shop by color, Recommended collections
 * - While typing (≥2 chars, 200ms debounce): keyboard / URL navigation to /search?q=
 * - Keyboard: Esc closes, / focuses from anywhere
 */
export function SearchOverlay() {
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  /* Load recent searches from localStorage */
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("oc_recent_searches") ?? "[]");
      if (Array.isArray(stored)) setRecent(stored.slice(0, 5));
    } catch {/* ignore */}
  }, []);

  /* Keyboard: Esc = close, / = open */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const overlay = overlayRef.current;
      if (!overlay) return;
      if (e.key === "Escape") { overlay.classList.remove("is-open"); setQuery(""); }
      if (e.key === "/" && !overlay.classList.contains("is-open") &&
          !["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        overlay.classList.add("is-open");
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const close = () => {
    overlayRef.current?.classList.remove("is-open");
    setQuery("");
  };

  const submit = (q: string) => {
    if (!q.trim()) return;
    /* Save to recent */
    const next = [q, ...recent.filter((r) => r !== q)].slice(0, 5);
    setRecent(next);
    localStorage.setItem("oc_recent_searches", JSON.stringify(next));
    /* Navigate */
    window.location.href = `/shop?q=${encodeURIComponent(q.trim())}`;
  };

  const removeRecent = (term: string) => {
    const next = recent.filter((r) => r !== term);
    setRecent(next);
    localStorage.setItem("oc_recent_searches", JSON.stringify(next));
  };

  const isTyping = query.length >= 2;

  return (
    <div
      id="search-overlay"
      ref={overlayRef}
      className="search-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      {/* Input row */}
      <form
        role="search"
        onSubmit={(e) => { e.preventDefault(); submit(query); }}
      >
        <div className="search-overlay__input-row">
          <Search size={22} color="var(--color-pewter-gray)" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            placeholder="Search tops, bags, gifts, pink…"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search products"
          />
          <button
            type="button"
            onClick={close}
            aria-label="Close search"
            style={{ background: "none", border: 0, cursor: "pointer", color: "var(--text-muted)", display: "flex" }}
          >
            <X size={22} />
          </button>
        </div>
      </form>

      {/* Before typing: suggestions */}
      {!isTyping && (
        <>
          {recent.length > 0 && (
            <div className="search-overlay__section">
              <h4 className="eyebrow">Recent searches</h4>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {recent.map((r) => (
                  <span key={r} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <button
                      className="chip"
                      onClick={() => submit(r)}
                      style={{ cursor: "pointer" }}
                    >
                      {r}
                    </button>
                    <button
                      aria-label={`Remove ${r} from recent searches`}
                      onClick={() => removeRecent(r)}
                      style={{ background: "none", border: 0, cursor: "pointer", color: "var(--text-muted)", lineHeight: 1, padding: "0 2px", fontSize: "0.85rem" }}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="search-overlay__section">
            <h4 className="eyebrow">Popular searches</h4>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  className="chip"
                  onClick={() => submit(term)}
                  style={{ cursor: "pointer" }}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          <div className="search-overlay__section">
            <h4 className="eyebrow">Shop by color</h4>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {COLOR_SWATCHES.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  onClick={close}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, textDecoration: "none", color: "inherit" }}
                >
                  <span
                    style={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: s.color,
                      border: "1px solid rgba(0,0,0,0.15)",
                      display: "block",
                    }}
                    aria-hidden="true"
                  />
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{s.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="search-overlay__section">
            <h4 className="eyebrow">Recommended collections</h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
              {RECOMMENDED_COLLECTIONS.map((col) => (
                <Link
                  key={col.label}
                  href={col.href}
                  onClick={close}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    background: "var(--pink-wash)",
                    borderRadius: 14, padding: "12px 14px",
                    textDecoration: "none", color: "var(--color-jet-black)",
                    fontFamily: "var(--font-primary)", fontWeight: 500,
                  }}
                >
                  <span style={{ fontSize: "1.4rem" }} aria-hidden="true">{col.emoji}</span>
                  {col.label}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}

      {/* While typing: live results hint */}
      {isTyping && (
        <div className="search-overlay__section">
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Press Enter to see all results for &ldquo;<strong>{query}</strong>&rdquo;
          </p>
          <Link
            href={`/shop?q=${encodeURIComponent(query)}`}
            onClick={close}
            className="btn btn-secondary"
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            See all results for &ldquo;{query}&rdquo; →
          </Link>
        </div>
      )}
    </div>
  );
}
