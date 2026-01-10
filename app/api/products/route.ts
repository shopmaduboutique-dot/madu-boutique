// GET /api/products - Returns all products from Supabase
import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import type { ApiResponse } from "@/lib/types"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const category = searchParams.get("category")

        const supabase = createServerClient()

        let query = supabase
            .from("products")
            .select("*")
            .order("id", { ascending: true })

        // Filter by category if provided
        if (category && (category === "saree" || category === "chudithar")) {
            query = query.eq("category", category)
        }

        const { data: products, error } = await query

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
        })
    } catch (error) {
        console.error("API error:", error)
        return NextResponse.json(
            { success: false, error: "Failed to fetch products" },
            { status: 500 }
        )
    }
}
