"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, User, Home, Store, LogOut, Sun, Moon, Search, Heart } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { YarnMascot } from "@/components/ui/yarn-mascot";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";

interface HeaderProps {
  isAdmin?: boolean;
  offerText?: string;
}

function ThemeToggle() {
  const { data: session } = useSession();
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const sessionTheme = (session?.user as { theme?: string } | undefined)?.theme;
    const stored = (sessionTheme && sessionTheme !== "system")
      ? sessionTheme
      : (localStorage.getItem("theme") ?? "system");

    setTheme(stored as "light" | "dark" | "system");
    if (stored !== "system") {
      document.documentElement.setAttribute("data-theme", stored);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.email]);

  const toggle = () => {
    const root = document.documentElement;
    const isDark =
      theme === "dark" ||
      (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

    const next: "light" | "dark" = isDark ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setTheme(next);

    if (session?.user) {
      fetch("/api/auth/theme", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: next }),
      }).catch(() => { /* ignore */ });
    }
  };

  const isDark = mounted && (
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      suppressHydrationWarning
      style={{
        background: "none",
        border: "1.5px solid var(--line)",
        borderRadius: 8,
        width: 36, height: 36,
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", color: "var(--ink)", flexShrink: 0,
        transition: "color 0.2s, border-color 0.2s",
      }}
    >
      {mounted ? (isDark ? <Sun size={16} /> : <Moon size={16} />) : <Moon size={16} />}
    </button>
  );
}

