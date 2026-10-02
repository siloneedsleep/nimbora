import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "@/lib/session";

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isPublic = pathname === "/" || pathname === "/login" || pathname === "/signup" || pathname === "/cronjob" || pathname === "/blog" || pathname.startsWith("/blog/") || pathname.startsWith("/api/");

  if (isPublic) return NextResponse.next();

  const user = await verifySession(request.cookies.get("token")?.value);
  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/|.*\\..*)*)"],
};

export const runtime = "edge";
