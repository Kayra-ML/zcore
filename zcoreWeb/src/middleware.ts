import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname, searchParams } = req.nextUrl;

  const isAuthRoute = pathname === "/login";
  const isProtectedRoute = pathname.startsWith("/stores") || pathname.startsWith("/dashboard") || pathname.startsWith("/desktop-auth");

  // Eğer kullanıcı zaten giriş yapmışsa ve login/register sayfalarına gitmeye çalışıyorsa
  // Onu ana sayfaya veya stores sayfasına yönlendir.
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/stores", req.nextUrl));
    }
    return NextResponse.next();
  }

  // Eğer sayfa korumalı bir rotaysa ve kullanıcı giriş yapmamışsa
  if (isProtectedRoute && !isLoggedIn) {
    // Bulunduğu adresi callbackUrl olarak ekleyerek login sayfasına yönlendir
    const callbackUrl = `${pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`, req.nextUrl));
  }

  return NextResponse.next();
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
