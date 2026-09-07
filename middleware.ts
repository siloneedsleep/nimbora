import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  if (pathname !== "/" && pathname !== "/login" && pathname !== "/signup" && pathname !== "/cronjob") {
    const user = getCurrentUser(request);
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
