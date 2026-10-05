import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const address = await prisma.address.findUnique({ where: { id } });
    if (!address || address.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    await prisma.address.updateMany({ where: { userId: session.user.id }, data: { isDefault: false } });
    await prisma.address.update({ where: { id }, data: { isDefault: true } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[PATCH /api/auth/address/default]", err);
    return NextResponse.json({ error: "Failed to update default." }, { status: 500 });
  }
}
