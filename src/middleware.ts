import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/account", "/checkout", "/orders"];
const VENDOR_ROUTES = ["/dashboard"];
const ADMIN_ROUTES = ["/admin"];

export default auth(function middleware(req) {
  const session = req.auth;
  const pathname = req.nextUrl.pathname;

  // Any logged-in user
  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // VENDOR or ADMIN
  const isVendor = VENDOR_ROUTES.some((r) => pathname.startsWith(r));
  if (isVendor) {
    if (!session) return NextResponse.redirect(new URL("/auth/login", req.url));
    if (session.user.role !== "VENDOR" && session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // ADMIN only
  const isAdmin = ADMIN_ROUTES.some((r) => pathname.startsWith(r));
  if (isAdmin) {
    if (!session) return NextResponse.redirect(new URL("/auth/login", req.url));
    if (session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

// ⚠️ ONE pattern — never split into multiple
export const config = {
  matcher: ["/((?!_next|_vercel|api|favicon|.*\\..*).*)"],
};
