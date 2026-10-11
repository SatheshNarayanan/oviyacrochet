import { auth } from "@/auth";
import { NextResponse } from "next/server";

function getOrigin(req: { headers: Headers; nextUrl: { host: string; protocol: string; origin: string } }) {
  const forwardedHost = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const forwardedProto = req.headers.get("x-forwarded-proto") || (req.nextUrl.protocol ? req.nextUrl.protocol.replace(":", "") : "https");
  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }
  return req.nextUrl.origin;
}

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
    const origin = getOrigin(req);
    const url = new URL("/admin/login", origin);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // Logged in but not ADMIN (e.g. a customer somehow)
  if (isAdminPage && !isLoginPage && session && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", getOrigin(req)));
  }

  // Already logged-in admin visiting login page → go to admin
  if (isLoginPage && session && role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin/orders", getOrigin(req)));
  }

  // SEO Redirect: /shop?category=<slug> -> /shop/<slug>
  if (pathname === "/shop" && req.nextUrl.searchParams.has("category")) {
    const category = req.nextUrl.searchParams.get("category");
    if (category) {
      const origin = getOrigin(req);
      const newUrl = new URL(`/shop/${category}`, origin);
      req.nextUrl.searchParams.forEach((value, key) => {
        if (key !== "category") {
          newUrl.searchParams.set(key, value);
        }
      });
      return NextResponse.redirect(newUrl, 308);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/shop"],
};
