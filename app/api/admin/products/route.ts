import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, price, categoryId, images, isFeatured, isActive, details } = body;

    if (!name || !description || !price || !categoryId) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return NextResponse.json({ error: "Invalid price." }, { status: 400 });
    }

    // Generate unique slug
    let slug = slugify(name);
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parsedPrice,
        categoryId,
        isFeatured: isFeatured ?? false,
        isActive: isActive ?? true,
        details: details ?? undefined,
        images: {
          create: (images as { url: string; alt: string; position: number; isPrimary: boolean }[]).map(
            (img) => ({
              url: img.url,
              alt: img.alt || name,
              position: img.position ?? 0,
              isPrimary: img.isPrimary ?? false,
            })
          ),
        },
      },
      include: { images: true, category: true },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/products]", err);
    return NextResponse.json({ error: "Failed to create product." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, description, price, categoryId, images, isFeatured, isActive, details } = body;

    if (!id || !name || !description || !price || !categoryId) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return NextResponse.json({ error: "Invalid price." }, { status: 400 });
    }

    // Update product and recreate images (simplest approach for images)
    await prisma.productImage.deleteMany({ where: { productId: id } });

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: parsedPrice,
        categoryId,
        isFeatured: isFeatured ?? false,
        isActive: isActive ?? true,
        details: details ?? undefined,
        images: {
          create: (images as { url: string; alt: string; position: number; isPrimary: boolean }[]).map(
            (img) => ({
              url: img.url,
              alt: img.alt || name,
              position: img.position ?? 0,
              isPrimary: img.isPrimary ?? false,
            })
          ),
        },
      },
      include: { images: true, category: true },
    });

    return NextResponse.json({ product });
  } catch (err) {
    console.error("[PUT /api/admin/products]", err);
    return NextResponse.json({ error: "Failed to update product." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing product ID." }, { status: 400 });

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/admin/products]", err);
    return NextResponse.json({ error: "Failed to delete product." }, { status: 500 });
  }
}
