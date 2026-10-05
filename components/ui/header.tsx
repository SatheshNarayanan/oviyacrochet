"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, User, Home, Store } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { YarnMascot } from "@/components/ui/yarn-mascot";

interface HeaderProps {
  isAdmin?: boolean;
  offerText?: string;
}

export function Header({ isAdmin = false, offerText }: HeaderProps) {
  const itemCount = useCartStore((s) => s.itemCount());
  const toggleCart = useCartStore((s) => s.toggleCart);
  const pathname = usePathname();

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

        {!isAdmin && (
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
        )}
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
      <Link href="/account" className={`bnav-btn ${isActive("/account") ? "active" : ""}`}>
        <User size={20} aria-hidden="true" />
        Account
      </Link>
    </nav>
  );
}
