"use client"

import Link from "next/link"
import { AlertTriangle, Package } from "lucide-react"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

interface LowStockProduct {
    id: number
    name: string
    stock_quantity: number
    category: string
}

export default function LowStockAlerts() {
    const [products, setProducts] = useState<LowStockProduct[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchLowStock = async () => {
            const { data, error } = await supabase
                .from("products")
                .select("id, name, stock_quantity, category")
                .lt("stock_quantity", 5)
                .eq("in_stock", true)
                .order("stock_quantity", { ascending: true })
                .limit(5)

            if (!error && data) {
                setProducts(data)
            }
            setLoading(false)
        }

        fetchLowStock()

        // Subscribe to product changes
        const channel = supabase
            .channel("low-stock-alerts")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "products" },
                () => fetchLowStock()
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-32 mb-4" />
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-12 bg-gray-100 rounded" />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <h3 className="text-lg font-semibold text-gray-900">Low Stock Alerts</h3>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-6">
                    <Package className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 text-sm">All products are well stocked!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {products.map((product) => (
                        <Link
                            key={product.id}
                            href={`/admin/products/${product.id}/edit`}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-orange-50 border border-transparent hover:border-orange-200 transition-all"
                        >
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                                <p className="text-xs text-gray-500 capitalize">{product.category}</p>
                            </div>
                            <div className="ml-3">
                                <span
                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${product.stock_quantity === 0
                                            ? "bg-red-100 text-red-700"
                                            : "bg-orange-100 text-orange-700"
                                        }`}
                                >
                                    {product.stock_quantity === 0 ? "Out of stock" : `${product.stock_quantity} left`}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {products.length > 0 && (
                <Link
                    href="/admin/products?stock=low"
                    className="block text-center text-sm text-orange-600 hover:text-orange-700 font-medium mt-4 pt-4 border-t border-gray-100"
                >
                    View all low stock items →
                </Link>
            )}
        </div>
    )
}
