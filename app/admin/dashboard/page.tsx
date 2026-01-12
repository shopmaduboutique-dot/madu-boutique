"use client"

import { useAdminStats } from "@/lib/admin/hooks/use-admin-stats"
import DashboardStats from "@/components/admin/dashboard-stats"
import SalesChart from "@/components/admin/sales-chart"
import RecentOrdersTable from "@/components/admin/recent-orders-table"
import LowStockAlerts from "@/components/admin/low-stock-alerts"

export default function DashboardPage() {
    const { stats, recentOrders, loading, error } = useAdminStats()

    if (loading) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Welcome back! Here&apos;s what&apos;s happening today.</p>
                </div>

                {/* Loading skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-20 mb-3" />
                            <div className="h-8 bg-gray-200 rounded w-24 mb-2" />
                            <div className="h-3 bg-gray-100 rounded w-16" />
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-32 mb-4" />
                        <div className="h-[300px] bg-gray-100 rounded" />
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-32 mb-4" />
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-12 bg-gray-100 rounded" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
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
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1">Welcome back! Here&apos;s what&apos;s happening today.</p>
            </div>

            {/* Stats Cards */}
            {stats && (
                <DashboardStats
                    totalOrders={stats.totalOrders}
                    totalRevenue={stats.totalRevenue}
                    totalProducts={stats.totalProducts}
                    lowStockCount={stats.lowStockCount}
                    todaysOrders={stats.todaysOrders}
                    todaysRevenue={stats.todaysRevenue}
                />
            )}

            {/* Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Chart - takes 2 columns */}
                <div className="lg:col-span-2">
                    {stats && <SalesChart data={stats.salesData} />}
                </div>

                {/* Low Stock Alerts */}
                <div>
                    <LowStockAlerts />
                </div>
            </div>

            {/* Recent Orders */}
            <RecentOrdersTable orders={recentOrders} />
        </div>
    )
}
