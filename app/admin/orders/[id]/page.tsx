"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, MapPin, Phone, Mail, Package, Truck } from "lucide-react"
import OrderStatusUpdater from "@/components/admin/order-status-updater"
import OrderItemsList from "@/components/admin/order-items-list"
import { toast } from "sonner"

interface OrderDetailPageProps {
    params: Promise<{ id: string }>
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
    const { id } = use(params)
    const router = useRouter()
    const [order, setOrder] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [trackingNumber, setTrackingNumber] = useState("")
    const [savingTracking, setSavingTracking] = useState(false)

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await fetch(`/api/admin/orders/${id}`)
                const data = await response.json()

                if (data.success) {
                    setOrder(data.data)
                    setTrackingNumber(data.data.tracking_number || "")
                } else {
                    setError(data.error || "Failed to load order")
                }
            } catch (err) {
                console.error("Error fetching order:", err)
                setError("Failed to load order")
            } finally {
                setLoading(false)
            }
        }

        fetchOrder()
    }, [id])

    const handleSaveTracking = async () => {
        setSavingTracking(true)

        try {
            const response = await fetch(`/api/admin/orders/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tracking_number: trackingNumber }),
            })

            const data = await response.json()

            if (data.success) {
                toast.success("Tracking number saved")
            } else {
                toast.error(data.error || "Failed to save tracking number")
            }
        } catch (error) {
            console.error("Error saving tracking:", error)
            toast.error("Failed to save tracking number")
        } finally {
            setSavingTracking(false)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-8 w-48 bg-gray-200 rounded" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-20 bg-gray-100 rounded" />
                            ))}
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-12 bg-gray-100 rounded" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (error || !order) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500 mb-4">{error || "Order not found"}</p>
                <button
                    onClick={() => router.push("/admin/orders")}
                    className="text-orange-600 font-medium hover:text-orange-700"
                >
                    Back to Orders
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Link
                    href="/admin/orders"
                    className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-2"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Orders
                </Link>
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-gray-900">{order.order_number}</h1>
                </div>
                <p className="text-gray-500 mt-1">{formatDate(order.created_at)}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Package className="w-5 h-5 text-gray-400" />
                            <h3 className="text-lg font-semibold text-gray-900">Order Items</h3>
                        </div>
                        <OrderItemsList items={order.order_items || []} />
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{Number(order.subtotal).toLocaleString("en-IN")}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span>₹{Number(order.shipping_cost).toLocaleString("en-IN")}</span>
                            </div>
                            <div className="flex justify-between font-semibold text-gray-900 text-base pt-2 border-t border-gray-200">
                                <span>Total</span>
                                <span>₹{Number(order.total).toLocaleString("en-IN")}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Status */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <OrderStatusUpdater
                            orderId={order.id}
                            currentStatus={order.status}
                            onUpdate={(newStatus) => setOrder({ ...order, status: newStatus })}
                        />
                    </div>

                    {/* Tracking */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Truck className="w-5 h-5 text-gray-400" />
                            <h3 className="font-semibold text-gray-900">Tracking</h3>
                        </div>
                        <div className="space-y-3">
                            <input
                                type="text"
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value)}
                                placeholder="Enter tracking number"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                            <button
                                onClick={handleSaveTracking}
                                disabled={savingTracking}
                                className="w-full px-4 py-2.5 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
                            >
                                {savingTracking ? "Saving..." : "Save Tracking"}
                            </button>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Customer Details</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-gray-600 font-medium">
                                        {order.delivery_name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{order.delivery_name}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-gray-600">
                                <Phone className="w-4 h-4" />
                                <span>{order.delivery_phone}</span>
                            </div>

                            {order.delivery_email && (
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Mail className="w-4 h-4" />
                                    <span>{order.delivery_email}</span>
                                </div>
                            )}

                            <div className="flex items-start gap-3 text-gray-600 pt-2 border-t border-gray-100">
                                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p>{order.delivery_address}</p>
                                    <p>
                                        {order.delivery_city}
                                        {order.delivery_state && `, ${order.delivery_state}`}
                                    </p>
                                    <p>{order.delivery_zip}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
