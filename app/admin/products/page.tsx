"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Plus, Search, Edit2, Trash2, Package } from "lucide-react"
import { useAdminProducts, type Product } from "@/lib/admin/hooks/use-admin-products"
import { toast } from "sonner"

export default function ProductsPage() {
    const [search, setSearch] = useState("")
    const [category, setCategory] = useState("all")
    const [stock, setStock] = useState("all")
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

    const { products, loading, error, deleteProduct } = useAdminProducts({
        category,
        search,
        stock,
    })

    const handleDelete = async (id: number) => {
        const success = await deleteProduct(id)
        if (success) {
            toast.success("Product deleted successfully")
        } else {
            toast.error("Failed to delete product")
        }
        setDeleteConfirm(null)
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="text-orange-600 font-medium hover:text-orange-700"
                >
                    Try again
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-500 mt-1">Manage your product catalog</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add Product
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>

                    {/* Category Filter */}
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                        <option value="all">All Categories</option>
                        <option value="saree">Sarees</option>
                        <option value="chudithar">Chudithars</option>
                    </select>

                    {/* Stock Filter */}
                    <select
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                        <option value="all">All Stock</option>
                        <option value="in">In Stock</option>
                        <option value="out">Out of Stock</option>
                        <option value="low">Low Stock</option>
                    </select>
                </div>
            </div>

            {/* Products Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
                            <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                            <div className="h-3 bg-gray-100 rounded w-1/2" />
                        </div>
                    ))}
                </div>
            ) : products.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-500 mb-4">
                        {search || category !== "all" || stock !== "all"
                            ? "Try adjusting your filters"
                            : "Get started by adding your first product"}
                    </p>
                    <Link
                        href="/admin/products/new"
                        className="inline-flex items-center gap-2 text-orange-600 font-medium hover:text-orange-700"
                    >
                        <Plus className="w-4 h-4" />
                        Add Product
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onDelete={() => setDeleteConfirm(product.id)}
                        />
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Product?</h3>
                        <p className="text-gray-500 mb-6">
                            This action cannot be undone. The product will be permanently removed.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="flex-1 px-4 py-2.5 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function ProductCard({ product, onDelete }: { product: Product; onDelete: () => void }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
            {/* Image */}
            <div className="relative aspect-square bg-gray-100">
                {product.image ? (
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Package className="w-12 h-12 text-gray-300" />
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.is_new && (
                        <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-medium rounded-full">
                            New
                        </span>
                    )}
                    {!product.in_stock && (
                        <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-medium rounded-full">
                            Out of Stock
                        </span>
                    )}
                    {product.in_stock && product.stock_quantity < 5 && (
                        <span className="px-2 py-0.5 bg-orange-500 text-white text-xs font-medium rounded-full">
                            Low: {product.stock_quantity}
                        </span>
                    )}
                </div>

                {/* Actions */}
                <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
                    >
                        <Edit2 className="w-4 h-4 text-gray-600" />
                    </Link>
                    <button
                        onClick={onDelete}
                        className="p-2 bg-white rounded-lg shadow-md hover:bg-red-50 transition-colors"
                    >
                        <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="p-4">
                <p className="text-xs text-gray-500 capitalize mb-1">{product.category}</p>
                <h3 className="font-medium text-gray-900 truncate mb-2">{product.name}</h3>
                <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-gray-900">₹{product.price.toLocaleString("en-IN")}</span>
                    {product.original_price && (
                        <span className="text-sm text-gray-400 line-through">
                            ₹{product.original_price.toLocaleString("en-IN")}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}
