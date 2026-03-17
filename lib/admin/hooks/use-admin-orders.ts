"use client"

import { useState, useEffect, useCallback } from "react"

export interface OrderItem {
    id: number
    product_id: number | null
    product_name: string
    product_price: number
    size: string
    quantity: number
    line_total: number
}

export interface Order {
    id: string
    order_number: string
    user_id: string | null
    status: string
    subtotal: number
    shipping_cost: number
    total: number
    delivery_name: string
    delivery_phone: string
    delivery_email: string | null
    delivery_address: string
    delivery_city: string
    delivery_state: string | null
    delivery_zip: string
    tracking_number: string | null
    created_at: string
    updated_at: string
    order_items: OrderItem[]
}

interface UseAdminOrdersOptions {
    status?: string
    search?: string
    dateRange?: string
}

export function useAdminOrders(options: UseAdminOrdersOptions = {}) {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)

    const fetchOrders = useCallback(async (pageNum: number, isLoadMore = false) => {
        try {
            const params = new URLSearchParams()
            if (options.status && options.status !== "all") {
                params.set("status", options.status)
            }
            if (options.search) {
                params.set("search", options.search)
            }
            if (options.dateRange && options.dateRange !== "all") {
                params.set("date", options.dateRange)
            }
            params.set("page", pageNum.toString())
            params.set("limit", "10")

            const response = await fetch(`/api/admin/orders?${params.toString()}`)
            const data = await response.json()

            if (data.success) {
                if (isLoadMore) {
                    setOrders(prev => [...prev, ...data.data])
                } else {
                    setOrders(data.data)
                }
                setHasMore(pageNum < data.totalPages)
                setError(null)
            } else {
                setError(data.error || "Failed to fetch orders")
            }
        } catch (err) {
            console.error("Error fetching orders:", err)
            setError("Failed to fetch orders")
        } finally {
            setLoading(false)
        }
    }, [options.status, options.search, options.dateRange])

    useEffect(() => {
        setLoading(true)
        setPage(1)
        fetchOrders(1, false)

        // Poll for updates every 30 seconds
        const interval = setInterval(() => {
            setPage(1)
            fetchOrders(1, false)
        }, 30000)

        return () => clearInterval(interval)
    }, [fetchOrders])

    const loadMore = () => {
        if (!loading && hasMore) {
            const nextPage = page + 1
            setPage(nextPage)
            fetchOrders(nextPage, true)
        }
    }

    const updateOrderStatus = async (id: string, status: string): Promise<boolean> => {
        try {
            const response = await fetch(`/api/admin/orders/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            })
            const data = await response.json()
            return data.success
        } catch {
            return false
        }
    }

    return { orders, loading, error, refetch: () => fetchOrders(1, false), updateOrderStatus, loadMore, hasMore }
}
