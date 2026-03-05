import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ARG_ROUTES = ["/the-gate", "/axis", "/thin-place"];
const AXIS_VARIANT_COUNT = 15;
const AXIS_COLOR_COUNT = 5;

function getRandomIndex(max: number) {
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);

  return values[0] % max;
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const requestHeaders = new Headers(req.headers);

  // ARG routes: noindex + no cache
  if (pathname.startsWith("/axis")) {
    requestHeaders.set("x-axis-variant", String(getRandomIndex(AXIS_VARIANT_COUNT)));
    requestHeaders.set("x-axis-color", String(getRandomIndex(AXIS_COLOR_COUNT)));
  }

  const res = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

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
