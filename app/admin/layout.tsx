import { Header } from "@/components/ui/header";
import { ToastProvider } from "@/components/ui/toast";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: { default: "Admin — Oviya's Crochet", template: "%s — Admin | Oviya's Crochet" },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <Header isAdmin />
      <main style={{ paddingBottom: 40 }}>{children}</main>
    </ToastProvider>
  );
}
