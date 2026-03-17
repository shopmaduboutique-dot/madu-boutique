"use client"

import { useState, useEffect, useCallback } from "react"
import ProductCard from "./product-card"
import type { Product } from "@/lib/types"

interface ProductGridProps {
  category: string
}

import { supabase } from "@/lib/supabase"

export default function ProductGrid({ category }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const fetchProducts = useCallback(async (pageNum: number, isLoadMore = false, signal?: AbortSignal, showLoading = false) => {
    if (showLoading && !isLoadMore) setLoading(true)
    if (isLoadMore) setLoadingMore(true)
    setError(null)

    try {
      const response = await fetch(`/api/products?category=${category}&page=${pageNum}&limit=6`, { signal })
      const data = await response.json()

      if (data.success) {
        if (isLoadMore) {
          setProducts(prev => [...prev, ...data.data])
        } else {
          setProducts(data.data)
        }
        setHasMore(pageNum < data.totalPages)
      } else {
        setError(data.error || "Failed to load products")
      }
    } catch (err: any) {
      if (err.name === 'AbortError' || err.message?.includes('aborted')) return
      console.error("Fetch error:", err)
      if (!isLoadMore) setError("Failed to load products")
    } finally {
      if (showLoading && !isLoadMore) setLoading(false)
      if (isLoadMore) setLoadingMore(false)
    }
  }, [category])

  useEffect(() => {
    const controller = new AbortController()

    setPage(1)
    // 1. Initial Fetch
    fetchProducts(1, false, controller.signal, true)

    // 2. Real-time Subscription
    // Subscribe to INSERT, UPDATE, DELETE events on the 'products' table
    const channel = supabase
      .channel('public:products')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'products',
        },
        (payload) => {
          console.log('Real-time change received:', payload)
          // Simple strategy: Re-fetch current page list to ensure consistency
          fetchProducts(page, false, controller.signal, false) 
        }
      )
      .subscribe()

    // 3. Cleanup
    return () => {
      controller.abort()
      supabase.removeChannel(channel)
    }
  }, [fetchProducts, page])

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchProducts(nextPage, true)
    }
  }

  if (loading) {
    return (
      <section className="w-full bg-white px-4 sm:px-6 py-10 sm:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 sm:mb-12">
            <h3 className="text-lg sm:text-xl font-bold text-black mb-2">
              {category === "saree" ? "Premium Sarees" : "Elegant Chudithars"}
            </h3>
            <p className="text-sm text-gray-600">Loading products...</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 rounded-xl aspect-square animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="w-full bg-white px-4 sm:px-6 py-10 sm:py-16">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-orange-600 font-medium hover:text-orange-700"
          >
            Try again
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full bg-white px-4 sm:px-6 py-10 sm:py-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 sm:mb-12">
          <h3 className="text-lg sm:text-xl font-bold text-black mb-2">
            {category === "saree" ? "Premium Sarees" : "Elegant Chudithars"}
          </h3>
          <p className="text-sm text-gray-600">{products.length} exclusive pieces</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 4} />
          ))}
        </div>

        {hasMore && (
          <div className="mt-8 sm:mt-12 text-center">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="px-8 py-3 bg-white border-2 border-orange-500 text-orange-600 font-bold rounded-lg hover:bg-orange-50 transition-all disabled:opacity-50"
            >
              {loadingMore ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
