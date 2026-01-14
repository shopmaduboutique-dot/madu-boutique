import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

// Secret key for JWT verification - must match the one used in login
const JWT_SECRET = new TextEncoder().encode(
    process.env.ADMIN_JWT_SECRET || "madu-boutique-admin-secret-key-2024"
)

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Only protect /admin routes (except login)
    if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
        const sessionCookie = request.cookies.get("admin-session")

        // No session cookie - redirect to login
        if (!sessionCookie?.value) {
            const loginUrl = new URL("/admin/login", request.url)
            return NextResponse.redirect(loginUrl)
        }

        try {
            // Verify the JWT token
            const { payload } = await jwtVerify(sessionCookie.value, JWT_SECRET)

            // Check if token has admin role
            if (payload.role !== "admin") {
                const loginUrl = new URL("/admin/login", request.url)
                return NextResponse.redirect(loginUrl)
            }

            // Valid admin - allow access
            return NextResponse.next()
        } catch {
            // Invalid or expired token - redirect to login
            const loginUrl = new URL("/admin/login", request.url)
            const response = NextResponse.redirect(loginUrl)
            // Clear the invalid cookie
            response.cookies.delete("admin-session")
            return response
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/admin/:path*"]
}
