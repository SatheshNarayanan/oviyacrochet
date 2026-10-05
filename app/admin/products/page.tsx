import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { AdminProductsClient } from "./products-client";

export const metadata: Metadata = { title: "Products — Admin | Oviya's Crochet" };

async function getCategories() {
  try {
    return await prisma.category.findMany({ orderBy: { name: "asc" } });
  } catch {
    return [];
  }
}

export default async function AdminProductsPage() {
  const categories = await getCategories();

  return (
    <div style={{ padding: "20px var(--pad-mobile) 40px" }}>
      <h1 className="text-section" style={{ marginBottom: 4 }}>New Product</h1>
      <p style={{ color: "var(--mute)", fontSize: 14, marginBottom: 24 }}>
        Fill in the details below to add a new product to the shop.
      </p>
      <AdminProductsClient categories={categories} />
    </div>
  );
}
