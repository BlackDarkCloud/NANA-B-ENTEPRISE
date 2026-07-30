import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const path = req.nextUrl.pathname;
  const isAdminLogin = path === "/admin/login";
  const isAdminRoute = path.startsWith("/admin");
  const role = (req.auth?.user as any)?.role;

  if (path === "/checkout" && !req.auth?.user) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", "/checkout");
    return NextResponse.redirect(loginUrl);
  }

  if (!isAdminRoute) return NextResponse.next();

  if (isAdminLogin) {
    if (role === "ADMIN") return NextResponse.redirect(new URL("/admin", req.url));
    return NextResponse.next();
  }

  if (role !== "ADMIN") {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/checkout"],
};
