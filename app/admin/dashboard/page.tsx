"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
    })
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchStats() {
            try {
                const { count: productCount } = await supabase
                    .from("products")
                    .select("*", { count: "exact", head: true })

                const { data: orders } = await supabase
                    .from("orders")
                    .select("total")

                const totalRevenue = orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0
                const orderCount = orders?.length || 0

                setStats({
                    totalProducts: productCount || 0,
                    totalOrders: orderCount,
                    totalRevenue: totalRevenue,
                })
            } catch (error) {
                console.error("Error fetching stats:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchStats()
    }, [])

    if (isLoading) {
        return <div>Loading stats...</div>
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                        ₹{stats.totalRevenue.toLocaleString('en-IN')}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-500">Total Orders</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-500">Total Products</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProducts}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="flex gap-4">
                        <Link href="/admin/products/new" className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                            Add New Product
                        </Link>
                        <Link href="/admin/products" className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                            Manage Products
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
