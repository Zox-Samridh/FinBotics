import { NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/account", "/transaction"];

function isProtected(pathname) {
  return protectedRoutes.some((route) => pathname.startsWith(route));
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Simple auth check via cookie or header
  const userId = req.cookies.get("__session")?.value;

  if (!userId && isProtected(pathname)) {
    const signInUrl = new URL("/sign-in", req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
