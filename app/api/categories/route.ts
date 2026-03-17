// GET /api/categories - Returns all categories from Supabase
import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET() {
    try {
        const supabase = createServerClient()

        const { data: categories, error } = await supabase
            .from("categories")
            .select("*")
            .order("id", { ascending: true })

        if (error) {
            console.error("Supabase error:", error)
            return NextResponse.json(
                { success: false, error: "Failed to fetch categories" },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            data: categories
        })
    } catch (error) {
        console.error("API error:", error)
        return NextResponse.json(
            { success: false, error: "Failed to fetch categories" },
            { status: 500 }
        )
    }
}
