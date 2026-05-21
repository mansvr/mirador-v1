import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const HOME_HOSTS = new Set([
  "mirador.home",
  "www.mirador.home",
  "mirador.homes",
  "www.mirador.homes",
]);

/**
 * mirador.home / mirador.homes → listings hub at `/home`.
 * Same Vercel project as mirador.lat — no second repo required for v1.
 */
export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase() ?? "";

  if (!HOME_HOSTS.has(host)) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.rewrite(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon|.*\\..*).*)"],
};
