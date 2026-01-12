"use client"

import Image from "next/image"
import Link from "next/link"
import { Package } from "lucide-react"

interface OrderItem {
    id: number
    product_id: number | null
    product_name: string
    product_price: number
    size: string
    quantity: number
    line_total: number
}

interface OrderItemsListProps {
    items: OrderItem[]
}

export default function OrderItemsList({ items }: OrderItemsListProps) {
    if (items.length === 0) {
        return (
            <div className="text-center py-8">
                <Package className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No items in this order</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {items.map((item) => (
                <div
                    key={item.id}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                >
                    {/* Product Image Placeholder */}
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="w-6 h-6 text-gray-400" />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{item.product_name}</h4>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                            {item.size && (
                                <span className="px-2 py-0.5 bg-white border border-gray-200 rounded">
                                    Size: {item.size}
                                </span>
                            )}
                            <span>Qty: {item.quantity}</span>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                        <p className="font-medium text-gray-900">
                            ₹{Number(item.line_total).toLocaleString("en-IN")}
                        </p>
                        <p className="text-sm text-gray-500">
                            ₹{Number(item.product_price).toLocaleString("en-IN")} × {item.quantity}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}
