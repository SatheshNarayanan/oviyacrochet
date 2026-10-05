import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth(function middleware(req) {
  const { pathname } = req.nextUrl;
  const isLoginPage = pathname === "/admin/login";
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  const session = req.auth;
  const role = (session?.user as { role?: string } | undefined)?.role;

  // Protect admin API routes — return 401 JSON (no redirect)
  if (isAdminApi) {
    if (!session || role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Not logged in → redirect to login
  if (isAdminPage && !isLoginPage && !session) {
    const url = new URL("/admin/login", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // Logged in but not ADMIN (e.g. a customer somehow)
  if (isAdminPage && !isLoginPage && session && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Already logged-in admin visiting login page → go to admin
  if (isLoginPage && session && role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin/orders", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
