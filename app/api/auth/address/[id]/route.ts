import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function DELETE(
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
    await prisma.address.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/auth/address]", err);
    return NextResponse.json({ error: "Failed to delete address." }, { status: 500 });
  }
}
