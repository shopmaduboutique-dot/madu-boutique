"use client"

import { useState } from "react"
import { toast } from "sonner"

interface OrderStatusUpdaterProps {
    orderId: string
    currentStatus: string
    onUpdate?: (newStatus: string) => void
}

const statuses = [
    { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
    { value: "confirmed", label: "Confirmed", color: "bg-blue-100 text-blue-800" },
    { value: "processing", label: "Processing", color: "bg-purple-100 text-purple-800" },
    { value: "shipped", label: "Shipped", color: "bg-indigo-100 text-indigo-800" },
    { value: "delivered", label: "Delivered", color: "bg-green-100 text-green-800" },
    { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
]

export default function OrderStatusUpdater({ orderId, currentStatus, onUpdate }: OrderStatusUpdaterProps) {
    const [status, setStatus] = useState(currentStatus)
    const [loading, setLoading] = useState(false)

    const handleStatusChange = async (newStatus: string) => {
        if (newStatus === status) return

        setLoading(true)

        try {
            const response = await fetch(`/api/admin/orders/${orderId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            })

            const data = await response.json()

            if (data.success) {
                setStatus(newStatus)
                toast.success(`Order status updated to ${newStatus}`)
                onUpdate?.(newStatus)
            } else {
                toast.error(data.error || "Failed to update status")
            }
        } catch (error) {
            console.error("Error updating status:", error)
            toast.error("Failed to update status")
        } finally {
            setLoading(false)
        }
    }

    const currentStatusData = statuses.find((s) => s.value === status)

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Order Status</label>
            <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={loading}
                className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 ${loading ? "cursor-wait" : ""
                    }`}
            >
                {statuses.map((s) => (
                    <option key={s.value} value={s.value}>
                        {s.label}
                    </option>
                ))}
            </select>
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Current:</span>
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${currentStatusData?.color || "bg-gray-100 text-gray-800"
                        }`}
                >
                    {currentStatusData?.label || status}
                </span>
            </div>
        </div>
    )
}
