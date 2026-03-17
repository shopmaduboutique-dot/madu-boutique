"use client"

import { useState, useEffect, use } from "react"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import ProductCard from "@/components/product-card"
import Link from "next/link"
import type { Product } from "@/lib/types"

interface CategoryPageProps {
    params: Promise<{ slug: string }>
}

export default function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = use(params)
    const [products, setProducts] = useState<Product[]>([])
    const [categoryName, setCategoryName] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            setError(null)

            try {
                // Fetch categories to validate and get name
                const catRes = await fetch("/api/categories")
                const catData = await catRes.json()
                
                if (!catData.success) throw new Error("Failed to load categories")
                
                const category = catData.data.find((c: any) => c.slug === slug)
                if (!category) {
                    setError("Category not found")
                    setLoading(false)
                    return
                }

                setCategoryName(category.name)

                // Fetch products
                const prodRes = await fetch(`/api/products?category=${slug}`)
                const prodData = await prodRes.json()

                if (prodData.success) {
                    setProducts(prodData.data)
                } else {
                    setError("Failed to load products")
                }
            } catch (err) {
                setError("Failed to load data")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [slug])

    if (error === "Category not found") {
        return (
            <>
                <Navbar />
                <main className="min-h-screen bg-white flex items-center justify-center">
                    <div className="text-center p-8">
                        <h1 className="text-2xl font-bold text-black mb-4">Category not found</h1>
                        <Link href="/" className="text-orange-600 font-bold hover:text-orange-700">
                            Back to Home
                        </Link>
                    </div>
                </main>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-white">
                {/* Category Hero */}
                <section className="bg-gradient-to-b from-orange-50 to-white py-12 sm:py-16 px-4">
                    <div className="max-w-6xl mx-auto text-center">
                        <nav className="mb-4">
                            <ol className="flex items-center justify-center gap-2 text-sm">
                                <li>
                                    <Link href="/" className="text-gray-500 hover:text-orange-600">
                                        Home
                                    </Link>
                                </li>
                                <li className="text-gray-400">/</li>
                                <li className="text-orange-600 font-medium capitalize">{categoryName}</li>
                            </ol>
                        </nav>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4 capitalize">{categoryName}</h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">Explore our collection of {categoryName}.</p>
                        {!loading && !error && (
                            <p className="text-sm text-orange-600 font-medium mt-4">{products.length} Products</p>
                        )}
                    </div>
                </section>

                {/* Products */}
                <section className="w-full bg-white px-4 sm:px-6 py-10 sm:py-16">
                    <div className="max-w-6xl mx-auto">
                        {loading ? (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-gray-100 rounded-xl aspect-square animate-pulse" />
                                ))}
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <p className="text-red-500 mb-4">{error}</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="text-orange-600 font-medium hover:text-orange-700"
                                >
                                    Try again
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                {products.map((product, index) => (
                                    <ProductCard key={product.id} product={product} priority={index < 4} />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
