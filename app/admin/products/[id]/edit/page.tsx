"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import ProductForm from "@/components/admin/product-form"

interface EditProductPageProps {
    params: Promise<{ id: string }>
}

export default function EditProductPage({ params }: EditProductPageProps) {
    const { id } = use(params)
    const router = useRouter()
    const [product, setProduct] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/admin/products/${id}`)
                const data = await response.json()

                if (data.success) {
                    setProduct(data.data)
                } else {
                    setError(data.error || "Failed to load product")
                }
            } catch (err) {
                console.error("Error fetching product:", err)
                setError("Failed to load product")
            } finally {
                setLoading(false)
            }
        }

        fetchProduct()
    }, [id])

    if (loading) {
        return (
            <div className="space-y-6">
                <div>
                    <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                    <div className="h-8 w-48 bg-gray-200 rounded" />
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-12 bg-gray-100 rounded" />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (error || !product) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500 mb-4">{error || "Product not found"}</p>
                <button
                    onClick={() => router.push("/admin/products")}
                    className="text-orange-600 font-medium hover:text-orange-700"
                >
                    Back to Products
                </button>
            </div>
        )
    }

    // Transform product data for the form
    const initialData = {
        name: product.name,
        price: String(product.price),
        original_price: product.original_price ? String(product.original_price) : "",
        description: product.description || "",
        details: product.details || "",
        material: product.material || "",
        care: product.care || "",
        category: product.category,
        sizes: product.sizes || ["Free Size"],
        is_new: product.is_new || false,
        in_stock: product.in_stock ?? true,
        stock_quantity: String(product.stock_quantity || 0),
        images: product.images || (product.image ? [product.image] : []),
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Link
                    href="/admin/products"
                    className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-2"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Products
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
                <p className="text-gray-500 mt-1">Update product: {product.name}</p>
            </div>

            {/* Form */}
            <ProductForm mode="edit" productId={Number(id)} initialData={initialData} />
        </div>
    )
}
