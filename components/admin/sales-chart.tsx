"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface SalesChartProps {
    data: { date: string; revenue: number; orders: number }[]
}

export default function SalesChart({ data }: SalesChartProps) {
    // Format date for display
    const formattedData = data.map((item) => ({
        ...item,
        dateLabel: new Date(item.date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
        }),
    }))

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Sales Overview</h3>
                    <p className="text-sm text-gray-500">Last 30 days revenue</p>
                </div>
            </div>

            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                        <XAxis
                            dataKey="dateLabel"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#9ca3af", fontSize: 12 }}
                            interval={"preserveStartEnd"}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#9ca3af", fontSize: 12 }}
                            tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#fff",
                                border: "1px solid #e5e7eb",
                                borderRadius: "8px",
                                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                            }}
                            formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, "Revenue"]}
                            labelFormatter={(label) => label}
                        />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#f97316"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
