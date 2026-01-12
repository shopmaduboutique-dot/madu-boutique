import { NextResponse, type NextRequest } from "next/server"
import { jwtVerify } from "jose"

// Secret key for JWT verification - must match the one used in login
const JWT_SECRET = new TextEncoder().encode(
    process.env.ADMIN_JWT_SECRET || "madu-boutique-admin-secret-key-2024"
)

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Only protect /admin routes
    if (!pathname.startsWith("/admin")) {
        return NextResponse.next()
    }

    // Allow access to admin login page without auth
    if (pathname === "/admin/login") {
        return NextResponse.next()
    }

    // Allow API routes to handle their own auth
    if (pathname.startsWith("/admin/api") || pathname.startsWith("/api/admin")) {
        return NextResponse.next()
    }

    // Check for admin session cookie
    const sessionCookie = request.cookies.get("admin-session")

    if (!sessionCookie?.value) {
        return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    try {
        // Verify the JWT token
        const { payload } = await jwtVerify(sessionCookie.value, JWT_SECRET)

        // Check if token has admin role
        if (payload.role !== "admin") {
            return NextResponse.redirect(new URL("/admin/login", request.url))
        }

        // User is admin - allow access
        return NextResponse.next()

    } catch (error) {
        // Token is invalid or expired - redirect to login
        console.error("Proxy: Invalid admin token:", error)

        // Clear the invalid cookie
        const response = NextResponse.redirect(new URL("/admin/login", request.url))
        response.cookies.delete("admin-session")
        return response
    }
}

export const config = {
    matcher: ["/admin/:path*"],
}
