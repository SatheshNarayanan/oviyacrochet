import { Header } from "@/components/ui/header";
import { ToastProvider } from "@/components/ui/toast";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: { default: "Admin — Oviyas Crochet", template: "%s — Admin | Oviyas Crochet" },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <Header isAdmin />
      <main style={{ paddingBottom: 40 }}>{children}</main>
    </ToastProvider>
  );
}
