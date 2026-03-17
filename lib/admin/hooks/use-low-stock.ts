"use client"

import { useState, useEffect, useCallback } from "react"

export interface LowStockProduct {
    id: number
    name: string
    stock_quantity: number
    category: string
    image: string | null
}

export function useLowStock(threshold: number = 5) {
    const [products, setProducts] = useState<LowStockProduct[]>([])
    const [loading, setLoading] = useState(true)

    const fetchLowStock = useCallback(async () => {
        try {
            const response = await fetch("/api/admin/products?stock=low")
            const data = await response.json()

            if (data.success) {
                // Filter and map low stock products
                const lowStockProducts = (data.data || [])
                    .filter((p: LowStockProduct) => p.stock_quantity < threshold)
                    .map((p: LowStockProduct) => ({
                        id: p.id,
                        name: p.name,
                        stock_quantity: p.stock_quantity,
                        category: p.category,
                        image: p.image
                    }))
                    .sort((a: LowStockProduct, b: LowStockProduct) => a.stock_quantity - b.stock_quantity)

                setProducts(lowStockProducts)
            }
        } catch (err) {
            console.error("Error fetching low stock products:", err)
        } finally {
            setLoading(false)
        }
    }, [threshold])

    useEffect(() => {
        fetchLowStock()

        // Poll for updates every 30 seconds
        const interval = setInterval(fetchLowStock, 30000)

        return () => clearInterval(interval)
    }, [fetchLowStock])

    return { products, loading, count: products.length }
}
