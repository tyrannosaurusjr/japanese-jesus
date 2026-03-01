import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ARG_ROUTES = ["/the-gate", "/axis", "/thin-place"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const res = NextResponse.next();

  // ARG routes: noindex + no cache
  if (ARG_ROUTES.some((route) => pathname.startsWith(route))) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    res.headers.set("Cache-Control", "no-store, no-cache");
    res.headers.set("X-Frame-Options", "DENY");
  }

  // /axis: randomize on every request (edge)
  if (pathname.startsWith("/axis")) {
    res.headers.set("Cache-Control", "no-store, no-cache");
    res.headers.set("Vary", "*");
  }

  return res;
}

export const config = {
  matcher: ["/the-gate/:path*", "/axis/:path*", "/thin-place/:path*"],
};
