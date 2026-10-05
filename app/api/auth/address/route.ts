import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

// POST — create a new address
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { fullName, phone, line1, line2, city, state, pincode, isDefault } = body;

    if (!fullName || !phone || !line1 || !city || !state || !pincode) {
      return NextResponse.json({ error: "All required fields must be filled." }, { status: 400 });
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: session.user.id,
        fullName, phone,
        line1, line2: line2 || null,
        city, state, pincode,
        country: "India",
        isDefault: isDefault ?? false,
      },
    });

    return NextResponse.json({ address }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/auth/address]", err);
    return NextResponse.json({ error: "Failed to save address." }, { status: 500 });
  }
}
