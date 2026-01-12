"use client"

import Link from "next/link"
import { Clock, Eye } from "lucide-react"

interface Order {
    id: string
    order_number: string
    delivery_name: string
    total: number
    status: string
    created_at: string
}

interface RecentOrdersTableProps {
    orders: Order[]
}

const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    processing: "bg-purple-100 text-purple-800",
    shipped: "bg-indigo-100 text-indigo-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
}

export default function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Today&apos;s Orders</h3>
                    <p className="text-sm text-gray-500">{orders.length} orders today</p>
                </div>
                <Link
                    href="/admin/orders"
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                >
                    View all
                    <span>→</span>
                </Link>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-8">
                    <Clock className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">No orders yet today</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">
                                    Order
                                </th>
                                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">
                                    Customer
                                </th>
                                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">
                                    Status
                                </th>
                                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">
                                    Amount
                                </th>
                                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">
                                    Time
                                </th>
                                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">

                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-3">
                                        <span className="font-mono text-sm text-gray-900">
                                            {order.order_number}
                                        </span>
                                    </td>
                                    <td className="py-3">
                                        <span className="text-sm text-gray-700">{order.delivery_name}</span>
                                    </td>
                                    <td className="py-3">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[order.status] || "bg-gray-100 text-gray-800"
                                                }`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="py-3 text-right">
                                        <span className="text-sm font-medium text-gray-900">
                                            ₹{Number(order.total).toLocaleString("en-IN")}
                                        </span>
                                    </td>
                                    <td className="py-3 text-right">
                                        <span className="text-sm text-gray-500">{formatTime(order.created_at)}</span>
                                    </td>
                                    <td className="py-3 text-right">
                                        <Link
                                            href={`/admin/orders/${order.id}`}
                                            className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors inline-flex"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
