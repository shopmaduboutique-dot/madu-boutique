import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"

// Secret key for JWT verification - must match the one used in login
const JWT_SECRET = new TextEncoder().encode(
    process.env.ADMIN_JWT_SECRET || "madu-boutique-admin-secret-key-2024"
)

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        const sessionCookie = cookieStore.get("admin-session")

        if (!sessionCookie?.value) {
            return NextResponse.json({
                isAdmin: false,
                user: null,
                reason: "no_session"
            })
        }

        // Verify the JWT token
        const { payload } = await jwtVerify(sessionCookie.value, JWT_SECRET)

        // Check if token has admin role
        if (payload.role !== "admin") {
            return NextResponse.json({
                isAdmin: false,
                user: null,
                reason: "not_admin"
            })
        }

        return NextResponse.json({
            isAdmin: true,
            user: { email: payload.email }
        })

    } catch (error) {
        console.error("Verify admin error:", error)

        // Clear invalid/expired cookie
        const cookieStore = await cookies()
        cookieStore.delete("admin-session")

        return NextResponse.json({
            isAdmin: false,
            user: null,
            reason: "invalid_token"
        })
    }
}
