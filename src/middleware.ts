import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

/**
 * Route guard for the two management areas.
 *
 * The backend signs the JWT with a `role` claim (`user` or `company`) and stores
 * it in an httpOnly cookie named `token` for both account types. Checking only
 * that the cookie existed was not enough: a signed-in candidate could open
 * `/company-manage/*`, land in a page whose data fetch returns nothing, and sit
 * on a skeleton forever because the component renders a loading state when its
 * own entity is null.
 *
 * This verifies the signature and the role, so each area only loads for the
 * account type it belongs to. A failed verification is treated as "not signed
 * in", and the visitor is sent to the login page for the area they asked for.
 */

/** Where to send a visitor who is not signed in for this area. */
const LOGIN_FOR = {
  user: "/user/login",
  company: "/company/login",
} as const;

type Area = keyof typeof LOGIN_FOR;

const areaOf = (pathname: string): Area =>
  pathname.startsWith("/company-manage") ? "company" : "user";

const secret = () => {
  const value = process.env.JWT_SECRET;
  /* Without a secret no token can be trusted, so every guarded route redirects.
     Failing closed is the safe direction for an auth check. */
  return value ? new TextEncoder().encode(value) : null;
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const area = areaOf(pathname);
  const token = request.cookies.get("token")?.value;
  const key = secret();

  if (token && key) {
    try {
      const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
      if (payload.role === area) return NextResponse.next();
      /* Signed in, but as the other account type: send them to their own area
         instead of a login page they do not need. */
      const home =
        payload.role === "company" ? "/company-manage/profile" : "/user-manage/profile";
      return NextResponse.redirect(new URL(home, request.url));
    } catch {
      /* expired or tampered token — fall through to the login redirect */
    }
  }

  return NextResponse.redirect(new URL(LOGIN_FOR[area], request.url));
}

export const config = {
  matcher: ["/user-manage/:path*", "/company-manage/:path*"],
};
