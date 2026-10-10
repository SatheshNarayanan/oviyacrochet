import Link from "next/link";
import { YarnMascotSleepy } from "@/components/ui/yarn-mascot";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div style={{
      minHeight: "70vh", display: "flex", alignItems: "center",
      justifyContent: "center", flexDirection: "column", gap: 16,
      textAlign: "center", padding: "40px 20px",
    }}>
      <YarnMascotSleepy size={100} />
      <h1 className="text-section" style={{ color: "var(--pri)" }}>404 — Page not found</h1>
      <p style={{ color: "var(--mute)", maxWidth: "36ch" }}>
        Oops! This page seems to have unravelled. Let's get you back to the good stuff.
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/" className="btn">Go home</Link>
        <Link href="/shop" className="btn btn-alt">Browse the shop</Link>
        <Link href="/custom-orders#request-form" className="btn btn-alt">Custom orders</Link>
      </div>
    </div>
  );
}
