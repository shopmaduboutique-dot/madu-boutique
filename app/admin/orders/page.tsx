"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Eye, ShoppingCart, ChevronRight } from "lucide-react"
import { useAdminOrders, type Order } from "@/lib/admin/hooks/use-admin-orders"

const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    processing: "bg-purple-100 text-purple-800",
    shipped: "bg-indigo-100 text-indigo-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
}

export default function OrdersPage() {
    const [search, setSearch] = useState("")
    const [status, setStatus] = useState("all")
    const [dateRange, setDateRange] = useState("all")

    const { orders, loading, error } = useAdminOrders({
        status,
        search,
        dateRange,
    })

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const formatDateShort = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
        })
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
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                <p className="text-gray-500 mt-1">Manage customer orders</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by order # or customer..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                        />
                    </div>

                    {/* Date Filter */}
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    >
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">Last 7 Days</option>
                        <option value="month">Last 30 Days</option>
                    </select>

                    {/* Status Filter */}
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Orders Content */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-6">
                        <div className="animate-pulse space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="h-16 bg-gray-100 rounded" />
                            ))}
                        </div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="p-12 text-center">
                        <ShoppingCart className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
                        <p className="text-gray-500">
                            {search || status !== "all" || dateRange !== "all"
                                ? "Try adjusting your filters"
                                : "Orders will appear here when customers make purchases"}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Mobile Card View */}
                        <div className="lg:hidden divide-y divide-gray-100">
                            {orders.map((order) => (
                                <Link
                                    key={order.id}
                                    href={`/admin/orders/${order.id}`}
                                    className="block p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-mono text-sm font-medium text-gray-900">
                                            {order.order_number}
                                        </span>
                                        <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[order.status] || "bg-gray-100 text-gray-800"
                                                }`}
                                        >
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-900">{order.delivery_name}</p>
                                            <p className="text-xs text-gray-500">
                                                {order.order_items?.length || 0} item(s) • {formatDateShort(order.created_at)}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-gray-900">
                                                ₹{Number(order.total).toLocaleString("en-IN")}
                                            </span>
                                            <ChevronRight className="w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                                            Order
                                        </th>
                                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                                            Customer
                                        </th>
                                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                                            Items
                                        </th>
                                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                                            Status
                                        </th>
                                        <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                                            Total
                                        </th>
                                        <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                                            Date
                                        </th>
                                        <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">

                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-sm text-gray-900">
                                                    {order.order_number}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {order.delivery_name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{order.delivery_city}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-600">
                                                    {order.order_items?.length || 0} item(s)
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[order.status] || "bg-gray-100 text-gray-800"
                                                        }`}
                                                >
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="text-sm font-medium text-gray-900">
                                                    ₹{Number(order.total).toLocaleString("en-IN")}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="text-sm text-gray-500">{formatDate(order.created_at)}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                    className="inline-flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 font-medium"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
