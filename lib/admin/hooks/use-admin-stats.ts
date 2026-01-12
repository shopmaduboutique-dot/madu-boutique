"use client"

import { useState, useEffect, useCallback } from "react"

interface DashboardStats {
    totalOrders: number
    totalRevenue: number
    totalProducts: number
    lowStockCount: number
    todaysOrders: number
    todaysRevenue: number
    salesData: { date: string; revenue: number; orders: number }[]
}

interface RecentOrder {
    id: string
    order_number: string
    delivery_name: string
    total: number
    status: string
    created_at: string
}

export function useAdminStats() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchStats = useCallback(async () => {
        try {
            const response = await fetch("/api/admin/stats")
            const data = await response.json()

            if (data.success) {
                setStats(data.data)
            } else {
                setError(data.error || "Failed to fetch stats")
            }
        } catch (err) {
            console.error("Error fetching stats:", err)
            setError("Failed to fetch dashboard stats")
        }
    }, [])

    const fetchRecentOrders = useCallback(async () => {
        try {
            // Use API route to fetch today's orders
            const response = await fetch("/api/admin/orders?date=today")
            const data = await response.json()

            if (data.success) {
                // Take the first 10 orders
                const orders = (data.data || []).slice(0, 10).map((order: RecentOrder) => ({
                    id: order.id,
                    order_number: order.order_number,
                    delivery_name: order.delivery_name,
                    total: order.total,
                    status: order.status,
                    created_at: order.created_at
                }))
                setRecentOrders(orders)
            }
        } catch (err) {
            console.error("Error fetching recent orders:", err)
        }
    }, [])

    useEffect(() => {
        const loadData = async () => {
            setLoading(true)
            await Promise.all([fetchStats(), fetchRecentOrders()])
            setLoading(false)
        }

        loadData()

        // Poll for updates every 30 seconds (simpler than realtime for now)
        const interval = setInterval(() => {
            fetchStats()
            fetchRecentOrders()
        }, 30000)

        return () => clearInterval(interval)
    }, [fetchStats, fetchRecentOrders])

    return { stats, recentOrders, loading, error, refetch: fetchStats }
}
