import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin/auth-guard"
import { logAdminAction } from "@/lib/admin/logger"
import { createServerClient } from "@/lib/supabase"

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { admin, errorResponse } = await requireAdmin(request)
    if (errorResponse) return errorResponse

    const { id } = await params
    const categoryId = parseInt(id)
    if (isNaN(categoryId)) {
        return NextResponse.json(
            { success: false, error: "Invalid category ID" },
            { status: 400 }
        )
    }

    try {
        const supabase = createServerClient()

        // Get the category to find its slug
        const { data: category, error: fetchError } = await supabase
            .from("categories")
            .select("*")
            .eq("id", categoryId)
            .single()

        if (fetchError || !category) {
            return NextResponse.json(
                { success: false, error: "Category not found" },
                { status: 404 }
            )
        }

        // Check if any products are using this category's slug
        const { count, error: countError } = await supabase
            .from("products")
            .select("*", { count: "exact", head: true })
            .eq("category", category.slug)

        if (countError) {
            console.error("Error checking category products:", countError)
            return NextResponse.json(
                { success: false, error: "Failed to check category usage" },
                { status: 500 }
            )
        }

        if (count && count > 0) {
            return NextResponse.json(
                { success: false, error: `Cannot delete category. There are ${count} product(s) associated with it.` },
                { status: 400 }
            )
        }

        // Delete the category
        const { error: deleteError } = await supabase
            .from("categories")
            .delete()
            .eq("id", categoryId)

        if (deleteError) {
            console.error("Error deleting category:", deleteError)
            return NextResponse.json(
                { success: false, error: "Failed to delete category" },
                { status: 500 }
            )
        }

        // Log admin action
        await logAdminAction(
            admin!.id,
            admin!.email,
            "category_delete",
            "category",
            String(categoryId),
            { name: category.name, slug: category.slug }
        )

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error in DELETE /api/admin/categories/[id]:", error)
        return NextResponse.json(
            { success: false, error: "Failed to delete category" },
            { status: 500 }
        )
    }
}
