import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { theme } = await req.json();
    if (!["light", "dark", "system"].includes(theme)) {
      return NextResponse.json({ error: "Invalid theme." }, { status: 400 });
    }
    await prisma.user.update({
      where: { id: session.user.id },
      data: { theme },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[PATCH /api/auth/theme]", err);
    return NextResponse.json({ error: "Failed to save theme." }, { status: 500 });
  }
}
