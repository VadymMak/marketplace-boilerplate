import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Temporary middleware — auth guard added in Phase 2
export function middleware(req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|_vercel|api|.*\\..*).*)"],
};
