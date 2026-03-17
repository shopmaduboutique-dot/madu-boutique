// GET /api/products - Returns all products from Supabase
import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import type { ApiResponse } from "@/lib/types"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const category = searchParams.get("category")
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "10")
        const from = (page - 1) * limit
        const to = from + limit - 1

        const supabase = createServerClient()

        let query = supabase
            .from("products")
            .select("*", { count: "exact" })
            .order("id", { ascending: true })
            .range(from, to)

        // Filter by category if provided
        if (category) {
            query = query.eq("category", category)
        }

        const { data: products, error, count } = await query

        if (error) {
            console.error("Supabase error:", error)
            return NextResponse.json(
                { success: false, error: "Failed to fetch products" },
                { status: 500 }
            )
        }

        // Transform database format to frontend format
        const formattedProducts = products?.map((p) => ({
            id: p.id,
            name: p.name,
            price: `₹${p.price.toLocaleString("en-IN")}`,
            originalPrice: p.original_price ? `₹${p.original_price.toLocaleString("en-IN")}` : null,
            image: p.image,
            images: p.images || [p.image],
            sizes: p.sizes || ["Free Size"],
            description: p.description,
            details: p.details,
            material: p.material,
            care: p.care,
            category: p.category,
            isNew: p.is_new,
            inStock: p.in_stock,
        }))

        return NextResponse.json({
            success: true,
            data: formattedProducts,
            count,
            page,
            totalPages: Math.ceil((count || 0) / limit)
        })
    } catch (error) {
        console.error("API error:", error)
        return NextResponse.json(
            { success: false, error: "Failed to fetch products" },
            { status: 500 }
        )
    }
}
