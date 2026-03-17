// GET /api/products/[id] - Returns a single product from Supabase
import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const productId = parseInt(id, 10)

        if (isNaN(productId)) {
            return NextResponse.json(
                { success: false, error: "Invalid product ID" },
                { status: 400 }
            )
        }

        const supabase = createServerClient()

        const { data: product, error } = await supabase
            .from("products")
            .select("*")
            .eq("id", productId)
            .single()

        if (error || !product) {
            return NextResponse.json(
                { success: false, error: "Product not found" },
                { status: 404 }
            )
        }

        // Transform database format to frontend format
        const formattedProduct = {
            id: product.id,
            name: product.name,
            price: `₹${product.price.toLocaleString("en-IN")}`,
            originalPrice: product.original_price ? `₹${product.original_price.toLocaleString("en-IN")}` : null,
            image: product.image,
            images: product.images || [product.image],
            sizes: product.sizes || ["Free Size"],
            description: product.description,
            details: product.details,
            material: product.material,
            care: product.care,
            category: product.category,
            isNew: product.is_new,
            inStock: product.in_stock,
        }

        return NextResponse.json({
            success: true,
            data: formattedProduct,
        })
    } catch (error) {
        console.error("API error:", error)
        return NextResponse.json(
            { success: false, error: "Failed to fetch product" },
            { status: 500 }
        )
    }
}
