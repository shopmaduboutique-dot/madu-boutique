"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { useAuth } from "@/lib/auth-context"
import PhoneAuthModal from "@/components/phone-auth-modal"

interface OrderItem {
    id: number
    product_name: string
    product_price: number
    size: string | null
    quantity: number
    line_total: number
}

interface Order {
    id: string
    order_number: string
    status: string
    subtotal: number
    shipping_cost: number
    total: number
    delivery_name: string
    delivery_phone: string
    delivery_email: string | null
    delivery_address: string
    delivery_city: string
    delivery_state: string | null
    delivery_zip: string
    created_at: string
    order_items: OrderItem[]
}

function getStatusColor(status: string) {
    switch (status.toLowerCase()) {
        case "confirmed":
            return "bg-blue-100 text-blue-800"
        case "processing":
            return "bg-yellow-100 text-yellow-800"
        case "shipped":
            return "bg-purple-100 text-purple-800"
        case "delivered":
            return "bg-green-100 text-green-800"
        case "cancelled":
            return "bg-red-100 text-red-800"
        default:
            return "bg-gray-100 text-gray-800"
    }
}

function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })
}

export default function OrdersPage() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth()
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showAuthModal, setShowAuthModal] = useState(false)
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

    useEffect(() => {
        async function fetchOrders() {
            if (!isAuthenticated || !user) {
                setLoading(false)
                return
            }

            // Need at least email or phone to fetch orders
            if (!user.email && !user.phone) {
                setLoading(false)
                return
            }

            try {
                // Build query params - fetch by email AND/OR phone
                const params = new URLSearchParams()
                if (user.email) {
                    params.append("email", user.email)
                }
                if (user.phone) {
                    params.append("phone", user.phone)
                }

                const response = await fetch(`/api/orders?${params.toString()}`)
                const data = await response.json()

                if (data.success) {
                    setOrders(data.data || [])
                } else {
                    setError(data.error || "Failed to fetch orders")
                }
            } catch (err) {
                setError("Failed to fetch orders")
            } finally {
                setLoading(false)
            }
        }

        if (!authLoading) {
            fetchOrders()
        }
    }, [isAuthenticated, user, authLoading])

    // Show auth modal if not authenticated
    if (!authLoading && !isAuthenticated) {
        return (
            <>
                <Navbar />
                <main className="min-h-screen bg-gray-50 py-8 px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign in to view your orders</h1>
                            <p className="text-gray-600 mb-6">Please sign in to access your order history</p>
                            <button
                                onClick={() => setShowAuthModal(true)}
                                className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors"
                            >
                                Sign In / Sign Up
                            </button>
                        </div>
                    </div>
                </main>
                <Footer />
                <PhoneAuthModal
                    isOpen={showAuthModal}
                    onSuccess={() => setShowAuthModal(false)}
                />
            </>
        )
    }

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gray-50 py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
                        <p className="text-gray-600">Track and manage your orders</p>
                    </div>

                    {/* Loading State */}
                    {(loading || authLoading) && (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                                    <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                            <p className="text-red-600 font-medium">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-4 text-orange-600 font-medium hover:text-orange-700"
                            >
                                Try again
                            </button>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && !error && orders.length === 0 && (
                        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
                            <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
                            <Link
                                href="/"
                                className="inline-block px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    )}

                    {/* Orders List */}
                    {!loading && !error && orders.length > 0 && (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                    {/* Order Header */}
                                    <div
                                        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="font-mono text-sm text-gray-500">
                                                        {order.order_number}
                                                    </span>
                                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    {formatDate(order.created_at)}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-gray-900">₹{order.total.toLocaleString()}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {order.order_items?.length || 0} item(s)
                                                    </p>
                                                </div>
                                                <svg
                                                    className={`w-5 h-5 text-gray-400 transition-transform ${expandedOrder === order.id ? "rotate-180" : ""}`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Details (Expanded) */}
                                    {expandedOrder === order.id && (
                                        <div className="border-t border-gray-100 p-6 bg-gray-50">
                                            {/* Order Items */}
                                            <div className="mb-6">
                                                <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
                                                <div className="space-y-3">
                                                    {order.order_items?.map((item) => (
                                                        <div key={item.id} className="flex items-center justify-between bg-white rounded-xl p-4">
                                                            <div>
                                                                <p className="font-medium text-gray-900">{item.product_name}</p>
                                                                <p className="text-sm text-gray-500">
                                                                    {item.size && `Size: ${item.size} • `}Qty: {item.quantity}
                                                                </p>
                                                            </div>
                                                            <p className="font-semibold text-gray-900">
                                                                ₹{item.line_total.toLocaleString()}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Delivery Address */}
                                            <div className="mb-6">
                                                <h3 className="font-semibold text-gray-900 mb-2">Delivery Address</h3>
                                                <div className="bg-white rounded-xl p-4">
                                                    <p className="font-medium text-gray-900">{order.delivery_name}</p>
                                                    <p className="text-sm text-gray-600">{order.delivery_address}</p>
                                                    <p className="text-sm text-gray-600">
                                                        {order.delivery_city}{order.delivery_state && `, ${order.delivery_state}`} - {order.delivery_zip}
                                                    </p>
                                                    <p className="text-sm text-gray-600 mt-1">📞 {order.delivery_phone}</p>
                                                </div>
                                            </div>

                                            {/* Order Summary */}
                                            <div>
                                                <h3 className="font-semibold text-gray-900 mb-2">Payment Summary</h3>
                                                <div className="bg-white rounded-xl p-4 space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600">Subtotal</span>
                                                        <span className="text-gray-900">₹{order.subtotal.toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600">Shipping</span>
                                                        <span className="text-gray-900">₹{order.shipping_cost.toLocaleString()}</span>
                                                    </div>
                                                    <div className="border-t border-gray-100 pt-2 flex justify-between font-semibold">
                                                        <span className="text-gray-900">Total</span>
                                                        <span className="text-orange-600">₹{order.total.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    )
}
