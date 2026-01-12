"use client"

import { useState, useEffect, useCallback } from "react"

export interface Product {
    id: number
    name: string
    price: number
    original_price: number | null
    image: string | null
    images: string[]
    sizes: string[]
    description: string
    details: string
    material: string
    care: string
    category: "saree" | "chudithar"
    is_new: boolean
    in_stock: boolean
    stock_quantity: number
    created_at: string
}

interface UseAdminProductsOptions {
    category?: string
    search?: string
    stock?: string
}

export function useAdminProducts(options: UseAdminProductsOptions = {}) {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchProducts = useCallback(async () => {
        try {
            const params = new URLSearchParams()
            if (options.category && options.category !== "all") {
                params.set("category", options.category)
            }
            if (options.search) {
                params.set("search", options.search)
            }
            if (options.stock && options.stock !== "all") {
                params.set("stock", options.stock)
            }

            const response = await fetch(`/api/admin/products?${params.toString()}`)
            const data = await response.json()

            if (data.success) {
                setProducts(data.data)
                setError(null)
            } else {
                setError(data.error || "Failed to fetch products")
            }
        } catch (err) {
            console.error("Error fetching products:", err)
            setError("Failed to fetch products")
        } finally {
            setLoading(false)
        }
    }, [options.category, options.search, options.stock])

    useEffect(() => {
        setLoading(true)
        fetchProducts()

        // Poll for updates every 30 seconds
        const interval = setInterval(fetchProducts, 30000)

        return () => clearInterval(interval)
    }, [fetchProducts])

    const deleteProduct = async (id: number): Promise<boolean> => {
        try {
            const response = await fetch(`/api/admin/products/${id}`, {
                method: "DELETE",
            })
            const data = await response.json()

            if (data.success) {
                setProducts((prev) => prev.filter((p) => p.id !== id))
                return true
            }
            return false
        } catch {
            return false
        }
    }

    return { products, loading, error, refetch: fetchProducts, deleteProduct }
}
