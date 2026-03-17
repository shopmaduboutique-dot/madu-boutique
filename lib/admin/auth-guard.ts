import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

// Secret key for JWT verification - must match the one used in login
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET

if (!ADMIN_JWT_SECRET) {
    throw new Error("ADMIN_JWT_SECRET is not defined")
}

const JWT_SECRET = new TextEncoder().encode(ADMIN_JWT_SECRET)

export interface AdminUser {
    id: string
    email: string
    role: string
}

/**
 * Verify that the request is from an authenticated admin user.
 * Returns the admin user data if valid, null otherwise.
 */
export async function verifyAdminRole(request: NextRequest): Promise<AdminUser | null> {
    try {
        const cookieStore = await cookies()
        const sessionCookie = cookieStore.get("admin-session")

        if (!sessionCookie?.value) {
            console.log("Auth-guard: No admin session cookie")
            return null
        }

        // Verify the JWT token
        const { payload } = await jwtVerify(sessionCookie.value, JWT_SECRET)

        // Check if token has admin role
        if (payload.role !== "admin") {
            console.log("Auth-guard: Token does not have admin role")
            return null
        }

        // Return admin user info from JWT payload
        return {
            id: "admin",
            email: payload.email as string,
            role: "admin"
        }
    } catch (error) {
        console.error("Auth-guard: Error verifying admin token:", error)
        return null
    }
}

/**
 * Require admin access for an API route.
 * Returns a NextResponse with 401/403 if not authorized, or the admin user if valid.
 */
export async function requireAdmin(request: NextRequest): Promise<{
    admin: AdminUser | null
    errorResponse: NextResponse | null
}> {
    const admin = await verifyAdminRole(request)

    if (!admin) {
        return {
            admin: null,
            errorResponse: NextResponse.json(
                { success: false, error: "Unauthorized - Admin access required" },
                { status: 401 }
            ),
        }
    }

    return { admin, errorResponse: null }
}