export function Header({ isAdmin = false, offerText }: HeaderProps) {
  const itemCount = useCartStore((s) => s.itemCount());
  const toggleCart = useCartStore((s) => s.toggleCart);
  const pathname = usePathname();
  const { data: session } = useSession();

  const navLinks = isAdmin
    ? [
        { href: "/admin/orders",    label: "Orders" },
        { href: "/admin/products",  label: "Products" },
        { href: "/admin/discounts", label: "Discounts" },
        { href: "/admin/customers", label: "Customers" },
      ]
    : [
        { href: "/shop",           label: "Shop" },
        { href: "/custom-orders",  label: "Custom Orders" },
        { href: "/about",          label: "Our Story" },
        { href: "/contact",        label: "Contact Us" },
      ];

  const MESSAGES = [
    offerText,
    "Free shipping over ₹999 · Handmade to order · Ships in 3–5 days",
  ].filter(Boolean) as string[];
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    if (MESSAGES.length <= 1) return;
    const t = setInterval(() => setMsgIdx((i) => (i + 1) % MESSAGES.length), 4000);
    return () => clearInterval(t);
  }, [MESSAGES.length]);

  return (
    <>
      {/* Row 1: v2 Top strip (ice-blue with social icons) */}
      {!isAdmin && (
        <div className="topbar" role="complementary" aria-label="Social links">
          <div className="container">
            <a
              href="https://www.instagram.com/oviyas_crochet"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--ink)", textDecoration: "none", fontSize: "0.85rem" }}
            >
              {/* Instagram icon */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              <span>@oviyas_crochet</span>
            </a>
            <a
              href="https://www.youtube.com/@oviyas_crochet"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--ink)", textDecoration: "none", fontSize: "0.85rem" }}
            >
              {/* YouTube icon */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            {session?.user?.name ? (
              <span style={{ marginLeft: "auto", fontSize: "0.8rem", color: "var(--ink)", fontWeight: 600 }}>
                Hello, {session.user.name}
              </span>
            ) : (
              MESSAGES[msgIdx] && (
                <span style={{ marginLeft: "auto", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  {MESSAGES[msgIdx]}
                </span>
              )
            )}
          </div>
        </div>
      )}

      {/* Row 2: v2 Main header (white, sticky) */}
      <header className={isAdmin ? "hdr" : "site-header"} role="banner">
        <div className={isAdmin ? "" : "header__row"} style={isAdmin ? { display: "flex", alignItems: "center", gap: 10, padding: "0 24px", height: 76 } : undefined}>
          {/* Logo */}
          <Link
            href={isAdmin ? "/admin" : "/"}
            className="logo-circle"
            aria-label="Oviya's Crochet — home"
            style={{ textDecoration: "none" }}
          >
            <YarnMascot size={26} animate={false} />
          </Link>
          {isAdmin && (
            <span className="brand-text">Admin</span>
          )}

          {/* Desktop nav */}
          {!isAdmin ? (
            <nav className="nav" aria-label="Main navigation">
              <ul>
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={pathname.startsWith(link.href) ? "active" : ""}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : (
            <nav style={{ display: "flex", gap: 20, marginRight: 12 }} aria-label="Admin navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    color: "var(--ink)",
                    textDecoration: pathname.startsWith(link.href) ? "underline" : "none",
                    textDecorationColor: "var(--mint)",
                    fontWeight: pathname.startsWith(link.href) ? 600 : 400,
                    fontSize: "0.875rem",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Header actions */}
          <div className="header__actions">
            {/* Search */}
            {!isAdmin && (
              <button
                aria-label="Search"
                id="search-open-btn"
                style={{
                  background: "none",
                  border: "1.5px solid var(--line)",
                  borderRadius: 8,
                  width: 36, height: 36,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "var(--ink)", flexShrink: 0,
                  transition: "border-color 0.15s, color 0.15s",
                }}
                onClick={() => {
                  const el = document.getElementById("search-overlay");
                  if (el) { el.classList.add("is-open"); (el.querySelector("input") as HTMLInputElement)?.focus(); }
                }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.borderColor = "var(--mint)"; (e.target as HTMLElement).style.color = "var(--mint)"; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.borderColor = "var(--line)"; (e.target as HTMLElement).style.color = "var(--ink)"; }}
              >
                <Search size={16} />
              </button>
            )}

            {/* Theme toggle (hidden as per request) */}
            {/* {!isAdmin && <ThemeToggle />} */}

            {isAdmin ? (
              <button
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
                className="btn btn-sm"
                aria-label="Sign out"
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <LogOut size={14} />
                Sign out
              </button>
            ) : (
              <>
                {/* Wishlist */}
                <button
                  aria-label="Wishlist"
                  style={{
                    background: "none",
                    border: "1.5px solid var(--line)",
                    borderRadius: 8,
                    width: 36, height: 36,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", color: "var(--ink)", flexShrink: 0,
                  }}
                >
                  <Heart size={16} />
                </button>

                {/* Account */}
                <Link
                  href={session?.user ? "/account" : "/account/login"}
                  aria-label={session?.user ? "My account" : "Sign in"}
                  style={{
                    background: "none",
                    border: "1.5px solid var(--line)",
                    borderRadius: 8,
                    width: 36, height: 36,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--ink)",
                    textDecoration: "none", flexShrink: 0,
                  }}
                >
                  <User size={16} />
                </Link>

                {/* Cart */}
                <button
                  onClick={toggleCart}
                  aria-label={`Open cart, ${itemCount} item${itemCount !== 1 ? "s" : ""}`}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: "var(--mint)", color: "#fff",
                    border: 0, borderRadius: "var(--radius-btn)",
                    padding: "0.5em 1.1em", fontSize: "0.875rem",
                    fontWeight: 700, cursor: "pointer", minHeight: 36,
                    fontFamily: "var(--font-body)", position: "relative",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--mint-hover)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--mint)"; }}
                >
                  <ShoppingBag size={16} aria-hidden="true" />
                  Cart
                  {itemCount > 0 && (
                    <span
                      aria-live="polite"
                      style={{
                        position: "absolute",
                        top: -6, right: -6,
                        background: "var(--price)",
                        color: "#fff",
                        fontSize: 11,
                        borderRadius: "var(--radius-btn)",
                        minWidth: 20, height: 20,
                        display: "grid", placeItems: "center",
                        fontWeight: 700,
                        padding: "0 4px",
                      }}
                    >
                      {itemCount}
                    </span>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Desktop nav media query */}
      <style>{`
        @media (max-width: 1023px) {
          .site-header .nav { display: none; }
        }
      `}</style>
    </>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.itemCount());
  const toggleCart = useCartStore((s) => s.toggleCart);
  const { data: session } = useSession();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      <Link href="/" className={`bnav-btn ${isActive("/") ? "active" : ""}`}>
        <Home size={20} aria-hidden="true" />
        Home
      </Link>
      <Link href="/shop" className={`bnav-btn ${isActive("/shop") ? "active" : ""}`}>
        <Store size={20} aria-hidden="true" />
        Shop
      </Link>
      <button
        className={`bnav-btn ${itemCount > 0 ? "active" : ""}`}
        onClick={toggleCart}
        aria-label={`Cart, ${itemCount} items`}
      >
        <span style={{ position: "relative", display: "inline-block" }}>
          <ShoppingBag size={20} aria-hidden="true" />
          {itemCount > 0 && (
            <span
              aria-live="polite"
              style={{
                position: "absolute",
                top: -4, right: -6,
                background: "var(--mint)",
                color: "#fff",
                fontSize: 10,
                borderRadius: "var(--radius-btn)",
                minWidth: 16, height: 16,
                display: "grid", placeItems: "center",
                fontWeight: 700,
              }}
            >
              {itemCount}
            </span>
          )}
        </span>
        Cart
      </button>
      <Link
        href={session?.user ? "/account" : "/account/login"}
        className={`bnav-btn ${isActive("/account") ? "active" : ""}`}
      >
        <User size={20} aria-hidden="true" />
        {session?.user ? "Account" : "Login"}
      </Link>
    </nav>
  );
}
