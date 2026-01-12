import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin/auth-guard"
import { createServerClient } from "@/lib/supabase"

// GET /api/admin/orders - List all orders with filters
export async function GET(request: NextRequest) {
    const { admin, errorResponse } = await requireAdmin(request)
    if (errorResponse) return errorResponse

    try {
        const supabase = createServerClient()
        const { searchParams } = new URL(request.url)

        const status = searchParams.get("status")
        const search = searchParams.get("search")
        const dateRange = searchParams.get("date") // "today" | "week" | "month" | "all"

        let query = supabase
            .from("orders")
            .select(`
                *,
                order_items (
                    id,
                    product_name,
                    product_price,
                    size,
                    quantity,
                    line_total
                )
            `)
            .order("created_at", { ascending: false })

        // Filter by status
        if (status && status !== "all") {
            query = query.eq("status", status)
        }

        // Filter by date range
        if (dateRange && dateRange !== "all") {
            const now = new Date()
            let fromDate: Date

            switch (dateRange) {
                case "today":
                    fromDate = new Date(now.setHours(0, 0, 0, 0))
                    break
                case "week":
                    fromDate = new Date(now.setDate(now.getDate() - 7))
                    break
                case "month":
                    fromDate = new Date(now.setMonth(now.getMonth() - 1))
                    break
                default:
                    fromDate = new Date(0)
            }

            query = query.gte("created_at", fromDate.toISOString())
        }

        // Search by order number or customer name
        if (search) {
            query = query.or(`order_number.ilike.%${search}%,delivery_name.ilike.%${search}%`)
        }

        const { data: orders, error } = await query

        if (error) {
            console.error("Error fetching orders:", error)
            return NextResponse.json(
                { success: false, error: "Failed to fetch orders" },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true, data: orders })
    } catch (error) {
        console.error("Error in GET /api/admin/orders:", error)
        return NextResponse.json(
            { success: false, error: "Failed to fetch orders" },
            { status: 500 }
        )
    }
}
