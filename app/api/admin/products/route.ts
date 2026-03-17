import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin/auth-guard"
import { logAdminAction } from "@/lib/admin/logger"
import { createServerClient } from "@/lib/supabase"

// GET /api/admin/products - List all products with filters
export async function GET(request: NextRequest) {
    const { admin, errorResponse } = await requireAdmin(request)
    if (errorResponse) return errorResponse

    try {
        const supabase = createServerClient()
        const { searchParams } = new URL(request.url)

        const category = searchParams.get("category")
        const search = searchParams.get("search")
        const stock = searchParams.get("stock") // "all" | "in" | "out" | "low"

        let query = supabase
            .from("products")
            .select("*")
            .order("id", { ascending: false })

        // Filter by category
        if (category && category !== "all") {
            query = query.eq("category", category)
        }

        // Filter by stock status
        if (stock === "in") {
            query = query.eq("in_stock", true)
        } else if (stock === "out") {
            query = query.eq("in_stock", false)
        } else if (stock === "low") {
            query = query.lt("stock_quantity", 5).eq("in_stock", true)
        }

        // Search by name
        if (search) {
            query = query.ilike("name", `%${search}%`)
        }

        const { data: products, error } = await query

        if (error) {
            console.error("Error fetching products:", error)
            return NextResponse.json(
                { success: false, error: "Failed to fetch products" },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true, data: products })
    } catch (error) {
        console.error("Error in GET /api/admin/products:", error)
        return NextResponse.json(
            { success: false, error: "Failed to fetch products" },
            { status: 500 }
        )
    }
}

// POST /api/admin/products - Create new product
export async function POST(request: NextRequest) {
    const { admin, errorResponse } = await requireAdmin(request)
    if (errorResponse) return errorResponse

    try {
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

        // Validate required fields
        if (!name || !price || !category) {
            return NextResponse.json(
                { success: false, error: "Name, price, and category are required" },
                { status: 400 }
            )
        }

        const { data: product, error } = await supabase
            .from("products")
            .insert({
                name,
                price: Number(price),
                original_price: original_price ? Number(original_price) : null,
                image: image || images?.[0] || null,
                images: images || [],
                sizes: sizes || ["Free Size"],
                description: description || "",
                details: details || "",
                material: material || "",
                care: care || "",
                category,
                is_new: is_new ?? false,
                in_stock: in_stock ?? true,
                stock_quantity: stock_quantity ?? 0,
            })
            .select()
            .single()

        if (error) {
            console.error("Error creating product:", error)
            return NextResponse.json(
                { success: false, error: "Failed to create product" },
                { status: 500 }
            )
        }

        // Log admin action
        await logAdminAction(
            admin!.id,
            admin!.email,
            "product_create",
            "product",
            String(product.id),
            { name: product.name, price: product.price }
        )

        return NextResponse.json({ success: true, data: product })
    } catch (error) {
        console.error("Error in POST /api/admin/products:", error)
        return NextResponse.json(
            { success: false, error: "Failed to create product" },
            { status: 500 }
        )
    }
}
