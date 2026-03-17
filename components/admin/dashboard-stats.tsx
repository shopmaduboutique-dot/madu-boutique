"use client"

import { ShoppingCart, DollarSign, Package, AlertTriangle } from "lucide-react"

interface DashboardStatsProps {
    totalOrders: number
    totalRevenue: number
    totalProducts: number
    lowStockCount: number
    todaysOrders: number
    todaysRevenue: number
}

export default function DashboardStats({
    totalOrders,
    totalRevenue,
    totalProducts,
    lowStockCount,
    todaysOrders,
    todaysRevenue,
}: DashboardStatsProps) {
    const statCards = [
        {
            title: "Total Orders",
            value: totalOrders.toLocaleString(),
            subtitle: `${todaysOrders} today`,
            icon: ShoppingCart,
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-50",
            textColor: "text-blue-600",
        },
        {
            title: "Total Revenue",
            value: `₹${totalRevenue.toLocaleString("en-IN")}`,
            subtitle: `₹${todaysRevenue.toLocaleString("en-IN")} today`,
            icon: DollarSign,
            color: "from-green-500 to-green-600",
            bgColor: "bg-green-50",
            textColor: "text-green-600",
        },
        {
            title: "Products",
            value: totalProducts.toLocaleString(),
            subtitle: "Active products",
            icon: Package,
            color: "from-purple-500 to-purple-600",
            bgColor: "bg-purple-50",
            textColor: "text-purple-600",
        },
        {
            title: "Low Stock",
            value: lowStockCount.toLocaleString(),
            subtitle: "Items need restock",
            icon: AlertTriangle,
            color: "from-orange-500 to-orange-600",
            bgColor: "bg-orange-50",
            textColor: "text-orange-600",
            isWarning: lowStockCount > 0,
        },
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {statCards.map((stat) => (
                <div
                    key={stat.title}
                    className={`bg-white rounded-xl border ${stat.isWarning ? "border-orange-200" : "border-gray-200"
                        } p-5 hover:shadow-md transition-shadow`}
                >
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                            <p className="text-xs text-gray-400 mt-1">{stat.subtitle}</p>
                        </div>
                        <div className={`${stat.bgColor} p-3 rounded-xl`}>
                            <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
