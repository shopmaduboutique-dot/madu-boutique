import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { SignJWT } from "jose"

// Secret key for JWT signing - use a strong secret in production
const JWT_SECRET = new TextEncoder().encode(
    process.env.ADMIN_JWT_SECRET || "madu-boutique-admin-secret-key-2024"
)

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json()

        // Get admin credentials from environment variables
        const adminEmail = process.env.ADMIN_EMAIL
        const adminPassword = process.env.ADMIN_PASSWORD

        if (!adminEmail || !adminPassword) {
            console.error("Missing ADMIN_EMAIL or ADMIN_PASSWORD in environment variables")
            return NextResponse.json(
                { success: false, error: "Server configuration error" },
                { status: 500 }
            )
        }

        // Validate credentials (case-insensitive email check)
        const isValidEmail = email.toLowerCase().trim() === adminEmail.toLowerCase().trim()
        const isValidPassword = password === adminPassword

        if (!isValidEmail || !isValidPassword) {
            return NextResponse.json(
                { success: false, error: "Invalid email or password" },
                { status: 401 }
            )
        }

        // Create a JWT token for the admin session
        const token = await new SignJWT({
            email: adminEmail.toLowerCase(),
            role: "admin",
            iat: Date.now()
        })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("24h")
            .sign(JWT_SECRET)

        // Set the admin session cookie
        const cookieStore = await cookies()
        cookieStore.set("admin-session", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24, // 24 hours
            path: "/",
        })

        return NextResponse.json({
            success: true,
            user: { email: adminEmail.toLowerCase() }
        })

    } catch (error) {
        console.error("Admin login error:", error)
        return NextResponse.json(
            { success: false, error: "An unexpected error occurred" },
            { status: 500 }
        )
    }
}
