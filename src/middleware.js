import { NextResponse } from "next/server";
import { getCookie } from "cookies-next";

export function middleware(request) {
  // if (request.nextUrl.pathname.startsWith("/admin")) {
  //   if (getCookie("admin")) {
  //     return NextResponse.next();
  //   } else {
  //     return NextResponse.redirect(new URL("/signin/admin", request.url));
  //   }
  // }
  let cookie = request.cookies.get("admin");
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (cookie) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/signin/admin", request.url));
    }
  }
  if (request.nextUrl.pathname === "/signin/admin") {
    if (cookie) {
      return NextResponse.redirect(new URL("/admin", request.url));
    } else {
      return NextResponse.next();
    }
  }
}
