"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import type { Product } from "@/lib/types"

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchProducts()
    }, [])

    async function fetchProducts() {
        try {
            const { data, error } = await supabase
                .from("products")
                .select("*")
                .order("created_at", { ascending: false })

            if (error) throw error
            const mappedProducts: Product[] = (data || []).map(p => ({
                id: p.id,
                name: p.name,
                price: p.price.toString(),
                originalPrice: p.original_price ? p.original_price.toString() : "",
                image: p.image || "",
                images: p.images || [],
                sizes: p.sizes || [],
                description: p.description || "",
                details: p.details || "",
                material: p.material || "",
                care: p.care || "",
                category: p.category as any, // Cast to generic or specific union
                isNew: p.is_new,
                inStock: p.in_stock
            }))
            setProducts(mappedProducts)
        } catch (error) {
            console.error("Error fetching products:", error)
        } finally {
            setIsLoading(false)
        }
    }

    async function handleDelete(id: number) {
        if (!confirm("Are you sure you want to delete this product?")) return

        try {
            const { error } = await supabase
                .from("products")
                .delete()
                .eq("id", id)

            if (error) throw error

            // Remove from state
            setProducts(products.filter(p => p.id !== id))
        } catch (error) {
            console.error("Error deleting product:", error)
            alert("Failed to delete product")
        }
    }

    if (isLoading) return <div>Loading products...</div>

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                <Link
                    href="/admin/products/new"
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                    Add Product
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-medium text-gray-500">Product</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Category</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Price</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Stock</th>
                            <th className="px-6 py-4 font-medium text-gray-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
                                            {product.image && (
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <span className="font-medium text-gray-900">{product.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600 capitalize">{product.category}</td>
                                <td className="px-6 py-4 text-gray-900">₹{Number(product.price).toLocaleString('en-IN')}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right flex justify-end gap-3">
                                    <Link
                                        href={`/admin/products/${product.id}/edit`}
                                        className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="text-red-600 hover:text-red-900 text-sm font-medium"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
