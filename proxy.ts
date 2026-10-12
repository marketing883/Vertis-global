import { NextResponse, type NextRequest } from "next/server";

/* The first gate on the admin, as ACI's middleware is. It only looks
   for the session cookie, so visitors to the public site are never
   touched (the matcher keeps it to /admin and /api/admin). Whether
   the session is real, unexpired and allowed into a section is
   checked on the server by every admin page, action and API route
   (lib/admin/auth.ts); this file is a convenience, not the lock. */

const COOKIE = "vg_admin";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const signedIn = Boolean(request.cookies.get(COOKIE)?.value);
  const isLogin = pathname === "/admin/login";

  if (!signedIn && !isLogin) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401, headers: noindex() });
    }
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url, { headers: noindex() });
  }

  const response = NextResponse.next();
  for (const [k, v] of Object.entries(noindex())) response.headers.set(k, v);
  return response;
}

function noindex(): Record<string, string> {
  return {
    "X-Robots-Tag": "noindex, nofollow",
    "Cache-Control": "private, no-store",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "same-origin",
  };
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
