import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin/auth-guard"
import { logAdminAction } from "@/lib/admin/logger"
import { createServerClient } from "@/lib/supabase"

// GET /api/admin/categories - List all categories
export async function GET(request: NextRequest) {
    const { admin, errorResponse } = await requireAdmin(request)
    if (errorResponse) return errorResponse

    try {
        const supabase = createServerClient()

        const { data: categories, error } = await supabase
            .from("categories")
            .select("*")
            .order("id", { ascending: true })

        if (error) {
            console.error("Error fetching categories:", error)
            return NextResponse.json(
                { success: false, error: "Failed to fetch categories" },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true, data: categories })
    } catch (error) {
        console.error("Error in GET /api/admin/categories:", error)
        return NextResponse.json(
            { success: false, error: "Failed to fetch categories" },
            { status: 500 }
        )
    }
}

// POST /api/admin/categories - Create new category
export async function POST(request: NextRequest) {
    const { admin, errorResponse } = await requireAdmin(request)
    if (errorResponse) return errorResponse

    try {
        const supabase = createServerClient()
        const body = await request.json()

        const { name, slug } = body

        // Validate required fields
        if (!name || !slug) {
            return NextResponse.json(
                { success: false, error: "Name and slug are required" },
                { status: 400 }
            )
        }

        // Validate slug format
        if (!/^[a-z0-9-]+$/.test(slug)) {
            return NextResponse.json(
                { success: false, error: "Slug can only contain lowercase letters, numbers, and hyphens" },
                { status: 400 }
            )
        }

        const { data: category, error } = await supabase
            .from("categories")
            .insert({
                name,
                slug
            })
            .select()
            .single()

        if (error) {
            console.error("Error creating category:", error)
            // Handle unique constraint violation
            if (error.code === '23505') {
                return NextResponse.json(
                    { success: false, error: "A category with this slug already exists" },
                    { status: 409 }
                )
            }
            return NextResponse.json(
                { success: false, error: "Failed to create category" },
                { status: 500 }
            )
        }

        // Log admin action
        await logAdminAction(
            admin!.id,
            admin!.email,
            "category_create",
            "category",
            String(category.id),
            { name: category.name, slug: category.slug }
        )

        return NextResponse.json({ success: true, data: category })
    } catch (error) {
        console.error("Error in POST /api/admin/categories:", error)
        return NextResponse.json(
            { success: false, error: "Failed to create category" },
            { status: 500 }
        )
    }
}
