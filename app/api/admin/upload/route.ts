import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${uniqueSuffix}-${originalName}`;
    
    // Ensure directory exists
    const uploadDir = join(process.cwd(), "public/uploads/products");
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // Ignore if already exists
    }

    const filePath = join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const url = `/uploads/products/${filename}`;

    return NextResponse.json({ url });
  } catch (err) {
    console.error("[POST /api/admin/upload]", err);
    return NextResponse.json({ error: "Failed to upload file." }, { status: 500 });
  }
}
