import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, password, address } = body;

    // Validate required fields
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return NextResponse.json({ error: "Name, email and password are required." }, { status: 400 });
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    // Check if email already exists
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Create user + optional default address in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          phone: phone?.trim() || null,
          passwordHash,
          role: "CUSTOMER",
        },
      });

      if (address?.line1?.trim()) {
        await tx.address.create({
          data: {
            userId: newUser.id,
            fullName: address.fullName?.trim() || name.trim(),
            phone: address.phone?.trim() || phone?.trim() || "",
            line1: address.line1.trim(),
            line2: address.line2?.trim() || null,
            city: address.city.trim(),
            state: address.state.trim(),
            pincode: address.pincode.trim(),
            country: "India",
            isDefault: true,
          },
        });
      }

      return newUser;
    });

    return NextResponse.json({ ok: true, userId: user.id }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/auth/register]", err);
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
