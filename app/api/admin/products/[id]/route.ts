import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin/auth-guard"
import { logAdminAction } from "@/lib/admin/logger"
import { createServerClient } from "@/lib/supabase"

interface RouteParams {
    params: Promise<{ id: string }>
}

// GET /api/admin/products/[id] - Get single product
export async function GET(request: NextRequest, { params }: RouteParams) {
    const { admin, errorResponse } = await requireAdmin(request)
    if (errorResponse) return errorResponse

    try {
        const { id } = await params
        const supabase = createServerClient()

        const { data: product, error } = await supabase
            .from("products")
            .select("*")
            .eq("id", Number(id))
            .single()

        if (error || !product) {
            return NextResponse.json(
                { success: false, error: "Product not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({ success: true, data: product })
    } catch (error) {
        console.error("Error fetching product:", error)
        return NextResponse.json(
            { success: false, error: "Failed to fetch product" },
            { status: 500 }
        )
    }
}

// PUT /api/admin/products/[id] - Update product
export async function PUT(request: NextRequest, { params }: RouteParams) {
    const { admin, errorResponse } = await requireAdmin(request)
    if (errorResponse) return errorResponse

    try {
        const { id } = await params
        const supabase = createServerClient()
        const body = await request.json()

        const {
            name,
            price,
            original_price,
            image,
            images,
            sizes,
            description,
            details,
            material,
            care,
            category,
            is_new,
            in_stock,
            stock_quantity,
        } = body

        const updateData: Record<string, unknown> = {}

        if (name !== undefined) updateData.name = name
        if (price !== undefined) updateData.price = Number(price)
        if (original_price !== undefined) updateData.original_price = original_price ? Number(original_price) : null
        if (image !== undefined) updateData.image = image
        if (images !== undefined) updateData.images = images
        if (sizes !== undefined) updateData.sizes = sizes
        if (description !== undefined) updateData.description = description
        if (details !== undefined) updateData.details = details
        if (material !== undefined) updateData.material = material
        if (care !== undefined) updateData.care = care
        if (category !== undefined) updateData.category = category
        if (is_new !== undefined) updateData.is_new = is_new
        if (in_stock !== undefined) updateData.in_stock = in_stock
        if (stock_quantity !== undefined) updateData.stock_quantity = stock_quantity

        const { data: product, error } = await supabase
            .from("products")
            .update(updateData)
            .eq("id", Number(id))
            .select()
            .single()

        if (error) {
            console.error("Error updating product:", error)
            return NextResponse.json(
                { success: false, error: "Failed to update product" },
                { status: 500 }
            )
        }

        // Log admin action
        await logAdminAction(
            admin!.id,
            admin!.email,
            "product_update",
            "product",
            id,
            { changes: Object.keys(updateData) }
        )

        return NextResponse.json({ success: true, data: product })
    } catch (error) {
        console.error("Error in PUT /api/admin/products/[id]:", error)
        return NextResponse.json(
            { success: false, error: "Failed to update product" },
            { status: 500 }
        )
    }
}

// DELETE /api/admin/products/[id] - Delete product
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    const { admin, errorResponse } = await requireAdmin(request)
    if (errorResponse) return errorResponse

    try {
        const { id } = await params
        const supabase = createServerClient()

        // Get product name before deletion for logging
        const { data: existingProduct } = await supabase
            .from("products")
            .select("name")
            .eq("id", Number(id))
            .single()

        const { error } = await supabase
            .from("products")
            .delete()
            .eq("id", Number(id))

        if (error) {
            console.error("Error deleting product:", error)
            return NextResponse.json(
                { success: false, error: "Failed to delete product" },
                { status: 500 }
            )
        }

        // Log admin action
        await logAdminAction(
            admin!.id,
            admin!.email,
            "product_delete",
            "product",
            id,
            { name: existingProduct?.name }
        )

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error in DELETE /api/admin/products/[id]:", error)
        return NextResponse.json(
            { success: false, error: "Failed to delete product" },
            { status: 500 }
        )
    }
}
