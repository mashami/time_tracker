export { default } from "next-auth/middleware"
import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"
export const config = {
  matcher: [
    "/dashboard/:path* ",
    "/leaves/:path*",
    "/members/:path*",
    "/announcements/:path*"
    // "/departments/:path*"
  ]
}

export async function middleware(req: NextRequest) {
  const session = await getToken({ req })
  const url = req.nextUrl
  const path = url.pathname

  if (
    (!session &&
      (path.startsWith("/dashboard") ||
        path.startsWith("/leaves") ||
        path.startsWith("/members") ||
        path.startsWith("/announcements"))) ||
    path.startsWith("/departments")
  ) {
    const url = req.nextUrl.clone()
    url.pathname = "/signin"
    return NextResponse.redirect(url)
  }
  // else {
  //   return NextResponse.redirect("/dashboard")
  // }
}
