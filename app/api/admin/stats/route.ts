import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin/auth-guard"
import { createServerClient } from "@/lib/supabase"

interface DashboardStats {
    totalOrders: number
    totalRevenue: number
    totalProducts: number
    lowStockCount: number
    todaysOrders: number
    todaysRevenue: number
    salesData: { date: string; revenue: number; orders: number }[]
}

export async function GET(request: NextRequest) {
    // Verify admin access
    const { admin, errorResponse } = await requireAdmin(request)
    if (errorResponse) return errorResponse

    try {
        const supabase = createServerClient()

        // Get today's date boundaries
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const todayISO = today.toISOString()

        // 1. Total orders count
        const { count: totalOrders } = await supabase
            .from("orders")
            .select("*", { count: "exact", head: true })

        // 2. Total revenue
        const { data: revenueData } = await supabase
            .from("orders")
            .select("total")
            .not("status", "eq", "cancelled")

        const totalRevenue = revenueData?.reduce((sum, order) => sum + Number(order.total), 0) || 0

        // 3. Total products count
        const { count: totalProducts } = await supabase
            .from("products")
            .select("*", { count: "exact", head: true })

        // 4. Low stock count (products with stock_quantity < 5)
        const { count: lowStockCount } = await supabase
            .from("products")
            .select("*", { count: "exact", head: true })
            .lt("stock_quantity", 5)
            .eq("in_stock", true)

        // 5. Today's orders and revenue
        const { data: todaysOrdersData } = await supabase
            .from("orders")
            .select("total")
            .gte("created_at", todayISO)

        const todaysOrders = todaysOrdersData?.length || 0
        const todaysRevenue = todaysOrdersData?.reduce((sum, order) => sum + Number(order.total), 0) || 0

        // 6. Sales data for last 30 days
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        const thirtyDaysAgoISO = thirtyDaysAgo.toISOString()

        const { data: recentOrders } = await supabase
            .from("orders")
            .select("created_at, total")
            .gte("created_at", thirtyDaysAgoISO)
            .not("status", "eq", "cancelled")
            .order("created_at", { ascending: true })

        // Aggregate by date
        const salesByDate = new Map<string, { revenue: number; orders: number }>()

        // Initialize all 30 days with zero values
        for (let i = 29; i >= 0; i--) {
            const date = new Date()
            date.setDate(date.getDate() - i)
            const dateKey = date.toISOString().split("T")[0]
            salesByDate.set(dateKey, { revenue: 0, orders: 0 })
        }

        // Fill in actual data
        recentOrders?.forEach((order) => {
            const dateKey = new Date(order.created_at).toISOString().split("T")[0]
            const existing = salesByDate.get(dateKey)
            if (existing) {
                existing.revenue += Number(order.total)
                existing.orders += 1
            }
        })

        const salesData = Array.from(salesByDate.entries()).map(([date, data]) => ({
            date,
            ...data,
        }))

        const stats: DashboardStats = {
            totalOrders: totalOrders || 0,
            totalRevenue,
            totalProducts: totalProducts || 0,
            lowStockCount: lowStockCount || 0,
            todaysOrders,
            todaysRevenue,
            salesData,
        }

        return NextResponse.json({ success: true, data: stats })
    } catch (error) {
        console.error("Error fetching dashboard stats:", error)
        return NextResponse.json(
            { success: false, error: "Failed to fetch dashboard stats" },
            { status: 500 }
        )
    }
}
