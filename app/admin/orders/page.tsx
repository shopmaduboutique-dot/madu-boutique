"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Order } from "@/lib/types"

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchOrders()

        // Real-time subscription
        const channel = supabase
            .channel('admin-orders')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'orders',
                },
                (payload) => {
                    console.log('Real-time update:', payload)
                    fetchOrders() // Refresh list on any change
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    async function fetchOrders() {
        try {
            const { data, error } = await supabase
                .from("orders")
                .select("*")
                .order("created_at", { ascending: false })

            if (error) throw error
            setOrders(data || [])
        } catch (error) {
            console.error("Error fetching orders:", error)
        } finally {
            setIsLoading(false)
        }
    }

    async function handleStatusUpdate(orderId: string, newStatus: string) {
        try {
            const { error } = await supabase
                .from("orders")
                .update({ status: newStatus })
                .eq("id", orderId)

            if (error) throw error

            // Optimistic update
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
        } catch (error) {
            console.error("Error updating status:", error)
            alert("Failed to update status")
        }
    }

    if (isLoading) return <div>Loading orders...</div>

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Live Orders</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-medium text-gray-500">Order ID</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Date</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Customer</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Amount</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Status</th>
                            <th className="px-6 py-4 font-medium text-gray-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-sm font-mono text-gray-600">
                                    #{order.order_number || order.id.slice(0, 8)}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {new Date(order.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{order.delivery_name}</div>
                                    <div className="text-xs text-gray-500">{order.delivery_city}</div>
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    ₹{order.total.toLocaleString('en-IN')}
                                </td>
                                <td className="px-6 py-4">
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                        className={`px-3 py-1 rounded-full text-xs font-semibold border-none cursor-pointer ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                                    order.status === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'
                                            }`}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => alert("Order details view coming soon!")}
                                        className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    No orders found yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
