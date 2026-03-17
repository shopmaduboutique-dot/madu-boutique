"use client"

import { useState, useEffect, useCallback } from "react"

export interface Category {
    id: number
    name: string
    slug: string
    created_at: string
}

export function useAdminCategories() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchCategories = useCallback(async () => {
        try {
            const response = await fetch("/api/admin/categories")
            const data = await response.json()

            if (data.success) {
                setCategories(data.data)
                setError(null)
            } else {
                setError(data.error || "Failed to fetch categories")
            }
        } catch (err) {
            console.error("Error fetching categories:", err)
            setError("Failed to fetch categories")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        setLoading(true)
        fetchCategories()
    }, [fetchCategories])

    const createCategory = async (name: string, slug: string) => {
        try {
            const response = await fetch("/api/admin/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, slug }),
            })
            const data = await response.json()
            if (data.success) {
                await fetchCategories() // Refresh the list
                return { success: true, data: data.data }
            }
            return { success: false, error: data.error }
        } catch (err) {
            return { success: false, error: "Failed to create category" }
        }
    }

    const deleteCategory = async (id: number) => {
        try {
            const response = await fetch(`/api/admin/categories/${id}`, {
                method: "DELETE",
            })
            const data = await response.json()
            if (data.success) {
                setCategories((prev) => prev.filter((c) => c.id !== id))
                return { success: true }
            }
            return { success: false, error: data.error }
        } catch (err) {
            return { success: false, error: "Failed to delete category" }
        }
    }

    return { categories, loading, error, refetch: fetchCategories, createCategory, deleteCategory }
}
