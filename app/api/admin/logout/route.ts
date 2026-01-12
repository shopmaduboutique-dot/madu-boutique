import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
    try {
        const cookieStore = await cookies()

        // Clear the admin session cookie
        cookieStore.delete("admin-session")

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Admin logout error:", error)
        return NextResponse.json(
            { success: false, error: "Logout failed" },
            { status: 500 }
        )
    }
}
