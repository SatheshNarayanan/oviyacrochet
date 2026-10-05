"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, User, Home, Store, LogOut, Sun, Moon } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { YarnMascot } from "@/components/ui/yarn-mascot";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface HeaderProps {
  isAdmin?: boolean;
  offerText?: string;
}

function ThemeToggle() {
  const { data: session } = useSession();
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");

  // On mount: prefer session (DB) value, fall back to localStorage
  useEffect(() => {
    const sessionTheme = (session?.user as { theme?: string } | undefined)?.theme;
    const stored = (sessionTheme && sessionTheme !== "system")
      ? sessionTheme
      : (localStorage.getItem("theme") ?? "system");

    setTheme(stored as "light" | "dark" | "system");
    if (stored !== "system") {
      document.documentElement.setAttribute("data-theme", stored);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.email]); // re-run when user changes

  const toggle = () => {
    const root = document.documentElement;
    const isDark =
      theme === "dark" ||
      (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

    const next: "light" | "dark" = isDark ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setTheme(next);

    // Persist to DB if logged in (best-effort, non-blocking)
    if (session?.user) {
      fetch("/api/auth/theme", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: next }),
      }).catch(() => { /* ignore */ });
    }
  };

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        background: "var(--surface)",
        border: "1.5px solid var(--line)",
        borderRadius: 10,
        width: 36, height: 36,
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", color: "var(--mute)", flexShrink: 0,
        transition: "color 0.2s",
      }}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
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
        { href: "/admin/orders", label: "Orders" },
        { href: "/admin/products", label: "Products" },
        { href: "/admin/discounts", label: "Discounts" },
        { href: "/admin/customers", label: "Customers" },
      ]
    : [
        { href: "/shop", label: "Shop" },
        { href: "/shop/amigurumi", label: "Amigurumi" },
        { href: "/shop/bags", label: "Bags" },
        { href: "/about", label: "About" },
      ];

  return (
    <>
      <header className="hdr" role="banner">
        <Link href={isAdmin ? "/admin" : "/"} className="logo-circle" aria-label="Oviya's Crochet — home">
          <YarnMascot size={26} animate={false} />
        </Link>
        <span className="brand-text">{isAdmin ? "Admin" : "oviyas_crochet"}</span>

        <nav className="nav" style={{ display: "none" }} aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname.startsWith(link.href) ? "font-bold" : ""}
              style={{ color: "var(--ink)", textDecoration: "none", fontWeight: 500 }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
          {/* Theme toggle — always visible */}
          {!isAdmin && <ThemeToggle />}

          {isAdmin ? (
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="btn btn-sm btn-alt"
              aria-label="Sign out"
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <LogOut size={14} />
              Sign out
            </button>
          ) : (
            <>
              {/* Account / Login button */}
              <Link
                href={session?.user ? "/account" : "/account/login"}
                aria-label={session?.user ? "My account" : "Sign in"}
                style={{
                  background: "var(--surface)",
                  border: "1.5px solid var(--line)",
                  borderRadius: 10,
                  width: 36, height: 36,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: session?.user ? "var(--pri)" : "var(--mute)",
                  textDecoration: "none", flexShrink: 0,
                }}
              >
                <User size={16} />
              </Link>

              {/* Cart button */}
              <button
                className="btn btn-sm"
                onClick={toggleCart}
                aria-label={`Open cart, ${itemCount} item${itemCount !== 1 ? "s" : ""}`}
                style={{ position: "relative" }}
              >
                <ShoppingBag size={16} aria-hidden="true" />
                Cart
                {itemCount > 0 && (
                  <span
                    aria-live="polite"
                    style={{
                      position: "absolute",
                      top: -6, right: -6,
                      background: "var(--pink)",
                      color: "#2E2442",
                      fontSize: 11,
                      borderRadius: "var(--r-pill)",
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
      </header>

      {/* Offer bar */}
      {offerText && (
        <div className="offer-bar" role="marquee" aria-label="Current offer">
          {offerText}
        </div>
      )}

      {/* Desktop nav injection via CSS */}
      <style>{`
        @media (min-width: 1024px) {
          .hdr nav.nav { display: flex !important; gap: 20px; margin-right: 12px; }
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
                background: "var(--pink)",
                color: "#2E2442",
                fontSize: 10,
                borderRadius: "var(--r-pill)",
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
