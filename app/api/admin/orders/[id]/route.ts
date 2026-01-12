import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin/auth-guard"
import { logAdminAction } from "@/lib/admin/logger"
import { createServerClient } from "@/lib/supabase"

interface RouteParams {
    params: Promise<{ id: string }>
}

// GET /api/admin/orders/[id] - Get single order with items
export async function GET(request: NextRequest, { params }: RouteParams) {
    const { admin, errorResponse } = await requireAdmin(request)
    if (errorResponse) return errorResponse

    try {
        const { id } = await params
        const supabase = createServerClient()

        const { data: order, error } = await supabase
            .from("orders")
            .select(`
                *,
                order_items (
                    id,
                    product_id,
                    product_name,
                    product_price,
                    size,
                    quantity,
                    line_total
                )
            `)
            .eq("id", id)
            .single()

        if (error || !order) {
            return NextResponse.json(
                { success: false, error: "Order not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({ success: true, data: order })
    } catch (error) {
        console.error("Error fetching order:", error)
        return NextResponse.json(
            { success: false, error: "Failed to fetch order" },
            { status: 500 }
        )
    }
}

// PUT /api/admin/orders/[id] - Update order status/tracking
export async function PUT(request: NextRequest, { params }: RouteParams) {
    const { admin, errorResponse } = await requireAdmin(request)
    if (errorResponse) return errorResponse

    try {
        const { id } = await params
        const supabase = createServerClient()
        const body = await request.json()

        const { status, tracking_number } = body

        const updateData: Record<string, unknown> = {
            updated_at: new Date().toISOString(),
        }

        if (status !== undefined) {
            updateData.status = status
        }

        if (tracking_number !== undefined) {
            updateData.tracking_number = tracking_number
        }

        const { data: order, error } = await supabase
            .from("orders")
            .update(updateData)
            .eq("id", id)
            .select()
            .single()

        if (error) {
            console.error("Error updating order:", error)
            return NextResponse.json(
                { success: false, error: "Failed to update order" },
                { status: 500 }
            )
        }

        // Log admin action
        if (status !== undefined) {
            await logAdminAction(
                admin!.id,
                admin!.email,
                "order_status_update",
                "order",
                id,
                { new_status: status, order_number: order.order_number }
            )
        }

        if (tracking_number !== undefined) {
            await logAdminAction(
                admin!.id,
                admin!.email,
                "order_tracking_update",
                "order",
                id,
                { tracking_number, order_number: order.order_number }
            )
        }

        return NextResponse.json({ success: true, data: order })
    } catch (error) {
        console.error("Error in PUT /api/admin/orders/[id]:", error)
        return NextResponse.json(
            { success: false, error: "Failed to update order" },
            { status: 500 }
        )
    }
}
