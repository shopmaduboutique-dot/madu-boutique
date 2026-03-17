"use client"

import { useState, useEffect, useCallback } from "react"
import ProductCard from "./product-card"
import type { Product } from "@/lib/types"
import { supabase } from "@/lib/supabase"

interface ProductGridProps {
  category: string
}

export default function ProductGrid({ category }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [visibleIds, setVisibleIds] = useState<Set<string | number>>(new Set())

  const fetchProducts = useCallback(async (signal?: AbortSignal) => {
    setError(null)

    try {
      const response = await fetch(`/api/products?category=${category}`, { signal })
      const data = await response.json()

      if (data.success) {
        setProducts(data.data)
      } else {
        setError(data.error || "Failed to load products")
      }
    } catch (err: any) {
      if (err.name === "AbortError" || err.message?.includes("aborted")) return
      console.error("Fetch error:", err)
      setError("Failed to load products")
    } finally {
      setLoading(false)
    }
  }, [category])

  // Animate products in one by one as they appear
  useEffect(() => {
    products.forEach((product, index) => {
      setTimeout(() => {
        setVisibleIds(prev => new Set([...prev, product.id]))
      }, index * 80)
    })
  }, [products])

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setVisibleIds(new Set())
    fetchProducts(controller.signal)

    const channel = supabase
      .channel("public:products")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        () => {
          fetchProducts(controller.signal)
        }
      )
      .subscribe()

    return () => {
      controller.abort()
      supabase.removeChannel(channel)
    }
  }, [fetchProducts])

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
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
            <div
              key={product.id}
              style={{ transitionDelay: `${index * 60}ms` }}
              className={`transition-all duration-500 ease-out ${
                visibleIds.has(product.id)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              <ProductCard product={product} priority={index < 4} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
