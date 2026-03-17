"use client"

import { useState, useEffect, useCallback } from "react"
import type { Category } from "@/lib/admin/hooks/use-admin-categories"

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchCategories = useCallback(async () => {
        try {
            const response = await fetch("/api/categories")
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

    return { categories, loading, error }
}
