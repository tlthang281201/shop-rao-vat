import { NextResponse } from "next/server";
import { supabase } from "./supabase/supabase-config";
import { setCookie } from "cookies-next";

export async function middleware(request) {
  let cookie = request.cookies.get("admin");
  // Listen to inserts
  // console.log(JSON.parse(cookie.value).role);

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
export const config = {
  matcher: ["/((?!api|_next/static|_next/image).*)"],
};
