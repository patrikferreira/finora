import { NextResponse } from "next/server";

const ALLOWED_ROUTES = [
  "/signin",
  "/signup",
  "/",
  "/overview",
  "/incomes",
  "/expenses",
];

export function middleware(request: Request) {
  const { pathname } = new URL(request.url);

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (!ALLOWED_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
